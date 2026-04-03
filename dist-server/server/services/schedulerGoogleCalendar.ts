/**
 * Scheduler ↔ Google Calendar Integration
 * 
 * Provides helper functions for the Scheduler system to:
 * 1. Create Google Calendar events when bookings are confirmed
 * 2. Delete/cancel Google Calendar events when bookings are cancelled
 * 3. Fetch busy times from Google Calendar for availability checking
 * 
 * Uses OAuth tokens stored in calendar_sync_settings (set via Google OAuth flow).
 */

import { google } from 'googleapis';
import { db } from '../db';
import { calendarSyncSettings } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// ---------- Types ----------

interface BookingEventData {
  summary: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  clientEmail?: string;
  clientName?: string;
}

interface BusySlot {
  start: Date;
  end: Date;
}

// ---------- OAuth2 Client Factory ----------

// Consistent redirect URI across all Google OAuth interactions
function getRedirectUri(): string {
  // Must match exactly what is configured in Google Cloud Console
  const base = process.env.APP_URL || process.env.BASE_URL || 'http://localhost:3001';
  return `${base}/api/auth/google/callback`;
}

/**
 * Get an authenticated Google Calendar API client using stored OAuth tokens.
 * Returns null if no sync config is found or tokens are missing.
 */
async function getCalendarClient(): Promise<{ calendar: any; calendarId: string } | null> {
  try {
    // Find any active sync config with tokens
    const configs = await db
      .select()
      .from(calendarSyncSettings)
      .where(eq(calendarSyncSettings.syncEnabled, true))
      .limit(1);

    if (configs.length === 0) {
      console.error('[Scheduler-GCal] ❌ CRITICAL: No active calendar sync settings found. Google Calendar sync is disabled.');
      return null;
    }

    const config = configs[0];

    if (!config.accessToken || !config.refreshToken) {
      console.error('[Scheduler-GCal] ❌ CRITICAL: OAuth tokens missing in calendar sync settings. Please reconnect Google Calendar.');
      return null;
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      getRedirectUri()
    );

    oauth2Client.setCredentials({
      access_token: config.accessToken,
      refresh_token: config.refreshToken,
    });

    // Handle token refresh - update stored tokens when they're refreshed
    oauth2Client.on('tokens', async (tokens: any) => {
      try {
        const updates: any = { updatedAt: new Date() };
        if (tokens.access_token) updates.accessToken = tokens.access_token;
        if (tokens.refresh_token) updates.refreshToken = tokens.refresh_token;
        await db
          .update(calendarSyncSettings)
          .set(updates)
          .where(eq(calendarSyncSettings.id, config.id));
        console.log('[Scheduler-GCal] ✅ Refreshed OAuth tokens saved to DB');
      } catch (err) {
        console.error('[Scheduler-GCal] ❌ Failed to save refreshed tokens:', err);
      }
    });

    // Force a token refresh to ensure we have a valid access token
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      // Persist refreshed tokens
      const updates: any = { updatedAt: new Date() };
      if (credentials.access_token) updates.accessToken = credentials.access_token;
      if (credentials.refresh_token) updates.refreshToken = credentials.refresh_token;
      await db
        .update(calendarSyncSettings)
        .set(updates)
        .where(eq(calendarSyncSettings.id, config.id));
    } catch (refreshErr: any) {
      console.warn('[Scheduler-GCal] Token refresh attempt failed, proceeding with existing token:', refreshErr.message);
      // Continue with existing token - it may still be valid
    }

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const calendarId = config.calendarId || 'primary';

    return { calendar, calendarId };
  } catch (error) {
    console.error('[Scheduler-GCal] ❌ Error getting calendar client:', error);
    return null;
  }
}

// ---------- Public API ----------

/**
 * Create a Google Calendar event for a confirmed scheduler booking.
 * Returns the Google Calendar event ID, or null if creation failed/unavailable.
 * Includes retry logic for transient failures.
 */
export async function createGoogleCalendarEvent(data: BookingEventData): Promise<string | null> {
  const MAX_RETRIES = 2;
  
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const client = await getCalendarClient();
    if (!client) {
      console.error('[Scheduler-GCal] ❌ No calendar client available - cannot sync to Google Calendar');
      return null;
    }

    try {
      const event: any = {
        summary: data.summary,
        description: data.description || '',
        location: data.location || '',
        start: {
          dateTime: data.startTime.toISOString(),
          timeZone: 'Europe/Vienna',
        },
        end: {
          dateTime: data.endTime.toISOString(),
          timeZone: 'Europe/Vienna',
        },
        // Color: Sage (2) for scheduler bookings
        colorId: '2',
        // Add source to identify scheduler-created events
        source: {
          title: 'New Age Fotografie Scheduler',
          url: process.env.APP_URL || process.env.BASE_URL || 'https://www.newagefotografie.com',
        },
      };

      // Add client as attendee if email is available
      if (data.clientEmail) {
        event.attendees = [{
          email: data.clientEmail,
          displayName: data.clientName || '',
        }];
        // Send notification to attendee
        event.sendUpdates = 'all';
      }

      const response = await client.calendar.events.insert({
        calendarId: client.calendarId,
        resource: event,
        sendUpdates: data.clientEmail ? 'all' : 'none',
      });

      const eventId = response.data.id;
      console.log(`[Scheduler-GCal] ✅ Created event ${eventId} for "${data.summary}" (attempt ${attempt + 1})`);
      return eventId;
    } catch (error: any) {
      const status = error.code || error.status || error.response?.status;
      console.error(`[Scheduler-GCal] ❌ Failed to create event (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, error.message, `status=${status}`);
      
      // Only retry on auth errors (401/403) or server errors (5xx) - not on client errors (4xx)
      if (attempt < MAX_RETRIES && (status === 401 || status === 403 || status >= 500)) {
        console.log('[Scheduler-GCal] Retrying after token refresh...');
        continue;
      }
      return null;
    }
  }
  return null;
}

/**
 * Delete (cancel) a Google Calendar event.
 * Used when a booking is cancelled.
 */
export async function deleteGoogleCalendarEvent(googleEventId: string): Promise<boolean> {
  const client = await getCalendarClient();
  if (!client) return false;

  try {
    await client.calendar.events.delete({
      calendarId: client.calendarId,
      eventId: googleEventId,
      sendUpdates: 'all', // Notify attendees of cancellation
    });

    console.log(`[Scheduler-GCal] ✅ Deleted event ${googleEventId}`);
    return true;
  } catch (error: any) {
    // If event already deleted (404), consider it success
    if (error.code === 404 || error.status === 404) {
      console.log(`[Scheduler-GCal] Event ${googleEventId} already deleted`);
      return true;
    }
    console.error('[Scheduler-GCal] ❌ Failed to delete event:', error.message);
    return false;
  }
}

/**
 * Update a Google Calendar event (e.g. when booking details change).
 */
export async function updateGoogleCalendarEvent(
  googleEventId: string,
  data: Partial<BookingEventData>
): Promise<boolean> {
  const client = await getCalendarClient();
  if (!client) return false;

  try {
    const updates: any = {};
    if (data.summary) updates.summary = data.summary;
    if (data.description !== undefined) updates.description = data.description;
    if (data.location !== undefined) updates.location = data.location;
    if (data.startTime) {
      updates.start = { dateTime: data.startTime.toISOString(), timeZone: 'Europe/Vienna' };
    }
    if (data.endTime) {
      updates.end = { dateTime: data.endTime.toISOString(), timeZone: 'Europe/Vienna' };
    }

    await client.calendar.events.patch({
      calendarId: client.calendarId,
      eventId: googleEventId,
      resource: updates,
      sendUpdates: 'all',
    });

    console.log(`[Scheduler-GCal] ✅ Updated event ${googleEventId}`);
    return true;
  } catch (error: any) {
    console.error('[Scheduler-GCal] ❌ Failed to update event:', error.message);
    return false;
  }
}

/**
 * Fetch busy times from Google Calendar for a given date range.
 * Returns an array of { start, end } intervals representing busy slots.
 * This is used to prevent double-bookings against external calendar events.
 */
export async function getGoogleCalendarBusyTimes(
  startDate: Date,
  endDate: Date
): Promise<BusySlot[]> {
  const client = await getCalendarClient();
  if (!client) {
    console.warn('[Scheduler-GCal] ⚠️ No calendar client available - Google Calendar events will NOT block scheduler slots');
    return [];
  }

  try {
    // Use the FreeBusy API for efficient busy-time lookup
    const response = await client.calendar.freebusy.query({
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        timeZone: 'Europe/Vienna',
        items: [{ id: client.calendarId }],
      },
    });

    const busySlots: BusySlot[] = [];
    const calendarBusy = response.data.calendars?.[client.calendarId]?.busy || [];

    for (const slot of calendarBusy) {
      if (slot.start && slot.end) {
        busySlots.push({
          start: new Date(slot.start),
          end: new Date(slot.end),
        });
      }
    }

    console.log(`[Scheduler-GCal] Fetched ${busySlots.length} busy slots for ${startDate.toISOString()} – ${endDate.toISOString()}`);
    return busySlots;
  } catch (error: any) {
    const errMsg = error?.message || '';
    // Detect token expiry specifically
    if (errMsg.includes('invalid_grant') || errMsg.includes('Token has been expired') || errMsg.includes('Token has been revoked')) {
      console.error('[Scheduler-GCal] ❌ CRITICAL: Google OAuth tokens EXPIRED - scheduler CANNOT check Google Calendar for conflicts! User must re-authorize in Calendar Sync settings.');
    } else {
      console.error('[Scheduler-GCal] ❌ Failed to fetch busy times:', errMsg);
    }
    // Fall back to events list API if FreeBusy fails
    try {
      const eventsResponse = await client.calendar.events.list({
        calendarId: client.calendarId,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 500,
      });

      const busySlots: BusySlot[] = [];
      for (const event of eventsResponse.data.items || []) {
        // Skip transparent (free) events
        if (event.transparency === 'transparent') continue;
        // Skip all-day events — they typically don't block time slots
        if (event.start?.date && !event.start?.dateTime) continue;

        const start = event.start?.dateTime ? new Date(event.start.dateTime) : null;
        const end = event.end?.dateTime ? new Date(event.end.dateTime) : null;

        if (start && end) {
          busySlots.push({ start, end });
        }
      }

      console.log(`[Scheduler-GCal] (fallback) Fetched ${busySlots.length} busy slots from events list`);
      return busySlots;
    } catch (fallbackError: any) {
      console.error('[Scheduler-GCal] ❌ Fallback events list also failed:', fallbackError.message);
      return [];
    }
  }
}

/**
 * Check if Google Calendar integration is connected and available.
 */
export async function isGoogleCalendarConnected(): Promise<boolean> {
  const client = await getCalendarClient();
  return client !== null;
}
