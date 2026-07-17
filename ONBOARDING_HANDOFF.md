# Onboarding Handoff — Studio Setup Wizard

**Audience:** whoever operates a new tenant sign-up (Infinite Authority / a new studio owner) and the next engineer to touch onboarding.
**Status as of:** 2026-07-12, branch `portable-pg`.
**One-line summary:** A single wizard at **`/setup`** walks a brand-new studio from empty DB to a fully-configured, content-seeded site. Everything it collects is persisted to the database (secrets encrypted) and hot-reloaded — no `.env` editing required to onboard a tenant.

---

## 1. Where to start (the direct link)

Open the running instance and go to:

```
https://<your-host>/setup
```

- Tenant Zero (demo): `https://tenant-zero.onrender.com/setup`
- Local dev: `http://localhost:3001/setup` (or your dev port)

`/setup/technical` and `/setup/technical/*` redirect to `/setup` — there is **one** wizard now, not three. (`SetupWizard.tsx` and `TechnicalSetupWizard.tsx` still exist as the composed building blocks but are no longer routed to directly.)

Progress survives reload/restart: it is stored in `studio_configs.onboarding_state` (jsonb), so you can close the tab mid-onboarding and resume.

---

## 2. The wizard, step by step

`UnifiedSetupWizard.tsx` composes 11 steps in 4 sidebar groups. Each step calls a backend endpoint, then advances.

| # | Group | Step (key) | What it collects | Backend endpoint | Persisted to |
|---|-------|-----------|------------------|------------------|--------------|
| 1 | Your studio | Welcome (`welcome`) | Nothing — orientation + live status | `GET /api/setup/technical/status` | — |
| 2 | Your studio | Business basics (`basics`) | Studio name, contact, branding basics | `POST /api/setup/basics` | `studio_configs` + `onboarding_state.phases.basics` |
| 3 | Infrastructure | Domain & URLs (`domain`) | `appUrl`, `frontendUrl`, `publicSiteBaseUrl` | `POST /api/setup/technical/domain` | `studio_configs.appUrl/frontendUrl/publicSiteBaseUrl` |
| 4 | Infrastructure | Email (`email`) | SMTP (host/port/user/pass/from), optional IMAP, optional Brevo key | `POST /api/setup/technical/email` | `studio_integrations` (passwords **encrypted**) |
| 5 | Infrastructure | Payments (`stripe`) | Publishable key, secret key, webhook secret | `POST /api/setup/technical/stripe` | `studio_integrations` (secret + webhook **encrypted**) |
| 6 | Infrastructure | File storage (`storage`) | S3/Backblaze provider, access key, secret, bucket, endpoint, region | `POST /api/setup/technical/storage` | `studio_integrations` (secret **encrypted**) |
| 7 | Infrastructure | AI & extras (`extras`) | OpenAI key + other optional integrations | `POST /api/setup/technical/extras` | `studio_integrations` (**encrypted**) |
| 8 | Account | Admin account (`security`) | First admin email + password | `POST /api/setup/technical/security` | admin user row |
| 9 | Content | Integrations (`integrations`) | Confirms which live integrations are wired; recomputes feature flags | `GET /api/setup/integrations` → `POST /api/setup/integrations/complete` | `onboarding_state` |
| 10 | Content | Scan content (`scanning`) | Kicks off a scan of existing site/content | `POST /api/setup/scanning/start` → `GET /api/setup/scanning/status/:scanId` → `POST /api/setup/scanning/complete` | `onboarding_state` |
| 11 | Content | Fix-first (`fix_first`) | Presents top issues; apply/skip each | `GET /api/setup/fix-first/items`, `POST /api/setup/fix-first/apply/:itemId`, `/skip/:itemId`, `/complete` | live data + `onboarding_state` |
| 12 | Content | Starter content (`drafts`) | Publish/skip seeded email templates + blog drafts, then **finish** | `GET /api/setup/drafts`, `POST /api/setup/drafts/:draftId/publish`, `/skip`, then `POST /api/setup/complete` | `email_templates`, `blog_posts`, `onboarding_state` |

**Live "test" buttons** (Infrastructure steps validate before you move on):
- `POST /api/setup/technical/test/smtp` — sends/authenticates a real SMTP check
- `POST /api/setup/technical/test/stripe` — verifies the Stripe keys
- `POST /api/setup/technical/test/storage` — round-trips an object to the bucket
- `POST /api/setup/technical/test/openai` — verifies the OpenAI key

---

## 3. How configuration is stored (important)

Onboarding does **not** write `.env`. Per-tenant configuration lands in the database:

- **`studio_configs`** — identity, URLs, branding, and `onboarding_state` (jsonb progress).
- **`studio_integrations`** — SMTP/IMAP/Brevo/Stripe/storage/OpenAI credentials. **All secrets are encrypted at rest** (`encrypt()` / `*_encrypted` columns).

After every save the server calls `config.invalidate()` so the new values are live immediately — no redeploy, no restart.

**Consequence for migration:** the *platform* env vars (below) still come from the host. The *tenant* credentials come from the wizard/DB. Don't confuse the two.

---

## 4. Platform env vars (set on the host — Render/Heroku, not the wizard)

These are validated at boot by `server/lib/validateEnv.ts`. Fatal ones stop the server; warnings degrade features silently, so heed them on a fresh host:

**Fatal if missing/weak:**
- `DATABASE_URL` — Postgres connection string
- `SESSION_SECRET` — ≥32 chars, must not be an API key

**Warned (feature-degrading) — the classic Heroku→Render carry-over misses:**
- `STRIPE_SECRET_KEY` — absent in prod ⇒ checkout falls back to demo/no-op
- `OPENAI_API_KEY` — absent ⇒ AI features + blog/site translation silently no-op
- `STRIPE_WEBHOOK_SECRET` (`whsec_…`) — absent/invalid ⇒ webhooks won't verify
- `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` — absent ⇒ email won't send
- `PUBLIC_SITE_URL` — the canonical public origin; drives sitemap/robots/canonicals (defaults to `https://www.newagefotografie.com` if unset — **set this per tenant**)

> Tenants configured through the wizard store Stripe/SMTP/OpenAI in `studio_integrations`; the env-var equivalents are the platform-level fallback and are what the boot validator checks. Set both where your architecture expects them.

---

## 5. End-to-end test script (do this to validate a fresh tenant)

1. Point a fresh DB at the instance; set `DATABASE_URL`, `SESSION_SECRET`, `PUBLIC_SITE_URL` on the host.
2. Visit `/setup`. Confirm the sidebar shows all 4 groups and progress is 0.
3. **Business basics** → save; reload the page → progress should persist (proves `onboarding_state`).
4. **Domain** → enter the tenant's public URL(s) → save.
5. **Email** → enter SMTP → click *Test SMTP* → expect success before continuing.
6. **Payments** → enter Stripe test keys → *Test Stripe* → success.
7. **Storage** → enter bucket creds → *Test storage* → success (object round-trips).
8. **AI & extras** → enter OpenAI key → *Test OpenAI* → success.
9. **Admin account** → create the first admin; log in with it in another tab.
10. **Integrations / Scan / Fix-first / Starter content** → walk through; publish at least one starter blog draft.
11. Click **Finish** (`POST /api/setup/complete`). Visit the public site → confirm branding, a published blog post, working checkout, and `/sitemap.xml` shows the tenant's `PUBLIC_SITE_URL` host.

---

## 6. Pre-migration hardening already landed (commit `433bdb4`, `portable-pg`)

The audit "fix before Render migration" shortlist is complete. Relevant to onboarding/ops:

- **Env validation** warns loudly on the Stripe/OpenAI/webhook carry-over misses above.
- **Compression** (gzip/deflate) on all responses.
- **Rate limiting** — global 300/min (Stripe webhooks + `/healthz` exempt), plus 30/15min on `/api/auth` POSTs (brute-force guard).
- **Voucher webhook signature verification** — `/api/vouchers/stripe-webhook` now rejects unsigned/invalid events (400) instead of trusting raw JSON.
- **Sitemap origin** follows `PUBLIC_SITE_URL` — a re-hosted/re-branded tenant never emits the wrong host.
- **Dockerfile prerender** — installs Chromium and runs the prerender build, with a fallback to a plain build so a prerender failure can never break the deploy (relevant on Render).
- **Gallery thumbnails** — `/api/proxy-image?w=…` downscales on the fly; grid thumbnails serve ~600px (full-res stays direct-CDN).

Earlier: the **checkout hooks-order crash** (white screen on DB-voucher checkout) is fixed and deployed (commit `b71fd26`).

---

## 7. Known gaps / follow-ups (not blockers)

- **`@types/compression`** isn't in `package.json` (type-only; runtime uses `tsx`, so harmless). Add it if you switch to a `tsc` build.
- **Prerender-in-Docker is unverified on the actual Render build.** The fallback guarantees the deploy still succeeds without prerender; confirm per-route static HTML actually generates on the first Render build and check the logs for the "prerender build failed" warning.
- **Rate limiter uses in-memory store** — fine for a single Render instance; move to a shared store (Redis) before horizontal scaling.
- **Site-wide AI translation layer + hreflang** (the EN/DE selector controlling all copy) is scaffolded (`server/lib/translate.ts`) and wired for blog; the broader site-wide rollout + About Us optimization remain as the agreed next work stream after migration.

---

## 8. Key files

- `client/src/pages/setup/UnifiedSetupWizard.tsx` — the single wizard (step list + sidebar groups).
- `client/src/pages/setup/technical/*` — infra step UIs (Domain, Email, Stripe, Storage, Extras, Security, Welcome).
- `client/src/pages/setup/phases/*` — content phase UIs (Basics, Integrations, Scanning, FixFirst, Drafts).
- `server/setup-routes.ts` — content/status/scan/fix-first/drafts endpoints (mounted `/api/setup`).
- `server/technical-setup-routes.ts` — infra + live test endpoints (mounted `/api/setup/technical`).
- `server/lib/validateEnv.ts` — boot-time env validation.
- `server/vite.ts` — dynamic sitemap (now `PUBLIC_SITE_URL`-aware) + per-tenant `index.html` identity injection.
- `App.tsx:629-632` — routing: everything under `/setup*` → `UnifiedSetupWizard`.
