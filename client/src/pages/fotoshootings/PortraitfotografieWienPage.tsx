import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Camera, User, Star, Sparkles, ArrowRight, Check, Heart } from 'lucide-react';

export default function PortraitfotografieWienPage() {
  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Portraitfotografie Wien – Professionelle Portraits | New Age Fotografie"
        description="Professionelle Portraitfotografie in Wien. Individuelle Portraits für private oder berufliche Zwecke. Natürlich, modern & professionell. Jetzt Termin buchen!"
        keywords="portraitfotografie wien, portrait wien, portraitfotograf wien, portraitshooting wien, fotograf portraits wien"
        canonical="/portrait-fotografie-wien/"
        hreflang={[
          { lang: 'de', url: '/portrait-fotografie-wien/' },
          { lang: 'en', url: '/en/portrait-photography-vienna/' }
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Portraitfotografie in Wien
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Ausdrucksstarke Portraits, die Ihre Persönlichkeit einfangen. 
                Ob für private Erinnerungen oder professionelle Zwecke – wir setzen Sie perfekt in Szene.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Termin buchen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/vouchers"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 border-2 border-purple-500 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
                >
                  Gutschein kaufen
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                <Camera className="w-32 h-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portrait Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Verschiedene Portrait-Stile</h2>
            <p className="text-lg text-gray-600">Von klassisch bis modern – wir finden den perfekten Stil für Sie</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 rounded-xl p-6">
              <User className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Klassische Portraits</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Zeitlose Eleganz</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Studio-Setting mit professionellem Licht</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Perfekt für formelle Anlässe</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <Sparkles className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kreative Portraits</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Künstlerischer Ausdruck</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Besondere Lichteffekte</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Einzigartige Kompositionen</span>
                </li>
              </ul>
            </div>

            <div className="bg-pink-50 rounded-xl p-6">
              <Heart className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Outdoor Portraits</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Natürliches Licht</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Wunderschöne Wiener Locations</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Entspannte Atmosphäre</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Unsere Portrait-Pakete</h2>
            <p className="text-lg text-gray-600">Professionelle Portraitfotografie zu fairen Preisen</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Package */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Basis Portrait</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-purple-600">€149</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>30 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>8 bearbeitete Bilder digital</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Studio oder Outdoor</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>1 Outfit</span>
                </li>
              </ul>
              <Link
                to="/kontakt"
                className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Premium Package */}
            <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-purple-500 relative transform scale-105">
              <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                EMPFOHLEN
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Portrait</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-purple-600">€249</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>60 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>15 bearbeitete Bilder digital</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Studio & Outdoor kombiniert</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>2-3 Outfits</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Styling-Beratung</span>
                </li>
              </ul>
              <Link
                to="/kontakt"
                className="block w-full text-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Deluxe Package */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Deluxe Portrait</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-purple-600">€399</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>90 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>25 bearbeitete Bilder digital</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Mehrere Locations</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Unbegrenzte Outfits</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Professionelles Make-up & Styling</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Premium Fotoalbum</span>
                </li>
              </ul>
              <Link
                to="/kontakt"
                className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Wofür Sie Portraits verwenden können</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <Star className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Social Media</h3>
              <p className="text-sm text-gray-600">Professionelle Profilbilder für Instagram, Facebook & Co</p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6 text-center">
              <User className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Persönliche Erinnerungen</h3>
              <p className="text-sm text-gray-600">Meilensteine & besondere Momente festhalten</p>
            </div>

            <div className="bg-pink-50 rounded-lg p-6 text-center">
              <Heart className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Geschenke</h3>
              <p className="text-sm text-gray-600">Einzigartige Geschenkidee für Ihre Liebsten</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <Camera className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Künstlerportfolios</h3>
              <p className="text-sm text-gray-600">Für Schauspieler, Models & Künstler</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tipps für Ihr Portrait-Shooting</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kleidung & Styling</h3>
              <p className="text-gray-600">
                Wählen Sie Kleidung, in der Sie sich wohlfühlen. Einfarbige Outfits ohne große Muster 
                funktionieren oft am besten. Bringen Sie gerne mehrere Optionen mit – wir helfen Ihnen bei der Auswahl.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Entspannung ist der Schlüssel</h3>
              <p className="text-gray-600">
                Nervosität vor der Kamera ist völlig normal! Wir nehmen uns Zeit, damit Sie sich entspannen können. 
                Die besten Portraits entstehen, wenn Sie authentisch sind und sich wohlfühlen.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Location-Wahl</h3>
              <p className="text-gray-600">
                Studio-Portraits bieten kontrollierbares Licht und klassische Eleganz. Outdoor-Portraits 
                haben einen natürlicheren Look. Wir beraten Sie gerne, welcher Stil am besten zu Ihnen passt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Weitere Fotografie-Services</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/business-portrait-wien/" className="bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <User className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Portraits</h3>
              <p className="text-gray-600">
                Professionelle Business-Portraits für LinkedIn, Website und Bewerbungen.
              </p>
            </Link>

            <Link to="/familien-fotoshooting-wien/" className="bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Heart className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Familien-Fotoshooting</h3>
              <p className="text-gray-600">
                Die ganze Familie gemeinsam – unvergessliche Erinnerungen für die Ewigkeit.
              </p>
            </Link>

            <Link to="/kinder-fotografie-wien/" className="bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Sparkles className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kinder-Fotografie</h3>
              <p className="text-gray-600">
                Lebendige, natürliche Kinderfotos die die Persönlichkeit einfangen.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit für Ihr professionelles Portrait?</h2>
          <p className="text-xl mb-8 text-purple-50">
            Buchen Sie jetzt Ihr Portraitshooting in Wien und lassen Sie sich perfekt in Szene setzen!
          </p>
          <Link
            to="/kontakt"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Jetzt Termin vereinbaren
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

    </div>
    </Layout>
  );
}
