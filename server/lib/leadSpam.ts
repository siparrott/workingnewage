/**
 * LEAD INTAKE HAD NO DEFENCE AT ALL, AND FOUR PUBLIC DOORS.
 *
 * /api/leads/create, /api/contact, /api/waitlist and /api/newsletter/signup all accept
 * anonymous POSTs and insert a row. The only validation was "an email or a phone must be
 * present". The global rate limit is 300 requests a minute, which is a DoS guard, not a
 * spam guard — a bot posting three leads a minute never approaches it.
 *
 * The spam arriving is not random. Each address appears exactly three times within the
 * same minute:
 *
 *     09:39  Fqpex     vfranco@shore.com.mx   5418926716
 *     09:39  Xuqcbx    vfranco@shore.com.mx   +43 4265758306
 *     09:39  vfranco   vfranco@shore.com.mx   (no phone)
 *
 * The third row is the giveaway: /api/newsletter/signup derives `name` as
 * email.split('@')[0], so "vfranco", "lindsay-john" and "info" are our own server naming
 * them. One script is walking every form on the site in a single pass.
 *
 * WHY NOT A CAPTCHA. A widget guards a browser; these endpoints accept curl. Unless the
 * server verifies a token, the widget is skipped entirely — so the protection was always
 * going to be server-side, and once it is server-side the cheap checks below catch this
 * pattern without asking a paying customer to drag a slider on a phone.
 *
 * WHAT MAY BE DISCARDED, AND WHAT MAY NOT. A dropped enquiry is a lost booking, so only
 * signals a human physically cannot trip are allowed to discard: a hidden field that was
 * filled, a form submitted faster than a person can type, and addresses the studio has
 * itself blocked. Everything softer — a name that looks machine-generated, a phone that
 * claims +43 and is not — only marks the row SPAM. It is still in the CRM, still
 * recoverable, just out of the New queue. Guessing wrong in that direction costs a click;
 * guessing wrong in the other direction costs a client.
 */

import { pool } from '../db';

export interface LeadCandidate {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
}

/** The two hidden fields the public forms post alongside the real ones. */
export interface BotSignals {
  /** Honeypot. A real browser never shows this input, so a value means a script filled it. */
  website?: unknown;
  /** Epoch ms stamped into the form when it rendered. */
  formLoadedAt?: unknown;
}

export interface SpamRuleLike {
  ruleType: string | null;
  value: string | null;
  isActive?: boolean | null;
}

export type LeadVerdict =
  | { action: 'accept' }
  | { action: 'drop'; reason: string }
  | { action: 'flag'; reason: string };

/**
 * Nobody fills a form in under this. Measured against a real submission the field is
 * generous: the fastest plausible human on the shortest form (an email address into the
 * newsletter box) is still several seconds from page load, and every other form asks for
 * more. Kept low anyway, because the cost of being wrong is a discarded enquiry.
 */
const MIN_FILL_MS = 2500;

/** A stamp older than this is treated as absent rather than as evidence — a tab left open
 *  overnight is a real person coming back, not a bot. */
const MAX_FORM_AGE_MS = 12 * 60 * 60 * 1000;

const VOWELS = /[aeiouäöüy]/gi;

/**
 * THERE IS NO NAME-SHAPE HEURISTIC HERE, DELIBERATELY.
 *
 * The spam names look obviously fake — Fqpex, Xuqcbx, Pblanphbx, Qzrvyiqez — and judging
 * them by shape is the first idea anyone has. Two attempts were written and measured
 * against a list of real Austrian surnames, and both failed in a way that matters.
 *
 * A vowel-ratio test flags "Schmidt" (one vowel in seven) and "Brandt" (one in six).
 * Stripping known clusters first and looking for long leftovers removes the very evidence
 * of fakery — "Pblanphbx" loses its "bl" and "ph" and then looks ordinary. Testing the
 * opening cluster against a closed set of German onsets worked best, catching six of the
 * seven, and still flagged "Gschwandtner" and "Vlcek".
 *
 * That last result is the reason the whole idea is abandoned rather than tuned. A rule
 * calibrated on German orthography does not distinguish "generated" from "not German" —
 * it flags Czech, Polish, Croatian and Turkish surnames, which in Vienna means flagging
 * real customers. The studio's clients are named Vlček and Gschwandtner and Öztürk. A
 * spam filter that quietly files their enquiries under SPAM is worse than the spam: the
 * spam wastes a minute, and this loses a booking while looking like it is working.
 *
 * The signals kept below — a number that claims +43 and cannot be Austrian, a link in a
 * message — are properties of the submission, not of what someone's name looks like. The
 * rate limit and duplicate suppression are what actually stop the observed attack anyway;
 * they do not care what anybody is called.
 */

/**
 * A number that claims Austria and is not one.
 *
 * Austrian mobiles are +43 6xx and landlines +43 1 (Vienna) or +43 2–7. "+43 4265758306"
 * is 10 digits after the country code where Austria uses at most 10 including the trunk,
 * and begins 42, which is not an Austrian area code. Only the explicit +43/0043 claim is
 * judged — a bare foreign number is left alone, because clients do travel and do call
 * from abroad.
 */
function claimsAustriaFalsely(raw: string): boolean {
  const s = String(raw || '').trim();
  if (!s) return false;
  const m = s.replace(/[\s\-()/.]/g, '').match(/^(?:\+43|0043)(\d+)/);
  if (!m) return false;
  const rest = m[1];
  if (!/^[1-7]/.test(rest)) return true;        // Austrian NDCs start 1–7
  if (rest.length < 6 || rest.length > 12) return true;
  return false;
}

const URL_RE = /(https?:\/\/|www\.|\[url=|<a\s+href)/i;

/** Studio-managed blocklist (the existing spam_rules table), applied to leads. */
export function matchesSpamRules(lead: LeadCandidate, rules: SpamRuleLike[]): string | null {
  const email = String(lead.email || '').toLowerCase().trim();
  const haystack = `${lead.name || ''} ${lead.message || ''}`.toLowerCase();
  const domain = email.includes('@') ? email.split('@')[1] : '';

  for (const r of rules || []) {
    if (r.isActive === false) continue;
    const value = String(r.value || '').toLowerCase().trim();
    if (!value) continue;
    if (r.ruleType === 'sender' && email && email === value) return `blocked sender ${value}`;
    if (r.ruleType === 'domain' && domain && (domain === value || domain.endsWith(`.${value}`))) return `blocked domain ${value}`;
    if (r.ruleType === 'keyword' && haystack.includes(value)) return `blocked keyword ${value}`;
  }
  return null;
}

/**
 * The verdict for one submission.
 *
 * `rules` is the studio's own blocklist; pass [] where it has not been loaded. Order
 * matters: the certain signals are tested before the uncertain ones, so a bot that also
 * trips a heuristic is dropped rather than filed.
 */
export function assessLead(
  lead: LeadCandidate,
  signals: BotSignals = {},
  rules: SpamRuleLike[] = [],
): LeadVerdict {
  // ── Certain: no human can do these ────────────────────────────────────────
  const honey = signals.website;
  if (typeof honey === 'string' && honey.trim() !== '') {
    return { action: 'drop', reason: 'honeypot filled' };
  }

  const stamp = Number(signals.formLoadedAt);
  if (Number.isFinite(stamp) && stamp > 0) {
    const age = Date.now() - stamp;
    if (age >= 0 && age < MIN_FILL_MS) {
      return { action: 'drop', reason: `submitted in ${age}ms` };
    }
    // A stamp from the future, or older than MAX_FORM_AGE_MS, tells us nothing. Ignored.
    void MAX_FORM_AGE_MS;
  }

  // ── Certain: the studio said so ───────────────────────────────────────────
  const blocked = matchesSpamRules(lead, rules);
  if (blocked) return { action: 'drop', reason: blocked };

  // ── Uncertain: flag only, never discard ───────────────────────────────────
  // Two independent signals are required. Either one alone is survivable by a real
  // person — a mistyped number, a client pasting the address of their company page —
  // and a single mistake must not be enough to file a genuine enquiry under SPAM.
  let score = 0;
  const why: string[] = [];
  if (claimsAustriaFalsely(String(lead.phone || ''))) { score += 2; why.push('invalid +43 number'); }
  if (URL_RE.test(String(lead.message || ''))) { score += 2; why.push('link in message'); }

  if (score >= 3) return { action: 'flag', reason: why.join(', ') };
  return { action: 'accept' };
}

/**
 * Has this address already been captured in the last few minutes?
 *
 * This is the single most effective check against what is actually arriving. Every spam
 * address in the CRM appears three times inside the same minute, because one script posts
 * to three different forms in one pass — so suppressing repeats collapses each burst to a
 * single row and removes about two thirds of the noise on its own.
 *
 * It is also the check least able to hurt anyone. A person who submits the contact form
 * and then the newsletter box genuinely is one lead, not two, and a person who taps Send
 * twice because nothing appeared to happen certainly is. The caller still answers them
 * with success; they simply do not generate a second row.
 *
 * Ten minutes, not longer: someone who enquires about a newborn shoot in the morning and a
 * wedding that evening has made two real enquiries and both should land.
 */
export const DEDUPE_WINDOW_MS = 10 * 60 * 1000;

export async function findRecentLeadByEmail(email: string): Promise<{ id: string } | null> {
  const addr = String(email || '').toLowerCase().trim();
  if (!addr) return null;
  try {
    const r = await pool.query(
      `SELECT id FROM crm_leads
        WHERE lower(email) = $1 AND created_at > NOW() - INTERVAL '10 minutes'
        ORDER BY created_at DESC LIMIT 1`,
      [addr],
    );
    return r.rows[0] ? { id: r.rows[0].id } : null;
  } catch {
    // A dedupe lookup must never cost a real enquiry. Failing open means at worst a
    // duplicate row; failing closed would mean a dropped booking.
    return null;
  }
}

/** The studio's blocklist, cached briefly so intake does not query it per submission. */
let rulesCache: { rules: SpamRuleLike[]; at: number } | null = null;
const RULES_TTL_MS = 60_000;

async function loadSpamRules(): Promise<SpamRuleLike[]> {
  if (rulesCache && Date.now() - rulesCache.at < RULES_TTL_MS) return rulesCache.rules;
  try {
    const r = await pool.query('SELECT rule_type, value, is_active FROM spam_rules WHERE is_active = true');
    const rules = (r.rows || []).map((row: any) => ({ ruleType: row.rule_type, value: row.value, isActive: row.is_active }));
    rulesCache = { rules, at: Date.now() };
    return rules;
  } catch {
    return rulesCache?.rules ?? [];   // fail open — never block intake on a lookup
  }
}

export interface LeadGate {
  /** false = do not insert. The caller still answers the client with success. */
  proceed: boolean;
  /** Status to store when proceeding: 'NEW' normally, 'SPAM' when flagged. */
  status: 'NEW' | 'SPAM';
  reason?: string;
}

/**
 * The one decision every public intake route asks for.
 *
 * Returns proceed:false for submissions that must not become rows — a filled honeypot, an
 * impossibly fast fill, a blocked address, or a repeat of one captured minutes ago. In all
 * of those the caller should still answer the client normally: a bot learns nothing from a
 * success it did not earn, and a person who double-tapped Send sees what they expected.
 *
 * Returns status:'SPAM' for submissions that are stored but kept out of the New queue, so
 * a wrong guess costs a click in the admin rather than a booking.
 */
export async function gateLead(lead: LeadCandidate, signals: BotSignals = {}): Promise<LeadGate> {
  const rules = await loadSpamRules();
  const verdict = assessLead(lead, signals, rules);

  if (verdict.action === 'drop') {
    console.info('[lead-spam] dropped:', verdict.reason, '-', String(lead.email || '').slice(0, 60));
    return { proceed: false, status: 'NEW', reason: verdict.reason };
  }

  const dup = await findRecentLeadByEmail(String(lead.email || ''));
  if (dup) {
    console.info('[lead-spam] duplicate within window:', String(lead.email || '').slice(0, 60));
    return { proceed: false, status: 'NEW', reason: 'duplicate' };
  }

  if (verdict.action === 'flag') {
    console.info('[lead-spam] flagged:', verdict.reason, '-', String(lead.email || '').slice(0, 60));
    return { proceed: true, status: 'SPAM', reason: verdict.reason };
  }

  return { proceed: true, status: 'NEW' };
}

export const __test = { claimsAustriaFalsely, MIN_FILL_MS };
