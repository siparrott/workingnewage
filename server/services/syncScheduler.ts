/**
 * Google Calendar Sync Scheduler
 * Runs background sync every 5 minutes
 */

import { db } from '../db';
import { calendarSyncSettings } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { createSyncServiceForUser } from './googleCalendarSyncService';

let syncInterval: NodeJS.Timeout | null = null;

/**
 * Start the background sync scheduler
 */
export function startSyncScheduler() {
  // Check if sync is enabled
  if (process.env.GOOGLE_SYNC_ENABLED !== 'true') {
    console.log('📅 Google Calendar sync is disabled (set GOOGLE_SYNC_ENABLED=true to enable)');
    return;
  }

  // Check if credentials are configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('📅 Google Calendar credentials not configured - skipping sync');
    return;
  }

  const intervalMs = parseInt(process.env.GOOGLE_SYNC_INTERVAL || '300000'); // Default 5 minutes

  console.log(`📅 Starting Google Calendar sync scheduler (every ${intervalMs / 1000}s)`);

  // Run initial sync after 10 seconds
  setTimeout(() => {
    performScheduledSync();
  }, 10000);

  // Then run every interval
  syncInterval = setInterval(() => {
    performScheduledSync();
  }, intervalMs);
}

/**
 * Stop the sync scheduler
 */
export function stopSyncScheduler() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('📅 Google Calendar sync scheduler stopped');
  }
}

/**
 * Perform sync for all users with sync enabled
 */
async function performScheduledSync() {
  try {
    // Get all users with Google sync enabled
    const configs = await db
      .select()
      .from(calendarSyncSettings)
      .where(eq(calendarSyncSettings.syncEnabled, true));

    if (configs.length === 0) {
      console.log('📅 No users with sync enabled');
      return;
    }

    console.log(`📅 Running sync for ${configs.length} user(s)...`);

    for (const config of configs) {
      try {
        const syncService = await createSyncServiceForUser(config.userId);
        
        if (syncService) {
          const results = await syncService.performSync();
          
          // Update last sync time
          await db
            .update(calendarSyncSettings)
            .set({ lastSyncAt: new Date() })
            .where(eq(calendarSyncSettings.id, config.id));

          console.log(`✅ Synced user ${config.userId}: ${results.imported} imported, ${results.updated} updated`);
        }
      } catch (error: any) {
        console.error(`❌ Error syncing user ${config.userId}:`, error.message);
      }
    }

    console.log('📅 Scheduled sync complete');
  } catch (error: any) {
    console.error('❌ Scheduled sync failed:', error);
  }
}

/**
 * Manually trigger sync for a specific user
 */
export async function triggerManualSync(userId: string): Promise<{
  success: boolean;
  imported?: number;
  updated?: number;
  deleted?: number;
  errors?: string[];
}> {
  try {
    const syncService = await createSyncServiceForUser(userId);

    if (!syncService) {
      return {
        success: false,
        errors: ['Google Calendar not connected or sync not configured'],
      };
    }

    const results = await syncService.performSync();

    // Update last sync time
    await db
      .update(calendarSyncSettings)
      .set({ lastSyncAt: new Date() })
      .where(eq(calendarSyncSettings.userId, userId));

    return {
      success: results.success,
      imported: results.imported,
      updated: results.updated,
      deleted: results.deleted,
      errors: results.errors,
    };
  } catch (error: any) {
    console.error('Manual sync error:', error);
    return {
      success: false,
      errors: [error.message],
    };
  }
}
