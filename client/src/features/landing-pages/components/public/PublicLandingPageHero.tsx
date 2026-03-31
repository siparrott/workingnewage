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
  ctaHref: string;
  ctaText: string;
  pageId: string;
  pageSlug: string;
  isPreview: boolean;
}

export function PublicLandingPageHero({
  data,
  ctaHref,
  ctaText,
  pageId,
  pageSlug,
  isPreview,
}: PublicLandingPageHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 text-white">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
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
