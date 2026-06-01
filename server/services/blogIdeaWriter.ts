// Context-first article writer for the idea-driven pipeline (Phase 3).
//
// Priority of truth (highest first):
//   1. User-supplied context (location, timing, people, occasion, commentary) — FACTS
//   2. Vision descriptions/keywords from the photos                          — TEXTURE
//   3. Website/brand context (studio positioning, pillar, internal links)    — FRAME
//   4. Camera/EXIF details                                                   — AUTHENTICITY
//
// The writer is told to ground the article in the real shoot, never invent
// facts beyond what the user gave, and keep the studio-based positioning.
import OpenAI from 'openai';
import type { BlogContext, VisionResult, ImageExif } from './blogImageAnalysis.js';

export interface IdeaImage {
  url?: string;
  vision?: VisionResult;
  exif?: ImageExif;
  altText?: string;
}

export interface WriterInput {
  title: string;
  primaryKeyword?: string;
  pillar?: string;          // e.g. /familienfotos-wien/
  tags?: string[];
  images: IdeaImage[];
  context: BlogContext;
}

export interface WriterOutput {
  excerpt: string;
  seoTitle: string;
  metaDescription: string;
  html: string;
}

const ALLOWED_LINKS = [
  '/familienfotos-wien/', '/neugeborenenfotos-wien/', '/babyfotos-wien/',
  '/schwangerschaftsfotos-wien/', '/kinder-fotografie-wien/', '/business-portrait-wien/',
  '/bewerbungsfotos-wien/', '/teamfotos-wien/', '/hochzeitsfotografie-wien/',
  '/eventfotografie-wien/', '/studio-fotografie-wien/', '/vouchers/', '/preise/',
  '/warteliste', '/kontakt',
];

let _openai: OpenAI | null = null;
function openai(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

function cameraSummary(exif?: ImageExif): string {
  if (!exif) return '';
  const parts: string[] = [];
  if (exif.make || exif.model) parts.push([exif.make, exif.model].filter(Boolean).join(' '));
  if (exif.lensModel) parts.push(exif.lensModel);
  if (exif.fNumber) parts.push(`f/${exif.fNumber}`);
  if (exif.focalLength) parts.push(`${exif.focalLength}mm`);
  if (exif.iso) parts.push(`ISO ${exif.iso}`);
  return parts.join(', ');
}

function buildContextPack(input: WriterInput): string {
  const { title, primaryKeyword, pillar, context, images } = input;
  const visions = images.map((im, i) => {
    const v = im.vision;
    if (!v) return '';
    return `Bild ${i + 1}: ${v.description} (Stimmung: ${v.mood}; sichtbar: ${v.sceneKeywords.join(', ')})`;
  }).filter(Boolean);
  const cams = images.map(cameraSummary).filter(Boolean);

  return [
    `TITEL: ${title}`,
    primaryKeyword ? `HAUPT-KEYWORD: ${primaryKeyword}` : '',
    pillar ? `PILLAR-SEITE (verlinken): ${pillar}` : '',
    '',
    '# 1) FAKTEN VOM KUNDEN (höchste Priorität — niemals widersprechen, niemals erfinden):',
    context.location ? `- Ort: ${context.location}` : '',
    context.timing ? `- Zeit/Jahreszeit: ${context.timing}` : '',
    context.people ? `- Personen: ${context.people}` : '',
    context.celebration ? `- Anlass: ${context.celebration}` : '',
    context.commentary ? `- Anmerkungen des Fotografen: ${context.commentary}` : '',
    '',
    '# 2) WAS AUF DEN FOTOS ZU SEHEN IST (für Beschreibung/Stimmung, keine Fakten):',
    visions.length ? visions.join('\n') : '(keine Bildanalyse vorhanden)',
    '',
    '# 3) KAMERA/AUTHENTIZITÄT (optional dezent einbauen):',
    cams.length ? cams.join(' | ') : '(keine Kameradaten)',
  ].filter((l) => l !== '').join('\n');
}

export async function generateArticle(input: WriterInput): Promise<WriterOutput> {
  const system = [
    'Du bist Texter:in für New Age Fotografie, ein Tageslichtstudio in Wien-Margareten.',
    'STUDIO-POSITIONIERUNG: Familien-, Baby-, Neugeborenen-, Schwangerschafts- und Kinderfotos entstehen IMMER im Studio.',
    'Nur Hochzeiten, Business/Team und Events werden on-location fotografiert. Empfiehl niemals Outdoor-Locations für Familien.',
    'STIMME: warm, persönlich, „ihr/euch", wir-Perspektive. E-E-A-T dezent: über 13 Jahre, 300+ Shootings, 4,8 ★.',
    'WICHTIG: Gründe den Artikel im echten Shooting laut Kontext. Erfinde KEINE Namen, Orte oder Anlässe über die Kundenfakten hinaus.',
    'HTML-REGELN: nur <p> <h2> <h3> <ul> <ol> <li> <table> <strong> <em> <a> <blockquote>. Keine data-* Attribute, keine class, kein <div>, keine leeren <p>.',
    `Interne Links nur aus dieser Liste: ${ALLOWED_LINKS.join(', ')}. Verlinke die Pillar-Seite + 1–2 passende.`,
    'STRUKTUR (~600–800 Wörter): Einleitung mit Haupt-Keyword + Pillar-Link; 3–5 <h2>; „Häufige Fragen" mit 3–4 <h3>+<p>; Abschluss-CTA mit /warteliste, /preise/, /kontakt; <blockquote> mit 4,8 ★.',
    'Antworte als JSON: { "excerpt": "...", "seoTitle": "...", "metaDescription": "...", "html": "..." }.',
  ].join('\n');

  const res = await openai().chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.6,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: `Schreibe den Artikel auf Basis dieses Kontexts:\n\n${buildContextPack(input)}` },
    ],
  });

  const raw = res.choices[0]?.message?.content || '{}';
  let p: any = {};
  try { p = JSON.parse(raw); } catch { /* defaults below */ }
  return {
    excerpt: String(p.excerpt || ''),
    seoTitle: String(p.seoTitle || input.title),
    metaDescription: String(p.metaDescription || ''),
    html: String(p.html || ''),
  };
}
