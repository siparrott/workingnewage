import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Check, ArrowRight, Building2, Sparkles, Home } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { RelatedServices } from '../../components/SEO/RelatedServices';
import GoogleReviews from '../../components/layout/GoogleReviews';
import { useCart } from '../../context/CartContext';
import { useManualPageContent } from '../../hooks/useManualPageContent';
import MarkdownCopySlot from '../../components/MarkdownCopySlot';
import { newageCopyMap } from '../../content/newageCopyMap';
import { useLanguage } from '../../context/LanguageContext';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, keywords, canonical }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <html lang="de" />
      <meta name="geo.region" content="AT-9" />
      <meta name="geo.placename" content="Wien" />
    </Helmet>
  );
};

const ImmobilienfotografieWienPage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const t = useManualPageContent('immobilienfotografie');
  const { language } = useLanguage();

  // Language-aware fallbacks
  const fallbacks = {
    en: {
      heroTitle: 'Real Estate Photography Vienna – Architecture, Interior, Floor Plans',
      heroSubtitle: 'Space. Light. Perspective.',
      heroDescription: 'Professional real estate photography in Vienna: Window-Pull HDR, vertical correction, 2D/3D floor plans. From €190. For realtors, owners & property managers.',
      primaryCta: 'Book Appointment',
      secondaryCta: 'Packages & Prices',
    },
    de: {
      heroTitle: 'Immobilienfotograf Wien – Architektur, Interieur, Grundrisse',
      heroSubtitle: 'Raum. Licht. Perspektive.',
      heroDescription: 'Professionelle Immobilienfotografie in Wien: Window-Pull HDR, vertikale Korrektur, 2D/3D Grundrisse. Ab €190. Für Makler, Eigentümer & Verwalter.',
      primaryCta: 'Termin buchen',
      secondaryCta: 'Pakete & Preise',
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

  const heroTitle = fromManual('manual.immobilienfotografie.heroTitle', fb.heroTitle);
  const heroSubtitle = fromManual('manual.immobilienfotografie.heroTagline', fb.heroSubtitle);
  const heroDescription = fromManual('manual.immobilienfotografie.heroDescription', fb.heroDescription);
  const primaryCta = fromManual('manual.immobilienfotografie.primaryCta', fb.primaryCta);
  const secondaryCta = fromManual('manual.immobilienfotografie.secondaryCta', fb.secondaryCta);
  const heroImage1 = fromManual('manual.immobilienfotografie.heroImage1', '');
  const heroImage2 = fromManual('manual.immobilienfotografie.heroImage2', '');
  const heroImage3 = fromManual('manual.immobilienfotografie.heroImage3', '');
  const heroImage4 = fromManual('manual.immobilienfotografie.heroImage4', '');
  const heroImage5 = fromManual('manual.immobilienfotografie.heroImage5', '');

  const handleBookPackage = (packageName: string, price: number, description: string) => {
    addItem({
      title: packageName,
      price: price,
      quantity: 1,
      packageType: 'Immobilien',
      type: 'voucher'
    });
    navigate('/cart');
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={newageCopyMap['immobilien-fotografie-wien'].title}
        description={newageCopyMap['immobilien-fotografie-wien'].metaDescription}
        keywords="immobilienfotograf wien, architektur fotografie wien, interieur fotografie, grundrisse, real estate fotograf, immobilienfoto, makler fotografie wien"
        canonical="/immobilien-fotografie-wien/"
        hreflang={{
          de: '/immobilien-fotografie-wien/',
          en: '/en/real-estate-photography-vienna/'
        }}
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Real Estate Photography",
            "provider": {
              "@type": "Organization",
              "name": "New Age Fotografie",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Wien",
                "addressCountry": "AT"
              }
            },
            "areaServed": {
              "@type": "City",
              "name": "Wien"
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "EUR",
              "lowPrice": "190",
              "highPrice": "420"
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Immobilienfotograf Wien</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {heroTitle}
              </h1>
              {heroSubtitle && (
                <p className="text-xl text-blue-200 mb-4 font-semibold">{heroSubtitle}</p>
              )}
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                {heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/warteliste/"
                  className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-all transform hover:scale-105"
                >
                  {primaryCta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#pakete"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
                >
                  {secondaryCta}
                </a>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="flex items-center justify-center">
              {heroImage1 && (
                <img
                  src={heroImage1}
                  alt="Immobilienfotograf Wien – Luxusapartment"
                  className="rounded-2xl shadow-2xl w-full h-auto object-contain"
                  loading="eager"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <GoogleReviews />

      {/* Leistungen */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Was wir perfekt können
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professionelle Immobilienfotografie mit Technik und Inszenierung, die Objekte optimal verkauft.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <Building2 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Architektur & Interieur</h3>
              <p className="text-gray-600 leading-relaxed">
                Außenaufnahmen, Räume, Details – mit vertikaler Korrektur (tilt-shift), damit Linien parallel bleiben und professionell wirken.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border border-amber-100">
              <Sparkles className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Window-Pull HDR</h3>
              <p className="text-gray-600 leading-relaxed">
                Fenster und Innenraum perfekt belichtet – kein Ausbrennen, keine dunklen Ecken. Mehrere Belichtungen verschmolzen zu einem natürlichen Bild.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
              <Camera className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Styling Light</h3>
              <p className="text-gray-600 leading-relaxed">
                Wir setzen bei Bedarf zusätzliche Lichtakzente, damit Räume warm und einladend wirken – kein kaltes Klinik-Feeling.
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
              <Home className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Twilight & Exteriors</h3>
              <p className="text-gray-600 leading-relaxed">
                Aufnahmen zur blauen Stunde – Gebäude mit beleuchteten Fenstern, dramatischer Himmel. Oft die Highlights im Exposé.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
              <Building2 className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Grundrisse (2D/3D)</h3>
              <p className="text-gray-600 leading-relaxed">
                2D Grundrisse nach RICS/IPMS oder 3D-Visualisierung mit Möblierung – für Online-Portale und Exposés unverzichtbar.
              </p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-xl border border-rose-100">
              <Check className="w-12 h-12 text-rose-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lieferformate</h3>
              <p className="text-gray-600 leading-relaxed">
                Optimiert für willhaben.at, immobilienscout24.at, Makler-Exposé PDF, Print und Social Media – sofort einsatzbereit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Image 2 */}
      {heroImage2 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <img
              src={heroImage2}
              alt="Immobilienfotografie Wien – Professional Interior"
              className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* Sets & Technik Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sets & Technik
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Welche Technik wir einsetzen, damit Ihr Objekt bestmöglich wirkt.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700 to-slate-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Technik</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Zweck</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Einsatz</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Vertikale Korrektur (Tilt-Shift)</td>
                    <td className="px-6 py-4 text-gray-600">Linien gerade, Räume nicht verzerrt</td>
                    <td className="px-6 py-4 text-gray-600">Architektur, Innenräume</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Window-Pull HDR</td>
                    <td className="px-6 py-4 text-gray-600">Fenster nicht überbelichtet, Raum hell</td>
                    <td className="px-6 py-4 text-gray-600">Alle Innenräume mit Fenstern</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Farbtreue & Weißabgleich</td>
                    <td className="px-6 py-4 text-gray-600">Natürliche Farben, keine Gelb-/Blaustiche</td>
                    <td className="px-6 py-4 text-gray-600">Standard</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">De-Clutter Retusche</td>
                    <td className="px-6 py-4 text-gray-600">Störende Objekte entfernen (diskret)</td>
                    <td className="px-6 py-4 text-gray-600">Optional bei bewohnten Objekten</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Detailshots</td>
                    <td className="px-6 py-4 text-gray-600">Besonderheiten betonen (Armaturen, Parkett)</td>
                    <td className="px-6 py-4 text-gray-600">Premium-Objekte</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Extended Content Section - Safe Copy Slot */}
      <MarkdownCopySlot content={newageCopyMap['immobilien-fotografie-wien'].markdown} />

      {/* Pakete */}
      <section id="pakete" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pakete & Preise
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Fixpreise nach Objektgröße – transparent und planbar.
            </p>
          </div>
          <div className="flex justify-center">
            {/* Immobilienfotografie */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-2xl p-8 border-2 border-blue-500 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Immobilienfotografie</h3>
              <p className="text-gray-600 mb-4">Wohnungen & Häuser</p>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-sm text-gray-500 mr-1">Ab</span>
                  <span className="text-4xl font-bold text-blue-600">€495</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Innen und Exterieur</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Alle Bilder in Vollauflösung dabei</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">360°-Bilder, Google Maps-Update</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Gültig bis 2 Jahre</span>
                </li>
              </ul>
              <Link
                to="/warteliste"
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Jetzt buchen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Image 3 */}
      {heroImage3 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <img
              src={heroImage3}
              alt="Immobilienfotografie Wien – Professional Space"
              className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* Ablauf & SLAs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ablauf & Service Level
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              So läuft Ihr Immobilien-Shooting ab – mit klaren Zeitangaben.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700 to-slate-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Phase</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Beschreibung</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Zeit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Terminanfrage</td>
                    <td className="px-6 py-4 text-gray-600">Paket auswählen, Objekt-Infos & Wunschtermin mitteilen</td>
                    <td className="px-6 py-4 text-gray-600">1 Tag</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Terminbestätigung</td>
                    <td className="px-6 py-4 text-gray-600">Fixtermin + Briefing (Vorbereitung, Zugang, Styling)</td>
                    <td className="px-6 py-4 text-gray-600">binnen 24h</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Shooting vor Ort</td>
                    <td className="px-6 py-4 text-gray-600">Aufnahmen + bei Bedarf Licht-Styling. Dauer je nach Paket.</td>
                    <td className="px-6 py-4 text-gray-600">1-3h</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Bearbeitung & QS</td>
                    <td className="px-6 py-4 text-gray-600">HDR-Merge, Retusche, Farbkorrektur, Export in alle Formate</td>
                    <td className="px-6 py-4 text-gray-600">4-7 Werktage</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Lieferung</td>
                    <td className="px-6 py-4 text-gray-600">Download-Link per E-Mail, Bilder Web-optimiert & Print-ready</td>
                    <td className="px-6 py-4 text-gray-600">sofort</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Support & Nachbestellungen</td>
                    <td className="px-6 py-4 text-gray-600">Grundrisse, Drohne, Video jederzeit nachbuchbar</td>
                    <td className="px-6 py-4 text-gray-600">flexibel</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Image 4 */}
      {heroImage4 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <img
              src={heroImage4}
              alt="Immobilienfotografie Wien – Architecture Detail"
              className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* Lieferformate & Exporte */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lieferformate & Exporte
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Alle Bilder kommen in den richtigen Formaten – für jeden Kanal sofort einsetzbar.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Kanal</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Format / Specs</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Hinweise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Online-Portale<br /><span className="text-sm text-gray-600">(willhaben, immobilienscout24)</span></td>
                    <td className="px-6 py-4 text-gray-600">JPEG 2000px Breite, sRGB, 72 dpi, ~500-800 KB</td>
                    <td className="px-6 py-4 text-gray-600">Web-optimiert, schnelle Ladezeiten</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Makler-Exposé PDF</td>
                    <td className="px-6 py-4 text-gray-600">JPEG 3000px, sRGB, 150 dpi, ~1-2 MB</td>
                    <td className="px-6 py-4 text-gray-600">Hochauflösend für Print & Digital-Exposé</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Print / Anzeige</td>
                    <td className="px-6 py-4 text-gray-600">JPEG 4000-5000px, Adobe RGB, 300 dpi, ~3-5 MB</td>
                    <td className="px-6 py-4 text-gray-600">Magazin, Flyer, Plakat</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Social / Reels</td>
                    <td className="px-6 py-4 text-gray-600">JPEG 1920x1080 (16:9), 1080x1080 (1:1), sRGB</td>
                    <td className="px-6 py-4 text-gray-600">Instagram, Facebook, LinkedIn</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Grundrisse<br /><span className="text-sm text-gray-600">(2D / 3D Add-on)</span></td>
                    <td className="px-6 py-4 text-gray-600">PDF + PNG, A4/A3, skalierbar, mit Maßangaben</td>
                    <td className="px-6 py-4 text-gray-600">RICS/IPMS Standard, druckbar & web-ready</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">
              <strong>Hinweis:</strong> Alle Bilder werden nach <a href="https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/land-standards/ipms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">RICS/IPMS-Standards</a> für Immobilienfotografie bearbeitet – natürliche Farben, keine Überbearbeitung, optimal für professionelle Vermarktung.
            </p>
          </div>
        </div>
      </section>

      {/* Vorbereitung für Eigentümer/Verwalter */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vorbereitung für Eigentümer & Verwalter
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Damit Ihr Objekt optimal zur Geltung kommt – unsere Checkliste für den Shooting-Tag.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Check className="w-6 h-6 text-green-600" />
                Aufräumen & De-Clutter
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Persönliche Gegenstände (Fotos, Post) entfernen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Arbeitsflächen & Tische frei, sauber, minimalistisch</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Kabel, Steckdosen, Müll nicht sichtbar</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Check className="w-6 h-6 text-green-600" />
                Licht & Atmosphäre
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Alle Lampen funktionsfähig, warmes Licht bevorzugt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Fenster putzen, Vorhänge offen oder dekorativ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Bei bewölktem Wetter kein Problem – wir bringen Licht mit</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Check className="w-6 h-6 text-green-600" />
                Details & Styling
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Kissen, Deko, Pflanzen dekorativ arrangieren</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Bad & Küche sauber, Handtücher frisch, Geschirr weg</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Außenbereich: Terrasse/Balkon gefegt, Garten gepflegt</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Check className="w-6 h-6 text-green-600" />
                Zugang & Timing
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Schlüsselübergabe oder Anwesenheit klären</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Shooting-Dauer: 1-3h je nach Paket</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Tageszeit: Vormittag/Mittag optimal, Twilight ab Dämmerung</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Image 5 */}
      {heroImage5 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <img
              src={heroImage5}
              alt="Immobilienfotografie Wien – Luxury Property"
              className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Häufige Fragen
            </h2>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Ist ein bewohntes Objekt ein Problem?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Nein – wir fotografieren auch bewohnte Wohnungen. Wichtig ist nur, dass aufgeräumt & sauber ist. Kleine störende Details können wir per De-Clutter Retusche entfernen (optional, gegen Aufpreis).
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Brauche ich einen Grundriss?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Für Online-Portale & Exposés sehr empfohlen. 2D-Grundrisse (€60) sind Standard nach RICS/IPMS, 3D-Grundrisse (€120) visualisieren zusätzlich die Raumaufteilung mit Möblierung – ideal für leerstehende Objekte.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Was ist Window-Pull HDR?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Mehrere Belichtungen (hell, mittel, dunkel) werden zu einem Bild verschmolzen – Fenster zeigen die Aussicht statt weißer Flächen, Raum bleibt trotzdem hell & freundlich. Standard bei allen Immobilien-Shootings.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Wie schnell kann ich einen Termin bekommen?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Meist binnen 3-5 Werktagen. Für eilige Vermarktungen (z.B. vor Open House) können wir Express-Shootings organisieren – bitte bei Anfrage angeben. Lieferung bleibt dann bei 4-7 Werktagen (auf Anfrage auch schneller).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ähnliche Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ähnliche Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Weitere professionelle Fotografie-Dienstleistungen für Ihr Business.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              to="/business-portrait-wien/"
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group"
            >
              <Camera className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Business-Portraits</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Professionelle Portraits für Makler, Verwalter, Teams – ideal für Website und Exposés.
              </p>
              <span className="text-blue-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Mehr erfahren
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              to="/produkt-fotografie-wien/"
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group"
            >
              <Building2 className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Produktfotografie</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                E-Commerce Freisteller & Lifestyle-Sets für Inneneinrichtung, Möbel, Deko-Artikel.
              </p>
              <span className="text-blue-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Mehr erfahren
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              to="/eventfotografie-wien/"
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group"
            >
              <Sparkles className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Eventfotografie</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Open House, Firmenfeiern, Eröffnungen – Ihre Events professionell dokumentiert.
              </p>
              <span className="text-blue-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Mehr erfahren
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ihr Objekt verdient professionelle Bilder
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Wir machen Immobilien in Wien mit HDR, Korrektur & Grundrissen verkaufsstark. Fixpreise, klare SLAs, schnelle Lieferung.
          </p>
          <Link
            to="/warteliste/"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-10 py-5 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
          >
            Jetzt Termin anfragen
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <RelatedServices currentPath="/immobilien-fotografie-wien/" />
    </div>
    </Layout>
  );
};

export default ImmobilienfotografieWienPage;
