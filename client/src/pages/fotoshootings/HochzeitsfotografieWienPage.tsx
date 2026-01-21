import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import GoogleReviews from '../../components/layout/GoogleReviews';
import MarkdownCopySlot from '../../components/MarkdownCopySlot';
import { newageCopyMap } from '../../content/newageCopyMap';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Camera, Heart, Users, Star, ArrowRight, Check, Clock, MapPin, Gift, Calendar, Sparkles, Shield } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useManualPageContent } from '../../hooks/useManualPageContent';
import { useLanguage } from '../../context/LanguageContext';

export default function HochzeitsfotografieWienPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const t = useManualPageContent('hochzeitsfotografie');
  const { language } = useLanguage();

  // Language-aware fallbacks
  const fallbacks = {
    en: {
      heroTitle: 'Wedding Photography in Vienna',
      heroSubtitle: 'Authentic. Stylish. Unobtrusive.',
      heroDescription: 'We capture your story – from the first glance to the last dance. Modern wedding reportages with emotion, clear visual language and quick sneak peeks.',
      primaryCta: 'Request Appointment',
      secondaryCta: 'Check Availability',
    },
    de: {
      heroTitle: 'Hochzeitsfotografie in Wien',
      heroSubtitle: 'Echt. Stilvoll. Unaufdringlich.',
      heroDescription: 'Wir begleiten eure Geschichte – vom ersten Blick bis zum letzten Tanz. Moderne Hochzeitsreportagen mit viel Gefühl, klarer Bildsprache und schnellen Sneak Peeks.',
      primaryCta: 'Termin unverbindlich anfragen',
      secondaryCta: 'Verfügbarkeit prüfen',
    }
  };

  const fb = fallbacks[language] || fallbacks.de;

  const fromManual = (key: string, fallback: string) => {
    const value = t(key);
    if (!value || value === key) {
      return fallback;
    }
    return value;
  };

  const heroTitle = fromManual('manual.hochzeitsfotografie.heroTitle', fb.heroTitle);
  const heroSubtitle = fromManual('manual.hochzeitsfotografie.heroTagline', fb.heroSubtitle);
  const heroDescription = fromManual('manual.hochzeitsfotografie.heroDescription', fb.heroDescription);
  const primaryCta = fromManual('manual.hochzeitsfotografie.primaryCta', fb.primaryCta);
  const secondaryCta = fromManual('manual.hochzeitsfotografie.secondaryCta', fb.secondaryCta);
  const heroImage1 = fromManual('manual.hochzeitsfotografie.heroImage1', '');
  const heroImage2 = fromManual('manual.hochzeitsfotografie.heroImage2', '');
  const heroImage3 = fromManual('manual.hochzeitsfotografie.heroImage3', '');
  const heroImage4 = fromManual('manual.hochzeitsfotografie.heroImage4', '');
  const heroImage5 = fromManual('manual.hochzeitsfotografie.heroImage5', '');

  const handleBookPackage = (packageName: string, price: number, description: string) => {
    addItem({
      title: packageName,
      price: price,
      quantity: 1,
      packageType: 'Hochzeit',
      type: 'voucher'
    });
    navigate('/cart');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <SEOHead
          title={newageCopyMap['hochzeitsfotografie-wien'].title}
          description={newageCopyMap['hochzeitsfotografie-wien'].metaDescription}
          keywords="hochzeitsfotograf wien, hochzeitsfotografie wien, standesamt wien fotos, brautpaarshooting wien"
          canonical="/hochzeitsfotografie-wien/"
          ogImage="https://www.newagefotografie.com/images/wedding-hero.jpg"
          hreflang={[
            { lang: 'de', url: '/hochzeitsfotografie-wien/' },
            { lang: 'en', url: '/en/wedding-photography-vienna/' }
          ]}
        />

        {/* JSON-LD Structured Data */}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Hochzeitsfotografie Wien',
              serviceType: 'Wedding Photography',
              areaServed: { '@type': 'City', name: 'Wien' },
              provider: { '@type': 'LocalBusiness', name: 'New Age Fotografie' },
              offers: {
                '@type': 'AggregateOffer',
                lowPrice: '690',
                highPrice: '2450',
                priceCurrency: 'EUR'
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Hochzeitsfotografie Pakete',
                itemListElement: [
                  { '@type': 'Offer', name: 'Standesamt Mini (bis 2 Std.)' },
                  { '@type': 'Offer', name: 'Classic (bis 6 Std.)' },
                  { '@type': 'Offer', name: 'Premium Day (bis 10 Std.)' }
                ]
              }
            })}
          </script>
        </Helmet>

        {/* Hero */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  {heroTitle}
                </h1>
                <p className="text-xl text-gray-300 mb-4 leading-relaxed font-semibold">
                  {heroSubtitle}
                </p>
                <p className="text-lg text-gray-300/90 mb-8 leading-relaxed">
                  {heroDescription}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/warteliste" className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg">
                    {primaryCta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link to="/kontakt" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg">
                    {secondaryCta}
                  </Link>
                </div>
              </div>
              {/* Right: Hero Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <img
                    src={heroImage1}
                    alt="hochzeitsfotograf wien – Brautpaar im Palais Coburg, Abendlicht"
                    className="rounded-2xl shadow-2xl w-full h-auto object-contain"
                    loading="eager"
                  />
                </div>
                <div>
                  <img
                    src={heroImage2}
                    alt="Hochzeitsfotografie Wien"
                    className="rounded-xl shadow-lg w-full h-auto object-contain"
                    loading="eager"
                  />
                </div>
                <div>
                  <img
                    src={heroImage3}
                    alt="Hochzeit Shooting Wien"
                    className="rounded-xl shadow-lg w-full h-auto object-contain"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <GoogleReviews />

        {/* Extended Content Section - Safe Copy Slot */}
        <MarkdownCopySlot content={newageCopyMap['hochzeitsfotografie-wien'].markdown} />

        {/* Feature Image 4 */}
        {heroImage4 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <img
                src={heroImage4}
                alt="Hochzeitsfotografie Wien – Emotional Wedding Moment"
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                loading="lazy"
              />
            </div>
          </section>
        )}

        {/* Was wir festhalten */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Was wir festhalten</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <Heart className="h-10 w-10 text-pink-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Emotionen & echte Momente</h3>
                <p className="text-gray-600 text-sm">First Look, Freudentränen, Umarmungen, Lachen – wertvolle Augenblicke, ungestellt eingefangen.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Users className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Familie & Freunde</h3>
                <p className="text-gray-600 text-sm">Brautpaar, Trauzeug:innen, Generationen – Gruppenbilder mit Ruhe und klarer Anleitung.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Camera className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Details & Atmosphäre</h3>
                <p className="text-gray-600 text-sm">Papeterie, Ringe, Floristik, Location, Lichtstimmungen – alles, was ihr geplant habt.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Sparkles className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Brautpaar-Shoot</h3>
                <p className="text-gray-600 text-sm">Locker geführt, mit natürlicher Pose – 20–40 Minuten reichen für zeitlose Portraits.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Calendar className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Standesamt & Kirche</h3>
                <p className="text-gray-600 text-sm">Dezente Begleitung, respektvoll & erfahren – wir kennen Abläufe und Licht.</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                <Shield className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Sorglos-Paket</h3>
                <p className="text-gray-700 text-sm font-medium">Dual-Card Sicherung, redundante Backups & geschützte Online-Galerie – eure Bilder sind safe.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SLAs */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Lieferzeiten (SLA)</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Asset</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Umfang</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">SLA Standard</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">SLA Express*</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Sneak Peek</td>
                    <td className="px-6 py-4 text-sm text-gray-700">15–30 Bilder</td>
                    <td className="px-6 py-4 text-sm text-gray-600">24–48 h</td>
                    <td className="px-6 py-4 text-sm text-purple-600 font-semibold">≤ 12 h</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Finale Galerie</td>
                    <td className="px-6 py-4 text-sm text-gray-700">300–900+ Bilder</td>
                    <td className="px-6 py-4 text-sm text-gray-600">2–4 Wochen</td>
                    <td className="px-6 py-4 text-sm text-purple-600 font-semibold">5–7 Tage</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Drucke & Alben</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Fine-Art Prints / Album</td>
                    <td className="px-6 py-4 text-sm text-gray-600">+1–3 Wochen</td>
                    <td className="px-6 py-4 text-sm text-purple-600 font-semibold">nach Absprache</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-purple-100 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-700"><strong>*Express</strong> nach Verfügbarkeit; Aufpreis je nach Umfang.</p>
            </div>
          </div>
        </section>

        {/* Feature Image 5 */}
        {heroImage5 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <img
                src={heroImage5}
                alt="Hochzeitsfotografie Wien – Beautiful Wedding Celebration"
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                loading="lazy"
              />
            </div>
          </section>
        )}

        {/* Pakete & Preise */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pakete & Preise (Richtwerte)</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Standesamt Mini */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-200">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Standesamt Mini</h3>
                  <p className="text-purple-600 font-medium">bis 2 Std.</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-purple-600">€690</span>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">Zeremonie + Gruppen & Paarfotos</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">150+ Bilder, Retusche Basis</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">Sneak Peek 24–48 h</span></div>
                </div>
                <button
                  onClick={() => handleBookPackage('Standesamt Mini Hochzeit', 690, 'Standesamt Mini (bis 2 Std.) - Zeremonie + Gruppen & Paarfotos, 150+ Bilder')}
                  className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  Anfragen
                </button>
              </div>

              {/* Classic (Beliebt) */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8 transform scale-105 relative">
                <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-bl-lg rounded-tr-2xl">BELIEBT</div>
                <div className="mb-6 mt-4">
                  <h3 className="text-2xl font-bold mb-2">Classic</h3>
                  <p className="text-purple-100 font-medium">bis 6 Std.</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">€1.590</span>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start"><Check className="h-5 w-5 text-yellow-300 mr-3 mt-0.5" /><span>Getting Ready bis Agape</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-yellow-300 mr-3 mt-0.5" /><span>350+ Bilder, fein kuratiert</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-yellow-300 mr-3 mt-0.5" /><span>Sneak Peek 24 h</span></div>
                </div>
                <button
                  onClick={() => handleBookPackage('Classic Hochzeit', 1590, 'Classic (bis 6 Std.) - Getting Ready bis Agape, 350+ Bilder, Sneak Peek 24 h')}
                  className="block w-full text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Anfragen
                </button>
              </div>

              {/* Premium Day */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-200">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Day</h3>
                  <p className="text-purple-600 font-medium">bis 10 Std.</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-purple-600">€2.450</span>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">Ganztagsreportage inkl. Abend</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">600+ Bilder, Storytelling</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">Paarshoot in goldenem Licht</span></div>
                </div>
                <button
                  onClick={() => handleBookPackage('Premium Day Hochzeit', 2450, 'Premium Day (bis 10 Std.) - Ganztagsreportage inkl. Abend, 600+ Bilder, Paarshoot')}
                  className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  Anfragen
                </button>
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">Add-ons:</h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center"><Check className="h-4 w-4 text-purple-600 mr-2" /><span>Zusatzstunde <strong>€150</strong></span></div>
                <div className="flex items-center"><Check className="h-4 w-4 text-purple-600 mr-2" /><span>Zweites Set/Assistent:in <strong>€290</strong></span></div>
                <div className="flex items-center"><Check className="h-4 w-4 text-purple-600 mr-2" /><span>Express-Galerie <strong>48 h</strong></span></div>
                <div className="flex items-center"><Check className="h-4 w-4 text-purple-600 mr-2" /><span>Album & Fine-Art Prints</span></div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Termine sind limitiert. Trag euch hier ein: <Link to="/warteliste" className="text-purple-600 hover:text-purple-700 underline font-semibold">Warteliste</Link>
              </p>
            </div>
          </div>
        </section>

        {/* Beispiel-Timeline */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Beispiel-Timelines</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Standesamt (2–3 Std.)</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Ankunft & Begrüßung – 15 Min</li>
                  <li>• Zeremonie – 20–30 Min</li>
                  <li>• Gratulation & Gruppen – 20–40 Min</li>
                  <li>• Paarshoot in der Nähe – 20–30 Min</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Classic (6 Std.)</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Getting Ready – 60 Min</li>
                  <li>• First Look & Paarshoot – 40 Min</li>
                  <li>• Trauung – 30–45 Min</li>
                  <li>• Agape & Gruppen – 60–90 Min</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Beliebte Wien-Locations */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Beliebte Locations in Wien</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="bg-gray-50 rounded-xl p-5 flex items-start"><MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />Hofburg • Palais Coburg • Belvedere</div>
              <div className="bg-gray-50 rounded-xl p-5 flex items-start"><MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />Rathaus • Alte Donau • Augarten</div>
              <div className="bg-gray-50 rounded-xl p-5 flex items-start"><MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />Schlosspark Laxenburg • Kahlenberg</div>
              <div className="bg-gray-50 rounded-xl p-5 flex items-start"><MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />Stadtpark • Museumsquartier • Volksgarten</div>
              <div className="bg-gray-50 rounded-xl p-5 flex items-start"><MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />Standesamt Wien • <a className="underline text-purple-600 hover:text-purple-700" target="_blank" rel="noopener noreferrer" href="https://www.wien.gv.at/verwaltung/ma63/ehe/standesamt.html">Termin & Infos</a></div>
              <div className="bg-purple-50 rounded-xl p-5 flex items-start border-2 border-purple-200"><Gift className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />Tipp: Plant 20–30 Min Puffer um Licht optimal zu nutzen.</div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Wie schnell bekommen wir Fotos?</h3>
                <p className="text-gray-600">Sneak Peeks gibt’s in 24–48 Stunden, die vollständige Galerie in 2–4 Wochen – schneller als Express möglich.</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Arbeitet ihr unauffällig?</h3>
                <p className="text-gray-600">Ja – leise Kameras, klare Abläufe, koordinierte Gruppenfotos. Emotionen vor Inszenierung.</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Wie viele Bilder bekommen wir?</h3>
                <p className="text-gray-600">Richtwert: 70–100 Bilder pro Stunde je nach Programmdichte und Gästezahl.</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Was ist mit Datensicherheit?</h3>
                <p className="text-gray-600">Dual-Card Aufnahme, redundante Backups am selben Tag und sichere Online-Galerie mit Passwort.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Verwandte Services */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8">Verwandte Shootings</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/schwangerschaftsfotos-wien/" className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <Heart className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Schwangerschaft</h3>
                <p className="text-gray-600 text-sm mb-4">Zeitlose Momente – elegant & modern</p>
                <span className="text-purple-600 font-semibold flex items-center">Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" /></span>
              </Link>
              <Link to="/familienfotos-wien/" className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <Users className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Familienfotos</h3>
                <p className="text-gray-600 text-sm mb-4">Natürlich & lebendig – im Studio oder Outdoor</p>
                <span className="text-purple-600 font-semibold flex items-center">Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" /></span>
              </Link>
              <Link to="/babyfotos-wien/" className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <Camera className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Babyfotos</h3>
                <p className="text-gray-600 text-sm mb-4">3–12 Monate – sicher & liebevoll</p>
                <span className="text-purple-600 font-semibold flex items-center">Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Bereit für eure Hochzeitsfotos in Wien?</h2>
            <p className="text-xl mb-8 opacity-90">Sichert euch euren Termin – Sneak Peeks binnen 24–48 Stunden.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/warteliste" className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg">
                Termin anfragen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/kontakt" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg">
                Verfügbarkeit prüfen
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
