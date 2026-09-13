import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { FAMILY_PACKAGES } from '../../data/familyPackages';

/**
 * What it costs, before the visitor is halfway down the page.
 *
 * The homepage had no prices on it at all. A family had to reach the footer, find Preise, and
 * land on another page before learning that a shoot starts at €95 — and the single most common
 * reason someone leaves a photographer's site is not knowing whether they can afford it.
 *
 * THE FIGURES ARE NOT WRITTEN HERE. They come from data/familyPackages.ts, which is the same
 * source FamilienfotosWienPage reads, because two copies of a price is how a studio ends up
 * advertising two different ones. Changing a price is a one-line edit there and both pages
 * follow.
 *
 * EVERYTHING THAT IS INCLUDED IS SHOWN. The brief is blunt about this — "do not hide what is
 * included", and the visitor should understand the duration, the number of images, the prints
 * and the retouching immediately. All of it is on the card; nothing is behind a click.
 *
 * Links, not buy buttons. The service page owns the cart: it has the add-to-cart handler, the
 * package type and the checkout path already wired. A second buy path on the homepage would be
 * a second thing to keep correct for no gain.
 */
export default function HomepagePricing({
  heading,
  subheading,
  language,
  ctaAll,
  ctaAvailability,
}: {
  heading: string;
  subheading?: string;
  language: string;
  ctaAll: string;
  ctaAvailability: string;
}) {
  const de = language === 'de';

  return (
    <section className="py-14 md:py-20 bg-white" aria-labelledby="homepage-pricing-heading">
      <div className="container mx-auto px-4">
        <h2
          id="homepage-pricing-heading"
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900"
        >
          {heading}
        </h2>
        {subheading && (
          <p className="mt-3 text-center text-gray-600 max-w-2xl mx-auto">{subheading}</p>
        )}

        <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start max-w-5xl mx-auto">
          {FAMILY_PACKAGES.map((p) => {
            const featured = !!p.bestseller;
            return (
              <div
                key={p.id}
                className={
                  featured
                    ? 'relative rounded-2xl p-7 shadow-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white md:-mt-4'
                    : 'relative rounded-2xl p-7 shadow-lg bg-white border border-gray-100'
                }
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-bold tracking-wide text-purple-700 shadow">
                    {de ? 'BELIEBTESTE WAHL' : 'MOST POPULAR'}
                  </span>
                )}

                <h3 className={`text-xl font-bold ${featured ? 'text-white' : 'text-gray-900'}`}>
                  {p.name}
                </h3>

                <div className="mt-3 flex items-baseline">
                  <span className={`text-sm mr-1 ${featured ? 'text-white/80' : 'text-gray-500'}`}>
                    {de ? 'Ab' : 'From'}
                  </span>
                  <span className={`text-4xl font-bold ${featured ? 'text-white' : 'text-purple-600'}`}>
                    {p.displayPrice}
                  </span>
                </div>

                <ul className="mt-6 space-y-3">
                  {p.bullets.map((b) => (
                    <li key={b.en} className="flex items-start">
                      <Check
                        className={`h-5 w-5 mr-3 flex-shrink-0 mt-0.5 ${featured ? 'text-white' : 'text-green-500'}`}
                      />
                      <span className={featured ? 'text-white' : 'text-gray-700'}>
                        {de ? b.de : b.en}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className={`mt-5 text-sm ${featured ? 'text-purple-100' : 'text-gray-400'}`}>
                  {de ? p.validity.de : p.validity.en}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/warteliste/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105"
          >
            {ctaAvailability}
          </Link>
          <Link
            to="/preise/"
            className="inline-flex items-center justify-center rounded-full border border-purple-200 px-7 py-3 text-base font-medium text-purple-700 transition-colors duration-300 hover:border-purple-300 hover:bg-purple-50"
          >
            {ctaAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
