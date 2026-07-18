// PublicLandingPageOfferSection — Phase 4

import { CheckCircle } from 'lucide-react';
import { PublicLandingPageSectionWrapper } from './PublicLandingPageSectionWrapper';
import { PublicLandingPageCtaButton } from './PublicLandingPageCtaButton';

interface PublicLandingPageOfferSectionProps {
  data: {
    headline?: string;
    description?: string;
    price?: string;
    inclusions?: string[];
    urgency?: string;
  };
  ctaHref: string;
  ctaText: string;
  pageId: string;
  pageSlug: string;
  isPreview: boolean;
}

export function PublicLandingPageOfferSection({
  data,
  ctaHref,
  ctaText,
  pageId,
  pageSlug,
  isPreview,
}: PublicLandingPageOfferSectionProps) {
  const inclusions = (data.inclusions ?? []).filter(Boolean);
  return (
    <PublicLandingPageSectionWrapper bg="purple">
      <div className="max-w-2xl mx-auto">
        {/* Intro above the card */}
        <div className="text-center mb-8">
          {data.headline && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.headline}
            </h2>
          )}
          {data.description && (
            <p className="text-gray-700 text-lg leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* The offer card — contains price, what's included, urgency and CTA */}
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 md:p-10">
          {data.price && (
            <div className="text-center mb-8">
              <span className="block text-5xl font-extrabold text-purple-600 leading-none">{data.price}</span>
            </div>
          )}

          {inclusions.length > 0 && (
            <div className="text-left space-y-3 mb-8">
              {inclusions.map((inc, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{inc}</span>
                </div>
              ))}
            </div>
          )}

          {data.urgency && (
            <p className="text-red-600 font-semibold text-center mb-6">{data.urgency}</p>
          )}

          <div className="flex justify-center">
            <PublicLandingPageCtaButton
              href={ctaHref}
              label={ctaText}
              pageId={pageId}
              pageSlug={pageSlug}
              placement="offer"
              isPreview={isPreview}
            />
          </div>
        </div>
      </div>
    </PublicLandingPageSectionWrapper>
  );
}
