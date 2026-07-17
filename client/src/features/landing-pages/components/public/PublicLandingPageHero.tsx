// PublicLandingPageHero — Phase 4

import { PublicLandingPageCtaButton } from './PublicLandingPageCtaButton';

interface PublicLandingPageHeroProps {
  data: {
    headline: string;
    subheadline?: string;
    ctaText?: string;
    eyebrow?: string;
    badgeText?: string;
  };
  imageUrl?: string | null;
  videoUrl?: string | null;
  /** JSON {x,y,zoom} from the editor's drag-to-fit tool. */
  imagePosition?: string | null;
  ctaHref: string;
  ctaText: string;
  pageId: string;
  pageSlug: string;
  isPreview: boolean;
}

// Parse the editor's stored crop; defaults favour the upper part of the photo
// (hero images are usually people — centre-cropping cut heads off).
function parseHeroPosition(raw?: string | null): { x: number; y: number; zoom: number } {
  try {
    const v = raw ? JSON.parse(raw) : null;
    return {
      x: Math.min(100, Math.max(0, Number(v?.x ?? 50))),
      y: Math.min(100, Math.max(0, Number(v?.y ?? 25))),
      zoom: Math.min(2, Math.max(1, Number(v?.zoom ?? 1))),
    };
  } catch {
    return { x: 50, y: 25, zoom: 1 };
  }
}

export function PublicLandingPageHero({
  data,
  imageUrl,
  videoUrl,
  imagePosition,
  ctaHref,
  ctaText,
  pageId,
  pageSlug,
  isPreview,
}: PublicLandingPageHeroProps) {
  const hasMedia = !!(imageUrl || videoUrl);
  const pos = parseHeroPosition(imagePosition);
  return (
    <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 text-white overflow-hidden">
      {/* Optional background media (video preferred over image), with a dark
          overlay so the headline/CTA stay readable. */}
      {videoUrl ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : imageUrl ? (
        // Crop set by the editor's drag-to-fit tool (object-position + zoom).
        <img
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: `${pos.x}% ${pos.y}%`,
            transform: pos.zoom > 1 ? `scale(${pos.zoom})` : undefined,
            transformOrigin: `${pos.x}% ${pos.y}%`,
          }}
          src={imageUrl}
          alt=""
        />
      ) : null}
      {hasMedia && <div className="absolute inset-0 bg-black/55" />}
      <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
        {data.eyebrow && (
          <p className="text-purple-200 text-sm uppercase tracking-wider mb-4 font-medium">
            {data.eyebrow}
          </p>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
          {data.headline}
        </h1>
        {data.subheadline && (
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            {data.subheadline}
          </p>
        )}
        <PublicLandingPageCtaButton
          href={ctaHref}
          label={data.ctaText || ctaText}
          pageId={pageId}
          pageSlug={pageSlug}
          placement="hero"
          isPreview={isPreview}
          variant="primaryInverted"
        />
        {data.badgeText && (
          <p className="mt-4 text-sm text-white/70">{data.badgeText}</p>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
