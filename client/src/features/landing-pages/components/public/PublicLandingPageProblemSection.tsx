// PublicLandingPageProblemSection — Phase 4

import { PublicLandingPageSectionWrapper } from './PublicLandingPageSectionWrapper';

interface PublicLandingPageProblemSectionProps {
  data: {
    headline?: string;
    description?: string;
    painPoints?: string[];
  };
}

export function PublicLandingPageProblemSection({ data }: PublicLandingPageProblemSectionProps) {
  return (
    <PublicLandingPageSectionWrapper>
      <div className="max-w-3xl mx-auto text-center">
        {data.headline && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {data.headline}
          </h2>
        )}
        {data.description && (
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {data.description}
          </p>
        )}
        {data.painPoints && data.painPoints.length > 0 && (
          <div className="max-w-lg mx-auto text-left space-y-3">
            {data.painPoints.map((p, i) => (
              <div key={i} className="flex items-start gap-3 text-gray-700">
                <span className="text-red-400 text-lg leading-none mt-0.5">✗</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLandingPageSectionWrapper>
  );
}
