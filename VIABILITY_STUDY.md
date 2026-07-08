# TogNinja Productization — Viability Study

*The reasoning and decisions behind turning a single-business app into a self-hosted, per-customer product. Companion to [BUILD_KICKOFF.md](BUILD_KICKOFF.md), [MASTER_EXECUTION_PLAN.md](MASTER_EXECUTION_PLAN.md), [ONBOARDING_SPEC.md](ONBOARDING_SPEC.md), [INFINITE_AUTHORITY_HANDOFF.md](INFINITE_AUTHORITY_HANDOFF.md). Findings are grounded in the codebase.*

## Executive summary
The app is, in practice, **single-tenant per deployment**. Rather than a risky multi-tenant refactor, the product is **one self-hosted deployment per customer**, sold as a **lifetime deal**, with recurring revenue and anti-piracy carried by **gated API services** (AI agent, Infinite Authority, ShootCleaner, PixelSeal), not by hosting. Two separable goals: (1) an **isolated demo/sample instance now** (days, zero risk to prod); (2) **productization** (phased, weeks). The current production business is a **frozen reference** — nothing in this programme touches it.

## Grounded findings
- **Architecture:** single Express service serves API + built React; hourly in-process cron ⇒ needs a persistent process (not serverless). Runtime confirmed via `Procfile`/`start`.
- **Tenancy:** multi-tenant *scaffolding* exists (`studio_configs`, `studios`, `studio_integrations`) but content tables (`blog_posts`, `landing_pages`, CRM, vouchers, galleries) are **not** tenant-scoped; `/api/studio-config` falls back to a hardcoded studioId. ⇒ effectively single-tenant per deployment.
- **Assets already present (big):** a technical + creative **setup wizard** (domain/mail/Stripe/storage/AI/SMS/admin) with per-integration **test buttons**; **`config-reader` reads DB-first**, so most per-tenant secrets are captured in UI and stored **encrypted in the DB**, not hand-edited env; Drizzle `db:push` builds the full schema; `DEMO_MODE` suppresses real emails/charges; deploy configs (`app.json` Heroku, `render.yaml` Render); demo seed scripts.
- **Liabilities:** **~150 hardcoded "leak points" across ~60 files** (domain/SEO/JSON-LD/branding/German-Wien pages, studioId); **no licensing/anti-piracy mechanism of any kind**; no Dockerfile; provisioning is fragmented across ad-hoc scripts.

## Strategic fork
| | Multi-tenant (one backend, many) | **Per-deployment (one each) ✅** |
|---|---|---|
| Data isolation | Add tenant scoping to every table, subdomain routing, hardening | Free (separate DB + app) |
| Risk to hardened prod | High | Zero |
| Effort | Months | Weeks |
| Fits self-hosted LTD | No | Yes — same shape |

## Viability verdicts
- **Demo/sample instance now:** highly viable, low risk, days. New DB + new deploy + `DEMO_MODE` + seed + a scoped IA key; provably isolated from prod. Caveat: still branded "New Age" until P1.
- **Productization:** viable, phased. Work = de-hardcode (P1) → provisioner + onboarding UI (P2) → gated-services/entitlement layer → beta. The setup-wizard + config-reader + deploy configs mean much of the hard part already exists.

## Business model
- **Break the subscription on the app** (LTD) but keep **recurring revenue on the connected services** where real marginal cost lives (LLM tokens, social/asset APIs): **AI agent, IA, ShootCleaner, PixelSeal, Pulse** — each behind a **revocable scoped key**.
- **Anti-piracy, honestly:** a self-hosted *core* can't be fully DRM'd. The durable lock is **service value + key revocation + private-repo/image delivery + licence**, not code obfuscation. Copying the shell is useless without keys you issue and can revoke.
- **Care packets (paid):** managed onboarding (you wire their Stripe/S3/mail/DNS), priority support, done-for-you content sprints, paid major-version upgrades.

## Locked decisions
1. **Self-hosted, per-deployment** (no multi-tenant refactor).
2. **Lifetime deal** on the app; recurring via gated services.
3. **Private repo; ship a container image** (not source) so customers self-host on their own Render without seeing code.
4. **Provision via the Render API** into the customer's account.
5. **Gated behind revocable keys:** AI agent, IA, ShootCleaner, PixelSeal.
6. **Production is frozen** — a read-only reference.

## Risks & mitigations
| Risk | Mitigation |
|---|---|
| Contaminating prod | Separate repo/DB/bucket/keys; prod read-only reference; test on tenant-zero |
| De-hardcode regressions | Iterate on tenant-zero, never prod |
| SEO leakage (sitemap/schema → your domain) | P1 parameterization + IA generates tenant content |
| LTD support burden | Tiered care packets; self-serve docs; margin lives in the services |
| Piracy | Image delivery + revocable service keys + licence; DB-access verification |
| Per-tenant secret sprawl | Wizard captures + encrypts in DB; only ~4 boot secrets are env |
| IA/service uptime | Gated services are premium features that degrade gracefully, not a hard site dependency |

## Open decisions (tracked in the execution plan)
- PixelSeal scope (what it gates) · which services are mandatory vs upsell · DB-access model (read-only + consent + audit) · Render deploy-auth flow (token paste vs OAuth) · shared vs own AI keys.
