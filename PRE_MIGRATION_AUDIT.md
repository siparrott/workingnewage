# New Age Fotografie — Pre-Migration Audit (Heroku → Render)

_Prepared for the studio owner · 12 Jul 2026 · consolidates 8 dimension reviews (i18n, correctness, SEO, performance, accessibility, security, conversion-UX, code-health)_

---

## 1. Executive summary

The application is fundamentally sound and mostly production-proven, but it carries **one critical live bug and a cluster of migration-sensitive regressions** that should be closed before or during the Render cutover. The single most urgent issue is a **React hooks-order crash on the primary voucher checkout** (`CheckoutPage.tsx`) that white-screens every real database-voucher purchase — this is independent of the migration and blocks revenue today. The migration itself introduces three specific regressions the current Heroku deploy does *not* have: **prerendering is silently disabled in the Dockerfile** (killing crawler/social-scraper SEO), **there is no HTTP compression**, and several **payment/AI features fail silently if `STRIPE_SECRET_KEY` / `OPENAI_API_KEY` are not carried over as Render env vars**. Beyond that, the "bilingual" promise is largely cosmetic — roughly a dozen core marketing pages render only German, and there is no site-wide translation path — and there are broad-but-non-blocking hardening opportunities in security (no rate limiting), performance (no code-splitting, full-res gallery thumbnails), and accessibility.

**Biggest risks, ranked:** (1) broken voucher checkout, (2) SEO/social-preview regression from disabled prerender, (3) silent payment/translation failure on missing Render env vars, (4) unthrottled public endpoints, (5) an EN/DE selector that doesn't actually translate much of the site.

**Severity counts:** 1 critical · 7 high · 22 medium · 7 low (37 findings after dedup).

---

## 2. Fix before migrating (shortlist)

These are the items that most affect moving a known-good app onto Render. Ordered by priority.

| # | Item | Why it must precede cutover | Effort |
|---|------|-----------------------------|--------|
| 1 | **CheckoutPage hooks-order crash** breaks the primary voucher purchase funnel | Critical revenue bug live today; don't launch on new infra with it | Medium |
| 2 | **Set & validate `OPENAI_API_KEY` and `STRIPE_SECRET_KEY` as Render env vars; fail loudly if missing** | Both AI translation and Stripe silently no-op / fake-succeed if the keys aren't carried over (they read `process.env` directly, bypassing the DB config-reader) | Quick |
| 3 | **Restore prerendering in the Dockerfile build** (`npm run prerender:routes` + `PRERENDER=1 npm run build`) | Render runs `./Dockerfile`, which never runs `heroku-postbuild`, so per-page SEO/OG previews vanish — a regression vs current Heroku | Medium |
| 4 | **Add `compression` middleware** in `server/index.ts` | One-line, high-ROI; oversized JS bundle currently ships uncompressed | Quick |
| 5 | **Verify the Stripe webhook** (add signature verification + reconfirm endpoint URL/secret on Render) | Webhook secret/URL changes on migration; endpoint currently trusts unsigned events | Medium |
| 6 | **Add rate limiting to public POSTs and login** | No throttling anywhere; new public URL is a fresh target | Medium |
| 7 | **Template sitemap.xml / robots.txt / canonicals from `PUBLIC_SITE_URL`** | Curated sitemap entries are hardcoded to `newagefotografie.com`; a different Render host yields a mixed-host sitemap Google drops | Medium |
| 8 | **Return real resized gallery thumbnails instead of full-res originals** | Client galleries pull tens of MB of originals per grid → Render/B2 egress cost from day one | Medium |

---

## 3. Findings by dimension (most severe first)

### Correctness

**[CRITICAL] CheckoutPage conditional early-return before Hooks crashes the primary voucher checkout**
`client/src/pages/CheckoutPage.tsx:76` (hooks at :43–44, :97–101, :106, :168)
- **Impact:** For real DB voucher products (UUID ids), render 1 runs all ~10 hooks and fetches the product; render 2 makes `voucher` truthy, the early `return <VoucherFlow/>` at line 76 fires, and the 8 hooks below it are skipped → React throws "Rendered fewer hooks than expected" and white-screens. Every buy/personalize click on a database voucher (the live path, `VoucherDetailPage.tsx:201`) hard-crashes.
- **Fix:** Move ALL hooks above every conditional `return`; render `VoucherFlow` via conditional JSX at the end, or extract the personalization view into an always-mounted child component.
- **Effort:** Medium.

**[MEDIUM] VoucherCheckoutPage: PaymentIntent flow has no server fulfillment**
`client/src/pages/VoucherCheckoutPage.tsx:103`; endpoint `server/routes.ts:12479`; webhook `:12522`
- **Impact:** `response.json()` is destructured with no `res.ok`/content-type check (a 500 yields `confirmCardPayment(undefined)`). Worse, there is **no `payment_intent.succeeded` handler anywhere** (grep = 0), so a successful card charge writes no `voucher_sales` row and sends no email — the customer is charged and gets nothing. Live exposure is capped: the route is wired at `App.tsx:226` but has **no UI link** (reachable only by direct URL); the real funnel uses Stripe Checkout sessions.
- **Fix:** Either disable the orphaned route, or (a) guard `res.ok` + `clientSecret` type before confirming, and (b) add a signature-verified `payment_intent.succeeded` webhook mirroring the session flow.
- **Effort:** Medium.

**[MEDIUM] Stripe webhook processes events without verifying the signature**
`server/routes.ts:12522`
- **Impact:** `/api/vouchers/stripe-webhook` acts on any `checkout.session.completed` POST with no `stripe.webhooks.constructEvent` check — a forged event can insert paid `voucher_sales` records / create vouchers. Also fragile if the endpoint URL/secret isn't reconfigured on Render.
- **Fix:** Verify with `constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)` and reject failures before any DB write.
- **Effort:** Medium.

**[MEDIUM] Gallery "Download all" treats any response as a ZIP blob**
`client/src/pages/GalleryPage.tsx:349–362`
- **Impact:** No `res.ok` check before `.blob()`; a 401/403/500 error body is force-downloaded as `<title>.zip`, so customers get a corrupt, unopenable archive with no error shown.
- **Fix:** `if (!response.ok) throw` before `.blob()` and surface a toast (existing `.catch` handles it).
- **Effort:** Quick.

**[LOW] Missing Stripe key silently returns a fake "paid" session** *(migration footgun)*
`server/services/stripeVoucherService.ts:158–192, 394–431`
- **Impact:** When `STRIPE_SECRET_KEY` is unset/malformed, `createCheckoutSession` returns a mock `payment_status:'paid'` + `/checkout/mock-success` with no error. Realized harm is limited (the customer-facing mock page is clearly labelled "Demo Modus"; the demo email branch targets a hardcoded `demo@example.com` and the success API has no client caller), so the practical outcome under misconfiguration is a confusing demo page, not free vouchers to customers — but it *is* a silent-failure risk on cutover.
- **Fix:** In production, throw when `!stripeConfigured` (gate the mock behind an explicit `DEMO_MODE`/`NODE_ENV`), and add a startup env check that refuses to boot payment routes without a valid key.
- **Effort:** Medium.

**[LOW] Daily report cron emails a hardcoded placeholder address**
`server/jobs/index.ts:20–28`
- **Impact:** The 07:00 lead-count report sends to `owner@studio.com`, so the studio never receives it.
- **Fix:** Resolve from `STUDIO_NOTIFY_EMAIL` / email settings (as other handlers do); skip if none.
- **Effort:** Quick.

### SEO

**[HIGH] Render build skips prerendering — all per-page SEO becomes client-only** *(migration regression)*
`Dockerfile:8,13,27`; `render.yaml:22`; `package.json:29`
- **Impact:** Prerendering (`@prerenderer/rollup-plugin`, `PRERENDER=1`) lives only in `heroku-postbuild`, which Render's Docker build never runs. Googlebot renders JS eventually, but **all social scrapers (Facebook, LinkedIn, WhatsApp, Twitter) and the first-wave crawl** see only the generic homepage title/description/OG image for every service page and blog post. Rich link previews break; this is a regression vs the current prerendered Heroku deploy.
- **Fix:** Add `npm run prerender:routes` then `PRERENDER=1 npm run build` to the Dockerfile build stage; install Chromium for Puppeteer (or set `PUPPETEER_EXECUTABLE_PATH`). Verify `dist/*.html` contains baked per-route meta/JSON-LD before cutover.
- **Effort:** Medium.

**[HIGH] German-only content + `de_AT` locale leave essentially zero English-indexable surface**
`client/index.html:2,27`; `client/src/config/seo-config.ts`; `UeberUnsPage.tsx`
- **Impact:** All titles, meta descriptions, H1s and JSON-LD descriptions are German; `html lang`/`og:locale` are `de`/`de_AT`; the EN/DE toggle only swaps runtime text — it creates no English URLs, meta, or prerendered HTML. Combined with the broken `/en` hreflang below, there is nothing to index in English, forfeiting Vienna's substantial English/expat demand.
- **Fix:** If EN reach matters, generate real `/en/*` URLs with translated `<title>`/description/H1/JSON-LD (reuse `server/lib/translate.ts`) and reciprocal hreflang (see §4). If not, drop the `en` hreflang and target DE only.
- **Effort:** Large.

**[MEDIUM] hreflang declares English alternates at `/en/` URLs that don't exist**
`client/src/pages/HomePage.tsx:387–390`; `FamilienfotosWienPage.tsx:94–97` (+~18 pages); `SEOHead.tsx:87–94`
- **Impact:** ~20 pages emit `hreflang="en"` → `/en/...`, but `App.tsx` has zero `/en` routes (soft-404). Google ignores the whole hreflang cluster and logs Search Console errors. German pages keep valid self-canonicals, so no deindexing — this is hygiene/crawl-noise, not a ranking threat. (`BlogPage.tsx:340` does include an `x-default`; the other pages don't.)
- **Fix:** Remove the `en` entries (keep `de`/x-default self-reference) until real English pages exist.
- **Effort:** Quick.

**[MEDIUM] Sitemap & robots.txt hardcode `newagefotografie.com` while blog/canonicals use `PUBLIC_SITE_URL`**
`client/public/sitemap.xml` (+duplicate `public/sitemap.xml`); `public/robots.txt:13`; `server/vite.ts:27,55,86`
- **Impact:** The dynamic sitemap injects blog/landing URLs from `PUBLIC_SITE_URL` but merges them into ~48 curated `<loc>`s hardcoded to `newagefotografie.com`. On any other host (portable-pg/Render), the sitemap mixes two hosts — Google drops the mismatched URLs — and canonicals disagree with the sitemap host.
- **Fix:** Template the curated sitemap and robots `Sitemap:` line from `PUBLIC_SITE_URL`; delete the duplicate `public/sitemap.xml`.
- **Effort:** Medium.

**[MEDIUM] Duplicate / partly-invalid structured data on the homepage**
`HomePage.tsx:394–410`; `SEOHead.tsx:37–43`; `UeberUnsPage.tsx:150–159`
- **Impact:** `SEOHead` injects `ProfessionalService` on every page; HomePage adds a separate `LocalBusiness` with a hardcoded `Margaretenstraße, 1050 Wien` address and `image: … || 'https://example.com/placeholder.jpg'`; UeberUns emits a third. Two conflicting business `@type`s plus a non-resolving placeholder image can suppress rich results; the hardcoded address is wrong for any other tenant.
- **Fix:** One business entity type; drive address/image from `SITE.*` (omit image if none); reconcile the blocks with the shared schema.
- **Effort:** Medium.

**[MEDIUM] Blog post SEO is fully client-side and fragile**
`client/src/components/blog/BlogSEO.tsx:10,57,78`
- **Impact:** Title/description/OG/canonical/JSON-LD are set imperatively inside `useEffect` (post-JS only); canonical derives from `window.location.origin` (unavailable to scrapers) and the JSON-LD author is the email local-part. Without prerender, none of this reaches crawlers/social.
- **Fix:** Move blog meta into `react-helmet-async` (so it prerenders), build the canonical from `SITE.url`, use a real author display-name field.
- **Effort:** Medium.

**[LOW] `seo-config.ts` is a parallel SEO source pages don't use**
`client/src/config/seo-config.ts:30–341`
- **Impact:** `getSEOConfig`/`validateSEO` are referenced nowhere; pages pass literal props to `SEOHead`, so the centralized config (and its length validation) silently drifts.
- **Fix:** Either source page meta from `getSEOConfig(path)` (one source of truth) or delete the dead config.
- **Effort:** Medium.

### Performance

**[HIGH] No route-level code splitting — the entire admin CRM ships in the public bundle**
`client/src/App.tsx` (~137 eager imports); `vite.config.ts:168–175`
- **Impact:** Every admin page (dashboard, calendar, invoices, agent console, editors, charts) is statically imported; zero `React.lazy`/`Suspense`. First-time public visitors download/parse/execute the whole admin app they never see. Prerender mitigates first paint for crawlers, but interactive users pay a large TTI/hydration cost on mobile. (Note: the ">5MB" figure is unconfirmed; the warning limit is set to 2MB.)
- **Fix:** `React.lazy(() => import(...))` for every `pages/admin/*` route (plus heavy public pages), wrap `<Routes>` in `<Suspense>`; optionally group admin vendor libs via `manualChunks`.
- **Effort:** Medium.

**[HIGH] No HTTP compression (gzip/brotli) on any response** *(migration config)*
`server/index.ts` (middleware stack); `compression` absent from `package.json`
- **Impact:** JS/CSS/HTML/JSON served uncompressed. The image-heavy byte weight limits the total win, but the render-blocking JS bundle on mobile shrinks ~75–85% with gzip/brotli — a cheap, high-ROI fix.
- **Fix:** `npm i compression`; `app.use(compression())` near the top of the stack in `server/index.ts` (and `index.production.ts`). Confirm Render's edge isn't already compressing.
- **Effort:** Quick.

**[HIGH] Gallery API returns full-resolution originals as thumbnails** *(Render/B2 egress)*
`server/routes.ts:4686–4700`
- **Impact:** `thumbUrl`/`displayUrl`/`originalUrl` all resolve to `img.url` (the notNull full-size original; there are no thumb/display columns). An N-image grid loads N multi-MB originals. The gallery upload path (`routes.ts:4580–4630`) stores the raw buffer and generates no thumbnail at all, so none exists to fall back to. High-frequency page for paying clients.
- **Fix:** Generate and persist a resized thumb/display variant (sharp 360px/1400px) on upload; point `thumbUrl` at the small variant, `originalUrl` at the full image. Pair with lazy-loading below.
- **Effort:** Medium.

**[MEDIUM] `getBlogPosts` loads the entire table, then filters/paginates in JS**
`server/storage.ts:239–258`; `server/routes.ts:2281–2322`
- **Impact:** `SELECT *` with no LIMIT/OFFSET; search/tag/exclude via `.filter()`, pagination via `.slice()`. For EN requests it translates *every* post's title+excerpt before slicing to 10 — per-request work scales with archive size.
- **Fix:** Push filtering + LIMIT/OFFSET + COUNT into SQL; translate only the paginated slice.
- **Effort:** Medium.

**[MEDIUM] Blog fetch-by-UUID loads the entire table then `.find()`s**
`server/routes.ts:2346–2349`
- **Impact:** UUID branch calls full-table `getBlogPosts()` + in-memory find, though indexed `getBlogPost(id)` (`storage.ts:260`) exists.
- **Fix:** Replace with `post = await storage.getBlogPost(identifier)`.
- **Effort:** Quick.

**[MEDIUM] No database indexes on hot filter/sort columns**
`shared/schema.ts` (0 `index()` calls)
- **Impact:** Only `.unique()` columns get implicit indexes. Frequent predicates/sorts (`blog_posts(published, published_at)`, many `orderBy(desc(createdAt))`) run sequential scans + sorts that degrade linearly as blog/clients/leads/messages grow on Render's managed Postgres.
- **Fix:** Add Drizzle indexes on hot columns via table index callbacks + a migration.
- **Effort:** Medium.

**[MEDIUM] Content-hashed static assets served with no long-lived cache headers**
`server/vite.ts:230`
- **Impact:** `express.static(distPath, { index: false })` uses defaults → `max-age=0` + ETag revalidation. Repeat visits/sub-navigations pay a conditional round-trip per asset (cheap 304s, not re-downloads — hence medium).
- **Fix:** `{ maxAge: '1y', immutable: true }` for hashed `/assets/*`; keep `index.html` uncached (it's served dynamically via `renderedIndex()`).
- **Effort:** Quick.

**[MEDIUM] Images lack lazy loading and responsive `srcset`/`sizes`**
`client/src` (236 `<img>`, only 50 `loading="lazy"`, 0 `srcset`, ~3 WebP)
- **Impact:** Below-the-fold portfolio/gallery/blog images download eagerly at full resolution as JPEG/PNG, missing WebP/AVIF savings — a steady LCP/data drag on image-heavy pages.
- **Fix:** Add `loading="lazy"` + `decoding="async"` below the fold; add `srcset`/`sizes` (paired with the resized variants from the gallery-thumbnail fix); prefer WebP.
- **Effort:** Large.

### Security

**[HIGH] No rate limiting on any endpoint; public POSTs and login are unthrottled**
`server/index.ts` (no `express-rate-limit`/`helmet`); `/api/contact` `:16319`, `/api/leads/create` `:3392`, `/api/waitlist` `:16405`, `/api/newsletter/signup` `:16591`, login route
- **Impact:** All public unauthenticated POSTs and the login route accept unlimited requests — enabling credential brute-force, contact/lead/newsletter spam, and resource exhaustion. A fresh public URL on Render is an immediate target.
- **Fix:** Add `express-rate-limit` (stricter on login and unauthenticated POSTs) and `helmet` for baseline headers.
- **Effort:** Medium.

**[MEDIUM] Unauthenticated public file-upload writes to public CDN storage**
`server/routes.ts:12438` (`POST /api/vouchers/upload-photo`)
- **Impact:** Registered with only `upload.single('image')` and no auth (every sibling upload route uses `authenticateUser`/`authOrApiKey`). Anonymous users can loop 20MB uploads to the B2/S3 bucket → storage/bandwidth cost exhaustion. Mitigated by sharp re-encoding to WebP (image-only, no arbitrary content), so no RCE/brand-hosting of scripts — hence medium not high.
- **Fix:** Require auth/scoped key, or (if it must stay public for checkout) gate behind a per-IP rate limiter + short-lived signed upload token issued only during an active checkout session.
- **Effort:** Quick.

### Accessibility

**[HIGH] Mobile hamburger menu button has no accessible name and no visible focus**
`client/src/components/layout/Header.tsx:175–180`
- **Impact:** The toggle is an icon-only `<button>` (lucide `<Menu>`, aria-hidden) with no `aria-label`/`aria-expanded`/`aria-controls`, and `focus:outline-none` with no replacement ring. On mobile — the dominant traffic — this is the sole path to navigation. WCAG 4.1.2 (A) + 2.4.7 (AA).
- **Fix:** Add language-aware `aria-label` ("Menü öffnen"/"Open menu"), `aria-expanded={menuOpen}`, `aria-controls`, and `focus-visible:ring-2`. The desktop language toggle (`:162`) is the existing pattern.
- **Effort:** Quick.

**[MEDIUM] Waitlist/booking form inputs have no programmatically associated labels**
`client/src/pages/WartelistePage.tsx:150–224`
- **Impact:** Labels have no `htmlFor` and wrap no input; inputs have no `id`. Screen readers announce unlabeled edit boxes on the primary lead-capture form (WCAG 1.3.1/3.3.2/4.1.2). Placeholders partly mask this except the date field (line 170), which is genuinely nameless.
- **Fix:** Give each input an `id` + matching `htmlFor` (or wrap the input). `KontaktPage.tsx`/`VoucherCheckoutPage.tsx` do this correctly.
- **Effort:** Quick.

**[MEDIUM] Fotoshootings mega-menu is hover-only and unreachable by keyboard**
`client/src/components/layout/Header.tsx:94–124`
- **Impact:** The trigger button opens only via `onMouseEnter/Leave`; no `onClick`, no `aria-haspopup`/`aria-expanded` (WCAG 2.1.1). Not fully blocking — the Footer has keyboard-focusable links to every service page and the mobile submenu (`:205`) toggles correctly — but the desktop primary-nav path fails.
- **Fix:** Add an `onClick` toggle (mirroring the About dropdown at `:132`), `aria-haspopup`/`aria-expanded`, and Escape/blur close; keep hover as enhancement.
- **Effort:** Medium.

**[MEDIUM] Gallery lightbox modal lacks dialog semantics, focus trap, and icon-button labels**
`client/src/components/galleries/Slideshow.tsx:233–434`
- **Impact:** Plain `<div>` with no `role="dialog"`/`aria-modal`; focus is never moved in or trapped, so Tab cycles the background page behind the overlay. Close/prev/next/play/fullscreen/favorite/download are icon-only with names only via `title`. (Escape/arrow handling is present — good.)
- **Fix:** Add `role="dialog" aria-modal="true"` + `aria-label`; move focus to Close on open, restore on close, trap Tab; add explicit `aria-label` to each icon button.
- **Effort:** Medium.

**[MEDIUM] Voucher search field is labeled only by placeholder**
`client/src/pages/VouchersPage.tsx:315–322`
- **Impact:** Only a placeholder, no `<label>`/`aria-label` — unnamed control in the voucher shopping flow (WCAG 3.3.2/4.1.2).
- **Fix:** Add `aria-label={t('vouchers.searchPlaceholder')}` or a visually-hidden label.
- **Effort:** Quick.

**[LOW] Terms-and-conditions link in voucher checkout points to a dead anchor**
`client/src/pages/VoucherCheckoutPage.tsx:247`
- **Impact:** The required-consent "Geschäftsbedingungen" link is `href="#"`; buyers must accept terms they cannot open.
- **Fix:** Point at the real terms route or open the terms in a dialog.
- **Effort:** Quick.

### Internationalization (i18n)

**[MEDIUM] ~12 core public pages are hardcoded German with no English path**
`client/src/pages/support/{UeberUnsPage,FAQPage,ImpressumPage,KundenstimmenPage,PreisePage}.tsx`; `client/src/pages/fotoshootings/{BabyFotografieWienPage,BusinessFotoshootingPage,EventFotoshootingPage,FamilienFotoshootingWienPage,FamilyFotoshootingPage,KinderFotografieWienPage,WeddingFotoshootingPage}.tsx`
- **Impact:** These pages hold German literals directly in JSX; several don't even import `useLanguage`. Picking EN leaves About Us, Prices, FAQ, testimonials and 7 shoot pages entirely German — the EN selector is cosmetic there. **Correction to the original report:** the legal pages (`AGBPage`, `DatenschutzPage`, `ModelReleasePage`) are in fact *fully bilingual*, so the alarming "legal-clarity risk for Terms/Privacy" is false — this is a content/UX gap, not a legal one.
- **Fix:** Route these pages through the site-wide AI-translate layer (§4) — author German once, translate on render by content hash — rather than hand-translating ~200 strings.
- **Effort:** Large.

**[MEDIUM] The AI-translate layer exists but is wired ONLY to the blog**
`server/lib/translate.ts` consumed only at `server/routes.ts:2288, 2364`
- **Impact:** `translate.ts` already does content-hash keying, per-target cache, safe fallback and HTML-preserving prompts — but nothing outside the two `/api/blog` endpoints calls it. There's no generic `/api/translate`, and `useManualPageContent` never funnels missing translations through it. This is the missing architectural piece behind the hardcoded-German gap.
- **Fix:** Promote to `POST /api/translate { texts[], target }` backed by a durable cache; have `useManualPageContent`'s German-fallback branch call it.
- **Effort:** Large.

**[MEDIUM] `useManualPageContent` silently returns German to English visitors when no EN override exists**
`client/src/hooks/useManualPageContent.ts:62–68`
- **Impact:** For CMS-driven pages, when `language !== 'de'` and only a German override exists, the hook returns German (line 67) — the default state — so even "translation-ready" pages leak German silently with no QA signal.
- **Fix:** Pass the German through the AI-translate layer and cache, or at minimum flag untranslated keys; manual EN overrides become a quality upgrade over AI output.
- **Effort:** Medium.

**[MEDIUM] 13 fotoshootings pages are bilingual via 1,239 inline `language === 'de' ? … : …` ternaries**
`client/src/pages/fotoshootings/*.tsx`
- **Impact:** These *do* render EN today, but every string hardcodes both languages inline — no single source of truth, high drift risk, ~1,200 strings to keep in sync by hand.
- **Fix:** Once the site-wide layer exists, migrate to author-German-only + translate, or move strings into `LanguageContext`/CMS. Lower priority since they work.
- **Effort:** Large.

**[MEDIUM] Blog translation runs synchronously in-request on cold cache**
`server/routes.ts:2287–2295, 2363–2370`
- **Impact:** The list endpoint translates every post's title+excerpt (`Promise.all`) and the single-post endpoint 6 fields, all awaited before `res.json`. With a non-durable cache (below), the first EN visitor after each deploy waits on many OpenAI round-trips; list cost scales with post count.
- **Fix:** Pair a durable cache with a pre-warm job on publish/deploy so the request path is always a cache hit, and/or return German immediately while translating in the background.
- **Effort:** Medium.

**[LOW] Blog translation cache is in-memory and non-durable**
`server/lib/translate.ts:10–11, 56`
- **Impact:** Process-local `Map`, `MAX_CACHE=5000` full-`clear()` (not LRU), wiped on every restart and not shared across instances. On Render's restarts/cycling the cache is cold most of the time → repeated OpenAI cost and a slow first render. Low: cost is trivial at blog scale and the clear-at-5000 branch effectively never fires for one studio.
- **Fix:** Back with a durable store keyed `${target}:${sha1(source)}` (a `translations` table or Redis); read/write-through. Same cache serves the site-wide layer.
- **Effort:** Medium.

**[LOW] `translate.ts` reads `process.env.OPENAI_API_KEY` directly, bypassing the DB-first config-reader** *(migration footgun)*
`server/lib/translate.ts:26,35` vs `server/config-reader.ts:211–240`
- **Impact:** If the studio set the key via admin UI (DB) rather than an env var, both autoblog *and* translation silently no-op (translate returns German) with only a `console.warn`. On cutover, a missing Render env var reverts the entire bilingual blog to German with no error.
- **Fix:** Resolve the key via `config-reader` (DB-first, env fallback), or add a startup check that fails loudly. Document `OPENAI_API_KEY` as a required Render env var.
- **Effort:** Quick.

**[LOW] Frontend `Language` type is only `'en'|'de'` while the translate layer supports fr/es/it**
`client/src/context/LanguageContext.tsx:4` vs `server/lib/translate.ts:13–19`
- **Impact:** Server can produce FR/ES/IT but the UI can never request them — dead capability, no user-facing bug.
- **Fix:** Trim `LANG_NAME` if only EN/DE is intended, or widen the client type/selector/dictionary if multilingual is planned.
- **Effort:** Quick.

---

## 4. Site-wide bilingual (AI-translate) plan

The good news: the hard part already exists. `server/lib/translate.ts` does content-hash keying (sha1 of source), per-target caching, safe fallback to the original, and HTML-tag-preserving prompts. It's simply not wired to anything but the blog. Turn the five i18n findings into one coherent layer:

**Step 1 — Make the cache durable (unblocks everything).** Add a `translations` table (`hash, target, source_preview, output, created_at`, unique on `(hash, target)`) and convert `translate.ts` to read-through/write-through against it. Drop the `clear()`-at-5000 flush. This survives Render restarts and multi-instance, and is the shared backbone for both blog and content pages.

**Step 2 — Expose a generic endpoint.** `POST /api/translate { texts: string[], target }` → returns hash-keyed translations from the durable cache, translating only misses. Keep the existing safe-fallback-to-source behaviour.

**Step 3 — Funnel content pages through it.** Change `useManualPageContent`'s German-fallback branch (`:62–68`) to batch the page's German strings to `/api/translate` and cache by `target:sha1`. This flips ~12 hardcoded-German pages and all CMS-driven pages to English automatically, with manual EN overrides becoming an optional quality upgrade rather than the only path. Migrate the 13 ternary-heavy fotoshootings pages onto the same author-German-once model over time.

**Step 4 — Pre-warm on publish/deploy.** A job that translates published blog posts + core content pages into EN on publish/deploy so the request path is always a cache hit (removes the synchronous cold-start penalty). Legal pages already have human-reviewed EN — leave those as authoritative and do **not** overwrite with AI output.

**Step 5 — Give English a real, indexable home (SEO alignment).** Runtime text-swapping is invisible to crawlers. To actually rank in English, generate real `/en/*` routes with translated `<title>`/description/H1/JSON-LD (reuse this same layer during prerender), then:
- add reciprocal `hreflang` pairs (`de` ↔ `en`) plus a single `hreflang="x-default"` on **both** versions;
- **remove the current `/en/` hreflang tags immediately** (they point at non-existent URLs and only generate Search Console errors) until the real routes exist;
- keep the language selector, but have it navigate between `/…` and `/en/…` URLs rather than only toggling client state.

**Step 6 — Decide the language scope.** If only EN/DE is intended, trim the server's fr/es/it support. If broader, widen the client `Language` type/selector alongside the layer. Either way the selector should drive real URLs, not just in-place re-renders.

---

## 5. Sequencing recommendation

**Before the migration (block the cutover on these):**
1. Fix the **CheckoutPage hooks crash** — critical, revenue-blocking, unrelated to infra.
2. **Env-var hardening:** set `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PUBLIC_SITE_URL` on Render; add startup checks that fail loudly (or make Stripe/translate throw) when they're missing. Document them in the migration runbook.
3. **Restore prerendering in the Dockerfile** and verify baked meta in `dist/*.html` — prevents a same-day SEO/social regression vs Heroku.
4. **Add compression** (one-liner) and **template sitemap/robots/canonicals from `PUBLIC_SITE_URL`** — both are migration-config correctness.
5. **Verify the Stripe webhook** (signature + reconfigured endpoint URL/secret) end-to-end against Render.

**During / immediately after cutover (high value, not strictly blocking):**
6. **Rate limiting + helmet** on public POSTs and login.
7. **Gallery thumbnail** resizing — the earlier this lands, the lower the initial Render/B2 egress bill.
8. **Route-level code splitting** for the admin CRM.
9. **Remove the broken `/en/` hreflang** and fix the homepage structured-data duplication/placeholder image.
10. Quick correctness cleanups: gallery download `res.ok` check, daily-cron recipient, blog UUID PK lookup.

**After the migration (roadmap, plan deliberately):**
11. Build the **durable-cache + generic `/api/translate` + content-page funnel** (§4 Steps 1–4) — the single highest-leverage product improvement, converting the cosmetic selector into a genuinely bilingual site.
12. **Real `/en/*` URLs + reciprocal hreflang** (§4 Step 5) to unlock English SEO reach.
13. Remaining performance work: **SQL-side blog pagination**, **DB indexes**, **static-asset cache headers**, **image lazy-load/`srcset`/WebP**.
14. Accessibility pass: **mobile hamburger name/focus**, waitlist labels, mega-menu keyboard support, lightbox dialog semantics, voucher search label, terms anchor.
15. Decide the fate of the **orphaned PaymentIntent route** (`/vouchers/checkout/:id`): either add a `payment_intent.succeeded` webhook or remove it before anyone links to it.

**Guiding principle:** the migration should be a *lift of a known-good app*, so pre-cutover work is deliberately narrow — the critical bug plus the handful of issues that are genuine Heroku→Render regressions or silent env-var failures. Everything broad (i18n architecture, perf, a11y) is real and worth doing, but doing it *before* the move only widens the change surface and the risk of the cutover itself.
