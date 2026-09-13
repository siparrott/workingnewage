/**
 * THE FAMILY PACKAGES, IN ONE PLACE.
 *
 * These three prices — €95, €195, €225 — and what each includes were written out by hand in
 * FamilienfotosWienPage, and the buyer-journey work needed them on the homepage as well. Two
 * copies of a price is how a studio ends up advertising €195 on one page and €225 for the same
 * package on another, and the brief is explicit that prices and package inclusions must not
 * change. So they are defined once, here, and both pages read them.
 *
 * Transcribed verbatim from FamilienfotosWienPage — same figures, same bullets, same German
 * and English, same cart payloads. Nothing here is a new offer or a rounded number.
 *
 * IF A PRICE CHANGES, IT CHANGES HERE, and both pages follow. That is the entire reason this
 * file exists.
 */

export interface FamilyPackage {
  /** Stable id for keys and for the cart payload. */
  id: 'basic' | 'classic' | 'premium';
  name: string;
  /** What it is displayed as, currency included, exactly as the page has always shown it. */
  displayPrice: string;
  /** The number the cart is given. Must agree with displayPrice. */
  amount: number;
  /** Shown as "Ab €95" / "From €95" — these are starting prices, not fixed ones. */
  from: true;
  /** The one a studio wants chosen. Rendered as BESTSELLER and visually lifted. */
  bestseller?: boolean;
  bullets: { de: string; en: string }[];
  /** Voucher validity line under the bullets. */
  validity: { de: string; en: string };
  /** The description string handed to the cart, unchanged. */
  cartDescription: string;
}

const SHARED_BULLETS = {
  sixtyMinutes: { de: '60 Min Shooting', en: '60 min shooting' },
  privateUse: { de: 'Nutzungsrechte privat', en: 'Private usage rights' },
  twelvePeople: {
    de: 'Bis zu 12 Personen und auch Haustiere möglich',
    en: 'Up to 12 people and pets welcome',
  },
};

const VALIDITY = { de: 'Gültig bis 2 Jahre', en: 'Valid for up to 2 years' };

export const FAMILY_PACKAGES: FamilyPackage[] = [
  {
    id: 'basic',
    name: 'Family Basic',
    displayPrice: '€95',
    amount: 95,
    from: true,
    bullets: [
      SHARED_BULLETS.sixtyMinutes,
      {
        de: '1 retuschiertes Portrait digital + Leinwand 40×30 cm',
        en: '1 retouched portrait digital + canvas 40×30 cm',
      },
      SHARED_BULLETS.privateUse,
      SHARED_BULLETS.twelvePeople,
    ],
    validity: VALIDITY,
    cartDescription: 'Familienfotografie - 60 Min, 1 Portrait + Leinwand 40×30 cm',
  },
  {
    id: 'classic',
    name: 'Family Classic',
    displayPrice: '€195',
    amount: 195,
    from: true,
    bestseller: true,
    bullets: [
      SHARED_BULLETS.sixtyMinutes,
      {
        de: '2 retuschierte Portraits digital + 2x Leinwand 30×40 cm',
        en: '2 retouched portraits digital + 2x canvas 30×40 cm',
      },
      SHARED_BULLETS.privateUse,
      SHARED_BULLETS.twelvePeople,
    ],
    validity: VALIDITY,
    cartDescription: 'Familienfotografie - 60 Min, 2 Portraits + 2x Leinwand 30×40 cm',
  },
  {
    id: 'premium',
    name: 'Family Premium',
    displayPrice: '€225',
    amount: 225,
    from: true,
    bullets: [
      SHARED_BULLETS.sixtyMinutes,
      { de: '5 retuschierte Fotos digital', en: '5 retouched photos digital' },
      { de: 'Leinwand 40×30 cm', en: 'Canvas 40×30 cm' },
      SHARED_BULLETS.privateUse,
      SHARED_BULLETS.twelvePeople,
    ],
    validity: VALIDITY,
    cartDescription: 'Familienfotografie - 60 Min, 5 Fotos + Leinwand 40×30 cm',
  },
];
