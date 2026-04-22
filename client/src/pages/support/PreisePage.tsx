import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Camera, Baby, Heart, Users, Briefcase, Check, Gift, Info } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { RelatedTopicsBlock } from '../../components/SEO/RelatedTopicsBlock';
import { PillarLinksBlock } from '../../components/SEO/PillarLinksBlock';
import { SEOHead } from '../../components/SEO/SEOHead';

// Map API categories → grouped sections for the Preise page.
// Shared with the Vouchers page categorisation so cards stay in sync.
const CATEGORY_GROUPS: {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string; // tailwind text color for price + icon bg
  bgIcon: string; // tailwind bg color for icon circle
  match: string[]; // lowercased category terms to match
}[] = [
  {
    key: 'family',
    title: 'Familien-Fotoshooting',
    subtitle: 'Authentische Familienmomente für die Ewigkeit',
    icon: <Users className="w-8 h-8 text-orange-600" />,
    accent: 'text-orange-600',
    bgIcon: 'bg-orange-100',
    match: ['family', 'familie', 'familien'],
  },
  {
    key: 'newborn',
    title: 'Baby & Newborn',
    subtitle: 'Zarte Babyfotos in den ersten Lebenswochen',
    icon: <Baby className="w-8 h-8 text-pink-600" />,
    accent: 'text-pink-600',
    bgIcon: 'bg-pink-100',
    match: ['newborn', 'neugeboren', 'baby'],
  },
  {
    key: 'maternity',
    title: 'Schwangerschaftsfotos',
    subtitle: 'Die besondere Zeit vor der Geburt festhalten',
    icon: <Heart className="w-8 h-8 text-purple-600" />,
    accent: 'text-purple-600',
    bgIcon: 'bg-purple-100',
    match: ['maternity', 'pregnancy', 'schwanger'],
  },
  {
    key: 'business',
    title: 'Business Portrait',
    subtitle: 'Professionelle Porträts für LinkedIn, Website & Team',
    icon: <Briefcase className="w-8 h-8 text-blue-600" />,
    accent: 'text-blue-600',
    bgIcon: 'bg-blue-100',
    match: ['business', 'portrait', 'porträt', 'bewerbung', 'team'],
  },
  {
    key: 'event',
    title: 'Event & Hochzeit',
    subtitle: 'Bilder, die wichtige Momente festhalten',
    icon: <Camera className="w-8 h-8 text-yellow-600" />,
    accent: 'text-yellow-600',
    bgIcon: 'bg-yellow-100',
    match: ['event', 'wedding', 'hochzeit'],
  },
];

type VoucherProduct = {
  id: string;
  slug?: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  featured?: boolean;
  badge?: string | null;
};

function formatPrice(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value as number)) return '';
  const rounded = Math.round(value);
  return `€${rounded.toLocaleString('de-AT')}`;
}

function stripMarkup(text: string | undefined): string {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

const PreisePage: React.FC = () => {
  // Fetch the same live voucher catalogue the /vouchers page uses
  const { data: apiProducts, isLoading } = useQuery({
    queryKey: ['/api/vouchers/products', 'preise-page'],
    queryFn: async () => {
      const res = await fetch('/api/vouchers/products');
      if (!res.ok) throw new Error('Failed to fetch vouchers');
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const products: VoucherProduct[] = useMemo(() => {
    if (!apiProducts || !Array.isArray(apiProducts)) return [];
    return apiProducts
      .filter((p: any) => p.isActive !== false && p.is_active !== false)
      .map((p: any) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description || '',
        price: parseFloat(p.price) || 0,
        originalPrice: p.originalPrice || p.original_price
          ? parseFloat(p.originalPrice || p.original_price)
          : undefined,
        image: p.imageUrl || p.image_url || p.thumbnailUrl || p.thumbnail_url || '',
        category: (p.category || '').toString().toLowerCase(),
        featured: !!p.featured,
        badge: p.badge || null,
      }));
  }, [apiProducts]);

  const grouped = useMemo(() => {
    const seen = new Set<string>();
    return CATEGORY_GROUPS.map((group) => {
      const items = products
        .filter((p) => {
          if (seen.has(p.id)) return false;
          const cat = p.category || '';
          return group.match.some((term) => cat.includes(term));
        })
        .sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.price - b.price;
        });
      items.forEach((it) => seen.add(it.id));
      return { ...group, items };
    }).filter((group) => group.items.length > 0);
  }, [products]);

  return (
    <Layout>
      <SEOHead
        title="Fotoshooting Preise Wien – Transparente Pakete ab €95 | New Age Fotografie"
        description="Alle Fotoshooting-Preise auf einen Blick: Familien ab €199, Baby & Newborn ab €199, Business Portraits ab €129, Schwangerschaft ab €179. Faire Pakete, keine versteckten Kosten."
        keywords="Fotoshooting Preise Wien, Fotograf Kosten Wien, Preisliste Fotografie Wien, Familienfotoshooting Preise"
        canonical="/preise/"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Fotoshooting Preise in Wien – Faire Pakete für jeden Anlass
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Transparente Preise, faire Pakete – alle bearbeiteten Bilder inklusive
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/vouchers"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Gutschein verschenken
              </Link>
              <Link
                to="/kontakt"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Beratung anfragen
              </Link>
            </div>
          </div>
        </section>

        {/* Info Banner */}
        <section className="bg-purple-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Das ist bei allen Paketen inklusive:</h3>
                <ul className="grid md:grid-cols-3 gap-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Professionelle Bildbearbeitung
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Alle Bilder im Paket drinnen in voller Auflösung
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Online-Galerie zum Teilen
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Nutzungsrechte inklusive
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Persönliche Beratung
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Keine versteckten Kosten
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Intro with contextual keyword-rich links */}
        <section className="py-10 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              Hier finden Sie alle Preise für unsere Fotoshootings in Wien – von{' '}
              <Link to="/familienfotos-wien/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium">Familienfotos Wien</Link> über{' '}
              <Link to="/babyfotos-wien/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium">Babyfotografie Wien</Link>{' '}
              und{' '}
              <Link to="/neugeborenenfotos-wien/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium">Neugeborenenfotografie Wien</Link>{' '}
              bis hin zu{' '}
              <Link to="/business-portrait-wien/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium">Business Portraits</Link>.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              Jedes Shooting ist individuell. Viele Kunden kombinieren mehrere Shootings wie{' '}
              <Link to="/schwangerschaftsfotos-wien/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium">Schwangerschaftsfotos Wien</Link>{' '}
              und{' '}
              <Link to="/babyfotos-wien/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium">Babyfotos Wien</Link>, oder
              buchen ergänzend{' '}
              <Link to="/kinder-fotografie-wien/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium">Kinderfotografie Wien</Link>{' '}
              und{' '}
              <Link to="/hochzeitsfotografie-wien/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium">Hochzeitsfotografie Wien</Link>.
              Für Teams empfehlen wir{' '}
              <Link to="/teamfotos-wien/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium">Teamfotos Wien</Link>{' '}
              oder{' '}
              <Link to="/bewerbungsfotos-wien/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium">Bewerbungsfotos Wien</Link>.
              Jetzt{' '}
              <Link to="/warteliste/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium">Termin sichern</Link>{' '}
              oder ins{' '}
              <Link to="/portfolio/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium">Portfolio</Link>{' '}
              schauen.
            </p>
          </div>
        </section>

        {/* Live voucher packages – grouped by category, pulled from /api/vouchers/products */}
        {isLoading && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-500">Pakete werden geladen…</p>
            </div>
          </section>
        )}

        {!isLoading && grouped.length === 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-600 mb-6">
                Unser aktueller Gutschein-Katalog wird gerade aktualisiert. Bitte sehen Sie sich die
                Pakete direkt in unserem Shop an.
              </p>
              <Link
                to="/vouchers"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
              >
                <Gift className="w-5 h-5" />
                Zu den Fotoshooting-Gutscheinen
              </Link>
            </div>
          </section>
        )}

        {grouped.map((group, idx) => (
          <section
            key={group.key}
            className={`py-16 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div
                  className={`w-16 h-16 ${group.bgIcon} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  {group.icon}
                </div>
                <h2 className="text-4xl font-bold mb-4 text-gray-900">{group.title}</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{group.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {group.items.map((product) => {
                  const detailHref = `/gutschein/${product.slug || product.id}`;
                  const desc = stripMarkup(product.description);
                  const descShort = desc.length > 140 ? desc.slice(0, 137) + '…' : desc;
                  return (
                    <div
                      key={product.id}
                      className={`bg-white border-2 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col ${
                        product.featured ? 'border-purple-400 relative' : 'border-gray-200'
                      }`}
                    >
                      {product.featured && (
                        <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                          BELIEBT
                        </div>
                      )}
                      {product.image && (
                        <Link to={detailHref} className="block aspect-[4/3] bg-gray-100 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        </Link>
                      )}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{product.name}</h3>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className={`text-3xl font-bold ${group.accent}`}>
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        {descShort && (
                          <p className="text-sm text-gray-600 mb-6 leading-relaxed">{descShort}</p>
                        )}
                        <div className="mt-auto">
                          <Link
                            to={detailHref}
                            className="block w-full text-center bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                          >
                            Mehr erfahren
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ))}

        {!isLoading && grouped.length > 0 && (
          <section className="py-10 bg-white border-t border-gray-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-700 mb-4">
                Alle Pakete, Gutscheine und Sonderangebote finden Sie auf unserer Gutschein-Seite.
              </p>
              <Link
                to="/vouchers"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
              >
                <Gift className="w-5 h-5" />
                Alle Gutscheine ansehen
              </Link>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Häufige Fragen zu Preisen
            </h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  Sind alle Bilder im Preis enthalten?
                </h3>
                <p className="text-gray-600">
                  Ja! Sie erhalten alle im Paket angegebenen Bilder professionell bearbeitet in 
                  voller Auflösung. Es gibt keine versteckten Kosten oder Nachkaufverpflichtungen.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  Kann ich zusätzliche Bilder erwerben?
                </h3>
                <p className="text-gray-600">
                  Ja. Weitere bearbeitete Bilder können auf Wunsch nachträglich dazugebucht werden.
                  Die aktuellen Konditionen besprechen wir gerne persönlich im Rahmen Ihrer Anfrage.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  Gibt es Rabatte für mehrere Shootings?
                </h3>
                <p className="text-gray-600">
                  Wenn Sie mehrere Shootings kombinieren möchten (z. B. Schwangerschaft + Newborn),
                  erstellen wir Ihnen gerne ein individuelles Angebot. Sprechen Sie uns einfach an.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  Wie funktionieren die Gutscheine?
                </h3>
                <p className="text-gray-600">
                  Gutscheine können für beliebige Beträge oder spezifische Pakete erworben werden. 
                  Sie sind 3 Jahre gültig und können für alle unsere Leistungen eingelöst werden.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/faq"
                className="text-purple-600 font-semibold hover:underline text-lg"
              >
                Alle FAQs ansehen →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Noch Fragen zu unseren Preisen?</h2>
            <p className="text-xl mb-8">
              Wir beraten Sie gerne persönlich und finden das perfekte Paket für Ihre Wünsche!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/kontakt"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Jetzt beraten lassen
              </Link>
              <Link
                to="/vouchers"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Gutschein verschenken
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Beliebte Fotoshootings – compact internal link block */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Beliebte Fotoshootings
          </h3>
          <ul className="grid sm:grid-cols-2 gap-3 mb-6 max-w-2xl mx-auto">
            <li>
              <Link to="/familienfotos-wien/" className="text-purple-700 hover:text-purple-900 font-medium underline underline-offset-2">
                Familienfotos Wien
              </Link>
            </li>
            <li>
              <Link to="/babyfotos-wien/" className="text-purple-700 hover:text-purple-900 font-medium underline underline-offset-2">
                Babyfotografie Wien
              </Link>
            </li>
            <li>
              <Link to="/bewerbungsfotos-wien/" className="text-purple-700 hover:text-purple-900 font-medium underline underline-offset-2">
                Bewerbungsfotos Wien
              </Link>
            </li>
            <li>
              <Link to="/business-portrait-wien/" className="text-purple-700 hover:text-purple-900 font-medium underline underline-offset-2">
                Business Portrait Wien
              </Link>
            </li>
          </ul>
          <p className="text-center text-gray-700">
            <Link to="/warteliste/" className="text-purple-700 hover:text-purple-900 font-semibold underline underline-offset-2">
              Termin sichern
            </Link>
          </p>
        </div>
      </section>

      <PillarLinksBlock currentPath="/preise/" />
      <RelatedTopicsBlock pathname="/preise/" language="de" />
    </Layout>
  );
};

export default PreisePage;
