import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Camera, ArrowRight, Check } from 'lucide-react';

export default function SchwangerschaftsfotosWienPage() {
  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Schwangerschafts-Fotos in Wien – Babybauch-Shooting mit Stil"
        description="Emotionale Babybauch-Portraits im Studio oder Outdoor mit Partner und Lichtzauber."
        keywords="schwangerschaftsfotografie wien, babybauch fotoshooting, schwangerschaft fotos wien, maternity shooting"
        canonical="/schwangerschaftsfotos-wien/"
        ogImage="https://www.newagefotografie.com/images/maternity-hero.jpg"
        hreflang={[
          { lang: 'de', url: '/schwangerschaftsfotos-wien/' },
          { lang: 'en', url: '/en/maternity-photography-vienna/' }
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Schwangerschafts-Fotos in Wien
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Emotionale Babybauch-Portraits im Studio oder Outdoor. 
                Feiern Sie die Schönheit der Schwangerschaft mit professionellen, 
                stilvollen Fotos, die diese besondere Zeit für immer festhalten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/termin-planen"
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Termin buchen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/gutschein/maternity"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
                >
                  Gutschein verschenken
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/maternity-hero.jpg"
                alt="Schwangere Frau beim Babybauch Fotoshooting in Wien"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Warum Schwangerschaftsfotos?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Einzigartige Zeit</h3>
              <p className="text-gray-600">
                Die Schwangerschaft ist eine kurze, kostbare Phase - 
                bewahren Sie diese Erinnerungen
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Natürliche Schönheit</h3>
              <p className="text-gray-600">
                Sanftes Licht und geschmackvolle Posen, die Ihre 
                Weiblichkeit unterstreichen
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Camera className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexible Locations</h3>
              <p className="text-gray-600">
                Gemütliches Studio mit Umkleidekabine oder draußen 
                an Ihrer Lieblingslocation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Time Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Wann ist der beste Zeitpunkt?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Ideal ist das <strong>3. Trimester zwischen der 28. und 34. Schwangerschaftswoche</strong>.
            Der Babybauch ist schön sichtbar, aber Sie fühlen sich noch beweglich und wohl.
          </p>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="font-semibold text-xl mb-4">Tipp vom Profi</h3>
            <p className="text-gray-600">
              Buchen Sie Ihren Termin bereits früher, damit wir gemeinsam den perfekten 
              Zeitpunkt finden können. Bei Mehrlingsschwangerschaften empfehlen wir 
              eine etwas frühere Terminfestlegung (26.-30. SSW).
            </p>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Schwangerschafts-Fotografie Pakete
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Studio Package */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Studio</h3>
              <div className="text-3xl font-bold text-purple-600 mb-6">
                €249
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>45 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>15 bearbeitete Bilder</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Umkleidekabine & Kleiderauswahl</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Solo oder mit Partner</span>
                </li>
              </ul>
              <Link
                to="/termin-planen"
                className="block text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Premium Package */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl shadow-2xl p-8 transform scale-105">
              <div className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                BELIEBT
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium</h3>
              <div className="text-3xl font-bold mb-6">
                €399
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>90 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>25 bearbeitete Bilder</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Studio + Outdoor Mix</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Geschwisterkinder willkommen</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Hochauflösende Dateien</span>
                </li>
              </ul>
              <Link
                to="/termin-planen"
                className="block text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Outdoor Package */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Outdoor</h3>
              <div className="text-3xl font-bold text-purple-600 mb-6">
                €349
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>60 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>20 bearbeitete Bilder</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Location Ihrer Wahl in Wien</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Natürliches Licht</span>
                </li>
              </ul>
              <Link
                to="/termin-planen"
                className="block text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Jetzt buchen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What to Wear Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Was soll ich anziehen?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">👗 Für Sie</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Lange, fließende Kleider in Nude, Weiß oder Pastelltönen</li>
                <li>• Spitzen-Bodies oder BH + lockere Hose</li>
                <li>• Figurbetonte Kleider, die den Bauch zeigen</li>
                <li>• Wir haben auch einige Kleider im Studio zum Ausleihen!</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">👕 Für Ihren Partner</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Einfarbige Hemden oder T-Shirts</li>
                <li>• Neutrale Farben (Schwarz, Weiß, Grau, Beige)</li>
                <li>• Vermeiden Sie auffällige Muster oder Logos</li>
                <li>• Barfuß oder dunkle Socken</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Die perfekte Ergänzung</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/baby-fotografie-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">Newborn-Fotografie</h3>
              <p className="text-gray-600 text-sm mb-4">
                Buchen Sie schon jetzt Ihr Neugeborenen-Shooting
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/familien-fotoshooting-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">Familien-Shooting</h3>
              <p className="text-gray-600 text-sm mb-4">
                Die komplette Familie gemeinsam vor der Kamera
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/paar-fotoshooting-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">Paar-Shooting</h3>
              <p className="text-gray-600 text-sm mb-4">
                Romantische Aufnahmen zu zweit
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Feiern Sie diese besondere Zeit
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Buchen Sie jetzt Ihr Schwangerschafts-Fotoshooting in Wien
          </p>
          <Link
            to="/termin-planen"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Termin vereinbaren
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

    </div>
    </Layout>
  );
}
