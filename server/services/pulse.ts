// Pulse / AxixOS Social ingest connector.
//
// Pushes a blog post's Social Pack into Pulse (https://axixos-social.de) via its
// public ingest API (POST /api/v1/posts), so Pulse schedules + publishes to the
// connected social accounts (Facebook, Instagram, Threads, LinkedIn, Google Business,
// Pinterest, …) on its own due-cron.
//
// Contract (v1, stable): one row per platform. Auth is Bearer <pls_live_...>.
// See the Pulse repo docs/ingest-api.md for the full schema.
//
// SAFETY: even with a key configured, auto-distribution stays OFF until
// PULSE_AUTODISTRIBUTE is truthy, and defaults to "draft" mode so nothing is posted
// to real accounts until an operator flips PULSE_MODE to "schedule" or "now".
//
// Secret PULSE_API_KEY lives in the environment (never commit it).
import type { PreparedSocialPack } from './socialSnippets.js';

const BASE = (process.env.PULSE_API_BASE || 'https://axixos-social.de').replace(/\/+$/, '');
const KEY = process.env.PULSE_API_KEY || '';
const AUTO = /^(1|true|yes|on)$/i.test(process.env.PULSE_AUTODISTRIBUTE || '');
// draft (default, safe) | schedule (at the post's publish time) | now (publish immediately)
const MODE = (process.env.PULSE_MODE || 'draft').toLowerCase();
const TZ = process.env.PULSE_TZ || 'Europe/Vienna';
const PLATFORMS = (process.env.PULSE_PLATFORMS || 'facebook,instagram,threads,linkedin,googlebusiness,pinterest')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

/** True once a Pulse API key is present (distribution is technically possible). */
export function isPulseConfigured(): boolean {
  return !!KEY;
}

/** True only when a key is present AND auto-distribution has been explicitly enabled. */
export function isPulseAutoEnabled(): boolean {
  return !!KEY && AUTO;
}

export interface PulseRow {
  external_id: string;
  post_content: string;
  platform: string;
  profile?: string;
  title?: string;
  hashtags?: string;
  media_urls?: string[];
  group_key?: string;
  tz?: string;
  schedule_time?: string;
  publish_now?: boolean;
  is_draft?: boolean;
}

interface PostLike {
  id: string;
  slug: string;
  title: string;
  imageUrl?: string | null;
  imageUrl2?: string | null;
  imageUrl3?: string | null;
  publishedAt?: Date | string | null;
  scheduledFor?: Date | string | null;
}

/** Format a Date as a wall-clock "YYYY-MM-DD HH:mm" in the given IANA time zone (Pulse's schedule_time format). */
function toWallClock(d: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
  // hour12:false can emit "24" for midnight on some runtimes — normalise to "00".
  const hh = get('hour') === '24' ? '00' : get('hour');
  return `${get('year')}-${get('month')}-${get('day')} ${hh}:${get('minute')}`;
}

/**
 * Turn a blog post + its Social Pack into one Pulse ingest row per platform.
 * Platforms not in PULSE_PLATFORMS, or with empty copy, are skipped. Instagram and
 * Pinterest are skipped when the post has no image (both require media).
 */
export function buildPulseRows(
  post: PostLike,
  sp: PreparedSocialPack,
  opts?: { mode?: string; when?: Date },
): PulseRow[] {
  const images = [post.imageUrl, post.imageUrl2, post.imageUrl3].filter((v): v is string => Boolean(v));
  const hashtags = (sp.hashtags || []).map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ');
  const groupKey = `newage-blog-${post.id}`;
  const mode = (opts?.mode || MODE).toLowerCase();
  const when = opts?.when
    || (post.publishedAt ? new Date(post.publishedAt) : (post.scheduledFor ? new Date(post.scheduledFor) : new Date()));

  const scheduleFields = (): Partial<PulseRow> => {
    if (mode === 'now') return { publish_now: true };
    if (mode === 'schedule') return { schedule_time: toWallClock(when, TZ), tz: TZ };
    return { is_draft: true }; // draft (default): stored in Pulse for review, not delivered
  };

  const defs: Array<{ platform: string; content: string; title?: string; needsMedia?: boolean }> = [
    { platform: 'facebook', content: sp.facebook },
    { platform: 'instagram', content: sp.instagramCaption, needsMedia: true },
    { platform: 'threads', content: sp.threads },
    { platform: 'linkedin', content: sp.linkedin },
    { platform: 'googlebusiness', content: sp.googlebusiness },
    { platform: 'pinterest', content: sp.pinterestDescription, title: sp.pinterestTitle, needsMedia: true },
  ];

  const rows: PulseRow[] = [];
  for (const d of defs) {
    if (!PLATFORMS.includes(d.platform)) continue;
    if (!d.content || !d.content.trim()) continue;
    if (d.needsMedia && images.length === 0) continue;
    // Optional per-platform account selector, e.g. PULSE_PROFILE_INSTAGRAM=acc_123.
    // Omitted when unset — Pulse then uses the single connected account for that platform.
    const profile = process.env[`PULSE_PROFILE_${d.platform.toUpperCase()}`];
    rows.push({
      external_id: `newage-${post.id}-${d.platform}`, // stable → idempotent retries (Pulse dedupes)
      post_content: d.content,
      platform: d.platform,
      ...(profile ? { profile } : {}),
      ...(d.title ? { title: d.title } : {}),
      ...(hashtags ? { hashtags } : {}),
      ...(images.length ? { media_urls: images } : {}),
      group_key: groupKey,
      ...scheduleFields(),
    });
  }
  return rows;
}

/** POST the built rows to Pulse's ingest endpoint. Best-effort; never throws. */
export async function distributeToPulse(
  rows: PulseRow[],
): Promise<{ ok: boolean; status?: number; summary?: any; results?: any[]; error?: string }> {
  if (!KEY) return { ok: false, error: 'PULSE_API_KEY not set' };
  if (!rows.length) return { ok: false, error: 'No eligible rows to send (no matching platforms / empty copy).' };
  try {
    const res = await fetch(`${BASE}/api/v1/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEY}`,
      },
      body: JSON.stringify({ posts: rows }),
    });
    const body: any = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, summary: body?.summary, results: body?.results };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'request failed' };
  }
}
