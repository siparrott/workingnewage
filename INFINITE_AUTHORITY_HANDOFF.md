# Infinite Authority → New Age Fotografie: Front-End Integration Handoff

**Purpose:** Give Infinite Authority everything it needs to scaffold a new, SEO/topical-authority front-end site that reads from — and (optionally) writes back to — the existing TogNinja / newagefotografie backend **without breaking any current behaviour**.

**Backend:** Express.js (Node) API. Single origin. Primary site: `https://www.newagefotografie.com` (API served from the same host, e.g. `https://www.newagefotografie.com/api/...`).

---

## 1. How to think about this integration

The backend is effectively **headless**: the current React site is just one consumer of a large public HTTP API. A new site is a **second consumer** of the same API.

Two capability tiers:

| Tier | Auth | Use it for |
|---|---|---|
| **PUBLIC** | none | Everything the visitor-facing site renders or submits: blog, galleries, vouchers, pricing, portfolio, contact/lead forms, booking, questionnaires, landing pages, studio config. |
| **AUTHENTICATED** | token (see §3) | Creating/updating content ("update our current front end"): publishing blog posts, landing pages, homepage/portfolio images, prices. |

**Golden rule (non-breaking):** the new site must be **additive** — consume existing endpoints, never require changes to their request/response shapes. All paths, methods, and field names below are the live contract. Don't rename, don't repurpose. If a new capability is needed, it should be a *new* endpoint, not a mutation of an existing one.

---

## 2. Base URL, CORS, limits

- **Base URL:** same origin as the API host. Configure one env var in the new site, e.g. `API_BASE=https://www.newagefotografie.com`. All paths below are relative to it.
- **CORS:** enabled with `Access-Control-Allow-Credentials: true`. If the new site is on a **different domain** and needs authenticated calls, the backend's CORS allow-list must include that domain — flag this so it can be added (non-breaking config change).
- **Body limit:** 50 MB (JSON / urlencoded).
- **Content type:** JSON everywhere except uploads (multipart/form-data) and Stripe/Prodigi webhooks (raw body).
- **Language:** many content endpoints accept `?language=` (e.g. `de` / `en`). Pass it through for localized sites.

---

## 3. Authentication (only needed for write-back)

Read-only public endpoints need **no** auth. For content mutation, `authenticateUser` accepts any of:

1. **Session cookie** — from `POST /api/auth/login` (`{ email, password }`); send subsequent requests with `credentials: 'include'`.
2. **JWT bearer** — `Authorization: Bearer <token>` (signed with the server's `JWT_SECRET`/`SESSION_SECRET`).
3. **Admin token** — `X-Admin-Token: <ADMIN_TOKEN>` header (server env value). Simplest for a server-to-server generator like Infinite Authority.

### Scoped integration API key (recommended — now implemented)

Instead of sharing the admin token, mint a **dedicated scoped key** for Infinite Authority. This is built into the backend:

- **Format:** `ia_live_<48 hex>`. Sent as `Authorization: Bearer ia_live_…` **or** `X-API-Key: ia_live_…`.
- **Storage:** only a SHA-256 hash is persisted (table `integration_api_keys`); the raw key is shown once at mint time.
- **Scopes:** each key carries an explicit scope list. Currently enforced scopes: **`blog:write`**, **`landing-pages:write`** (use `*` to grant everything).
- **Non-breaking:** the middleware `authOrApiKey(scope)` accepts a valid scoped key **or** the existing admin credentials, so nothing about current admin access changes.

**Mint a key (server-side, one-off):**
```bash
# one-time: create the table (also auto-created on first use)
npx tsx add-integration-api-keys-table.ts

# mint a key with the scopes Infinite Authority needs
npx tsx mint-integration-key.ts "Infinite Authority - prod" blog:write landing-pages:write
# → prints the raw ia_live_... key ONCE. Store it in Infinite Authority's secrets.
```

**Use it (from Infinite Authority's backend only — never the browser):**
```bash
curl -X POST https://www.newagefotografie.com/api/blog/posts \
  -H "Authorization: Bearer ia_live_..." \
  -H "Content-Type: application/json" \
  -d '{ "title": "...", "slug": "cluster-topic-x", "contentHtml": "...", "tags": ["cluster-x"], "status": "SCHEDULED", "scheduledFor": "2026-08-01T08:00:00.000Z" }'
```

Endpoints currently key-enabled: `POST /api/blog/posts`, `PUT /api/blog/posts/:id` (scope `blog:write`); `POST/PUT /api/admin/landing-pages`, `POST /api/admin/landing-pages/:id/publish` (scope `landing-pages:write`). To open another write endpoint to keys, swap its `authenticateUser` for `authOrApiKey('<scope>')` — additive, admin access preserved. Revoke a key with `UPDATE integration_api_keys SET status='revoked' WHERE id=…`.

---

## 4. PUBLIC endpoints — the building blocks for the new site

These are the endpoints a topical-authority site will actually render. Grouped by content type, with the shapes you'll bind to.

### 4.1 Blog (the core of topical authority / clusters)
- `GET /api/blog/posts` — list published posts.
  - Query: `page`, `limit`, `published`, `search`, `tag`, `exclude`, `language`
  - Returns: `{ posts, count, totalPages, currentPage, hasNextPage, hasPrevPage }`
  - Each post: `{ id, title, slug, excerpt, contentHtml, content, imageUrl, imageUrl2, imageUrl3, tags[], status, published, publishedAt, scheduledFor, seoTitle, metaDescription, createdAt, updatedAt }`
- `GET /api/blog/posts/:identifier` — single post by **id or slug**. Same post shape.
- `GET /api/proxy-image?url=` — server-side image proxy (for hotlink-safe rendering).

**Cluster/authority mapping:** use `tags[]` as the topical-cluster key. Build hub/spoke pages by querying `?tag=<cluster>` and interlinking by `slug`. `seoTitle` / `metaDescription` are already populated for SEO.

### 4.2 Galleries
- `GET /api/galleries` — public galleries: `[{ id, title, slug, description, coverImage, isPublic, clientName, imageCount }]`
- `GET /api/galleries/:slug` — one gallery (incl. `isPasswordProtected`).
- `POST /api/galleries/:slug/auth` — `{ password }` for protected galleries.
- `GET /api/galleries/:slug/images?limit&offset` — `[{ id, filename, url, title, rating, downloadCount, viewCount }]`
- `PATCH /api/galleries/:galleryId/images/:imageId/rating` — `{ rating }`
- `POST /api/galleries/:id/track-view` · `/track-download` · `/capture-email` (`{ email, firstName, lastName }`)

### 4.3 Vouchers / gift shop (revenue)
- `GET /api/vouchers/products?language=` — `[{ id, name, description, price, category, imageUrl, featured, slug }]`
- `GET /api/vouchers/products/:idOrSlug` — single product.
- `GET /api/vouchers/templates` — design templates.
- `POST /api/vouchers/coupons/validate` — `{ code }`
- `POST /api/vouchers/validate` — `{ code }`
- `POST /api/vouchers/upload-photo` (multipart) — customer photo for personalized voucher.
- `POST /api/vouchers/create-payment-intent` — `{ productId, quantity }` (Stripe).
- `GET /voucher/pdf?session_id=` — final voucher PDF. `GET /voucher/pdf/preview` — preview.

### 4.4 Pricing
- `GET /api/crm/price-list` — `[{ id, category, name, description, price, currency, taxRate }]`

### 4.5 Homepage & portfolio imagery
- `GET /api/homepage/images?section=` — `[{ id, section, url, alt, title, sortOrder, isActive }]`
- `GET /api/portfolio/images?category=` — `[{ id, category, url, alt, title, description, sortOrder }]`

### 4.6 Landing pages (programmatic SEO surfaces)
- `GET /api/lp/:slug` — published landing page: `{ id, slug, title, sections, analytics }` (`?preview=<token>` for drafts).
- `POST /api/landing-pages/events` — `{ pageId, eventType }` analytics beacon.

### 4.7 Lead capture & contact (conversion)
- `POST /api/contact` — `{ fullName, email, phone?, message }` → `{ success, message, leadId }`
- `POST /api/leads/create` — `{ name?, email?, phone?, message?, source?, formType? }` → `{ success, lead }`
- `POST /api/waitlist` — `{ fullName, email, phone?, preferredDate?, message? }`
- `POST /api/newsletter/signup` — `{ email }` → `{ success, message, leadId }`
- `POST /api/chat/save-lead` — chat-captured lead.

### 4.8 Booking / availability
- `GET /api/embed/availability?start&end&studioId?&calendarId?` → `{ start, end, available: [ISO dates], total }`
- `POST /api/embed/book` — `{ firstName, lastName, email, phone, startTime, duration_minutes?, session_type? }`
- Scheduler variant: `GET /api/schedulers/public/:slug`, `/availability`, `POST /api/schedulers/public/:slug/book` (`{ name, email, phone, date, time }`).

### 4.9 Questionnaires
- `GET /api/questionnaire/:token` → `{ token, clientName, clientEmail, survey: { title, description, pages, settings } }`
- `POST /api/email-questionnaire` — `{ token, clientName, clientEmail, answers }`
- Slug variant: `GET /api/questionnaires/:slug`, `POST /api/questionnaires/:slug/submit`, plus short link `GET /q/:slug`.

### 4.10 Studio config & SEO plumbing
- `GET /api/studio-config` → `{ studioName, address, phone, email, logo, ... }` — brand/NAP for every page (great for local SEO consistency).
- `GET /sitemap.xml` and `GET /robots.txt` — **already generated by the backend.** Coordinate so the new site either consumes these or the backend sitemap includes the new site's URLs. Don't ship a conflicting second sitemap at the same host.
- `GET /api/print/products`, `POST /api/print/quote` (Prodigi print-on-demand, if the site sells prints).

---

## 5. Write-back — "update our current front end" (AUTH required)

If Infinite Authority generates content that should appear on the live site, it writes through these (all `[AUTH]`, see §3). Shapes accept the same field names returned by the public reads.

**Blog (topical clusters):**
- `POST /api/blog/posts` — `{ title, slug, excerpt, content, contentHtml, tags[], imageUrl, seoTitle, metaDescription, status, published, publishedAt, scheduledFor }`
- `PUT /api/blog/posts/:id` — partial update. `DELETE /api/blog/posts/:id`.
- Scheduling: a post is **SCHEDULED** when `status:'SCHEDULED'` + `scheduledFor` is in the future; an hourly cron auto-publishes it. `POST /api/blog/posts/reschedule-cadence` re-spaces scheduled posts (e.g. 2/week).

**Landing pages (programmatic SEO):**
- `GET/POST /api/admin/landing-pages`, `PUT /api/admin/landing-pages/:id`, `POST /api/admin/landing-pages/:id/publish` / `/unpublish`, `POST /api/admin/landing-pages/check-slug`, `POST /api/admin/landing-pages/generate`.

**Imagery:** `POST/PUT/DELETE /api/homepage/images*`, `/api/portfolio/images*` (create/update/upload/delete).

**Pricing:** `POST/PUT/DELETE /api/crm/price-list*`.

> **Slug discipline:** blog `slug` and landing-page `slug` are unique keys and the site's URLs. When Infinite Authority creates content it should own a slug namespace/prefix convention to avoid colliding with existing hand-authored pages (`POST /api/admin/landing-pages/check-slug` verifies availability first).

---

## 6. Recommended "read set" for the generated site

For a topical-authority build, wire these first (all PUBLIC, cacheable):

1. `GET /api/studio-config` — brand/NAP, once per build.
2. `GET /api/blog/posts?published=true&limit=…` (+ per-tag queries) — cluster hubs & spokes.
3. `GET /api/blog/posts/:slug` — article pages.
4. `GET /api/portfolio/images` + `GET /api/homepage/images` — visual proof.
5. `GET /api/galleries` (+ `/:slug/images`) — social proof / client work.
6. `GET /api/vouchers/products` + `GET /api/crm/price-list` — commercial pages.
7. `GET /api/lp/:slug` — programmatic landing surfaces.
8. Conversion: `POST /api/contact`, `/api/newsletter/signup`, `/api/embed/book`.

**Caching:** treat blog/portfolio/pricing/gallery reads as ISR/SSG-friendly (revalidate on a timer or on a publish webhook). Don't hammer per-request.

---

## 7. Integration rules (so nothing breaks)

1. **Additive only.** Consume the contract above verbatim. Never require a change to an existing endpoint's shape.
2. **New capabilities = new endpoints.** If the site needs something not listed, request a new route; don't overload an existing one.
3. **Respect auth boundaries.** Never call `[AUTH]` endpoints from browser code with the admin token. Do write-back from Infinite Authority's server only.
4. **One sitemap per host.** Coordinate `sitemap.xml` / `robots.txt` ownership.
5. **Unique slugs.** Namespace generated content and check availability before create.
6. **CORS allow-list.** If cross-origin + authenticated, get the new domain added to the backend allow-list.
7. **Stripe/webhooks are backend-owned.** The new site initiates payments via the public voucher/checkout endpoints; it must not attempt to handle Stripe webhooks itself.

---

## 8. Full ADMIN endpoint index (`[AUTH]` — session / JWT / X-Admin-Token, or a scoped key where noted)

The complete authenticated surface, grouped by feature. These are for write-back and future tooling; the public site does **not** call these from the browser. `†` marks endpoints already opened to scoped integration keys (§3).

### Auth & users
- `POST /api/auth/logout` · `GET /api/auth/me`
- `GET /api/users/:id`

### Blog
- `POST /api/blog/posts` † (`blog:write`) · `PUT /api/blog/posts/:id` † (`blog:write`) · `DELETE /api/blog/posts/:id`
- `POST /api/blog/posts/reschedule-cadence` · `POST /api/blog/posts/fix-formatting`
- `POST /api/blog/idea/:id/images` · `DELETE /api/blog/idea/:id/images/:index` · `PUT /api/blog/idea/:id/context` · `POST /api/blog/idea/:id/analyze` · `POST /api/blog/idea/:id/generate`
- `GET /api/blog/posts/:id/social-pack` · `POST /api/blog/posts/:id/social` · `POST /api/blog/posts/:id/distribute-pulse`

### Autoblog & AI assistants
- `POST /api/autoblog/generate` · `POST /api/autoblog/chat` · `GET /api/autoblog/status`
- `GET/POST /api/openai/assistants` · `PUT/DELETE /api/openai/assistants/:id`
- `GET /api/agent/sales-last6` · `/api/agent/upcoming-sessions` · `/api/agent/sales-year` · `/api/agent/diagnostics-extended` · `POST /api/transcribe`

### Galleries & images
- `POST /api/galleries` · `PUT /api/galleries/:id` · `DELETE /api/galleries/:id` · `GET /api/galleries/:id`
- `POST /api/galleries/:galleryId/upload` · `PUT /api/galleries/:galleryId/featured-image`
- `GET /api/admin/galleries` · `GET /api/admin/galleries/:id/images` · `GET /api/admin/galleries/analytics` · `GET /api/galleries/:id/analytics`
- `POST /api/galleries/send-email` · `/send-whatsapp` · `/send-sms`
- `POST /api/gallery-transfer/:galleryId` · `GET /api/gallery-transfer/:galleryId/history`

### Homepage & portfolio images
- `GET/POST/PUT/DELETE /api/homepage/images(/:id)` · `POST /api/homepage/images/upload`
- `GET/POST/PUT/DELETE /api/portfolio/images(/:id)` · `POST /api/portfolio/images/upload`
- `POST /api/upload/image`

### Files (digital assets)
- `POST/GET /api/files/folders` · `POST/GET /api/files` · `GET /api/files/:id/download` · `DELETE /api/files/:id` · `GET /api/files/usage` · `PATCH /api/files/:id/move`

### CRM — leads, clients, sources
- `GET/POST /api/crm/leads` · `GET/PUT/DELETE /api/crm/leads/:id` · `GET /api/leads/list` · `POST /api/leads/:id/convert-to-client` · `POST /api/leads/bulk/mark-new-contacted`
- `GET/POST /api/crm/clients` · `GET/PUT /api/crm/clients/:id` · `GET /api/crm/clients/:id/gallery-cover` · `GET /api/crm/clients/:id/messages`
- `GET /api/crm/clients/duplicates` · `POST /api/crm/clients/merge-duplicates` · `GET /api/crm/clients/merge-suggestions` · `POST /api/crm/clients/merge-execute` · `/merge-execute-batch` · `GET /api/admin/clients/search`
- `GET /api/crm/top-clients` · `GET /api/crm/client-segments` · `GET /api/reports/high-value-clients`
- `GET/POST /api/crm/lead-sources` · `PUT/DELETE /api/crm/lead-sources/:id`

### Communications & messages
- `GET /api/crm/messages` · `PUT/DELETE /api/crm/messages/:id`
- `GET /api/communications/client/:clientId` · `/all` · `POST /api/communications/email/send` · `/sms/send` · `/sms/bulk` · `GET/POST /api/communications/sms/config` · `POST /api/communications/bulk/preview` · `PATCH /api/communications/:messageId/read` · `POST /api/communications/email/test`

### Inbox & email management
- `GET /api/inbox/emails` · `GET/POST /api/inbox/folders` · `PUT/DELETE /api/inbox/folders/:id`
- `POST /api/inbox/emails/move` · `PUT /api/inbox/emails/mark-read` · `PUT /api/inbox/emails/:id/link-client` · `POST /api/inbox/emails/auto-link` · `GET /api/inbox/emails/clients-list` · `POST /api/inbox/emails/bulk-delete-unread`
- `GET/POST /api/inbox/spam-rules` · `DELETE/PATCH /api/inbox/spam-rules/:id` · `POST /api/inbox/emails/spam-filter`
- `POST /api/email/import` · `GET /api/email/import-status` · `POST /api/email/test-connection` · `POST /api/email/settings/save` · `GET /api/email/settings` · `GET /api/emails/sent` · `POST /api/email/send` · `POST /api/email/refresh`

### Email campaigns & marketing
- `GET/POST /api/admin/email/campaigns` · `GET/PUT/DELETE /api/admin/email/campaigns/:id` · `POST /api/email/campaigns/send`
- `GET /api/email/analytics/campaign/:id` · `/:id/subscribers` · `POST /api/email/analytics/campaign/:id/create-segment-campaign` · `GET /api/email/analytics/sequence/:id` · `/overall`
- `GET /api/email/ai/insights` · `/recommendations` · `/send-time/:subscriberId` · `/predict-engagement/:campaignId`
- `POST /api/email/ab-test` · `GET /api/email/deliverability` · `POST /api/email/validate` · `POST /api/email/subscribers/bulk-import` · `/bulk-update`
- `POST /api/brevo/test-email` · `GET /api/brevo/account`

### Surveys & questionnaires
- `GET/POST /api/surveys` · `PUT/DELETE /api/surveys/:id`
- `POST /api/admin/create-questionnaire-link` · `GET /api/admin/questionnaire-responses` · `POST /api/admin/attach-response-to-client` · `DELETE /api/admin/questionnaire-responses/:id` · `GET/PUT /api/admin/questionnaire-email-template`
- `POST /api/questionnaires` · `GET /api/questionnaires/:slug/responses`

### Photography sessions, calendar & scheduling
- `GET/POST /api/photography/sessions` · `GET/PUT/DELETE /api/photography/sessions/:id` · `GET /api/photography-sessions` · `GET /api/photography/calendar-pages`
- `GET/POST /api/calendar/sessions` · `PUT/DELETE /api/calendar/sessions/:id` · `POST /api/admin/embed/slots`
- `GET/POST /api/calendar/appointments` · `PUT/DELETE /api/calendar/appointments/:appointmentId` · `GET /api/calendar/appointments/client/:clientId` · `GET /api/calendar/available-slots` · `/availability`
- `GET /api/calendar/google/status` · `/auth-url` · `POST /api/calendar/google/disconnect` · `/sync` · `PUT /api/calendar/google/settings` · `POST /api/calendar/import/google` · `/import/ics`
- `GET /api/admin/calendar/stacked-clusters` · `POST /api/admin/calendar/cleanup-stacked` · `/prune-history` · `GET /api/admin/calendar-analytics`
- Schedulers: `GET/POST /api/schedulers` · `GET/PUT/DELETE /api/schedulers/:id` · `GET /api/schedulers/:id/bookings` · `/bookings/all` · `DELETE /api/schedulers/bookings/:bookingId` · `PUT /api/schedulers/bookings/:bookingId/status` · `POST /api/schedulers/:id/blocked-times` · `DELETE /api/schedulers/blocked-times/:id` · `POST /api/schedulers/bookings/:bookingId/sync-gcal`

### Pricing & price wizard
- `POST/PUT/DELETE /api/crm/price-list(/:id)` · `POST /api/crm/price-list/import` · `POST /api/crm/price-guide/upload` · `POST /api/crm/price-guide/save-info`
- Price Wizard (`/api/price-wizard/*`): `start`, `discover`, `scrape`, `analyze`, `research`, `quick-start`, `activate-suggestion`, `reject-suggestion`, `add-manual-price`, and `GET status/competitors/prices/suggestions/sessions` by `:sessionId`.

### Invoices & payments
- `GET /api/crm/invoices` · `GET/POST /api/crm/invoices(/:id)` · `PUT/PATCH/DELETE /api/crm/invoices/:id` · `POST /api/crm/invoices/:id/convert-to-invoice`
- `POST /api/crm/invoices/:id/email` · `/sms` · `/whatsapp` · `POST /api/crm/invoices/:invoiceId/receipt`
- `GET/POST /api/crm/invoices/:invoiceId/payments` · `DELETE /api/crm/invoices/:invoiceId/payments/:paymentId`
- `GET /api/invoices/list` · `/status` · `POST /api/invoices/update-status` · `/send-email` · `/send-whatsapp` · `/send-sms` · `POST /api/invoice-edit`

### Vouchers (admin)
- `POST/PUT/DELETE /api/vouchers/products(/:id)` · `GET /api/admin/vouchers/products/:id`
- `GET/POST /api/admin/vouchers/templates` · `PUT/DELETE /api/admin/vouchers/templates/:id` · `POST /api/admin/vouchers/templates/upload-image` · `POST /api/admin/vouchers/fix-image-urls`
- `GET/POST /api/vouchers/coupons` · `PUT/DELETE /api/vouchers/coupons/:id` · `GET /api/vouchers/coupons/analytics`
- `GET/PUT /api/vouchers/settings` · `GET /api/vouchers/products.csv` · `/sales.csv` · `GET/POST /api/vouchers/sales` · `PUT /api/vouchers/sales/:id` · `POST /api/vouchers/sales/:id/create-client` · `POST /api/vouchers/sync-stripe` · `GET /api/admin/vouchers/print-queue`

### Landing pages
- `GET/POST /api/admin/landing-pages` † (`landing-pages:write` on POST) · `PUT /api/admin/landing-pages/:id` † · `POST /api/admin/landing-pages/:id/publish` † · `/unpublish` · `DELETE /api/admin/landing-pages/:id`
- `GET /api/admin/landing-pages/templates` · `POST /api/admin/landing-pages/check-slug` · `/generate` · `/regenerate-section` · `POST /api/admin/landing-pages/:id/preview-link` · `/duplicate` · `GET /api/admin/landing-pages/:id/revisions`
- Analytics/automation/variants/executions: the full `/api/admin/landing-pages/:id/{analytics,variants,promo-pack,growth-insights,automation-rules,automation-events,recommendations,campaign-health,scheduled-actions,crm-routing,automation-run,executions,execution-settings}` family (GET/POST/PUT/DELETE as applicable).

### Studio config, dashboard, setup
- `GET /api/admin/dashboard-stats` · `/notifications` · `/email-settings` · `GET/PUT /api/admin/studio-location`
- Setup: `/api/setup/*` (status, basics, integrations, scanning, fix-first, drafts, complete) and technical setup `/api/setup/technical/*` (domain, email, stripe, storage, security, tests, current).

### Knowledge base, manual pages (CMS)
- `GET/POST /api/knowledge-base` · `PUT/DELETE /api/knowledge-base/:id`
- `GET /api/manual-pages` · `POST /api/manual-pages/:pageId` · `/:pageId/publish` · `DELETE /api/manual-pages/:pageId`

### Accounting & storage
- `GET /api/accounting-export/profiles` · `POST /api/accounting-export/preview` · `/generate` · `GET /api/accounting-export/period-summary` · `/audit-log`
- `GET /api/storage/usage` · `/dashboard` · `POST /api/storage/recalculate`

### Integrations (own scoped-key namespaces)
- **ShootCleaner** (`X-API-Key`/Bearer + scopes): `/api/integrations/shootcleaner/{health,galleries,galleries/:id/images,digital-files,...}`.
- **Pulse (AxixOS Social):** outbound — this backend *pushes* to `POST https://axixos-social.de/api/v1/posts` (see the social-pack/Pulse work).

---

## 9. Notes for the generator

- **CORS for a new domain:** if Infinite Authority's generated site is served from a different origin and makes authenticated/keyed calls, add that origin to the backend CORS allow-list (`server/index.ts`). Read-only public calls already work cross-origin.
- **One sitemap per host:** the backend serves `/sitemap.xml` + `/robots.txt`. Don't ship a competing sitemap on the same host.
- **Idempotent writes:** when creating blog posts/landing pages, check slug availability (`POST /api/admin/landing-pages/check-slug`) and namespace generated slugs to avoid clobbering hand-authored pages.

---

*Generated for the Infinite Authority scaffolding pipeline. Contract reflects the backend as of this handoff; treat the PUBLIC shapes in §4 as stable and build against them. The scoped-key system in §3 is implemented and ready to mint against.*
