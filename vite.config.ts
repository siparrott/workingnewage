import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import prerender from "@prerenderer/rollup-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve the Chrome binary used by the prerenderer.
// On Heroku the chrome-for-testing buildpack puts `chrome` on PATH and installs
// it at /app/.chrome-for-testing/chrome-linux64/chrome. We prefer an explicit
// env var, then fall back to resolving `chrome` from PATH. On Windows/local this
// returns undefined so Puppeteer uses its own bundled Chromium.
function resolveChromePath(): string | undefined {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  if (process.env.GOOGLE_CHROME_BIN) return process.env.GOOGLE_CHROME_BIN;
  if (process.platform !== "win32") {
    try {
      const found = execSync("command -v chrome", { encoding: "utf8" }).trim();
      if (found) return found;
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
];

// FORCE CLEAN BUILD v5 - SEO Prerendering - 20260204
// Detect if running on Heroku (DYNO env var) or in CI to skip prerendering
// Also check for NODE_ENV=production and absence of local dev indicators
const isHeroku = process.env.DYNO !== undefined || 
                 process.env.CI === 'true' || 
                 process.env.HEROKU === 'true' ||
                 (process.env.NODE_ENV === 'production' && !process.env.PRERENDER);

export default defineConfig({
  plugins: [
    react(),
    // Skip prerendering on Heroku to avoid Puppeteer/Chrome dependency issues
    ...(!isHeroku ? [
      prerender({
        routes: publicRoutes,
        renderer: '@prerenderer/renderer-puppeteer',
        rendererOptions: {
          maxConcurrentRoutes: 4,
          renderAfterTime: 500,
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