import React from 'react';
import { Link } from 'react-router-dom';

export interface ServiceChoice {
  /** Route on this site. Every one is checked against App.tsx before it is listed. */
  href: string;
  title: string;
  /** One line. Not a paragraph — the photograph is doing the arguing. */
  blurb: string;
  image: string;
  alt: string;
  /** "Ab €95". Omitted rather than guessed when a service has no published starting price. */
  from?: string;
  cta: string;
}

/**
 * "Was möchtet ihr festhalten?" — the first question a family can actually answer.
 *
 * WHY THIS SITS DIRECTLY UNDER THE TRUST STRIP. A visitor arrives wanting photographs of their
 * own family, and the page's first move was to talk about the company: an SEO paragraph, three
 * statistics, then thirty years of history. The services were most of a screen further down,
 * mixed in with corporate headshots, event and product photography — so the question "what can
 * I book for us?" was answered late and among things a family did not ask about.
 *
 * FOUR, AND ALL FOUR ARE FAMILY. Business photography is not here on purpose; it interrupts
 * this journey and has a page of its own that carries the whole corporate case. It keeps a
 * small band further down the homepage rather than a quarter of the choice a parent is
 * offered at the top.
 *
 * The price is on the card. "Ab €95" is what the studio already publishes on the pricing page
 * and in its own FAQ for family, baby, maternity and business packages alike — so it is quoted
 * rather than invented, and a card whose service has no published figure simply shows none.
 * Hiding the entry price until a visitor has clicked through is what makes people bounce.
 */
export default function HomepageServiceSelector({
  heading,
  items,
}: {
  heading: string;
  items: ServiceChoice[];
}) {
  if (!items.length) return null;

  return (
    <section className="py-14 md:py-16 bg-white" aria-labelledby="service-choice-heading">
      <div className="container mx-auto px-4">
        <h2
          id="service-choice-heading"
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-10 md:mb-12"
        >
          {heading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              {/* 4:5 and dimensioned. Photographs are the point of these cards, so they get
                  the portrait shape rather than a letterbox — and a declared ratio so the
                  grid does not reflow as four images arrive. */}
              <div className="aspect-[4/5] overflow-hidden bg-gray-50">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={750}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.blurb}</p>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                  {item.from ? (
                    <span className="text-sm font-semibold text-gray-900">{item.from}</span>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  <span className="text-sm font-semibold text-purple-700 group-hover:text-purple-900">
                    {item.cta} <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
