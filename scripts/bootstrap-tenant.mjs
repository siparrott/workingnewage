#!/usr/bin/env node
// One-shot tenant bootstrap — run ONCE against a FRESH database to stand up a new instance.
//
//   node scripts/bootstrap-tenant.mjs           # schema + baseline (admin, studio config, prices, vouchers)
//   node scripts/bootstrap-tenant.mjs --demo    # ...plus demo content (clients, galleries, blog posts)
//
// Requires DATABASE_URL pointed at the target tenant DB. Reuses the existing npm scripts
// (db:push → db:init → demo:setup) so there's a single source of truth for each step.
import { execSync } from 'node:child_process';

const demo = process.argv.includes('--demo');

if (!process.env.DATABASE_URL) {
  console.error('✖ DATABASE_URL is not set. Point it at the fresh tenant database and retry.');
  process.exit(1);
}

const step = (label, cmd) => {
  console.log(`\n▶ ${label}\n  $ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: process.env });
};

try {
  step('1/‎' + (demo ? '3' : '2') + '  Create schema (drizzle push)', 'npm run db:push');
  step('2/‎' + (demo ? '3' : '2') + '  Seed baseline (admin, studio config, prices, vouchers, coupons)', 'npm run db:init');
  if (demo) step('3/3  Load demo content (clients, sessions, galleries, blog posts)', 'npm run demo:setup');
  console.log(`\n✅ Bootstrap complete${demo ? ' (with demo content)' : ''}.`);
  console.log('   Next: open the instance and finish the setup wizard (domain, mail, Stripe, storage, admin password).');
} catch (e) {
  console.error('\n✖ Bootstrap failed:', e?.message || e);
  console.error('  Check DATABASE_URL and that devDependencies (drizzle-kit) are installed.');
  process.exit(1);
}
