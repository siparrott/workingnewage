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

  // Fetch voucher products from API with shorter cache (images update frequently)
  const { data: apiProducts, isLoading } = useQuery({
    queryKey: ['/api/vouchers/products', 'v3-no-flash'],
    queryFn: async () => {
      console.log('🔄 Fetching fresh voucher data from API...');
      const res = await fetch('/api/vouchers/products?_t=' + Date.now()); // Cache busting
      if (!res.ok) throw new Error('Failed to fetch vouchers');
      const data = await res.json();
      console.log('✅ Voucher products fetched:', data.length, 'products');
      // Don't cache to localStorage - always fetch fresh
      return data;
    },
    // NO initialData - prevents flash of old/placeholder images
    staleTime: 0, // Always fetch fresh data for latest images
    cacheTime: 1000 * 60 * 2, // Keep in memory for 2 minutes only
    refetchOnMount: 'always', // Always refetch to get latest uploaded images
    refetchOnWindowFocus: true, // Refetch on window focus
  });

  // NO fallback vouchers - always load from API to prevent placeholder flash

  // Transform API products to match expected format
  const voucherProducts = useMemo(() => {
    // ALWAYS wait for API data - NEVER show defaultVouchers fallback
    if (!apiProducts || !Array.isArray(apiProducts) || apiProducts.length === 0) {
      console.log('⏳ Waiting for API data...');
      return null; // null = loading state, not empty array
    }
    
    console.log('📦 API Products received:', apiProducts.length, apiProducts);
    return apiProducts
      .filter((p: any) => p.isActive !== false && p.is_active !== false)
      .map((p: any) => {
        const imageUrl = p.imageUrl || p.image_url || p.thumbnailUrl || p.thumbnail_url;
        console.log(`📷 Product: ${p.name}, imageUrl:`, imageUrl);
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          price: parseFloat(p.price) || 0,
          originalPrice: p.originalPrice || p.original_price ? parseFloat(p.originalPrice || p.original_price) : parseFloat(p.price) * 1.3,
          image: imageUrl || '', // Use actual uploaded image or empty string
          category: p.category || 'family',
          route: `/vouchers/${p.id}`,
          validityMonths: Math.floor((p.validityPeriod || p.validity_period || 365) / 30),
          isActive: p.isActive !== false && p.is_active !== false
        };
      });
  }, [apiProducts]);

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

  // Prepare hero items mapping once - ONLY if data is loaded
  const heroItems = useMemo(() => {
    if (!voucherProducts) return [];
    return voucherProducts.map(v => ({
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
  }, [voucherProducts]);

  // Show loading skeleton while data is fetching
  if (isLoading || !voucherProducts) {
    return (
      <Layout>
        <Helmet>
          <title>{vouchersTitle}</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {vouchersTitle}
              </h1>
              <p className="text-lg text-gray-600 animate-pulse">Loading vouchers...</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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

  // Show loading state while fetching vouchers (prevents placeholder flash)
  if (isLoading || !apiProducts) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{t('common.loading')}</p>
          </div>
        </div>
      </Layout>
    );
  }

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