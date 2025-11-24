import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import GoogleReviews from '../../components/layout/GoogleReviews';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Heart, Users, Star, ArrowRight, Check, Clock, Briefcase, Shield, Zap, Eye, MonitorPlay, Award, Building } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../../context/CartContext';

export default function EventfotografieWienPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleBookPackage = (packageName: string, price: number, description: string) => {
    addItem({
      title: packageName,
      price: price,
      quantity: 1,
      packageType: 'Event',
      type: 'voucher'
    });
    navigate('/cart');
  };

  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Eventfotografie Wien – Konferenzen & Brand Launches | New Age Fotografie"
        description="Eventfotograf Wien gesucht? Konferenzen, Messen, Brand-Launches. Klare SLAs, Express-Galerien, On-Site Auswahl. Studio-Team in Wien. Jetzt Termin sichern!"
        keywords="eventfotograf wien, eventfotografie wien, konferenzfotografie wien, messefotografie wien"
        canonical="/eventfotografie-wien/"
        ogImage="https://www.newagefotografie.com/images/event-hero.jpg"
        hreflang={[
          { lang: 'de', url: '/eventfotografie-wien/' },
          { lang: 'en', url: '/en/event-photography-vienna/' }
        ]}
      />

      {/* JSON-LD Structured Data */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Eventfotografie Wien",
            "serviceType": "Corporate Event Photography",
            "areaServed": {
              "@type": "City",
              "name": "Wien"
            },
            "provider": {
              "@type": "LocalBusiness",
              "name": "New Age Fotografie"
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "640",
              "highPrice": "1980",
              "priceCurrency": "EUR"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Eventfotografie Pakete",
              "itemListElement": [
                {"@type": "Offer", "name": "Half-Day (bis 4 Std.)"},
                {"@type": "Offer", "name": "Full-Day (bis 8 Std.)"},
                {"@type": "Offer", "name": "Plus Team (2 Fotograf:innen)"}
              ]
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Eventfotografie in Wien
              </h1>
              <p className="text-xl text-gray-300 mb-4 leading-relaxed font-semibold">
                Großes Event. Klare Bilder. Null Stress.
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Als <strong>eventfotograf wien</strong> dokumentieren wir Konferenzen, Brand-Launches und 
                Corporate-Events präzise, unauffällig und on-brand – vom Check-in bis zum Closing Shot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/warteliste"
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
                >
                  Termin auf der Warteliste sichern
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg"
                >
                  Projekt anfragen
                </Link>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative">
              <img
                src="/images/event-hero.jpg"
                alt="eventfotograf wien – Keynote mit vollem Saal, Rathaus Wien"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* What We Cover Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Was wir abdecken</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <Building className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Konferenzen & Summits</h3>
              <p className="text-gray-600 text-sm">Keynotes, Breakouts, Panels, Networking</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <Zap className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Brand & Produkt-Launches</h3>
              <p className="text-gray-600 text-sm">Staging, Presse, VIPs, Detailshots</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <Users className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Messen & Expo</h3>
              <p className="text-gray-600 text-sm">Booth-Stories, Besucherfluss, Teamportraits</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <Award className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Awards & Galas</h3>
              <p className="text-gray-600 text-sm">Red Carpet, Step-and-Repeat, Show-Highlights</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <Camera className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-3 text-gray-900">PR-Termine</h3>
              <p className="text-gray-600 text-sm">Pressefotos, Social-Assets, schnelle Auswahl</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <Eye className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Ziel</h3>
              <p className="text-gray-700 text-sm font-medium">Content, der sofort nutzbar ist – für Presse, Social, Intranet und Sales Decks</p>
            </div>
          </div>
        </div>
      </section>

      {/* SLAs Table Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Unsere SLAs (Lieferzeiten)</h2>
          
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
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Preview-Set</td>
                  <td className="px-6 py-4 text-sm text-gray-700">25–60 Bilder</td>
                  <td className="px-6 py-4 text-sm text-gray-600">24 h</td>
                  <td className="px-6 py-4 text-sm text-purple-600 font-semibold">6–12 h</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Social Snippets</td>
                  <td className="px-6 py-4 text-sm text-gray-700">10–20 Bilder (4:5/16:9)</td>
                  <td className="px-6 py-4 text-sm text-gray-600">24 h</td>
                  <td className="px-6 py-4 text-sm text-purple-600 font-semibold">Same Day</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Finale Galerie</td>
                  <td className="px-6 py-4 text-sm text-gray-700">200–800+ Bilder</td>
                  <td className="px-6 py-4 text-sm text-gray-600">3–5 Werktage</td>
                  <td className="px-6 py-4 text-sm text-purple-600 font-semibold">48–72 h</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Presse-Selektion</td>
                  <td className="px-6 py-4 text-sm text-gray-700">12–20 Bilder</td>
                  <td className="px-6 py-4 text-sm text-gray-600">12–24 h</td>
                  <td className="px-6 py-4 text-sm text-purple-600 font-semibold">≤ 6 h</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-purple-100 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-700">
              <strong>*Express</strong> nach Vereinbarung; Aufpreis je nach Umfang.
            </p>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pakete & Preise (Richtwerte)
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Half-Day Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-200">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Half-Day</h3>
                <p className="text-purple-600 font-medium">bis 4 Std.</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">€640</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 Fotograf:in</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">150+ Bilder</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Preview 24 h</span>
                </div>
              </div>

              <button
                onClick={() => handleBookPackage('Half-Day Event', 640, 'Half-Day Event (bis 4 Std.) - 1 Fotograf:in, 150+ Bilder, Preview 24 h')}
                className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Jetzt buchen
              </button>
            </div>

            {/* Full-Day Package - BELIEBT */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8 transform scale-105 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-bl-lg rounded-tr-2xl">
                BELIEBT
              </div>
              
              <div className="mb-6 mt-4">
                <h3 className="text-2xl font-bold mb-2">Full-Day</h3>
                <p className="text-purple-100 font-medium">bis 8 Std.</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">€1.180</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>1 Fotograf:in</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>350+ Bilder</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Social-Cut 24 h</span>
                </div>
              </div>

              <button
                onClick={() => handleBookPackage('Full-Day Event', 1180, 'Full-Day Event (bis 8 Std.) - 1 Fotograf:in, 350+ Bilder, Social-Cut 24 h')}
                className="block w-full text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Jetzt buchen
              </button>
            </div>

            {/* Plus Team Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-200">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plus Team</h3>
                <p className="text-purple-600 font-medium">bis 8 Std.</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">€1.980</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">2 Fotograf:innen</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">600+ Bilder</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Presse-Set 12 h</span>
                </div>
              </div>

              <button
                onClick={() => handleBookPackage('Plus Team Event', 1980, 'Plus Team Event (bis 8 Std.) - 2 Fotograf:innen, 600+ Bilder, Presse-Set 12 h')}
                className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Jetzt buchen
              </button>
            </div>
          </div>

          {/* Add-ons */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4">Add-ons:</h4>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>Zusatzstunde <strong>€150</strong></span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>Videographer ab <strong>€780</strong></span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>On-Site Auswahlstation <strong>€190</strong></span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>Sofort-Export (Same-Day) <strong>€290</strong></span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Slots sind begrenzt. Trag dich hier ein: <Link to="/warteliste" className="text-purple-600 hover:text-purple-700 underline font-semibold">Termin-Warteliste</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Workflow vor Ort</h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Kick-Off</h3>
              <p className="text-gray-600 text-sm">Shotlist, CI-Guides, Laufwege</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Light-Test</h3>
              <p className="text-gray-600 text-sm">Bühne, Backlight, Publikum – einmal sauber messen</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Coverage</h3>
              <p className="text-gray-600 text-sm">Unauffällig, doppelt gesichert (Dual-Card)</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">On-Site Delivery</h3>
              <p className="text-gray-600 text-sm">Erste Social-Assets direkt an euer Team</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">5</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Übergabe</h3>
              <p className="text-gray-600 text-sm">Strukturierte Ordner, klare Dateinamen, Nutzungsrechte</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">6</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Backups</h3>
              <p className="text-gray-600 text-sm">2× Karten + RAID-Spiegelung noch am Event-Tag</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Style & Tech Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Bildsprache & Technik</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Keynote-Look</h3>
              <p className="text-gray-700 text-sm">Tele + sauberes Bühnenlicht, Gesichter klar, Screens lesbar</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Atmosphäre</h3>
              <p className="text-gray-700 text-sm">Weitwinkel-Stories, Publikum, „between the talks"</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Brand-Details</h3>
              <p className="text-gray-700 text-sm">Signage, Produkt, Hand-Close-ups</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Hauttöne</h3>
              <p className="text-gray-700 text-sm">Farbkalibriert, CI-Profile auf Wunsch</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 md:col-span-2">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Formate</h3>
              <p className="text-gray-700 text-sm">4:5, 1:1, 16:9 – Social-ready exportiert</p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery & Rights Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Übergaben & Rechte</h2>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <ul className="space-y-4">
              <li className="flex items-start">
                <Shield className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Galerie:</strong>
                  <span className="text-gray-700"> Passwort-geschützt, sortiert nach Tracks</span>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Dateibenennung:</strong>
                  <span className="text-gray-700"> Event_YYYYMMDD_Session_Speaker_###.jpg</span>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Nutzung:</strong>
                  <span className="text-gray-700"> Unternehmenskommunikation, PR, Social, Web – inkl.</span>
                </div>
              </li>
              <li className="flex items-start">
                <Users className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Dritte:</strong>
                  <span className="text-gray-700"> Medien/Partner auf Anfrage; wir liefern Pressetexte/Caption-Hilfen</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Example Shotlist Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Beispiel-Shotlist (Kurz)</h2>
          
          <div className="bg-purple-50 rounded-xl p-8">
            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Venue-Außen & Check-in</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Opening & Keynotes</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Publikum, Q&A, Breakouts</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Partner-Booths, Produkt, Demos</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Networking, Teams, VIPs</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Award/Show-Momente</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Closing & „Full Room" Finale</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Könnt ihr Same-Day Social liefern?</h3>
              <p className="text-gray-600">
                Ja. Mit On-Site Auswahlstation oder Runner liefern wir kuratierte JPEGs während des Events.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Brauchen wir eine Bühnenprobe?</h3>
              <p className="text-gray-600">
                Kurz vor Start 3 Minuten für Lichtcheck – dann sitzt jeder Winkel.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wie viele Bilder bekommen wir?</h3>
              <p className="text-gray-600">
                Richtwert: 70–100 pro Stunde je Fotograf:in, abhängig von Agenda und Flächen.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Reicht ein/e Fotograf:in?</h3>
              <p className="text-gray-600">
                Single-Track oft ja. Bei Parallel-Sessions, großer Venue oder VIP-Fokus empfehlen wir 2. Kamera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why New Age Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Warum New Age Fotografie?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Star className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">12+ Jahre Corporate & Event</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Clock className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Schnelle, verlässliche SLAs</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Camera className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Saubere Übergabe. Social-first-Denken. Presse-ready.</h3>
            </div>
          </div>
        </div>
      </section>

      {/* External Link Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            <strong>Externer Hinweis:</strong> Für Venue-Planung & Raumauswahl:{' '}
            <a 
              href="https://www.vienna.convention.at/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Vienna Convention Bureau – Event Locations
            </a>
          </p>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Weitere Business-Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/business-portrait-wien/"
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <Briefcase className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Business-Portraits</h3>
              <p className="text-gray-600 text-sm mb-4">
                Professionelle Einzelportraits für LinkedIn, CEO & Personal-Branding
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/teamfotos-wien/"
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <Users className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Team- & Mitarbeiterfotos</h3>
              <p className="text-gray-600 text-sm mb-4">
                Mobiles Studio vor Ort, einheitlicher Look, schneller Ablauf
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/bewerbungsfotos-wien/"
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <Camera className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Bewerbungsfotos</h3>
              <p className="text-gray-600 text-sm mb-4">
                LinkedIn-Portraits mit schneller Retusche & Express-Lieferung
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für professionelle Eventfotografie in Wien?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Slots sind begrenzt. Sicher dir jetzt deinen Termin für <strong>eventfotograf wien</strong> und erhalte Content, der sofort nutzbar ist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/warteliste"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
            >
              Termin auf der Warteliste sichern
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/kontakt"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg"
            >
              Projekt anfragen
            </Link>
          </div>
        </div>
      </section>

    </div>
    </Layout>
  );
}
