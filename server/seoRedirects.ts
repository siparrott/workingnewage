import type { Request, Response, NextFunction } from "express";

/**
 * 301 redirects for pruned thin blog posts → the most relevant pillar/cluster.
 *
 * These six posts are ~150-word stubs that can't rank and dilute topical focus.
 * Rather than delete (which leaves 404s), we 301 them so any indexed URL or
 * inbound link passes its authority up to a strong page. One stub
 * (outfit-fotoshooting-tipps) is consolidated into its stronger sibling article.
 *
 * Key = request path WITHOUT trailing slash. Edit freely as content is pruned;
 * remove an entry to "un-redirect" a post. Also unpublish these in the admin
 * blog manager so they stop appearing in the /blog index.
 */
export const SEO_REDIRECTS: Record<string, string> = {
  "/blog/wandbild-fallstudie-wohnzimmer": "/familienfotos-wien/",
  "/blog/gute-retusche-vs-ueberretusche": "/studio-fotografie-wien/",
  "/blog/outfit-fotoshooting-tipps": "/blog/die-besten-outfits-fuer-familienfotos-in-wien",
  "/blog/warum-familienfotos-wertvoller-werden": "/familienfotos-wien/",
  "/blog/mehrgenerationen-familienfotos-fallstudie": "/familienfotos-wien/",
  "/blog/wer-kann-beim-fotoshooting-dabei-sein": "/familienfotos-wien/",
};

export function seoRedirects(req: Request, res: Response, next: NextFunction) {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const path = req.path.replace(/\/+$/, "") || "/";
  const target = SEO_REDIRECTS[path];
  if (target) return res.redirect(301, target);
  next();
}
