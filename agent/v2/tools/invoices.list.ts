/**
 * Invoices List Tool
 * Tier 1: Low-risk read-only tool
 * 
 * Lists invoices with optional filtering
 */

import { z } from "zod";
import { registerTool } from "../core/ToolBus";
import { ToolDef, ToolContext } from "../core/Types";
import { db } from "../../../server/db";
import { crmInvoices } from "../../../shared/schema";
import { eq, desc } from "drizzle-orm";

// Zod schema
const params = z.object({
  clientId: z.string().uuid().optional(),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
  limit: z.number().int().min(1).max(100).default(20).optional()
});

// Tool definition
const def: ToolDef<typeof params> = {
  name: "invoices_list",
  description: "List invoices, optionally filtered by client or status. Returns invoice records sorted by most recent first.",
  parameters: params,
  authz: ["INV_READ"],
  risk: "low",
  handler: async (ctx: ToolContext, args: z.infer<typeof params>) => {
    const limit = args.limit || 20;
    
    // Build query
    let query = db
      .select()
      .from(crmInvoices)
      .where(eq(crmInvoices.studioId, ctx.studioId))
      .orderBy(desc(crmInvoices.createdAt));
    
    // Filter by client if provided
    if (args.clientId) {
      query = query.where(eq(crmInvoices.clientId, args.clientId));
    }
    
    // Filter by status if provided
    if (args.status) {
      query = query.where(eq(crmInvoices.status, args.status));
    }
    
    const results = await query.limit(limit);
    
    return {
      count: results.length,
      invoices: results.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientId: invoice.clientId,
        status: invoice.status,
        totalAmount: invoice.totalAmount,
        dueDate: invoice.dueDate,
        issueDate: invoice.issueDate,
        paidAt: invoice.paidAt,
        createdAt: invoice.createdAt
      }))
    };
  }
};

registerTool(def);

export default def;
