import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE } from '../../config/site';
import { getAlternates } from '../../config/localeRoutes';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  hreflang?: Array<{
    lang: string;
    url: string;
  }>;
}

export function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogImage = `${SITE.url}/og-default.jpg`,
  ogType = 'website',
  noindex = false,
  hreflang = []
}: SEOProps) {
  const siteUrl = SITE.url;
  const location = useLocation();

  // Pages that have a real, reciprocal English URL (config/localeRoutes.ts) get
  // an accurate self-canonical + de/en/x-default hreflang derived from the CURRENT
  // path — so the German and English versions each point to themselves and cross-
  // reference each other correctly.
  const alt = getAlternates(location.pathname);

  const fullCanonical = alt
    ? `${siteUrl}${alt.canonical}`
    : canonical
      ? `${siteUrl}${canonical}`
      : undefined;

  // For unmapped pages, keep the previous safeguard: drop `/en/...` alternates
  // that don't correspond to a real route (they'd be soft-404s), and only emit
  // hreflang when ≥2 valid reciprocal URLs remain.
  const validHreflang = hreflang.filter(
    (l) => l.lang.toLowerCase() !== 'en' && !/^\/en(\/|$)/.test(l.url),
  );
  const hreflangToRender = alt ? alt.hreflang : (validHreflang.length >= 2 ? validHreflang : []);

  // Build the LocalBusiness structured data from the tenant's identity,
  // omitting any fields that aren't configured yet.
  const hasAddress =
    SITE.address.street || SITE.address.city || SITE.address.postalCode || SITE.address.country;
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    image: ogImage,
    '@id': siteUrl,
    url: siteUrl,
    priceRange: '€€',
  };
  if (SITE.phone) structuredData.telephone = SITE.phone;
  if (SITE.email) structuredData.email = SITE.email;
  if (hasAddress) {
    structuredData.address = {
      '@type': 'PostalAddress',
      ...(SITE.address.street ? { streetAddress: SITE.address.street } : {}),
      ...(SITE.address.city ? { addressLocality: SITE.address.city } : {}),
      ...(SITE.address.postalCode ? { postalCode: SITE.address.postalCode } : {}),
      ...(SITE.address.country ? { addressCountry: SITE.address.country } : {}),
    };
  }
  if (SITE.social.length) structuredData.sameAs = SITE.social;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Hreflang for multilingual (only real, reciprocal URLs — see note above) */}
      {hreflangToRender.map((link) => (
        <link
          key={link.lang}
          rel="alternate"
          hrefLang={link.lang}
          href={`${siteUrl}${link.url}`}
        />
      ))}

      {/* Structured Data - Local Business (per-tenant) */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
