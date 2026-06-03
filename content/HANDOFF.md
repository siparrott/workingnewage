# HANDOFF — New Age Fotografie blog / SEO / social system
_For the next coding agent. Assume you have never seen this repo. Read top to bottom._

---

## 1. Project overview
**New Age Fotografie** is a real photography studio in Vienna (Wien-Margareten, 1050).
This repo is their website + an admin CRM ("TogNinja"). Recent work has focused on the
**blog / SEO / social-distribution** subsystem:
- A blog content pipeline (markdown → DB → live site).
- A **photo-first "idea-mode"** that turns uploaded photos into SEO articles using
  OpenAI Vision + a context-first writer, with EXIF/IPTC image tagging.
- Image SEO (dynamic sitemap, prerender, IPTC/geo metadata, fixed broken hero images).
- A 12-month content plan (v1 + v2) seeded as "idea" stubs.
- **Zernio** social distribution (blog → FB/IG/GMB/Pinterest/LinkedIn), CSV now + API next.

Live site: **https://www.newagefotografie.com** (Heroku). Admin UI: `/admin` (blog at `/admin/blog`).
Business: a studio business — see §13 for the HARD positioning rule that governs all content.

## 2. Stack
- **Frontend:** React + Vite (TypeScript) SPA. Tailwind. Router = react-router-dom.
  Rich text editor + admin in `client/src`. Built to `dist/` and served by Express.
- **Backend:** Express on **tsx** (no compile step; `server/index.ts`). Single big route
  file `server/routes.ts` (~16k lines). Background jobs via `node-cron` in `server/jobs/index.ts`.
- **DB:** Neon Postgres via **Drizzle ORM** (`shared/schema.ts`, `server/db.ts`).
- **Media storage:** **Backblaze B2** (S3-compatible, `@aws-sdk/client-s3`). NOT Supabase
  (Supabase was removed; a mock stub remains at `client/src/lib/supabase.ts` returning `[]`).
- **AI:** OpenAI SDK. `gpt-4o` (Vision + article writer), `gpt-4o-mini` (social captions).
- **Image metadata:** `exiftool-vendored` (bundles its own binary — no buildpack), `exifr`, `sharp`.
- **Prerender (SEO):** `@prerenderer/rollup-plugin` + Puppeteer at build time.
- **Hosting:** Heroku (Heroku-24 stack). Node ≥20.

## 3. Architecture
```
client/ (Vite SPA)  ── built ──▶ dist/ ── served by ──▶ server/ (Express, tsx)
                                                          ├─ server/routes.ts        (all /api/* incl blog + idea + social)
                                                          ├─ server/storage.ts       (Drizzle data access; getBlogPosts(published?))
                                                          ├─ server/vite.ts          (static serving + DYNAMIC /sitemap.xml)
                                                          ├─ server/jobs/index.ts    (hourly cron: auto-publish scheduled posts)
                                                          └─ server/services/
                                                               blogImageAnalysis.ts  (EXIF + Vision + IPTC/XMP + geo)
                                                               blogIdeaWriter.ts     (context-first article writer + injectImages)
                                                               blogConsent.ts        (GDPR consent gate)
                                                               b2Upload.ts           (Backblaze upload/delete/fetch)
                                                               socialSnippets.ts     (per-channel captions + UTM)
                                                               zernio.ts             (Zernio connector: buildZernioRow, profilesFor, schedulePosts)
shared/schema.ts    (Drizzle tables incl blog_posts)
content/articles/   (per-article source: <slug>.md/.html/.json — the human source of truth)
*.ts root scripts   (one-off pipeline tools, run with: npx tsx -r dotenv/config <file>.ts)
```
The public blog renders **client-side from the DB** (`/blog/:slug` → `BlogPostPage.tsx`,
which fetches `/api/blog/posts/:identifier`). Individual blog posts are NOT prerendered;
service/marketing pages ARE (see `vite.config.ts` `publicRoutes`).

## 4. Database (Neon Postgres, Drizzle)
Schema: `shared/schema.ts`. The key table for this work is **`blog_posts`**:
```
id uuid pk, title, slug (unique), content (text), content_html (text), excerpt,
image_url, image_url_2, image_url_3,           -- cover + 2 extra images (rendered on post page)
published boolean, published_at, scheduled_for,
status text  -- 'IDEA' | 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
author_id, tags text[], meta_description, seo_title,
idea_data jsonb,  -- idea-mode payload (see §below)
created_at, updated_at
```
`idea_data` shape:
```json
{ "images":[{"url","key","exif","vision","altText","iptcWritten"}],
  "context":{"location","timing","people","celebration","commentary"},
  "consent":{"given":true|false} }
```
**Current DB counts (as of handoff):** `ARCHIVED: 36` (old AI v1 articles, slugs suffixed
`--ai-v1`, unpublished), `IDEA: 63` (36 plan-v1 + 27 plan-v2 stubs, blank bodies, awaiting
photos), `PUBLISHED: 8`, `SCHEDULED: 3` (pre-existing).
- `storage.getBlogPosts(true)` → published & `published_at <= now()`. `getBlogPosts()` → all.
- Schema changes: this repo applies additive columns via raw SQL in setup scripts
  (`setup-idea-mode.ts` did `ALTER TABLE ... ADD COLUMN IF NOT EXISTS idea_data jsonb`)
  AND updates `shared/schema.ts` to match. `drizzle-kit push` exists but wasn't used here.

## 5. Environment variables (`.env` at repo root — GITIGNORED, never commit)
Required (already set): `DATABASE_URL` (Neon), `OPENAI_API_KEY`, `AWS_S3_ENDPOINT`,
`AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `ADMIN_TOKEN`.
Zernio (set): `ZERNIO_API_KEY` (⚠ rotate — was shared in chat), `ZERNIO_PROFILES_JSON`
(platform→profile-id map for fb/ig/gmb/pinterest/linkedin/whatsapp/threads),
`ZERNIO_CHANNELS=facebook,instagram,googlebusiness,pinterest,linkedin`.
**Not set yet (blocks the live Zernio API):** `ZERNIO_API_BASE`, `ZERNIO_ENDPOINT`,
and confirm the auth header scheme (Bearer vs `x-api-key`) in `server/services/zernio.ts`.
Build/runtime: `PRERENDER=1` set by `heroku-postbuild`. Scripts load `.env` via
`-r dotenv/config` (server boot does NOT auto-load dotenv; run scripts with that flag).

## 6. Current branch / state
- Branch: **`main`**. Synced: **local = GitHub `origin` = Heroku** at commit
  **`b2f5538`** (the previous, shorter HANDOFF.md; THIS commit replaces it).
- Two git remotes: `origin` = `https://github.com/siparrott/workingnewage` (public),
  `heroku` = `https://git.heroku.com/workingnewage.git`. **Push to BOTH** on every deploy.
- There IS unrelated uncommitted work in the tree — DO NOT touch/commit it (see §13):
  `server/services/*Calendar*`, `server/routes/scheduler.ts`, `server/services/syncScheduler.ts`,
  `client/src/pages/admin/AdminDashboardPage.tsx`, `client/src/components/admin/GCalStatusBanner.tsx`,
  `link-graph*.html`, `scripts/gen-link-graph.mjs`, deleted `dist/*`.

## 7. Recently completed work (this session, newest first — `git log --oneline`)
```
b2f5538 docs: add HANDOFF.md (being replaced by this)
eb96f9a feat(social): live Zernio path — profile map, admin trigger, publish-cron wiring
48d0b8e feat(social): v2 idea stubs + Zernio social distribution (CSV + API scaffold)
67dfb53 feat(blog): multi-image media step + v2 content plan + video/Zernio plan
f148a77 content(blog): upgrade 4 live family guides to the new writing standard
731aee4 feat(blog writer): bake expert SEO/E-E-A-T lessons into the idea-mode writer
f7a16bd fix(page): restore /baby-fotografie-wien/ — import missing Users & Camera icons
7486269 fix(seo): create missing service-page hero/OG/logo images (were broken)
961bd95 feat(image-seo): static-asset pass (photo-grid + gallery alt)
0906dcd fix(blog editor): caret-jump on typing + wire "suggest tags from content"
d76663b feat(image-seo): format-aware IPTC/XMP + text geo; tag-images audit/batch
d4f1d2f / b2d7731  idea-mode: remove image + editor enters idea mode for IDEA posts
3b1bdf0 P6 image SEO (photos in body + image sitemap)
5f1551e P5 GDPR consent gate + public-API lockdown
219f1fb P4 idea-mode editor UI
c175d8e P2b+P3 idea endpoints + context-first writer
0d51dc4 P2a image analysis service
d5a08d8 P1 idea_data schema + archive 36 + seed fresh idea plan
8900b52 / adb8248  dynamic sitemap + prerender (+ ordering fix)
9b8def2  added Sep–May articles + scheduled all 36
```
Functional summary of what's DONE and LIVE: idea-mode pipeline (P1–P6); GDPR consent
gate; public `/api/blog/posts` locked to published-only for anonymous; dynamic sitemap
(+image namespace) and prerender; IPTC/geo image tagging (8 B2 covers + photo-grid);
created the previously-broken `/images/*-hero.jpg`/`og-default.jpg`/`logo.png`; editor
caret-jump fix; tag suggestions; multi-image Media step; 4 live family guides upgraded
to the writing standard; writing standard baked into the writer; Zernio CSV export +
admin "Send to Zernio" button + publish-cron hook (env-gated).

## 8. Current unfinished task (where to resume)
**Zernio live API + video reels.** The CSV path works now (`content/zernio-bulk-import.csv`).
The live API connector (`server/services/zernio.ts` `schedulePosts`) is built but
**guarded** — it returns an error until `ZERNIO_API_BASE` + `ZERNIO_ENDPOINT` are set and
the auth header is confirmed. The user is sending a **handoff doc** for their PixelSeal /
"Social Studio" video workflow (generates reels from posts). Next: wire reel video URLs
(host on B2 `videos/`) into the Zernio row's `media_urls`, and build a reel-storyboard
generator (Phase 2 in `content/VIDEO-SOCIAL-DISTRIBUTION-PLAN.md`).

## 9. Known bugs / caveats
- **Pre-existing TS errors** in `client/src/components/admin/AdvancedBlogPostForm.tsx`:
  `created_at`/`updated_at` (~L191) and `publishedAt` (~L413) "does not exist on type".
  These are NOT from this session and do NOT break the Vite build (esbuild skips
  typecheck). Leave them or fix the `BlogPost` interface — your call, low priority.
- `document.execCommand` deprecation warnings in `AdvancedRichTextEditor.tsx` — harmless.
- Idea-mode: the full browser upload→analyze→generate loop is **built and the service
  loop validated with real OpenAI + ExifTool**, but it hasn't been exercised end-to-end
  through the actual browser/HTTP path. Worth one manual test.
- WebP cannot hold EXIF GPS via exiftool → geo is written as **text** (City/Sublocation/
  Country) for WebP; EXIF GPS only lands in JPEGs. This is intentional, not a bug.
- The blog covers on B2 are WebP bytes named `.jpg` — `writeIptc` sniffs the real format.

## 10. Files recently edited (the map of what matters)
Server: `server/routes.ts` (idea endpoints + `POST /api/blog/posts/:id/social` + the
public-GET lockdown + blog PUT/POST consent gate), `server/jobs/index.ts` (auto-publish
cron + Zernio hook), `server/vite.ts` (dynamic sitemap), `server/services/{blogImageAnalysis,
blogIdeaWriter,blogConsent,b2Upload,socialSnippets,zernio}.ts`, `shared/schema.ts`.
Client: `client/src/components/admin/{AdvancedBlogPostForm,AdvancedRichTextEditor,
IdeaModePanel}.tsx`, `client/src/pages/admin/{AdminBlogPostsPage,AdminBlogEditPage}.tsx`,
`client/src/pages/BlogPostPage.tsx`, `client/src/pages/GalleryPage.tsx`,
`client/src/pages/fotoshootings/BabyFotografieWienPage.tsx`.
Config: `vite.config.ts` (prerender routes), `package.json` (heroku-postbuild,
prerender:routes, deps exifr/exiftool-vendored), `.gitignore`.
Root scripts (run with `npx tsx -r dotenv/config <f>.ts`): `publish-article.ts`,
`schedule-all.ts`, `setup-idea-mode.ts`, `setup-v2-ideas.ts`, `tag-images.ts`,
`tag-static.ts`, `make-heroes.ts`, `make-zernio-csv.ts`, `export-articles.ts`,
`gen-prerender-routes.mjs` (in `scripts/`).
Docs (in `content/`): `HANDOFF.md` (this), `WRITING-GUIDELINES.md`,
`CONTENT-PLAN-2026-2027.md`, `CONTENT-PLAN-V2-headings.md`,
`VIDEO-SOCIAL-DISTRIBUTION-PLAN.md`, `blog-articles-export.md`.

## 11. Exact next steps (in order)
1. **User rotates `ZERNIO_API_KEY`** in Zernio → update `.env`.
2. **Get the Zernio API spec** (base URL, endpoint path, auth header). Set `ZERNIO_API_BASE`
   + `ZERNIO_ENDPOINT` in `.env`; in `server/services/zernio.ts` `schedulePosts`, confirm
   the `Authorization` header (currently `Bearer ${KEY}` — may need `x-api-key`). No other
   code change needed; the admin button + publish-cron then go live.
3. **Test:** open a PUBLISHED post in `/admin/blog` → Media step → "An Zernio senden".
   Without the endpoint it returns the built pack (preview); with it, it posts.
4. **Video reels (PixelSeal handoff):** add a B2 `videos/` upload helper (mirror
   `b2Upload.ts`), pass the reel URL into `media_urls` in `zernio.ts buildZernioRow`,
   and build a reel-storyboard generator per the video plan doc.
5. **Content:** user adds photos to the 63 IDEA stubs in `/admin/blog` (filter "Idee")
   → "Entwurf erzeugen" → review → schedule. New articles should follow
   `content/WRITING-GUIDELINES.md`.
6. **(optional)** Make the static `client/public/sitemap.xml` blog entries dynamic-only
   to avoid drift; extend the writing standard to the pre-existing (not-ours) posts.

## 12. Commands to run
```bash
# deploy (ALWAYS both remotes):
git push origin main && git push heroku main

# publish/update one article from content/articles/<slug>.{html,json}:
npx tsx -r dotenv/config publish-article.ts <slug>

# image SEO audit / tagging (dry-run first, then --execute):
npx tsx -r dotenv/config tag-images.ts
npx tsx -r dotenv/config tag-images.ts --execute

# regenerate the Zernio bulk-import CSV (content/zernio-bulk-import.csv):
npx tsx -r dotenv/config make-zernio-csv.ts

# seed the v2 idea stubs (idempotent):
npx tsx -r dotenv/config setup-v2-ideas.ts

# typecheck (note: pre-existing errors exist; filter for your files):
npx tsc --noEmit -p tsconfig.json 2>&1 | grep <YourFile>

# run locally (dev):  npm run dev      (server on :3001, vite on :5173 with /api proxy)
```
NOTE: this is Windows; the agent uses a bash tool. `*.md`/`*.csv`/`.env`/`dist/` are
gitignored → use `git add -f` to commit a doc.

## 13. Things NOT to change
- **Studio positioning (HARD RULE):** family / baby / newborn / maternity / kids photos
  are **ALWAYS in the studio**. Only weddings, business/corporate, and events are
  on-location. NEVER write content recommending outdoor family shoots. Studio = Wehrgasse,
  Ecke Schönbrunner Straße, 1050 Wien-Margareten, near Naschmarkt, U4 Kettenbrückengasse.
  E-E-A-T proof: 13+ years, 300+ shootings, 4,8 ★ (real Google reviews).
- **Do NOT commit `.env` or any secret.** `ZERNIO_API_KEY` and profile IDs live in `.env` only.
- **Do NOT make `vite.config.ts` async** — `server/vite.ts setupVite` spreads the default
  export; an async config (function) breaks dev. Prerender routes are read SYNC from
  `prerender-blog-routes.json`.
- In `server/vite.ts`, the dynamic `/sitemap.xml` route MUST stay registered **before**
  `express.static(distPath)` or the static file shadows it.
- **Do NOT touch the unrelated uncommitted files** (GCal sync, AdminDashboardPage,
  GCalStatusBanner, link-graph*, dist/*) — different feature, not ours.
- Don't "fix" the WebP-as-.jpg covers by converting — `writeIptc` handles format sniffing.
- Don't re-add Supabase — the app is Neon-only; use Backblaze B2 for all media.

## 14. Deployment details
- **Every deploy:** `git push origin main && git push heroku main`. GitHub→Heroku
  auto-deploy is ALSO enabled (you'll see a "built twice" warning if you push both —
  harmless). Keep GitHub in sync or a later GitHub deploy can revert Heroku.
- **Heroku build:** `heroku-postbuild` = `npm run prerender:routes && cross-env
  PRERENDER=1 npm run build`. `prerender:routes` runs `scripts/gen-prerender-routes.mjs`
  (queries Neon for published slugs → writes `prerender-blog-routes.json`, gitignored).
  `vite build` then prerenders every route in `vite.config.ts publicRoutes` with Puppeteer
  (Chrome from the chrome-for-testing buildpack). A blank/CSS-only build of a route ⇒ that
  page's component threw during render (see `f7a16bd` for an example fix).
- **Git auth gotcha:** terminal pushes use Git Credential Manager, NOT the VS Code GitHub
  login. If a push 403s `denied to AxixOS`, run
  `printf "protocol=https\nhost=github.com\n\n" | git credential reject` then push (re-auths
  as `siparrott`). Memory note: `github-origin-no-access`.
- **DB migrations** are applied by the setup scripts (raw `ALTER TABLE ... IF NOT EXISTS`)
  against the live Neon DB AND mirrored in `shared/schema.ts`. There's no separate migration
  runner in the deploy.
- Verify after deploy: `curl -s -o /dev/null -w "%{http_code}" https://www.newagefotografie.com/`
  and `curl -s https://www.newagefotografie.com/sitemap.xml | grep -c "<image:image>"`.

## Memory files (auto-loaded each session, under the project memory dir)
`business-model-studio-based`, `heroku-github-deploy-divergence`, `github-origin-no-access`,
`zernio-social-distribution`. User: mattpantling@yahoo.co.uk; git user `JpegWriter` pushing
as `siparrott`. Today's date in-session was 2026-06-02/03.
