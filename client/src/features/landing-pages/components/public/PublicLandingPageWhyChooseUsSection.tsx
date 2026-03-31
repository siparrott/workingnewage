// PublicLandingPageWhyChooseUsSection — Phase 4

import { Shield } from 'lucide-react';
import { PublicLandingPageSectionWrapper } from './PublicLandingPageSectionWrapper';

interface PublicLandingPageWhyChooseUsSectionProps {
  data: {
    headline?: string;
    reasons?: Array<{
      title: string;
      description: string;
    }>;
  };
}

export function PublicLandingPageWhyChooseUsSection({ data }: PublicLandingPageWhyChooseUsSectionProps) {
  return (
    <PublicLandingPageSectionWrapper bg="gray">
      <div className="max-w-3xl mx-auto">
        {data.headline && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
            {data.headline}
          </h2>
        )}
        {data.reasons && data.reasons.length > 0 && (
          <div className="space-y-6">
            {data.reasons.map((r, i) => (
              <div key={i} className="flex gap-4 bg-white p-5 rounded-xl shadow-sm">
                <Shield className="h-6 w-6 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{r.title}</h4>
                  <p className="text-gray-600 mt-1">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLandingPageSectionWrapper>
  );
}
