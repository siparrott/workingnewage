import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
// viteConfig imported dynamically in setupVite to avoid production issues
import { nanoid } from "nanoid";
import { renderIndexHtml, getSiteIdentity } from "./lib/siteIdentity.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

const SITE_ORIGIN = "https://www.newagefotografie.com";

// Serve /sitemap.xml dynamically: take the curated static sitemap as the base
// and inject a <url> for every PUBLISHED blog post (publishedAt <= now). This
// means scheduled posts appear in the sitemap automatically the moment they go
// live — no rebuild or manual edit needed. Falls back to the static file on any
// error so the route can never 500 the crawler.
function registerDynamicSitemap(app: Express, baseFilePath: string) {
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const rawBase = fs.existsSync(baseFilePath)
        ? fs.readFileSync(baseFilePath, "utf8")
        : '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>';
      // Re-brandable/re-hostable: rewrite the curated sitemap's hardcoded origin to
      // the configured PUBLIC_SITE_URL so a moved or re-branded instance never emits
      // the wrong host (a mixed-host sitemap gets dropped by Google).
      const base = rawBase.replace(/https?:\/\/(www\.)?newagefotografie\.com/g, SITE_ORIGIN);

      const { storage } = await import("./storage.js");
      const posts = await storage.getBlogPosts(true); // published & publishedAt <= NOW()

      const existing = new Set(
        [...base.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
      );

      const xmlEsc = (s: string) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

      let hasImages = false;
      const blogUrls = posts
        .filter((p: any) => p.slug)
        .map((p: any) => {
          const loc = `${SITE_ORIGIN}/blog/${p.slug}`;
          if (existing.has(loc)) return "";
          const ts = p.updatedAt || p.publishedAt;
          const lastmod = ts ? new Date(ts).toISOString().slice(0, 10) : "";
          // Collect cover + extra images for the image sitemap extension.
          const imgs: string[] = [p.imageUrl, p.imageUrl2, p.imageUrl3].filter(Boolean);
          let imageXml = "";
          for (const u of imgs) {
            hasImages = true;
            imageXml += `    <image:image>\n      <image:loc>${xmlEsc(u)}</image:loc>\n    </image:image>\n`;
          }
          return (
            `  <url>\n    <loc>${loc}</loc>\n` +
            (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : "") +
            `    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n` +
            imageXml +
            `  </url>`
          );
        })
        .filter(Boolean)
        .join("\n");

      let xml = blogUrls
        ? base.replace("</urlset>", `${blogUrls}\n</urlset>`)
        : base;
      // Declare the image-sitemap namespace on <urlset> when we emit image tags.
      if (hasImages && !xml.includes("xmlns:image")) {
        xml = xml.replace(
          /<urlset /,
          '<urlset xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ',
        );
      }
      res.type("application/xml").send(xml);
    } catch (err) {
      console.error("[sitemap] dynamic generation failed, serving static:", err);
      if (fs.existsSync(baseFilePath)) {
        return res.type("application/xml").sendFile(baseFilePath);
      }
      res.status(500).send("sitemap.xml not available");
    }
  });
}

export async function setupVite(app: Express, server: Server) {
  // Dynamically import viteConfig only when needed (development mode)
  const viteConfigModule = await import("../vite.config.js");
  const viteConfig = viteConfigModule.default;

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // Don't crash server on Vite errors - just log them
        // process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Dynamic sitemap must be registered before the Vite static/catch-all
  // middleware so it isn't shadowed by the static public/sitemap.xml.
  registerDynamicSitemap(app, path.resolve(__dirname, "..", "client", "public", "sitemap.xml"));

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    // Skip API routes - let them be handled by the API router
    if (url.startsWith('/api/')) {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// ── Request-time SEO meta for data-driven routes ────────────────────────────
// Blog posts and voucher-detail pages get their <title>/<meta> from API data,
// which does NOT exist during the build-time prerender — puppeteer captured the
// "not found" error state, so crawlers saw default-title error pages. Instead,
// the server (which has the DB) injects the real title/description/canonical
// into the served HTML for these routes and bypasses the bad prerender files.
interface RouteMeta { title: string; description: string; canonical: string }

const routeMetaCache = new Map<string, { meta: RouteMeta | null; at: number }>();
const ROUTE_META_TTL = 5 * 60_000;

// Prerendered HTML with tenant identity stamped in, cached per file path.
const prerenderedCache = new Map<string, string>();

async function lookupRouteMeta(reqPath: string): Promise<RouteMeta | null> {
  const cached = routeMetaCache.get(reqPath);
  if (cached && Date.now() - cached.at < ROUTE_META_TTL) return cached.meta;

  let meta: RouteMeta | null = null;
  try {
    const blogMatch = reqPath.match(/^\/blog\/([^/]+)\/?$/);
    const voucherMatch = reqPath.match(/^\/gutschein\/([^/]+)\/?$/);

    // IMPORTANT: use the same request-time data path the dynamic sitemap uses
    // (./storage.js) — proven to work in production. An earlier version did
    // ad-hoc drizzle imports here and hung in production (30s → Heroku 503).
    if (blogMatch) {
      const slug = decodeURIComponent(blogMatch[1]);
      const { storage } = await import("./storage.js");
      const posts = await storage.getBlogPosts(true);
      const post: any = (posts as any[]).find((p) => p.slug === slug);
      if (post) {
        meta = {
          title: post.seoTitle || `${post.title} | New Age Fotografie Blog`,
          description: String(post.metaDescription || post.excerpt || post.title).slice(0, 160),
          canonical: `${SITE_ORIGIN}/blog/${slug}`,
        };
      }
    } else if (voucherMatch) {
      const slug = decodeURIComponent(voucherMatch[1]);
      // Dedicated components (with their own SEO) exist for these slugs.
      if (!["family", "newborn", "maternity"].includes(slug)) {
        const { storage } = await import("./storage.js");
        const products = await storage.getVoucherProducts();
        const v: any = (products as any[]).find((p) => p.slug === slug);
        if (v) {
          meta = {
            title: v.metaTitle || `${v.name} – Fotoshooting Gutschein Wien | New Age Fotografie`,
            description: String(v.metaDescription || v.description || `${v.name}: Fotoshooting-Gutschein von New Age Fotografie Wien.`).slice(0, 160),
            canonical: `${SITE_ORIGIN}/gutschein/${slug}`,
          };
        }
      }
    } else {
      const lpMatch = reqPath.match(/^\/lp\/([^/]+)\/?$/);
      if (lpMatch) {
        const slug = decodeURIComponent(lpMatch[1]);
        // Same request-time accessor the dynamic sitemap uses for LPs.
        const neonMod: any = await import("../database.js");
        const neonDb = neonMod.default || neonMod;
        const page = typeof neonDb.getLandingPageBySlug === "function"
          ? await neonDb.getLandingPageBySlug(slug)
          : null;
        if (page) {
          meta = {
            title: page.seo_title || page.title || slug,
            description: String(page.meta_description || page.content_json?.hero?.subheadline || page.title || "").slice(0, 160),
            canonical: `${SITE_ORIGIN}/lp/${slug}`,
          };
        }
      }
    }
  } catch (err) {
    console.warn("[route-meta] lookup failed:", (err as any)?.message);
    return null; // don't cache transient DB errors
  }

  routeMetaCache.set(reqPath, { meta, at: Date.now() });
  return meta;
}

const htmlEsc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Remove the prerendered homepage body from the SPA shell so data-driven
// routes don't flash homepage content before React renders the real page.
// Regex can't reliably find the matching close tag of a div full of nested
// divs, so walk the markup counting <div>/</div> depth instead.
function emptyHydrationRoot(html: string): string {
  const openIdx = html.search(/<div id="root"[^>]*>/);
  if (openIdx === -1) return html;
  const contentStart = html.indexOf(">", openIdx) + 1;
  let depth = 1;
  const tag = /<div\b|<\/div>/g;
  tag.lastIndex = contentStart;
  let m: RegExpExecArray | null;
  while ((m = tag.exec(html)) !== null) {
    depth += m[0] === "</div>" ? -1 : 1;
    if (depth === 0) {
      // m.index points at the matching </div> of #root.
      return html.slice(0, contentStart) + html.slice(m.index);
    }
  }
  return html; // unbalanced markup — leave untouched
}

function injectRouteMeta(html: string, meta: RouteMeta): string {
  // dist/index.html is the PRERENDERED HOMEPAGE (the '/' route overwrites it
  // at build time), so:
  //  - tags carry attributes (e.g. <title data-rh="true">) — the regexes must
  //    tolerate them or the injection silently no-ops;
  //  - existing canonical/og tags from the homepage must be REMOVED, or the
  //    page would carry conflicting duplicates;
  //  - the homepage body must be emptied so 40 blog URLs don't serve
  //    identical homepage content to non-JS crawlers (duplicate content).
  let out = html.replace(/<title[^>]*>[^<]*<\/title>/, `<title>${htmlEsc(meta.title)}</title>`);
  out = out.replace(/<meta[^>]*name="description"[^>]*>/g, "");
  out = out.replace(/<link[^>]*rel="canonical"[^>]*>/g, "");
  out = out.replace(/<meta[^>]*property="og:(title|description|url)"[^>]*>/g, "");
  const extra =
    `<meta name="description" content="${htmlEsc(meta.description)}" />\n` +
    `    <link rel="canonical" href="${htmlEsc(meta.canonical)}" />\n` +
    `    <meta property="og:title" content="${htmlEsc(meta.title)}" />\n` +
    `    <meta property="og:description" content="${htmlEsc(meta.description)}" />`;
  return out.replace("</head>", `    ${extra}\n  </head>`);
}

export function serveStatic(app: Express) {
  // In production, dist is at the root level, not relative to server/
  const distPath = path.resolve(process.cwd(), "dist");

  const resolvePrerenderedHtmlPath = (requestPath: string) => {
    const segments = requestPath.split('/').filter(Boolean);
    if (segments.length === 0) return null;

    const prerenderedPath = path.resolve(distPath, ...segments, "index.html");
    if (!prerenderedPath.startsWith(distPath)) return null;
    return fs.existsSync(prerenderedPath) ? prerenderedPath : null;
  };

  if (!fs.existsSync(distPath)) {
    console.error(`❌ ERROR: Could not find the build directory at: ${distPath}`);
    console.error(`Current working directory: ${process.cwd()}`);
    console.error(`__dirname: ${__dirname}`);
    // Don't throw - let the app start and show the error
    console.error("⚠️ Static files will not be served. Build the client first with: npm run build");
    return;
  }

  console.log(`✅ Serving static files from: ${distPath}`);

  // Dynamic sitemap MUST be registered before express.static — otherwise the
  // static dist/sitemap.xml is served first and the dynamic handler never runs.
  registerDynamicSitemap(app, path.resolve(distPath, "sitemap.xml"));

  // Serve static ASSETS from dist. index: false so directory index.html files
  // (the prerendered pages) do NOT get served here — they must flow through
  // the catch-all below, which stamps the tenant identity into them and
  // handles the data-driven blog/voucher routes.
  app.use(express.static(distPath, { index: false }));

  // Explicitly serve robots.txt and sitemap.xml for SEO
  app.get("/robots.txt", (_req, res) => {
    const robotsPath = path.resolve(distPath, "robots.txt");
    if (fs.existsSync(robotsPath)) {
      res.type("text/plain").sendFile(robotsPath);
    } else {
      res.status(404).send("robots.txt not found");
    }
  });

  // Per-tenant index.html: fill %SITE_*% identity placeholders once (env is
  // stable per process). A template with no placeholders passes through
  // unchanged, so this is safe on both index.html variants. Additionally
  // stamp the tenant name over the prerender-baked "My Studio" fallback
  // (dist/index.html is the prerendered homepage, rendered without env).
  let cachedIndex: string | null = null;
  const renderedIndex = (): string => {
    if (cachedIndex === null) {
      const raw = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
      let html = renderIndexHtml(raw);
      try {
        const name = getSiteIdentity().name;
        if (name && name !== "My Studio") html = html.split("My Studio").join(name);
      } catch { /* identity unavailable — serve as-is */ }
      cachedIndex = html;
    }
    return cachedIndex;
  };

  // fall through to index.html if the file doesn't exist
  // BUT exclude /api/* routes - those should return 404 JSON, not HTML
  app.use("*", async (req, res) => {
   try {
    // If it's an API request that wasn't handled, return JSON 404
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found', path: req.originalUrl });
    }

    // IMPORTANT: inside app.use("*") Express strips the matched mount path,
    // so req.path is always "/" here. The real request path must come from
    // req.originalUrl (query string removed). Using req.path silently broke
    // per-route logic in this handler.
    const requestPath = (req.originalUrl || "/").split("?")[0];

    // Data-driven routes (blog posts, voucher details): inject real meta from
    // the DB and serve the shell — NEVER the prerendered files for these
    // paths, which captured the build-time "not found" error state (the
    // prerenderer has no API/DB). Even on a lookup miss the shell is better
    // than a prerendered error page.
    //
    // BULLETPROOF: the lookup races a hard 1.5s timeout and the whole branch
    // is wrapped — under NO circumstances may a meta lookup hang or 500 a
    // public page (a hung lookup previously turned /blog/<missing-slug> into
    // a 30s Heroku H12 → 503).
    if (/^\/(blog|gutschein|lp)\//.test(requestPath)) {
      let meta: RouteMeta | null = null;
      let diag = "miss";
      try {
        meta = await Promise.race([
          lookupRouteMeta(requestPath),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500).unref?.()),
        ]);
        diag = meta ? "hit" : "miss";
      } catch (err) {
        diag = "error";
        console.warn("[route-meta] branch failed:", (err as any)?.message);
      }
      try {
        res.setHeader("X-Route-Meta", diag);
        // ALWAYS empty the hydration root for data-driven routes — the shell
        // is the prerendered HOMEPAGE, and serving its body caused a visible
        // homepage flash before React rendered the actual page (worst on
        // /lp/<slug> "View Live"). Meta is additionally injected on a hit.
        let html = emptyHydrationRoot(renderedIndex());
        if (meta) html = injectRouteMeta(html, meta);
        return res.status(200).type("html").send(html);
      } catch {
        return res.status(200).type("html").send(renderedIndex());
      }
    }

    const prerenderedHtmlPath = resolvePrerenderedHtmlPath(requestPath);
    if (prerenderedHtmlPath) {
      // The prerender browser has no env/window.__SITE_CONFIG__, so pages
      // whose Helmet titles interpolate SITE.name bake the neutral fallback
      // "My Studio" into the static HTML. Stamp the real tenant identity in
      // at serve time (cached per path).
      try {
        let html = prerenderedCache.get(prerenderedHtmlPath);
        if (html === undefined) {
          html = fs.readFileSync(prerenderedHtmlPath, "utf-8");
          // Fill any %SITE_*% placeholders the prerender snapshot carried
          // through (the prerender browser sees the raw template), then stamp
          // the tenant name over the env-less "My Studio" fallback.
          html = renderIndexHtml(html);
          const name = getSiteIdentity().name;
          if (name && name !== "My Studio") {
            html = html.split("My Studio").join(name);
          }
          prerenderedCache.set(prerenderedHtmlPath, html);
        }
        return res.status(200).type("html").send(html);
      } catch {
        return res.sendFile(prerenderedHtmlPath);
      }
    }

    // For all other requests (frontend routes), serve the SPA with identity injected
    res.status(200).type("html").send(renderedIndex());
   } catch (fatal) {
    // Last-resort guard: this handler must NEVER leave a request hanging
    // (an unhandled async throw here previously meant no response at all →
    // 30s Heroku H12 → "Application Error" on public pages).
    console.error("[serveStatic] catch-all failed:", (fatal as any)?.message);
    try {
      res.status(200).type("html").sendFile(path.resolve(distPath, "index.html"));
    } catch {
      res.status(500).send("Server error");
    }
   }
  });
}
