// PublicLandingPageBenefitsSection — Phase 4

import { PublicLandingPageSectionWrapper } from './PublicLandingPageSectionWrapper';

interface PublicLandingPageBenefitsSectionProps {
  data: Array<{
    title: string;
    description: string;
  }>;
}

export function PublicLandingPageBenefitsSection({ data }: PublicLandingPageBenefitsSectionProps) {
  if (!data || data.length === 0) return null;

  return (
    <PublicLandingPageSectionWrapper>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((b, i) => (
            <div key={i} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {i + 1}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{b.title}</h3>
              <p className="text-gray-600 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicLandingPageSectionWrapper>
  );
}
