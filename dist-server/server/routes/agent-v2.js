"use strict";
/**
 * Agent V2 Gateway - Modern ToolBus Architecture
 *
 * This route replaces the legacy agent system with:
 * - Zod-validated tools
 * - Scope-based authorization
 * - Mode enforcement (read_only/auto_safe/auto_full)
 * - Full audit logging
 * - Shadow mode support
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = require("crypto");
const db_1 = require("../db");
const schema_1 = require("../../shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const Types_1 = require("../../agent/v2/core/Types");
const ToolBus_1 = require("../../agent/v2/core/ToolBus");
const Guardrails_1 = require("../../agent/v2/core/Guardrails");
const openai_1 = __importDefault(require("openai"));
// Import tools to register them
require("../../agent/v2/tools");
const router = express_1.default.Router();
// OpenAI client
const openai = process.env.OPENAI_API_KEY
    ? new openai_1.default({ apiKey: process.env.OPENAI_API_KEY })
    : null;
/**
 * POST /api/agent/v2/chat
 * Main chat endpoint
 *
 * Body:
 * - message: string
 * - sessionId?: string (creates new if not provided)
 * - mode?: "read_only" | "auto_safe" | "auto_full"
 */
router.post("/chat", async (req, res) => {
    try {
        const { message, sessionId, mode } = req.body;
        // Validate input
        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "Message is required" });
        }
        // Get user context from JWT
        const userId = req.user?.id || "demo_user";
        const studioId = req.user?.studioId || "demo_studio";
        const userRole = req.user?.role || "photographer";
        // Determine scopes (in production, load from database based on user role)
        const scopes = getUserScopes(userRole);
        // Determine execution mode
        const executionMode = mode || (0, Guardrails_1.getRecommendedMode)(userRole);
        // Create or load session
        let currentSessionId = sessionId;
        if (!currentSessionId) {
            currentSessionId = `sess_${(0, crypto_1.randomUUID)()}`;
            await db_1.db.insert(schema_1.agentSession).values({
                id: currentSessionId,
                studioId,
                userId,
                mode: executionMode,
                scopes,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        // Save user message
        await db_1.db.insert(schema_1.agentMessage).values({
            sessionId: currentSessionId,
            role: "user",
            content: message,
            createdAt: new Date()
        });
        // Build tool context
        const ctx = {
            studioId,
            userId,
            sessionId: currentSessionId,
            scopes,
            mode: executionMode,
            dryRun: process.env.AGENT_V2_SHADOW === "true"
        };
        // Get available tools for this user
        const availableTools = (0, ToolBus_1.listOpenAITools)(scopes);
        if (!openai) {
            return res.status(500).json({ error: "OpenAI API key not configured" });
        }
        // Call OpenAI with function calling
        const completion = await openai.chat.completions.create({
            model: process.env.AGENT_MODEL || "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: getSystemPrompt(executionMode)
                },
                {
                    role: "user",
                    content: message
                }
            ],
            tools: availableTools.length > 0 ? availableTools : undefined,
            tool_choice: "auto"
        });
        const choice = completion.choices[0];
        const assistantMessage = choice.message;
        // Handle tool calls
        if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
            const toolResults = [];
            for (const toolCall of assistantMessage.tool_calls) {
                // Handle both standard and custom tool calls
                const toolName = toolCall.function?.name || toolCall.type;
                const toolArgs = JSON.parse(toolCall.function?.arguments || "{}");
                try {
                    const result = await (0, ToolBus_1.executeTool)(ctx, toolName, toolArgs);
                    toolResults.push({
                        tool: toolName,
                        args: toolArgs,
                        result: result.data,
                        ok: result.ok,
                        error: result.error
                    });
                    // If confirmation required, return to user immediately
                    if (!result.ok && result.error?.includes("CONFIRM_REQUIRED")) {
                        return res.json({
                            sessionId: currentSessionId,
                            confirmRequired: true,
                            tool: toolName,
                            args: toolArgs,
                            message: `This action requires your confirmation: ${toolName}`
                        });
                    }
                }
                catch (error) {
                    // Handle authorization errors
                    if (error instanceof Types_1.AuthzError) {
                        return res.status(403).json({
                            error: "Forbidden",
                            message: error.message,
                            requiredScopes: error.requiredScopes,
                            userScopes: error.userScopes
                        });
                    }
                    // Handle confirmation required
                    if (error instanceof Types_1.ConfirmRequiredError) {
                        return res.json({
                            sessionId: currentSessionId,
                            confirmRequired: true,
                            tool: error.tool,
                            args: error.args,
                            reason: error.reason,
                            message: `Confirmation needed: ${error.reason}`
                        });
                    }
                    // Other errors
                    toolResults.push({
                        tool: toolName,
                        args: toolArgs,
                        ok: false,
                        error: error.message
                    });
                }
            }
            // Generate final response with tool results
            const finalResponse = await openai.chat.completions.create({
                model: process.env.AGENT_MODEL || "gpt-4-turbo-preview",
                messages: [
                    {
                        role: "system",
                        content: getSystemPrompt(executionMode)
                    },
                    {
                        role: "user",
                        content: message
                    },
                    assistantMessage,
                    {
                        role: "tool",
                        content: JSON.stringify(toolResults),
                        tool_call_id: assistantMessage.tool_calls[0].id
                    }
                ]
            });
            const finalMessage = finalResponse.choices[0].message.content || "I executed the requested actions.";
            // Save assistant message
            await db_1.db.insert(schema_1.agentMessage).values({
                sessionId: currentSessionId,
                role: "assistant",
                content: finalMessage,
                metadata: { toolResults },
                createdAt: new Date()
            });
            return res.json({
                sessionId: currentSessionId,
                message: finalMessage,
                toolCalls: toolResults,
                mode: executionMode
            });
        }
        else {
            // No tool calls - just return text response
            const responseText = assistantMessage.content || "I'm not sure how to help with that.";
            // Save assistant message
            await db_1.db.insert(schema_1.agentMessage).values({
                sessionId: currentSessionId,
                role: "assistant",
                content: responseText,
                createdAt: new Date()
            });
            return res.json({
                sessionId: currentSessionId,
                message: responseText,
                mode: executionMode
            });
        }
    }
    catch (error) {
        console.error("[Agent V2] Chat error:", error);
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
});
/**
 * GET /api/agent/v2/session/:sessionId
 * Get session history
 */
router.get("/session/:sessionId", async (req, res) => {
    try {
        const { sessionId } = req.params;
        // Get session details
        const [session] = await db_1.db
            .select()
            .from(schema_1.agentSession)
            .where((0, drizzle_orm_1.eq)(schema_1.agentSession.id, sessionId));
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        // Get messages
        const messages = await db_1.db
            .select()
            .from(schema_1.agentMessage)
            .where((0, drizzle_orm_1.eq)(schema_1.agentMessage.sessionId, sessionId))
            .orderBy(schema_1.agentMessage.createdAt);
        // Get audit log
        const auditLog = await db_1.db
            .select()
            .from(schema_1.agentAudit)
            .where((0, drizzle_orm_1.eq)(schema_1.agentAudit.sessionId, sessionId))
            .orderBy(schema_1.agentAudit.createdAt);
        return res.json({
            session,
            messages,
            auditLog: auditLog.map(log => ({
                tool: log.tool,
                args: JSON.parse(log.argsJson || "{}"),
                result: log.resultJson ? JSON.parse(log.resultJson) : null,
                ok: log.ok,
                error: log.error,
                duration: log.duration,
                simulated: log.simulated,
                timestamp: log.createdAt
            }))
        });
    }
    catch (error) {
        console.error("[Agent V2] Session fetch error:", error);
        return res.status(500).json({ error: error.message });
    }
});
/**
 * GET /api/agent/v2/stats
 * Get ToolBus statistics
 */
router.get("/stats", async (req, res) => {
    try {
        const stats = (0, ToolBus_1.getStats)();
        return res.json(stats);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
/**
 * Helper: Get user scopes based on role
 * In production, this should load from database
 */
function getUserScopes(role) {
    switch (role) {
        case "admin":
        case "owner":
            return ["CRM_READ", "CRM_WRITE", "INV_READ", "INV_WRITE", "EMAIL_SEND", "CALENDAR_WRITE", "PRICE_RESEARCH", "PRICE_WRITE", "ADMIN"];
        case "photographer":
        case "manager":
            return ["CRM_READ", "CRM_WRITE", "INV_READ", "INV_WRITE", "EMAIL_SEND", "CALENDAR_WRITE", "PRICE_RESEARCH", "PRICE_WRITE"];
        case "staff":
            return ["CRM_READ", "INV_READ", "CALENDAR_WRITE"];
        case "viewer":
        default:
            return ["CRM_READ", "INV_READ"];
    }
}
/**
 * Helper: Get system prompt based on mode
 */
function getSystemPrompt(mode) {
    const basePrompt = `You are an advanced AI assistant for a photography CRM system. You have 22 autonomous tools across multiple domains to help photographers manage their business.

📋 CORE CRM CAPABILITIES:
   - Search and retrieve client/lead information
   - List and filter invoices by status, date, amount
   - Update client details and lead status
   - Track bookings and project stages
   - Create and manage calendar appointments
   - Send emails and invoices

💰 PRICE LIST WIZARD (Autonomous Competitive Intelligence):
   This system analyzes competitor pricing and generates AI-powered price recommendations.
   
   Tools available:
   • price_wizard_research: Discover competitors in your region and scrape their websites for pricing
     - Automatically finds competitor photography businesses
     - Extracts pricing from websites using advanced scraping
     - Analyzes pricing patterns and market positioning
     - Returns detailed pricing analysis with confidence scores
     - Use when photographer asks: "What should I charge?" or "Research my competitors"
   
   • price_wizard_activate: Apply AI-recommended prices to your price lists
     - Activates suggested pricing to Basic/Standard/Premium tiers
     - Can apply custom adjustments (e.g., -10% or +€200)
     - Updates price_list table automatically
     - Use after research when photographer confirms: "Yes, activate those prices"

   Example workflow:
   User: "What should I charge for wedding photography in Dublin?"
   You: Use price_wizard_research with {location: "Dublin", services: ["wedding photography"]}
   You: Present analysis: "Found 8 competitors. Average: €2,500. Recommended Standard tier: €2,200"
   User: "Sounds good, activate it"
   You: Use price_wizard_activate with the session ID and suggested prices

📧 WORKFLOW WIZARD (Email Automation & Client Journeys):
   This system creates automated email sequences triggered by CRM events - NO external tools needed (no Mailchimp, no Zapier).
   
   The system has 4 pre-loaded workflow templates:
   1. Welcome Email Sequence - Sends welcome email when new client signs up
   2. Booking Follow-Up - Sends preparation emails after booking confirmed
   3. Invoice Reminder - Automated reminders for unpaid invoices (Day 3, Day 7, Day 14)
   4. Gallery Upload Notification - Notifies client when photos are ready
   
   Trigger types available:
   • manual - Start workflow manually
   • new_client - Auto-start when client created
   • booking_confirmed - Auto-start when booking confirmed
   • invoice_sent - Auto-start when invoice sent
   • gallery_uploaded - Auto-start when gallery uploaded
   • time_based - Scheduled execution (daily, weekly, monthly)
   
   Step types in workflows:
   • send_email - Send email from template with variable substitution
   • send_sms - Send SMS notification
   • create_task - Create task for photographer
   • update_field - Update client/lead fields
   • wait - Delay (hours/days) before next step
   • condition_check - Conditional branching (if/else logic)
   • send_questionnaire - Send forms to clients
   
   Database tables:
   • workflow_templates - Pre-configured sequences (4 system templates)
   • workflow_instances - Active workflows for specific clients
   • workflow_steps - Individual actions in each workflow
   • workflow_executions - Execution history and status
   • workflow_email_templates - Email content with variables ({{client_name}}, {{booking_date}}, etc.)
   • workflow_questionnaire_templates - Pre-event and post-event forms
   
   When photographer asks about email automation:
   - DO NOT suggest Mailchimp, Zapier, or other external tools
   - Use the BUILT-IN workflow system
   - Explain that workflows auto-trigger based on CRM events
   - Offer to create custom workflows from templates

📨 EMAIL CAMPAIGN SYSTEM (Integrated Marketing):
   Advanced email marketing built directly into the CRM.
   
   Tables available:
   • email_campaigns (26 columns): Campaign management with scheduling
     - name, subject, from_name, from_email
     - html_content, text_content, template_variables
     - status: draft, scheduled, sending, sent, paused, cancelled
     - schedule_time, send_time, stats (sent_count, open_count, click_count, bounce_count)
     - segment_id for targeted sending
   
   • email_templates: Reusable HTML/text templates with variable substitution
     - {{client_name}}, {{photographer_name}}, {{booking_date}}, {{invoice_amount}}, etc.
     - Can be used in campaigns or workflows
   
   • email_segments: Target specific client groups
     - Filter by client status, booking type, location, spend amount
   
   • email_events: Track opens, clicks, bounces, complaints
   • email_links: Track click-through rates
   
   Capabilities:
   - Schedule campaigns for specific date/time
   - Send to segments (e.g., "All wedding clients in 2024")
   - A/B testing with multiple variants
   - Automated follow-ups based on engagement
   - Full analytics (open rates, click rates, conversions)
   
   When photographer asks about email marketing:
   - DO NOT suggest external email tools
   - Use the BUILT-IN email_campaigns system
   - Explain scheduling, segmentation, and tracking capabilities
   - Offer to create campaigns targeting specific client groups

🤖 AUTOMATION PHILOSOPHY:
   This CRM is designed to be FULLY AUTONOMOUS. All automation happens inside the system:
   - Workflows auto-trigger on CRM events (invoice sent → reminder sequence)
   - Email campaigns schedule and send automatically
   - Price research happens autonomously via web scraping
   - No third-party integrations required (Zapier, Mailchimp, etc.)
   
   When photographer mentions manual work or external tools:
   - Identify which built-in automation solves their problem
   - Explain how triggers eliminate manual steps
   - Offer to set up the automation immediately

📊 AVAILABLE TOOLS (22 Total):
   Low Risk (13 tools): search_clients, search_leads, list_invoices, get_client, get_lead, get_invoice, search_calendar, list_bookings, list_products, list_expenses, price_wizard_research, get_email_templates, list_workflow_templates
   
   Medium Risk (6 tools): update_client, update_lead, draft_email, create_calendar_event, price_wizard_activate, create_workflow_instance
   
   High Risk (3 tools): send_email, send_invoice, delete_calendar_event

🎯 INTERACTION GUIDELINES:
   - Always use tools to answer questions (don't say "I don't have access")
   - When photographer asks "Can you...?" check available tools first
   - For automation requests, use Workflow Wizard, NOT external tools
   - For email marketing, use email_campaigns system, NOT Mailchimp
   - For pricing questions, use Price Wizard research and activation
   - Be proactive: If you see manual work, suggest automation
   - Always confirm before high-risk actions (send_email, send_invoice, delete_calendar_event)
   
   Example conversations:
   Q: "Can you send invoice reminders automatically?"
   A: "Yes! I'll set up an Invoice Reminder workflow. It triggers when an invoice is sent and sends reminders on Day 3, 7, and 14 if unpaid. Should I activate this?"
   
   Q: "How do I send newsletters to all my wedding clients?"
   A: "I'll create an email campaign using our built-in system. I can segment by 'wedding clients' and schedule it for any date. What subject line would you like?"
   
   Q: "What should I charge for family portraits?"
   A: "Let me research competitor pricing in your area. What's your location and what services should I analyze?"

Always be professional, concise, and helpful. Use tools when appropriate to answer user questions.`;
    if (mode === "read_only") {
        return basePrompt + "\n\n⚠️ IMPORTANT: You are in READ-ONLY mode. You can only read data, not modify anything.";
    }
    if (mode === "auto_safe") {
        return basePrompt + "\n\n✅ IMPORTANT: You are in SAFE mode. You can read data and execute low/medium risk actions. High-risk actions (send_email, send_invoice, delete_calendar_event) will require user confirmation.";
    }
    return basePrompt + "\n\n🚀 IMPORTANT: You are in FULL mode. You can execute all actions autonomously, including high-risk operations.";
}
exports.default = router;
