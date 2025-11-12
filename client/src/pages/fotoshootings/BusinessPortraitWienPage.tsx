import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Star, TrendingUp, ArrowRight, Check, Linkedin } from 'lucide-react';

export default function BusinessPortraitWienPage() {
  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Business-Portraits & Corporate-Fotografie in Wien"
        description="Professionelle Bewerbungs- und Branding-Portraits für Unternehmen und Selbständige."
        keywords="business portrait wien, corporate fotografie wien, bewerbungsfotos wien, mitarbeiterfotos, linkedin foto"
        canonical="/business-portrait-wien/"
        ogImage="https://www.newagefotografie.com/images/business-hero.jpg"
        hreflang={[
          { lang: 'de', url: '/business-portrait-wien/' },
          { lang: 'en', url: '/en/business-portrait-vienna/' }
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Business-Portraits & Corporate-Fotografie in Wien
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Professionelle Bewerbungsfotos, LinkedIn-Portraits und Mitarbeiter-Fotografie. 
                Präsentieren Sie sich und Ihr Team von der besten Seite.
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
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
                >
                  Preise ansehen
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/business-hero.jpg"
                alt="Professionelles Business Portrait in Wien"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Perfekt für
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Briefcase className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Bewerbungsfotos</h3>
              <p className="text-gray-600 text-sm">
                Seriös und sympathisch für Ihre Karriere
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Linkedin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Social Media</h3>
              <p className="text-gray-600 text-sm">
                LinkedIn, XING, Website-Profile
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Team-Fotos</h3>
              <p className="text-gray-600 text-sm">
                Einheitlicher Look fürs ganze Team
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Personal Branding</h3>
              <p className="text-gray-600 text-sm">
                Authentische Markenbildung
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Business-Fotografie Pakete</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Individual Package */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Individual</h3>
              <div className="text-3xl font-bold text-purple-600 mb-6">
                €149
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>15 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>5 bearbeitete Bilder</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Neutraler Hintergrund</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Ideal für Bewerbungen</span>
                </li>
              </ul>
              <Link
                to="/termin-planen"
                className="block text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Professional Package */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl shadow-2xl p-8 transform scale-105">
              <div className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                EMPFOHLEN
              </div>
              <h3 className="text-2xl font-bold mb-4">Professional</h3>
              <div className="text-3xl font-bold mb-6">
                €299
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>30 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>15 bearbeitete Bilder</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>2 verschiedene Outfits</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Mehrere Hintergründe</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Perfekt für LinkedIn</span>
                </li>
              </ul>
              <Link
                to="/termin-planen"
                className="block text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Team Package */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Team</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                ab €99
              </div>
              <p className="text-sm text-gray-600 mb-6">pro Person</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Vor Ort oder im Studio</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Einheitlicher Look</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>10 Bilder pro Person</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Ab 5 Personen</span>
                </li>
              </ul>
              <Link
                to="/kontakt"
                className="block text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Angebot anfragen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tipps für perfekte Business-Portraits
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="font-semibold text-xl mb-4">👔 Outfit-Empfehlungen</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Einfarbige Kleidung in dunklen oder neutralen Tönen</li>
                <li>• Hemd/Bluse gebügelt und sauber</li>
                <li>• Jackett oder Blazer für formelleren Look</li>
                <li>• Vermeiden Sie auffällige Muster oder Logos</li>
                <li>• Business Casual oder Business Formal je nach Branche</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="font-semibold text-xl mb-4">💡 Vorbereitung</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Haare frisch geschnitten/gestylt</li>
                <li>• Bei Bedarf: professionelles Make-up</li>
                <li>• Brille putzen (falls vorhanden)</li>
                <li>• Entspannt ankommen - wir haben keine Eile</li>
                <li>• Bringen Sie 2-3 Outfits zur Auswahl mit</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Services */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Corporate Fotografie Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-xl mb-3">Firmen-Events</h3>
              <p className="text-gray-600 mb-4">
                Professionelle Dokumentation Ihrer Firmenveranstaltungen, 
                Konferenzen und Networking-Events.
              </p>
              <Link
                to="/eventfotografie-wien/"
                className="text-purple-600 font-semibold flex items-center"
              >
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-xl mb-3">Imagefotos</h3>
              <p className="text-gray-600 mb-4">
                Authentische Bilder aus Ihrem Arbeitsalltag für Website, 
                Broschüren und Social Media.
              </p>
              <Link
                to="/kontakt"
                className="text-purple-600 font-semibold flex items-center"
              >
                Anfrage senden <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-xl mb-3">Produktfotos</h3>
              <p className="text-gray-600 mb-4">
                Hochwertige Produktfotografie für Ihren Online-Shop 
                oder Katalog.
              </p>
              <Link
                to="/kontakt"
                className="text-purple-600 font-semibold flex items-center"
              >
                Anfrage senden <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Häufige Fragen</h2>
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">
                Wie lange dauert ein Business-Portrait Shooting?
              </h3>
              <p className="text-gray-600">
                Ein Individual-Shooting dauert ca. 15-20 Minuten, das Professional-Paket 
                etwa 30-40 Minuten inkl. Outfit-Wechsel und verschiedenen Perspektiven.
              </p>
            </div>
            <div className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">
                Wann erhalte ich meine Bilder?
              </h3>
              <p className="text-gray-600">
                Sie erhalten eine Online-Galerie zur Bildauswahl innerhalb von 3 Werktagen. 
                Die finalen, bearbeiteten Bilder werden innerhalb von 7 Werktagen geliefert.
              </p>
            </div>
            <div className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">
                Können wir das Shooting bei uns im Büro machen?
              </h3>
              <p className="text-gray-600">
                Ja! Für Team-Shootings kommen wir gerne zu Ihnen ins Büro. 
                Wir bringen mobile Beleuchtung und Hintergrund-Systeme mit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für Ihr professionelles Business-Portrait?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Buchen Sie jetzt Ihren Termin oder fordern Sie ein individuelles Angebot für Ihr Team an
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/termin-planen"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
            >
              Termin buchen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/kontakt"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg"
            >
              Team-Angebot anfragen
            </Link>
          </div>
        </div>
      </section>

    </div>
    </Layout>
  );
}
