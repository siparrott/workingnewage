import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface RelatedLink {
  href: string;
  label: string;
}

// Site structure: maps each page to its relevant internal links
const SITE_LINKS: Record<string, RelatedLink[]> = {
  // Homepage
  '/': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/schwangerschaftsfotos-wien/', label: 'Schwangerschaftsfotos Wien' },
    { href: '/business-portrait-wien/', label: 'Business Portrait Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/vouchers', label: 'Geschenkgutscheine' },
  ],

  // --- FAMILY CLUSTER ---
  '/familienfotos-wien/': [
    { href: '/familien-fotoshooting-wien/', label: 'Familien-Fotoshooting Wien' },
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/baby-fotografie-wien/', label: 'Baby Fotografie Wien' },
    { href: '/kinder-fotografie-wien/', label: 'Kinderfotografie Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/gutschein/family', label: 'Familien-Gutschein' },
  ],
  '/familien-fotoshooting-wien/': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/kinder-fotografie-wien/', label: 'Kinderfotografie Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/gutschein/family', label: 'Familien-Gutschein' },
  ],
  '/neugeborenenfotos-wien/': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/baby-fotografie-wien/', label: 'Baby Fotografie Wien' },
    { href: '/schwangerschaftsfotos-wien/', label: 'Schwangerschaftsfotos Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/gutschein/newborn', label: 'Neugeborenen-Gutschein' },
  ],
  '/babyfotos-wien/': [
    { href: '/baby-fotografie-wien/', label: 'Baby Fotografie Wien' },
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],
  '/baby-fotografie-wien/': [
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/schwangerschaftsfotos-wien/', label: 'Schwangerschaftsfotos Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/gutschein/newborn', label: 'Neugeborenen-Gutschein' },
  ],
  '/kinder-fotografie-wien/': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/gutschein/family', label: 'Familien-Gutschein' },
  ],
  '/schwangerschaftsfotos-wien/': [
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/baby-fotografie-wien/', label: 'Baby Fotografie Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/gutschein/maternity', label: 'Schwangerschafts-Gutschein' },
  ],

  // --- BUSINESS CLUSTER ---
  '/business-portrait-wien/': [
    { href: '/teamfotos-wien/', label: 'Teamfotos Wien' },
    { href: '/bewerbungsfotos-wien/', label: 'Bewerbungsfotos Wien' },
    { href: '/portrait-fotografie-wien/', label: 'Portraitfotografie Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/kontakt', label: 'Termin anfragen' },
  ],
  '/teamfotos-wien/': [
    { href: '/business-portrait-wien/', label: 'Business Portrait Wien' },
    { href: '/bewerbungsfotos-wien/', label: 'Bewerbungsfotos Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/kontakt', label: 'Termin anfragen' },
  ],
  '/bewerbungsfotos-wien/': [
    { href: '/business-portrait-wien/', label: 'Business Portrait Wien' },
    { href: '/portrait-fotografie-wien/', label: 'Portraitfotografie Wien' },
    { href: '/teamfotos-wien/', label: 'Teamfotos Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],
  '/portrait-fotografie-wien/': [
    { href: '/business-portrait-wien/', label: 'Business Portrait Wien' },
    { href: '/bewerbungsfotos-wien/', label: 'Bewerbungsfotos Wien' },
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],

  // --- EVENT / WEDDING CLUSTER ---
  '/eventfotografie-wien/': [
    { href: '/hochzeitsfotografie-wien/', label: 'Hochzeitsfotografie Wien' },
    { href: '/business-portrait-wien/', label: 'Business Portrait Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/kontakt', label: 'Termin anfragen' },
  ],
  '/hochzeitsfotografie-wien/': [
    { href: '/eventfotografie-wien/', label: 'Eventfotografie Wien' },
    { href: '/portrait-fotografie-wien/', label: 'Portraitfotografie Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/kontakt', label: 'Termin anfragen' },
  ],
  '/fotoshootings/wedding': [
    { href: '/hochzeitsfotografie-wien/', label: 'Hochzeitsfotografie Wien' },
    { href: '/eventfotografie-wien/', label: 'Eventfotografie Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],
  '/fotoshootings/event': [
    { href: '/eventfotografie-wien/', label: 'Eventfotografie Wien' },
    { href: '/hochzeitsfotografie-wien/', label: 'Hochzeitsfotografie Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],
  '/fotoshootings/business': [
    { href: '/business-portrait-wien/', label: 'Business Portrait Wien' },
    { href: '/teamfotos-wien/', label: 'Teamfotos Wien' },
    { href: '/bewerbungsfotos-wien/', label: 'Bewerbungsfotos Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],

  // --- PRODUCT / STUDIO ---
  '/produkt-fotografie-wien/': [
    { href: '/studio-fotografie-wien/', label: 'Studio-Fotografie Wien' },
    { href: '/immobilien-fotografie-wien/', label: 'Immobilienfotografie Wien' },
    { href: '/business-portrait-wien/', label: 'Business Portrait Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/kontakt', label: 'Termin anfragen' },
  ],
  '/immobilien-fotografie-wien/': [
    { href: '/produkt-fotografie-wien/', label: 'Produktfotografie Wien' },
    { href: '/studio-fotografie-wien/', label: 'Studio-Fotografie Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/kontakt', label: 'Termin anfragen' },
  ],
  '/studio-fotografie-wien/': [
    { href: '/portrait-fotografie-wien/', label: 'Portraitfotografie Wien' },
    { href: '/business-portrait-wien/', label: 'Business Portrait Wien' },
    { href: '/produkt-fotografie-wien/', label: 'Produktfotografie Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],

  // --- FOTOSHOOTINGS HUB ---
  '/fotoshootings': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/schwangerschaftsfotos-wien/', label: 'Schwangerschaftsfotos Wien' },
    { href: '/business-portrait-wien/', label: 'Business Portrait Wien' },
    { href: '/hochzeitsfotografie-wien/', label: 'Hochzeitsfotografie Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],

  // --- SUPPORT / INFO ---
  '/preise/': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/business-portrait-wien/', label: 'Business Portrait Wien' },
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/vouchers', label: 'Geschenkgutscheine' },
    { href: '/kontakt', label: 'Termin anfragen' },
  ],
  '/kundenstimmen/': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/kontakt', label: 'Termin anfragen' },
  ],
  '/ueber-uns/': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/kundenstimmen/', label: 'Kundenstimmen' },
    { href: '/kontakt', label: 'Termin anfragen' },
  ],
  '/portfolio': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/hochzeitsfotografie-wien/', label: 'Hochzeitsfotografie Wien' },
    { href: '/business-portrait-wien/', label: 'Business Portrait Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],
  '/kontakt': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/vouchers', label: 'Geschenkgutscheine' },
    { href: '/warteliste', label: 'Warteliste' },
  ],
  '/warteliste': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/kontakt', label: 'Kontakt' },
  ],
  '/faq/': [
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/kontakt', label: 'Termin anfragen' },
    { href: '/kundenstimmen/', label: 'Kundenstimmen' },
  ],
  '/galleries': [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/kontakt', label: 'Termin anfragen' },
  ],

  // --- VOUCHERS / GUTSCHEINE ---
  '/vouchers': [
    { href: '/gutschein/family', label: 'Familien-Gutschein' },
    { href: '/gutschein/newborn', label: 'Neugeborenen-Gutschein' },
    { href: '/gutschein/maternity', label: 'Schwangerschafts-Gutschein' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
  ],
  '/gutschein': [
    { href: '/gutschein/family', label: 'Familien-Gutschein' },
    { href: '/gutschein/newborn', label: 'Neugeborenen-Gutschein' },
    { href: '/gutschein/maternity', label: 'Schwangerschafts-Gutschein' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],
  '/gutschein/family': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/gutschein/newborn', label: 'Neugeborenen-Gutschein' },
    { href: '/vouchers', label: 'Alle Gutscheine' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],
  '/gutschein/newborn': [
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/gutschein/family', label: 'Familien-Gutschein' },
    { href: '/gutschein/maternity', label: 'Schwangerschafts-Gutschein' },
    { href: '/vouchers', label: 'Alle Gutscheine' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],
  '/gutschein/maternity': [
    { href: '/schwangerschaftsfotos-wien/', label: 'Schwangerschaftsfotos Wien' },
    { href: '/gutschein/newborn', label: 'Neugeborenen-Gutschein' },
    { href: '/gutschein/family', label: 'Familien-Gutschein' },
    { href: '/vouchers', label: 'Alle Gutscheine' },
    { href: '/preise/', label: 'Preise & Pakete' },
  ],

  // --- CALCULATOR ---
  '/calculator': [
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/business-portrait-wien/', label: 'Business Portrait Wien' },
    { href: '/kontakt', label: 'Termin anfragen' },
  ],

  // --- BLOG ---
  '/blog': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/neugeborenenfotos-wien/', label: 'Neugeborenenfotos Wien' },
    { href: '/preise/', label: 'Preise & Pakete' },
    { href: '/kontakt', label: 'Termin anfragen' },
  ],

  // --- LEGAL ---
  '/model-release/': [
    { href: '/familienfotos-wien/', label: 'Familienfotos Wien' },
    { href: '/ueber-uns/', label: 'Über uns' },
    { href: '/kontakt', label: 'Kontakt' },
  ],
};

// Pages to skip (no related section needed)
const SKIP_PATHS = new Set([
  '/admin', '/checkout', '/cart', '/order-complete',
  '/vouchers/success', '/voucher/thank-you',
  '/impressum/', '/agb/', '/datenschutz/',
  '/account', '/my-archive', '/galleries/', '/gallery/',
]);

const RelatedPages: React.FC = () => {
  const { pathname } = useLocation();

  // Skip admin and transactional pages
  if (SKIP_PATHS.has(pathname) || pathname.startsWith('/admin') || pathname.startsWith('/checkout') || pathname.startsWith('/gallery/') || pathname.startsWith('/invoice/')) {
    return null;
  }

  // Find matching links — try exact match, then strip trailing slash
  const links = SITE_LINKS[pathname]
    || SITE_LINKS[pathname.replace(/\/$/, '')]
    || SITE_LINKS[pathname + '/'];

  if (!links || links.length === 0) return null;

  // Filter out current page
  const filtered = links.filter(l => l.href !== pathname && l.href !== pathname + '/' && l.href + '/' !== pathname);

  if (filtered.length === 0) return null;

  return (
    <section className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Weitere Leistungen
        </h2>
        <ul className="flex flex-wrap gap-3">
          {filtered.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="inline-block px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-50 hover:border-purple-400 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RelatedPages;
