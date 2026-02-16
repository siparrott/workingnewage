import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

// Neon-only database connection (Supabase removed)
const neonUrl = process.env.DATABASE_URL;

if (!neonUrl) {
  console.error("❌ ERROR: DATABASE_URL environment variable is not set!");
  console.error("Please configure DATABASE_URL in your Heroku dashboard:");
  console.error("heroku config:set DATABASE_URL='your-neon-connection-string'");
  // In production, we need the database - but don't crash immediately
  // This allows the app to start and show a clear error message
  if (process.env.NODE_ENV === 'production') {
    console.error("⚠️ App will start but database operations will fail");
  } else {
    throw new Error("DATABASE_URL must be set - provide your Neon connection string");
  }
}

export const pool = neonUrl ? new Pool({ 
  connectionString: neonUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}) : null as any;

export const db = neonUrl ? drizzle(pool, { 
  schema,
  logger: true  // Enable SQL query logging for debugging
}) : null as any;

if (neonUrl) {
  console.log(`📊 Database: Neon connection (Supabase-free architecture)`);
} else {
  console.warn(`⚠️ Database: No connection - DATABASE_URL not configured`);
}