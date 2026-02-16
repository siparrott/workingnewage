import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import prerender from "@prerenderer/rollup-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Public routes to prerender for SEO
const publicRoutes = [
  '/',
  '/fotoshootings',
  '/kontakt',
  '/blog',
  '/warteliste',
  '/vouchers',
  '/gutscheine',
  
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
const isHeroku = process.env.DYNO !== undefined || process.env.CI === 'true';

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