// On-the-fly image resizing for the PUBLIC marketing images (portfolio,
// homepage, blog). Wraps a public image URL through images.weserv.nl, which
// fetches the original and returns a resized WebP — shrinking the existing
// full-resolution back-catalogue without re-uploading anything.
//
// Only use this for images that are ALREADY public. Do not proxy anything
// sensitive. Every consumer should also set an onError fallback to the original
// URL (see proxiedImgProps) so a proxy hiccup never leaves a blank image.

interface ProxyOpts {
  w?: number;   // target width in CSS px (weserv scales, never enlarges)
  h?: number;
  q?: number;   // WebP quality (default 80)
  dpr?: number; // device pixel ratio (default 2 for crisp retina)
}

export function proxyImage(url: string | null | undefined, opts: ProxyOpts = {}): string {
  if (!url) return '';
  // Only proxy ABSOLUTE http(s) URLs. Relative URLs (e.g. our own
  // /api/proxy-image or /api/galleries/image endpoints, which already resize
  // server-side) and data:/blob:/svg are passed through untouched — weserv
  // can't fetch them and would break the image.
  if (!/^https?:\/\//i.test(url)) return url;
  if (url.includes('images.weserv.nl')) return url;
  if (/\.svg(\?|$)/i.test(url)) return url;

  const stripped = url.replace(/^https?:\/\//, '');
  const params = new URLSearchParams();
  params.set('url', stripped);
  if (opts.w) params.set('w', String(opts.w));
  if (opts.h) params.set('h', String(opts.h));
  params.set('output', 'webp');
  params.set('q', String(opts.q ?? 80));
  params.set('dpr', String(opts.dpr ?? 2));
  params.set('we', '1');    // don't enlarge past the source resolution
  params.set('il', '');     // interlaced/progressive for faster perceived paint
  return `https://images.weserv.nl/?${params.toString()}`;
}

/**
 * Spread onto an <img>: proxied src + an onError that falls back to the
 * original URL once, so a proxy failure degrades gracefully.
 */
export function proxiedImgProps(url: string | null | undefined, opts: ProxyOpts = {}) {
  const original = url || '';
  return {
    src: proxyImage(url, opts),
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (original && img.src !== original) img.src = original; // one-shot fallback
    },
  };
}
