import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import CategoryFilter from '../components/vouchers/CategoryFilter';
import { useAppContext } from '../context/AppContext';
import { Search, Gift } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import HeroDealsAuto from '@/components/HeroDealsAuto';
import { useCart } from '../context/CartContext';
import { SEOHead } from '../components/SEO/SEOHead';
import { Helmet } from 'react-helmet-async';
import { getCachedData, setCachedData } from '../lib/persistentCache';
import { useImagePreloader } from '../hooks/useImagePreloader';

const VouchersPage: React.FC = () => {
  const { selectedCategory } = useAppContext();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Memoize the title to prevent flashing
  const vouchersTitle = useMemo(() => {
    const title = t('vouchers.title');
    // Fallback to prevent flashing if translation isn't ready
    return title && title !== 'vouchers.title' ? title : 
           (language === 'en' ? 'Photoshoot Vouchers Vienna' : 'Fotoshooting Gutscheine Wien');
  }, [t, language]);

  // Fetch voucher products from API with persistent cache
  const { data: apiProducts, isLoading } = useQuery({
    queryKey: ['/api/vouchers/products'],
    queryFn: async () => {
      const res = await fetch('/api/vouchers/products');
      if (!res.ok) throw new Error('Failed to fetch vouchers');
      const data = await res.json();
      // Cache the response for 24 hours
      setCachedData('voucher-products', data);
      return data;
    },
    // Use cached data as initial data to prevent flashing
    initialData: () => getCachedData('/api/vouchers/products', 1000 * 60 * 60 * 24), // 24 hour cache
    // Keep data fresh but allow brief caching to prevent flash
    staleTime: 1000 * 60 * 5, // 5 minutes - products don't change that often
    cacheTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Fallback to default vouchers if API returns empty or fails - ALL CATEGORIES
  const defaultVouchers = [
    // Family Category
    {
      id: 'family-basic',
      name: 'Family Basic',
      description: 'Perfect for Small Families - 60 Min Shooting, 1 Foto A3 Leinwand',
      originalPrice: 195,
      price: 95,
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop',
      category: 'Familie',
      route: '/gutschein/family',
      validityMonths: 12,
      isActive: true
    },
    {
      id: 'family-premium',
      name: 'Family Premium',
      description: 'Ideal für größere Familien - 5 bearbeitete Fotos digital, A3 Leinwand',
      originalPrice: 295,
      price: 195,
      image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&h=600&fit=crop',
      category: 'Familie',
      route: '/gutschein/family',
      validityMonths: 12,
      isActive: true
    },
    {
      id: 'family-deluxe',
      name: 'Family Deluxe',
      description: 'Das komplette Familienerlebnis - A2 Leinwand, 10 bearbeitete Fotos',
      originalPrice: 395,
      price: 295,
      image: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&h=600&fit=crop',
      category: 'Familie',
      route: '/gutschein/family',
      validityMonths: 12,
      isActive: true
    },
    // Newborn/Baby Category
    {
      id: 'newborn-basic',
      name: 'Newborn Basic',
      description: 'Erste Erinnerungen - 60 Min Shooting, 1 Foto A3 Leinwand',
      originalPrice: 195,
      price: 95,
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop',
      category: 'Baby',
      route: '/gutschein/newborn',
      validityMonths: 12,
      isActive: true
    },
    {
      id: 'newborn-premium',
      name: 'Newborn Premium',
      description: 'Umfangreiche Erinnerungen - 90 Min Shooting, 5 Fotos digital',
      originalPrice: 295,
      price: 195,
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=600&fit=crop',
      category: 'Baby',
      route: '/gutschein/newborn',
      validityMonths: 12,
      isActive: true
    },
    {
      id: 'newborn-deluxe',
      name: 'Newborn Deluxe',
      description: 'Das komplette Erlebnis - 90-120 Min, 10 Fotos digital, A2 Leinwand',
      originalPrice: 395,
      price: 295,
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop',
      category: 'Baby',
      route: '/gutschein/newborn',
      validityMonths: 12,
      isActive: true
    },
    // Maternity/Pregnancy Category
    {
      id: 'maternity-basic',
      name: 'Schwangerschaft Basic',
      description: 'Magische Momente - 60 Min Shooting, 1 Foto A3 Leinwand',
      originalPrice: 195,
      price: 95,
      image: 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=800&h=600&fit=crop',
      category: 'Schwangerschaft',
      route: '/gutschein/maternity',
      validityMonths: 12,
      isActive: true
    },
    {
      id: 'maternity-premium',
      name: 'Schwangerschaft Premium',
      description: 'Umfangreiche Erinnerung - 90 Min Shooting, 5 Fotos digital',
      originalPrice: 295,
      price: 195,
      image: 'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?w=800&h=600&fit=crop',
      category: 'Schwangerschaft',
      route: '/gutschein/maternity',
      validityMonths: 12,
      isActive: true
    },
    {
      id: 'maternity-deluxe',
      name: 'Schwangerschaft Deluxe',
      description: 'Komplettes Erlebnis - 90-120 Min, 10 Fotos, A2 Leinwand',
      originalPrice: 395,
      price: 295,
      image: 'https://images.unsplash.com/photo-1576856497337-686e89b98cdc?w=800&h=600&fit=crop',
      category: 'Schwangerschaft',
      route: '/gutschein/maternity',
      validityMonths: 12,
      isActive: true
    },
    // Business Category
    {
      id: 'business-headshot',
      name: 'Business Headshot',
      description: 'Professionelles Businessportrait - 30 Min, 3 bearbeitete Fotos',
      originalPrice: 195,
      price: 149,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop',
      category: 'Business',
      route: '/fotoshootings/business',
      validityMonths: 12,
      isActive: true
    },
    {
      id: 'business-corporate',
      name: 'Corporate Team Shooting',
      description: 'Teamfotos für Ihr Unternehmen - 60 Min, 10+ Fotos',
      originalPrice: 495,
      price: 349,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      category: 'Business',
      route: '/fotoshootings/business',
      validityMonths: 12,
      isActive: true
    },
    // Event Category
    {
      id: 'event-basic',
      name: 'Eventfotografie Basic',
      description: 'Ihr Event professionell festgehalten - 2 Stunden, 50+ Fotos',
      originalPrice: 599,
      price: 449,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
      category: 'Event',
      route: '/fotoshootings/event',
      validityMonths: 12,
      isActive: true
    },
    {
      id: 'event-premium',
      name: 'Eventfotografie Premium',
      description: 'Ganztägige Event-Coverage - 6+ Stunden, 200+ Fotos',
      originalPrice: 1299,
      price: 999,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      category: 'Event',
      route: '/fotoshootings/event',
      validityMonths: 12,
      isActive: true
    }
  ];

  // Transform API products to match expected format
  const voucherProducts = useMemo(() => {
    if (apiProducts && Array.isArray(apiProducts) && apiProducts.length > 0) {
      console.log('📦 API Products received:', apiProducts.length, apiProducts);
      return apiProducts
        .filter((p: any) => p.isActive !== false && p.is_active !== false) // Only show active products
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          price: parseFloat(p.price) || 0,
          originalPrice: p.original_price ? parseFloat(p.original_price) : parseFloat(p.price) * 1.3,
          image: p.image_url || p.imageUrl || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop',
          category: p.category || 'family',
          route: `/vouchers/${p.id}`,
          validityMonths: Math.floor((p.validity_period || 365) / 30),
          isActive: p.is_active !== false && p.isActive !== false
        }));
    }
    console.log('⚠️ No API products, using fallback');
    return defaultVouchers;
  }, [apiProducts, t]);

  // Preload all voucher images to prevent flashing
  const imageUrlsToPreload = useMemo(() => {
    const urls: string[] = [];
    
    if (voucherProducts && Array.isArray(voucherProducts)) {
      voucherProducts.forEach((product: any) => {
        if (product?.image) urls.push(product.image);
        if (product?.thumbnailUrl) urls.push(product.thumbnailUrl);
        if (product?.image_url) urls.push(product.image_url);
      });
    }
    
    return urls;
  }, [voucherProducts]);
  
  useImagePreloader(imageUrlsToPreload);

  // Prepare hero items mapping once
  const heroItems = voucherProducts.map(v => ({
    id: v.id,
    name: v.name,
    slug: v.slug,
    description: v.description,
    image: v.image,
    price: v.price,
    originalPrice: v.originalPrice,
    route: v.route,
    url: v.route,
  }));

  // Show both hero AND full catalog with category filtering
  const showThreeOnly = false;
  if (showThreeOnly) {
    return (
      <Layout>
        <HeroDealsAuto items={heroItems} />
      </Layout>
    );
  }

  useEffect(() => {
    // SEO Meta Tags - Dynamic based on language
    const title = language === 'en' 
      ? 'Photoshoot Vouchers Vienna - Gift Ideas | New Age Photography'
      : 'Fotoshooting Gutscheine Wien - Geschenkideen | New Age Fotografie';
    document.title = title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    const description = language === 'en'
      ? 'Photoshoot vouchers as the perfect gift idea. Family, pregnancy and newborn photoshoots in Vienna for gifting.'
      : 'Fotoshooting Gutscheine als perfekte Geschenkidee. Familien-, Schwangerschafts- und Neugeborenen-Fotoshootings in Wien zum Verschenken.';
    metaDescription.setAttribute('content', description);
  }, [language]);
  
  // Filter vouchers based on search term and category
  const filteredByCategory = selectedCategory && selectedCategory !== 'Alle' as any
    ? voucherProducts.filter(voucher => {
        const voucherCategory = (voucher.category || '').toLowerCase();
        const selectedCat = (selectedCategory || '').toLowerCase();
        
        // Direct match
        if (voucherCategory === selectedCat) return true;
        
        // Category mapping for compatibility
        const categoryMap: Record<string, string[]> = {
          'familie': ['family', 'familie'],
          'baby': ['newborn', 'baby'],
          'schwangerschaft': ['pregnancy', 'maternity', 'schwangerschaft'],
          'business': ['business'],
          'event': ['event'],
          'hochzeit': ['wedding', 'hochzeit']
        };
        
        const matchTerms = categoryMap[selectedCat] || [selectedCat];
        return matchTerms.some(term => voucherCategory.includes(term));
      })
    : voucherProducts;
  
  const displayedVouchers = searchTerm 
    ? filteredByCategory.filter(voucher => 
        voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredByCategory;

  const { addItem } = useCart();

  const handlePurchaseVoucher = (voucher: any) => {
    // Add voucher to cart
    addItem({
      title: voucher.name,
      price: voucher.price,
      quantity: 1,
      packageType: voucher.category || 'Voucher',
      type: 'voucher',
      productId: voucher.id,
      productSlug: voucher.slug,
      description: voucher.description,
      imageUrl: voucher.image
    });
    // Navigate to cart page
    navigate('/cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <SEOHead
        title="Fotoshooting Gutscheine Wien – Geschenkideen | New Age Fotografie"
        description="Fotoshooting Gutscheine als perfekte Geschenkidee. Familie, Schwangerschaft, Baby, Business & Event Fotoshootings zum Verschenken. Ab €95. Gültig 2 Jahre."
        keywords="fotoshooting gutschein wien, geschenkgutschein fotografie, fotografie gutschein, fotoshooting verschenken wien"
        canonical="/vouchers/"
        ogImage="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&h=630&fit=crop"
        hreflang={[
          { lang: 'de', url: '/vouchers/' },
          { lang: 'en', url: '/en/vouchers/' }
        ]}
      />

      {/* JSON-LD Structured Data for Products */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: voucherProducts.slice(0, 5).map((voucher, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Product',
                name: voucher.name,
                description: voucher.description,
                image: voucher.image,
                offers: {
                  '@type': 'Offer',
                  price: voucher.price,
                  priceCurrency: 'EUR',
                  availability: 'https://schema.org/InStock',
                  url: `https://www.newagefotografie.com${voucher.route}`
                }
              }
            }))
          })}
        </script>
      </Helmet>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {vouchersTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-2">
            Fotoshooting Gutscheine für jeden Anlass
          </p>
          <p className="text-lg opacity-90">
            Wählen Sie aus unseren Kategorien: Familie, Baby, Schwangerschaft, Business & Event
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Category Filter - Prominent at top */}
        <div className="mb-8 text-center">
          <CategoryFilter />
        </div>
        
        {/* Search Bar - Centered */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder={t('vouchers.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors text-lg"
            />
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {/* Main content with vouchers */}
        <div>
          {displayedVouchers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedVouchers.map(voucher => (
                  <div key={voucher.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Image */}
                    <div className="relative">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={voucher.image}
                          alt={voucher.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-purple-900 mb-2">{voucher.name}</h3>
                      <p className="text-gray-600 mb-4">{voucher.description}</p>
                      
                      {/* Validity */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">
                          {t('vouchers.validUntil')} {t('vouchers.validityPeriod')}
                        </span>
                      </div>
                      
                      {/* Price and Button */}
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500 uppercase tracking-wide">{language === 'de' ? 'AB' : 'FROM'}</span>
                          <span className="text-2xl font-bold text-purple-600">€{voucher.price}</span>
                        </div>
                        <button 
                          onClick={() => handlePurchaseVoucher(voucher)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-colors"
                        >
                          {t('home.bookNowButton')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {searchTerm || selectedCategory !== null ? t('vouchers.noVouchersFound') : t('vouchers.noVouchersAvailable')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedCategory !== null 
                    ? t('vouchers.noVouchersFoundMessage')
                    : t('vouchers.noVouchersAvailableMessage')
                  }
                </p>
                {(searchTerm || selectedCategory !== null) && (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                    }}
                    className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                  >
                    {t('vouchers.resetFilters')}
                  </button>
                )}
              </div>
            )}
        </div>
      </div>
    </Layout>
  );
};

export default VouchersPage;