import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import GoogleReviews from '../../components/layout/GoogleReviews';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Camera, Sparkles, ArrowRight, Check, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useManualPageContent } from '../../hooks/useManualPageContent';
import MarkdownCopySlot from '../../components/MarkdownCopySlot';
import { newageCopyMap } from '../../content/newageCopyMap';

export default function PortraitfotografieWienPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const t = useManualPageContent('portraitfotografie');

  const fromManual = (key: string, fallback: string) => {
    const value = t(key);
    if (!value || value === key) {
      return fallback;
    }
    return value;
  };

  const heroTitle = fromManual('manual.portraitfotografie.heroTitle', 'Portraitfotografie in Wien');
  const heroSubtitle = fromManual('manual.portraitfotografie.heroTagline', 'Echte Ausstrahlung. Saubere Lichtführung. Bilder, die bleiben.');
  const heroDescription = fromManual('manual.portraitfotografie.heroDescription', 'Als portraitfotograf wien inszenieren wir dich so, wie du gesehen werden willst – editorial, klassisch oder kreativ. Im Studio oder on location. Ohne steife Posen, mit klarer Richtung und Tempo.');
  const primaryCta = fromManual('manual.portraitfotografie.primaryCta', 'Termin sichern');
  const secondaryCta = fromManual('manual.portraitfotografie.secondaryCta', 'Beratung & Verfügbarkeit');
  const heroImage1 = fromManual('manual.portraitfotografie.heroImage1', '');
  const heroImage2 = fromManual('manual.portraitfotografie.heroImage2', '');
  const heroImage3 = fromManual('manual.portraitfotografie.heroImage3', '');
  const heroImage4 = fromManual('manual.portraitfotografie.heroImage4', '');
  const heroImage5 = fromManual('manual.portraitfotografie.heroImage5', '');

  const handleBookPackage = (packageName: string, price: number, description: string) => {
    addItem({
      title: packageName,
      price: price,
      quantity: 1,
      packageType: 'Portrait',
      type: 'voucher'
    });
    navigate('/cart');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <SEOHead
          title={newageCopyMap['portrait-fotografie-wien'].title}
          description={newageCopyMap['portrait-fotografie-wien'].metaDescription}
          keywords="portraitfotograf wien, portraitfotografie wien, editorial portrait wien, studio portrait wien"
          canonical="/portrait-fotografie-wien/"
          hreflang={[
            { lang: 'de', url: '/portrait-fotografie-wien/' },
            { lang: 'en', url: '/en/portrait-photography-vienna/' }
          ]}
        />

        {/* JSON-LD Structured Data */}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Portraitfotografie Wien',
              serviceType: 'Portrait Photography',
              areaServed: { '@type': 'City', name: 'Wien' },
              provider: { '@type': 'LocalBusiness', name: 'New Age Fotografie' },
              offers: { '@type': 'AggregateOffer', lowPrice: '190', highPrice: '480', priceCurrency: 'EUR' }
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
                <p className="text-xl text-gray-300 mb-3 leading-relaxed font-semibold">
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
                    alt="portraitfotograf wien – Editorial-Look mit Kantenlicht auf schwarzem Hintergrund"
                    className="rounded-2xl shadow-2xl w-full h-auto object-contain"
                    loading="eager"
                  />
                </div>
                <div>
                  <img
                    src={heroImage2}
                    alt="Portrait Fotografie Wien Studio"
                    className="rounded-xl shadow-lg w-full h-auto object-contain"
                    loading="eager"
                  />
                </div>
                <div>
                  <img
                    src={heroImage3}
                    alt="Klassisches Portrait Wien"
                    className="rounded-xl shadow-lg w-full h-auto object-contain"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <GoogleReviews />

        {/* Portrait-Stile */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Portrait-Stile auf einen Blick</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <Sparkles className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Editorial</h3>
                <p className="text-gray-600 text-sm">Magazin-Look, markante Lichtkante, klare Posen.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Camera className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Klassisch</h3>
                <p className="text-gray-600 text-sm">Zeitlos, weiche Übergänge, dezente Retusche.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Sparkles className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Kreativ</h3>
                <p className="text-gray-600 text-sm">Farben, Texturen, Bewegung – gerne auch Experimente.</p>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-700 text-sm">
              Ergebnis: Ein Set Bilder, das auf Website, LinkedIn & Profil gleichermaßen funktioniert.
            </div>
          </div>
        </section>

        {/* Studio-Sets & Licht */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Studio-Sets & Licht (Best-of)</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Set</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Look</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Licht-Setup</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Ideal für</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Charcoal Grey</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Zeitlos, Business-Ready</td>
                    <td className="px-6 py-4 text-sm text-gray-700">2-Licht Clamshell + Haarlicht</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Headshots, Team</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">White High-Key</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Hell, clean, modern</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Großes Softbox-Key + Aufheller</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Web, PR</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Black Low-Key</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Dramatisch, kantig</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Streifenlicht + Edge</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Editorial, Künstler</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Color Pop</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Mutig, Trend</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Farbgel + Key/Fill</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Kampagnen, Social</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Textured Backdrop</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Warm, organisch</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Soft Key + Grid</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Autoren, Personal Brand</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-purple-50 rounded-xl p-4 text-sm text-gray-700">
              Technik-Kurznotiz: Hauttöne zuerst. Dual-Card-Backup. Kalibrierte Monitore. Retusche dezent – Poren bleiben Poren.
            </div>
          </div>
        </section>
        {/* Extended Content Section - Safe Copy Slot */}
        <MarkdownCopySlot content={newageCopyMap['portrait-fotografie-wien'].markdown} />
        {/* Pakete & Preise */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pakete & Preise</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Headshot Mini */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-200">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Headshot Mini</h3>
                  <p className="text-purple-600 font-medium">30 Min</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-purple-600">€190</span>
                  </div>
                </div>
                <div className="space-y-3 mb-8 text-sm">
                  <div className="flex items-start"><Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" /><span>2 Looks, 6 Retuschen, Online-Galerie</span></div>
                  <div className="flex items-start"><Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" /><span>Ideal: LinkedIn, Signatur</span></div>
                </div>
                <button
                  onClick={() => handleBookPackage('Headshot Mini Portrait', 190, 'Headshot Mini (30 Min) - 2 Looks, 6 Retuschen, Online-Galerie')}
                  className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  Termin sichern
                </button>
              </div>

              {/* Portrait Classic (beliebt) */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8 transform scale-105 relative">
                <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-bl-lg rounded-tr-2xl">BELIEBT</div>
                <div className="mb-6 mt-4">
                  <h3 className="text-2xl font-bold mb-2">Portrait Classic</h3>
                  <p className="text-purple-100 font-medium">60–75 Min</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">€320</span>
                  </div>
                </div>
                <div className="space-y-3 mb-8 text-sm">
                  <div className="flex items-start"><Check className="h-4 w-4 text-yellow-300 mr-2 mt-0.5" /><span>3 Looks, 12 Retuschen</span></div>
                  <div className="flex items-start"><Check className="h-4 w-4 text-yellow-300 mr-2 mt-0.5" /><span>Outfit-Check & Posing-Guidance</span></div>
                  <div className="flex items-start"><Check className="h-4 w-4 text-yellow-300 mr-2 mt-0.5" /><span>Ideal: Website, PR</span></div>
                </div>
                <button
                  onClick={() => handleBookPackage('Portrait Classic', 320, 'Portrait Classic (60-75 Min) - 3 Looks, 12 Retuschen, Outfit-Check & Posing-Guidance')}
                  className="block w-full text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Termin sichern
                </button>
              </div>

              {/* Editorial Session */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-200">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Editorial Session</h3>
                  <p className="text-purple-600 font-medium">90–120 Min</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-purple-600">€480</span>
                  </div>
                </div>
                <div className="space-y-3 mb-8 text-sm">
                  <div className="flex items-start"><Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" /><span>4–5 Looks, 18 Retuschen</span></div>
                  <div className="flex items-start"><Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" /><span>Creative Set, Farbgel-Option</span></div>
                  <div className="flex items-start"><Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" /><span>Ideal: Kampagnen, Artists</span></div>
                </div>
                <button
                  onClick={() => handleBookPackage('Editorial Session Portrait', 480, 'Editorial Session (90-120 Min) - 4-5 Looks, 18 Retuschen, Creative Set')}
                  className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  Termin sichern
                </button>
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-gray-50 rounded-xl p-6 text-sm">
              <h4 className="font-bold text-gray-900 mb-3">Add-ons:</h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center"><Check className="h-4 w-4 text-purple-600 mr-2" />Extra Look <strong>€40</strong></div>
                <div className="flex items-center"><Check className="h-4 w-4 text-purple-600 mr-2" />Express-Delivery <strong>48h €60</strong></div>
                <div className="flex items-center"><Check className="h-4 w-4 text-purple-600 mr-2" />Visagistik/Haare ab <strong>€120</strong></div>
                <div className="flex items-center"><Check className="h-4 w-4 text-purple-600 mr-2" />Lizenzpakete für Presse/Ads (auf Anfrage)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Vorbereitung */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10">Vorbereitung: Kleidung & Ausdruck</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Kleidung (quick wins)</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• 2–3 Outfits: neutral + Statement</li>
                  <li>• Feine Texturen &gt; große Logos</li>
                  <li>• Kragen & Schultern glatt (Steamer vor Ort)</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Ausdruck</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• „Soft Smile“, „Focused“, „Approachable“ – Mikro-Coaching</li>
                  <li>• 5-Sekunden-Regel: Mini-Reset zwischen Serien</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Accessoires</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Brillen entspiegeln? Super – sonst kurzer Winkel-Check</li>
                  <li>• Schmuck: 1 Fokus-Piece statt alles gleichzeitig</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* On Location Wien */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-6">On Location in Wien</h2>
            <p className="text-gray-700 text-center max-w-3xl mx-auto mb-4">
              Lieber urban statt Studio? Wir haben Spots mit Platz & Lichtfenstern. Tipp: Unter der Woche am Vormittag ist es ruhiger –
              per ÖPNV kommt man entspannt hin.
            </p>
            <p className="text-center text-sm text-gray-600">
              Externer Hinweis:{' '}
              <a href="https://www.wienerlinien.at/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 underline">
                Wiener Linien Routenplaner – Anfahrt & Umstieg
              </a>
            </p>
          </div>
        </section>

        {/* Ablauf & SLAs */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Ablauf & Lieferzeiten (SLAs)</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Schritt</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Was passiert</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Zeit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Briefing</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Ziel, Look, Nutzung (Web/Print/PR)</td>
                    <td className="px-6 py-4 text-sm text-gray-700">10 Min</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Shooting</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Lichtcheck → Serien → Review</td>
                    <td className="px-6 py-4 text-sm text-gray-700">30–120 Min</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Auswahl</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Favoriten in Galerie markieren</td>
                    <td className="px-6 py-4 text-sm text-gray-700">am Tag</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Retusche</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Natürlich, sauber, markenschonend</td>
                    <td className="px-6 py-4 text-sm text-gray-700">2–4 Werktage</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Delivery</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Hi-Res + Web-Optimiert, Namensschema</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Download-Link</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-purple-100 rounded-xl p-4 text-center mt-4">
              <p className="text-sm text-gray-700">Express möglich, wenn’s brennt.</p>
            </div>
          </div>
        </section>

        {/* Beispiele */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Beispiele: Editorial • Klassisch • Kreativ</h2>
            <div className="bg-purple-50 rounded-xl p-8">
              <ul className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                <li>• Editorial: Dunkler Backdrop, Edge-Light, markanter Kiefer – Magazin-ready.</li>
                <li>• Klassisch: Grey, weiches Key, Catchlights sauber – zeitlos.</li>
                <li>• Kreativ: Farbgel-Gradient, leichte Motion – Social Hook.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">FAQ – kurz & klar</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Wie viele finale Bilder?</h3>
                <p className="text-gray-600">Je nach Paket 6–18 retuschierte Motive, plus Grundauswahl.</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Darf ich die RAWs bekommen?</h3>
                <p className="text-gray-600">Nein – wir liefern finale, farbverbindliche Bilder (JPG/PNG, auf Wunsch TIFF).</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Make-up nötig?</h3>
                <p className="text-gray-600">Empfehlung: Mattierung/Teint-Ausgleich. Gerne buchen wir Make-up Artist.</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Retusche-Level?</h3>
                <p className="text-gray-600">Natürlich – Hautstruktur bleibt, temporäre Unreinheiten gehen.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Nächster Schritt</h2>
            <p className="text-xl mb-8 opacity-90">
              Erzähl uns kurz Zweck, Deadline und gewünschten Stil. Wir empfehlen Paket, Set & Licht – und blocken dir einen Slot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/warteliste" className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg">
                Jetzt Wartelisten-Platz sichern
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
