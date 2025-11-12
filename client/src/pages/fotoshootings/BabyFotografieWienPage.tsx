import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Baby, Heart, Shield, Star, ArrowRight, Check, Clock } from 'lucide-react';

export default function BabyFotografieWienPage() {
  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Baby- & Newborn-Fotografie in Wien – New Age Fotografie"
        description="Zarte Neugeborenenfotos mit Herz und Sicherheit. Erinnerungen für immer."
        keywords="babyfotograf wien, newborn fotografie wien, neugeborenen fotoshooting, babyshooting wien"
        canonical="/baby-fotografie-wien/"
        ogImage="https://www.newagefotografie.com/images/baby-hero.jpg"
        hreflang={[
          { lang: 'de', url: '/baby-fotografie-wien/' },
          { lang: 'en', url: '/en/baby-photography-vienna/' }
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Baby- & Newborn-Fotografie in Wien
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Zarte, sichere und liebevolle Neugeborenen-Fotoshootings in Wien. 
                Wir halten die ersten kostbaren Momente Ihres Babys für immer fest.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/termin-planen"
                  className="inline-flex items-center justify-center px-8 py-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold"
                >
                  Termin buchen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/gutschein/newborn"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors font-semibold"
                >
                  Gutschein verschenken
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/baby-hero.jpg"
                alt="Neugeborenes Baby beim professionellen Fotoshooting in Wien"
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
            Sicherheit & Komfort für Ihr Neugeborenes
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Sicher & Hygienisch</h3>
              <p className="text-gray-600 text-sm">
                Höchste Hygiene-Standards und sichere Posing-Techniken
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Flexibel & Geduldig</h3>
              <p className="text-gray-600 text-sm">
                Wir nehmen uns Zeit - Pausen für Stillen & Wickeln inklusive
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Warmes Studio</h3>
              <p className="text-gray-600 text-sm">
                Angenehm warm (26-28°C) für nackte Baby-Fotografie
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                <Baby className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Ideales Alter</h3>
              <p className="text-gray-600 text-sm">
                Beste Ergebnisse in den ersten 5-14 Lebenstagen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Newborn-Fotografie Pakete</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Essential Package */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Essential</h3>
              <div className="text-3xl font-bold text-pink-600 mb-6">
                €299
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>2-3 Stunden Shooting (inkl. Pausen)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>15 bearbeitete Bilder</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Baby solo & mit Eltern</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Requisiten & Textilien</span>
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
            <div className="bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-xl shadow-2xl p-8">
              <div className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                EMPFOHLEN
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium</h3>
              <div className="text-3xl font-bold mb-6">
                €499
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>3-4 Stunden Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>30 bearbeitete Bilder</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Geschwister-Fotos inklusive</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Premium Fotoalbum 20x20cm</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Alle Bilder in Druckqualität</span>
                </li>
              </ul>
              <Link
                to="/termin-planen"
                className="block text-center px-6 py-3 bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tipps für Ihr Newborn-Shooting</h2>
          <div className="space-y-6">
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">📅 Bester Zeitpunkt</h3>
              <p className="text-gray-700">
                Buchen Sie bereits während der Schwangerschaft und planen Sie das Shooting für 
                die ersten 5-14 Lebenstage ein, wenn Babys noch sehr schläfrig sind.
              </p>
            </div>
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">🍼 Vor dem Termin</h3>
              <p className="text-gray-700">
                Füttern Sie Ihr Baby ca. 30 Minuten vor dem Shooting, damit es satt und zufrieden ist. 
                Eine volle Windel und ein voller Bauch sorgen für entspannte Posen.
              </p>
            </div>
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">👶 Was mitbringen?</h3>
              <p className="text-gray-700">
                Windeln, Feuchttücher, Schnuller (falls verwendet), ein Lieblingsdeckchen. 
                Alle Requisiten und Textilien stellen wir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Passende Ergänzungen</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/schwangerschaftsfotos-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">Schwangerschafts-Fotos</h3>
              <p className="text-gray-600 text-sm mb-4">
                Halten Sie die Vorfreude auf Ihr Baby fest
              </p>
              <span className="text-pink-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/familien-fotoshooting-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">Familien-Fotoshooting</h3>
              <p className="text-gray-600 text-sm mb-4">
                Die ganze Familie gemeinsam vor der Kamera
              </p>
              <span className="text-pink-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/kinder-fotografie-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">Kinder-Fotografie</h3>
              <p className="text-gray-600 text-sm mb-4">
                Lebendige Kinderfotos voller Persönlichkeit
              </p>
              <span className="text-pink-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Die ersten Tage vergehen so schnell...
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sichern Sie sich jetzt Ihren Wunschtermin für zauberhafte Neugeborenen-Fotos
          </p>
          <Link
            to="/termin-planen"
            className="inline-flex items-center px-8 py-4 bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Jetzt reservieren
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

    </div>
    </Layout>
  );
}
