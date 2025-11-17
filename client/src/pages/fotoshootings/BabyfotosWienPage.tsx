import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import GoogleReviews from '../../components/layout/GoogleReviews';
import { Link } from 'react-router-dom';
import { Camera, Heart, Users, Star, ArrowRight, Check, Clock, Baby, Music, Smile, Shield, Cake } from 'lucide-react';

export default function BabyfotosWienPage() {
  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Babyfotos Wien – Studio-Shooting (3–12 Monate) | New Age Fotografie"
        description="Babyfotos in Wien (3–12 Monate): sichere Studio-Shootings, liebevolle Meilenstein-Porträts, Eltern & Geschwister inklusive. Pakete ab €95. Jetzt Termin sichern."
        keywords="babyfotos wien, baby fotografie wien, baby shooting wien, sitter fotos wien"
        canonical="/babyfotos-wien/"
        ogImage="https://www.newagefotografie.com/images/baby-hero.jpg"
        hreflang={[
          { lang: 'de', url: '/babyfotos-wien/' },
          { lang: 'en', url: '/en/baby-photos-vienna/' }
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Babyfotos (3–12 Monate) in Wien
              </h1>
              <p className="text-xl text-gray-700 mb-4 leading-relaxed font-semibold">
                Studio-Sessions, die wachsen mit
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Babys verändern sich rasant – vom ersten Stütz auf dem Bauch bis zum sicheren Sitzen und den ersten 
                Schritten am 1. Geburtstag. In unserem warmen Studio in Wien fotografieren wir diese Meilensteine entspannt, 
                sicher und mit viel Geduld. Kein Neugeborenen-Posing – <strong>Babyfotos (3–12 Monate)</strong> sind aktiv, 
                wach & verspielt und bewusst getrennt von unseren Neugeborenen-Sessions.
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
                  to="/gutschein/baby"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold text-lg"
                >
                  Baby-Gutschein verschenken
                </Link>
              </div>
            </div>

            {/* Right: Hero Images Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <img
                  src="/images/baby-hero.jpg"
                  alt="Babyfotos Wien Studio Shooting"
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                  loading="eager"
                />
              </div>
              <div>
                <img
                  src="https://i.postimg.cc/V6TFF8rC/00508749.jpg"
                  alt="Baby Portrait Wien"
                  className="rounded-xl shadow-lg w-full h-48 object-cover"
                  loading="eager"
                />
              </div>
              <div>
                <img
                  src="https://i.imgur.com/3gctBYO.jpg"
                  alt="Sitter Baby Fotografie Wien"
                  className="rounded-xl shadow-lg w-full h-48 object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* What Makes Our Baby Photos Special Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Was macht unsere Babyfotos aus?</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Altersfenster & Meilensteine:</h3>
                  <p className="text-gray-700">
                    <strong>3–4 Monate</strong> (Bauchlage & Mimik) · <strong>6–9 Monate</strong> (Sitter – Lieblingsphase!) · 
                    <strong>10–12 Monate</strong> (Stehen mit Hilfe / 1. Geburtstag).
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Studio-only:</h3>
                  <p className="text-gray-700">
                    Konstantes Licht, saubere Hintergründe, sichere Requisiten.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Familienfotos inklusive:</h3>
                  <p className="text-gray-700">
                    Eltern & Geschwister können mit auf die Bilder (bis zu 12 Personen, Haustiere willkommen).
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Outfits & Requisiten:</h3>
                  <p className="text-gray-700">
                    2–3 Outfits empfohlen, Lieblingsspielzeug, kleine Snacks. Luftballons & Deko für „One-Year" gerne mitbringen.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sicher & entspannt:</h3>
                  <p className="text-gray-700">
                    Zeit für Pausen, Wickeln und Kuscheln ist eingeplant.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://i.postimg.cc/V6TFF8rC/00508749.jpg"
                alt="Baby im Studio Wien"
                className="rounded-2xl shadow-lg w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pakete & Preise – Babyfotos (3–12 Monate)
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              <strong>Immer inklusive:</strong> Private Nutzungsrechte, Auswahlgalerie, sanfte Retusche nach Look von New Age Fotografie, 
              Eltern- & Geschwisterportraits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Basic Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                <p className="text-purple-600 font-medium">Erste Highlights</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">€95</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">ca. 45–60 Minuten im Studio</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 retuschiertes Lieblingsfoto digital</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Leinwand 40×30 cm mit demselben Motiv</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1–2 Looks/Sets (z. B. neutral + mit Spielzeug)</span>
                </div>
              </div>

              <Link
                to="/warteliste"
                className="block text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Premium Package */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8 transform scale-105 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-bl-lg rounded-tr-2xl">
                EMPFOHLEN
              </div>
              
              <div className="mb-6 mt-4">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <p className="text-purple-100 font-medium">Unsere Empfehlung</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">€195</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>ca. 60–90 Minuten im Studio</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>5 retuschierte Lieblingsfotos digital (frei wählbar)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Leinwand 40×30 cm (Motiv nach Wahl)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>2–3 Looks/Sets (inkl. Sitter-Set ab ca. 6–9 Monaten)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Eltern & Geschwisterbilder inklusive</span>
                </div>
              </div>

              <Link
                to="/warteliste"
                className="block text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Deluxe Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Deluxe</h3>
                <p className="text-purple-600 font-medium">Das komplette Erlebnis</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">€295</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">ca. 90–120 Minuten im Studio</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">10 retuschierte Lieblingsfotos digital</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Leinwand 60×40 cm (Motiv nach Wahl)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">3–4 Looks/Sets (z. B. neutral, Textur, Close-ups, Birthday-Deko)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Extra Zeit für Variationen & Details (Händchen, Füßchen, Wimpern)</span>
                </div>
              </div>

              <Link
                to="/warteliste"
                className="block text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>
          </div>

          {/* CTA Buttons after packages */}
          <div className="mt-12 text-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Jetzt buchen</h3>
            <p className="text-gray-700 mb-6">
              👉 <strong>Termin sichern:</strong> Plätze sind begrenzt – sichern Sie sich Ihren Wunschtermin auf der Warteliste
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/warteliste"
                className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Termin auf der Warteliste sichern
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/gutschein/baby"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
              >
                Baby-Gutschein verschenken
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What to Bring Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <img
              src="https://i.imgur.com/3gctBYO.jpg"
              alt="Baby Fotoshooting Vorbereitung Wien"
              className="rounded-2xl shadow-lg w-full h-96 object-cover"
              loading="lazy"
            />
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Was soll ich mitbringen?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                  <Smile className="h-5 w-5 text-purple-600 mr-2" />
                  Outfits
                </h3>
                <p className="text-gray-700 text-sm">
                  2–3 Sets (einmal neutral, einmal farbig/strukturiert), Body als Basis.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                  <Baby className="h-5 w-5 text-purple-600 mr-2" />
                  Kleines Spielzeug
                </h3>
                <p className="text-gray-700 text-sm">
                  Rassel, Lieblingskuscheltier (ideal auch als Erinnerungsobjekt auf Fotos).
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                  <Heart className="h-5 w-5 text-purple-600 mr-2" />
                  Snacks & Wasser
                </h3>
                <p className="text-gray-700 text-sm">
                  Für schnelle Pausen.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                  <Cake className="h-5 w-5 text-purple-600 mr-2" />
                  Für 1. Geburtstag
                </h3>
                <p className="text-gray-700 text-sm">
                  Einfache Torte/Cupcakes oder Luftballons gerne mitbringen (wir räumen & schützen die Sets).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Häufige Fragen</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Ab wann lohnt sich ein Baby-Shooting?</h3>
              <p className="text-gray-600">
                Ab 3 Monaten – besonders beliebt: Sitter-Phase (6–9 Monate) wegen stabiler Sitzhaltung und strahlender Mimik.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wie viele Personen dürfen mit?</h3>
              <p className="text-gray-600">
                Bis zu 12 Personen – Kinder & Haustiere sind herzlich willkommen.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wie schnell bekommen wir die Fotos?</h3>
              <p className="text-gray-600">
                Preview innerhalb 48–72 h, finale Galerie in 2–3 Wochen (je nach Paket).
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Outfit-Tipps?</h3>
              <p className="text-gray-600">
                Unifarbene, sanfte Töne, Texturen statt Logos. Für Eltern/Geschwister: farblich abgestimmt, nicht identisch.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Bietet ihr auch Neugeborenenfotos an?</h3>
              <p className="text-gray-600">
                Ja, aber separat – ohne Überschneidung zu Babyfotos: <Link to="/neugeborenenfotos-wien/" className="text-purple-600 hover:text-purple-700 underline">Neugeborenenfotos Wien</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Nächste Schritte</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/warteliste"
              className="block bg-purple-600 text-white rounded-xl p-6 hover:bg-purple-700 transition-colors text-center"
            >
              <ArrowRight className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Termin sichern</h3>
              <p className="text-sm opacity-90">Warteliste & Buchung</p>
            </Link>
            <Link
              to="/familienfotos-wien/"
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow text-center"
            >
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Familienfotos</h3>
              <p className="text-sm text-gray-600">Familienfotos im Studio</p>
            </Link>
            <Link
              to="/neugeborenenfotos-wien/"
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow text-center"
            >
              <Baby className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Neugeborenenfotos</h3>
              <p className="text-sm text-gray-600">Tag 5–14 nach der Geburt</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Internal Linking - Related Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Weitere Fotografie-Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/familienfotos-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <Users className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Familienfotografie</h3>
              <p className="text-gray-600 text-sm mb-4">
                Authentische Familienfotos im Studio mit bis zu 12 Personen
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/schwangerschaftsfotos-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <Heart className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Schwangerschafts-Fotos</h3>
              <p className="text-gray-600 text-sm mb-4">
                Emotionale Babybauch-Portraits im Studio oder Outdoor
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/business-portrait-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <Camera className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Business-Portraits</h3>
              <p className="text-gray-600 text-sm mb-4">
                Professionelle Unternehmensfotos & LinkedIn-Portraits
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für unvergessliche Babyfotos in Wien?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sichern Sie sich jetzt Ihren Wunschtermin – Plätze sind begrenzt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/warteliste"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              Termin auf der Warteliste sichern
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
    </Layout>
  );
}
