# TogNinja — production container image.
# One long-running Express service that serves the API AND the built React app
# (server/vite.ts serveStatic reads /app/dist; it activates only when NODE_ENV=production
# and PORT are set — both guaranteed below / by the host).
#
# v1 keeps it simple and reliable:
#   - full node:20-bookworm base (build tools + perl present) to avoid native-module surprises
#   - Puppeteer Chromium download skipped (prerender/lighthouse are off in v1)
#   - single stage; optimize to multi-stage + slim later (see MASTER_EXECUTION_PLAN.md)
FROM node:20-bookworm

# Prerender/Chromium off in v1 → don't download ~150MB Chromium during install.
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false

WORKDIR /app

# Install ALL deps: build needs vite; runtime needs tsx; bootstrap needs drizzle-kit (a devDep).
COPY package.json package-lock.json ./
RUN npm ci --include=dev --no-audit --no-fund

# App source (respects .dockerignore — node_modules, .git, dist, .env* are excluded).
COPY . .

# Build the client bundle to /app/dist. PRERENDER is unset → no Chrome needed.
RUN npm run build

# Runtime: production mode. Host (Render/Heroku) injects PORT; default 3001 for local runs.
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# `npm start` = cross-env NODE_ENV=production tsx server/index.ts
CMD ["npm", "start"]
