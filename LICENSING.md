# Licensing & Distribution — TogNinja

How paid instances are gated (self-host + hosted), and how the product ships.
Two independent layers, one key:

| Layer | What it does | Needs a server? | Status |
|---|---|---|---|
| **Instance licence** (`server/lib/license.ts`) | "Is this install paid for?" — signed key, verified offline at boot; blocks admin writes when missing/expired | **No** | ✅ built (v1) |
| **Entitlement** (`server/lib/entitlement.ts`) | "Which premium services may it use?" — online check that gates IA / ShootCleaner / AI agent | Yes (later) | scaffolded |

Both read the same `LICENSE_KEY`. Start with the instance licence; add the entitlement server when you sell premium add-ons.

---

## 1. The golden rule: data never lives in the image

The **image is stateless code** — identical for every studio. A studio's data lives
in **its own Postgres database**. They are separate things:

```
ghcr.io/…/togninja:v0.6.0   ← the app (code). Same bytes for every customer.
        +
their own Postgres DB       ← THIS studio's data. Unique per studio.
        +
env vars (LICENSE_KEY, keys)← per-instance config, injected at deploy
```

**The onboarding wizard writes to the DATABASE, not the image.** Business name,
branding, prices, clients, galleries, blog — all rows in *their* DB. The image is
never rebuilt or personalised per studio. That's precisely why one image serves
everyone and one bug-fix reaches everyone.

So: **no, user data cannot and must not embed into the image.** If you ever find
yourself building a per-customer image, stop — that's the maintenance trap. One
image → many databases is the whole architecture.

---

## 2. Instance licence (v1)

**Key format:** `TOG1.<base64url(claims)>.<base64url(ed25519-sig)>`
Claims: `{ sid, plan, iat, exp?, features? }` — `exp` in epoch seconds; omit for perpetual.
Signed with Ed25519. The app holds only the **public** key, so it can verify but never forge.

### One-time setup (vendor)
```bash
node scripts/gen-license-keypair.mjs
# → LICENSE_PUBLIC_KEY  (embed / set on customer instances)
# → LICENSE_SIGNING_KEY (SECRET — vault it; never ships in the image)
```

### Mint a licence per customer
```bash
LICENSE_SIGNING_KEY="$(cat signing-key.pem)" \
  node scripts/mint-license.mjs --sid studio_123 --plan self-hosted --days 365
# → LICENSE_KEY=TOG1.…
```

### Activate on a customer instance (env vars)
| Env var | Value | Effect |
|---|---|---|
| `LICENSE_PUBLIC_KEY` | the public key | **turns enforcement ON** for this instance |
| `LICENSE_KEY` | the minted `TOG1.…` | the licence to verify |

### Enforcement behaviour
- **Off** unless `LICENSE_PUBLIC_KEY` is set **and** `DEMO_MODE !== 'true'`. So New Age, tenant-zero and dev are unaffected until you opt an instance in.
- **active / grace** (within 14-day grace after expiry) → runs normally.
- **missing / invalid / expired-past-grace** → blocks admin **writes** (POST/PUT/PATCH/DELETE) with `402 license_required`. The **public site, all reads, and their data keep working** — you apply pressure without nuking their customers or holding data hostage.
- Login, `/api/license/*`, `/api/setup`, health always stay reachable so the owner can log in and paste a fresh key.
- Status for the UI: `GET /api/license/status` (never returns the key).

### Renewal
Mint a new key with a later `--days`, give it to the customer, they update
`LICENSE_KEY` and redeploy. (A future admin "paste new key" screen can avoid the redeploy.)

> **Honest limit:** code that runs on someone else's server can never be 100%
> uncopyable. Ed25519 signing + write-lock + private image is the industry-standard
> ~95% — and for non-technical photographer customers it's effectively absolute.

---

## 3. Distribution — ship the image, not the repo

Every customer deploys the **same private image**; never connect them to the Git repo
(that both leaks source and creates the per-repo maintenance trap).

**Per-customer image-pull token (GHCR):**
1. GitHub → your org → **Settings → Developer settings → Personal access tokens (classic)** → new token with **`read:packages`** only.
   - Prefer a **separate token per customer** (or per cohort) so you can revoke one without affecting others.
2. Give Render (their service → *Existing Image* → **Credential**) that token as the registry credential, image `ghcr.io/<you>/togninja:v0.6.0`.
3. **Revoke the token** to cut a customer off from future pulls. Pair with a lapsed licence (§2) to stop the running app.

Two independent kill-switches: **licence** (locks the running app) + **pull token** (stops updates).

---

## 4. Onboarding a studio (self-host or hosted) — the flow

1. **Provision a fresh database** (Neon/Render Postgres/Supabase) — *never reuse another studio's DB*.
2. **Bootstrap** the schema against that DB (`DATABASE_URL=… npm run bootstrap`).
3. **Deploy an instance** (their Render account for self-host, yours for hosted) from the **private image**, env:
   - `DATABASE_URL` (their new DB), `SESSION_SECRET`, `ENCRYPTION_KEY`
   - `LICENSE_PUBLIC_KEY` + `LICENSE_KEY` (activate)
   - identity vars (business name, site URL, etc.) — optional; the wizard also sets these
4. **Run the onboarding wizard** → it writes their config + starter content **into their database**.
5. **(If subscribed to ShootCleaner)** set `SHOOTCLEANER_API_KEY` to activate that connection.

Same image every time; everything studio-specific lives in the DB + env.

---

*Sources: `server/lib/license.ts`, `server/lib/entitlement.ts`, `scripts/mint-license.mjs`, `scripts/gen-license-keypair.mjs`.*
