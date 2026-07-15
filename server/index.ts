// Console silencing temporarily disabled for debugging
// import '../silence-console.js';

import "dotenv/config";
import { validateEnv } from "./lib/validateEnv";

// PHASE 0: Fail fast on misconfiguration before anything else runs
validateEnv();

import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import rateLimit from "express-rate-limit";
import http from "node:http";
// Import routes and jobs directly to fix client database access
import { registerRoutes } from "./routes";
// Jobs loaded conditionally below to avoid startup crashes
// import "./jobs";
import { setupVite, serveStatic, log } from "./vite";
import { seoRedirects } from "./seoRedirects";
// Mount lightweight auth routes immediately (full routes registered later lazily)
import authRoutes from './routes/auth';
// Google Calendar 2-way sync: OAuth routes and scheduler
import googleAuthRoutes from './routes/googleAuth';
import { startSyncScheduler, triggerManualSync } from './services/syncScheduler';
import { importGoogleCalendarEvents } from './services/calendarService';
import { retryFailedSchedulerSyncs } from './services/schedulerGoogleCalendar';
// Agent V2: Modern ToolBus architecture
import agentV2Routes from './routes/agent-v2';
import agentShadowRoutes from './routes/agent-shadow';
// Manual Pages: Squarespace-style CMS for public pages
import manualPagesRoutes from './routes/manual-pages';

// Import and configure session middleware
import { sessionConfig, requireAuth } from './auth';

// Import email service for initialization
import { EnhancedEmailService } from './services/enhancedEmailService';
import { SMSService } from './services/smsService';
import { sql, eq } from 'drizzle-orm';
import { db } from './db';
import { studioConfigs, studioIntegrations, adminUsers } from '../shared/schema';

// Prevent process crashes from unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Promise Rejection:', reason);
  console.error('Promise:', promise);
  // Don't exit the process
});

process.on('uncaughtException', (error) => {
  console.error('⚠️ Uncaught Exception:', error);
  // Don't exit the process
});

// Environment defaults (don't force production locally)
if (process.env.DEMO_MODE == null) {
  process.env.DEMO_MODE = 'false';
}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const BOOT_MARK = Date.now();
console.log('[BOOT] Starting minimal server bootstrap');
const app = express();

// MODULE-LEVEL server reference to prevent garbage collection
let serverInstance: any = null;

// Behind reverse proxies (Heroku/Render/etc.) trust the first proxy so secure cookies work when appropriate
app.set('trust proxy', 1);

// Gzip/deflate compression on all responses — big win for the large JS bundle
// and JSON payloads (bandwidth + Core Web Vitals). Cheap; safe for everything.
app.use(compression());

// Rate limiting: a generous global cap (blunts scraping / DoS on the new public
// URL) plus a strict cap on auth POSTs (login/register/reset brute-force). GETs
// (incl. session checks) and Stripe webhooks are exempt so nothing legitimate breaks.
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) =>
    req.path === '/healthz' ||
    req.path === '/api/stripe/webhook' ||
    req.path === '/api/invoices/webhook' ||
    req.path === '/api/vouchers/stripe-webhook' ||
    // Image proxy is on the gallery render hot path (many thumbnails per page)
    // and is a cacheable read, not an abuse vector — exempt so browsing a large
    // gallery can't trip the global cap.
    req.path === '/api/proxy-image',
});
app.use(globalLimiter);

const authWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method !== 'POST',
});
app.use('/api/auth', authWriteLimiter);

// Increase body size limits to accommodate large image payloads (base64 encoded images can be 10MB+)
// Skip JSON body parsing for Stripe webhook endpoints — they need the raw body Buffer
// for signature verification via express.raw()
const jsonParser = express.json({ limit: '50mb' });
app.use((req, res, next) => {
  if (
    req.path === '/api/stripe/webhook' ||
    req.path === '/api/invoices/webhook' ||
    req.path === '/api/vouchers/stripe-webhook'
  ) {
    return next();
  }
  jsonParser(req, res, next);
});

// Also skip urlencoded parser for webhook endpoints to avoid any body stream interference
const urlencodedParser = express.urlencoded({ extended: false, limit: '50mb' });
app.use((req, res, next) => {
  if (
    req.path === '/api/stripe/webhook' ||
    req.path === '/api/invoices/webhook' ||
    req.path === '/api/vouchers/stripe-webhook'
  ) {
    return next();
  }
  urlencodedParser(req, res, next);
});

// Add CORS headers for API requests
app.use((req, res, next) => {
  // Echo back the request origin to support credentials; default to * if none
  const origin = (req.headers.origin as string) || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health & ping endpoints before anything else for diagnostics
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok-preinit', uptime: process.uptime(), bootMs: Date.now() - BOOT_MARK });
});

// ==================== FAST-PATH STRIPE WEBHOOK ====================
// Registered BEFORE session middleware and heavy init so that even during
// cold-start the server can acknowledge Stripe webhooks within milliseconds.
// The full handler in routes.ts does async processing; this early handler
// ensures we never time out during boot.
import Stripe from 'stripe';

const _earlyStripeKey = process.env.STRIPE_SECRET_KEY;
const _earlyWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
let _earlyStripe: Stripe | null = null;
if (_earlyStripeKey && _earlyStripeKey.length >= 20 && !_earlyStripeKey.includes('dummy')) {
  try { _earlyStripe = new Stripe(_earlyStripeKey, { apiVersion: '2025-08-27.basil' }); } catch {}
}

// Track whether the full route handler from routes.ts has taken over
(global as any).__fullWebhookRegistered = false;

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req: any, res: any, next: any) => {
  // Once routes.ts has registered its full handler, defer to it
  if ((global as any).__fullWebhookRegistered) return next();

  // Fast-path: verify signature and respond 200 immediately
  const startMs = Date.now();
  console.log(`🔵 [EARLY-WEBHOOK] Stripe webhook received during boot at ${new Date().toISOString()}`);

  if (!_earlyStripe || !_earlyWebhookSecret || _earlyWebhookSecret.startsWith('http')) {
    console.error('❌ [EARLY-WEBHOOK] Stripe not configured');
    return res.status(200).json({ received: true, note: 'acknowledged-during-boot' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).json({ error: 'Missing Stripe signature' });
  }

  try {
    const event = _earlyStripe.webhooks.constructEvent(req.body, sig, _earlyWebhookSecret);
    console.log(`✅ [EARLY-WEBHOOK] Verified ${event.type} in ${Date.now() - startMs}ms — queuing for later processing`);
    // Respond immediately — event will be retried by Stripe if processing is needed
    res.status(200).json({ received: true, type: event.type, id: event.id, early: true });
  } catch (err: any) {
    console.error('❌ [EARLY-WEBHOOK] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
});
// ==================== END FAST-PATH STRIPE WEBHOOK ====================

// Session middleware must be before auth routes (still early but after healthz)
// Skip session middleware for webhook endpoints — they don't need sessions,
// and the PgStore DB pool can hang/timeout causing Stripe webhook failures
app.use((req, res, next) => {
  if (
    req.path === '/api/stripe/webhook' ||
    req.path === '/api/invoices/webhook' ||
    req.path === '/api/vouchers/stripe-webhook'
  ) {
    return next();
  }
  sessionConfig(req, res, next);
});

// Early auth routes so backend login functions even before lazy route load
app.use('/api/auth', authRoutes);
app.use('/api/auth/*', (req, _res, next) => { console.log('[AUTH-EARLY]', req.method, req.originalUrl); next(); });
// Google Calendar OAuth routes
app.use('/api/auth', googleAuthRoutes);
// Agent V2 routes (ToolBus architecture)
app.use('/api/agent/v2', agentV2Routes);
console.log('[AGENT-V2] Routes registered at /api/agent/v2');

// Manual Pages CMS routes
app.use('/api/manual-pages', manualPagesRoutes);
console.log('[MANUAL-PAGES] Routes registered at /api/manual-pages');

// Shadow mode routes (V1 vs V2 comparison)
if (process.env.AGENT_V2_SHADOW === 'true') {
  app.use('/api/agent/shadow', agentShadowRoutes);
  console.log('[SHADOW MODE] Routes registered at /api/agent/shadow');
  console.log('[SHADOW MODE] V1 and V2 will run in parallel for comparison');
}

// Serve uploaded files statically
app.use('/uploads', express.static('public/uploads'));

// Serve blog images statically (before Vite middleware)
app.use('/blog-images', express.static('server/public/blog-images', {
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

// Domain redirect middleware - redirect root domain to www
app.use((req, res, next) => {
  const wwwHost = process.env.CANONICAL_HOST; // e.g. 'www.newagefotografie.com'
  const bareHost = wwwHost?.replace(/^www\./, '');
  if (wwwHost && bareHost && req.headers.host === bareHost) {
    return res.redirect(301, `https://${wwwHost}${req.url}`);
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Note: global error handlers already set above and do NOT exit the process

    console.log('🚀 Starting New Age Fotografie CRM server...');
    
    // ========== START LISTENING IMMEDIATELY ==========
    // Start the HTTP server FIRST so we can accept health checks and Stripe
    // webhooks (via the early fast-path handler) even while services initialize.
    const port = parseInt(process.env.PORT || '3001', 10);
    const host = process.env.HOST || (process.env.PORT ? '0.0.0.0' : '127.0.0.1');
    
    console.log(`🎯 Starting HTTP server on ${host}:${port} EARLY (before full init)...`);
    serverInstance = app.listen(port, host);
    
    const attachServerHandlers = (srv: any, { reason }: { reason: string }) => {
      srv.on('listening', () => {
        const addr = srv.address();
        console.log(`✅ HTTP server LISTENING on ${host}:${port} (${reason})`);
        console.log(`🔍 Server address:`, addr);
        console.log(`🔍 Server listening:`, srv.listening);
      });

      srv.on('error', (err: any) => {
        console.error('❌ HTTP server error:', err);
        console.error('Error code:', err.code);
        if (err.code === 'EADDRINUSE') {
          console.error(`Port ${port} is already in use!`);
        }
      });

      srv.on('close', () => {
        console.warn('⚠️ Server "close" event fired - port released!');
        try {
          const addr = srv?.address?.();
          console.warn('⚠️ Close context:', { addr, listening: srv?.listening });
        } catch {}

        const allowRebind = (process.env.RETRY_LISTEN_ON_CLOSE ?? (process.env.NODE_ENV !== 'production' ? 'true' : 'false')) === 'true';
        (global as any).__rebindAttempted = (global as any).__rebindAttempted ?? false;
        if (allowRebind && !(global as any).__rebindAttempted) {
          (global as any).__rebindAttempted = true;
          console.warn('🛠️ Attempting one-shot rebind after close (dev safeguard)...');
          setTimeout(() => {
            try {
              const newSrv = app.listen(port, host);
              serverInstance = newSrv;
              (global as any).__server = newSrv;
              attachServerHandlers(newSrv, { reason: 'rebind' });
            } catch (e: any) {
              console.error('❌ Rebind attempt failed:', e?.message || e);
            }
          }, 500);
        }
      });
    };

    attachServerHandlers(serverInstance, { reason: 'initial' });
    (global as any).__server = serverInstance;
    const server = serverInstance;
    console.log(`🔧 Server object created, waiting for 'listening' event...`);
    // ========== END EARLY LISTEN ==========

    // Initialize services with error handling
    try {
      await EnhancedEmailService.initialize();
      console.log('✅ Email service initialized');
    } catch (error) {
      console.warn('⚠️ Email service initialization failed:', error.message);
    }

    try {
      await SMSService.initialize();
      console.log('✅ SMS service initialized');
    } catch (error) {
      console.warn('⚠️ SMS service initialization failed:', error.message);
    }

    // Skip complex database migrations for now to avoid startup issues
    try {
      // Quick database test
      await db.execute(sql`SELECT 1 as test`);
      console.log('✅ Database connection verified');
      
      // Run gallery images migration to add size tracking
      try {
        await db.execute(sql`ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS size_bytes INTEGER DEFAULT 0`);
        await db.execute(sql`ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS content_type TEXT`);
        console.log('✅ Gallery images size tracking migration completed');
      } catch (migrationError) {
        console.warn('⚠️ Gallery migration already applied or failed:', migrationError.message);
      }

      // Email→order attribution: campaign that drove a voucher purchase.
      try {
        await db.execute(sql`ALTER TABLE voucher_sales ADD COLUMN IF NOT EXISTS campaign_id TEXT`);
        console.log('✅ voucher_sales.campaign_id attribution column ensured');
      } catch (migrationError: any) {
        console.warn('⚠️ voucher_sales.campaign_id migration already applied or failed:', migrationError.message);
      }

      // Run onboarding columns migration
      try {
        await db.execute(sql`ALTER TABLE studio_configs ADD COLUMN IF NOT EXISTS technical_setup_complete BOOLEAN DEFAULT FALSE`);
        await db.execute(sql`ALTER TABLE studio_configs ADD COLUMN IF NOT EXISTS creative_setup_complete BOOLEAN DEFAULT FALSE`);
        await db.execute(sql`ALTER TABLE studio_configs ADD COLUMN IF NOT EXISTS app_url TEXT`);
        await db.execute(sql`ALTER TABLE studio_configs ADD COLUMN IF NOT EXISTS frontend_url TEXT`);
        await db.execute(sql`ALTER TABLE studio_configs ADD COLUMN IF NOT EXISTS public_site_base_url TEXT`);
        await db.execute(sql`ALTER TABLE studio_configs ADD COLUMN IF NOT EXISTS ga4_measurement_id TEXT`);
        await db.execute(sql`ALTER TABLE studio_configs ADD COLUMN IF NOT EXISTS meta_pixel_id TEXT`);
        await db.execute(sql`ALTER TABLE studio_configs ADD COLUMN IF NOT EXISTS date_format TEXT DEFAULT 'auto'`);
        console.log('✅ Onboarding columns migration completed');
      } catch (migrationError: any) {
        console.warn('⚠️ Onboarding columns migration already applied or failed:', migrationError.message);
      }

      // Auto-detect: if existing instance already has key infra, mark setup complete
      // Uses raw SQL to avoid Drizzle column-mapping failures if columns don't exist yet
      try {
        const adminCheck = await db.execute(sql`SELECT EXISTS(SELECT 1 FROM admin_users LIMIT 1) AS has_admin`);
        const hasAdmin = !!(adminCheck.rows?.[0] as any)?.has_admin;
        if (hasAdmin) {
          // Use raw SQL to update — more reliable than Drizzle if schema is out of sync
          await db.execute(sql`
            UPDATE studio_configs 
            SET technical_setup_complete = true, creative_setup_complete = true
            WHERE id = (SELECT id FROM studio_configs LIMIT 1)
          `);
          console.log('✅ Existing instance detected (admin exists) — auto-marked onboarding complete via raw SQL');
        }
      } catch (autoDetectError: any) {
        console.warn('⚠️ Onboarding auto-detect skipped:', autoDetectError.message);
      }
    } catch (error) {
      console.warn('⚠️ Database connection issue:', error.message);
    }
    
    // Register routes immediately to restore client database access
    console.log('🔄 Registering routes immediately...');
    try {
      await registerRoutes(app);
      console.log('✅ Routes registered successfully - Client database should now be accessible');
    } catch (routeError) {
      console.error('❌ Failed to register routes:', routeError.message);
      console.error('Route registration stack:', routeError.stack);
      // Continue without routes - at least serve health endpoints
    }
    
    // Manual Google Calendar sync endpoint (per-user) - does FULL import of all events
    // MUST be registered BEFORE serveStatic to avoid catch-all interference
    // Supports both session auth (requireAuth) and JWT Bearer tokens
    const manualSyncAuth = async (req: any, res: any, next: any) => {
      // Check session first
      if (req.session && req.session.userId) {
        return requireAuth(req, res, next);
      }
      // Fall back to JWT Bearer token
      const authHeader = req.headers['authorization'] as string;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const jwt = await import('jsonwebtoken');
          const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'default-secret';
          const decoded = jwt.default.verify(authHeader.substring(7), secret) as any;
          if (decoded && decoded.userId) {
            req.user = { id: decoded.userId, role: decoded.role || 'admin' };
            return next();
          }
        } catch (jwtErr) {
          console.warn('[manual-sync] JWT verification failed:', (jwtErr as any)?.message);
        }
      }
      return res.status(401).json({ success: false, error: 'Authentication required' });
    };

    app.post('/api/calendar/manual-sync', manualSyncAuth, async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ error: 'Not authenticated' });
        
        // Use full import function to get ALL events (past and future)
        const results = await importGoogleCalendarEvents(undefined, userId);

        // Also run scheduler recovery sweep to sync any failed bookings
        try {
          const recovery = await retryFailedSchedulerSyncs();
          if (recovery.retried > 0) {
            console.log(`[Manual Sync] Scheduler recovery: ${recovery.succeeded}/${recovery.retried} bookings synced to Google Calendar`);
          }
        } catch (recoveryErr: any) {
          console.warn('[Manual Sync] Scheduler recovery sweep failed:', recoveryErr.message);
        }

        res.json({ success: true, ...results });
      } catch (e: any) {
        const msg = e?.message || 'Manual sync failed';
        console.error('Manual sync error:', msg);
        // Detect invalid_grant = tokens expired, user must re-authorize
        if (msg.includes('invalid_grant')) {
          return res.status(401).json({
            success: false,
            tokenExpired: true,
            error: 'Google Calendar authorization has expired. Please disconnect and reconnect your Google Calendar in the Calendar Sync settings.',
            errors: [msg]
          });
        }
        res.status(500).json({ success: false, errors: [msg] });
      }
    });

    // Status endpoint for diagnostics
    app.get('/api/status', (_req, res) => {
      res.json({ 
        status: 'ready',
        uptime: process.uptime(),
        message: 'Client database is accessible'
      });
    });
    
    // SEO 301 redirects for pruned thin blog posts — MUST run before serveStatic's
    // SPA catch-all so /blog/<slug> redirects instead of serving the app shell.
    app.use(seoRedirects);

    // Setup Vite BEFORE starting the server
    console.log('🔧 Setting up Vite frontend...');
    let viteReady = false;
    if (process.env.NODE_ENV === "production" && process.env.PORT) {
      console.log('📦 Production mode - serving static files from dist');
      try {
        serveStatic(app);
        console.log('✅ Static file serving configured');
      } catch (e: any) {
        console.error('❌ Failed to setup static serving:', e?.message || e);
      }
    } else {
      // Development mode - setup Vite dev server
      try {
        await setupVite(app, null as any); // Pass null for server, will be set later
        viteReady = true;
        console.log('✅ Vite dev server setup complete');
      } catch (e: any) {
        console.error('❌ Vite setup failed (development). Continuing without Vite:', e?.message || e);
      }
    }

    // Periodic self health-check to diagnose listener drops
    const HEALTHZ_URL = `http://${host === '0.0.0.0' ? '127.0.0.1' : host}:${port}/healthz`;
    const healthzCheck = setInterval(() => {
      try {
        const req = http.get(HEALTHZ_URL, (res) => {
          // Only log failures to keep noise low
          if (res.statusCode && res.statusCode >= 400) {
            console.warn(`[HEALTHZ] Non-200 status: ${res.statusCode}`);
          }
          // Drain response
          res.resume();
        });
        req.setTimeout(2500, () => {
          try { req.destroy(new Error('healthz timeout')); } catch {}
        });
        req.on('error', (err) => {
          console.warn(`[HEALTHZ] Request error: ${err?.message || err}`);
        });
      } catch (e: any) {
        console.warn('[HEALTHZ] Check threw:', e?.message || e);
      }
    }, 10000);

    // Keep reference to prevent GC
    (global as any).__healthzCheck = healthzCheck;

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      // Enhanced error logging for production debugging
      console.error('Server Error:', {
        status,
        message,
        stack: err.stack,
        url: _req.url,
        method: _req.method,
        timestamp: new Date().toISOString()
      });

      res.status(status).json({ message });
    });

    // Additional runtime info after initial async init completes
  console.log(`✅ New Age Fotografie CRM post-init. Environment: ${process.env.NODE_ENV}`);
  console.log(`Working directory: ${process.cwd()}`);
  console.log(`Demo mode: ${process.env.DEMO_MODE}`);
  console.log(`Database URL configured: ${!!process.env.DATABASE_URL}`);
  
  // Removed signal handlers to diagnose crash - server should stay alive
  console.log('🟢 Server running and ready for connections');

  // Background jobs (cron tasks) disabled to prevent startup issues
  // Jobs can be loaded separately if needed
  console.log('ℹ️ Background jobs (cron) are disabled');

  // Start background Google Calendar sync scheduler if enabled via env
  try {
    if (process.env.GOOGLE_SYNC_ENABLED === 'true') {
      startSyncScheduler();
      console.log('📅 Google Calendar sync scheduler started');
    } else {
      console.log('📅 Google Calendar sync scheduler is disabled (GOOGLE_SYNC_ENABLED!=true)');
    }
  } catch (err: any) {
    console.warn('⚠️ Failed to start Google sync scheduler:', err?.message || err);
  }
  
  } catch (error: any) {
    console.error('❌ Failed to start server:', error?.message || error);
    console.error('Stack trace:', error?.stack || 'no stack');
    // Do not exit; leave process up so health/debug can be queried
  }
  
  console.log('✅ Async IIFE completed - server should stay alive');
})();

console.log('📍 Module loaded - keepalive will be installed');

// CRITICAL: Keep process alive AND monitor server - prevent tsx from exiting
console.log('🔒 Installing process keepalive with server monitoring...');
const KEEPALIVE_INTERVAL = Number(process.env.KEEPALIVE_INTERVAL_MS || (process.env.NODE_ENV === 'development' ? 30000 : 15000));
let __lastKeepaliveKey: string | null = null;
let __devTick = 0;
const keepalive = setInterval(() => {
  if (!serverInstance) return;
  const addr = serverInstance.address();
  const key = addr ? (typeof addr === 'string' ? addr : `${addr.address}:${addr.port}`) : 'none';
  const verbose = process.env.KEEPALIVE_VERBOSE === 'true';
  const isDev = process.env.NODE_ENV === 'development';
  __devTick++;

  if (key !== __lastKeepaliveKey) {
    if (addr) {
      console.log(`[KEEPALIVE] ✅ Server listening on ${key}`);
    } else {
      console.warn('[KEEPALIVE] ⚠️ Server instance exists but NOT listening!');
    }
    __lastKeepaliveKey = key;
    return;
  }

  if (verbose) {
    if (addr) console.log(`[KEEPALIVE] ✅ Server listening on ${key}`); else console.warn('[KEEPALIVE] ⚠️ Server instance exists but NOT listening!');
    return;
  }

  // In dev, log every ~4 minutes to show liveness without noise
  if (isDev && __devTick % 8 === 0) {
    if (addr) console.log(`[KEEPALIVE] ✅ Server listening on ${key}`); else console.warn('[KEEPALIVE] ⚠️ Server instance exists but NOT listening!');
  }
}, KEEPALIVE_INTERVAL);

// Prevent garbage collection
(global as any).__keepalive = keepalive;

console.log('✅ Keepalive installed - process should never exit');

// Additional process/signal diagnostics to detect shutdown causes
['SIGINT','SIGTERM','SIGHUP','SIGUSR2'].forEach((sig) => {
  try {
    process.on(sig as any, () => {
      console.warn(`[SIGNAL] Received ${sig}. Server listening:`, (global as any).__server?.listening);
    });
  } catch {}
});
process.on('beforeExit', (code) => {
  console.warn('[PROCESS] beforeExit code:', code);
});
process.on('exit', (code) => {
  console.warn('[PROCESS] exit code:', code);
});
process.on('uncaughtExceptionMonitor', (err) => {
  console.warn('[PROCESS] uncaughtExceptionMonitor:', err?.message || err);
});