import { SEOHead } from '../../components/SEO/SEOHead';
import { RelatedServices } from '../../components/SEO/RelatedServices';
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
                lowPrice: '599',
                highPrice: '2499',
                priceCurrency: 'EUR'
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Hochzeitsfotografie Pakete',
                itemListElement: [
                  { '@type': 'Offer', name: 'Hochzeitsfotografie Basic', price: '599', priceCurrency: 'EUR' },
                  { '@type': 'Offer', name: 'Hochzeit Basic', price: '1299', priceCurrency: 'EUR' },
                  { '@type': 'Offer', name: 'Hochzeit Premium', price: '2499', priceCurrency: 'EUR' }
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
        {language === 'de' && <MarkdownCopySlot content={newageCopyMap['hochzeitsfotografie-wien'].markdown} />}

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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{language === 'de' ? 'Was wir festhalten' : 'What We Capture'}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <Heart className="h-10 w-10 text-pink-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{language === 'de' ? 'Emotionen & echte Momente' : 'Emotions & Real Moments'}</h3>
                <p className="text-gray-600 text-sm">{language === 'de' ? 'First Look, Freudentränen, Umarmungen, Lachen – wertvolle Augenblicke, ungestellt eingefangen.' : 'First look, tears of joy, hugs, laughter – precious moments captured candidly.'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Users className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{language === 'de' ? 'Familie & Freunde' : 'Family & Friends'}</h3>
                <p className="text-gray-600 text-sm">{language === 'de' ? 'Brautpaar, Trauzeug:innen, Generationen – Gruppenbilder mit Ruhe und klarer Anleitung.' : 'Bride & groom, witnesses, generations – group photos with calm and clear guidance.'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Camera className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{language === 'de' ? 'Details & Atmosphäre' : 'Details & Atmosphere'}</h3>
                <p className="text-gray-600 text-sm">{language === 'de' ? 'Papeterie, Ringe, Floristik, Location, Lichtstimmungen – alles, was ihr geplant habt.' : 'Stationery, rings, florals, venue, light moods – everything you planned.'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Sparkles className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{language === 'de' ? 'Brautpaar-Shoot' : 'Couple Shoot'}</h3>
                <p className="text-gray-600 text-sm">{language === 'de' ? 'Locker geführt, mit natürlicher Pose – 20–40 Minuten reichen für zeitlose Portraits.' : 'Relaxed guidance with natural poses – 20–40 minutes for timeless portraits.'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Calendar className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{language === 'de' ? 'Standesamt & Kirche' : 'Registry Office & Church'}</h3>
                <p className="text-gray-600 text-sm">{language === 'de' ? 'Dezente Begleitung, respektvoll & erfahren – wir kennen Abläufe und Licht.' : 'Discreet accompaniment, respectful & experienced – we know the workflows and lighting.'}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                <Shield className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{language === 'de' ? 'Sorglos-Paket' : 'Worry-Free Package'}</h3>
                <p className="text-gray-700 text-sm font-medium">{language === 'de' ? 'Dual-Card Sicherung, redundante Backups & geschützte Online-Galerie – eure Bilder sind safe.' : 'Dual-card backup, redundant backups & protected online gallery – your photos are safe.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SLAs */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">{language === 'de' ? 'Lieferzeiten (SLA)' : 'Delivery Times (SLA)'}</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Asset</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">{language === 'de' ? 'Umfang' : 'Scope'}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">{language === 'de' ? 'SLA Standard' : 'SLA Standard'}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">{language === 'de' ? 'SLA Express*' : 'SLA Express*'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Sneak Peek</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{language === 'de' ? '15–30 Bilder' : '15–30 images'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">24–48 h</td>
                    <td className="px-6 py-4 text-sm text-purple-600 font-semibold">≤ 12 h</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{language === 'de' ? 'Finale Galerie' : 'Final Gallery'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{language === 'de' ? '300–900+ Bilder' : '300–900+ images'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{language === 'de' ? '2–4 Wochen' : '2–4 weeks'}</td>
                    <td className="px-6 py-4 text-sm text-purple-600 font-semibold">{language === 'de' ? '5–7 Tage' : '5–7 days'}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{language === 'de' ? 'Drucke & Alben' : 'Prints & Albums'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Fine-Art Prints / Album</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{language === 'de' ? '+1–3 Wochen' : '+1–3 weeks'}</td>
                    <td className="px-6 py-4 text-sm text-purple-600 font-semibold">{language === 'de' ? 'nach Absprache' : 'by arrangement'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-purple-100 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-700"><strong>*Express</strong> {language === 'de' ? 'nach Verfügbarkeit; Aufpreis je nach Umfang.' : 'subject to availability; surcharge depending on scope.'}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{language === 'de' ? 'Pakete & Preise' : 'Packages & Prices'}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
              {/* Hochzeitsfotografie Basic */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-purple-200">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{language === 'de' ? 'Hochzeitsfotografie Basic' : 'Wedding Photography Basic'}</h3>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-sm text-gray-500 mr-1">{language === 'de' ? 'Ab' : 'From'}</span>
                    <span className="text-4xl font-bold text-purple-600">€599</span>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">{language === 'de' ? 'Hochzeitsbegleitung (Auszug)' : 'Wedding coverage (excerpt)'}</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">{language === 'de' ? 'Inkl. 30 bearbeiteter Fotos' : 'Incl. 30 edited photos'}</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">{language === 'de' ? 'Gültig bis 2 Jahre' : 'Valid for up to 2 years'}</span></div>
                </div>
                <Link
                  to="/warteliste"
                  className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  {language === 'de' ? 'Jetzt sichern' : 'Book now'}
                </Link>
              </div>

              {/* Hochzeit Basic (Beliebt) */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8 transform sm:scale-105 relative">
                <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-bl-lg rounded-tr-2xl">{language === 'de' ? 'BELIEBT' : 'POPULAR'}</div>
                <div className="mb-6 mt-4">
                  <h3 className="text-2xl font-bold mb-2">{language === 'de' ? 'Hochzeit Basic' : 'Wedding Basic'}</h3>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-sm text-purple-200 mr-1">{language === 'de' ? 'Ab' : 'From'}</span>
                    <span className="text-4xl font-bold">€1.299</span>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start"><Check className="h-5 w-5 text-yellow-300 mr-3 mt-0.5" /><span>{language === 'de' ? 'Standesamt oder kleine Feier' : 'Registry office or small celebration'}</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-yellow-300 mr-3 mt-0.5" /><span>{language === 'de' ? 'Alle Portraits als Datei – Halber Tag' : 'All portraits as files – half day'}</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-yellow-300 mr-3 mt-0.5" /><span>{language === 'de' ? 'Stunden nach Wunsch' : 'Hours as desired'}</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-yellow-300 mr-3 mt-0.5" /><span>{language === 'de' ? 'Gültig bis 2 Jahre' : 'Valid for up to 2 years'}</span></div>
                </div>
                <Link
                  to="/warteliste"
                  className="block w-full text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  {language === 'de' ? 'Jetzt sichern' : 'Book now'}
                </Link>
              </div>

              {/* Hochzeit Premium */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-purple-200">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{language === 'de' ? 'Hochzeit Premium' : 'Wedding Premium'}</h3>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-sm text-gray-500 mr-1">{language === 'de' ? 'Ab' : 'From'}</span>
                    <span className="text-4xl font-bold text-purple-600">€2.499</span>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">{language === 'de' ? 'Ganztägige Hochzeit – alle Bilder' : 'Full-day wedding – all images'}</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">{language === 'de' ? 'Online-Galerie, Prints & Leinwand-Collage' : 'Online gallery, prints & canvas collage'}</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">{language === 'de' ? 'Porträts nach Wahl' : 'Portraits of your choice'}</span></div>
                  <div className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" /><span className="text-gray-700">{language === 'de' ? 'Gültig bis 2 Jahre' : 'Valid for up to 2 years'}</span></div>
                </div>
                <Link
                  to="/warteliste"
                  className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  {language === 'de' ? 'Jetzt sichern' : 'Book now'}
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {language === 'de' ? <>Termine sind limitiert. Trag euch hier ein: <Link to="/warteliste" className="text-purple-600 hover:text-purple-700 underline font-semibold">Warteliste</Link></> : <>Dates are limited. Sign up here: <Link to="/warteliste" className="text-purple-600 hover:text-purple-700 underline font-semibold">Waitlist</Link></>}
              </p>
            </div>
          </div>
        </section>

        {/* Beispiel-Timeline */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">{language === 'de' ? 'Beispiel-Timelines' : 'Example Timelines'}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{language === 'de' ? 'Standesamt (2–3 Std.)' : 'Registry Office (2–3 hrs)'}</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>{language === 'de' ? '• Ankunft & Begrüßung – 15 Min' : '• Arrival & greeting – 15 min'}</li>
                  <li>{language === 'de' ? '• Zeremonie – 20–30 Min' : '• Ceremony – 20–30 min'}</li>
                  <li>{language === 'de' ? '• Gratulation & Gruppen – 20–40 Min' : '• Congratulations & groups – 20–40 min'}</li>
                  <li>{language === 'de' ? '• Paarshoot in der Nähe – 20–30 Min' : '• Couple shoot nearby – 20–30 min'}</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Classic (6 {language === 'de' ? 'Std.' : 'hrs'})</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Getting Ready – 60 Min</li>
                  <li>{language === 'de' ? '• First Look & Paarshoot – 40 Min' : '• First look & couple shoot – 40 min'}</li>
                  <li>{language === 'de' ? '• Trauung – 30–45 Min' : '• Ceremony – 30–45 min'}</li>
                  <li>{language === 'de' ? '• Agape & Gruppen – 60–90 Min' : '• Reception & groups – 60–90 min'}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Beliebte Wien-Locations */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">{language === 'de' ? 'Beliebte Locations in Wien' : 'Popular Locations in Vienna'}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="bg-gray-50 rounded-xl p-5 flex items-start"><MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />Hofburg • Palais Coburg • Belvedere</div>
              <div className="bg-gray-50 rounded-xl p-5 flex items-start"><MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />Rathaus • Alte Donau • Augarten</div>
              <div className="bg-gray-50 rounded-xl p-5 flex items-start"><MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />Schlosspark Laxenburg • Kahlenberg</div>
              <div className="bg-gray-50 rounded-xl p-5 flex items-start"><MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />Stadtpark • Museumsquartier • Volksgarten</div>
              <div className="bg-gray-50 rounded-xl p-5 flex items-start"><MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />{language === 'de' ? 'Standesamt Wien' : 'Registry Office Vienna'} • <a className="underline text-purple-600 hover:text-purple-700" target="_blank" rel="noopener noreferrer" href="https://www.wien.gv.at/verwaltung/ma63/ehe/standesamt.html">{language === 'de' ? 'Termin & Infos' : 'Appointments & Info'}</a></div>
              <div className="bg-purple-50 rounded-xl p-5 flex items-start border-2 border-purple-200"><Gift className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />{language === 'de' ? 'Tipp: Plant 20–30 Min Puffer um Licht optimal zu nutzen.' : 'Tip: Plan 20–30 min buffer to make the most of the light.'}</div>
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
            <h2 className="text-2xl font-bold text-center mb-8">{language === 'de' ? 'Verwandte Shootings' : 'Related Shoots'}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/schwangerschaftsfotos-wien/" className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <Heart className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{language === 'de' ? 'Schwangerschaft' : 'Maternity'}</h3>
                <p className="text-gray-600 text-sm mb-4">{language === 'de' ? 'Zeitlose Momente – elegant & modern' : 'Timeless moments – elegant & modern'}</p>
                <span className="text-purple-600 font-semibold flex items-center">{language === 'de' ? 'Mehr erfahren' : 'Learn more'} <ArrowRight className="ml-1 h-4 w-4" /></span>
              </Link>
              <Link to="/familienfotos-wien/" className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <Users className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{language === 'de' ? 'Familienfotos' : 'Family Photos'}</h3>
                <p className="text-gray-600 text-sm mb-4">{language === 'de' ? 'Natürlich & lebendig – im Studio oder Outdoor' : 'Natural & vibrant – in studio or outdoor'}</p>
                <span className="text-purple-600 font-semibold flex items-center">{language === 'de' ? 'Mehr erfahren' : 'Learn more'} <ArrowRight className="ml-1 h-4 w-4" /></span>
              </Link>
              <Link to="/babyfotos-wien/" className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <Camera className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{language === 'de' ? 'Babyfotos' : 'Baby Photos'}</h3>
                <p className="text-gray-600 text-sm mb-4">{language === 'de' ? '3–12 Monate – sicher & liebevoll' : '3–12 months – safe & loving'}</p>
                <span className="text-purple-600 font-semibold flex items-center">{language === 'de' ? 'Mehr erfahren' : 'Learn more'} <ArrowRight className="ml-1 h-4 w-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{language === 'de' ? 'Bereit für eure Hochzeitsfotos in Wien?' : 'Ready for Your Wedding Photos in Vienna?'}</h2>
            <p className="text-xl mb-8 opacity-90">{language === 'de' ? 'Sichert euch euren Termin – Sneak Peeks binnen 24–48 Stunden.' : 'Secure your date – sneak peeks within 24–48 hours.'}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/warteliste" className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg">
                {language === 'de' ? 'Termin anfragen' : 'Request Appointment'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/kontakt" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg">
                {language === 'de' ? 'Verfügbarkeit prüfen' : 'Check Availability'}
              </Link>
            </div>
          </div>
        </section>

        <RelatedServices currentPath="/hochzeitsfotografie-wien/" />
      </div>
    </Layout>
  );
}
