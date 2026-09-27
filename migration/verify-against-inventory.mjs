#!/usr/bin/env node
/**
 * Hold a candidate site to what the legacy site already served.
 *
 *   node migration/verify-against-inventory.mjs https://staging.example.com
 *
 * WHY THIS EXISTS RATHER THAN A LINK CHECKER. The SPA catch-all answers any unmatched
 * path with the homepage at HTTP 200. So every orphaned URL passes a status-code check
 * while actually being a duplicate of the front page — which is both the easiest way to
 * lose a migration and the hardest to notice, because nothing anywhere reports an error.
 *
 * A page therefore passes only if it still looks like ITSELF: same path, a title and h1
 * of its own, and at least 90% of the words it used to carry. The h1 is compared against
 * the homepage's as a catch-all detector — if a Vienna pillar page starts answering with
 * the homepage heading, that is the failure this whole file is built to catch.
 *
 * Exit code is the number of failures, so CI can gate on it.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const target = (process.argv[2] || '').replace(/\/$/, '');
if (!target) {
  console.error('usage: node migration/verify-against-inventory.mjs <origin>');
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const inv = JSON.parse(fs.readFileSync(path.join(here, 'url-inventory.json'), 'utf8'));

const WORD_FLOOR = 0.9;

const txt = (h) => h
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const one = (tag, h) => {
  const m = h.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? txt(m[1]).slice(0, 160) : null;
};

async function grab(p) {
  const r = await fetch(target + p, { redirect: 'follow' });
  const html = await r.text();
  return {
    status: r.status,
    finalPath: new URL(r.url).pathname,
    title: (html.match(/<title>([^<]*)<\/title>/i) || [])[1]?.trim() || null,
    h1: one('h1', html),
    words: txt(html).split(' ').filter(Boolean).length,
  };
}

// The homepage's own h1, so we can recognise a page that has become a copy of it.
const home = await grab('/');
console.log(`target      : ${target}`);
console.log(`homepage h1 : ${home.h1 || '(none)'}`);
console.log(`baseline    : ${inv.urls.length} paths captured ${inv.generatedAt} from ${inv.origin}`);
console.log('');

const must = inv.urls.filter((u) => u.disposition === 'must-survive');
const failures = [];
const queue = [...must];

await Promise.all(Array.from({ length: 5 }, async () => {
  while (queue.length) {
    const want = queue.shift();
    try {
      const got = await grab(want.path);
      const why = [];
      if (got.status !== 200) why.push(`HTTP ${got.status}`);
      if (got.finalPath.replace(/\/$/, '') !== want.path.replace(/\/$/, '')) why.push(`redirected to ${got.finalPath}`);
      if (!got.title) why.push('no <title>');
      if (!got.h1) why.push('no <h1>');
      // The catch-all tell: this page now answers with the homepage's heading.
      if (got.h1 && home.h1 && got.h1 === home.h1 && want.path !== '/') why.push('serving the HOMEPAGE (catch-all)');
      if (want.words > 80 && got.words < want.words * WORD_FLOOR) {
        why.push(`${got.words}w vs ${want.words}w baseline (${Math.round(100 * got.words / want.words)}%)`);
      }
      if (why.length) failures.push({ path: want.path, why });
    } catch (e) {
      failures.push({ path: want.path, why: [String(e.message || e).slice(0, 50)] });
    }
  }
}));

failures.sort((a, b) => a.path.localeCompare(b.path));
for (const f of failures) console.log(`  FAIL  ${f.path}\n        ${f.why.join('; ')}`);

console.log('');
console.log(`checked ${must.length} must-survive pages — ${must.length - failures.length} pass, ${failures.length} fail`);
process.exit(failures.length);
