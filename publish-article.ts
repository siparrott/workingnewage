// Reusable blog publisher — bypasses the buggy WYSIWYG editor by writing clean
// HTML straight to the Neon DB. Reads content/articles/<slug>.html (body) and
// content/articles/<slug>.json (metadata), then upserts the post as PUBLISHED.
//
// Usage:  DATABASE_URL=<neon-url> npx tsx publish-article.ts <slug>
import { readFileSync } from 'fs';
import { db, pool } from './server/db.js';
import { blogPosts } from './shared/schema.js';
import { eq } from 'drizzle-orm';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: tsx publish-article.ts <slug>');
  process.exit(1);
}

const html = readFileSync(`content/articles/${slug}.html`, 'utf8');
const meta = JSON.parse(readFileSync(`content/articles/${slug}.json`, 'utf8'));

async function main() {
  const existing = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, slug));

  const fields = {
    title: meta.title,
    slug,
    content: html,
    contentHtml: html,
    excerpt: meta.excerpt ?? null,
    seoTitle: meta.seoTitle ?? null,
    metaDescription: meta.metaDescription ?? null,
    tags: meta.tags ?? null,
    published: true,
    status: 'PUBLISHED',
    publishedAt: new Date(),
    updatedAt: new Date(),
  };

  if (existing.length) {
    const r = await db.update(blogPosts).set(fields).where(eq(blogPosts.slug, slug)).returning({ id: blogPosts.id, slug: blogPosts.slug });
    console.log('✅ Updated existing post:', r);
  } else {
    const r = await db.insert(blogPosts).values(fields).returning({ id: blogPosts.id, slug: blogPosts.slug });
    console.log('✅ Inserted new post:', r);
  }
  await pool.end();
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Publish failed:', e);
  process.exit(1);
});
