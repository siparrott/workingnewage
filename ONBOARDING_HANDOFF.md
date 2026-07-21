# Onboarding Handoff — Studio Setup Wizard

**Audience:** whoever operates a new tenant sign-up (Infinite Authority / a new studio owner) and the next engineer to touch onboarding.
**Status as of:** 2026-07-19, branch `main` (+ `portable-pg`, kept in ff-sync).
**One-line summary:** A single wizard at **`/setup`** walks a brand-new studio from empty DB to a fully-configured, content-seeded site. Everything it collects is persisted to the database (secrets encrypted) and hot-reloaded — no `.env` editing required to onboard a tenant.

> **What changed since 2026-07-12:** a large hardening + feature pass landed (live Google reviews, image speed, LP-editor fixes, Manual Website Update AI, blog video, per-post Pulse channel picker, deploy boot-check). The onboarding-relevant deltas are captured in **§8 (recent hardening)** and **§7 (per-tenant social publishing gap)**. The wizard flow (§2) is unchanged. Full technical detail lives in `HANDOFF-DOCUMENT.md`.

---

## 1. Where to start (the direct link)

Open the running instance and go to:

```
https://<your-host>/setup
```

- Tenant Zero (demo): `
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

**Optional feature integrations (added in the 2026-07 pass — all degrade gracefully when unset):**
- `GOOGLE_PLACES_API_KEY` — enables **live Google reviews** (rating, count, latest review text) on `/kundenstimmen` + the trust block. Server-side key, API-restricted to *Places API (New)*. Unset ⇒ site shows curated reviews. `GET /api/reviews/google` returns `{configured:false}` when absent. **Per tenant.**
- `GOOGLE_PLACES_PLACE_ID` — optional; defaults to New Age Fotografie's place. **A new tenant MUST set their own** (it identifies whose reviews are pulled). Find it via Google's Place ID finder or `POST https://places.googleapis.com/v1/places:searchText`.
- `PULSE_API_KEY` + `PULSE_PROFILE_<PLATFORM>` + `PULSE_PLATFORMS` / `PULSE_MODE` / `PULSE_AUTODISTRIBUTE` — social distribution (see **§7** — this is the "connect your own channels" question and is **currently env-only, an onboarding gap**).
- Public marketing images are resized on the fly through `images.weserv.nl` (external) via `client/src/lib/imageProxy.ts`; client-gallery thumbnails use the **in-house** `/api/proxy-image?w=` resizer. No env needed; note the external dependency for privacy-sensitive tenants.

> Tenants configured through the wizard store Stripe/SMTP/OpenAI in `studio_integrations`; the env-var equivalents are the platform-level fallback and are what the boot validator checks. Set both where your architecture expects them. The optional keys above are **not yet in the wizard** — they're set on the host today (see §7 gap).

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

## 7. Per-tenant social publishing (Pulse) — status & onboarding gap

**This answers "when we sell the CRM, how does each buyer connect their OWN social channels?"**

The blog "Send to Pulse" buttons push a post's Social Pack to **Pulse / AxixOS Social** (`axixos-social.de`), which then posts to the connected accounts. Where the buttons live:
- **Blog list** — a *Send to Pulse* action per row (`client/src/pages/admin/…` blog list) + a *Social Pack* preview action.
- **Blog editor** (`client/src/components/admin/AdvancedBlogPostForm.tsx`) — a **per-send channel picker** (FB / IG / Threads / LinkedIn / GMB / Pinterest chips, all on by default) added in the 2026-07 pass, so the operator can choose which channels each post goes to.

**How the destination account is chosen (2 things only — neither is per-post UI today):**
1. `PULSE_API_KEY` — the Bearer token authenticates to **one AxixOS workspace**; posts go to whatever accounts are connected *in that workspace*. **If the key belongs to the wrong workspace, posts land on the wrong account** (this is exactly the "posting to ClipForensics instead of New Age Fotografie" symptom — the key was tied to a shared/demo workspace).
2. `PULSE_PROFILE_<PLATFORM>` — optional per-platform account selector (e.g. `PULSE_PROFILE_INSTAGRAM=<id>`). Unset ⇒ Pulse uses the default/only account for that platform in the workspace.

Code: `server/services/pulse.ts` (`buildPulseRows` reads `PULSE_PROFILE_*`; `PULSE_MODE` = draft|schedule|now; `PULSE_AUTODISTRIBUTE` gates auto-send). Route: `POST /api/blog/posts/:id/distribute-pulse` (accepts `{ platforms, mode, dryRun }`).

**To point a tenant at their own channels TODAY (manual, host-level):**
1. In the AxixOS dashboard, in **that tenant's own workspace**, connect their social accounts and note each profile ID.
2. Generate a `PULSE_API_KEY` scoped to that workspace; set it in the host config vars.
3. Optionally set `PULSE_PROFILE_INSTAGRAM` etc. to be explicit.
4. Keep `PULSE_MODE=draft` for the first send and verify it lands under the right accounts before flipping to `schedule`/`now`. The button also supports `dryRun` to inspect the built rows first.

**THE ONBOARDING GAP (build before selling self-serve):** Pulse config is **env-only** today — fine for one operator-managed tenant, wrong for self-serve multi-tenant. A new **wizard step / Settings panel** should let each tenant paste their **own** `PULSE_API_KEY` and pick their channel profile IDs, stored **encrypted in `studio_integrations`** exactly like Stripe/SMTP/OpenAI (§3), and read per-tenant by `pulse.ts` instead of `process.env`. Same pattern applies to `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACES_PLACE_ID` (live reviews) — currently host env, should become per-tenant wizard fields so a buyer wires their *own* Google Business profile.

---

## 8. Recent hardening & feature pass (2026-07-13 → 2026-07-19, on `main`)

Landed since the last handoff. Onboarding/ops-relevant highlights:

- **Deploy boot-check gate** — `scripts/verify-boot.ts` (run in `heroku-postbuild`) imports server modules via `tsx` to catch load-order / TDZ crashes *before* the dyno boots. Added after a module-ordering `const` reference crashed the live site; prevents recurrence.
- **Crawler visibility (server-side body injection)** — `server/vite.ts` injects route meta **and body text** for JS-primary pages (`/blog/:slug`, `/lp/:slug`, `/gutschein/*`) into the initial HTML inside a hidden `data-prerender-fallback` container, so crawlers read content without a browser flash.
- **Manual Website Update** (`/admin/manual-website-update`, backend-controls-frontend CMS): per-field **AI "Refine in my tone" + "Improve SEO ranking"** buttons (`POST /api/manual-pages/enhance-field`); the **About Us founder story is now backend-editable** (new "Founder Story (text)" fields, per language) and the **founder photo** uploads here (`manual.ueberuns.founderPhoto`); **logo preview** now shows the true header look (contain, light+dark) instead of a stretched crop; configurable **Reviews page URL** (`reviews.googleUrl`).
- **Live Google reviews** — `server/services/googleReviews.ts` + `GET /api/reviews/google` (Places API New, 6 h cache, safe fallback). Wired into `/kundenstimmen` + `ReviewsBlock` (rating/count/JSON-LD go live when `GOOGLE_PLACES_API_KEY` is set).
- **Photo load speed** — preconnect to image hosts; `loading=lazy`/`decoding=async` on portfolio+gallery; `fetchpriority=high` on LCP images; public marketing images resized via `images.weserv.nl` (`lib/imageProxy.ts`, absolute-URL-guarded); client galleries keep the **in-house** `/api/proxy-image?w=` resizer (no third party for private photos).
- **Blog video** — `blog_posts.video_url` (boot migration) + upload (≤10 MB) or YouTube/Vimeo link; renders as an embed/player on the public post.
- **Landing-page editor fixes** — "Regenerate with AI" now actually applies (was discarded; response is normalized into the editor's section shape); **Save video URL** reflects in the preview and no longer wipes unsaved edits (reseed guarded on `content_json` change); **Service Type tiles** are multi-select + add/rename/delete (localStorage); testimonials centre under the heading; active tab/section highlighting; Wide-Hero founder-photo crop actually crops.
- **Communications Center** trimmed to **Bulk SMS only** (Email/WhatsApp/Vonage/Heroku-specific copy removed) — note for tenants expecting those channels.
- **Legal pages** (Impressum etc.) bilingualized to honor the EN/DE selector.

---

## 9. Known gaps / follow-ups (not blockers)

- **`@types/compression`** isn't in `package.json` (type-only; runtime uses `tsx`, so harmless). Add it if you switch to a `tsc` build.
- **Prerender-in-Docker is unverified on the actual Render build.** The fallback guarantees the deploy still succeeds without prerender; confirm per-route static HTML actually generates on the first Render build and check the logs for the "prerender build failed" warning.
- **Rate limiter uses in-memory store** — fine for a single Render instance; move to a shared store (Redis) before horizontal scaling.
- **Site-wide AI translation layer + hreflang** (the EN/DE selector controlling all copy) is scaffolded (`server/lib/translate.ts`) and wired for blog; the broader site-wide rollout remains as the agreed next work stream.
- **Per-tenant social + reviews config is env-only (§7).** For self-serve resale, add wizard/Settings fields for `PULSE_API_KEY` + channel profile IDs and `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACES_PLACE_ID`, stored encrypted in `studio_integrations`, read per-tenant instead of `process.env`. **Highest-priority onboarding gap for selling the CRM.**
- **Editable-tile persistence is localStorage** — the LP wizard's custom Service Type tiles live per-browser, not per-tenant DB. Fine for a single operator; move to DB if tiles must follow the account across devices.
- **`images.weserv.nl` is an external dependency** for public marketing image resizing. It has an original-URL `onError` fallback, but a privacy-sensitive tenant may prefer routing everything through the in-house `/api/proxy-image` resizer (which only allows B2/S3 hosts today — extend its host allow-list to cover the tenant's marketing image host if you switch).
- **Rotate any API key pasted during setup** (Google Places, Pulse) after first verification — treat setup-time secrets as exposed.

---

## 10. Key files

- `client/src/pages/setup/UnifiedSetupWizard.tsx` — the single wizard (step list + sidebar groups).
- `client/src/pages/setup/technical/*` — infra step UIs (Domain, Email, Stripe, Storage, Extras, Security, Welcome).
- `client/src/pages/setup/phases/*` — content phase UIs (Basics, Integrations, Scanning, FixFirst, Drafts).
- `server/setup-routes.ts` — content/status/scan/fix-first/drafts endpoints (mounted `/api/setup`).
- `server/technical-setup-routes.ts` — infra + live test endpoints (mounted `/api/setup/technical`).
- `server/lib/validateEnv.ts` — boot-time env validation.
- `server/vite.ts` — dynamic sitemap (now `PUBLIC_SITE_URL`-aware) + per-tenant `index.html` identity injection + crawler body-injection for `/blog|/lp|/gutschein`.
- `App.tsx:629-632` — routing: everything under `/setup*` → `UnifiedSetupWizard`.

**Added in the 2026-07 pass (see §7–§8):**
- `server/services/pulse.ts` — Pulse/AxixOS social distribution (per-tenant config gap lives here).
- `server/services/googleReviews.ts` + `GET /api/reviews/google` — live Google reviews.
- `server/routes/manual-pages.ts` — Manual Website Update CMS incl. `POST /enhance-field` (AI refine/SEO).
- `shared/manualPages.ts` — editable-field manifest (About Us founder story, logo, reviews URL, pillars).
- `client/src/lib/imageProxy.ts` — public-image on-the-fly resize (weserv); `/api/proxy-image` is the in-house gallery resizer.
- `scripts/verify-boot.ts` — pre-deploy boot-check (wired into `heroku-postbuild`).

---

## 11. Selling copies — provision a new tenant (the repeatable runbook)

**Model:** one isolated instance per customer — **one app + one database each**, NOT
shared multi-tenancy. The code is single-studio-per-DB; isolation is both safer
(no cross-tenant data leak) and a selling point. New Age Fotografie is one such
instance; each sale is another.

**The golden rule:** provisioning and schema tools only ever touch a **brand-new
empty database**. They never read or write the live New Age Fotografie CRM.

### What protects the live CRM (and what does NOT)
- `npm run db:push` is fronted by `scripts/guard-db-target.mjs`. It prints the
  target host/DB, **hard-refuses** any host listed in `PROTECTED_DB_HOSTS`,
  refuses non-interactive runs, and otherwise makes you type the DB name.
- `npm run provision` additionally **refuses a DB that already has tables**.
- ⚠️ **Scope of protection.** This guards the *accidental schema-push* class only,
  and the hard block for production works **only if `PROTECTED_DB_HOSTS` contains
  the real production host**. It does NOT stop arbitrary destructive SQL, nor
  `npm run db:push:raw` (which bypasses the guard by design). Treat "don't point
  schema tools at the Heroku DATABASE_URL" as the actual rule; the guard is a
  backstop.

### One-time: arm the guard with the REAL production host
Find the host in **Heroku → your app → Settings → Reveal Config Vars →
`DATABASE_URL`** — it's the part between `@` and the next `:` or `/`.
Then set it **persistently** (a `$env:` assignment lasts only for that one
PowerShell window):
```powershell
# PowerShell, persistent for your Windows user:
[System.Environment]::SetEnvironmentVariable('PROTECTED_DB_HOSTS','<real-heroku-db-host>','User')
# open a NEW terminal afterwards so it takes effect
```
Verify it's armed: `node scripts/guard-db-target.mjs` with `DATABASE_URL` pointed
at production must print `🛑 REFUSED`.

### Per sale — provision a clean instance
1. **Create a fresh empty Postgres** (neon.tech or supabase.com, ~2 min). Copy the
   connection string.
2. **Provision** (from the project folder):
   ```bash
   npm run provision -- --name "Studio Name" --db "postgresql://…FRESH-EMPTY-DB…" --host "https://their-instance-host"
   ```
   It verifies the DB is empty + not protected, creates schema + baseline,
   generates a `SESSION_SECRET`, and prints the env block + the `/setup` URL.
   (Add `--demo` only if you want sample content; omit it for a truly clean CRM.)
3. **Create the instance host** (a new Render web service, or a new Heroku app),
   set the printed env vars:
   - `DATABASE_URL` = the fresh DB · `SESSION_SECRET` = the printed value
   - `NODE_ENV=production` · `DEMO_MODE=false` · `PUBLIC_SITE_URL=<their domain>`
   - Leave OpenAI/Stripe/SMTP/storage/social **unset** — the customer enters
     their own in the wizard (stored encrypted per tenant, §3, §7).
4. **Deploy**, then send the customer their `/setup` link.
5. Customer completes the wizard → the CRM now contains **only their data**, and
   they've supplied **their own OpenAI key** and their own Google reviews / social
   accounts (the "Reviews & Social posting" section of the AI & extras step).

### Confirm any instance is current
`GET /<host>/api/version` → `{ commitShort, builtAt, startedAt, demoMode }`.
If two instances show different `commitShort`, one is stale — redeploy it.
(Stamp is written at build time by `scripts/write-build-info.mjs` → `dist/build-info.json`.)

### Where the wizard lives on each host
Same codebase, so `/setup` exists on **every** instance — including
`newagefotografie.com/setup`. **Never open `/setup` on the live Heroku site**: it
is not gated and would walk your real studio through setup, overwriting live
config and seeding into your working CRM. Test onboarding only on a
**separate** instance pointed at a **separate** database.

### Commercial checklist before the first paid sale
- Paid Render web service + paid Postgres per tenant (free tier spins down —
  unacceptable for a paying customer).
- Each tenant needs their own Stripe, SMTP, storage bucket, OpenAI, and
  social/reviews keys — the wizard collects them; confirm each with its live test.
- Per-tenant backups + a documented restore path.
- Support: `/api/version` + per-instance logs.

### Key files (provisioning)
- `scripts/provision-tenant.mjs` — one-command provisioner (empty-DB + protected-host guards).
- `scripts/bootstrap-tenant.mjs` — schema + baseline (`db:push` → `db:init` [→ demo]).
- `scripts/guard-db-target.mjs` — the destructive-command guard in front of `db:push`.
- `scripts/write-build-info.mjs` — build-time commit stamp → `GET /api/version`.
- `render.yaml` — Render blueprint (tenant instance; `autoDeploy` from `portable-pg`).
