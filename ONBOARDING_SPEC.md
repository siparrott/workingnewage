# TogNinja — Onboarding Spec (self-hosted, per-tenant)

*Status: planning artifact. Turns the templated "New Age Fotografie" demo into a personalised, IA-integrated customer site through onboarding. This is the build spec for P1 (de-hardcode) + P2 (finish onboarding), and the checklist handed to each new client.*

---

## 0. Model & decisions locked

- **Self-hosted, one deployment per customer.** No multi-tenant refactor. LTD (lifetime deal), no subscription on the app itself.
- **The demo is the starting template.** Every tenant boots into the seeded "New Age" demo; onboarding rewrites it into their brand + content ("before" → "after").
- **Anti-piracy is by service, not by hosting.** IA does **not** host every customer's site (an LTD can't carry perpetual per-site hosting cost). Instead, high-value features are **revocable gated API services** the self-hosted app calls: **Infinite Authority** (content/SEO), **ShootCleaner** (galleries/culling — already integrated with scoped keys), **PixelSeal** (asset protection — scope TBD), **Pulse** (social distribution). Plus a retained **DB access** lever and a **private repo**. Honest limit: a self-hosted *core* can't be fully DRM'd — the moat is ongoing service value + key revocation + licence agreement, not code obfuscation.
- **Prerequisite:** P1 de-hardcoding must land before onboarding can personalise anything. Onboarding fills config slots; it can't overwrite values that are hardcoded in source. Items below marked ⚠️ **P1** are currently hardcoded and must be made config-driven first.

---

## 1. Deployment model (self-deploy to the customer's own account)

- **Runtime:** single long-running Express service serves the API **and** the built React app (`server/vite.ts`). Requires a persistent web process — the hourly in-process cron (blog auto-publish, IMAP sync) rules out serverless.
- **Heroku (primary):** `app.json` is a deploy manifest → one-click "Deploy to Heroku" into the *customer's* account, provisions Postgres + Redis addons, prompts for boot env. `Procfile: web: npm start`.
- **Render (alt):** `render.yaml` blueprint → one-click into the customer's Render account, `healthCheckPath: /api/health`.
- **Vercel: not used / incompatible.** `vercel.json` exists but describes a serverless shape that conflicts with the long-running cron model. Ignore it (candidate for removal).
- **Schema/seed at first boot:** `db:push` (Drizzle creates all tables) → `db:init` (admin + studio config + baseline) → demo seed. To be wrapped into one `provision-tenant` command (P2).
- **Repo posture vs one-click deploy — open tension:** a "secured/closed" repo and a public "Deploy" button pull against each other. Options in §6.

### Boot secrets (Bucket A — set once at deploy, by the provisioner; NOT the customer's job)
`DATABASE_URL` (addon), `SESSION_SECRET`, **encryption key** (critical: rotating it breaks all stored secrets), and the **service keys** (IA / ShootCleaner / PixelSeal / Pulse). Everything else is captured in the onboarding UI and stored **encrypted in the DB** (`config-reader` reads DB-first, env-fallback).

---

## 2. Onboarding stages (end-to-end flow)

| Stage | Name | Who | What happens |
|---|---|---|---|
| 0 | **Provision** | Automated (you) | Deploy instance to customer's Heroku/Render; create DB; `db:push`; seed demo template; create admin; set Bucket-A secrets; issue + register service keys. |
| 1 | **Identity & brand** | Customer (UI) | Business name, contact, address, brand assets → `studio_config`. |
| 2 | **Integrations** | Customer (UI) | Mail, storage, Stripe, calendar, AI, SMS, analytics → encrypted in DB. Test buttons verify each. |
| 3 | **Content & context** | Customer (UI) | Existing site URL (→ IA crawl for brand/context), prices import, portfolio upload, services. |
| 4 | **IA generate & rebrand** | Automated (IA) | IA generates their topical cluster (blog + landing pages) in *their* name/domain; replaces demo content; rewrites JSON-LD + sitemap + canonicals to their domain; wires gated services. |
| 5 | **Go-live** | Customer + you | Point their domain at the instance (DNS/SSL); run integration self-tests; flip `DEMO_MODE=false`; publish. |

---

## 3. Collection → storage → transformation (the heart of the spec)

*Every field we collect, where it lands, and what it triggers. ⚠️ P1 = currently hardcoded, must be de-hardcoded first.*

### 3.1 Business identity & brand
| Field | Stage | Stored | Transformation / notes |
|---|---|---|---|
| Business name ⚠️ P1 | 1 | `studio_config.business_name` | Header/footer/`index.html`/40 SEO pages currently hardcode "New Age Fotografie" — must read from config |
| Legal name, tagline | 1 | `studio_config` | Footer, invoices, schema |
| Address, city, country ⚠️ P1 | 1 | `studio_config` | LocalBusiness JSON-LD, footer, invoices (currently Vienna hardcoded) |
| Geo coords (Google Maps) ⚠️ P1 | 1 | `studio_config.latitude/longitude` | JSON-LD geo, calendar golden-hour calc (Vienna coords hardcoded in 4 places) |
| Phone, contact emails ⚠️ P1 | 1 | `studio_config` | mailto links, schema, sender fallbacks (`hallo@`/`info@`/`kontakt@` hardcoded in ~32 places) |
| Timezone, currency | 1 | `studio_config` | Scheduling, pricing, cron TZ |
| Language / locale ⚠️ P1 | 1 | `studio_config.locale` | Whole app defaults to `de-AT`; make configurable |
| Logo, favicon, OG image ⚠️ P1 | 1 | storage + `studio_config.logo_url` | Currently static files in `client/public`; make config-driven |
| Brand colours, fonts | 1 | `studio_config` (defaults exist) | Theme tokens; already partly DB-backed |
| Social links ⚠️ P1 | 1 | `studio_config` | Footer (FB/IG/LinkedIn hardcoded) |
| GA4 id, Meta pixel ⚠️ P1 | 1/2 | `studio_config` | `index.html` hardcodes `G-8W76BVNNW9` — move to config |
| Opening hours | 1 | `studio_config` | JSON-LD, booking availability |

### 3.2 Integration credentials (Bucket B — UI, encrypted in DB)
| Field | Stage | Stored | Notes |
|---|---|---|---|
| Stripe (their account) | 2 | `studio_integrations` (encrypted) | Their own Stripe; paste keys or **OAuth connect (P2 gap)** |
| SMTP / IMAP / Brevo | 2 | encrypted | Mail send/receive; test endpoint exists |
| S3 / Backblaze B2 | 2 | encrypted | Their storage bucket (isolation) |
| OpenAI / Anthropic | 2 | encrypted | Can be their key, or a metered service key you issue |
| Google OAuth + Calendar id | 2 | encrypted | Needs **OAuth connect flow (P2 gap)**, not just paste |
| SMS (Vonage / Twilio) | 2 | encrypted | Optional |

### 3.3 Content & context
| Field | Stage | Stored | Transformation |
|---|---|---|---|
| Existing site URL | 3 | onboarding session | Feeds the **existing IA/onboarding crawler** (up to 25 pages → meta, colours, fonts) to bootstrap brand + content context |
| Prices / packages | 3 | `price_list_items`, voucher products | Import; replaces demo prices |
| Portfolio images | 3 | storage → `portfolio_images` | Upload via `/api/upload/image`; replaces demo portfolio |
| Services / categories ⚠️ P1 | 3 | content tables / IA | The 40+ hardcoded German "Wien" service pages are replaced by IA-generated pages for their services |
| Testimonials | 3 | content | Optional import |
| Domain / DNS | 3/5 | `studio_config` + deploy | Their domain → the instance; SSL; canonical/sitemap rewrite |

### 3.4 Service keys (Bucket A — issued by you, gate premium features)
| Service | Gates | Revocable |
|---|---|---|
| Infinite Authority | Content generation + topical SEO | ✅ |
| ShootCleaner | Galleries / culling / digital files (already scoped-key integrated) | ✅ |
| PixelSeal | Asset protection (scope TBD — you define) | ✅ |
| Pulse (AxixOS) | Social distribution | ✅ |

---

## 4. Anti-piracy & entitlement posture

- **Gated services = the real lock.** Premium capability lives behind revocable scoped keys you issue (§3.4). Copying the shell doesn't grant the services; revoke the key → premium features go dark. The core CRM keeps running — that's accepted for self-host.
- **DB access lever (sensitive).** Retaining an access path to each tenant DB enables support, verification, and deactivation. This is powerful and delicate — it **must** be: (a) disclosed and consented in the licence agreement, (b) least-privilege (read-only where possible), (c) audited, (d) secured (rotating creds, no shared superuser). Treat as a support tool, not a backdoor.
- **Light entitlement phone-home (optional).** Instance periodically validates an entitlement token; on expiry it disables *premium* features (not the whole app) and nags. Deters casual copying; the durable control is service revocation + legal.
- **Private repo + controlled delivery** (§6).

---

## 5. Client intake checklist (what we need from them up front)

**Business:** legal + trading name, address, phone, contact emails, timezone, currency, language, opening hours.
**Brand:** logo, favicon, brand colours, social profile URLs, existing website URL.
**Content:** price list / packages, portfolio images, services offered, testimonials (optional).
**Integrations (their accounts):** Stripe, mail (SMTP/IMAP or Brevo), storage (S3/B2), Google (calendar), SMS (optional), GA4 / Meta pixel (optional).
**Domain:** the domain to point at the instance (+ DNS access for go-live).

*Most of this is entered in the onboarding UI and stored encrypted — not hand-edited env.*

---

## 6. Open decisions (need your call)

1. **Repo delivery vs "secured."** One-click deploy buttons pull from a reachable repo. To keep it closed, choose: (a) **private template repo** + automated provisioning via the Heroku/Render API (you push the build to their account, they never get source), (b) **build-artifact deploy** (ship a compiled bundle, not source), or (c) **shared private repo access** per customer (weakest on piracy). Recommend (a).
2. **DB access model.** Read-only support connection vs full admin; consent + security guardrails.
3. **Mandatory vs optional gated services.** Which of IA / ShootCleaner / PixelSeal / Pulse are required for a "working" site vs upsells? (This defines what "the site doesn't work without us" actually means.)
4. **PixelSeal scope.** What does PixelSeal gate exactly? (No code evidence in this repo — you define; I'll wire it like the ShootCleaner scoped-key pattern.)
5. **Shared vs own AI keys.** OpenAI/Anthropic: customer brings their own, or you meter it as a service (cost + margin).

---

## 7. Build sequence this spec implies

- **P1 — de-hardcode** the ⚠️ fields above into `studio_config` + env (`PUBLIC_SITE_URL`, etc.); make branding/SEO/sitemap/JSON-LD data-driven; replace hardcoded studioId default. *Turns the app into a blank, data-driven template.*
- **P2 — finish onboarding:** `provision-tenant` one-command bootstrap; complete Stripe/Google OAuth connect flows; enforce stage order + admin reset; the Stage-4 IA rebrand automation.
- **Then** beta: provision each tester an instance, run the flow, iterate.

*Facts (deploy config, hardcode counts, config-reader behaviour) reflect the backend as of this spec. Items marked ⚠️ P1 / TBD are not done yet.*
