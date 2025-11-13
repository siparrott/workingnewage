"use strict";
/**
 * Studio Calendar Service
 * Handles appointment scheduling and Google Calendar integration
 */
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const googleapis_1 = require("googleapis");
class StudioCalendarService {
    /**
     * Initialize Google Calendar integration
     */
    static async initializeGoogleCalendar() {
        try {
            // Get Google Calendar configuration from database
            const configs = await db_1.db
                .select()
                .from(schema_1.googleCalendarConfig)
                .where((0, drizzle_orm_1.eq)(schema_1.googleCalendarConfig.isActive, true))
                .limit(1);
            if (configs.length === 0) {
                console.log('📅 No Google Calendar configuration found');
                return false;
            }
            const config = configs[0];
            // Initialize Google Auth
            this.googleAuth = new googleapis_1.google.auth.OAuth2(config.clientId, config.clientSecret, 'urn:ietf:wg:oauth:2.0:oob' // For installed applications
            );
            if (config.accessToken && config.refreshToken) {
                this.googleAuth.setCredentials({
                    access_token: config.accessToken,
                    refresh_token: config.refreshToken,
                });
                this.calendar = googleapis_1.google.calendar({ version: 'v3', auth: this.googleAuth });
                console.log('✅ Google Calendar integration initialized');
                return true;
            }
            console.log('⚠️ Google Calendar credentials incomplete');
            return false;
        }
        catch (error) {
            console.error('❌ Google Calendar initialization failed:', error);
            return false;
        }
    }
    /**
     * Create a new appointment
     */
    static async createAppointment(options) {
        try {
            // Get client information
            const client = await db_1.db
                .select()
                .from(schema_1.crmClients)
                .where((0, drizzle_orm_1.eq)(schema_1.crmClients.id, options.clientId))
                .limit(1);
            if (client.length === 0) {
                throw new Error('Client not found');
            }
            const clientInfo = client[0];
            // Create appointment in database
            const newAppointment = await db_1.db
                .insert(schema_1.studioAppointments)
                .values({
                clientId: options.clientId,
                title: options.title,
                description: options.description,
                appointmentType: options.appointmentType,
                startDateTime: options.startDateTime,
                endDateTime: options.endDateTime,
                location: options.location || 'Studio',
                notes: options.notes,
                reminderDateTime: options.reminderDateTime,
            })
                .returning();
            const appointment = newAppointment[0];
            let googleEventId;
            // Sync to Google Calendar if enabled
            if (options.syncToGoogle && this.calendar) {
                try {
                    const googleEvent = await this.createGoogleCalendarEvent({
                        summary: `${options.title} - ${clientInfo.firstName} ${clientInfo.lastName}`,
                        description: options.description || `${options.appointmentType} with ${clientInfo.firstName} ${clientInfo.lastName}`,
                        start: {
                            dateTime: options.startDateTime.toISOString(),
                            timeZone: 'Europe/Vienna',
                        },
                        end: {
                            dateTime: options.endDateTime.toISOString(),
                            timeZone: 'Europe/Vienna',
                        },
                        location: options.location || 'Studio',
                        attendees: clientInfo.email ? [{
                                email: clientInfo.email,
                                displayName: `${clientInfo.firstName} ${clientInfo.lastName}`
                            }] : undefined,
                        reminders: {
                            useDefault: false,
                            overrides: options.reminderDateTime ? [{
                                    method: 'email',
                                    minutes: Math.round((options.startDateTime.getTime() - options.reminderDateTime.getTime()) / (1000 * 60))
                                }] : undefined,
                        },
                    });
                    if (googleEvent.id) {
                        googleEventId = googleEvent.id;
                        // Update appointment with Google Calendar event ID
                        await db_1.db
                            .update(schema_1.studioAppointments)
                            .set({ googleCalendarEventId: googleEventId })
                            .where((0, drizzle_orm_1.eq)(schema_1.studioAppointments.id, appointment.id));
                    }
                }
                catch (googleError) {
                    console.error('⚠️ Failed to sync to Google Calendar:', googleError);
                    // Don't fail the entire appointment creation if Google sync fails
                }
            }
            console.log(`✅ Appointment created: ${options.title} for ${clientInfo.firstName} ${clientInfo.lastName}`);
            return {
                success: true,
                appointmentId: appointment.id,
                googleEventId,
            };
        }
        catch (error) {
            console.error('❌ Failed to create appointment:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Update an existing appointment
     */
    static async updateAppointment(options) {
        try {
            // Get existing appointment
            const existing = await db_1.db
                .select()
                .from(schema_1.studioAppointments)
                .where((0, drizzle_orm_1.eq)(schema_1.studioAppointments.id, options.id))
                .limit(1);
            if (existing.length === 0) {
                throw new Error('Appointment not found');
            }
            const appointment = existing[0];
            // Update appointment in database
            const updateData = {
                updatedAt: new Date(),
            };
            if (options.title !== undefined)
                updateData.title = options.title;
            if (options.description !== undefined)
                updateData.description = options.description;
            if (options.appointmentType !== undefined)
                updateData.appointmentType = options.appointmentType;
            if (options.status !== undefined)
                updateData.status = options.status;
            if (options.startDateTime !== undefined)
                updateData.startDateTime = options.startDateTime;
            if (options.endDateTime !== undefined)
                updateData.endDateTime = options.endDateTime;
            if (options.location !== undefined)
                updateData.location = options.location;
            if (options.notes !== undefined)
                updateData.notes = options.notes;
            if (options.reminderDateTime !== undefined)
                updateData.reminderDateTime = options.reminderDateTime;
            await db_1.db
                .update(schema_1.studioAppointments)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema_1.studioAppointments.id, options.id));
            // Update Google Calendar event if it exists and sync is enabled
            if (options.syncToGoogle && appointment.googleCalendarEventId && this.calendar) {
                try {
                    // Get client information for updated event
                    const client = await db_1.db
                        .select()
                        .from(schema_1.crmClients)
                        .where((0, drizzle_orm_1.eq)(schema_1.crmClients.id, appointment.clientId))
                        .limit(1);
                    if (client.length > 0) {
                        const clientInfo = client[0];
                        await this.updateGoogleCalendarEvent(appointment.googleCalendarEventId, {
                            summary: `${options.title || appointment.title} - ${clientInfo.firstName} ${clientInfo.lastName}`,
                            description: options.description || appointment.description || `${options.appointmentType || appointment.appointmentType} with ${clientInfo.firstName} ${clientInfo.lastName}`,
                            start: {
                                dateTime: (options.startDateTime || appointment.startDateTime).toISOString(),
                                timeZone: 'Europe/Vienna',
                            },
                            end: {
                                dateTime: (options.endDateTime || appointment.endDateTime).toISOString(),
                                timeZone: 'Europe/Vienna',
                            },
                            location: options.location || appointment.location,
                        });
                    }
                }
                catch (googleError) {
                    console.error('⚠️ Failed to update Google Calendar event:', googleError);
                }
            }
            console.log(`✅ Appointment updated: ${options.id}`);
            return { success: true };
        }
        catch (error) {
            console.error('❌ Failed to update appointment:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Get appointments for a date range
     */
    static async getAppointments(startDate, endDate) {
        try {
            // Get studio appointments
            const appointments = await db_1.db
                .select({
                id: schema_1.studioAppointments.id,
                clientId: schema_1.studioAppointments.clientId,
                title: schema_1.studioAppointments.title,
                description: schema_1.studioAppointments.description,
                appointmentType: schema_1.studioAppointments.appointmentType,
                status: schema_1.studioAppointments.status,
                startDateTime: schema_1.studioAppointments.startDateTime,
                endDateTime: schema_1.studioAppointments.endDateTime,
                location: schema_1.studioAppointments.location,
                notes: schema_1.studioAppointments.notes,
                reminderSent: schema_1.studioAppointments.reminderSent,
                reminderDateTime: schema_1.studioAppointments.reminderDateTime,
                googleCalendarEventId: schema_1.studioAppointments.googleCalendarEventId,
                createdAt: schema_1.studioAppointments.createdAt,
                // Client information
                clientName: schema_1.crmClients.firstName,
                clientLastName: schema_1.crmClients.lastName,
                clientEmail: schema_1.crmClients.email,
                clientPhone: schema_1.crmClients.phone,
            })
                .from(schema_1.studioAppointments)
                .leftJoin(schema_1.crmClients, (0, drizzle_orm_1.eq)(schema_1.studioAppointments.clientId, schema_1.crmClients.id))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.studioAppointments.startDateTime, startDate), (0, drizzle_orm_1.lte)(schema_1.studioAppointments.startDateTime, endDate)))
                .orderBy(schema_1.studioAppointments.startDateTime);
            // Also get imported photography sessions and format them as appointments
            const { photographySessions } = await import('@shared/schema');
            const sessions = await db_1.db
                .select({
                id: photographySessions.id,
                clientId: photographySessions.clientId,
                title: photographySessions.title,
                description: photographySessions.description,
                appointmentType: photographySessions.sessionType,
                status: photographySessions.status,
                startDateTime: photographySessions.startTime,
                endDateTime: photographySessions.endTime,
                location: photographySessions.locationName,
                notes: photographySessions.notes,
                reminderSent: photographySessions.reminderSent,
                reminderDateTime: photographySessions.startTime, // Use start time as reminder placeholder
                googleCalendarEventId: photographySessions.icalUid,
                createdAt: photographySessions.createdAt,
                // Client information from session data
                clientName: photographySessions.clientName,
                clientLastName: photographySessions.clientEmail, // Use email as last name placeholder
                clientEmail: photographySessions.clientEmail,
                clientPhone: photographySessions.clientPhone,
            })
                .from(photographySessions)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(photographySessions.startTime, startDate), (0, drizzle_orm_1.lte)(photographySessions.startTime, endDate)))
                .orderBy(photographySessions.startTime);
            // Combine and sort all appointments/sessions
            const allAppointments = [...appointments, ...sessions].sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
            return allAppointments;
        }
        catch (error) {
            console.error('❌ Failed to get appointments:', error);
            return [];
        }
    }
    /**
     * Get appointments for a specific client
     */
    static async getClientAppointments(clientId) {
        try {
            const appointments = await db_1.db
                .select()
                .from(schema_1.studioAppointments)
                .where((0, drizzle_orm_1.eq)(schema_1.studioAppointments.clientId, clientId))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.studioAppointments.startDateTime));
            return appointments;
        }
        catch (error) {
            console.error('❌ Failed to get client appointments:', error);
            return [];
        }
    }
    /**
     * Delete an appointment
     */
    static async deleteAppointment(appointmentId) {
        try {
            // Get appointment to check for Google Calendar event
            const appointment = await db_1.db
                .select()
                .from(schema_1.studioAppointments)
                .where((0, drizzle_orm_1.eq)(schema_1.studioAppointments.id, appointmentId))
                .limit(1);
            if (appointment.length === 0) {
                throw new Error('Appointment not found');
            }
            // Delete from Google Calendar if event exists
            if (appointment[0].googleCalendarEventId && this.calendar) {
                try {
                    await this.deleteGoogleCalendarEvent(appointment[0].googleCalendarEventId);
                }
                catch (googleError) {
                    console.error('⚠️ Failed to delete Google Calendar event:', googleError);
                }
            }
            // Delete from database
            await db_1.db
                .delete(schema_1.studioAppointments)
                .where((0, drizzle_orm_1.eq)(schema_1.studioAppointments.id, appointmentId));
            console.log(`✅ Appointment deleted: ${appointmentId}`);
            return { success: true };
        }
        catch (error) {
            console.error('❌ Failed to delete appointment:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Create Google Calendar event
     */
    static async createGoogleCalendarEvent(event) {
        if (!this.calendar) {
            throw new Error('Google Calendar not initialized');
        }
        const response = await this.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });
        return response.data;
    }
    /**
     * Public wrapper to create a Google Calendar event. Ensures initialization.
     */
    static async createGoogleEventPublic(event) {
        if (!this.calendar) {
            const ok = await this.initializeGoogleCalendar();
            if (!ok)
                throw new Error('Google Calendar not configured');
        }
        return await this.createGoogleCalendarEvent(event);
    }
    /**
     * Update Google Calendar event
     */
    static async updateGoogleCalendarEvent(eventId, event) {
        if (!this.calendar) {
            throw new Error('Google Calendar not initialized');
        }
        const response = await this.calendar.events.update({
            calendarId: 'primary',
            eventId: eventId,
            resource: event,
        });
        return response.data;
    }
    /**
     * Delete Google Calendar event
     */
    static async deleteGoogleCalendarEvent(eventId) {
        if (!this.calendar) {
            throw new Error('Google Calendar not initialized');
        }
        await this.calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
        });
    }
}
StudioCalendarService.googleAuth = null;
StudioCalendarService.calendar = null;
exports.default = StudioCalendarService;
