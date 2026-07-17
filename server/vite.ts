import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
// viteConfig imported dynamically in setupVite to avoid production issues
import { nanoid } from "nanoid";

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

async function lookupRouteMeta(reqPath: string): Promise<RouteMeta | null> {
  const cached = routeMetaCache.get(reqPath);
  if (cached && Date.now() - cached.at < ROUTE_META_TTL) return cached.meta;

  let meta: RouteMeta | null = null;
  try {
    const blogMatch = reqPath.match(/^\/blog\/([^/]+)\/?$/);
    const voucherMatch = reqPath.match(/^\/gutschein\/([^/]+)\/?$/);

    if (blogMatch) {
      const slug = decodeURIComponent(blogMatch[1]);
      const { db } = await import("./db.js");
      const { blogPosts } = await import("../shared/schema.js");
      const { eq } = await import("drizzle-orm");
      const [post] = await db
        .select({
          title: blogPosts.title,
          seoTitle: blogPosts.seoTitle,
          excerpt: blogPosts.excerpt,
          metaDescription: blogPosts.metaDescription,
          published: blogPosts.published,
        })
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .limit(1);
      if (post && post.published) {
        meta = {
          title: post.seoTitle || `${post.title} | New Age Fotografie Blog`,
          description: (post.metaDescription || post.excerpt || post.title).slice(0, 160),
          canonical: `${SITE_ORIGIN}/blog/${slug}`,
        };
      }
    } else if (voucherMatch) {
      const slug = decodeURIComponent(voucherMatch[1]);
      // Dedicated components (with their own SEO) exist for these slugs.
      if (!["family", "newborn", "maternity"].includes(slug)) {
        const { db } = await import("./db.js");
        const { voucherProducts } = await import("../shared/schema.js");
        const { eq } = await import("drizzle-orm");
        const [v] = await db
          .select({
            name: voucherProducts.name,
            description: voucherProducts.description,
            metaTitle: voucherProducts.metaTitle,
            metaDescription: voucherProducts.metaDescription,
          })
          .from(voucherProducts)
          .where(eq(voucherProducts.slug, slug))
          .limit(1);
        if (v) {
          meta = {
            title: v.metaTitle || `${v.name} – Fotoshooting Gutschein Wien | New Age Fotografie`,
            description: (v.metaDescription || v.description || `${v.name}: Fotoshooting-Gutschein von New Age Fotografie Wien.`).slice(0, 160),
            canonical: `${SITE_ORIGIN}/gutschein/${slug}`,
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

function injectRouteMeta(html: string, meta: RouteMeta): string {
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${htmlEsc(meta.title)}</title>`);
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${htmlEsc(meta.description)}" />`,
  );
  const extra =
    `<link rel="canonical" href="${htmlEsc(meta.canonical)}" />\n` +
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

  // Serve static files from dist
  app.use(express.static(distPath));

  // Explicitly serve robots.txt and sitemap.xml for SEO
  app.get("/robots.txt", (_req, res) => {
    const robotsPath = path.resolve(distPath, "robots.txt");
    if (fs.existsSync(robotsPath)) {
      res.type("text/plain").sendFile(robotsPath);
    } else {
      res.status(404).send("robots.txt not found");
    }
  });

  // fall through to index.html if the file doesn't exist
  // BUT exclude /api/* routes - those should return 404 JSON, not HTML
  app.use("*", async (req, res) => {
    // If it's an API request that wasn't handled, return JSON 404
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found', path: req.originalUrl });
    }

    // Data-driven routes (blog posts, voucher details): inject real meta from
    // the DB and serve the shell — bypassing prerendered files for these paths,
    // which captured the build-time "not found" error state (no API at build).
    if (/^\/(blog|gutschein)\//.test(req.path)) {
      const meta = await lookupRouteMeta(req.path);
      // Diagnostic: shows whether the DB lookup resolved for this path.
      res.setHeader("X-Route-Meta", meta ? "hit" : "miss");
      if (meta) {
        return res.status(200).type("html").send(injectRouteMeta(renderedIndex(), meta));
      }
    }

    const prerenderedHtmlPath = resolvePrerenderedHtmlPath(req.path);
    if (prerenderedHtmlPath) {
      return res.sendFile(prerenderedHtmlPath);
    }

    // For all other requests (frontend routes), serve the SPA
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
