/**
 * CRM Clients Search Tool
 * Tier 1: Low-risk read-only tool
 * 
 * Searches CRM clients by name, email, or phone
 */

import { z } from "zod";
import { registerTool } from "../core/ToolBus";
import { ToolDef, ToolContext } from "../core/Types";
import { db } from "../../../server/db";
import { crmClients } from "../../../shared/schema";
import { or, like, eq } from "drizzle-orm";

// Zod schema for parameter validation
const params = z.object({
  query: z.string().min(2, "Search query must be at least 2 characters"),
  limit: z.number().int().min(1).max(50).default(10).optional(),
  includeArchived: z.boolean().default(false).optional()
});

// Tool definition
const def: ToolDef<typeof params> = {
  name: "crm_clients_search",
  description: "Search CRM clients by name, email, or phone number. Returns matching client records.",
  parameters: params,
  authz: ["CRM_READ"], // Requires CRM_READ scope
  risk: "low", // Read-only, no side effects
  handler: async (ctx: ToolContext, args: z.infer<typeof params>) => {
    // Build query
    const queryStr = args.query.toLowerCase();
    const limit = args.limit || 10;
    
    // Search across multiple fields
    const query = db
      .select()
      .from(crmClients)
      .where(
        or(
          like(crmClients.firstName, `%${queryStr}%`),
          like(crmClients.lastName, `%${queryStr}%`),
          like(crmClients.email, `%${queryStr}%`),
          like(crmClients.phone, `%${queryStr}%`)
        )
      )
      .limit(limit);
    
    const results = await query;
    
    // Return formatted results
    return {
      count: results.length,
      clients: results.map(client => ({
        id: client.id,
        name: `${client.firstName || ''} ${client.lastName || ''}`.trim(),
        email: client.email,
        phone: client.phone,
        status: client.status,
        company: client.company,
        createdAt: client.createdAt
      }))
    };
  }
};

// Register the tool
registerTool(def);

export default def;
