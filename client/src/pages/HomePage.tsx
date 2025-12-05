import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import ZoomableImage from '../components/ui/ZoomableImage';
import Typewriter from 'typewriter-effect';
import CountUp from 'react-countup';
import { Check } from 'lucide-react';
import photoGridImage from '../assets/photo-grid.jpg';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useManualPageContent } from '../hooks/useManualPageContent';
import { SEOHead } from '../components/SEO/SEOHead';
import { Helmet } from 'react-helmet-async';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  
  // Use manual page content hook - allows admin to override any content
  const t = useManualPageContent('home');

  // Fetch homepage images from API
  const { data: homepageImages, isLoading: isLoadingImages } = useQuery({
    queryKey: ['/api/homepage/images'],
    queryFn: async () => {
      const res = await fetch('/api/homepage/images');
      if (!res.ok) throw new Error('Failed to fetch homepage images');
      return res.json();
    },
    // Keep data fresh but allow brief caching to prevent flash
    staleTime: 1000 * 60 * 5, // 5 minutes - images don't change that often
    cacheTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Utility: resolve image URL by section with local fallback
  const imageForSection = (section: string, fallback?: string) => {
    const hit = (homepageImages as any[])?.find((img: any) => img.section === section);
    return (hit && (hit.url as string)) || fallback || photoGridImage;
  };

  const heroImageUrl = useMemo(() => {
    return imageForSection('hero', undefined);
  }, [homepageImages]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch voucher products from API
  const { data: apiProducts } = useQuery({
    queryKey: ['/api/vouchers/products'],
    queryFn: async () => {
      const res = await fetch('/api/vouchers/products');
      if (!res.ok) throw new Error('Failed to fetch vouchers');
      return res.json();
    }
  });

  // Fallback voucher products
  const defaultVouchers = [
    {
      id: 'pregnancy-shooting',
      name: t('home.pregnancyShootingTitle'),
      description: t('home.pregnancyShootingDescription'),
      originalPrice: 195,
      price: 95,
      image: 'https://i.imgur.com/Vd6xtPg.jpg',
      category: 'pregnancy',
      route: '/gutschein/maternity'
    },
    {
      id: 'family-shooting',
      name: t('home.familyShootingTitle'),
      description: t('home.familyShootingDescription'),
      originalPrice: 295,
      price: 95,
      image: 'https://i.postimg.cc/bw7ZyvPK/Familienfotoshooting-im-Fotostudio-Wien-Krexner-2777.jpg',
      category: 'family',
      route: '/gutschein/family'
    },
    {
      id: 'newborn-shooting',
      name: t('home.newbornShootingTitle'),
      description: t('home.newbornShootingDescription'),
      originalPrice: 395,
      price: 95,
      image: 'https://i.imgur.com/QWOgLqX.jpg',
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
          image: p.thumbnailUrl || p.imageUrl || 'https://i.imgur.com/Vd6xtPg.jpg',
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

  const testimonials = [
    {
      name: "Sarah M.",
      image: "https://i.imgur.com/BScsxGX.jpg",
      role: t('home.testimonial1Role'),
      text: t('home.testimonial1Text')
    },
    {
      name: "Michael K.",
      image: "https://i.imgur.com/HGZGIGX.jpg",
      role: t('home.testimonial2Role'),
      text: t('home.testimonial2Text')
    },
    {
      name: "Lisa & Tom",
      image: "https://i.imgur.com/fcFwAhs.jpg", 
      role: t('home.testimonial3Role'),
      text: t('home.testimonial3Text')
    },
    {
      name: "Anna W.",
      image: "https://i.imgur.com/xx3UWL7.jpg",
      role: t('home.testimonial4Role'),
      text: t('home.testimonial4Text')
    },
    {
      name: "Maria & Peter",
      image: "https://i.imgur.com/9d98SBH.jpg",
      role: t('home.testimonial5Role'),
      text: t('home.testimonial5Text')
    },
    {
      name: "Christina R.",
      image: "https://i.imgur.com/8HD86CW.jpg",
      role: t('home.testimonial6Role'),
      text: t('home.testimonial6Text')
    }
  ];

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
        title="Familienfotograf Wien – New Age Fotografie | Studio & Outdoor Fotoshootings"
        description="Professionelle Familienfotos, Schwangerschaftsfotos, Neugeborenenfotos & Business Portraits in Wien. Über 27.000 glückliche Familien. Studio in 1050 Wien. Jetzt Termin buchen!"
        keywords="familienfotograf wien, fotostudio wien, familienfotografie wien, schwangerschaftsfotos wien, neugeborenenfotos wien, babyfotograf wien, business portrait wien"
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
            '@id': 'https://www.newagefotografie.com/#business',
            name: 'New Age Fotografie',
            image: heroImageUrl || 'https://example.com/placeholder.jpg',
            description: 'Professioneller Familienfotograf in Wien. Spezialisiert auf Familienfotos, Schwangerschaftsfotos, Neugeborenenfotos und Business Portraits.',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Margaretenstraße',
              addressLocality: 'Wien',
              postalCode: '1050',
              addressCountry: 'AT'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 48.191130,
              longitude: 16.356010
            },
            url: 'https://www.newagefotografie.com',
            telephone: '+43-XXX-XXXXXXX',
            priceRange: '€€',
            openingHours: 'Mo-Fr 09:00-18:00',
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
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '253',
              bestRating: '5',
              worstRating: '1'
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl md:w-3/5 mb-8 md:mb-0">
            <h1 className="mb-4 leading-tight text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              {t('home.heroTitle')}
            </h1>
            <div className="mb-6">
              <span className="block text-xl sm:text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
                <Typewriter
                  options={{
                    strings: [t('home.heroSubtitle')],
                    autoStart: true,
                    loop: true,
                    cursor: '',
                    delay: 50,
                    deleteSpeed: 50
                  }}
                />
              </span>
              <span className="block text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 tracking-tighter animate-fade-in-up">
                {t('home.heroDescription')}
              </span>
            </div>
            <button 
              onClick={() => navigate('/warteliste')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t('home.bookShootingButton')}
            </button>
          </div>
          <div className="md:w-2/5">
            <ZoomableImage
              src={heroImageUrl || photoGridImage}
              alt="Comprehensive family portrait showcase including family, newborn, maternity and lifestyle sessions"
              className="w-full rounded-lg shadow-lg"
              onError={(e) => {
                // Fallback for mobile/loading issues
                e.currentTarget.src = photoGridImage;
              }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

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

      {/* Counter Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <CountUp end={27156} duration={2.5} separator="," />
              </div>
              <div className="text-base md:text-lg text-white/90">{t('home.happyFamilies')}</div>
            </div>
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <CountUp end={5431977} duration={2.5} separator="," />
              </div>
              <div className="text-base md:text-lg text-white/90">{t('home.portraitsCaptured')}</div>
            </div>
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <CountUp end={27} duration={2.5} />
              </div>
              <div className="text-base md:text-lg text-white/90">{t('home.yearsExperience')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* First Content Block */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="md:w-1/3">
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
                <ZoomableImage 
                  src={imageForSection('content-1', photoGridImage)}
                  alt="Familienfotografie Wien - Professionelle Familienporträts im Studio"
                  className="w-full h-full object-cover"
                  loading="lazy"
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
              <div className="aspect-[3/4] max-w-sm mx-auto overflow-hidden rounded-lg shadow-lg">
                <ZoomableImage 
                  src={imageForSection('content-2', photoGridImage)}
                  alt="Business Headshots Wien - Professionelle Businessfotografie im Studio"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
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

      {/* Our Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Unsere Fotografie-Services in Wien</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Von Familien-Shootings bis Business-Portraits – wir bieten professionelle Fotografie für jeden Anlass
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Family Portraits */}
            <div 
              onClick={() => navigate('/familien-fotoshooting-wien/')}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={imageForSection('services-family', photoGridImage)}
                  alt="Familienporträts Wien - Natürliche Familienfotografie im Studio und Outdoor"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{t('home.familyPortraitsTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.familyPortraitsDescription')}
                </p>
                <span className="text-purple-600 font-semibold inline-flex items-center">
                  Mehr erfahren →
                </span>
              </div>
            </div>

            {/* Pregnancy Photography */}
            <div 
              onClick={() => navigate('/schwangerschaftsfotos-wien/')}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={imageForSection('services-pregnancy', photoGridImage)}
                  alt={language === 'en' 
                    ? "Maternity Photography Vienna - Professional Pregnancy Photoshoot in Studio"
                    : "Babybauch Fotografie Wien - Professionelle Schwangerschaftsfotos im Studio"}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{t('home.pregnancyPhotographyTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.pregnancyPhotographyDescription')}
                </p>
                <span className="text-purple-600 font-semibold inline-flex items-center">
                  Mehr erfahren →
                </span>
              </div>
            </div>

            {/* Newborn Photography */}
            <div 
              onClick={() => navigate('/baby-fotografie-wien/')}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={imageForSection('services-newborn', photoGridImage)}
                  alt={language === 'en'
                    ? "Newborn Photography Vienna - Professional Baby Photoshoot in Studio"
                    : "Neugeborenenfotos Wien - Professionelle Babyfotografie im Studio"}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{t('home.newbornPhotographyTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.newbornPhotographyDescription')}
                </p>
                <span className="text-purple-600 font-semibold inline-flex items-center">
                  Mehr erfahren →
                </span>
              </div>
            </div>

            {/* Business Photography */}
            <div 
              onClick={() => navigate('/business-portrait-wien/')}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={imageForSection('services-business', photoGridImage)}
                  alt="Business Headshots Wien - Professionelle Businessfotografie im Studio"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{t('home.businessPhotographyTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.businessPhotographyDescription')}
                </p>
                <span className="text-purple-600 font-semibold inline-flex items-center">
                  Mehr erfahren →
                </span>
              </div>
            </div>

            {/* Event Photography */}
            <div 
              onClick={() => navigate('/eventfotografie-wien/')}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={imageForSection('services-event', photoGridImage)}
                  alt="Eventfotografie Wien - Professionelle Event & Konferenzfotografie"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{t('home.eventPhotographyTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.eventPhotographyDescription')}
                </p>
                <span className="text-purple-600 font-semibold inline-flex items-center">
                  Mehr erfahren →
                </span>
              </div>
            </div>

            {/* Product Photography */}
            <div 
              onClick={() => navigate('/produkt-fotografie-wien/')}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={imageForSection('services-product', photoGridImage)}
                  alt="Produktfotografie Wien - E-Commerce & Amazon Produktfotos im Studio"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{t('home.productPhotographyTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.productPhotographyDescription')}
                </p>
                <span className="text-purple-600 font-semibold inline-flex items-center">
                  Mehr erfahren →
                </span>
              </div>
            </div>
          </div>

          {/* View All Services CTA */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/fotoshootings')}
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg shadow-lg"
            >
              Alle Services ansehen
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="width" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Title Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-900">
            {t('home.portraitStudioTitle')}
          </h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            Schenken Sie unvergessliche Momente! Unsere personalisierbaren Fotoshooting-Gutscheine sind das perfekte Geschenk für jeden Anlass.
          </p>
        </div>
      </section>

      {/* Voucher section removed per request (keeps Gift Voucher section below) */}

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-900">
            {t('home.testimonialsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Voucher Section */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-purple-900">
            Geschenkgutscheine
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Schenken Sie unvergessliche Momente! Unsere personalisierbaren Fotoshooting-Gutscheine sind das perfekte Geschenk für jeden Anlass.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {voucherProducts.map((voucher, idx) => (
              <div
                key={voucher.id}
                className={idx === 1 ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl shadow-2xl p-8 transform scale-105' : 'bg-white rounded-xl shadow-lg p-8'}
              >
                {idx === 1 && (
                  <div className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4 ml-auto">
                    BESTSELLER
                  </div>
                )}

                <h3 className={idx === 1 ? 'text-2xl font-bold mb-4' : 'text-2xl font-bold mb-4 text-purple-900'}>{voucher.name}</h3>

                <div className={idx === 1 ? 'text-3xl font-bold mb-6' : 'text-3xl font-bold text-purple-600 mb-6'}>
                  €{voucher.price}
                </div>

                <ul className={idx === 1 ? 'space-y-3 mb-8 text-white/90' : 'space-y-3 mb-8 text-gray-700'}>
                  <li className="flex items-start">
                    <Check className={idx === 1 ? 'h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5' : 'h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5'} />
                    <span>{voucher.description || 'Auswahlgalerie online'}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className={idx === 1 ? 'h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5' : 'h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5'} />
                    <span>Nutzungsrechte privat</span>
                  </li>
                  <li className="flex items-start">
                    <Check className={idx === 1 ? 'h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5' : 'h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5'} />
                    <span>Flexible Zustellung</span>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    addToCart({
                      title: voucher.name,
                      productId: voucher.id,
                      productSlug: voucher.route || voucher.id,
                      price: Number(voucher.price) || 0,
                      quantity: 1,
                      packageType: 'Fotoshooting Gutschein',
                      type: 'voucher'
                    });
                    navigate('/cart');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={idx === 1 ? 'block w-full bg-white text-purple-700 font-semibold py-3 px-6 rounded-lg' : 'block w-full bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg'}
                >
                  Jetzt Buchen
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
              Alle Gutscheine ansehen →
            </button>
          </div>

          <div className="text-center mt-12">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-purple-900 mb-4">
                Warum unsere Gutscheine?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">🎨</div>
                  <h4 className="font-semibold text-purple-700">Personalisierbar</h4>
                  <p className="text-sm text-gray-600">Eigene Fotos & Nachrichten</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">📦</div>
                  <h4 className="font-semibold text-purple-700">Flexible Zustellung</h4>
                  <p className="text-sm text-gray-600">PDF, Post oder Geschenkbox</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">⏰</div>
                  <h4 className="font-semibold text-purple-700">Sofort verfügbar</h4>
                  <p className="text-sm text-gray-600">Auch last-minute bestellbar</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">💝</div>
                  <h4 className="font-semibold text-purple-700">Perfektes Geschenk</h4>
                  <p className="text-sm text-gray-600">Für jeden Anlass geeignet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-900">
            {t('home.faqTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faqImages.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="aspect-[4/3] overflow-hidden rounded-lg mb-6">
                  <img
                    src={faq.image}
                    alt={faq.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-4">
                  {faq.title}
                </h3>
                <p className="text-gray-700">
                  {index === 0 && t('home.faq1Text')}
                  {index === 1 && t('home.faq2Text')}
                  {index === 2 && t('home.faq3Text')}
                  {index === 3 && t('home.faq4Text')}
                  {index === 4 && t('home.faq5Text')}
                  {index === 5 && t('home.faq6Text')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;