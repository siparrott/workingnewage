# Infinite Authority → Tenant Zero (studioOS Platform) — Connection & Deploy Handoff

**Purpose:** Give Infinite Authority (IA) everything needed to connect to, populate, and (re)deploy **Tenant Zero** — the first clean, re-brandable instance of the studioOS platform — **without touching the live New Age Fotografie production site**.

> **Read this, not the New Age handoff, for Tenant Zero.** The API *contract* is identical to [INFINITE_AUTHORITY_HANDOFF.md](INFINITE_AUTHORITY_HANDOFF.md); only the target instance, base URL, and deploy pipeline differ. Where this document says "same as the New Age handoff," that file is the authoritative endpoint reference.

---

## 1. What Tenant Zero is (and is NOT)

Tenant Zero is a **separate, isolated deployment** of the productized app (formerly TogNinja) — the de‑hardcoded, per‑tenant "studioOS" build. It is the reference/demo instance IA integrates against and the template every future customer instance is cloned from.

| | Tenant Zero (this doc) | New Age production (do NOT touch) |
|---|---|---|
| Site | `https://tenant-zero.onrender.com` | `https://www.newagefotografie.com` |
| Host | Render (image deploy) | Heroku |
| Database | **Supabase** (isolated, demo data) | Neon (live customer data) |
| Branch/build | `portable-pg` → image `v0.5.1` | `main` |
| Brand | neutral / configurable ("My Studio" until onboarded) | New Age Fotografie |

**Isolation guarantee:** Tenant Zero has its own database, its own Render service, and its own URL. Nothing IA reads or writes on Tenant Zero can reach New Age's live CRM, bookings, or content.

---

## 2. Where it lives

| Item | Value |
|---|---|
| **API base / site** | `https://tenant-zero.onrender.com` |
| **Host** | Render web service `srv-d97mkqt7vvec73chebp0` (region: Oregon) |
| **Container image** | `ghcr.io/siparrott/studioos-platform:v0.5.1` (private GHCR) |
| **Source repo** | `github.com/siparrott/studioOS-platform` (private), branch **`portable-pg`** |
| **Database** | Supabase Postgres (`aws-0-eu-north-1.pooler.supabase.com`) |
| **Onboarding** | Single unified wizard at `/setup` |
| **Health check** | `GET /healthz` → `200 {"status":"ok-preinit",...}` |

---

## 3. How IA connects — 3 steps

### Step 1 — Point IA at the base URL
Set one env var in IA:
```
API_BASE=https://tenant-zero.onrender.com
```
All endpoint paths below are relative to it.

### Step 2 — Mint a scoped API key (one-off, server-side)
Reads are public; **writes require a scoped key** (`ia_live_...`, SHA‑256 hashed at rest, shown once). From a shell that can reach the instance's database (Render shell, or locally with the instance `DATABASE_URL`):
```bash
# one-time: ensure the table exists (also auto-created on first use)
npx tsx add-integration-api-keys-table.ts

# mint the key IA needs
npx tsx mint-integration-key.ts "Infinite Authority - tenant-zero" blog:write landing-pages:write
# → prints ia_live_<48 hex> ONCE — store it in IA's secrets
```
Grant only the scopes IA uses: **`blog:write`**, **`landing-pages:write`** (use `*` for everything). Revoke any time:
`UPDATE integration_api_keys SET status='revoked' WHERE id=…`.

### Step 3 — Authenticate every write
```
Authorization: Bearer ia_live_...
# or
X-API-Key: ia_live_...
```
The `authOrApiKey(scope)` middleware accepts the scoped key **or** existing admin credentials — additive, non‑breaking.

---

## 4. What IA can read and write

**The full endpoint list, request/response shapes, and rules are in [INFINITE_AUTHORITY_HANDOFF.md](INFINITE_AUTHORITY_HANDOFF.md) — it is identical for Tenant Zero.** Summary:

**Read (no auth):** `GET /api/blog/posts`, `GET /api/blog/posts/:idOrSlug`, `GET /api/lp/:slug`, `GET /api/galleries`, `GET /api/vouchers/products`, `GET /api/crm/price-list`, `GET /api/homepage/images`, `GET /api/portfolio/images`, `GET /api/studio-config`, `GET /sitemap.xml`.

**Write (scoped key):**
- `POST /api/blog/posts`, `PUT /api/blog/posts/:id` — scope **`blog:write`**. `scheduledFor` in the future ⇒ post stays `SCHEDULED` and auto‑publishes via the hourly cron (never goes live early).
- `POST /api/admin/landing-pages`, `PUT /api/admin/landing-pages/:id`, `POST /api/admin/landing-pages/:id/publish`, `…/revisions/:revId/restore` — scope **`landing-pages:write`**.

**Localization:** content endpoints accept `?language=` (`de` default, `en` etc.); non‑German is AI‑translated + cached server‑side.

**Golden rule:** be **additive** — consume/extend, never rename or repurpose existing endpoints.

### Suggested IA smoke test after connecting
1. `GET https://tenant-zero.onrender.com/healthz` → 200.
2. `GET /api/studio-config` → returns the (neutral or onboarded) studio identity.
3. With the key: `POST /api/blog/posts` a `SCHEDULED` post (future `scheduledFor`) + one landing page → confirm 201, then `GET /api/blog/posts` (public) shows nothing yet (correct — scheduled), and it appears at its scheduled time.

---

## 5. Deploying / (re)deploying the site — the repo → Render pipeline

Tenant Zero runs a **private container image built from the repo**. Two supported paths:

**A. Image + CI (current setup)**
1. Tag the repo (`git tag v0.5.2 && git push … v0.5.2`) → GitHub Actions builds `ghcr.io/siparrott/studioos-platform:<tag>` and pushes to GHCR.
2. Point the Render service at the tag (Render API `POST /v1/services/{id}/deploys` with `imageUrl`, or the dashboard) → deploys.

**B. Repo → Render Blueprint (for a fresh instance)**
1. In Render: **New → Blueprint** → connect the **`studioOS-platform`** repo (one-time GitHub App OAuth) → it reads [`render.yaml`](render.yaml) and builds `./Dockerfile`, branch `portable-pg`, `autoDeploy: true`, health check `/healthz`.
2. Fill the prompted secrets (`DATABASE_URL`; `SESSION_SECRET` auto‑generates).

**Boot env (either path):**
- Required: `DATABASE_URL` (Supabase/Neon/any Postgres), `SESSION_SECRET`.
- Optional AI: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` (app boots fine without them — features 401 until set).
- Identity/branding (unset ⇒ neutral "My Studio"): `PUBLIC_SITE_URL`, `BUSINESS_NAME`, `CONTACT_EMAIL`, `BUSINESS_PHONE`, address/geo/social/GA/logo (see `server/lib/siteIdentity.ts`).

**Schema + content:**
- `npm run db:push` creates/updates the schema; optional demo seed via `npm run bootstrap [-- --demo]`.
- Visit **`/setup`** → the single onboarding wizard walks Identity → Infrastructure → Admin account → Content (scan / fix / starter drafts) → live.

---

## 6. What's required — checklist

**Operator (you):**
- [ ] GHCR **pull token** for the private image (or connect GitHub↔Render for repo builds).
- [ ] A **`DATABASE_URL`** for the instance (Supabase already provisioned for Tenant Zero).
- [ ] **Mint the scoped key** (§3.2) and hand IA the `ia_live_…` value + the base URL.
- [ ] (Fresh instance) run `db:push` + optionally `bootstrap`, then complete `/setup`.

**Infinite Authority:**
- [ ] Store `API_BASE=https://tenant-zero.onrender.com` and the `ia_live_…` secret.
- [ ] Use `Authorization: Bearer` (or `X-API-Key`) on writes; reads unauthenticated.
- [ ] Only touch the additive write endpoints (`blog:write`, `landing-pages:write`).
- [ ] Run the §4 smoke test to confirm connectivity + a round-trip publish.

**CORS note:** if IA calls authenticated endpoints from a *browser* on a different domain, that domain must be added to the backend CORS allow‑list (non‑breaking config change) — flag it. Server‑to‑server calls need nothing.

---

## 7. Revoking / rotating

- Revoke IA's access instantly: `UPDATE integration_api_keys SET status='revoked' WHERE name='Infinite Authority - tenant-zero';`
- Rotate: mint a new key, update IA's secret, revoke the old row. Keys are hashed at rest, so the raw value only ever exists in IA's secret store.

---

*Tenant Zero is the isolated proving ground. Once IA's read/write + publish round-trips are green here, the same integration works unchanged against any customer instance provisioned from this repo — only the base URL and scoped key change per tenant.*
