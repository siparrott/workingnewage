import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import GoogleReviews from '../../components/layout/GoogleReviews';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Heart, Users, Star, ArrowRight, Check, Clock, Baby, Shield, Music, Smile, Package, Sun, Home, Eye, Hand } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../../context/CartContext';
import { useManualPageContent } from '../../hooks/useManualPageContent';

export default function BabyfotosWienPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const t = useManualPageContent('babyfotos');

  const fromManual = (key: string, fallback: string) => {
    const value = t(key);
    if (!value || value === key) {
      return fallback;
    }
    return value;
  };

  const heroTitle = fromManual('manual.babyfotos.heroTitle', 'Babyfotos (3–12 Monate) in Wien');
  const heroSubtitle = fromManual('manual.babyfotos.heroTagline', 'Echte Babyzeit. Echte Mimik.');
  const heroDescription = fromManual('manual.babyfotos.heroDescription', 'Von Bauchlage bis Sitzpirouette – wir halten dein Kind genau so fest, wie es jetzt ist. Bei babyfotos wien im Studio oder Outdoor bleibt alles entspannt, sicher und kindgerecht.');
  const primaryCta = fromManual('manual.babyfotos.primaryCta', 'Termin auf der Warteliste sichern');
  const secondaryCta = fromManual('manual.babyfotos.secondaryCta', 'Baby-Gutschein kaufen');
  const heroImage1 = fromManual('manual.babyfotos.heroImage1', '');
  const heroImage2 = fromManual('manual.babyfotos.heroImage2', '');
  const heroImage3 = fromManual('manual.babyfotos.heroImage3', '');
  const heroImage4 = fromManual('manual.babyfotos.heroImage4', '');
  const heroImage5 = fromManual('manual.babyfotos.heroImage5', '');

  const handleBookPackage = (packageName: string, price: number, description: string) => {
    addItem({
      title: packageName,
      price: price,
      quantity: 1,
      packageType: 'Babyfotografie',
      type: 'voucher'
    });
    navigate('/cart');
  };

  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Babyfotos Wien – Liebevolle Babyfotografie (3–12 Monate) | New Age Fotografie"
        description="Babyfotos Wien gesucht? Zarte, verspielte Babyfotografie für 3–12 Monate. Studio & Outdoor, altersgerechte Posen, Pakete, Ablauf, FAQs. Jetzt Termin sichern!"
        keywords="babyfotos wien, babyfotografie wien, baby fotoshooting wien, babyfotograf wien"
        canonical="/babyfotos-wien/"
        ogImage="https://www.newagefotografie.com/images/baby-hero.jpg"
        hreflang={[
          { lang: 'de', url: '/babyfotos-wien/' },
          { lang: 'en', url: '/en/baby-photos-vienna/' }
        ]}
      />

      {/* JSON-LD Structured Data */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Babyfotos Wien (3–12 Monate)",
            "serviceType": "Babyfotografie",
            "provider": {
              "@type": "LocalBusiness",
              "name": "New Age Fotografie",
              "areaServed": "Wien, Österreich"
            },
            "areaServed": {
              "@type": "City",
              "name": "Wien"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "EUR",
              "price": "170",
              "description": "Mini Baby – 40 Min, 1 Set, 8 retuschierte Dateien"
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-xl text-gray-700 mb-4 leading-relaxed font-semibold">
                {heroSubtitle}
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/warteliste"
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
                >
                  {primaryCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/gutschein/baby"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold text-lg"
                >
                  {secondaryCta}
                </Link>
              </div>
            </div>

            {/* Right: Hero Images Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <img
                  src={heroImage1}
                  alt="babyfotos wien – 6 Monate, Bauchlage im Studio"
                  className="rounded-2xl shadow-xl w-full h-auto object-contain"
                  loading="eager"
                />
              </div>
              <div>
                <img
                  src={heroImage2}
                  alt="babyfotos wien – Sitter-Phase Baby 7 Monate"
                  className="rounded-xl shadow-lg w-full h-auto object-contain"
                  loading="eager"
                />
              </div>
              <div>
                <img
                  src={heroImage3}
                  alt="babyfotos wien – lachendes Baby im Studio"
                  className="rounded-xl shadow-lg w-full h-auto object-contain"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* 3-12 Months is Different Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">3–12 Monate ist anders als Neugeboren</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="prose prose-lg max-w-none">
              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Smile className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700"><strong>Mehr Ausdruck:</strong> Lachen, Stirnrunzeln, Zunge raus.</span>
                  </li>
                  <li className="flex items-start">
                    <Hand className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700"><strong>Mehr Interaktion:</strong> Blickkontakt, Greifen, erste Sitzversuche.</span>
                  </li>
                  <li className="flex items-start">
                    <Camera className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700"><strong>Andere Posen:</strong> Bauchlage, Rückenrolle, Sitz in Stütze – keine Neugeborenen-Wraps.</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700"><strong>Kürzere Takte:</strong> Mini-Sets mit Pausen statt langer, schlafbasierter Posing-Phasen.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-lg text-gray-700 mb-0">
                  <strong>Kurz:</strong> Neugeborene (5–14 Tage) = schlafbasierte Ruheposen. 
                  Babyfotos (3–12 M) = Bewegung, Mimik, Spiel.
                </p>
                <Link 
                  to="/neugeborenenfotos-wien/" 
                  className="text-purple-600 hover:text-purple-700 underline text-sm mt-3 inline-block"
                >
                  → Zu unseren Neugeborenenfotos
                </Link>
              </div>
            </div>

            <div>
              <img
                src={heroImage4}
                alt="Unterschied Neugeborene und Babyfotos Wien"
                className="rounded-2xl shadow-lg w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Age Milestones Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Welches Alter zeigt was?</h2>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Alter</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Highlights</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Geeignete Sets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">3–4 Monate</td>
                  <td className="px-6 py-4 text-sm text-gray-700">starke Bauchlage, Blick in Kamera</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Bodensets, runde Props, Elternarme</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">5–6 Monate</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Stützsitz, Füßchen greifen</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Sitzkörbe, Decken, minimalistische Hintergründe</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">7–8 Monate</td>
                  <td className="px-6 py-4 text-sm text-gray-700">sicherer Sitz, Kichern</td>
                  <td className="px-6 py-4 text-sm text-gray-600">kleine Möbel, Spiegelspiel, Close-ups</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">9–10 Monate</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Krabbeln, High-Fives</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Bewegung, Serienbilder, Geschwister-Interaktion</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">11–12 Monate</td>
                  <td className="px-6 py-4 text-sm text-gray-700">erste Schritte, Klatschen</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Steh-Stütze, Mini-Torte (ohne Chaos)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Studio vs Outdoor */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Studio oder Outdoor?</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <Home className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Studio</h3>
              </div>
              <p className="text-lg text-gray-600 mb-4"><em>clean, zart, zeitlos</em></p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">wetterfest</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">kontrolliertes Licht</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">ruhige Musik</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <Sun className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Outdoor</h3>
              </div>
              <p className="text-lg text-gray-600 mb-4"><em>lebendig, natürlich</em></p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Blattgeraschel</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Farben</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Saisonlook (Frühling/Herbst)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-100 rounded-xl p-6">
            <p className="text-gray-800">
              <strong>Tipp:</strong> Golden Hour macht Augen glanzvoll. Für Minis planen wir kurze Spielblöcke.
            </p>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pakete & Preise
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Mini Baby Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Mini Baby</h3>
                <p className="text-purple-600 font-medium">40 Minuten</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">€170</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 Set</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Auswahlgalerie</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">8 Retuschen</span>
                </div>
              </div>

              <button
                onClick={() => handleBookPackage('Mini Baby', 170, 'Babyfotografie - 1 Set, 8 Retuschen')}
                className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Jetzt buchen
              </button>
            </div>

            {/* Klassik Baby Package - BELIEBT */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8 transform scale-105 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-bl-lg rounded-tr-2xl">
                BELIEBT
              </div>
              
              <div className="mb-6 mt-4">
                <h3 className="text-2xl font-bold mb-2">Klassik Baby</h3>
                <p className="text-purple-100 font-medium">75 Minuten</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">€290</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>2–3 Sets</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>18 Retuschen</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>6 Prints 13×18</span>
                </div>
              </div>

              <button
                onClick={() => handleBookPackage('Klassik Baby', 290, 'Babyfotografie - 2-3 Sets, 18 Retuschen')}
                className="block w-full text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Jetzt buchen
              </button>
            </div>

            {/* Family & Baby Plus Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Family & Baby Plus</h3>
                <p className="text-purple-600 font-medium">90 Minuten</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">€420</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Baby + Eltern/Geschwister</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">28 Retuschen</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Leinwand 30×40</span>
                </div>
              </div>

              <button
                onClick={() => handleBookPackage('Family & Baby Plus', 420, 'Babyfotografie - Baby + Familie, 28 Retuschen')}
                className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Jetzt buchen
              </button>
            </div>
          </div>

          {/* Extras */}
          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <p className="text-gray-700">
              <strong>Extras:</strong> Zusatzbild €15, Express 72 h €60, Fine-Art-Album ab €175.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Freie Slots sind knapp. Trag dich hier ein: <Link to="/warteliste" className="text-purple-600 hover:text-purple-700 underline font-semibold">Termin-Warteliste</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">So läuft euer Shooting ab</h2>
          
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Vorgespräch</h3>
              <p className="text-gray-600 text-sm">Alter, Schlaf-/Essfenster, Lieblingsfarben</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Ankommen</h3>
              <p className="text-gray-600 text-sm">Eingewöhnung, leise Musik, Set-Check</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Shooting</h3>
              <p className="text-gray-600 text-sm">8–10-Minuten-Blöcke, Pausen nach Bedarf</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Auswahl</h3>
              <p className="text-gray-600 text-sm">Online-Galerie, Lieblingsmotive markieren</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">5</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Finale</h3>
              <p className="text-gray-600 text-sm">Sanfte Retusche, Download, Prints oder Album</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Comfort Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Sicherheit & Komfort</h2>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <ul className="space-y-4">
              <li className="flex items-start">
                <Shield className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Weiche Untergründe, gesicherte Props, nur bodennahe Posen.</span>
              </li>
              <li className="flex items-start">
                <Baby className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Kein Zwang. Kein „Sitzen müssen". Das Tempo gibt dein Baby vor.</span>
              </li>
              <li className="flex items-start">
                <Heart className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Studio ist warm, gewickelt wird ohne Hektik.</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Hygiene: Frische Decken/Bezüge pro Termin, Hände desinfiziert.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Outfits & Props Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Outfits & Requisiten</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Empfohlen</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Einfarbig, strukturiert: Strick, Musselin, Leinen</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>2–3 Outfits in ähnlichen Tönen (Sand, Creme, Salbei, Denim)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Lieblingsspielzeug – ja, bitte! Klein, nicht zu bunt</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Vermeiden</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Große Logos oder Neon-Farben</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Zu viele verschiedene Farben</span>
                </li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Mitbringen:</h4>
                <p className="text-sm text-gray-600">Ersatzbody, Feuchttücher, Snacks für Eltern, Wasser</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lighting Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Farben & Licht (für Foto-Nerds, ganz kurz)</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <Eye className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Licht-Setup</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Clamshell-Softlight für zarte Hauttöne</li>
                <li>• Fensterlicht + Reflektor für natürlichen Glow</li>
                <li>• Edge-Akzent (dezent) für Tiefe bei dunkleren Outfits</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <Camera className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Farbmanagement</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Hauttöne kalibriert</li>
                <li>• Prints farbverbindlich</li>
                <li>• Konsistenter Look über alle Aufnahmen</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Note Section */}
      <section className="py-12 bg-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Mini-Galerie</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-700"><strong>60 % Close-ups:</strong> Hände, Füßchen, Wimpern</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-700"><strong>40 % Mini-Momente:</strong> Kichern, Zunge, Elternkuss</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Häufige Fragen (FAQ)</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wie plane ich die Zeit?</h3>
              <p className="text-gray-600">
                Wähle ein Fenster zwischen Nickerchen. Frisch gefüttert = beste Laune.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Was, wenn mein Baby quengelt?</h3>
              <p className="text-gray-600">
                Wir pausieren. Kein Druck. Sicherheit & Wohlbefinden gehen vor.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Dürfen Eltern/Geschwister mit aufs Bild?</h3>
              <p className="text-gray-600">
                Ja – bei jedem Paket möglich (bei Mini kurz & simpel).
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wann bekomme ich die Bilder?</h3>
              <p className="text-gray-600">
                Vorauswahl 3–5 Tage, Finale 10–14 Tage (Express möglich).
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Darf ich die Bilder drucken?</h3>
              <p className="text-gray-600">
                Ja, für private Nutzung. Fine-Art-Prints/Alben bieten wir an.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why New Age Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Warum New Age Fotografie?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <Star className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">12+ Jahre Erfahrung</h3>
              <p className="text-sm text-gray-600">mit Babys & Familien</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <Camera className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Babyfotos Wien-optimiert</h3>
              <p className="text-sm text-gray-600">minimalistisch, zeitlos</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <Heart className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Lockerer Ablauf</h3>
              <p className="text-sm text-gray-600">mit Blick für echte Mimik</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Weitere Fotografie-Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/neugeborenenfotos-wien/"
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <Baby className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Neugeborenenfotos</h3>
              <p className="text-gray-600 text-sm mb-4">
                Schlafbasierte Sessions für Tag 5–14 nach Geburt
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/familienfotos-wien/"
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <Users className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Familienfotos</h3>
              <p className="text-gray-600 text-sm mb-4">
                Authentische Familienfotos im Studio mit bis zu 12 Personen
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/schwangerschaftsfotos-wien/"
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <Heart className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Schwangerschaftsfotos</h3>
              <p className="text-gray-600 text-sm mb-4">
                Babybauch-Fotografie in entspannter Atmosphäre
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* External Link Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            <strong>Externer Hinweis:</strong> Für kinderfreundliche Orte & Services schau bei{' '}
            <a 
              href="https://www.wien.gv.at/menschen/kind-familie/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Stadt Wien – Familie & Kinder
            </a>
            {' '}vorbei (z. B. Wickelmöglichkeiten, Parks).
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für zauberhafte Babyfotos in Wien?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sichere dir jetzt deinen Termin für <strong>babyfotos wien</strong>. Wir kümmern uns um Licht, Stimmung und die kleinen, großen Momente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/warteliste"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              Zur Termin-Warteliste
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/gutschein/baby"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg"
            >
              Baby-Gutschein kaufen
            </Link>
          </div>
        </div>
      </section>

    </div>
    </Layout>
  );
}
