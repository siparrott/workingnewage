"use strict";
/**
 * CRM Clients Search Tool
 * Tier 1: Low-risk read-only tool
 *
 * Searches CRM clients by name, email, or phone
 */
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ToolBus_1 = require("../core/ToolBus");
const db_1 = require("../../../server/db");
const schema_1 = require("../../../shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Zod schema for parameter validation
const params = zod_1.z.object({
    query: zod_1.z.string().min(2, "Search query must be at least 2 characters"),
    limit: zod_1.z.number().int().min(1).max(50).default(10).optional(),
    includeArchived: zod_1.z.boolean().default(false).optional()
});
// Tool definition
const def = {
    name: "crm_clients_search",
    description: "Search CRM clients by name, email, or phone number. Returns matching client records.",
    parameters: params,
    authz: ["CRM_READ"], // Requires CRM_READ scope
    risk: "low", // Read-only, no side effects
    handler: async (ctx, args) => {
        // Build query
        const queryStr = args.query.toLowerCase();
        const limit = args.limit || 10;
        // Search across multiple fields
        const query = db_1.db
            .select()
            .from(schema_1.crmClients)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.crmClients.firstName, `%${queryStr}%`), (0, drizzle_orm_1.like)(schema_1.crmClients.lastName, `%${queryStr}%`), (0, drizzle_orm_1.like)(schema_1.crmClients.email, `%${queryStr}%`), (0, drizzle_orm_1.like)(schema_1.crmClients.phone, `%${queryStr}%`)))
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
(0, ToolBus_1.registerTool)(def);
exports.default = def;
