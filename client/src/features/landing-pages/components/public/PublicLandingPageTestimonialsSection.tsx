// PublicLandingPageTestimonialsSection — Phase 4

import { PublicLandingPageSectionWrapper } from './PublicLandingPageSectionWrapper';

interface PublicLandingPageTestimonialsSectionProps {
  data: Array<{
    quote: string;
    author: string;
    role?: string;
  }>;
}

export function PublicLandingPageTestimonialsSection({ data }: PublicLandingPageTestimonialsSectionProps) {
  if (!data || data.length === 0) return null;

  return (
    <PublicLandingPageSectionWrapper>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
          Das sagen unsere Kunden
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((t, i) => (
            <div key={i} className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex gap-1 mb-3 text-yellow-400">
                {'★★★★★'.split('').map((s, j) => <span key={j} className="text-lg">{s}</span>)}
              </div>
              <p className="text-gray-700 italic mb-4 leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-gray-900">— {t.author}</p>
                {t.role && <p className="text-sm text-gray-500">{t.role}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLandingPageSectionWrapper>
  );
}
