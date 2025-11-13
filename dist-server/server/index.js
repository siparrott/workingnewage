"use strict";
// Console silencing temporarily disabled for debugging
// import '../silence-console.js';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
// Import routes and jobs directly to fix client database access
const routes_1 = require("./routes");
require("./jobs");
const vite_1 = require("./vite");
// Mount lightweight auth routes immediately (full routes registered later lazily)
const auth_1 = __importDefault(require("./routes/auth"));
// Google Calendar 2-way sync: OAuth routes and scheduler
const googleAuth_1 = __importDefault(require("./routes/googleAuth"));
const syncScheduler_1 = require("./services/syncScheduler");
// Agent V2: Modern ToolBus architecture
const agent_v2_1 = __importDefault(require("./routes/agent-v2"));
const agent_shadow_1 = __importDefault(require("./routes/agent-shadow"));
// Import and configure session middleware
const auth_2 = require("./auth");
// Import email service for initialization
const enhancedEmailService_1 = require("./services/enhancedEmailService");
const smsService_1 = require("./services/smsService");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("./db");
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
const app = (0, express_1.default)();
// MODULE-LEVEL server reference to prevent garbage collection
let serverInstance = null;
// Behind reverse proxies (Heroku/Render/etc.) trust the first proxy so secure cookies work when appropriate
app.set('trust proxy', 1);
// Increase body size limits to accommodate large ICS payloads
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ extended: false, limit: '5mb' }));
// Add CORS headers for API requests
app.use((req, res, next) => {
    // Echo back the request origin to support credentials; default to * if none
    const origin = req.headers.origin || '*';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
// Health & ping endpoints before anything else for diagnostics
app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok-preinit', uptime: process.uptime(), bootMs: Date.now() - BOOT_MARK });
});
// Session middleware must be before auth routes (still early but after healthz)
app.use(auth_2.sessionConfig);
// Early auth routes so backend login functions even before lazy route load
app.use('/api/auth', auth_1.default);
app.use('/api/auth/*', (req, _res, next) => { console.log('[AUTH-EARLY]', req.method, req.originalUrl); next(); });
// Google Calendar OAuth routes
app.use('/api/auth', googleAuth_1.default);
// Agent V2 routes (ToolBus architecture)
app.use('/api/agent/v2', agent_v2_1.default);
console.log('[AGENT-V2] Routes registered at /api/agent/v2');
// Shadow mode routes (V1 vs V2 comparison)
if (process.env.AGENT_V2_SHADOW === 'true') {
    app.use('/api/agent/shadow', agent_shadow_1.default);
    console.log('[SHADOW MODE] Routes registered at /api/agent/shadow');
    console.log('[SHADOW MODE] V1 and V2 will run in parallel for comparison');
}
// Serve uploaded files statically
app.use('/uploads', express_1.default.static('public/uploads'));
// Serve blog images statically (before Vite middleware)
app.use('/blog-images', express_1.default.static('server/public/blog-images', {
    setHeaders: (res, path) => {
        if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.setHeader('Content-Type', 'image/jpeg');
        }
        else if (path.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        }
    }
}));
// Domain redirect middleware - redirect root domain to www
app.use((req, res, next) => {
    if (req.headers.host === 'newagefotografie.com') {
        return res.redirect(301, `https://www.newagefotografie.com${req.url}`);
    }
    next();
});
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse = undefined;
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
            (0, vite_1.log)(logLine);
        }
    });
    next();
});
(async () => {
    try {
        // Note: global error handlers already set above and do NOT exit the process
        console.log('🚀 Starting New Age Fotografie CRM server...');
        // Initialize services with error handling
        try {
            await enhancedEmailService_1.EnhancedEmailService.initialize();
            console.log('✅ Email service initialized');
        }
        catch (error) {
            console.warn('⚠️ Email service initialization failed:', error.message);
        }
        try {
            await smsService_1.SMSService.initialize();
            console.log('✅ SMS service initialized');
        }
        catch (error) {
            console.warn('⚠️ SMS service initialization failed:', error.message);
        }
        // Skip complex database migrations for now to avoid startup issues
        try {
            // Quick database test
            await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT 1 as test`);
            console.log('✅ Database connection verified');
        }
        catch (error) {
            console.warn('⚠️ Database connection issue:', error.message);
        }
        // Register routes immediately to restore client database access
        console.log('🔄 Registering routes immediately...');
        try {
            await (0, routes_1.registerRoutes)(app);
            console.log('✅ Routes registered successfully - Client database should now be accessible');
        }
        catch (routeError) {
            console.error('❌ Failed to register routes:', routeError.message);
            console.error('Route registration stack:', routeError.stack);
            // Continue without routes - at least serve health endpoints
        }
        // Setup Vite BEFORE starting the server
        console.log('🔧 Setting up Vite frontend...');
        let viteReady = false;
        if (process.env.NODE_ENV === "production" && process.env.PORT) {
            console.log('📦 Production mode - looking for dist folder');
        }
        else {
            // Development mode - setup Vite dev server
            try {
                await (0, vite_1.setupVite)(app, null); // Pass null for server, will be set later
                viteReady = true;
                console.log('✅ Vite dev server setup complete');
            }
            catch (e) {
                console.error('❌ Vite setup failed (development). Continuing without Vite:', e?.message || e);
            }
        }
        // Start listening ASAP - SYNCHRONOUS direct call
        const port = parseInt(process.env.PORT || '3001', 10);
        const host = process.env.HOST || (process.env.PORT ? '0.0.0.0' : '127.0.0.1');
        console.log(`🎯 Creating HTTP server on ${host}:${port}...`);
        // Direct synchronous listen - no await, no promises
        serverInstance = app.listen(port, host);
        // Event handlers
        serverInstance.on('listening', () => {
            const addr = serverInstance.address();
            console.log(`✅ HTTP server LISTENING on ${host}:${port}`);
            console.log(`🔍 Server address:`, addr);
            console.log(`🔍 Server listening:`, serverInstance.listening);
        });
        serverInstance.on('error', (err) => {
            console.error('❌ HTTP server error:', err);
            console.error('Error code:', err.code);
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use!`);
            }
        });
        serverInstance.on('close', () => {
            console.warn('⚠️ Server "close" event fired - port released!');
        });
        // Also keep in global for extra safety
        global.__server = serverInstance;
        const server = serverInstance; // For compatibility with code below
        console.log(`🔧 Server object created, waiting for 'listening' event...`);
        // Manual Google Calendar sync endpoint (per-user)
        app.post('/api/calendar/manual-sync', auth_2.requireAuth, async (req, res) => {
            try {
                const userId = req.user?.id;
                if (!userId)
                    return res.status(401).json({ error: 'Not authenticated' });
                const results = await (0, syncScheduler_1.triggerManualSync)(userId);
                res.json(results);
            }
            catch (e) {
                console.error('Manual sync error:', e?.message || e);
                res.status(500).json({ success: false, errors: [e?.message || 'Manual sync failed'] });
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
        app.use((err, _req, res, _next) => {
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
        // Start background Google Calendar sync scheduler if enabled via env
        try {
            if (process.env.GOOGLE_SYNC_ENABLED === 'true') {
                (0, syncScheduler_1.startSyncScheduler)();
                console.log('📅 Google Calendar sync scheduler started');
            }
            else {
                console.log('📅 Google Calendar sync scheduler is disabled (GOOGLE_SYNC_ENABLED!=true)');
            }
        }
        catch (err) {
            console.warn('⚠️ Failed to start Google sync scheduler:', err?.message || err);
        }
    }
    catch (error) {
        console.error('❌ Failed to start server:', error?.message || error);
        console.error('Stack trace:', error?.stack || 'no stack');
        // Do not exit; leave process up so health/debug can be queried
    }
    console.log('✅ Async IIFE completed - server should stay alive');
})();
console.log('📍 Module loaded - keepalive will be installed');
// CRITICAL: Keep process alive AND monitor server - prevent tsx from exiting
console.log('🔒 Installing process keepalive with server monitoring...');
const keepalive = setInterval(() => {
    // Monitor server health
    if (serverInstance) {
        const addr = serverInstance.address();
        if (addr) {
            console.log(`[KEEPALIVE] ✅ Server listening on ${typeof addr === 'string' ? addr : `${addr.address}:${addr.port}`}`);
        }
        else {
            console.warn('[KEEPALIVE] ⚠️ Server instance exists but NOT listening!');
        }
    }
}, 15000); // Check every 15 seconds
// Prevent garbage collection
global.__keepalive = keepalive;
console.log('✅ Keepalive installed - process should never exit');
