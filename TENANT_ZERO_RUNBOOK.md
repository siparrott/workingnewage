# Tenant-Zero Runbook (deploy the first instance on Render)

*Stand up the isolated reference instance from the container image. Gate 0D of [MASTER_EXECUTION_PLAN.md](MASTER_EXECUTION_PLAN.md). Prod (`workingnewage`) is untouched — this is a separate image, DB, and Render service.*

## Prerequisites (from Tasks 1–4)
- ✅ Green CI build → **portable** image at **`ghcr.io/siparrott/studioos-platform:v0.2.0`** (node-postgres — Supabase-ready) — confirm it appears under the repo's **Packages**.
- **read:packages PAT** (Task 2) — Render uses it to pull the private image.
- **Render account + API key** (Task 3).
- **Supabase project** for tenant-zero (Task 4) — the **Session pooler / direct** connection string (port **5432**, not the 6543 transaction pooler). SSL is auto-enabled by the app.
- Two strong random secrets you generate now (keep them safe):
  - `SESSION_SECRET` — e.g. `openssl rand -hex 32`
  - `ENCRYPTION_KEY` — e.g. `openssl rand -hex 32` — **must stay stable** for the life of the instance (it decrypts wizard-stored integration secrets).

## Step 1 — Bootstrap the database FIRST (before the Render deploy)
Seeding the schema before the service starts avoids a health-check race. From this project folder on your machine:
```bash
# PowerShell:  $env:DATABASE_URL="postgresql://…supabase…:5432/postgres"; npm run bootstrap -- --demo
# bash:        DATABASE_URL="postgresql://…supabase…:5432/postgres" npm run bootstrap -- --demo
```
This runs `db:push` (schema) → `db:init` (admin + studio config + prices + vouchers) → `demo:setup` (demo clients/galleries/blog). If `drizzle-kit` asks to confirm creating tables, accept.
- Seeded admin login: **`admin@photography-crm.local` / `admin123`** — change it immediately via the setup wizard after first login.

## Step 2 — Create the Render web service (deploy an existing image)
1. Render dashboard → **New → Web Service → Deploy an existing image**.
2. **Image URL:** `ghcr.io/siparrott/studioos-platform:v0.2.0`  *(the portable node-postgres image)*
3. **Credentials:** add registry credentials → username **`siparrott`**, password **`<read:packages PAT>`**.
4. Name **`tenant-zero`**, region near you, instance type Starter (Free tier sleeps — fine for a demo).
5. **Health check path:** `/api/health`.

## Step 3 — Environment variables (the boot set)
| Key | Value | Why |
|---|---|---|
| `NODE_ENV` | `production` | **Required** — the app only serves the built site when this is set |
| `DATABASE_URL` | your Supabase connection string (port 5432) | tenant-zero DB |
| `SESSION_SECRET` | your random hex | sessions (+ encryption fallback) |
| `ENCRYPTION_KEY` | your random hex | encrypts wizard-stored secrets — keep stable |
| `DEMO_MODE` | `true` | suppresses real emails/charges; blocks live Stripe keys |
| `PORT` | *(leave unset)* | Render injects it; the app binds it on `0.0.0.0` |

*(No Stripe/SMTP/S3 keys needed to boot — those are captured later in the setup wizard.)*

## Step 4 — Deploy & verify
- Deploy. Watch logs for `✅ Serving static files from: /app/dist` and a successful `/api/health`.
- Open the Render URL → the app loads (still branded "New Age / Wien" — expected until Phase 1 de-hardcode).
- Log in with the seeded admin; open the setup wizard; change the admin password.

## Step 5 — Connect Infinite Authority (proves the gated path)
- Mint a scoped key **against tenant-zero** (run once, with `DATABASE_URL` = Neon):
  ```bash
  DATABASE_URL="postgresql://…supabase…:5432/postgres" npx tsx mint-integration-key.ts "IA - tenant-zero" blog:write landing-pages:write
  ```
- Give IA `{ baseUrl: <render url>, key: ia_live_… }`; IA does a dry-run publish (3 posts + 1 landing page).

## Gate 0D = green when
tenant-zero is live from the private image, the demo site renders, admin login works, and IA can read/write via its scoped key. → advance to Phase 1 (de-hardcode).

---
### Notes
- **Ordering matters:** bootstrap the DB (Step 1) before/at deploy so the first health check passes.
- **Isolation:** separate image tag, separate Supabase project, `DEMO_MODE=true`, separate Render service — prod is never touched.
- **Image:** use **`:v0.2.0`** (portable node-postgres, Supabase-ready). `:v0.1.0`/`:latest` from `main` are the Neon-only build — don't use them against Supabase.
- **pgvector:** the agent knowledge-base auto-creates the `vector` extension on boot; on Supabase enable the **`vector`** extension (Database → Extensions) if that feature errors. Non-blocking for the demo.
