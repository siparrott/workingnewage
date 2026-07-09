# TogNinja Productization — Master Execution Plan

*The single source of truth we drive to completion. Living checklist — we tick items as we finish them. Grounded in [VIABILITY_STUDY.md](VIABILITY_STUDY.md), [BUILD_KICKOFF.md](BUILD_KICKOFF.md), [ONBOARDING_SPEC.md](ONBOARDING_SPEC.md).*

## How we work
- **🧑 You** = accounts, tokens, secrets, product decisions, DNS, testing/approval.
- **🤖 Me** = code, scripts, config, docs; I run what I can and hand you exact commands for the rest.
- **Gates** = we don't advance a phase until its gate is green and you've approved.
- Legend: `[ ]` todo · `[~]` in progress · `[x]` done · **🧑/🤖** = owner.

---

## Status snapshot (done so far)
- [x] 🤖 Scoped integration API keys implemented (`integration_api_keys`, `authOrApiKey`, mint script).
- [x] 🤖 IA handoff + contract confirmation, onboarding spec, viability study, build kickoff (docs).
- [x] 🤖 Blog: Pulse distribution, cadence scheduler, sortable list (existing feature work).

---

## Phase 0 — Foundations & isolated demo *(start here)*
**Goal:** a private, containerized template + a live, isolated "tenant-zero" instance IA can connect to. Prod untouched.

### 0A. Decisions & accounts (unblock everything)
- [ ] 🧑 Confirm **service delivery** = private container image (not source pull). *(Recommended.)*
- [ ] 🧑 Create a **private registry** namespace (GHCR / Docker Hub private / ECR) + a pull token.
- [ ] 🧑 Create a **Render account** for tenant-zero + a **Render API key**.
- [x] 🧑🤖 **Supabase** project live (`alhofnvlxmrjutxtosum`, eu-north-1) — 🤖 pushed schema (72 tables) + seeded baseline (admin / config / prices / vouchers) via the **portable driver over the Session pooler**. **Runtime-validated against Supabase** (`node-postgres — SSL on`, inserts OK). Use the pooler URL (port 5432) as `DATABASE_URL`.
- [ ] 🧑 Decide **Render deploy-auth flow**: customer pastes a Render API token vs OAuth handshake.

### 0B. Template repo
- [x] 🧑 Private template repo **`siparrott/studioOS-platform`** created (Private).
- [x] 🤖 Mirror-pushed `main` → `template` (full history, incl. Dockerfile / CI / bootstrap).
- [x] 🤖 Tagged & pushed **`v0.1.0`** → triggers the first CI image build.

### 0C. Containerize (the keystone)
- [x] 🤖 Write a **Dockerfile** for the single Express service (build React → serve from Express).
- [x] 🤖 Add CI to **build + push the private image** on tag (`.github/workflows/build-image.yml` → GHCR).
- [~] 🧑 Verify image builds in CI + pulls with creds. (`v0.1.0` = Neon; **`v0.2.0` = portable/Supabase-ready**, building now.)

### 0C.1 Portable DB (Supabase-ready) — DONE
- [x] 🤖 Runtime swapped Neon serverless → **node-postgres** (`server/db.ts` + `server/db-compat.ts` shim; all server + agent `neon()`/`neon-http` users repointed). Works with Supabase / Neon / any Postgres.
- [x] 🤖 On branch **`portable-pg`**, tag **`v0.2.0`** → building the Supabase-ready image. **Not on `origin/main` — prod stays on Neon.**
- Deferred (non-runtime; no effect on tenant-zero): `dist-server/`, `hub/`, root dev scripts, stale `agent/integrations/pricing.js`.

### 0D. Tenant-zero reference instance — LIVE ✅
- [x] 🤖 Deploy steps for the **image** documented → [TENANT_ZERO_RUNBOOK.md](TENANT_ZERO_RUNBOOK.md) (`DEMO_MODE=true`, health check `/api/health`).
- [x] 🤖 **Deployed via the Render API** — service `tenant-zero` (`srv-d97mkqt7vvec73chebp0`, Frankfurt), image `:v0.3.0`, GHCR pull credential, boot env set (`SESSION_SECRET`/`ENCRYPTION_KEY` auto-generated).
- [x] 🤖 `bootstrap` script (`npm run bootstrap [-- --demo]`) — ran against Supabase; schema + baseline + demo content seeded.
- [x] 🤖 **Confirmed live** at **https://tenant-zero.onrender.com** — `/api/health` 200, root 200, `/api/blog/posts` returns the 2 demo posts from Supabase (full stack: container → Express → portable driver → Supabase). Still branded "New Age" (expected until Phase 1).

### 0E. Gated-services spine
- [ ] 🤖 Extend `authOrApiKey`/`integration_api_keys` with scopes: `ai-agent`, `ia`, `shootcleaner`, `pixelseal`.
- [ ] 🤖 Add an **entitlement check** (periodic; revoked/expired key disables *that* premium feature, not the app).
- [ ] 🧑 Mint an **IA scoped key** for tenant-zero; IA does a dry-run publish (3 posts + 1 landing page).

### 0F. Provisioning blockers found during tenant-zero bootstrap — FIXED (v0.3.0)
- [x] 🤖 **Schema FK type mismatch — fixed:** `scheduler_bookings.client_id` `text` → `uuid` (matches `crm_clients.id`). A fresh push now applies **100% cleanly** (72 tables + all FKs, validated on Supabase); no other mismatches surfaced.
- [x] 🤖 **`bootstrap` script — fixed:** `db:push` → `scripts/db-push.mjs` wrapper (drizzle-kit `push:pg` + required flags + TLS, args-array/no-shell); `demo:setup` rewritten to the current schema (crmClients / crmLeads / galleries / blogPosts, uuid ids, idempotent, resilient) and runs via tsx; bootstrap's demo step is best-effort (non-fatal). **Validated end-to-end on Supabase:** `bootstrap --demo` → schema + baseline + clients:3/leads:2/galleries:2/blog:2, exit 0.
- **Tenant-zero re-bootstrapped clean** — fresh schema (all FKs) + baseline + demo content. Deploy image **`v0.3.0`** (portable + these fixes). Sessions/invoices demo intentionally omitted (low value; complex required FKs).
- [ ] 🤖 **Boot-robustness bug (found at deploy):** `server/routes/price-wizard.ts` (and `agent/core/knowledge-base.ts`) instantiate the OpenAI client at **import time**, so the app **crashes on boot if `OPENAI_API_KEY` is unset** — breaks the "boots degraded without optional keys" promise. Placeholder keys set on tenant-zero to unblock; **lazy-init the AI clients in Phase 1** so tenants boot cleanly regardless.

**GATE 0:** tenant-zero live from a private image + IA read/write proven + entitlement stub working. ✅ → Phase 1.

---

## Phase 1 — De-hardcode (blank, data-driven template)
**Goal:** the app wears any business's identity from config — no "New Age / Wien" in source. Iterate on tenant-zero.

- [ ] 🤖 **Domain/URLs** → single `PUBLIC_SITE_URL` (kills ~94 hardcodes: `vite.ts SITE_ORIGIN`, sitemap, canonicals, JSON-LD, CORS, zernio ORIGIN).
- [ ] 🤖 **Studio identity** → business name, address, coords, phone, emails from `studio_config` (header, footer, `index.html`, invoices, schema).
- [ ] 🤖 **Branding assets** → logo/favicon/OG image config-driven (not static files).
- [ ] 🤖 **SEO/JSON-LD/sitemap** → per-tenant from config + published content; add landing pages to the dynamic sitemap.
- [ ] 🤖 **Locale** → make `de-AT` default configurable.
- [ ] 🤖 **Hardcoded studioId default** (`550e8400-…`) → real per-instance id.
- [ ] 🤖 **The 40+ German "Wien" service pages** → remove as fixed pages (become IA-generated per tenant).
- [ ] 🧑 Review a re-skinned tenant-zero under a dummy brand to confirm nothing says "New Age".

**GATE 1:** tenant-zero fully re-brandable from `studio_config` + env; no business hardcodes remain. ✅ → Phase 2.

---

## Phase 2 — Provisioning + onboarding UI
**Goal:** one command stands up a new customer instance; a clean first-run wizard personalises it.

### 2A. `provision-tenant` (Render API)
- [ ] 🤖 Script: create Render web service from the private image in the customer's account → attach the tenant DB (Supabase / Neon / any Postgres) → set Bucket-A boot secrets → deploy → `bootstrap` → create admin → mint + register gated-service keys → return `{ url, admin creds }`.
- [ ] 🧑 Provide a test customer Render token; we provision a second throwaway instance end-to-end.

### 2B. Onboarding wizard (build on the existing setup routes — don't greenfield)
- [ ] 🤖 First-run detection → auto-route fresh instances into the wizard.
- [ ] 🤖 Stage screens mapped to [ONBOARDING_SPEC.md §3](ONBOARDING_SPEC.md): Identity & brand → Integrations → Content & context → IA generate & rebrand → Go-live.
- [ ] 🤖 Wire each field to `studio_config` / encrypted `studio_integrations` (reuse existing test-connection endpoints).
- [ ] 🤖 Finish **OAuth connect** flows for Google (and Stripe if used) — currently store-only.
- [ ] 🤖 Prices import + portfolio upload + "existing URL → IA crawl" context step.
- [ ] 🤖 Stage-4 automation: IA generates the tenant's cluster, replaces demo content, rewrites schema/sitemap to their domain.
- [ ] 🤖 Go-live checklist screen (DNS/SSL, all tests green, flip `DEMO_MODE=false`, publish).
- [ ] 🧑 Run a full onboarding on the throwaway instance as if you were a new customer.

**GATE 2:** a brand-new instance goes from provision → personalised, IA-integrated, published site via the wizard. ✅ → Phase 3.

---

## Phase 3 — Licensing, updates, care packets
- [ ] 🤖 Entitlement/licence tokens per instance (issue, expire, revoke) tied to the gated-service keys.
- [ ] 🤖 Update channel: new image version → customers pull/redeploy; paid major-version gate.
- [ ] 🧑 Define care-packet tiers (managed onboarding, priority support, content sprints) + pricing.
- [ ] 🧑 Draft the licence agreement (incl. DB-access consent + audit).

**GATE 3:** a customer can be issued, updated, and revoked; commercial wrapper defined. ✅ → Phase 4.

---

## Phase 4 — Beta
- [ ] 🧑 Recruit beta testers.
- [ ] 🤖/🧑 Provision each an instance; run onboarding; collect feedback.
- [ ] 🤖 Iterate on wizard friction + de-hardcode gaps surfaced by real brands.

---

## Blocking product decisions (needed by the phase shown)
| Decision | Needed by | Owner |
|---|---|---|
| Private image vs source delivery | Phase 0 | 🧑 (recommend image) |
| Render deploy-auth (token vs OAuth) | Phase 0/2 | 🧑 |
| PixelSeal scope (what PS gates) | Phase 0E | 🧑 |
| Which services mandatory vs upsell | Phase 0E/3 | 🧑 |
| DB-access model (read-only + consent + audit) | Phase 3 | 🧑 |
| Shared vs customer-own AI keys | Phase 2 | 🧑 |

---

## Immediate next action
**Deploy tenant-zero (Gate 0D)** — see [TENANT_ZERO_RUNBOOK.md](TENANT_ZERO_RUNBOOK.md). 🧑 finish the **Supabase** project + the **read:packages** PAT → deploy a Render service from **`ghcr.io/siparrott/studioos-platform:v0.2.0`** (portable image) against the Supabase URL → `npm run bootstrap -- --demo` → connect IA. 🤖 standing by to adjust the image if the CI build surfaces anything.
