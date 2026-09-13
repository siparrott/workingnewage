import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import ZoomableImageV2 from '../components/ui/ZoomableImageV2';
import CountUp from 'react-countup';
import { Check } from 'lucide-react';
import { proxyImage } from '../lib/imageProxy';
import photoGridImage from '../assets/photo-grid.jpg';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useManualPageContent } from '../hooks/useManualPageContent';
import { SEOHead } from '../components/SEO/SEOHead';
import { Helmet } from 'react-helmet-async';
import { getCachedData, setCachedData } from '../lib/persistentCache';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { useGoogleReviews } from '../hooks/useGoogleReviews';
import HomepageConfidenceSection from '../components/home/HomepageConfidenceSection';
import CareerStorySection from '../components/home/CareerStorySection';
import HomepageServiceSelector from '../components/home/HomepageServiceSelector';
import HomepagePortfolio from '../components/home/HomepagePortfolio';
import { SITE } from '../config/site';

// Translation mappings for German product names and descriptions
const productNameTranslations: Record<string, string> = {
  'Hochzeitsfotografie Basic': 'Wedding Photography Basic',
  'Hochzeitsfotografie Premium': 'Wedding Photography Premium',
  'Hochzeit Basic': 'Wedding Basic',
  'Hochzeit Premium': 'Wedding Premium',
  'Immobilienfotografie': 'Real Estate Photography',
  'Immobilien Basic': 'Real Estate Basic',
  'Immobilien Premium': 'Real Estate Premium',
  'Produktfotografie': 'Product Photography',
  'Studio-Fotografie Basic': 'Studio Photography Basic',
  'Portraitfotografie Basic': 'Portrait Photography Basic',
  'Portrait Einzelperson': 'Individual Portrait',
  'Bewerbungsfotos & LinkedIn': 'Application Photos & LinkedIn',
  'Team & Mitarbeiterfotos': 'Team & Employee Photos',
  'Eventfotografie': 'Event Photography',
  'Familie Fotoshootings': 'Family Photo Session',
  'Shooting Experience Gutschein': 'Shooting Experience Voucher',
};

const productDescriptionTranslations: Record<string, string> = {
  // Family products
  '60 Min Shooting; 1 retuschiertes Portrait digital + Leinwand 40×30 cm; Auswahlgalerie online; Nutzungsrechte privat': 
    '60 Min Shooting; 1 retouched portrait digital + Canvas 40×30 cm; Online gallery; Private usage rights',
  '60 Min Shooting; 2 retuschiertes Portrait digital + 2x Leinwand 30×40 cm; Auswahlgalerie online; Nutzungsrechte privat': 
    '60 Min Shooting; 2 retouched portraits digital + 2x Canvas 30×40 cm; Online gallery; Private usage rights',
  '60 Min Shooting; 5 retuschierte Fotos digital; Leinwand 40×30 cm; Auswahlgalerie & Nutzungsrechte privat':
    '60 Min Shooting; 5 retouched photos digital; Canvas 40×30 cm; Online gallery & Private usage rights',
  // Wedding
  'Hochzeitsbegleitung (Auszug) inkl. 30 bearbeiteter Fotos': 
    'Wedding coverage (excerpt) incl. 30 edited photos',
  'Standesamt oder kleine Feier inkl. alle Portraits als Datei - Halber Tag, Stunden nach Wunsch\n':
    'Registry office or small celebration incl. all portraits as file - Half day, hours as desired',
  'Ganztägige Hochzeit - inkl. alle Bilder, Online-Galerie, Prints und Leinwand-Collage als Geschenk (Porträts nach Wahl)':
    'Full day wedding - incl. all images, online gallery, prints and canvas collage as gift (portraits of your choice)',
  // Real Estate
  'Immobilienfotos Paket für Wohnungen & Häuser — Innen und Exterieur. Alle Bilder in Vollauflösung dabei, 360°-Bilder, Google Maps-Update\n':
    'Real estate photo package for apartments & houses — Interior and exterior. All images in full resolution, 360° images, Google Maps update',
  'Kleine Wohnungen & Studios inkl. alle Bilder als Datei':
    'Small apartments & studios incl. all images as file',
  'Wohnungen & Häuser  alle Bilder als Datei, Interaktiver Video-Rundgang und professionell gezeichneter Grundriss':
    'Apartments & houses all images as file, interactive video tour and professionally drawn floor plan',
  // Portrait/Business
  'Portraitsession im Studio; 30-45 Minuten; 1 retuschiertes Foto':
    'Portrait session in studio; 30-45 minutes; 1 retouched photo',
  'Bewerbungsfotos Paket inkl. 2 retuschierte Bilder für Bewerbungen & LinkedIn':
    'Application photos package incl. 2 retouched images for applications & LinkedIn',
  'Team- & Mitarbeiterfotos; Paketpreise by headcount; In-Studio or Onsite options z.B:. 50€ pro Kopf mit alle Portäts als Datei dazu.':
    'Team & employee photos; Package prices by headcount; In-studio or onsite options e.g.: €50 per person with all portraits as files',
  'Studio-Miete inkl. Fotosession; perfekte Option für Produkt- oder Portraitaufnahmen':
    'Studio rental incl. photo session; perfect option for product or portrait shots',
  'Produktfotografie Basic — 5 retuschierte Bilder, ideal für Shops & Social':
    'Product Photography Basic — 5 retouched images, ideal for shops & social media',
  'Business-Headshot; 30 Minuten; 1 retuschiertes Foto suitable for LinkedIn':
    'Business headshot; 30 minutes; 1 retouched photo suitable for LinkedIn',
  'Klassisches Porträt - 5x Portäts nach Wahl':
    'Classic portrait - 5x portraits of your choice',
  // Business packages
  'Schnell & effizient inkl. x2 Bilder nach Wahl als Datei ':
    'Quick & efficient incl. 2 images of your choice as file',
  'Für Professionals inkl. alle Bilder als Datei ':
    'For professionals incl. all images as file',
  'Maximale Wirkung für deine Produkte und deine Marke.\n\nInklusive 10 hochauflösender High-Impact-Fotos deiner Wahl – mit kommerziellen Nutzungsrechten für unbegrenzte Drucke und uneingeschränkte Online-Nutzung.':
    'Maximum impact for your products and brand.\n\nIncluding 10 high-resolution high-impact photos of your choice – with commercial usage rights for unlimited prints and unrestricted online use.',
  // Event
  'Eventfotografie Paket — Kurzauftrag inkl. 30 bearbeiteter Fotos':
    'Event photography package — Short assignment incl. 30 edited photos',
  'Ganztägige Event-Coverage - inkl. alle Bilder als Datei, in Vollauflösung geliefert':
    'Full day event coverage - incl. all images as file, delivered in full resolution',
  // Newborn
  'ca. 60 Minuten im Studio; 5 retuschierte Lieblingsfotos digital; Leinwand 40×30 cm; 2–3 Sets (Wraps + Detail-Makros)':
    'approx. 60 minutes in studio; 5 retouched favorite photos digital; Canvas 40×30 cm; 2-3 sets (wraps + detail macros)',
};

// Helper function to translate product text
const translateProductText = (text: string, translations: Record<string, string>, language: string): string => {
  if (language === 'de') return text; // Keep German as-is
  return translations[text] || text; // Return translation or original
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  
  // Use manual page content hook - allows admin to override any content
  const t = useManualPageContent('home');

  // Fetch homepage images from API with persistent cache
  const { data: homepageImages, isLoading: isLoadingImages } = useQuery({
    queryKey: ['/api/homepage/images'],
    queryFn: async () => {
      const endpoints = ['/api/homepage/images', `${SITE.url}/api/homepage/images`];
      let data: any[] | null = null;

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint);
          if (!res.ok) continue;
          data = await res.json();
          break;
        } catch {
          // Try the next source.
        }
      }

      if (!data) throw new Error('Failed to fetch homepage images');
      // Cache the response for 24 hours
      setCachedData('homepage-images', data);
      return data;
    },
    // Use cached data as initial data to prevent flashing.
    // NOTE: key must match the setCachedData('homepage-images', ...) write above —
    // a previous mismatch meant the cache was never reused, so every load waited
    // on the network before image URLs were known.
    initialData: () => getCachedData('homepage-images', 1000 * 60 * 60 * 24), // 24 hour cache
    // Keep data fresh but allow brief caching to prevent flash
    staleTime: 1000 * 60 * 5, // 5 minutes - images don't change that often
    cacheTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Utility: resolve image URL by section with local fallback
  // Homepage photos were served as full-resolution originals (multi-MB), which
  // is why the grid took seconds to appear. Serve a right-sized WebP instead.
  const imageForSection = (section: string, fallback?: string, width = 800) => {
    const hit = (homepageImages as any[])?.find((img: any) => img.section === section);
    const url = (hit && (hit.url as string)) || fallback || photoGridImage;
    return proxyImage(url, { w: width });
  };

  const heroImageUrl = useMemo(() => {
    return imageForSection('hero', undefined);
  }, [homepageImages]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  // Fetch voucher products from API with persistent cache
  const { data: apiProducts } = useQuery({
    queryKey: ['/api/vouchers/products', 'home-v3'],
    queryFn: async () => {
      console.log('🏠 [HomePage] Fetching fresh voucher data...');
      const res = await fetch('/api/vouchers/products?_t=' + Date.now());
      if (!res.ok) throw new Error('Failed to fetch vouchers');
      const data = await res.json();
      console.log('🏠 [HomePage] Loaded', data.length, 'vouchers');
      return data;
    },
    // Short staleTime instead of always-refetch: a repeat visitor within the
    // window reuses the cached data (faster LCP, less jitter) while newly
    // uploaded images still appear within a minute.
    staleTime: 1000 * 60, // 1 minute
    cacheTime: 1000 * 60 * 5, // Keep in memory for 5 minutes
    refetchOnMount: true, // Refetch only when stale
    refetchOnWindowFocus: false, // Don't refetch on window focus for homepage
  });

  // Fallback voucher products - NO PLACEHOLDER IMAGES
  const defaultVouchers = [
    {
      id: 'pregnancy-shooting',
      name: t('home.pregnancyShootingTitle'),
      description: t('home.pregnancyShootingDescription'),
      originalPrice: 195,
      price: 95,
      image: '', // Removed placeholder - use actual uploaded images
      category: 'pregnancy',
      route: '/gutschein/maternity'
    },
    {
      id: 'family-shooting',
      name: t('home.familyShootingTitle'),
      description: t('home.familyShootingDescription'),
      originalPrice: 295,
      price: 95,
      image: '', // Removed placeholder - use actual uploaded images
      category: 'family',
      route: '/gutschein/family'
    },
    {
      id: 'newborn-shooting',
      name: t('home.newbornShootingTitle'),
      description: t('home.newbornShootingDescription'),
      originalPrice: 395,
      price: 95,
      image: '', // Removed placeholder - use actual uploaded images
      category: 'newborn',
      route: '/gutschein/newborn'
    }
  ];

  // Transform API products or use fallback
  const voucherProducts = useMemo(() => {
    if (apiProducts && Array.isArray(apiProducts) && apiProducts.length > 0) {
      // Map API products, then exclude newborn/baby products from homepage
      const mapped = apiProducts
        .filter((p: any) => p.isActive !== false && p.is_active !== false)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: parseFloat(p.price) || 0,
          originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : parseFloat(p.price) * 1.3,
          image: p.thumbnailUrl || p.imageUrl || '', // NO PLACEHOLDER - use empty string
          category: p.category || 'family',
          route: `/gutschein/${p.slug || p.id}`
        }))
        .filter((p: any) => {
          const s = `${p.category} ${p.id} ${p.name}`.toString().toLowerCase();
          // exclude newborn/baby related items (English + German terms)
          return !(/newborn|neugeboren|neugeborenen|neugeborenes|baby/i.test(s));
        });

      // If we have fewer than 3 after filtering, fill from defaults (also excluding newborns)
      let final = mapped.slice(0, 3);
      if (final.length < 3) {
        const defaultsFiltered = defaultVouchers.filter((d) => {
          const s = `${d.category} ${d.id} ${d.name}`.toString().toLowerCase();
          return !(/newborn|neugeboren|neugeborenen|neugeborenes|baby/i.test(s));
        });
        final = [...final, ...defaultsFiltered].slice(0, 3);
      }

      // Ensure the family package is featured in the middle (index 1) when present
      if (final.length >= 2) {
        const familyIdx = final.findIndex((p: any) => {
          const s = `${p.category} ${p.id} ${p.name}`.toString().toLowerCase();
          return /family|familien|familie/.test(s);
        });
        if (familyIdx > -1 && familyIdx !== 1) {
          const [fam] = final.splice(familyIdx, 1);
          final.splice(1, 0, fam);
        }
      }

      return final;
    }
    return defaultVouchers;
  }, [apiProducts, t]);

  // Preload all images to prevent flashing
  const imageUrlsToPreload = useMemo(() => {
    const urls: string[] = [];

    // IMPORTANT: preload the SAME resized URLs the page renders. This used to
    // push the full-resolution originals, so every homepage + voucher photo was
    // downloaded at full size on load — the reason the photo grid took seconds
    // to appear. Preloading a different URL than the one rendered is pure waste.
    if (homepageImages && Array.isArray(homepageImages)) {
      homepageImages.forEach((img: any) => {
        if (img?.url) urls.push(proxyImage(img.url, { w: 800 }));
      });
    }

    // Voucher thumbnails are small on screen — request them small too.
    if (voucherProducts && Array.isArray(voucherProducts)) {
      voucherProducts.forEach((product: any) => {
        if (product?.thumbnailUrl) urls.push(proxyImage(product.thumbnailUrl, { w: 500 }));
        else if (product?.image) urls.push(proxyImage(product.image, { w: 500 }));
      });
    }

    return urls;
  }, [homepageImages, voucherProducts]);
  
  useImagePreloader(imageUrlsToPreload);

  // Google reviews are rendered site-wide by <GoogleReviews /> in Layout, so the
  // homepage no longer keeps its own inline testimonials list. We still read the
  // live rating/count here so the LocalBusiness aggregateRating in structured
  // data stays in sync with the number shown in the reviews widget (instead of a
  // hardcoded value that silently drifts from Google).
  const { data: liveGoogle } = useGoogleReviews();
  const ratingValue = (liveGoogle?.rating ?? 4.8).toFixed(1);
  const reviewCount = String(liveGoogle?.count ?? 306);

  /**
   * Does this visitor want motion at all?
   *
   * The counting numbers in the trust strip are decoration on top of three facts. Somebody who
   * has asked their operating system not to animate things has asked for a reason, and the
   * figures read perfectly well without it — so they are rendered plainly rather than animated
   * more slowly. Read once: the preference does not change mid-visit in any way that matters
   * here, and re-rendering the strip on a media-query event would restart the count.
   */
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const formatStat = (n: number) => n.toLocaleString(language === 'de' ? 'de-AT' : 'en-GB');

  const faqImages =
    (homepageImages &&
      (homepageImages as any[])
        .filter((img: any) => img.section === 'faq')
        .map((i: any) => ({
          title: i.title || '',
          image: i.url,
          alt: i.alt || i.title || 'Image',
        }))) || [
      { title: t('home.faqQuestion1'), image: photoGridImage, alt: 'Image' },
      { title: t('home.faqQuestion2'), image: photoGridImage, alt: 'Image' },
      { title: t('home.faqQuestion3'), image: photoGridImage, alt: 'Image' },
      { title: t('home.faqQuestion4'), image: photoGridImage, alt: 'Image' },
      { title: t('home.faqQuestion5'), image: photoGridImage, alt: 'Image' },
      { title: t('home.faqQuestion6'), image: photoGridImage, alt: 'Image' },
    ];

  return (
    <Layout>
      <SEOHead
        title={`Familienfotograf Wien | ${SITE.name}`}
        description="Ihr professioneller Familienfotograf in Wien: Familien-, Baby-, Neugeborenen-, Schwangerschafts- und Businessfotos im Studio. Über 27.000 Familien fotografiert. Jetzt Termin buchen!"
        keywords="Fotograf Wien, Familienfotograf Wien, Babyfotograf Wien, Neugeborenenfotograf Wien, Businessfotografie Wien, Fotostudio Wien"
        canonical="/"
        ogImage={heroImageUrl || undefined}
        hreflang={[
          { lang: 'de', url: '/' },
          { lang: 'en', url: '/en/' }
        ]}
      />

      {/* JSON-LD Structured Data for LocalBusiness */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `${SITE.url}/#business`,
            name: SITE.name,
            image: heroImageUrl || 'https://example.com/placeholder.jpg',
            description: 'Professioneller Familienfotograf in Wien. Spezialisiert auf Familienfotos, Schwangerschaftsfotos, Neugeborenenfotos und Business Portraits.',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Wehrgasse 11A/2+5',
              addressLocality: 'Wien',
              postalCode: '1050',
              addressCountry: 'AT'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 48.191130,
              longitude: 16.356010
            },
            url: SITE.url,
            telephone: '+43 677 63399210',
            priceRange: '€€',
            // Open by appointment (incl. weekends) — no fixed opening hours,
            // so we intentionally omit openingHours rather than claim wrong ones.
            areaServed: {
              '@type': 'City',
              name: 'Wien'
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Fotografie Services',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Familienfotografie',
                    description: 'Professionelle Familienportraits im Studio oder Outdoor'
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Schwangerschaftsfotografie',
                    description: 'Babybauch Fotoshootings in Wien'
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Neugeborenenfotos',
                    description: 'Professionelle Babyfotografie für Neugeborene'
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Business Portraits',
                    description: 'Professionelle Businessfotografie und Headshots'
                  }
                }
              ]
            },
            // Verified profiles — helps Google's Knowledge Graph connect and
            // trust the business entity across platforms.
            sameAs: [
              'https://www.facebook.com/NewAgeFotografie',
              'https://www.instagram.com/newagefotografie/',
              'https://www.linkedin.com/in/simon-parrott-192b5867/',
              'https://maps.app.goo.gl/L5EFKkMSK7FaiRVa8'
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue,
              reviewCount,
              bestRating: '5',
              worstRating: '1'
            }
          })}
        </script>

        {/* FAQPage schema – mirrors visible FAQ content in HomepageConfidenceSection */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              // Kept in step with the `worries` array in HomepageConfidenceSection. A question
              // added there and not here is structured data that no longer matches the page.
              'faq.worry1', 'faq.worry2', 'faq.worry3', 'faq.worry4', 'faq.worry5', 'faq.worry6',
              'faq.worry7', 'faq.worry8', 'faq.worry9',
              'faq.clarity1', 'faq.clarity2', 'faq.clarity3'
            ]
              .map((base) => {
                const q = t(`${base}.q`);
                const a = t(`${base}.full`);
                if (!q || q === `${base}.q` || !a || a === `${base}.full`) return null;
                return {
                  '@type': 'Question',
                  name: q,
                  acceptedAnswer: { '@type': 'Answer', text: a }
                };
              })
              .filter(Boolean)
          })}
        </script>

        {/* BreadcrumbList schema – root homepage */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` }
            ]
          })}
        </script>
      </Helmet>

      {/*
        THE ORDER OF THIS PAGE IS THE BUYER JOURNEY, AND IT IS DELIBERATE.

        It used to open: hero, a paragraph of SEO copy, the statistics, then thirty years of
        company history — three screens about us before a single word about what a family can
        book. The reviewer's summary of the problem was exact: it read as "here is everything
        New Age Fotografie does" rather than "I want photographs of my family".

        So: interest, trust, what you can book, our work, reassurance, where we are — and the
        history, the vouchers and the long-form SEO copy after all of that. None of it is
        deleted; it is sequenced. A visitor who wants the company story still reaches it, and
        the copy that ranks is still on the page.

        Phase 2 inserts the service selector, the portfolio grid and the objections accordion;
        phase 3 the pricing cards and the family-specific reviews. The slots are marked below.
      */}

      {/*
        HERO — ONE PHOTOGRAPH, NOT A CONTACT SHEET.

        The brief: "The hero should immediately communicate emotional quality rather than
        portfolio quantity." The old hero did the opposite — a small square showing a GRID of
        thumbnails, which is a photographer telling you how much they shoot rather than showing
        you one photograph worth booking for. The image is now the larger half of the row and
        set in portrait, which is the shape a family portrait actually is.

        THE ROTATING HEADLINE IS GONE. A looping typewriter cycling four value propositions is
        the single loudest thing on the page and it competes directly with the photograph next
        to it — "no gimmicky animation that distracts from photography". Its four strings are
        still in the translation file, so putting it back is one edit if that call is wrong.

        The h1 also comes FIRST now. It used to sit below the animated span, so the first thing
        a screen reader and a crawler met was a JS-driven decoration rather than
        "Professioneller Familienfotograf in Wien". The string itself is untouched.

        CTAs are "Preise ansehen" and "Fotos ansehen". Booking is deliberately not the hero
        action: a cold visitor is not ready to commit, and the next small step converts better
        than the big one.
      */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
          <div className="md:col-span-5">
            <p className="mb-3 leading-tight text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              {t('home.heroTitle')}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-[1.15]">
              {language === 'de' ? 'Professioneller Familienfotograf in Wien – Studio & Outdoor' : 'Professional Family Photographer in Vienna – Studio & Outdoor'}
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mt-4 leading-relaxed">
              {t('home.heroDescription')}
            </p>

            {/* Proof, before the ask. The rating is the LIVE one already fetched for the
                JSON-LD on this page — never a number typed into the markup, so it cannot
                drift from what Google actually shows. */}
            <div className="mt-6 space-y-1">
              <p className="flex items-center gap-2 text-sm sm:text-base text-gray-800">
                <span aria-hidden="true" className="text-amber-500 tracking-tight">★★★★★</span>
                <span className="font-semibold">
                  {language === 'de' ? `${ratingValue.replace('.', ',')} bei Google` : `${ratingValue} on Google`}
                </span>
                <span className="text-gray-500">
                  {language === 'de' ? `(${reviewCount} Bewertungen)` : `(${reviewCount} reviews)`}
                </span>
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {language === 'de'
                  ? 'Seit 2012 in Wien · Fast 30 Jahre Erfahrung'
                  : 'In Vienna since 2012 · Nearly 30 years of experience'}
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                to="/preise/"
                className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {language === 'de' ? 'Preise ansehen' : 'See prices'}
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center rounded-full border border-purple-200 px-6 py-3 text-lg font-medium text-purple-700 transition-colors duration-300 hover:border-purple-300 hover:bg-purple-50"
              >
                {language === 'de' ? 'Fotos ansehen' : 'See photographs'}
              </Link>
            </div>
          </div>

          <div className="md:col-span-7">
            {/* 4:5, the shape a family portrait is taken in, and dimensions declared so the
                row does not jump when it loads. priority is kept: this is the LCP element. */}
            <div className="aspect-[4/5] sm:aspect-[5/4] md:aspect-[4/5] max-w-xl md:max-w-none mx-auto overflow-hidden rounded-2xl shadow-xl">
              <ZoomableImageV2
                src={heroImageUrl || photoGridImage}
                alt={language === 'de'
                  ? 'Familienporträt aus dem Fotostudio in Wien'
                  : 'Family portrait from the Vienna photography studio'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback for mobile/loading issues
                  e.currentTarget.src = photoGridImage;
                }}
                priority={true}
                width={900}
                height={1125}
              />
            </div>
          </div>
        </div>
      </section>

      {/*
        TRUST STRIP — a band directly under the hero, not a chapter of its own.

        The figures and the gradient are unchanged; both were explicitly to be kept. What
        changed is the weight: py-16 top and bottom made three numbers occupy as much of the
        page as a whole section, which is what made the homepage read as a tour rather than a
        route. It now sits tight under the hero and is over in one glance.

        The count runs ONCE, when the strip is scrolled to, rather than on mount where it is
        usually finished before anyone has seen it — and not at all for a visitor who has asked
        for reduced motion, who gets the same three facts as plain text.
      */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-8 md:py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            {[
              { value: 27156, label: t('home.happyFamilies') },
              { value: 5431977, label: t('home.portraitsCaptured') },
              { value: 27, label: t('home.yearsExperience') },
            ].map((stat) => (
              <div key={stat.label} className="text-white">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 tabular-nums">
                  {prefersReducedMotion ? (
                    formatStat(stat.value)
                  ) : (
                    <CountUp end={stat.value} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />
                  )}
                </div>
                <div className="text-sm sm:text-base md:text-lg text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The first question a family can answer: what do you want photographed? */}
      <HomepageServiceSelector
        heading={language === 'de' ? 'Was möchtet ihr festhalten?' : 'What would you like to capture?'}
        items={[
          {
            href: '/familien-fotoshooting-wien/',
            title: language === 'de' ? 'Familienfotos' : 'Family photography',
            blurb: language === 'de'
              ? 'Natürlich, lebendig und ohne steifes Posieren.'
              : 'Natural, lively, and without stiff posing.',
            image: imageForSection('services-family', photoGridImage),
            alt: language === 'de'
              ? 'Familienfotoshooting in Wien'
              : 'Family photo session in Vienna',
            from: language === 'de' ? 'Ab €95' : 'From €95',
            cta: language === 'de' ? 'Mehr erfahren' : 'Find out more',
          },
          {
            href: '/baby-fotografie-wien/',
            title: language === 'de' ? 'Neugeborene' : 'Newborns',
            blurb: language === 'de'
              ? 'Die ersten Tage, ruhig und in eurem Tempo.'
              : 'The first days, calm and at your pace.',
            image: imageForSection('services-newborn', photoGridImage),
            alt: language === 'de'
              ? 'Neugeborenenfotografie in Wien'
              : 'Newborn photography in Vienna',
            from: language === 'de' ? 'Ab €95' : 'From €95',
            cta: language === 'de' ? 'Mehr erfahren' : 'Find out more',
          },
          {
            href: '/schwangerschaftsfotos-wien/',
            title: language === 'de' ? 'Babybauch' : 'Maternity',
            blurb: language === 'de'
              ? 'Ein Kapitel, das schneller vorbei ist als gedacht.'
              : 'A chapter that passes faster than you expect.',
            image: imageForSection('services-pregnancy', photoGridImage),
            alt: language === 'de'
              ? 'Babybauchfotos in Wien'
              : 'Maternity photography in Vienna',
            from: language === 'de' ? 'Ab €95' : 'From €95',
            cta: language === 'de' ? 'Mehr erfahren' : 'Find out more',
          },
          {
            href: '/babyfotos-wien/',
            title: language === 'de' ? 'Babys & Kinder' : 'Babies & children',
            blurb: language === 'de'
              ? 'Vom ersten Lächeln bis zum ersten Schultag.'
              : 'From the first smile to the first school day.',
            image: imageForSection('services-family', photoGridImage),
            alt: language === 'de'
              ? 'Baby- und Kinderfotografie in Wien'
              : 'Baby and child photography in Vienna',
            from: language === 'de' ? 'Ab €95' : 'From €95',
            cta: language === 'de' ? 'Mehr erfahren' : 'Find out more',
          },
        ]}
      />


      {/* The work itself — the argument a photographer's homepage is actually making. */}
      <HomepagePortfolio
        heading={language === 'de' ? 'So könnten eure Familienfotos aussehen' : 'What your family photographs could look like'}
        cta={language === 'de' ? 'Mehr Familienfotos ansehen' : 'See more family photographs'}
      />

      {/* PHASE 3 — pricing cards, then family-specific reviews, go here. */}

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* First Content Block */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="md:w-1/3">
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <ZoomableImageV2 
                  src={imageForSection('content-1', photoGridImage)}
                  alt="Familienfotografie Wien - Professionelle Familienporträts im Studio"
                  className="w-full h-full object-cover"
                  priority={true}
                  width={400}
                  height={400}
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-4">
                {t('home.pregnancyAndFamilyTitle')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('home.pregnancyDescription1')}
              </p>
              <p className="text-gray-700 mb-4">
                {t('home.pregnancyDescription2')}
              </p>
              <p className="text-gray-700">
                {t('home.pregnancyDescription3')}
              </p>
            </div>
          </div>

          {/* Second Content Block */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/3">
              <div className="aspect-square max-w-sm mx-auto overflow-hidden rounded-lg shadow-lg">
                <ZoomableImageV2
                  src={imageForSection('content-2', 'https://i.postimg.cc/RZjf8FsX/Whats-App-Image-2025-05-24-at-2-38-45-PM-1.jpg')}
                  alt="Business Headshots Wien - Professionelle Businessfotografie im Studio"
                  className="w-full h-full object-cover object-top"
                  priority={true}
                  width={400}
                  height={400}
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-4">
                {t('home.businessHeadshotsTitle')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('home.businessDescription1')}
              </p>
              <p className="text-gray-700 mb-4">
                {t('home.businessDescription2')}
              </p>
              <p className="text-gray-700">
                {t('home.businessDescription3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Confidence Section */}
      <HomepageConfidenceSection />

      {/* Additive geo signal block – "Ihr Fotostudio in Wien" */}
      <section className="py-12 bg-purple-50/30 border-t border-gray-100" aria-labelledby="studio-geo-heading">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 id="studio-geo-heading" className="text-2xl md:text-3xl font-bold text-center text-purple-900 mb-4">
            {language === 'en' ? 'Your Photo Studio in Vienna' : 'Ihr Fotostudio in Wien'}
          </h2>
          <p className="text-center text-gray-700 max-w-2xl mx-auto mb-6 leading-relaxed">
            {language === 'en'
              ? `${SITE.name} is your family photographer in Vienna 1050. Our studio in Wien-Margareten (Wehrgasse 11A/2+5) offers daylight rooms, calm posing areas for newborns, and a clean backdrop wall for business headshots – all within walking distance of public transport.`
              : `${SITE.name} ist Ihr Familienfotograf Wien 1050. Unser Fotostudio in Wien-Margareten (Wehrgasse 11A/2+5) bietet Tageslicht-Räume, ruhige Pose-Bereiche für Neugeborene und eine saubere Hintergrundwand für Business-Headshots – fußläufig zu allen öffentlichen Verkehrsmitteln.`}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-center">
            <li>
              <Link to="/familienfotos-wien/" className="block py-2 px-4 rounded-lg text-purple-700 hover:bg-purple-100 hover:text-purple-900 font-medium transition-colors">
                {language === 'en' ? 'Family Photographer Vienna 1050' : 'Familienfotograf Wien 1050'}
              </Link>
            </li>
            <li>
              <Link to="/babyfotos-wien/" className="block py-2 px-4 rounded-lg text-purple-700 hover:bg-purple-100 hover:text-purple-900 font-medium transition-colors">
                {language === 'en' ? 'Baby Photo Studio Vienna' : 'Baby Fotostudio Wien'}
              </Link>
            </li>
            <li>
              <Link to="/business-portrait-wien/" className="block py-2 px-4 rounded-lg text-purple-700 hover:bg-purple-100 hover:text-purple-900 font-medium transition-colors">
                {language === 'en' ? 'Business Photo Studio Vienna' : 'Business Fotostudio Wien'}
              </Link>
            </li>
            <li>
              <Link to="/hochzeitsfotografie-wien/" className="block py-2 px-4 rounded-lg text-purple-700 hover:bg-purple-100 hover:text-purple-900 font-medium transition-colors">
                {language === 'en' ? 'Wedding Photography Vienna' : 'Hochzeitsfotografie Wien'}
              </Link>
            </li>
            <li>
              <Link to="/gewerbliche-fotografie-wien/" className="block py-2 px-4 rounded-lg text-purple-700 hover:bg-purple-100 hover:text-purple-900 font-medium transition-colors">
                {language === 'en' ? 'Commercial Photography Vienna' : 'Gewerbliche Fotografie Wien'}
              </Link>
            </li>
            <li>
              <Link to="/warum-new-age-fotografie/" className="block py-2 px-4 rounded-lg text-purple-700 hover:bg-purple-100 hover:text-purple-900 font-medium transition-colors">
                {language === 'en' ? 'Why New Age Fotografie?' : 'Warum New Age Fotografie?'}
              </Link>
            </li>
            <li>
              <Link to="/preise/" className="block py-2 px-4 rounded-lg text-purple-700 hover:bg-purple-100 hover:text-purple-900 font-medium transition-colors">
                {language === 'en' ? 'Photoshoot Pricing Vienna' : 'Fotoshooting Preise Wien'}
              </Link>
            </li>
            <li>
              <Link to="/kontakt" className="block py-2 px-4 rounded-lg text-purple-700 hover:bg-purple-100 hover:text-purple-900 font-medium transition-colors">
                {language === 'en' ? 'Contact our Vienna studio' : 'Kontakt zum Studio in Wien'}
              </Link>
            </li>
            <li>
              <Link to="/warteliste" className="block py-2 px-4 rounded-lg text-purple-700 hover:bg-purple-100 hover:text-purple-900 font-medium transition-colors">
                {language === 'en' ? 'Reserve a date in Vienna' : 'Termin in Wien sichern'}
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/*
        THE SIX-CARD GRID, AFTER the family journey rather than in the middle of it.

        It lists family, maternity, newborn, BUSINESS, event and product photography with
        equal weight. On a homepage a parent arrives at, corporate headshots and product
        shots sitting a quarter of the way down is the interruption the brief describes —
        "do not give corporate headshots equal prominence to family/newborn/maternity".

        Moved, not cut. Every card, every alt attribute, every internal link and all of the
        service copy is exactly as it was; only its position changed. The four family
        services now lead the page in their own selector, and this grid is where somebody
        who has read that far and wants the rest of the list will find it.
      */}
      {/* Our Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('home.servicesTitle')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.servicesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Family Portraits */}
            <Link 
              to="/familien-fotoshooting-wien/"
              className="bg-white rounded-lg shadow-lg overflow-hidden block cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={imageForSection('services-family', photoGridImage)}
                  alt="Familienporträts Wien - Natürliche Familienfotografie im Studio und Outdoor"
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                  loading="lazy"
                  width="400"
                  height="300"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{t('home.familyPortraitsTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.familyPortraitsDescription')}
                </p>
                <span className="text-purple-600 font-semibold inline-flex items-center">
                  {t('home.learnMore')} →
                </span>
              </div>
            </Link>

            {/* Pregnancy Photography */}
            <Link 
              to="/schwangerschaftsfotos-wien/"
              className="bg-white rounded-lg shadow-lg overflow-hidden block cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={imageForSection('services-pregnancy', photoGridImage)}
                  alt={language === 'en' 
                    ? "Maternity Photography Vienna - Professional Pregnancy Photoshoot in Studio"
                    : "Babybauch Fotografie Wien - Professionelle Schwangerschaftsfotos im Studio"}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                  loading="lazy"
                  width="400"
                  height="300"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{t('home.pregnancyPhotographyTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.pregnancyPhotographyDescription')}
                </p>
                <span className="text-purple-600 font-semibold inline-flex items-center">
                  {t('home.learnMore')} →
                </span>
              </div>
            </Link>

            {/* Newborn Photography */}
            <Link 
              to="/baby-fotografie-wien/"
              className="bg-white rounded-lg shadow-lg overflow-hidden block cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={imageForSection('services-newborn', photoGridImage)}
                  alt={language === 'en'
                    ? "Newborn Photography Vienna - Professional Baby Photoshoot in Studio"
                    : "Neugeborenenfotos Wien - Professionelle Babyfotografie im Studio"}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                  loading="lazy"
                  width="400"
                  height="300"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{t('home.newbornPhotographyTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.newbornPhotographyDescription')}
                </p>
                <span className="text-purple-600 font-semibold inline-flex items-center">
                  {t('home.learnMore')} →
                </span>
              </div>
            </Link>

            {/* Business Photography */}
            <Link 
              to="/business-portrait-wien/"
              className="bg-white rounded-lg shadow-lg overflow-hidden block cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={imageForSection('services-business', 'https://i.postimg.cc/6QqWdLLP/Whats-App-Image-2025-05-24-at-2-38-46-PM.jpg')}
                  alt="Business Headshots Wien - Professionelle Businessfotografie im Studio"
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                  loading="lazy"
                  width="400"
                  height="300"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{t('home.businessPhotographyTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.businessPhotographyDescription')}
                </p>
                <span className="text-purple-600 font-semibold inline-flex items-center">
                  {t('home.learnMore')} →
                </span>
              </div>
            </Link>

            {/* Event Photography */}
            <Link 
              to="/eventfotografie-wien/"
              className="bg-white rounded-lg shadow-lg overflow-hidden block cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={imageForSection('services-event', photoGridImage)}
                  alt="Eventfotografie Wien - Professionelle Event & Konferenzfotografie"
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                  loading="lazy"
                  width="400"
                  height="300"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{t('home.eventPhotographyTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.eventPhotographyDescription')}
                </p>
                <span className="text-purple-600 font-semibold inline-flex items-center">
                  {t('home.learnMore')} →
                </span>
              </div>
            </Link>

            {/* Product Photography */}
            <Link 
              to="/produkt-fotografie-wien/"
              className="bg-white rounded-lg shadow-lg overflow-hidden block cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={imageForSection('services-product', photoGridImage)}
                  alt="Produktfotografie Wien - E-Commerce & Amazon Produktfotos im Studio"
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                  loading="lazy"
                  width="400"
                  height="300"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{t('home.productPhotographyTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.productPhotographyDescription')}
                </p>
                <span className="text-purple-600 font-semibold inline-flex items-center">
                  {t('home.learnMore')} →
                </span>
              </div>
            </Link>
          </div>

          {/* View All Services CTA */}
          <div className="text-center mt-12">
            <Link
              to="/fotoshootings/"
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg shadow-lg"
            >
              {t('home.viewAllServices')}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Career-history band — the evidence + workings behind the stats */}
      <CareerStorySection />

      {/* Gift Voucher Section */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-purple-900">
            {t('home.giftVouchersTitle')}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('home.giftVouchersSubtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {voucherProducts.map((voucher, idx) => (
              <div
                key={voucher.id}
                className={idx === 1 ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl shadow-2xl p-8 transform sm:scale-105' : 'bg-white rounded-xl shadow-lg p-8'}
              >
                {idx === 1 && (
                  <div className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4 ml-auto">
                    BESTSELLER
                  </div>
                )}

                <h3 className={idx === 1 ? 'text-2xl font-bold mb-4' : 'text-2xl font-bold mb-4 text-purple-900'}>
                  {translateProductText(voucher.name, productNameTranslations, language)}
                </h3>

                <div className={idx === 1 ? 'text-3xl font-bold mb-6' : 'text-3xl font-bold text-purple-600 mb-6'}>
                  €{voucher.price}
                </div>

                <ul className={idx === 1 ? 'space-y-3 mb-8 text-white/90' : 'space-y-3 mb-8 text-gray-700'}>
                  <li className="flex items-start">
                    <Check className={idx === 1 ? 'h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5' : 'h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5'} />
                    <span>{translateProductText(voucher.description || t('home.voucherOnlineGallery'), productDescriptionTranslations, language)}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className={idx === 1 ? 'h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5' : 'h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5'} />
                    <span>{t('home.voucherPrivateUsage')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className={idx === 1 ? 'h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5' : 'h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5'} />
                    <span>{t('home.voucherFlexibleDelivery')}</span>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    addToCart({
                      title: translateProductText(voucher.name, productNameTranslations, language),
                      productId: voucher.id,
                      productSlug: voucher.route || voucher.id,
                      price: Number(voucher.price) || 0,
                      quantity: 1,
                      packageType: language === 'en' ? 'Photo Shoot Voucher' : 'Fotoshooting Gutschein',
                      type: 'voucher'
                    });
                    navigate('/cart');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={idx === 1 ? 'block w-full bg-white text-purple-700 font-semibold py-3 px-6 rounded-lg' : 'block w-full bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg'}
                >
                  {t('home.bookNowButton')}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => {
                navigate('/vouchers');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              {t('home.viewAllVouchers')} →
            </button>
          </div>

          <div className="text-center mt-12">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-purple-900 mb-4">
                {t('home.whyOurVouchers')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">🎨</div>
                  <h4 className="font-semibold text-purple-700">{t('home.voucherCustomizable')}</h4>
                  <p className="text-sm text-gray-600">{t('home.voucherCustomizableDesc')}</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">📦</div>
                  <h4 className="font-semibold text-purple-700">{t('home.voucherFlexibleDeliveryTitle')}</h4>
                  <p className="text-sm text-gray-600">{t('home.voucherFlexibleDeliveryDesc')}</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">⏰</div>
                  <h4 className="font-semibold text-purple-700">{t('home.voucherInstantAvailable')}</h4>
                  <p className="text-sm text-gray-600">{t('home.voucherInstantAvailableDesc')}</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">💝</div>
                  <h4 className="font-semibold text-purple-700">{t('home.voucherPerfectGift')}</h4>
                  <p className="text-sm text-gray-600">{t('home.voucherPerfectGiftDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials handled site-wide by <GoogleReviews /> in Layout — inline grid removed to avoid duplicate reviews on the homepage */}

      {/* Description Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              {t('home.description')}
            </p>
          </div>
        </div>
      </section>

      {/*
        ONE ASK, LAST.

        The page ended on a paragraph of SEO copy, which is a strange place to leave someone
        who has just read the prices, the reassurance and the reviews. "Verfügbarkeit prüfen"
        rather than "Jetzt buchen" for the reason it is used everywhere else on this page: it
        is the next small step, and it goes to the same place the booking button always did.
      */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
            {language === 'de'
              ? 'Bereit für Familienfotos, die euch auch in Jahren noch etwas bedeuten?'
              : 'Ready for family photographs that still mean something years from now?'}
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/90 leading-relaxed">
            {language === 'de'
              ? 'Seht euch unsere aktuellen Termine an und findet einen, der zu eurer Familie passt.'
              : 'Have a look at our current dates and find one that suits your family.'}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/warteliste/"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-lg font-semibold text-purple-700 shadow-lg transition-transform duration-300 hover:scale-105"
            >
              {language === 'de' ? 'Verfügbarkeit prüfen' : 'Check availability'}
            </Link>
            <Link
              to="/preise/"
              className="inline-flex items-center justify-center rounded-full border border-white/70 px-7 py-3 text-lg font-medium text-white transition-colors duration-300 hover:bg-white/10"
            >
              {language === 'de' ? 'Preise ansehen' : 'See prices'}
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default HomePage;