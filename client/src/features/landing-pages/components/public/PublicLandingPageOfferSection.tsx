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
  return (
    <PublicLandingPageSectionWrapper bg="purple">
      <div className="max-w-3xl mx-auto text-center">
        {data.headline && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {data.headline}
          </h2>
        )}
        {data.description && (
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {data.description}
          </p>
        )}
        {data.price && (
          <p className="text-4xl font-extrabold text-purple-600 mb-6">{data.price}</p>
        )}
        {data.inclusions && data.inclusions.length > 0 && (
          <div className="max-w-md mx-auto text-left space-y-3 mb-8">
            {data.inclusions.map((inc, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{inc}</span>
              </div>
            ))}
          </div>
        )}
        {data.urgency && (
          <p className="text-red-600 font-bold text-lg mb-6">{data.urgency}</p>
        )}
        <PublicLandingPageCtaButton
          href={ctaHref}
          label={ctaText}
          pageId={pageId}
          pageSlug={pageSlug}
          placement="offer"
          isPreview={isPreview}
        />
      </div>
    </PublicLandingPageSectionWrapper>
  );
}
