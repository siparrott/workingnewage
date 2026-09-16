import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface PortfolioImageRow {
  id: string | number;
  url: string;
  alt?: string | null;
  title?: string | null;
  category?: string | null;
}

/**
 * "So könnten eure Familienfotos aussehen" — the studio's work, on the homepage, large.
 *
 * WHAT WAS THERE BEFORE: nothing. A photographer's homepage carried two content blocks and a
 * grid of service cards, and the nearest thing to a portfolio was a thumbnail collage in the
 * hero. The work itself lived on /portfolio, which nothing above the footer linked to.
 *
 * TWELVE, NOT FORTY. This is a taste with a way through to the rest — "Mehr Familienfotos
 * ansehen" — not the whole gallery inlined on the homepage, which would cost the page its
 * load time for photographs most visitors will not scroll to.
 *
 * COLUMNS, NOT A GRID OF EQUAL CELLS. A fixed-cell grid crops every photograph to one shape:
 * a portrait becomes a square, a wide family group becomes a letterbox. Columns let each image
 * keep the ratio it was taken in, which is the whole of "avoid tiny thumbnails" and the reason
 * the block reads as considered rather than as a contact sheet.
 *
 * NO CLAIM ABOUT WHO IS IN THEM. The brief offers "Echte Familien. Echte Momente. Keine
 * Models." and then says to use it ONLY if every photograph shown is genuinely a client. This
 * component is fed from whatever is in the portfolio table, which nothing here can vouch for,
 * so it does not make the claim. Add it deliberately once the set is confirmed — a studio
 * asserting "no models" over a stock photograph is a worse problem than a missing line.
 */
export default function HomepagePortfolio({
  heading,
  cta,
  limit = 12,
}: {
  heading: string;
  cta: string;
  limit?: number;
}) {
  const { data } = useQuery<PortfolioImageRow[]>({
    queryKey: ['/api/portfolio/images', 'homepage'],
    queryFn: async () => {
      const res = await fetch('/api/portfolio/images');
      if (!res.ok) return [];
      const rows = await res.json();
      return Array.isArray(rows) ? rows : [];
    },
    staleTime: 5 * 60_000,
  });

  const images = (data || []).filter((i) => i?.url).slice(0, limit);

  // A studio whose portfolio is empty gets no section at all, rather than a heading over a
  // blank band promising photographs that are not there.
  if (images.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-gray-50" aria-labelledby="homepage-portfolio-heading">
      <div className="container mx-auto px-4">
        <h2
          id="homepage-portfolio-heading"
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-10 md:mb-12"
        >
          {heading}
        </h2>

        <div className="columns-2 lg:columns-3 xl:columns-4 gap-3 sm:gap-4 [column-fill:_balance]">
          {images.map((img, i) => (
            <img
              key={img.id ?? img.url ?? i}
              src={img.url}
              alt={img.alt || img.title || ''}
              // The first row is above the fold on a phone; everything after it can wait.
              loading={i < 2 ? 'eager' : 'lazy'}
              decoding="async"
              className="mb-3 sm:mb-4 block w-full break-inside-avoid rounded-lg"
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/portfolio/"
            className="inline-flex items-center justify-center rounded-full border border-purple-200 px-7 py-3 text-base font-medium text-purple-700 transition-colors duration-300 hover:border-purple-300 hover:bg-purple-50"
          >
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
