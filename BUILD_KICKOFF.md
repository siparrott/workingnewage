# TogNinja Productization — Build Kickoff (start here)

*Handoff to the build team. This is the step-by-step to turn the single-business app into a self-hosted, per-customer product with IA-driven onboarding. Read alongside [ONBOARDING_SPEC.md](ONBOARDING_SPEC.md) and [INFINITE_AUTHORITY_HANDOFF.md](INFINITE_AUTHORITY_HANDOFF.md).*

## Locked decisions
- **Self-hosted, one deployment per customer.** No multi-tenant refactor. Lifetime deal, no app subscription.
- **Private repo.** Source is closed.
- **Provisioning = Render API (deploy auth)** into the customer's own account.
- **Gated services (revocable keys):** the **AI agent**, **Infinite Authority (IA)**, **ShootCleaner (SC)**, **PixelSeal (PS)**. These are the moat + the anti-piracy lever — copying the shell is useless without valid keys you issue and can revoke.
- **Production is frozen.** The current live business (newagefotografie) is a read-only reference. Nothing here touches it — separate repo, DB, storage, keys.

## The one fork to get right on day 1: closed source + their infra
"Private repo" and "deploy to the customer's Render account" only coexist cleanly if Render pulls a **container image from your private registry**, not your source. So:
- ✅ **Ship a Docker image** (private registry, pull creds issued per customer) → customer self-hosts, never sees source.
- ❌ Don't connect the customer's Render to your source repo (exposes code).
- **Gap:** no Dockerfile exists yet → building one is a Phase‑0 task (see below).

---

## Phase 0 — Foundations (do these first, in order)

**0.1 Create the private template repo.**
Mirror the current codebase into a **new private repo** (this is the product SKU, distinct from the live-business repo). Strip business-specific secrets and demo-only content later during P1; for now just establish the repo + a baseline tag. *Output: private repo, prod untouched.*

**0.2 Add a Dockerfile + private image pipeline.**
Containerize the single Express service (serves API + built React). Publish to a private registry (GHCR/Docker Hub private/AWS ECR) via CI on tag. *Output: `ghcr.io/you/togninja:<version>` pullable with issued creds. This is what Render deploys.*

**0.3 Stand up "tenant‑zero" reference instance (Render, from the image).**
Own Neon DB, `DEMO_MODE=true`, Stripe test keys, own storage bucket. Run `db:push → db:init → demo seed`. Point IA at it with a scoped key. *Output: a live, isolated sample that proves the deploy path end‑to‑end and gives IA a target. This is the sample you wanted for dev-mode.*

**0.4 Establish the gated-services spine.**
You already have `integration_api_keys` + the `authOrApiKey(scope)` middleware. Extend that into a small **entitlement layer**: register scopes for `ai-agent`, `ia`, `shootcleaner`, `pixelseal`; add a periodic entitlement check so a revoked/expired key disables *that* premium feature (not the whole app). *Output: the DRM spine everything else slots into.*

---

## Phase 1 — De-hardcode (make it a blank, data-driven template)

Onboarding can only personalise what's configurable. Convert the ⚠️ P1 items in [ONBOARDING_SPEC.md §3](ONBOARDING_SPEC.md) from source hardcodes to `studio_config` + env. Priority order (highest leverage first):
1. **Domain/URLs** → single `PUBLIC_SITE_URL` env + config (kills ~94 `newagefotografie.com` hardcodes: `vite.ts SITE_ORIGIN`, sitemap, canonicals, JSON-LD, CORS, zernio ORIGIN).
2. **Studio identity** → business name, address, coords, phone, emails read from `studio_config` (header, footer, `index.html`, invoices, schema).
3. **Branding assets** → logo/favicon/OG image config-driven, not static files.
4. **SEO/JSON-LD/sitemap** → generated per-tenant from config + published content (add landing pages to the dynamic sitemap).
5. **The 40+ German "Wien" service pages** → remove as fixed pages; they become **IA-generated** per tenant (this is where IA earns its keep).
6. **Hardcoded studioId default** (`550e8400-…`) → real per-instance id.

*Test bed = tenant-zero, never prod.*

---

## Phase 2 — Provisioning + onboarding UI

**2.1 `provision-tenant` (Render API).**
One command/service that: creates a Render web service from the private image in the customer's account (using the Render deploy token), attaches a fresh Neon DB, sets **Bucket‑A boot secrets** (`DATABASE_URL`, `SESSION_SECRET`, encryption key, service keys), triggers deploy, runs `db:push → db:init → baseline seed`, creates the admin, mints + registers the tenant's gated-service keys, and returns `{ url, admin creds }`. *Wraps today's fragmented scripts into one.*

**2.2 Onboarding UI/UX (build on what exists — don't greenfield).**
There's already a technical setup wizard (domain/mail/Stripe/storage/AI/SMS/admin) + a creative setup wizard, with **per-integration test buttons** and encrypted DB storage. Redesign these into **one guided first-run wizard** matching [ONBOARDING_SPEC.md §2](ONBOARDING_SPEC.md) stages.

UX principles for "easy on first land":
- **First-run detection** → auto-route a fresh instance into the wizard (the `SKIP_ONBOARDING`/admin-exists check already exists).
- **Linear but resumable** — progress bar, save-and-return, no dead ends.
- **Test-as-you-go** — every integration has a "Test connection" that must go green (endpoints already exist).
- **Skip-for-now** on optional integrations; app runs degraded, nagging only where needed.
- **One clear "collect" screen per stage** mapped to the spec's field list; nothing hand-edits env.
- **Ends on a Go-live checklist** — domain/DNS, all tests green, flip `DEMO_MODE=false`, publish.

---

## Week-1 checklist (literal next actions)
- [ ] Create private template repo from current code; tag `v0-baseline`. Confirm prod repo is separate + frozen.
- [ ] Write the Dockerfile; get one image building + pushing to a private registry via CI.
- [ ] Provision Neon DB + a Render service from that image = **tenant-zero** (DEMO_MODE, test keys, own bucket).
- [ ] Seed tenant-zero; mint an IA scoped key; confirm IA can read/write against it.
- [ ] Extend `authOrApiKey`/`integration_api_keys` with scopes for `ai-agent`, `ia`, `shootcleaner`, `pixelseal` + an entitlement check stub.
- [ ] Draft the onboarding wizard screens against ONBOARDING_SPEC §3 (design first, then wire to the existing setup routes).

## Still needed from product (don't block Phase 0, but needed by Phase 2)
- **PixelSeal scope** — what does PS actually gate? (No code trace in this repo.)
- **Mandatory vs optional gated services** — which of AI/IA/SC/PS are required for a "working" site vs upsells?
- **DB access model** — read-only support connection vs admin; consent + audit (sensitive; must be in the licence).
- **Render deploy auth flow** — does the customer paste a Render API token during onboarding, or do we run a Render "deploy to your account" OAuth handshake?

---

## Guardrails
- Prod = frozen reference. Never shares repo, DB, bucket, or keys with any tenant.
- Every tenant = own DB + own storage + own gated-service keys.
- Closed source ships as an image; keys are the lock, revocation is the kill-switch.
