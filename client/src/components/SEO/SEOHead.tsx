import { Helmet } from 'react-helmet-async';

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
  ogImage = 'https://www.newagefotografie.com/og-default.jpg',
  ogType = 'website',
  noindex = false,
  hreflang = []
}: SEOProps) {
  const siteUrl = 'https://www.newagefotografie.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined;

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
      <meta property="og:site_name" content="New Age Fotografie" />
      <meta property="og:locale" content="de_AT" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Hreflang for multilingual */}
      {hreflang.map((link) => (
        <link
          key={link.lang}
          rel="alternate"
          hrefLang={link.lang}
          href={`${siteUrl}${link.url}`}
        />
      ))}
      
      {/* Structured Data - Local Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "New Age Fotografie",
          "image": ogImage,
          "@id": siteUrl,
          "url": siteUrl,
          "telephone": "+43 677 633 99210",
          "priceRange": "€€",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Wehrgasse 11A/2+5",
            "addressLocality": "Wien",
            "postalCode": "1050",
            "addressCountry": "AT"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 48.1943,
            "longitude": 16.3541
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            }
          ],
          "sameAs": [
            "https://www.facebook.com/newagefotografie",
            "https://www.instagram.com/newagefotografie"
          ]
        })}
      </script>
    </Helmet>
  );
}
