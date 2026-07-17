// Generate per-channel social captions for a blog post, in the New Age voice +
// emotional/story hooks (see WRITING-GUIDELINES). Used for the Zernio CSV export
// and (later) the Zernio API connector. One gpt-4o-mini call per post.
import OpenAI from 'openai';

export interface SocialPostInput {
  title: string;
  excerpt?: string;
  body?: string;        // plain text or HTML (will be trimmed)
  url: string;          // canonical blog URL (link-back target)
  pillar?: string;
}

export interface SocialPack {
  base: string;                 // generic fallback caption
  hashtags: string[];           // 5–8, without spaces
  facebook: string;
  instagram: string;            // no link in caption (IG); link goes to first comment
  threads: string;
  linkedin: string;
  googlebusiness: string;       // short, local
  pinterestTitle: string;       // keyword-rich pin title
  pinterestDescription: string;
}

export interface PreparedSocialPack {
  generatedAt: string;
  articleUrl: string;
  hashtags: string[];
  facebook: string;
  instagramCaption: string;
  instagramFirstComment: string;
  threads: string;
  linkedin: string;
  googlebusiness: string;
  pinterestTitle: string;
  pinterestDescription: string;
  pinterestLink: string;
}

let _o: OpenAI | null = null;
const openai = () => (_o ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'sk-not-configured' }));

const stripHtml = (s = '') => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export async function generateSocialPack(input: SocialPostInput): Promise<SocialPack> {
  const sys = [
    'Du schreibst Social-Media-Posts für New Age Fotografie, ein Tageslichtstudio in Wien-Margareten.',
    'STIMME: warm, persönlich, „ihr/euch", nach 13 Jahren echter Erfahrung. Studio-Positionierung beachten (Familie/Baby im Studio).',
    'HOOK: Beginne mit einem emotionalen/Story-Hook (z.B. „Der Satz, den wir fast jede Woche hören…"), nicht mit „Neuer Blogbeitrag".',
    'Pro Kanal eigener Stil:',
    '- facebook: 2–4 Sätze, Hook + Mehrwert + klarer Call-to-Action; Link gehört in den Text.',
    '- instagram: emotionaler Hook + Mehrwert; KEIN Link im Text (Instagram verlinkt nicht) – stattdessen „Link im ersten Kommentar"; lockerer, mit 1–2 Emojis.',
    '- threads: pointierter, gesprächiger Kurzpost mit einem klaren Gedanken und natürlichem Link im Text; deutlich länger als ein Titel, aber kürzer als Facebook.',
    '- linkedin: professioneller, kompetenzbetont; bei Business-Themen Karriere-Nutzen; Link im Text.',
    '- googlebusiness: kurz (max ~1500 Zeichen), lokal, mit „Jetzt Termin sichern".',
    '- pinterestTitle: prägnanter, keyword-reicher Pin-Titel (max ~100 Zeichen); pinterestDescription: 1–2 Sätze, keyword-reich.',
    'hashtags: 5–8 relevante, ohne Leerzeichen (z.B. familienfotoswien). KEIN „#" voranstellen (nur das Wort).',
    'Antworte als JSON: { "base","facebook","instagram","threads","linkedin","googlebusiness","pinterestTitle","pinterestDescription","hashtags":[...] }.',
  ].join('\n');

  const user = [
    `TITEL: ${input.title}`,
    input.excerpt ? `AUSZUG: ${input.excerpt}` : '',
    input.body ? `INHALT (gekürzt): ${stripHtml(input.body).slice(0, 1200)}` : '',
    `BLOG-URL (Link-back): ${input.url}`,
  ].filter(Boolean).join('\n');

  const res = await openai().chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
  });

  let p: any = {};
  try { p = JSON.parse(res.choices[0]?.message?.content || '{}'); } catch { /* defaults */ }
  const arr = Array.isArray(p.hashtags) ? p.hashtags.map((h: string) => String(h).replace(/^#/, '').replace(/\s+/g, '')) : [];
  return {
    base: String(p.base || input.excerpt || input.title),
    hashtags: arr.slice(0, 8),
    facebook: String(p.facebook || p.base || ''),
    instagram: String(p.instagram || p.base || ''),
    threads: String(p.threads || p.facebook || p.base || ''),
    linkedin: String(p.linkedin || p.base || ''),
    googlebusiness: String(p.googlebusiness || p.base || ''),
    pinterestTitle: String(p.pinterestTitle || input.title).slice(0, 100),
    pinterestDescription: String(p.pinterestDescription || input.excerpt || ''),
  };
}

export async function buildPreparedSocialPack(input: SocialPostInput): Promise<PreparedSocialPack> {
  const pack = await generateSocialPack(input);
  const facebookUrl = withUtm(input.url, 'facebook');
  const instagramUrl = withUtm(input.url, 'instagram');
  const threadsUrl = withUtm(input.url, 'threads');
  const linkedinUrl = withUtm(input.url, 'linkedin');
  const googlebusinessUrl = withUtm(input.url, 'googlebusiness');
  const pinterestUrl = withUtm(input.url, 'pinterest');

  return {
    generatedAt: new Date().toISOString(),
    articleUrl: input.url,
    hashtags: pack.hashtags,
    facebook: `${pack.facebook}\n\n${facebookUrl}`.trim(),
    instagramCaption: `${pack.instagram}\n\nLink im ersten Kommentar.`.trim(),
    instagramFirstComment: `Mehr im Blog: ${instagramUrl}`,
    threads: `${pack.threads}\n\n${threadsUrl}`.trim(),
    linkedin: `${pack.linkedin}\n\n${linkedinUrl}`.trim(),
    googlebusiness: `${pack.googlebusiness}\n\nMehr im Blog: ${googlebusinessUrl}`.trim(),
    pinterestTitle: pack.pinterestTitle,
    pinterestDescription: `${pack.pinterestDescription}\n\nMehr im Blog: ${pinterestUrl}`.trim(),
    pinterestLink: pinterestUrl,
  };
}

/** Append channel-specific UTM params to the link-back URL. */
export function withUtm(url: string, channel: string): string {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}utm_source=${channel}&utm_medium=social&utm_campaign=blog`;
}
