// Zernio API connector (Phase 2 — "thereafter by API"). The initial bulk load
// is via CSV (make-zernio-csv.ts); this is the programmatic path.
//
// CONFIRM FROM HANDOFF DOC before enabling:
//   - ZERNIO_API_BASE (base URL) and the create/bulk-schedule endpoint path
//   - auth header format (Bearer vs x-api-key) — set below to match
//   - exact JSON payload shape (we mirror the CSV field names, which Zernio accepts)
//
// Secret: ZERNIO_API_KEY lives in .env (gitignored) — never commit it.
import { generateSocialPack, withUtm, type SocialPostInput } from './socialSnippets.js';

const BASE = process.env.ZERNIO_API_BASE || 'https://api.zernio.com'; // TODO confirm
const KEY = process.env.ZERNIO_API_KEY || '';
const CHANNELS = (process.env.ZERNIO_CHANNELS || 'facebook,instagram,googlebusiness,pinterest,linkedin');
const ORIGIN = 'https://www.newagefotografie.com';

/** platform -> Zernio profile id, from ZERNIO_PROFILES_JSON in .env. */
export function profileMap(): Record<string, string> {
  try { return JSON.parse(process.env.ZERNIO_PROFILES_JSON || '{}'); } catch { return {}; }
}

/** Comma-separated profile ids for the given platforms list (CSV `profiles` column). */
export function profilesFor(platformsCsv = CHANNELS): string {
  const map = profileMap();
  return platformsCsv.split(',').map(p => map[p.trim()]).filter(Boolean).join(',');
}

export interface ZernioPostRow {
  post_content: string;
  platforms: string;
  profiles: string;
  tz: string;
  media_urls: string;
  is_draft: string;
  use_queue: string;
  title: string;
  hashtags: string;
  visibility: string;
  custom_content_facebook: string;
  custom_content_linkedin: string;
  custom_content_instagram: string;
  custom_content_googlebusiness: string;
  instagram_first_comment: string;
  pinterest_title: string;
  pinterest_link: string;
  googlebusiness_cta_type: string;
  googlebusiness_cta_url: string;
}

/** Build the same field object the CSV uses, for one blog post. */
export async function buildZernioRow(post: {
  slug: string; title: string; excerpt?: string | null; contentHtml?: string | null; content?: string | null;
  imageUrl?: string | null; imageUrl2?: string | null; imageUrl3?: string | null;
}): Promise<ZernioPostRow> {
  const url = `${ORIGIN}/blog/${post.slug}`;
  const input: SocialPostInput = { title: post.title, excerpt: post.excerpt || undefined, body: post.contentHtml || post.content || undefined, url };
  const pack = await generateSocialPack(input);
  return {
    post_content: pack.base,
    platforms: CHANNELS,
    profiles: profilesFor(CHANNELS),
    tz: 'Europe/Vienna',
    media_urls: [post.imageUrl, post.imageUrl2, post.imageUrl3].filter(Boolean).join(','),
    is_draft: 'true',
    use_queue: 'false',
    title: post.title,
    hashtags: pack.hashtags.map(h => `#${h}`).join(','),
    visibility: 'public',
    custom_content_facebook: `${pack.facebook}\n\n${withUtm(url, 'facebook')}`,
    custom_content_linkedin: `${pack.linkedin}\n\n${withUtm(url, 'linkedin')}`,
    custom_content_instagram: pack.instagram,
    custom_content_googlebusiness: pack.googlebusiness,
    instagram_first_comment: `Mehr im Blog: ${withUtm(url, 'instagram')}`,
    pinterest_title: pack.pinterestTitle,
    pinterest_link: withUtm(url, 'pinterest'),
    googlebusiness_cta_type: 'LEARN_MORE',
    googlebusiness_cta_url: withUtm(url, 'googlebusiness'),
  };
}

/**
 * Schedule one or more posts via the Zernio API. ENDPOINT + AUTH are placeholders
 * until the handoff doc confirms them — guarded so it can't fire half-configured.
 */
export async function schedulePosts(rows: ZernioPostRow[]): Promise<{ ok: boolean; status?: number; body?: unknown; error?: string }> {
  if (!KEY) return { ok: false, error: 'ZERNIO_API_KEY not set' };
  if (!process.env.ZERNIO_API_BASE || !process.env.ZERNIO_ENDPOINT) {
    return { ok: false, error: 'Zernio API endpoint not configured yet — confirm base URL + path from the handoff doc (ZERNIO_API_BASE, ZERNIO_ENDPOINT).' };
  }
  try {
    const res = await fetch(`${BASE}${process.env.ZERNIO_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO confirm auth scheme from handoff (Bearer vs x-api-key):
        'Authorization': `Bearer ${KEY}`,
      },
      body: JSON.stringify({ posts: rows }),
    });
    const body = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, body };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'request failed' };
  }
}
