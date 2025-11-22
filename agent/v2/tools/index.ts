/**
 * Tool Registry Loader
 * 
 * This file imports all tools to register them with ToolBus
 * Import this file early in the application startup
 */

// Tier 1: Read-only tools (low risk)
import "./crm.clients.search";
import "./crm.leads.list";
import "./invoices.list";
import "./voucher_sales.query";
import "./clients.location.query";
import "./clients.company.report";
import "./leads.query";
import "./leads.conversion.report";
import "./invoices.query";
import "./invoices.summary";
import "./revenue.by.period";
import "./sessions.list.upcoming";
import "./client.acquisition";
import "./top.clients";

// Tier 2: Safe writes (medium risk) - Require confirmation in auto_safe mode
import "./email.draft";
import "./calendar.create";
import "./clients.update";
import "./invoices.create";
import "./price.wizard.research";
import "./price.wizard.activate";
// Workflow wizard tools disabled until workflow tables added to shared/schema
// import "./workflow.wizard.create";
// import "./workflow.wizard.activate";

// Tier 3: High-impact writes (high risk) - ALWAYS require confirmation
import "./email.send";
import "./invoices.send";
import "./invoices.mark_paid";

console.log("[ToolBus] All tools registered successfully");
