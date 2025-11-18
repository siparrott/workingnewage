import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Camera, Check, ArrowRight, Lightbulb, Users, Sparkles } from 'lucide-react';
import GoogleReviews from '../../components/layout/GoogleReviews';

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

const StudioFotografieWienPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Studio Fotografie Wien – Backdrops, Licht, Sets & Kapazitäten | New Age Fotografie"
        description="Professionelle Studio Fotografie in Wien: Definierte Sets, Backdrops & Modifiers. Headshots, Portraits, Teams & Produkte. Ab €150. Jetzt Termin sichern."
        keywords="studio fotografie wien, fotostudio wien, portrait studio, headshot fotografie wien, studiofotografie, studio shooting wien"
        canonical="https://workingnewage-2eecd723a444.herokuapp.com/studio-fotografie-wien/"
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Photography",
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
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Studio Pakete",
              "itemListElement": [
                { "@type": "Offer", "name": "Headshot Basic", "price": "150", "priceCurrency": "EUR" },
                { "@type": "Offer", "name": "Portrait Classic", "price": "290", "priceCurrency": "EUR" },
                { "@type": "Offer", "name": "Family Studio", "price": "350", "priceCurrency": "EUR" }
              ]
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Studio Fotografie Wien</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Professionelle Studio-Fotografie<br />
              <span className="text-purple-300">präzise & planbar</span>
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Definierte Sets, kontrolliertes Licht, wiederholbare Ergebnisse – von Business-Headshots bis Family-Sessions in unserem Wien Studio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/warteliste/"
                className="inline-flex items-center justify-center gap-2 bg-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-600 transition-all transform hover:scale-105"
              >
                Jetzt Studio-Termin anfragen
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#pakete"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Pakete & Preise
              </a>
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
              Was wir im Studio perfekt können
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Saubere, wiederholbare Ergebnisse mit definierten Sets und kontrolliertem Licht.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
              <Camera className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Portraits & Headshots</h3>
              <p className="text-gray-600 leading-relaxed">
                Neutral, editorial oder kreativ – mit Clamshell-Licht, Stripbox oder Moody-Sets. Business-clean bis dramatisch.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Familien & Paare</h3>
              <p className="text-gray-600 leading-relaxed">
                Gemütliche Lifestyle-Corner mit Sitzmöbeln, kindertaugliches Tempo, warme Farben – authentisch statt steif.
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
              <Lightbulb className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Business-Teams</h3>
              <p className="text-gray-600 leading-relaxed">
                Einheitlicher Look für Abteilungen & Mitarbeiter – alle im selben Set, gleiche Belichtung, konsistente Retusche.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border border-amber-100">
              <Sparkles className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Produkte & Kampagnen</h3>
              <p className="text-gray-600 leading-relaxed">
                Licht präzise gesetzt, Reflexe kontrolliert – Freisteller, Soft Shadow oder Lifestyle-Table für E-Commerce.
              </p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-xl border border-rose-100">
              <Camera className="w-12 h-12 text-rose-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Content-Reels</h3>
              <p className="text-gray-600 leading-relaxed">
                Kurze Video-Loops im selben Licht-Setup wie die Fotos – perfekt für Social Media & Website.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
              <Check className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Klare SLAs</h3>
              <p className="text-gray-600 leading-relaxed">
                Briefing 10-15 Min, Shooting 30-90 Min, Auswahl am Tag, Retusche & Delivery 48-72h Standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bookbare Sets & Backdrops */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bookbare Sets & Backdrops
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Wähle das passende Set für deinen gewünschten Look – wir zeigen dir Testshots vor dem Start.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-700 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Set-Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Hintergrund</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Gefühl</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Typische Motive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Classic Neutral</td>
                    <td className="px-6 py-4 text-gray-600">Grau (mittel)</td>
                    <td className="px-6 py-4 text-gray-600">Business-clean, zeitlos</td>
                    <td className="px-6 py-4 text-gray-600">Headshots, Teams</td>
                  </tr>
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">High-Key White</td>
                    <td className="px-6 py-4 text-gray-600">Reinweiß</td>
                    <td className="px-6 py-4 text-gray-600">Frisch, modern</td>
                    <td className="px-6 py-4 text-gray-600">E-Com, Editorial, Familien</td>
                  </tr>
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Low-Key Shadow</td>
                    <td className="px-6 py-4 text-gray-600">Tiefes Schwarz</td>
                    <td className="px-6 py-4 text-gray-600">Dramatisch, kantig</td>
                    <td className="px-6 py-4 text-gray-600">Sport, Musik, Branding</td>
                  </tr>
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Moody Color</td>
                    <td className="px-6 py-4 text-gray-600">Farb-Paper (Sand/Salbei/Slate)</td>
                    <td className="px-6 py-4 text-gray-600">Warm, organisch</td>
                    <td className="px-6 py-4 text-gray-600">Portraits, Paare</td>
                  </tr>
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Lifestyle Corner</td>
                    <td className="px-6 py-4 text-gray-600">Sitzmöbel + Plants</td>
                    <td className="px-6 py-4 text-gray-600">Authentisch, cozy</td>
                    <td className="px-6 py-4 text-gray-600">Familien, Autorenportraits</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Modifiers & Licht-Setups */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Modifiers & Licht-Setups
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Welche Licht-Tools wir für welchen Look einsetzen – weich, definiert oder dramatisch.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700 to-slate-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Zweck</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Modifier</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Setup</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Ergebnis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Beauty/Headshot</td>
                    <td className="px-6 py-4 text-gray-600">105 cm Octa + Grid</td>
                    <td className="px-6 py-4 text-gray-600">Clamshell (Key + Bounce)</td>
                    <td className="px-6 py-4 text-gray-600">Gleichmäßige Haut, klare Augenlichter</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Business-Neutral</td>
                    <td className="px-6 py-4 text-gray-600">90 cm Softbox</td>
                    <td className="px-6 py-4 text-gray-600">45° Key + Neg-Fill</td>
                    <td className="px-6 py-4 text-gray-600">Form, aber nicht hart</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Editorial Edge</td>
                    <td className="px-6 py-4 text-gray-600">Stripbox + Grid</td>
                    <td className="px-6 py-4 text-gray-600">Rim + leichter Fill</td>
                    <td className="px-6 py-4 text-gray-600">Kontur, Schultern betont</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">High-Key</td>
                    <td className="px-6 py-4 text-gray-600">2× Softbox + Background-Light</td>
                    <td className="px-6 py-4 text-gray-600">Hintergrund auf +1 bis +2 EV</td>
                    <td className="px-6 py-4 text-gray-600">Sauberes Weiß ohne Halos</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Produkt-Glanz</td>
                    <td className="px-6 py-4 text-gray-600">Scrim + Flags</td>
                    <td className="px-6 py-4 text-gray-600">Top-light + Bounce</td>
                    <td className="px-6 py-4 text-gray-600">Weiche Highlights, keine Hotspots</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Kapazität & Ablauf */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Studio-Kapazität & Ablauf
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Unser Studio in Wien bietet Platz, Ausstattung und klare Prozesse für reibungslose Sessions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-purple-600" />
                Studio-Ausstattung
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Studiofläche:</strong> ~100 m² nutzbar, Deckenhöhe 3-4 m</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Teamgrößen:</strong> Einzelpersonen bis Gruppen 12-15 (Roster-Plan)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Make-up/Styling:</strong> Bereich mit Spiegel & Licht</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Umkleide:</strong> Separat vorhanden</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Musik & Stimmung:</strong> Playlist-fähig, kindgerecht</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="w-6 h-6 text-purple-600" />
                Shooting-Ablauf
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <p className="font-semibold text-gray-900">Briefing (10-15 Min)</p>
                    <p className="text-sm text-gray-600">Ziel-Look, Set-Wahl, Outfit-Plan besprechen</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <p className="font-semibold text-gray-900">Licht & Test (10 Min)</p>
                    <p className="text-sm text-gray-600">Probe-Shot, Feintuning der Belichtung</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <p className="font-semibold text-gray-900">Shooting (30-90 Min)</p>
                    <p className="text-sm text-gray-600">Geführte Posen, natürliche Mimik</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <p className="font-semibold text-gray-900">Auswahl (am Tag)</p>
                    <p className="text-sm text-gray-600">Markierungen im Proof, sofortige Vorschau</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">5</div>
                  <div>
                    <p className="font-semibold text-gray-900">Retusche & Delivery (48-72h)</p>
                    <p className="text-sm text-gray-600">Hautretusche, Tonung, Exportprofile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pakete */}
      <section id="pakete" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Studio Pakete & Preise
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Fixpreise je nach Dauer und Umfang – transparent und planbar.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Headshot Basic */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:border-purple-300 transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Headshot Basic</h3>
              <p className="text-gray-600 mb-4">30 Minuten Session</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">€150</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">3 Bilder final retuschiert</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 Set (Classic Neutral oder High-Key White)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Hautretusche & Tonung inkl.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Lieferung 48h Standard</span>
                </li>
              </ul>
              <Link
                to="/warteliste/"
                className="block w-full text-center bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
              >
                Paket wählen
              </Link>
            </div>

            {/* Portrait Classic - BELIEBT */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-2xl p-8 border-2 border-purple-500 relative transform scale-105 hover:scale-110 transition-all">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                BELIEBT
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Portrait Classic</h3>
              <p className="text-gray-600 mb-4">60 Minuten Session</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-purple-600">€290</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">8 Bilder final retuschiert</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">2 Sets (z.B. Neutral + Moody Color)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Outfit-Wechsel möglich</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Hautretusche, Dodge&Burn, Tonung</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Lieferung 48-72h Standard</span>
                </li>
              </ul>
              <Link
                to="/warteliste/"
                className="block w-full text-center bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
              >
                Paket wählen
              </Link>
            </div>

            {/* Family Studio */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:border-purple-300 transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Family Studio</h3>
              <p className="text-gray-600 mb-4">75 Minuten Session</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">€350</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">12 Bilder final retuschiert</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">2 Sets + Lifestyle Corner</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Kindertaugliches Tempo & Pausen</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Alle Personen & Kombinationen</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Lieferung 72h Standard</span>
                </li>
              </ul>
              <Link
                to="/warteliste/"
                className="block w-full text-center bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
              >
                Paket wählen
              </Link>
            </div>
          </div>

          {/* Business Team Package */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-200 max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Business Team</h3>
                <p className="text-gray-600 mb-4">Für Abteilungen & Mitarbeiter-Rosters</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>1 Bild pro Person, einheitlicher Look</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Classic Neutral Set, 2-3 Stunden Session</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Ideal für Website & interne Profile</span>
                  </li>
                </ul>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-600 mb-2">Ab</p>
                <p className="text-4xl font-bold text-blue-600 mb-4">€590</p>
                <Link
                  to="/warteliste/"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  Anfrage stellen
                </Link>
              </div>
            </div>
          </div>

          {/* Add-ons */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Add-ons</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Zusätzliches Bild</h4>
                <p className="text-sm text-gray-600 mb-2">retuschiert & exportiert</p>
                <p className="text-2xl font-bold text-purple-600">€20</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Visagistik</h4>
                <p className="text-sm text-gray-600 mb-2">Make-up & Haare professionell</p>
                <p className="text-2xl font-bold text-purple-600">ab €120</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Express 24h</h4>
                <p className="text-sm text-gray-600 mb-2">Bilder am nächsten Tag</p>
                <p className="text-2xl font-bold text-purple-600">+€80</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Content-Reel</h4>
                <p className="text-sm text-gray-600 mb-2">Video 10-20s im selben Setup</p>
                <p className="text-2xl font-bold text-purple-600">€90</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technik-Details */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technik-Details
              <span className="block text-lg font-normal text-gray-600 mt-2">(für Nerds, die wir lieben)</span>
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-700 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Parameter</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Empfehlung / Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Porträt-Blende</td>
                    <td className="px-6 py-4 text-gray-600">f/4–f/5.6 (Teams: f/7.1–f/8)</td>
                  </tr>
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Sync/Speed</td>
                    <td className="px-6 py-4 text-gray-600">1/160–1/200 s, ISO 100–200</td>
                  </tr>
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Key-Platzierung</td>
                    <td className="px-6 py-4 text-gray-600">30–45°, Augenhöhe bis +10 cm</td>
                  </tr>
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Weißabgleich</td>
                    <td className="px-6 py-4 text-gray-600">5600 K (Flash), Graukarte Check</td>
                  </tr>
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">Hautretusche</td>
                    <td className="px-6 py-4 text-gray-600">Frequenztrennung light, Dodge&Burn subtil</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
            <p className="text-gray-700 leading-relaxed">
              <strong>Hinweis:</strong> Für Lichtlogik und saubere Belichtung orientieren wir uns an fotografischen Grundsätzen wie dem Inverse-Square-Law und bewährten Studio-Praktiken aus der Portrait- und Editorial-Fotografie.
            </p>
          </div>
        </div>
      </section>

      {/* Vorbereitung */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vorbereitung: Kurz & Schmerzlos
            </h2>
            <p className="text-lg text-gray-600">
              Ein paar simple Tipps, damit dein Studio-Shooting perfekt läuft.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-purple-600" />
                Kleidung & Outfit
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span>2-3 Outfits mitbringen (Texturen besser als Logos)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span>Keine Mikro-Streifen (Moiré-Effekt)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span>Bei Teams: Farbpalette statt Uniform (2-3 Töne)</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-blue-600" />
                Styling & Details
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>Puder/Blotting-Paper bei Glanz mitbringen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>Bürste für Haare (Studio-Klima kann statisch wirken)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>Accessoires minimal, dafür stimmig zum Look</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Familien mit Kindern
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <span>Snack & Spielzeug einpacken (Pausen möglich)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <span>Slot rund um Schlaf/Nap-Zeit legen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">•</span>
                  <span>Musik & gemütliches Tempo – kein Stress</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border border-amber-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-amber-600" />
                Timing & Ankommen
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>5-10 Min vor Termin da sein (entspannt ankommen)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>Umkleide & Make-up-Bereich nutzen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>Wir zeigen Testshots vor dem Start</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Häufige Fragen
            </h2>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Wie wähle ich das richtige Set?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Wir matchen das Set zu deinem Ziel: <strong>studio fotografie wien</strong> neutral (Business/LinkedIn) oder warm & organisch (Lifestyle/Familie). Du siehst Testshots vor dem eigentlichen Shooting-Start.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Was sollen Gruppen/Teams bei der Kleidung beachten?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Palette statt Uniform: 2-3 Farbtöne auswählen, keine lauten Muster oder Logos. Wir senden gern einen Mini-Guide vor dem Termin mit Beispielen.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Kann ich Content-Reels im gleichen Setup mitdrehen?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Ja – kurze B-Rolls (10-20 Sekunden) im selben Licht-Setup sind als Add-on buchbar (€90). Perfekt für Social Media & Website-Header.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Wie schnell bekomme ich die finalen Bilder?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Standard-Lieferung 48-72h nach dem Shooting. Express-Lieferung in 24h ist gegen Aufpreis (+€80) möglich – ideal für dringende Kampagnen oder Deadlines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ähnliche Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ähnliche Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Weitere professionelle Fotografie-Dienstleistungen in Wien.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              to="/portrait-fotografie-wien/"
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all group"
            >
              <Camera className="w-12 h-12 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Portraitfotografie</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Editorial, klassisch oder kreativ – Studio-Sets mit perfektem Licht für ausdrucksstarke Portraits.
              </p>
              <span className="text-purple-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Mehr erfahren
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              to="/business-portrait-wien/"
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all group"
            >
              <Users className="w-12 h-12 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Business-Portraits</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Professionelle Headshots für LinkedIn, Website & Team-Seiten – einheitlicher Stil garantiert.
              </p>
              <span className="text-purple-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Mehr erfahren
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              to="/familienfotos-wien/"
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all group"
            >
              <Sparkles className="w-12 h-12 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Familienfotos</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Gemütliche Studio-Atmosphäre oder Outdoor – authentische Familienmomente natürlich eingefangen.
              </p>
              <span className="text-purple-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Mehr erfahren
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Studio-Fotografie, die liefert
          </h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Saubere Sets, kontrolliertes Licht, klare SLAs – von Headshots über Familien bis Teams. Fixpreise, keine Überraschungen.
          </p>
          <Link
            to="/warteliste/"
            className="inline-flex items-center justify-center gap-2 bg-white text-purple-900 px-10 py-5 rounded-lg font-bold text-lg hover:bg-purple-50 transition-all transform hover:scale-105 shadow-xl"
          >
            Jetzt Studio-Termin sichern
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StudioFotografieWienPage;
