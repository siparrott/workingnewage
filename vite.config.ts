import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import prerender from "@prerenderer/rollup-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve the Chrome binary used by the prerenderer.
// The chrome-for-testing buildpack installs Chrome under
// `<dir>/.chrome-for-testing/chrome-linux64/chrome`. During the Heroku *build*
// that dir is the build workdir (process.cwd(), e.g. /tmp/build_xxxx) — NOT
// /app, which only exists at runtime. So we check the build workdir first, then
// /app, then an explicit env var, then PATH. Every candidate is existence-checked
// so a stale path (e.g. an /app config var at build time) is skipped. On
// Windows/local none match → undefined → Puppeteer uses its bundled Chromium.
function resolveChromePath(): string | undefined {
  const rel = ".chrome-for-testing/chrome-linux64/chrome";
  const candidates = [
    `${process.cwd()}/${rel}`,
    `/app/${rel}`,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.GOOGLE_CHROME_BIN,
  ].filter(Boolean) as string[];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  if (process.platform !== "win32") {
    try {
      const found = execSync("command -v chrome", { encoding: "utf8" }).trim();
      if (found && existsSync(found)) return found;
    } catch {
      // chrome not on PATH (e.g. local non-Heroku build) — fall through
    }
  }
  return undefined;
}

// Public routes to prerender for SEO
const publicRoutes = [
  '/',
  '/portfolio',
  '/fotoshootings',
  '/kontakt',
  '/blog',
  '/warteliste',
  '/vouchers',

  // SEO Cornerstone Pages
  '/familienfotos-wien/',
  '/neugeborenenfotos-wien/',
  '/babyfotos-wien/',
  '/schwangerschaftsfotos-wien/',
  '/business-portrait-wien/',
  '/teamfotos-wien/',
  '/bewerbungsfotos-wien/',
  '/eventfotografie-wien/',
  '/hochzeitsfotografie-wien/',
  '/produkt-fotografie-wien/',
  '/immobilien-fotografie-wien/',
  '/studio-fotografie-wien/',
  '/familien-fotoshooting-wien/',
  '/baby-fotografie-wien/',
  
  // SEO Pillar Pages
  '/kinder-fotografie-wien/',
  '/portrait-fotografie-wien/',
  
  // Support Pages
  '/ueber-uns/',
  '/preise/',
  '/fotoshooting-preise-wien/',
  '/faq/',
  '/kundenstimmen/',
  '/impressum/',
  '/agb/',
  '/datenschutz/',
  
  // Fotoshooting Types
  '/fotoshootings/business',
  '/fotoshootings/event',
  '/fotoshootings/wedding',
  
  // Gutschein Pages
  '/gutschein',
  '/gutschein/family',
  '/gutschein/newborn',
  '/gutschein/maternity',

  // Blog posts — prerendered so crawlers get static HTML, not JS-only pages.
  // Keep in sync with published posts (content/articles + Neon blog_posts).
  '/blog/familienfotos-locations-wien',
  '/blog/familienfotos-im-studio-vs-outdoor-in-wien-was-passt-zu-euch',
  '/blog/familienfotos-in-wien-preise-ablauf-perfekte-vorbereitung',
  '/blog/die-besten-outfits-fuer-familienfotos-in-wien',
  '/blog/tipps-fuer-neugeborenenfotos-wien',
  '/blog/schwangerschaftsfotos-in-wien-ideen-kleidung-der-beste-zeitpunkt',
  '/blog/businessportraits-in-wien-preise-kleidung-erfolgstipps-f-r-starke-auftritte',
];

// Prerendering is controlled by a single explicit opt-in: the PRERENDER env var.
// (Set as a Heroku config var AND via heroku-postbuild.) This deliberately does
// NOT key off DYNO/CI/NODE_ENV — those are set in the Heroku *build* env and were
// previously causing prerendering to be skipped in production. Local/dev builds
// omit PRERENDER for speed; production sets it so static HTML is generated.
const shouldPrerender = !!process.env.PRERENDER;

// Published blog-post routes discovered at build time. scripts/gen-prerender-routes.mjs
// queries the live DB (published & publishedAt <= now) and writes them here before
// the build runs, so posts that went live since the last deploy get prerendered too —
// without hand-editing publicRoutes. Read synchronously to keep this config sync
// (setupVite spreads the default export, so it must not be a function/Promise).
function loadDynamicBlogRoutes(): string[] {
  try {
    const p = path.resolve(__dirname, "prerender-blog-routes.json");
    if (existsSync(p)) return JSON.parse(readFileSync(p, "utf8")) as string[];
  } catch {
    // ignore malformed/missing file — fall back to the static list
  }
  return [];
}
const prerenderRoutes = Array.from(new Set([...publicRoutes, ...loadDynamicBlogRoutes()]));

export default defineConfig({
  plugins: [
    react(),
    // Static prerender for SEO — only when PRERENDER is set (Chrome must be available).
    ...(shouldPrerender ? [
      prerender({
        routes: prerenderRoutes,
        renderer: '@prerenderer/renderer-puppeteer',
        rendererOptions: {
          maxConcurrentRoutes: 4,
          renderAfterDocumentEvent: 'prerender-ready',
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          // Heroku: chrome-for-testing buildpack binary; local: undefined (bundled Chromium).
          executablePath: resolveChromePath(),
        },
        postProcess(renderedRoute) {
          // Clean up Vite's preload module scripts for better SEO
          renderedRoute.html = renderedRoute.html
            .replace(/<link[^>]*?rel="modulepreload"[^>]*?>/g, '');
          return renderedRoute;
        },
      }) as any,
    ] : []),
  ],
  define: {
    __BUILD_VERSION__: JSON.stringify('v5-prerender-20260204')
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  base: "/",
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
});