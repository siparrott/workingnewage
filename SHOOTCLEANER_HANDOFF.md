# ShootCleaner ⇄ New Age Fotografie CRM — Integration Handoff

**Audience:** ShootCleaner developer integrating with the New Age Fotografie web app / CRM.
**Base host (production):** `https://www.newagefotografie.com`
**Status legend:** ✅ Live · 🟡 Exists under session auth (needs API-key exposure) · 🔧 To build (Phase 2)

This app is a single-tenant React + Express application backed by one PostgreSQL
database (Supabase-hosted). ShootCleaner integrates over HTTPS/JSON. There is **no
shared DB connection** — everything goes through the documented HTTP endpoints so
access is scoped, audited, and safe.

---

## 1. Authentication

There are **two API-key systems**. ShootCleaner will use **both** — one per base path.

### A. ShootCleaner key — for the integration surface
Covers galleries, gallery images, digital files (cloud export), **clients**, and
**questionnaire responses**.

- **Env var (server):** `SHOOTCLEANER_API_KEY` (set in Heroku config)
- **Base path:** `/api/integrations/shootcleaner`
- **Present the key** as either header:
  - `x-api-key: <key>`  **or**
  - `Authorization: Bearer <key>`
- Scopes are advertised at `GET /health`; v1 issues one key holding every scope.

### B. Integration key (`ia_live_…`) — for content APIs
Covers blog, media upload, and landing pages on the main API.

- **Format:** `ia_live_<48 hex>` — minted with `scripts/mint-integration-key.ts`,
  stored hashed in the `integration_api_keys` table with a JSON `scopes` array.
- **Base path:** `/api` (main app)
- **Present the key** as `x-api-key: ia_live_…` or `Authorization: Bearer ia_live_…`
- A key with scope `*` or `admin` passes every scope check.
- Relevant scopes: `blog:write`, `media:write`, `landing-pages:write`, `analytics:read`.

> **Why two keys?** Galleries/files/clients/questionnaires live behind a dedicated
> ShootCleaner key (simple shared secret). Blog/media use the app's general scoped
> integration-key system. Keep both in ShootCleaner's config.

**Auth errors** (both systems) return JSON:
```json
{ "error": "Invalid API key", "code": "invalid_api_key" }      // 401
{ "error": "Missing required scope: blog:write", "code": "insufficient_scope" } // 403
{ "error": "ShootCleaner integration is not configured", "code": "shootcleaner_not_configured" } // 503
```

---

## 2. Quick start

```bash
# Health check (verifies the ShootCleaner key + lists granted scopes)
curl -s https://www.newagefotografie.com/api/integrations/shootcleaner/health \
  -H "x-api-key: $SHOOTCLEANER_API_KEY"
# → { "ok": true, "service": "shootcleaner", "scopes": [ ... ] }
```

All list endpoints return `{ "data": [...], "total": n, "limit": n, "offset": n }`.
All single-item endpoints return `{ "data": { ... } }`.
IDs are UUID strings unless noted. Timestamps are ISO-8601 UTC.

---

## 3. Endpoint reference

### 3.1 Health — ✅
`GET /api/integrations/shootcleaner/health` → `{ ok, service, scopes[] }`

### 3.2 Clients (read) — ✅ (assign images to the right client)
| Method | Path | Notes |
|---|---|---|
| GET | `/clients?search=&limit=&offset=` | `search` matches first/last name, email, or `clientId`. `limit` ≤ 200. |
| GET | `/clients/:id` | `:id` may be the UUID **or** the human `clientId`. 404 if not found. |

Client shape:
```json
{
  "id": "uuid", "clientId": "NAF-1023",
  "firstName": "Elisabeth", "lastName": "Gumhalter", "fullName": "Elisabeth Gumhalter",
  "email": "e@example.com", "phone": null,
  "address": null, "city": null, "state": null, "zip": null, "country": null,
  "company": null, "vatNumber": null, "status": "active",
  "createdAt": "…", "updatedAt": "…"
}
```
The `id` (UUID) is what every other endpoint expects as `clientId` when linking.

### 3.3 Galleries (read + create) — ✅
| Method | Path | Scope | Notes |
|---|---|---|---|
| GET | `/galleries?search=&clientId=&publicOnly=&limit=` | key | List. `publicOnly=true/false` filters visibility. |
| GET | `/galleries/:id/images` | key | Images in a gallery, ordered by `sortOrder`. |
| POST | `/galleries` | `galleries:write` | Create a gallery. |

**Create gallery** body:
```json
{
  "title": "Gumhalter Family — Aug 2026",   // required
  "slug": "optional-custom-slug",           // auto-generated + de-duped if omitted
  "description": "…",
  "clientId": "uuid",                        // optional; validated against crm_clients
  "isPublic": false,                          // default false
  "isPasswordProtected": true,                // client-gallery password gate
  "password": "familypics",                   // stored when isPasswordProtected
  "externalRef": "sc_export_8842"            // idempotency (see §4)
}
```
Returns `201 { data: { id, title, slug, galleryUrl, isPasswordProtected, clientId, imageCount, … } }`.
`galleryUrl` is the public/gated client URL (`/gallery/<slug>`).

### 3.4 Gallery images — upload flow — ✅
Bytes go **straight to storage (Backblaze B2/S3)** via presigned PUT, then you
commit metadata. Max 100 files/call, 200 MB/file, presign TTL 15 min.

1. **Presign** — `POST /galleries/:id/images/presign` (scope `gallery-images:write`)
   ```json
   { "files": [ { "filename": "IMG_001.jpg", "contentType": "image/jpeg", "sizeBytes": 5242880 } ] }
   ```
   → `{ data: [ { filename, fileKey, uploadUrl, method: "PUT", headers: {…}, expiresAt } ] }`
2. **PUT** each `uploadUrl` with the raw bytes and the given `Content-Type` header.
3. **Commit** — `POST /galleries/:id/images/commit` (scope `gallery-images:write`)
   ```json
   { "images": [ { "fileKey": "galleries/…", "filename": "IMG_001.jpg",
                   "title": null, "description": null, "sortOrder": 0,
                   "sizeBytes": 5242880, "contentType": "image/jpeg",
                   "externalRef": "sc_img_1" } ] }
   ```
   The server verifies the object exists in storage before writing the row.
   Allowed image types: jpeg, png, webp, tiff, heic, heif, avif.

### 3.5 Digital files / "Export to Cloud" — ✅
Same presign → PUT → commit pattern for deliverable files (not tied to a gallery).
| Method | Path | Scope |
|---|---|---|
| GET | `/digital-files?search=&folderName=&fileType=&clientId=&sessionId=&publicOnly=&limit=` | key |
| POST | `/digital-files/presign` | `digital-files:write` |
| POST | `/digital-files/commit` | `digital-files:write` |

Presign body: `{ "folderName": "ShootCleaner Exports", "files": [ { "fileName":"final.zip", "contentType":"application/zip", "fileSize": 12345 } ] }`.
Commit rows may carry `clientId` (validated), `sessionId`, `tags[]`, `description`, `isPublic`.
Allowed types add: `application/pdf`, `application/zip`, `video/mp4`, `video/quicktime`.

### 3.6 Questionnaire responses (read) — ✅ (case-study source material)
| Method | Path | Notes |
|---|---|---|
| GET | `/questionnaire-responses?clientId=&questionnaireId=&limit=&offset=` | List, newest first. |
| GET | `/questionnaire-responses/:id` | Single response. |

Response shape:
```json
{
  "id": "uuid", "clientId": "uuid",
  "clientName": "Elisabeth Gumhalter", "clientEmail": "e@example.com",
  "questionnaireSlug": "familienshooting", "questionnaireTitle": "Familien-Fragebogen",
  "answers": { "q1": "…", "q2": "…" },
  "resolvedAnswers": { "What matters most to you?": "…", "Occasion": "…" },
  "submittedAt": "…"
}
```
> Use **`resolvedAnswers`** for the case-study generator — its keys are the
> human-readable question labels (resolved from the survey definition), not `q1/q2`.

### 3.7 Blog — create / schedule / publish — ✅ (via `ia_` key, `blog:write`)
These are on the **main API** (`/api`), authed with an `ia_live_…` key holding `blog:write`.
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/blog/posts?published=&tag=&language=&limit=` | List/read (public; add key to see drafts). |
| POST | `/api/blog/posts` | Create a post (draft, scheduled, or published). |
| PUT | `/api/blog/posts/:id` | Update / publish / reschedule. |

Scheduling is driven by the post body — set `scheduledFor` (or a future
`publishedAt`) to a future ISO date to schedule; the hourly publisher makes it
live at that time. Set `status: "PUBLISHED"` / `published: true` to publish now.
**Case studies:** tag the post `case-study` (or German `fallstudie` — treated as
synonyms) and it appears at `/case-studies` automatically, inheriting the blog's
SEO, sitemap, and IndexNow ping. Media for post bodies: `POST /api/upload/image`
(scope `media:write`) → returns a hosted `url`.

---

## 4. Idempotency (safe retries)

Every create/commit endpoint accepts an `externalRef` (your stable ShootCleaner
ID for that entity). The server records `externalRef → {entityType, entityId}` in
`shootcleaner_exports`. Re-sending the same `externalRef` returns the **existing**
entity instead of creating a duplicate — so network retries and re-runs are safe.
Use a distinct `externalRef` per gallery, per image, and per digital file.

---

## 5. Not yet exposed to the API — Phase 2 (needs building)

These capabilities exist in the app under **admin/session auth** but are **not yet
reachable with an API key**. They are the remaining work to fully satisfy the
brief. Recommended contracts below; flag which you need first.

| Need | Status | Plan |
|---|---|---|
| **Create invoices + record image-selection line items** | 🟡 `crm_invoices` + admin create exist (session auth) | Add `POST /api/integrations/shootcleaner/invoices` (scope `invoices:write`): `{ clientId, items:[{description, qty, unitPrice}], currency, dueDate, notes, externalRef }` → creates a `crm_invoices` row + line items, returns invoice id + number. |
| **Record orders → main DB + sales charts** | 🟡 `voucher_sales`/`crm_invoices` feed the charts | Add `POST /api/integrations/shootcleaner/orders` (scope `orders:write`) writing the sale so it appears in revenue/sales reporting. Decide: does an order = a paid invoice, or a separate order record? |
| **Blog "download to archive"** | 🔧 | Define what "archive" means (export post + assets as a bundle?) and add a `GET …/blog/posts/:id/export` or archive endpoint. |
| **Consolidate onto one key** | Optional | If preferred, move clients/questionnaires behind the `ia_` scoped-key system so ShootCleaner carries a single key with `clients:read, questionnaires:read, blog:write, …`. |

> Galleries, gallery images, digital files, clients (read), and questionnaire
> responses (read) — the core of "assign pictures to clients, create & deliver
> galleries with passwords, and pull questionnaires for case studies" — are **live
> now**. Blog create/schedule/publish is live via the `ia_` key. Invoices and
> orders are the main Phase-2 build.

---

## 6. Setup checklist

**On the New Age Fotografie side (one-time):**
- [ ] Set `SHOOTCLEANER_API_KEY` in Heroku config (long random secret).
- [ ] Mint an `ia_live_…` key with scopes `blog:write, media:write` (and later
      `invoices:write, orders:write`) via `scripts/mint-integration-key.ts`; give
      the raw key to ShootCleaner (it's shown once, stored hashed).
- [ ] Confirm storage env is set (`AWS_S3_BUCKET`, `AWS_S3_ENDPOINT`) so presign works.

**On the ShootCleaner side:**
- [ ] Store both keys in config (`SHOOTCLEANER_API_KEY`, the `ia_live_…` key).
- [ ] Verify with `GET /health` and a `GET /clients?limit=1`.
- [ ] Use `externalRef` on every create/commit for idempotency.
- [ ] Resolve the CRM client `id` (via `/clients`) before exporting a gallery.

---

## 7. Error format & limits
- Errors: `{ "error": "message", "code": "machine_code" }` with the matching HTTP status.
- Common codes: `invalid_api_key` (401), `insufficient_scope` (403),
  `invalid_request` (400), `invalid_client_id` (400), `gallery_not_found` /
  `client_not_found` / `response_not_found` (404), `object_missing` (409),
  `too_many_files` (400), `file_too_large` (413), `storage_not_configured` (503).
- Limits: 100 files/call, 200 MB/file, presign TTL 15 min, list `limit` ≤ 200.

---

*Source of truth: `server/routes/shootcleaner.ts` (integration surface),
`server/routes.ts` `authOrApiKey` + blog/media endpoints, `server/lib/apiKeys.ts`
(integration keys). Update this doc when endpoints change.*
