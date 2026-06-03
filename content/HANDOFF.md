# Handoff — New Age Fotografie blog / SEO / social system

Working dir: `c:\Users\naf-d\Desktop\togninjalatest\workingnewage`. Stack: React/Vite
SPA + Express (tsx) + Neon Postgres (Drizzle) + Backblaze B2 (S3) for media. Live
site: **https://www.newagefotografie.com** (Heroku). Admin CRM: "TogNinja" at
`/admin`. All work below is committed; **local = GitHub `origin` = Heroku = `eb96f9a`**.

---

## 1. Deploy & git — READ FIRST (real gotchas)
- Two remotes: **`origin`** = GitHub `siparrott/workingnewage` (public), **`heroku`**.
  GitHub→Heroku auto-deploy IS on, and a direct `git push heroku main` also deploys.
  We push to **both** every time: `git push origin main && git push heroku main`.
- Heroku build runs `heroku-postbuild` → `gen-prerender-routes.mjs` then `PRERENDER=1 vite build` (Puppeteer prerenders the routes in `vite.config.ts` `publicRoutes`).
- **Terminal git auth uses Git Credential Manager, NOT VS Code.** If a push 403s as
  `AxixOS`, run `printf "protocol=https\nhost=github.com\n\n" | git credential reject`
  then push again (re-auths as `siparrott`). See memory `github-origin-no-access`.
- `*.md` and `*.csv` are **gitignored** — use `git add -f` for docs you must commit
  (this file included). `dist/`, `.env`, `prerender-blog-routes.json` are ignored.
- Repo has unrelated uncommitted work (GCal sync, `AdminDashboardPage`, `link-graph*`,
  `dist/*`) — **leave it alone**, it's not ours.

## 2. Secrets / config (`.env`, gitignored — never commit)
- `DATABASE_URL` (Neon), `OPENAI_API_KEY` (used: gpt-4o vision/writer, gpt-4o-mini social), `AWS_*` (Backblaze B2), `ADMIN_TOKEN`.
- `ZERNIO_API_KEY` (social distribution; **user said rotate it — it was shared in chat**).
- `ZERNIO_PROFILES_JSON` = platform→profile-id map (fb/ig/gmb/pinterest/linkedin/whatsapp/threads).
- `ZERNIO_CHANNELS` = `facebook,instagram,googlebusiness,pinterest,linkedin`.
- **Not yet set (blocks live API):** `ZERNIO_API_BASE`, `ZERNIO_ENDPOINT` (+ confirm auth header Bearer vs x-api-key).

## 3. Studio positioning (HARD RULE — see memory `business-model-studio-based`)
Family / baby / newborn / maternity / kids = **always in the studio** (Wehrgasse,
1050 Wien-Margareten, near Naschmarkt). Only **weddings + business/corporate +
events** are on-location. Never recommend outdoor family locations. E-E-A-T proof
woven into content: 13+ years, 300+ shootings, 4,8 ★.

## 4. Blog content pipeline
- **Source of truth:** `content/articles/<slug>.{md,html,json}`. `.md` = human source,
  `.html` = what publishes, `.json` = meta `{title,excerpt,seoTitle,metaDescription,tags,status?,publishAt?}`.
- **Publish:** `npx tsx -r dotenv/config publish-article.ts <slug>` → upserts to Neon.
  JSON `status:"DRAFT"` → draft; `publishAt:"YYYY-MM-DD"` (future) → SCHEDULED; else PUBLISHED.
- **Blog renders from the DB** (client-side `/blog/:slug`), not from the .md files.
- Status model: `IDEA | DRAFT | SCHEDULED | PUBLISHED | ARCHIVED`.
  Current DB: **ARCHIVED 36** (old AI v1, slugs suffixed `--ai-v1`), **IDEA 63**
  (36 plan-v1 stubs + 27 plan-v2 stubs, blank bodies), **PUBLISHED 8**, **SCHEDULED 3**.
- Auto-publish: hourly cron in `server/jobs/index.ts` flips SCHEDULED→PUBLISHED at
  `scheduledFor` (consent-gated; also pushes to Zernio if configured).

## 5. Idea-mode (photo-first article pipeline) — the core feature
Flow: **IDEA → upload ≤5 photos → analyse → add context + consent → Generate → DRAFT
→ approve/schedule → PUBLISHED**. In the editor, an IDEA post shows `IdeaModePanel`
instead of the text editor.
- Schema: `blog_posts.idea_data` jsonb = `{ images:[{url,key,exif,vision,altText,iptcWritten}], context:{location,timing,people,celebration,commentary}, consent:{given} }`.
- Endpoints (in `server/routes.ts`, `authenticateUser`): `POST/DELETE /api/blog/idea/:id/images`, `PUT .../context`, `POST .../analyze`, `POST .../generate`.
- Services: `server/services/blogImageAnalysis.ts` (EXIF via `exifr`; Vision gpt-4o;
  **format-aware** IPTC/XMP via `exiftool-vendored` — JPEG gets IPTC, WebP/PNG get XMP;
  geo as text City/Sublocation/Country + EXIF GPS for JPEG; `STUDIO_GPS`), and
  `server/services/blogIdeaWriter.ts` (context-first writer + `injectImages`).
- **Consent gate (GDPR):** photo-derived posts can't publish/schedule without
  `consent.given` — enforced on PUT/POST/cron (`server/services/blogConsent.ts`).
- UI: `client/src/components/admin/IdeaModePanel.tsx`, wired in `AdvancedBlogPostForm.tsx`.

## 6. Writing standard (apply to ALL posts)
`content/WRITING-GUIDELINES.md` — baked into `blogIdeaWriter.ts` system prompt:
lead with observed experience, take a position, ONE first-person founder note,
search-focused H2s (keyword+city), comparison table when there's a decision,
keyword-capture + redirect, strong local entities (Naschmarkt), emotional close,
multi-variant SEO title. Plus emotional/story/controversy/nostalgia hooks.
The 4 live family guides were upgraded to this standard (`f148a77`).

## 7. Image SEO (done)
- `tag-images.ts` (dry-run/`--execute`): Vision + IPTC/geo on B2 blog/gallery covers
  (8 tagged). `tag-static.ts`: photo-grid. `make-heroes.ts`: created the missing
  `/images/*-hero.jpg` + `og-default.jpg` + `logo.png` (were broken → returned HTML).
- **Dynamic sitemap** (`server/vite.ts` `registerDynamicSitemap`): injects published
  posts + `<image:image>` at request time (MUST be registered before `express.static`).
- **Dynamic prerender**: `scripts/gen-prerender-routes.mjs` writes published slugs →
  `vite.config.ts` reads them (sync — don't make the config async, dev spreads it).

## 8. Content plans
- `content/CONTENT-PLAN-2026-2027.md` (v1, 36 articles) — these are the 36 IDEA stubs.
- `content/CONTENT-PLAN-V2-headings.md` (v2, 27 long-tail/new-angle headings) — seeded
  as IDEA stubs via `setup-v2-ideas.ts`.
- `content/blog-articles-export.md` — combined export of all authored .md (regen: `export-articles.ts`).

## 9. Zernio social distribution (`content/VIDEO-SOCIAL-DISTRIBUTION-PLAN.md`)
Blog post → social posts on FB/IG/GMB/Pinterest/LinkedIn, link-back + UTM. **CSV first,
then API.** Memory: `zernio-social-distribution`.
- `server/services/socialSnippets.ts` — per-channel captions (gpt-4o-mini) + `withUtm`.
- `make-zernio-csv.ts` → `content/zernio-bulk-import.csv` (exact Zernio columns, 8
  published posts × 5 channels, drafts, profile ids filled). **CSV import works NOW.**
- `server/services/zernio.ts` — `buildZernioRow`, `profilesFor`, `schedulePosts`
  (env-gated; lights up when `ZERNIO_API_BASE`+`ZERNIO_ENDPOINT` set).
- Admin trigger: `POST /api/blog/posts/:id/social` + "An Zernio senden" button in the
  editor Media step. Publish-cron pushes too (guarded).
- **Media URLs:** use Backblaze B2 for images AND video (a `videos/` prefix) — **no
  Supabase needed** (Supabase was removed; app is Neon-only).

## 10. Editor fixes (all live)
- Caret-jump fixed (`AdvancedRichTextEditor.tsx` — `lastEmittedRef`/`emit()` pattern).
- Tag suggestions + "Tags aus Inhalt vorschlagen" (Supabase mock was returning `[]`).
- Multi-image Media step (cover + imageUrl2/3).
- `AdminBlogEditPage` now respects real status (IDEA) + hydrates idea_data/extra images.
- Known **pre-existing** TS errors in `AdvancedBlogPostForm.tsx` (`created_at`/`updated_at`/`publishedAt`) — NOT ours, vite build ignores them.

## 11. Outstanding / next steps
1. **Rotate `ZERNIO_API_KEY`** (shared in chat) + set it in `.env`.
2. **Zernio API:** get base URL + endpoint path + auth header → set `ZERNIO_API_BASE`/
   `ZERNIO_ENDPOINT` → the admin button + cron go live (no code change).
3. **Set Zernio profile IDs** are already in `.env`; CSV is ready to import.
4. **Video reels:** the user has a PixelSeal/Social-Studio video workflow + a handoff
   doc coming. Plan: render there, host on B2 `videos/`, pass URL into the Zernio row.
   Reel storyboard generator = Phase 2 in the video plan.
5. **Idea-mode runtime test:** the full upload→analyze→generate loop is built + the
   *service* loop validated, but exercise it once via a real browser upload.
6. **Photos for the 63 IDEA stubs** (user adds) → Generate → schedule.
7. Optional: extend pre-existing (not-ours) posts to the writing standard; dynamic
   image sitemap already covers them once published.

## 12. Memory files (auto-loaded each session)
`business-model-studio-based`, `heroku-github-deploy-divergence`, `github-origin-no-access`,
`zernio-social-distribution`. User email mattpantling@yahoo.co.uk; git user JpegWriter
pushing as siparrott.

## Quick commands
```
npx tsx -r dotenv/config publish-article.ts <slug>      # publish/update one article
npx tsx -r dotenv/config tag-images.ts [--execute]       # audit/tag B2 images
npx tsx -r dotenv/config make-zernio-csv.ts              # regenerate the Zernio CSV
npx tsx -r dotenv/config setup-v2-ideas.ts               # (idempotent) seed v2 idea stubs
git push origin main && git push heroku main             # deploy (both remotes)
```
