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

**Recommendation for Infinite Authority write-back:** use the `X-Admin-Token` header from Infinite Authority's *backend* (never ship the token to the browser). 

> **Future-proofing (recommended):** the backend already has a **scoped API-key** pattern for integrations (see ShootCleaner: `Authorization: Bearer <key>` + `requireScope('...:write')`, and the Pulse social keys). The clean long-term path is to mint a dedicated scoped key for Infinite Authority (e.g. scopes `blog:write`, `landing-pages:write`) instead of sharing the admin token. This is a small additive backend change if you want it.

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

## 8. Full endpoint index (reference)

A complete method/path/auth catalog for **every** backend endpoint (public + admin, ~400 routes across `server/routes.ts` and `server/routes/*`, `server/*-routes.ts`) was generated during this handoff. The public subset above is what the new site consumes; the admin subset is available for write-back and for future tooling. Key admin groups not detailed above: Inbox/email, Email campaigns, CRM leads/clients, Invoices, Calendar/Google sync, Schedulers, Accounting export, Setup/technical, Knowledge base, Agents/AI. Ask if you want the exhaustive admin list expanded inline here.

---

*Generated for the Infinite Authority scaffolding pipeline. Contract reflects the backend as of this handoff; treat the PUBLIC shapes in §4 as stable and build against them.*
