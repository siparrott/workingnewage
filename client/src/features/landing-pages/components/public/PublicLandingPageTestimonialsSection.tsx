// PublicLandingPageTestimonialsSection — Phase 4

import { Quote, Star, ExternalLink } from 'lucide-react';
import { PublicLandingPageSectionWrapper } from './PublicLandingPageSectionWrapper';

// Real Google Business Profile reviews page — lets visitors verify the quotes.
const GOOGLE_REVIEWS_URL = 'https://maps.app.goo.gl/fckY6bgN4dACo6H29';

interface PublicLandingPageTestimonialsSectionProps {
  data: Array<{
    quote: string;
    author: string;
    role?: string;
    source?: string; // editor saves "source", AI generation saves "role" — accept both
  }>;
}

export function PublicLandingPageTestimonialsSection({ data }: PublicLandingPageTestimonialsSectionProps) {
  if (!data || data.length === 0) return null;

  return (
    <PublicLandingPageSectionWrapper bg="gray">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-3">
          Das sagen unsere Kunden
        </h2>
        <div className="flex items-center justify-center gap-2 mb-10 text-gray-600">
          <span className="flex text-yellow-400">
            {[0, 1, 2, 3, 4].map((j) => <Star key={j} className="h-4 w-4 fill-current" />)}
          </span>
          <span className="text-sm font-medium">Echte Google-Bewertungen</span>
        </div>
        {/* A single testimonial in a 2-col grid looked sparse/lopsided —
            center it; only use the grid from 2 items up. */}
        <div className={data.length === 1 ? 'max-w-xl mx-auto' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}>
          {data.map((t, i) => (
            <figure
              key={i}
              className="relative bg-white border border-gray-100 rounded-2xl p-7 pt-9 shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="absolute top-5 right-6 h-8 w-8 text-purple-100" aria-hidden="true" />
              <div className="flex gap-0.5 mb-3 text-yellow-400">
                {[0, 1, 2, 3, 4].map((j) => <Star key={j} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="text-gray-700 italic mb-4 leading-relaxed">"{t.quote}"</blockquote>
              <figcaption>
                <span className="block font-semibold text-gray-900">— {t.author}</span>
                {(t.role || t.source) && <span className="block text-sm text-gray-500">{t.role || t.source}</span>}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Verify the source — real Google Business Profile */}
        <div className="text-center mt-8">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium text-sm underline underline-offset-2"
          >
            Alle Bewertungen auf Google ansehen
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </PublicLandingPageSectionWrapper>
  );
}
