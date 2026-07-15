# SmartTog Platform — Developer Handoff Document

**Prepared:** March 3, 2026
**Author:** GitHub Copilot (Senior Full-Stack Engineer — AI Pair)
**Repository:** `workingnewage` (TogNinja / SmartTog Platform)
**Production URL:** https://newagefotografie.com
**Deployment:** GitHub → Heroku (Node.js) + Neon PostgreSQL + Backblaze B2

---

> **⚠️ This document is mid-hardening (status as of July 14, 2026).**
> Sections 8–12 and the endpoint table predate the July 2026 hardening work.
> Rather than rewrite them in place while changes are still landing, all
> hardening is tracked in the **Hardening Log** below, and §10 carries an updated
> status banner. **Until hardening is declared complete, trust the Hardening Log
> and the §10 status banner over the original prose in §8–§12.** A full rewrite
> of §8–§12 and the endpoint table is deferred until then, so onboarding docs
> don't drift with every commit.

---

## Hardening Log — Changes since March 3, 2026

_Running log so the eventual §8–§12 rewrite is accurate and cheap. Newest first.
Each entry maps to commits on `main`._

### July 15, 2026
- **Revenue by Service from invoice line items** — `GET /api/reports/revenue-by-service` sums `crm_invoice_items` (quantity×unit_price) on PAID invoices grouped by line-item description; Reports pie now real (invoices have no service field).
- **Email→order revenue attribution (order-tracking mechanism)** — new end-to-end chain so campaigns report real revenue: boot migration adds `voucher_sales.campaign_id`; client captures `utm_campaign`/`nac` into a 30-day window (`client/src/lib/attribution.ts`, called in `main.tsx`) and threads it into the voucher checkout payload; the id flows into Stripe session `metadata.campaign_id` (`stripeVoucherService`) and is persisted on the `voucher_sales` row in both the webhook and the manual Stripe-sync insert; campaign links are auto-tagged with `utm_campaign` on send; `GET /api/reports/email-campaign-revenue` sums paid revenue per campaign and the Reports email table shows it. Generic/onboarding-ready; revenue is 0 until campaigns send tagged links and buyers purchase. **Dependency:** bulk campaign send is still a TODO stub — link-tagging is applied on the working test-send path, so real attribution starts once bulk send is implemented (or links are shared manually).
- **Reports dashboard now shows real DB metrics** — every section was reading wrong/placeholder fields. Fixed: vouchers (Drizzle camelCase `createdAt`/`finalAmount`/`isRedeemed`/`paymentStatus` — was `created_at`/`amount` → NaN dates/€0; revenue counts paid sales), lead conversion (lowercase `'converted'`, group by `form_type`), clients-by-source (`leadSource`), top clients (name from `firstName`+`lastName`), client retention (real new-vs-returning; was `Math.random()`), email campaigns (fetch `/api/admin/email/campaigns` → `sentCount`/`openedCount`/`clickedCount`; revenue not tracked), gallery performance (new `GET /api/reports/gallery-analytics` joins `galleries`+`gallery_analytics` for real views/email-captures; was hardcoded). Overview swapped fake "Satisfaction 4.8"/"Avg Duration 14d" cards for real Total Revenue / Total Clients. **Known data limits:** email campaigns have no revenue column; invoices have no service-type field (Revenue-by-Service groups as "Other"); "inquiries" is proxied by gallery email captures.
- **Messaging is now onboarding-ready** — the setup wizard's Extras step saves SMS creds to `studio_integrations`, but `SMSService` only read the legacy `sms_config` table / env, so SMS silently didn't work after onboarding. Bridged it: `SMSService.initialize()` now reads the onboarding provider via `config-reader` (`sms_provider`/`sms_account_sid`/`sms_auth_token`/`sms_from_number`) — same pattern SMTP already uses — for both Twilio and Vonage. `getSMSConfig` reports that state too. Full chain now works: **ExtrasStep UI → /extras → studio_integrations → config-reader → SMSService → send.** Email is likewise onboarding-driven (EmailStep → SMTP/Brevo → smtp-helper, with the SMTP fallback). Honesty: the Communications page no longer claims email "sent successfully" in demo mode. **Known limitation:** WhatsApp still needs an approved Business sender and isn't wired for the Twilio path (SMS-first per current priority).

### July 14, 2026
- **Communications Center — email** — "Send Email" failed with "API Key is not enabled" (a Brevo error) even though SMTP works. `EnhancedEmailService` routed through Brevo whenever `BREVO_API_KEY` merely existed (even if invalid) and returned Brevo's error with no fallback. Now: prefer Brevo only if it truly initialises, always build the SMTP transporter too, and fall back to SMTP if a Brevo send fails.
- **Communications Center — WhatsApp/SMS** — the `sendSMS` controller dropped `messageType`, so "WhatsApp Message" was silently sent as SMS. Now forwarded. Also added a **Twilio env branch** to `SMSService.initialize()` (`TWILIO_ACCOUNT_SID`/`AUTH_TOKEN`/`FROM_NUMBER`) so SMS can be enabled via config vars, and removed a `console.log` that printed the Vonage API key. **Still needed for delivery:** a configured provider (Twilio chosen). WhatsApp additionally needs an approved Business sender; the current WhatsApp code targets the Vonage sandbox and is not production-wired.
- **Automations email editor** — replaced the plain-text "Write" box (which did a lossy HTML→text→HTML round-trip: ragged pagination + silently destroyed the CTA button/`{{questionnaireLink}}`) with the shared **`AdvancedRichTextEditor` WYSIWYG** (headings, bold/italic, colour, alignment, lists, links, images, tables, undo, HTML source). Templates are now edited exactly as they render, so spacing is controlled directly; a "Preview (sample data)" toggle substitutes the `{{placeholders}}`. Body stays HTML end-to-end.
- **Questionnaire link fixed** — `/q/pre-shoot` (the default Pre-Shoot automation link) showed "Questionnaire not found or expired" because no active `questionnaires` row with that slug existed and the request fell through to the SPA token lookup. Server now seeds a default active **pre-shoot** questionnaire at startup so the link resolves end-to-end.
- **Setup wizard endpoints gated** — every mutating `/api/setup/technical/*` endpoint (credential saves `/domain` `/email` `/stripe` `/storage` `/extras`, admin creation `/security`, and the SSRF-prone `/test/{smtp,stripe}` probes) was unauthenticated. Now gated with one rule: open on a fresh install (no admin yet, so first-run onboarding works), require auth once an admin account exists. Read-only status endpoints and `POST /complete` (fires right after admin creation, before any session) are exempt.
- **Email test-send honesty** — "Send Test" previously always reported success even when SMTP was unconfigured and the mail silently fell into demo mode. Demo-mode returns now carry `demo:true` + an honest error; the send endpoint and UI report true delivery.
- **Accounting Export** — Validate/Preview + Generate/Download fixed (profile enum had drifted out of sync with registered adapters; also fixed an N+1 line-item fetch that exhausted the DB pool).
- **Lead Sources** — new performance dashboard (bar + pie + table), date-range filter (this year / last year / last 12m), leads-vs-revenue combined view, €/lead column.
- **Top Clients** — removed redundant "By Total Revenue" sort option.
- **Price List Wizard** — per-service summary table (our price vs market low/median/high), "what's included" surfacing, own-price-guide comparison, and fixed the OpenAI 404 (a Responses-only model in `OPENAI_MODEL`) that had produced 0 extracted prices.
- **Heroku build** — `heroku-postbuild` prerender step made best-effort (falls back to a plain build) so a puppeteer navigation timeout can't fail the whole deploy.

### July 13, 2026
- **Galleries** — Phase 1 (pro cover, larger templates, reliable expiry), Phase 2a (visible watermark + protected delivery + working ZIP download), Phase 2b (invisible forensic QIM watermark, private-ready delivery).
- **Price Wizard** — wired **AxixOS Intelligence** as the discovery + crawl provider (replacing Tavily); real re-read, manual path, honest per-competitor status.
- **Top Clients** — fixed inflated lifetime value caused by an invoices×sessions SQL fan-out (separate pre-aggregated subqueries), plus a follow-up WHERE-clause fix.
- **Blog scheduler** — stopped future-dated posts from publishing today; enabled cleanup reschedule.
- **Intelligent Merge Wizard** — confidence-scored duplicate-client detection, safe audited merge, undo.

### July 12, 2026
- **Pre-migration hardening** — response compression, rate limiting, webhook signature verification, thumbnail generation.
- **Checkout crash** — moved all hooks above conditional returns.
- **Vouchers** — photo-upload fix (JSON/DOCTYPE + downscale), QR → waitlist page, single-page PDF redesign.

> **Environment / secrets note:** during July 2026 work several live secrets were
> pasted into chat (Render API key, a GitHub PAT, a Supabase password, the AxixOS
> internal key). These were **flagged for rotation and must not be committed to
> git**. Whether they were actually rotated is **unverified** — confirm before sign-off.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Map](#2-architecture-map)
3. [Tech Stack](#3-tech-stack)
4. [Repository Structure](#4-repository-structure)
5. [Database Design](#5-database-design)
6. [External Integrations](#6-external-integrations)
7. [Environment Configuration](#7-environment-configuration)
8. [Recent Work Completed](#8-recent-work-completed)
9. [Known Issues & Technical Debt](#9-known-issues--technical-debt)
10. [Security Findings (CRITICAL)](#10-security-findings-critical)
11. [Demo Duplication Viability](#11-demo-duplication-viability)
12. [Prioritised Action Items](#12-prioritised-action-items)
13. [Appendices](#appendices)

---

## 1. Project Overview

SmartTog is an **all-in-one photography studio management platform** built as a single-tenant SaaS application. Currently deployed for a single customer (New Age Fotografie, Vienna). The business goal is to duplicate the platform into a demo environment for inviting other photographers to purchase, eventually evolving into a multi-tenant BYOC (Bring Your Own Cloud) model controlled by a central "SmartTog Hub".

### Feature Set

| Module | Description | Status |
|--------|-------------|--------|
| CRM | Client & lead management, interaction history, lead-to-client conversion | ✅ Complete |
| Invoicing | Creation, Stripe payments, PDF generation, recurring invoices | ✅ Complete |
| Galleries | Upload, organise, client sharing, download, watermarking | ✅ Complete |
| Email Marketing | Campaigns, templates, send, basic analytics | ✅ Complete |
| Blog / CMS | CRUD, AI-powered generation, SEO optimisation, auto-publish | ✅ Complete |
| Scheduling | Configurable booking types, Google Calendar sync, availability | ✅ Complete |
| Vouchers | Create, PDF, sell online (Stripe), redeem | ✅ Complete |
| Automations | Workflow builder, triggers, email/SMS actions | ✅ Complete |
| AI Agent | V2 ToolBus agent, safe mode, shadow mode (GPT-4o / Claude) | ✅ Complete |
| Questionnaires | Create, share, collect responses | ✅ Complete |
| Reports & Dashboard | Revenue, bookings, lead analytics | ✅ Complete |
| Client Portal | Client self-service area | ✅ Complete |
| Public Website | Multi-page, SEO, responsive, manual page CMS | ✅ Complete |
| Accounting Export | Austrian-compliant financial export | ✅ Complete |
| Price List Wizard | Competitor research + AI-assisted pricing | ✅ Complete |
| Onboarding Wizard | 7-step technical + 5-phase creative setup | ✅ Complete |
| Digital File Delivery | Upload + client download via secure links | ✅ Complete |
| Multi-language | Mixed German/English — no i18n framework | ⚠️ Partial |
| Testing | No tests exist | ❌ None |

---

## 2. Architecture Map

### Current State (Single Instance)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HEROKU APP                                  │
│  web dyno ─── Node.js Express (API) + Vite (React SPA)            │
│                                                                     │
│  Procfile: web: node dist/index.js                                 │
│  Build:    heroku-postbuild → cross-env HEROKU=true npm run build  │
│            → npx vite build --mode production                      │
└────────────────────┬────────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────────────────────────────┐
        │            │    EXTERNAL SERVICES                │
        │            ▼                                     │
        │  ┌──────────────┐  ┌──────────────┐             │
        │  │ Neon Postgres │  │ Backblaze B2 │             │
        │  │ (single DB)   │  │ (S3-compat)  │             │
        │  └──────────────┘  └──────────────┘             │
        │                                                  │
        │  ┌─────────┐ ┌────────┐ ┌──────────┐           │
        │  │ Stripe   │ │ OpenAI │ │Anthropic │           │
        │  │ (LIVE)   │ │GPT-4o  │ │ Claude   │           │
        │  └─────────┘ └────────┘ └──────────┘           │
        │                                                  │
        │  ┌──────────┐ ┌────────────┐ ┌───────┐         │
        │  │ Easyname │ │ Google Cal │ │Vonage │         │
        │  │ SMTP     │ │ OAuth+Sync │ │ SMS   │         │
        │  └──────────┘ └────────────┘ └───────┘         │
        │                                                  │
        │  ┌──────────┐ ┌────────┐ ┌───────────┐         │
        │  │ Tavily   │ │ Serper │ │ Geoapify  │         │
        │  │ Research │ │ Search │ │ Geocoding │         │
        │  └──────────┘ └────────┘ └───────────┘         │
        └──────────────────────────────────────────────────┘
```

### Target State (Prod + Demo)

```
┌──────────────────────┐          ┌──────────────────────┐
│   PROD (New Age)     │          │   DEMO (SmartTog)    │
│                      │          │                      │
│  Heroku App A        │          │  Heroku App B        │
│  Neon DB A           │          │  Neon DB B (seeded)  │
│  B2 Bucket A         │          │  B2 Bucket B         │
│  Stripe LIVE keys    │          │  Stripe TEST keys    │
│  Real SMTP           │          │  Mailtrap / disabled │
│  Google Calendar     │          │  Disabled / mock     │
│  DEMO_MODE=false     │          │  DEMO_MODE=true      │
└──────────────────────┘          └──────────────────────┘
         │                                  │
         └──── Same GitHub repo (main) ─────┘
              env-driven behaviour only
```

---

## 3. Tech Stack

### Server

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Runtime | Node.js | >=20 (Heroku resolves to LTS 24.14.0) | Specified in `engines.node` |
| Framework | Express.js | 4.x | |
| ORM | Drizzle ORM | Latest | Type-safe, Postgres adapter |
| Database | PostgreSQL (Neon) | 16 | Serverless, pooled connection |
| Auth | express-session + bcrypt | | Session-based, no JWT for web |
| Email | Nodemailer | Latest | 4 different service files (debt) |
| Payments | Stripe SDK | Latest | Live keys in prod |
| AI | OpenAI SDK + Anthropic SDK | Latest | GPT-4o-mini default |
| Storage | AWS SDK v3 (S3-compatible) | | Backblaze B2 endpoint |
| Build | TypeScript → esbuild | | `server/` compiled to `dist/` |

### Client

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | React | 18.x | |
| Build | Vite | 5.4.x | CJS deprecation warning (cosmetic) |
| Styling | Tailwind CSS | 3.x | |
| Components | shadcn/ui | Latest | ~40 primitive components |
| Data Fetching | @tanstack/react-query | Latest | Consistent throughout |
| Routing | react-router-dom | 6.x | |
| State | React hooks (no Redux) | | Context API for global state |
| Icons | Lucide React | Latest | |
| Charts | Recharts | Latest | Dashboard analytics |

### Infrastructure

| Service | Provider | Notes |
|---------|----------|-------|
| Hosting | Heroku | Single web dyno |
| Database | Neon | Free/Pro tier, `eu-central-1` |
| Object Storage | Backblaze B2 | S3-compatible API, bucket: `TogNinja` |
| DNS/Domain | External | newagefotografie.com |
| CI/CD | None | Manual `git push` to Heroku |
| Monitoring | None | No Sentry, no uptime monitoring |
| Logging | `console.log` | No structured logging |

---

## 4. Repository Structure

### Top-Level Layout

```
workingnewage/
├── client/                     # React SPA (Vite)
│   ├── src/
│   │   ├── App.tsx             # Router — all routes defined here
│   │   ├── main.tsx            # Entry point
│   │   ├── index.css           # Tailwind base styles
│   │   ├── components/
│   │   │   ├── admin/          # Admin-specific components (~30 files)
│   │   │   ├── auth/           # Auth guards (NeonProtectedRoute)
│   │   │   ├── layout/         # Navbar, Footer, Sidebar, AdminLayout
│   │   │   ├── public/         # Public-facing components
│   │   │   └── ui/             # shadcn/ui primitives (~40 files)
│   │   ├── contexts/           # React context providers
│   │   ├── hooks/
│   │   │   ├── useDateFormatSync.ts     # Date preference sync
│   │   │   ├── useTechnicalSetupGuard.ts # Setup redirect guard
│   │   │   └── use-toast.ts             # Toast notifications
│   │   ├── lib/
│   │   │   ├── dateFormat.ts   # Centralised date formatting
│   │   │   ├── leads.ts        # Lead API functions
│   │   │   ├── queryClient.ts  # React Query configuration
│   │   │   └── utils.ts        # cn() class merge utility
│   │   └── pages/
│   │       ├── admin/          # Admin pages (~25 files)
│   │       ├── public/         # Public-facing pages (~15 files)
│   │       ├── setup/          # Onboarding wizard (2-stage)
│   │       └── portal/         # Client portal pages
│   └── index.html              # SPA entry (needs dynamic meta)
│
├── server/
│   ├── index.ts                # Express app + Vite middleware + startup
│   ├── routes.ts               # ⚠️ ~15,000+ lines — ALL API routes
│   ├── db.ts                   # Drizzle DB connection (Neon)
│   ├── auth.ts                 # Session + bcrypt auth
│   ├── config-reader.ts        # DB-first config with env fallback
│   ├── technical-setup-routes.ts  # Stage 1 onboarding API
│   ├── setup-routes.ts            # Stage 2 onboarding API
│   ├── hub-integration.ts      # SmartTog Hub communication
│   ├── autoblog.ts             # AI blog generation
│   ├── storage.ts              # Database storage layer
│   ├── jobs/
│   │   └── index.ts            # Background job scheduler (cron)
│   ├── routes/
│   │   ├── auth.ts             # Auth endpoints
│   │   ├── googleAuth.ts       # Google OAuth flow
│   │   ├── agent-v2.ts         # AI Agent V2 endpoints
│   │   ├── agent-shadow.ts     # Agent shadow mode
│   │   ├── manual-pages.ts     # CMS page management
│   │   ├── onboarding.ts       # Onboarding session management
│   │   ├── emailTest.ts        # Email test endpoint
│   │   └── files.ts            # File upload/download
│   ├── services/
│   │   ├── calendarService.ts      # Google Calendar 2-way sync
│   │   ├── email-basic.ts          # Simple email sender
│   │   ├── enhancedEmailService.ts # Rich email with templates
│   │   ├── smsService.ts           # Vonage SMS
│   │   ├── syncScheduler.ts        # Calendar sync scheduler
│   │   └── WorkflowExecutionService.ts  # Automation engine
│   ├── utils/
│   │   ├── encryption.ts       # AES-256-GCM encrypt/decrypt
│   │   ├── emailService.ts     # Legacy email utility
│   │   └── smtp-helper.ts      # SMTP transporter factory
│   ├── migrations/             # SQL migration files
│   └── seed/                   # (empty — needs demo seed)
│
├── shared/
│   └── schema.ts               # Drizzle schema (~2200 lines, all tables)
│
├── hub/                        # SmartTog Hub (orchestration layer, WIP)
│   └── src/
│       └── db/schema.ts        # Hub-specific schema
│
├── agent/                      # AI Agent modules
│   └── core/
│       ├── tools.ts            # Agent tool definitions
│       ├── session-manager.ts  # Session management
│       └── planner.ts          # Task planning
│
├── dist/                       # Compiled server output
├── dist-server/                # Alternative compiled output
│
├── .env                        # ⚠️ COMMITTED — contains LIVE secrets
├── package.json                # Dependencies + scripts
├── Procfile                    # Heroku: web: node dist/index.js
├── vite.config.ts              # Vite build configuration
├── tailwind.config.ts          # Tailwind configuration
├── drizzle.config.ts           # Drizzle Kit configuration
├── tsconfig.json               # TypeScript configuration
│
├── add-onboarding-columns.sql  # Migration: onboarding schema
├── db-schema.js                # Legacy schema setup script
├── setup-tenant.js             # Tenant provisioning script
├── setup-database.js           # Database initialisation
└── *.ts / *.js                 # ~100+ ad-hoc check/migration scripts
```

### Key Files for Any Incoming Developer

| File | Why It Matters |
|------|---------------|
| `server/routes.ts` | **Start here.** Contains ~95% of all API logic. ~15,000 lines. |
| `shared/schema.ts` | All database table definitions (Drizzle). ~2,200 lines. |
| `client/src/App.tsx` | All frontend routes. Shows the full page structure. |
| `server/index.ts` | Server startup, middleware, migration runner. |
| `server/config-reader.ts` | New config system — DB-first with env fallback. |
| `server/technical-setup-routes.ts` | New onboarding wizard (Stage 1). |
| `client/src/hooks/useTechnicalSetupGuard.ts` | Frontend guard that redirects to setup if not onboarded. |
| `.env` | All environment variables (⚠️ contains live secrets — see Security section). |

---

## 5. Database Design

### Technology
- **PostgreSQL 16** on Neon (serverless, pooled)
- **Drizzle ORM** for schema definition and queries
- **No formal migration system** — ad-hoc SQL files + `drizzle-kit push`

### Schema Overview (~35 tables)

| Category | Tables | Key Schema File Location |
|----------|--------|------------------------|
| **Auth** | `users`, `admin_users` | `shared/schema.ts` L1-30 |
| **Studio Config** | `studios`, `studio_configs`, `studio_integrations` | `shared/schema.ts` L32-160 |
| **CRM** | `crm_clients`, `crm_leads`, `client_interactions`, `lead_sources` | `shared/schema.ts` L164-220 |
| **Financial** | `invoices`, `invoice_items`, `payments`, `expenses` | `shared/schema.ts` L222-400 |
| **Content** | `blog_posts`, `blog_categories` | `shared/schema.ts` L402-480 |
| **Media** | `galleries`, `gallery_images`, `digital_files` | `shared/schema.ts` L482-600 |
| **Communication** | `email_campaigns`, `email_templates`, `email_sends`, `sms_messages` | `shared/schema.ts` L602-750 |
| **Scheduling** | `schedulers`, `bookings`, `calendar_events` | `shared/schema.ts` L752-900 |
| **Automation** | `automations`, `workflow_steps`, `workflow_executions` | `shared/schema.ts` L902-1050 |
| **Commerce** | `vouchers`, `voucher_products`, `services`, `packages` | `shared/schema.ts` L1050-1200 |
| **Forms** | `questionnaires`, `questionnaire_responses`, `questionnaire_links` | `shared/schema.ts` L1200-1350 |
| **System** | `notifications`, `admin_notifications_state`, `email_settings`, `homepage_images` | various |

### Tenancy Model

**Single-tenant.** No `tenant_id` or `studio_id` foreign key on data tables. Each deployment has its own isolated DB. The `studio_configs` and `studio_integrations` tables are singletons (1 row each).

### Key Columns Added by Onboarding Work

```sql
-- studio_configs (added by recent onboarding commit)
technical_setup_complete  BOOLEAN DEFAULT FALSE
creative_setup_complete   BOOLEAN DEFAULT FALSE
app_url                   TEXT
frontend_url              TEXT
public_site_base_url      TEXT
ga4_measurement_id        TEXT
meta_pixel_id             TEXT
date_format               TEXT DEFAULT 'auto'
```

### Migration Strategy (Current)

- **No version-controlled migrations.** Schema changes applied via:
  1. `drizzle-kit push` (compares schema.ts to live DB, applies ALTER)
  2. Ad-hoc SQL files run manually (e.g., `add-onboarding-columns.sql`)
  3. Startup migrations in `server/index.ts` (ALTER TABLE IF NOT EXISTS)
- **No rollback capability.** No migration history table.
- **Recommendation:** Adopt `drizzle-kit generate` + `drizzle-kit migrate` for proper versioned migrations.

---

## 6. External Integrations

| Integration | Provider | Purpose | Key Env Vars | Demo Treatment |
|-------------|----------|---------|--------------|----------------|
| **Database** | Neon PostgreSQL | Primary data store | `DATABASE_URL` | Separate Neon project |
| **Payments** | Stripe | Invoices, voucher sales, subscriptions | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `VITE_STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET` | Use test-mode keys |
| **Email (SMTP)** | Easyname | Transactional + campaign email | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | Mailtrap or disable |
| **Object Storage** | Backblaze B2 | Gallery images, files, voucher PDFs | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`, `AWS_S3_ENDPOINT`, `AWS_REGION` | Separate bucket |
| **AI (LLM)** | OpenAI | Blog gen, agent, pricing wizard | `OPENAI_API_KEY`, `OPENAI_MODEL` | Same key (rate-limit) or separate |
| **AI (LLM)** | Anthropic | Agent alternate model | `ANTHROPIC_API_KEY` | Same or disable |
| **Calendar** | Google Calendar | 2-way booking sync | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALENDAR_ID` | Disable in demo |
| **SMS** | Vonage | SMS notifications | `VONAGE_API_SECRET` | Disable in demo |
| **Search** | Tavily | Competitor price research | `TAVILY_API_KEY` | Same key OK |
| **Search** | Serper | SERP analysis | `SERPER_API_KEY` | Same key OK |
| **Geocoding** | Geoapify | Location services | `GEOAPIFY_API_KEY` | Same key OK |

### Files Where External Calls Are Made

| File | External Call | Must Gate in Demo |
|------|--------------|-------------------|
| `server/utils/emailService.ts` | SMTP send | ✅ Yes |
| `server/services/email-basic.ts` | SMTP send | ✅ Yes |
| `server/services/enhancedEmailService.ts` | SMTP send | ✅ Yes |
| `server/services/WorkflowExecutionService.ts` | SMTP + SMS | ✅ Yes |
| `server/services/smsService.ts` | Vonage SMS | ✅ Yes |
| `server/routes.ts` (~L6200) | Stripe checkout | ✅ Yes (use test keys) |
| `server/routes.ts` (~L6400) | Stripe invoice | ✅ Yes (use test keys) |
| `server/services/calendarService.ts` | Google Calendar API | ✅ Yes |
| `server/services/syncScheduler.ts` | Calendar sync cron | ✅ Yes |
| `server/autoblog.ts` | OpenAI API | ⚠️ Rate-limit |
| `server/routes/agent-v2.ts` | OpenAI / Anthropic | ⚠️ Rate-limit |

---

## 7. Environment Configuration

### How Config Works (3 layers)

```
Priority:  DB (studio_configs/studio_integrations)
              ↓ fallback
           Environment vars (.env / Heroku config)
              ↓ fallback
           Hardcoded defaults in code
```

The new `server/config-reader.ts` implements this layered approach, but **adoption is incomplete** — many parts of the codebase still read `process.env.*` directly.

### Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `NODE_ENV` | ✅ | `production` / `development` |
| `PORT` | ⚠️ | Default 3001, Heroku sets automatically |
| `SESSION_SECRET` | ✅ | Express session encryption key |
| `JWT_SECRET` | ✅ | JWT signing key (API tokens) |
| `STRIPE_SECRET_KEY` | ✅ | Stripe API (live or test) |
| `STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe public key |
| `VITE_STRIPE_PUBLIC_KEY` | ✅ | Same as above (Vite build-time) |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ | Webhook signature verification |
| `SMTP_HOST` | ⚠️ | Mail server hostname |
| `SMTP_PORT` | ⚠️ | Mail server port |
| `SMTP_USER` | ⚠️ | Mail username |
| `SMTP_PASS` | ⚠️ | Mail password |
| `EMAIL_FROM` | ⚠️ | Sender address + name |
| `OPENAI_API_KEY` | ⚠️ | OpenAI API key |
| `AWS_ACCESS_KEY_ID` | ⚠️ | B2 storage key |
| `AWS_SECRET_ACCESS_KEY` | ⚠️ | B2 storage secret |
| `AWS_S3_BUCKET` | ⚠️ | B2 bucket name |
| `AWS_S3_ENDPOINT` | ⚠️ | B2 S3-compatible endpoint |
| `AWS_REGION` | ⚠️ | B2 region |
| `DEMO_MODE` | Optional | `true` enables demo safety gates |
| `ALLOW_DEMO_LOGIN` | Optional | `true` bypasses auth |
| `GOOGLE_*` | Optional | Google Calendar integration |
| `VONAGE_*` | Optional | SMS integration |

### Flags Needed for Demo (Not Yet Implemented)

```bash
DEMO_MODE=true              # Gate: email/SMS/calendar sends
SEED_MODE=demo              # Auto-seed demo data on first boot
TOGNINJA_BRAND=demo         # Brand identity (demo vs newage vs blank)
```

---

## 8. Recent Work Completed

### Session Summary (March 3, 2026)

| Commit | Description | Files Changed |
|--------|-------------|---------------|
| `5e8729f` | **Comprehensive 2-stage onboarding system** — Technical Setup Wizard (7 steps: DB, domain, email, Stripe, storage, extras, security) + Creative Setup Wizard (5 phases: basics, integrations, scanning, fix-first, drafts). Includes encryption utility, config-reader, SMTP helper, ~60 brand hardcode replacements. | 35 files, 3996 insertions, 287 deletions |
| `7b4e210` | **Fix build + Add lead-to-client conversion** — Fixed broken import path in `MySubscriptionPage.tsx` (`./../../lib/dateFormat` → `../lib/dateFormat`). Added `POST /api/leads/:id/convert-to-client` endpoint + UserPlus button on Admin Leads page with spinner, duplicate detection, and toast feedback. | 3 files, 129 insertions, 2 deletions |
| (staged) | **Fix onboarding guard blocking existing instances** — Added startup migrations for onboarding columns, auto-detection of existing instances (marks setup complete if infra already configured), persists creative setup completion to DB, reads `creativeSetupComplete` flag to avoid `setupMode` resetting on restart. | 3 files (index.ts, technical-setup-routes.ts, setup-routes.ts) |

### Pending Commit (Staged, Not Pushed)

The onboarding guard fix is staged but **was not pushed** (user skipped the terminal command). This fix is critical for the user to access their existing database through the admin dashboard without being redirected to the setup wizard.

**Action required:** Push the staged commit:
```bash
git add -A
git commit -m "Fix onboarding guard blocking existing instances"
git push
```

---

## 9. Known Issues & Technical Debt

### Critical Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 1 | **`.env` with live secrets is committed to git** | `.env` (repo root) | Anyone with repo access has full system access |
| 2 | **SESSION_SECRET = Stripe live key** | `.env` line 13 | Session forgery + Stripe compromise linked |
| 3 | **No rate limiting** on auth/lead/webhook endpoints | `server/routes.ts` | Brute force / spam / DoS |
| 4 | **DEMO_MODE=true + ALLOW_DEMO_LOGIN=true** may be set in prod | `.env` / Heroku | Auth bypass in production |

### High-Priority Debt

| # | Issue | Location | Effort |
|---|-------|----------|--------|
| 5 | `server/routes.ts` is ~15,000 lines (monolith) | `server/routes.ts` | Large (16h) |
| 6 | 4 different email service implementations | `server/utils/emailService.ts`, `server/services/email-basic.ts`, `server/services/enhancedEmailService.ts`, `server/services/WorkflowExecutionService.ts` | Medium (4h) |
| 7 | ~15 email templates are inline HTML strings in routes.ts | `server/routes.ts` (scattered) | Medium (8h) |
| 8 | No input validation on most API endpoints | All POST/PUT routes | Medium (6h) |
| 9 | Remaining "New Age Fotografie" hardcoded references | Footer, Navbar, email templates, AI prompts, OG tags | Medium (8h) |
| 10 | No automated tests (zero) | N/A | Large (40h+ for baseline) |
| 11 | `config-reader.ts` partially adopted — many `process.env.*` calls remain | Various server files | Medium (4h) |
| 12 | No DB indexes beyond primary keys | `shared/schema.ts` | Small (2h) |
| 13 | Creative setup `setupMode` only persisted in-memory (fixed in staged commit) | `server/setup-routes.ts` | ✅ Fixed (pending push) |
| 14 | No migration version tracking | N/A | Medium (4h) |
| 15 | ~100+ ad-hoc check/migration scripts in repo root | `check-*.js`, `add-*.ts`, `run-*.ts` | Small (2h cleanup) |

### Low-Priority Debt

| # | Issue | Notes |
|---|-------|-------|
| 16 | No CDN for static assets | Performance at scale |
| 17 | No image optimisation pipeline (thumbnails, WebP) | Gallery performance |
| 18 | No structured logging (all `console.log`) | Debugging in production |
| 19 | No error tracking (Sentry/etc.) | Unknown error rate |
| 20 | No CI/CD pipeline | Manual deploys only |
| 21 | Background jobs run on web dyno | Resource contention under load |
| 22 | Mixed German/English, no i18n framework | Market expansion blocker |

---

## 10. Security Findings (CRITICAL)

> **Status update — July 14, 2026 (verified against the codebase).** The original
> findings below were written March 3, 2026. Current, checked state:
>
> | Finding | Status (July 14, 2026) |
> |---------|------------------------|
> | Remove `.env` from git / purge from history | ✅ **Resolved / moot** — `.env` was **never committed** (verified via `git log --all --full-history -- .env`, empty), is listed in `.gitignore`, and is absent from the working tree. `.env.example` contains placeholders only (`change-me-random-string`, `postgres://user:pass@host`). |
> | Rotate ALL credentials | ⚠️ **Confirm externally** — no live secrets in the repo, but keys pasted into chat during July work (Render, GitHub PAT, Supabase, AxixOS) should be rotated in their provider consoles. Not verifiable from the codebase. |
> | Verify prod `DEMO_MODE` / `ALLOW_DEMO_LOGIN` off | ⚠️ **Confirm externally** — Heroku CLI not available in this environment. Run `heroku config -a newagefotografie \| grep -iE "DEMO_MODE\|ALLOW_DEMO_LOGIN"` (should be empty/false). |
> | `express-rate-limit` on auth + public endpoints | 🟡 **Partial** — `server/index.ts` applies a global cap (300/min) to everything plus a strict cap (30 / 15 min) on `/api/auth` POSTs; Stripe webhooks + image proxy exempted. Public form endpoints (contact, questionnaire, voucher) rely on the blunt global cap only — a per-endpoint limiter would be stronger. |
> | Webhook signature verification | ✅ **Present** — Stripe `webhooks.constructEvent` on webhook routes; raw body preserved and webhooks exempt from rate-limit/JSON parsing. |
> | Response compression | ✅ **Present** — `compression()` in `server/index.ts`. |
> | Request body size limits | ✅ **Present** — `express.json({ limit: '50mb' })` (generous; tighten per-route if desired). |
> | Add `helmet` security headers | 🔴 **Not done** — `helmet` is not installed/applied. |
> | Add CSRF protection | 🔴 **Not done** — no `csurf`/CSRF token; session-cookie auth means state-changing routes are CSRF-exposed. |
> | Audit routes for missing `requireAuth` | ✅ **Setup wizard closed (July 14)** — **all** mutating `/api/setup/technical/*` endpoints (credential saves, admin creation, SMTP/Stripe probes) are now gated: open on a fresh install (no admin yet), require auth once an admin exists. Read-only status endpoints and post-admin `POST /complete` are exempt so first-run onboarding can't lock itself out. A broader repo-wide route audit is still advisable. |
>
> **Net:** the March "🔴 immediate" list is largely addressed. Remaining genuine gaps: **`helmet`** and **CSRF** (both not started), tighter **per-endpoint rate limits** on public forms, and two **externally-verifiable** items (credential rotation, prod DEMO flags). The remediation instructions below remain valid reference for those.

### 🔴 Immediate Actions Required

#### 1. Remove `.env` from Git

```bash
# Add to .gitignore
echo ".env" >> .gitignore

# Remove from tracking
git rm --cached .env
git commit -m "Remove .env from tracking"

# Purge from history (use BFG Repo-Cleaner)
# https://rtyley.github.io/bfg-repo-cleaner/
bfg --delete-files .env
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

#### 2. Rotate ALL Credentials

Every key in the `.env` file must be considered compromised and rotated:

| Credential | Rotation Method |
|-----------|----------------|
| Stripe keys | Stripe Dashboard → Developers → API Keys → Roll keys |
| Neon DB password | Neon Console → Connection Settings → Reset password |
| SMTP password | Easyname hosting panel |
| OpenAI API key | OpenAI Dashboard → API Keys → Create new, delete old |
| Anthropic API key | Anthropic Console → API Keys |
| Backblaze B2 keys | B2 Console → App Keys → Create new |
| Google OAuth secret | Google Cloud Console → Credentials |
| Vonage API secret | Vonage Dashboard → API Settings |
| Session secret | Generate new: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| JWT secret | Generate new (same command) |

#### 3. Verify Prod Config

```bash
# On Heroku, verify these are NOT set:
heroku config:get DEMO_MODE -a <app-name>        # should be empty or "false"
heroku config:get ALLOW_DEMO_LOGIN -a <app-name>  # should be empty or "false"
```

#### 4. Additional Security Recommendations

| Recommendation | Effort | Priority |
|---------------|--------|----------|
| Add `express-rate-limit` to auth + public form endpoints | 2h | 🔴 Critical |
| Add `helmet` middleware for security headers | 30min | 🟡 High |
| Add CSRF protection | 2h | 🟡 High |
| Audit all routes for missing `requireAuth` middleware | 2h | 🟡 High |
| Add request body size limits | 30min | 🟡 Medium |

---

## 11. Demo Duplication Viability

### Verdict: ✅ Feasible — 6 working days (likely estimate)

The single-tenant, env-driven architecture means a demo is achievable by deploying a second Heroku app from the same `main` branch with different config vars. No multi-tenancy refactor needed.

### What Must Be Built

| Item | Effort | Description |
|------|--------|-------------|
| DEMO_MODE safety gates | 6h | Wrap email/SMS/payment/calendar sends in `if (!DEMO_MODE)` checks |
| Demo seed script | 12h | Realistic placeholder data (clients, invoices, galleries, etc.) |
| Brand abstraction | 8h | Remaining "New Age" references → config-driven |
| Email template extraction | 8h | Inline HTML → template files with variable injection |
| Seed runner + release phase | 2h | Auto-seed on first deploy |
| Demo banner + reset button | 2h | UI indicators for demo mode |
| Provisioning (Heroku + Neon + B2 + Stripe test) | 3h | Manual setup of isolated services |
| QA + documentation | 4h | Visual walkthrough + deploy guide |
| **TOTAL** | **~45h** | **~6 working days** |

### Time Estimates

| Scenario | Days | Assumptions |
|----------|------|-------------|
| Best case | 4 | Everything goes smoothly, minimal brand leakage, simple seed |
| **Likely** | **6** | Some email templates need rework, seed needs iteration, 1-2 bugs |
| Worst case | 9 | Major refactor in email templates, config-reader issues, B2 complications |

### Recommended Approach

**Single repository, two Heroku apps, env-driven behaviour.**

Do NOT fork/duplicate the repo. Every feature fix would need to be applied twice. Instead, all demo-specific behaviour is behind environment flag checks:

```bash
# Production
DEMO_MODE=false
SEED_MODE=none

# Demo
DEMO_MODE=true
SEED_MODE=demo
```

---

## 12. Prioritised Action Items

### Phase 0: Security Emergency (Day 0 — Do Immediately)

- [ ] Add `.env` to `.gitignore` and remove from git tracking
- [ ] Purge `.env` from git history
- [ ] Rotate ALL API keys and secrets
- [ ] Generate proper `SESSION_SECRET` (not Stripe key)
- [ ] Verify `DEMO_MODE=false` and `ALLOW_DEMO_LOGIN=false` on Heroku prod
- [ ] Push the staged onboarding guard fix commit

### Phase 1: Demo Foundation (Days 1–3)

- [ ] Implement `DEMO_MODE` safety gates (email, SMS, payments, calendar)
- [ ] Complete `config-reader.ts` adoption (replace remaining `process.env.*`)
- [ ] Extract email templates to separate files
- [ ] Eliminate remaining "New Age" brand references
- [ ] Create demo seed script (`server/seed/demo-seed.ts`)

### Phase 2: Demo Deployment (Days 4–5)

- [ ] Provision new Heroku app with isolated config vars
- [ ] Provision new Neon database, run schema push + seed
- [ ] Provision new B2 bucket, upload placeholder images
- [ ] Configure Stripe test mode products/prices
- [ ] Add seed runner to Procfile release phase
- [ ] Add demo banner component + reset demo button

### Phase 3: QA & Handoff (Day 6)

- [ ] Visual walkthrough of every admin page in demo
- [ ] Visual walkthrough of every public page in demo
- [ ] Test lead submission → client conversion → invoice → payment flow
- [ ] Verify no brand leakage, no real sends, no real charges
- [ ] Write deployment documentation

### Phase 4: Engineering Hardening (Week 2+)

- [ ] Add `express-rate-limit` + `helmet`
- [ ] Split `routes.ts` monolith into ~10 module files
- [ ] Consolidate 4 email services into 1
- [ ] Add input validation (Zod) on all endpoints
- [ ] Add DB indexes on key query columns
- [ ] Set up proper migration system (drizzle-kit generate/migrate)
- [ ] Add API integration tests (Vitest + Supertest)
- [ ] Add structured logging (Pino)
- [ ] Clean up ~100 ad-hoc scripts from repo root
- [ ] Set up GitHub Actions CI (lint + test + build)

### Phase 5: Scale Preparation (Month 2+)

- [ ] Image optimisation pipeline (thumbnails, WebP, CDN)
- [ ] Separate worker dyno for background jobs
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] E2E tests (Playwright)
- [ ] i18n framework for multi-language support
- [ ] Multi-tenant architecture for SmartTog Hub BYOC model

---

## Appendices

### A. Build & Deploy Commands

```bash
# Local development
npm run dev                    # Starts Vite dev server + Express

# Production build
npm run build                  # Vite build (client) + esbuild (server)

# Heroku deployment
git push heroku main           # Auto-builds via heroku-postbuild script

# Database schema push
npx drizzle-kit push           # Applies schema.ts changes to live DB

# Database migrations (ad-hoc)
psql $DATABASE_URL -f add-onboarding-columns.sql
```

### B. Key API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/setup/technical/status` | Public | Check if onboarding complete |
| POST | `/api/setup/technical/complete` | Auth | Mark tech setup done |
| GET | `/api/setup/status` | Auth | Creative setup status |
| POST | `/api/setup/complete` | Auth | Mark creative setup done |
| GET | `/api/crm/clients` | Auth | List clients |
| POST | `/api/crm/clients` | Auth | Create client |
| GET | `/api/leads/list` | Auth | List leads |
| POST | `/api/leads/:id/convert-to-client` | Auth | Convert lead → client |
| GET | `/api/invoices` | Auth | List invoices |
| POST | `/api/invoices` | Auth | Create invoice |
| GET | `/api/galleries` | Auth | List galleries |
| POST | `/api/email/campaigns` | Auth | Create campaign |
| GET | `/api/blog/posts` | Auth | List blog posts |
| GET | `/api/dashboard/stats` | Auth | Dashboard analytics |
| POST | `/api/stripe/webhook` | Stripe | Webhook handler |
| GET | `/api/studio-config` | Public | Studio branding/config |

### C. Heroku Configuration

```
Buildpack:     heroku/nodejs
Node:          >=20.0.0 (resolves to LTS)
Procfile:      web: node dist/index.js
Build script:  heroku-postbuild → cross-env HEROKU=true npm run build
Stack:         Heroku-24
```

### D. File Change History (This Session)

| File | Changes Made |
|------|-------------|
| `server/routes.ts` | Added `POST /api/leads/:id/convert-to-client` endpoint |
| `client/src/pages/admin/AdminLeadsPage.tsx` | Added UserPlus button, `handleConvertToClient` handler, loading state |
| `client/src/pages/MySubscriptionPage.tsx` | Fixed import path (`./../../lib/dateFormat` → `../lib/dateFormat`) |
| `server/index.ts` | Added onboarding column migrations at startup + auto-detect existing instances |
| `server/technical-setup-routes.ts` | Added auto-detect logic (≥3 steps configured → mark complete) |
| `server/setup-routes.ts` | Persist `creativeSetupComplete` to DB + read from DB for `setupMode` |

---

*Document prepared for developer review — March 3, 2026*
*GitHub Copilot — AI Pair Programming Assistant*
