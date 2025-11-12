import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Camera, Heart, Users, Star, ArrowRight, Check } from 'lucide-react';

export default function FamilienFotoshootingWienPage() {
  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Familien-Fotoshooting in Wien – New Age Fotografie"
        description="Echte Emotionen und natürliche Familienportraits im Studio oder Outdoor. Termin jetzt planen."
        keywords="familien fotoshooting wien, familienfotograf wien, familienfotos wien, outdoor fotoshooting familie"
        canonical="/familien-fotoshooting-wien/"
        ogImage="https://www.newagefotografie.com/images/family-hero.jpg"
        hreflang={[
          { lang: 'de', url: '/familien-fotoshooting-wien/' },
          { lang: 'en', url: '/en/family-photoshoot-vienna/' }
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Familien-Fotoshooting in Wien
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Echte Emotionen und natürliche Familienportraits im Studio oder Outdoor. 
                Wir halten die schönsten Momente Ihrer Familie für die Ewigkeit fest.
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
                  to="/preise"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
                >
                  Preise ansehen
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/family-hero.jpg"
                alt="Glückliche Familie beim Fotoshooting in Wien"
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
            Warum ein Familien-Fotoshooting bei New Age Fotografie?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Natürliche Emotionen</h3>
              <p className="text-gray-600">
                Spontane, ungezwungene Aufnahmen, die echte Verbindungen zeigen
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Für alle Generationen</h3>
              <p className="text-gray-600">
                Von Neugeborenen bis Großeltern – alle sind willkommen
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Camera className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Studio & Outdoor</h3>
              <p className="text-gray-600">
                Wählen Sie zwischen gemütlichem Studio oder natürlichen Locations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Unsere Familien-Pakete</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Package */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Basis</h3>
              <div className="text-3xl font-bold text-purple-600 mb-6">
                €199
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>30 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>10 bearbeitete Bilder</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Online-Galerie</span>
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
                  <span>60 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>25 bearbeitete Bilder</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Studio + Outdoor möglich</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Alle Bilder in Druckqualität</span>
                </li>
              </ul>
              <Link
                to="/termin-planen"
                className="block text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Deluxe Package */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Deluxe</h3>
              <div className="text-3xl font-bold text-purple-600 mb-6">
                €599
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>90 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>40 bearbeitete Bilder</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Location Ihrer Wahl</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Premium Fotoalbum</span>
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

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">So läuft Ihr Familien-Shooting ab</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Termin buchen</h3>
              <p className="text-gray-600 text-sm">Online oder telefonisch</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Vorbesprechung</h3>
              <p className="text-gray-600 text-sm">Wünsche & Location klären</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Fotoshooting</h3>
              <p className="text-gray-600 text-sm">Entspannt & professionell</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Bildauswahl</h3>
              <p className="text-gray-600 text-sm">Online-Galerie nach 7 Tagen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services - Internal Links */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Weitere Fotografie-Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/baby-fotografie-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">Baby & Newborn Fotografie</h3>
              <p className="text-gray-600 text-sm mb-4">
                Zarte Neugeborenenfotos mit Herz und Sicherheit
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/schwangerschaftsfotos-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">Schwangerschafts-Fotos</h3>
              <p className="text-gray-600 text-sm mb-4">
                Emotionale Babybauch-Portraits im Studio oder Outdoor
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/paar-fotoshooting-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">Paar-Fotoshooting</h3>
              <p className="text-gray-600 text-sm mb-4">
                Romantische Paarshootings für besondere Momente
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
            Bereit für unvergessliche Familienfotos?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Buchen Sie jetzt Ihren Termin und sichern Sie sich die schönsten Erinnerungen
          </p>
          <Link
            to="/termin-planen"
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
