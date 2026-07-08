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
- [ ] 🧑 Create a **Neon** project/DB for tenant-zero (separate from prod).
- [ ] 🧑 Decide **Render deploy-auth flow**: customer pastes a Render API token vs OAuth handshake.

### 0B. Template repo
- [ ] 🧑 Create the **private template repo** (mirror current code). Confirm prod repo stays separate + frozen.
- [ ] 🤖 Add `PRODUCT_README` + tag `v0-baseline`.

### 0C. Containerize (the keystone)
- [ ] 🤖 Write a **Dockerfile** for the single Express service (build React → serve from Express).
- [ ] 🤖 Add CI to **build + push the private image** on tag.
- [ ] 🧑 Verify the image pulls with issued creds.

### 0D. Tenant-zero reference instance
- [ ] 🤖 Provide a `render.yaml` / deploy steps for the **image** (not source), `DEMO_MODE=true`, health check.
- [ ] 🧑 Deploy tenant-zero to Render from the image; set boot env (`DATABASE_URL`, `SESSION_SECRET`, encryption key).
- [ ] 🤖 Wrap `db:push → db:init → demo seed` into one `bootstrap` script; you run it against tenant-zero.
- [ ] 🧑 Confirm tenant-zero loads (still branded "New Age" — expected).

### 0E. Gated-services spine
- [ ] 🤖 Extend `authOrApiKey`/`integration_api_keys` with scopes: `ai-agent`, `ia`, `shootcleaner`, `pixelseal`.
- [ ] 🤖 Add an **entitlement check** (periodic; revoked/expired key disables *that* premium feature, not the app).
- [ ] 🧑 Mint an **IA scoped key** for tenant-zero; IA does a dry-run publish (3 posts + 1 landing page).

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
- [ ] 🤖 Script: create Render web service from the private image in the customer's account → attach Neon DB → set Bucket-A boot secrets → deploy → `bootstrap` → create admin → mint + register gated-service keys → return `{ url, admin creds }`.
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
**Phase 0A + 0B.** You: create the private template repo, the private registry token, a Render API key, and a Neon DB for tenant-zero. Me: I'll write the Dockerfile + `bootstrap` script the moment the repo exists (or I can draft them here now against this codebase so they're ready to drop in). Tell me which and we start.
