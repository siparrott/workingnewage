/**
 * A BLOG POST BODY MUST NOT CONTAIN <h1>. THE PAGE ALREADY HAS ONE.
 *
 * Seven published posts store their section headings as <h1> — nine to eleven each,
 * 67 in total. Both render paths inject that HTML verbatim beneath the page's own
 * <h1>{post.title}</h1>, so those pages ship with ten or twelve competing top-level
 * headings. The document outline is flat: nothing says which heading owns which
 * section, a screen reader announces eleven peers where there is one article, and
 * the one signal that should say what the page is about says eleven different things.
 *
 * Fixed on render, not in the database. The stored HTML is the studio's copy and is
 * edited elsewhere; rewriting 67 headings across seven live rows to correct a display
 * concern would be a destructive migration to solve a presentational bug — and it
 * would not protect the next post written the same way. This runs on the way out, so
 * old posts and future ones are both covered, and nothing is lost if it is removed.
 *
 * WHY REMAP RATHER THAN DEMOTE. Shifting every level down one is right for the six
 * posts shaped h1 + h2, and wrong for the seventh: it stores h1 + h3 with no h2, so a
 * blanket shift yields h2 + h4 and invents a skipped level that was not there. So the
 * distinct levels actually present are collected and mapped onto consecutive levels
 * starting at h2 — {1,2} becomes {2,3}, {1,3} becomes {2,3}. Relative nesting is
 * preserved either way, and no gap is introduced.
 *
 * Content with no <h1> is returned untouched: the other 22 posts already use h2/h3
 * correctly, and demoting them would be the same mistake in the other direction.
 */
export function normalizeBlogHeadings(html: string): string {
  const src = String(html || '');
  if (!src) return src;

  // Only content that claims a top-level heading needs rescuing.
  if (!/<h1\b/i.test(src)) return src;

  const levels = new Set<number>();
  const re = /<\s*\/?\s*h([1-6])\b/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) levels.add(Number(m[1]));

  // Consecutive target levels from h2 down, capped at h6 (HTML has no h7).
  const ordered = [...levels].sort((a, b) => a - b);
  const map = new Map<number, number>();
  ordered.forEach((lvl, i) => map.set(lvl, Math.min(2 + i, 6)));

  // Rewrite opening and closing tags together so no pair is left mismatched.
  return src.replace(/<(\s*\/?\s*)h([1-6])\b/gi, (whole, slash: string, digit: string) => {
    const to = map.get(Number(digit));
    return to ? `<${slash}h${to}` : whole;
  });
}
