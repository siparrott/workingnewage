import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import GoogleReviews from '../../components/layout/GoogleReviews';
import { Link } from 'react-router-dom';
import { Camera, Heart, Users, Star, ArrowRight, Check, Clock, Briefcase, Linkedin, TrendingUp, Palette, Shield, Eye } from 'lucide-react';

export default function BewerbungsfotosWienPage() {
  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Bewerbungsfotos Wien – LinkedIn-Portraits mit Express-Retusche | New Age Fotografie"
        description="Professionelle Bewerbungsfotos in Wien: schnelle Lieferung, Hintergrund-Optionen, natürliche Retusche. Pakete ab €95. Jetzt Termin sichern."
        keywords="bewerbungsfotos wien, linkedin foto wien, bewerbungsfoto professionell wien, xing foto wien"
        canonical="/bewerbungsfotos-wien/"
        ogImage="https://www.newagefotografie.com/images/bewerbung-hero.jpg"
        hreflang={[
          { lang: 'de', url: '/bewerbungsfotos-wien/' },
          { lang: 'en', url: '/en/application-photos-vienna/' }
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Bewerbungsfotos & LinkedIn-Portraits in Wien
              </h1>
              <p className="text-xl text-gray-300 mb-4 leading-relaxed font-semibold">
                Klar, professionell, sympathisch.
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Ihre <strong>Bewerbungsfotos in Wien</strong> entstehen bei uns im Studio mit sicherem Posing-Coaching, 
                schnellen Lieferzeiten und Hintergründen, die zu Ihrer Branche passen. Perfekt für Lebenslauf, LinkedIn, 
                Xing, E-Mail-Signatur & Firmenprofil.
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
                  to="/preise"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg"
                >
                  Alle Preise ansehen
                </Link>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative">
              <img
                src="/images/bewerbung-hero.jpg"
                alt="Bewerbungsfotos Wien Studio"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* Introduction Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                Willkommen bei New Age Fotografie – Ihrem Partner für professionelle Bewerbungsfotos in Wien! 
                Unser Studio bietet die perfekte Umgebung für Bewerbungsfotos, LinkedIn-Portraits und XING-Profile. 
                Mit gezieltem Posing-Coaching, variablen Hintergründen und schneller Lieferung erstellen wir Portraits, 
                die Ihre beruflichen Chancen maximieren.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mt-4">
                Von Berufseinsteigern über Professionals bis zu Führungskräften – wir liefern Bewerbungsfotos, 
                die seriös, sympathisch und branchengerecht sind. Natürliche Retusche, High-Res-Export und 
                rechtssichere Nutzung für alle beruflichen Profile inklusive.
              </p>
            </div>
            <div>
              <img
                src="https://i.postimg.cc/V6TFF8rC/00508749.jpg"
                alt="Professionelles Bewerbungsfoto im Studio"
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
              Pakete & Preise
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Alle Pakete inkl. natürlicher Retusche, High-Res & Web-Export (JPG/PNG), 
              1:1 Coaching vor der Kamera und rechtssichere Nutzung für Eigenwerbung & berufliche Profile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Smart Start Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Start</h3>
                <p className="text-purple-600 font-medium">Bewerbung, Praktikum, Azubi</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">€95</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 Outfit</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 Hintergrund (hell/dunkel/grau)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 retuschiertes Bild</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Zusätzliche Aufnahmen zur Auswahl</span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">20–25 Min.</span>
                </div>
              </div>

              <Link
                to="/warteliste"
                className="block text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Professional Package */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8 transform scale-105 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-bl-lg rounded-tr-2xl">
                BELIEBT
              </div>
              
              <div className="mb-6 mt-4">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <p className="text-purple-100 font-medium">Wechsel in neue Position, LinkedIn</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">€195</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>2 Outfits</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>2 Hintergründe</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>3 retuschierte Bilder (versch. Crops: Square, 4:5, Banner)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Auswahl am Bildschirm</span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-purple-100 text-sm">40–45 Min.</span>
                </div>
              </div>

              <Link
                to="/warteliste"
                className="block text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Branding Set Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Branding Set</h3>
                <p className="text-purple-600 font-medium">Führungskräfte, Personal Branding</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">€295</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">3+ Outfits</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">2–3 Looks (Studio + „Office-Look")</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">6 retuschierte Bilder</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Header-Banner & CV-Set</span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">60–70 Min.</span>
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

          {/* Optional Services */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4">Express & Extras:</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>Express-Lieferung 24 h: <strong>€15/Bild</strong></span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>Express-Lieferung 6 h: <strong>€25/Bild</strong> (nach Verfügbarkeit)</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>Zusatzbild retuschiert: <strong>€30/Bild</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background & Style Options Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Hintergrund- & Stiloptionen</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <Palette className="h-5 w-5 text-purple-600 mr-2" />
                Hintergründe
              </h3>
              <p className="text-gray-700 text-sm">
                Hell, Dunkel, Mittelgrau, sanfte CI-Farbe; optional dezenter Office-Look (unscharfer Business-Hintergrund).
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <Camera className="h-5 w-5 text-purple-600 mr-2" />
                Licht
              </h3>
              <p className="text-gray-700 text-sm">
                Schönes, weiches Clamshell-Licht (gleichmäßig & schmeichelnd), bei Bedarf Akzentlicht für mehr Kontur.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                Crops & Formate
              </h3>
              <p className="text-gray-700 text-sm">
                LinkedIn-Square, CV-Hochformat, Website-Querformat, Banner-Header.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Retouching Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Retusche (natürlich & seriös)</h2>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Hautglättung dezent, Glanzreduktion, Augen-Boost, Zahnaufhellung leicht</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Kragen/Anzug/Bluse, Staub & Fussel, abstehende Haare</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Farb-/Kontrast-Feinschliff passend zum Hintergrund</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <img
              src="https://i.imgur.com/3gctBYO.jpg"
              alt="Bewerbungsfoto Shooting Ablauf"
              className="rounded-2xl shadow-lg w-full h-96 object-cover"
              loading="lazy"
            />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">So läuft's ab</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Ankommen & Styling-Check</h3>
              <p className="text-gray-600 text-sm">Brille reinigen, Kragen prüfen, Haare glätten</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Kurzes Posing-Coaching</h3>
              <p className="text-gray-600 text-sm">3–4 Grundposen, die immer funktionieren</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Serien mit Live-Ansicht</h3>
              <p className="text-gray-600 text-sm">Auswahl direkt am Bildschirm</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Feinauswahl & Retusche-Wünsche</h3>
              <p className="text-gray-600 text-sm">Sie bestimmen den Look</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">5</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Lieferung</h3>
              <p className="text-gray-600 text-sm">Preview noch am selben Tag, finale Retuschen 48–72 h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preparation Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Vorbereitung – kleine Checkliste</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Outfits</h3>
              <p className="text-gray-700 text-sm">
                Uni-Farben, feine Strukturen, nichts zu Glänzendes; 2–3 Optionen mitbringen.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Brille</h3>
              <p className="text-gray-700 text-sm">
                Entspiegelung reinigen; wir achten auf Reflexe.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Make-up/Haare</h3>
              <p className="text-gray-700 text-sm">
                Matt & natürlich. Kamm/Lippenpflege einpacken.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Branche</h3>
              <p className="text-gray-700 text-sm">
                Creative? Tech? Finance? – Wir matchen Hintergrund & Licht zu Ihrem Ziel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ – Bewerbungsfotos Wien</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wie schnell bekomme ich die Bilder?</h3>
              <p className="text-gray-600">
                Preview am selben Tag, finale Retuschen 48–72 h, Express 24 h/6 h möglich.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Bekomme ich alle Aufnahmen?</h3>
              <p className="text-gray-600">
                Sie erhalten die retuschierten Favoriten in High-Res & Web-Größe. Zusatzbilder sind jederzeit nachbestellbar.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Darf ich die Fotos beruflich nutzen?</h3>
              <p className="text-gray-600">
                Ja, für Eigenwerbung: Bewerbungen, LinkedIn/Xing, Website-Profil, Signatur, Speaker-Profile. 
                (Für Paid-Ads/Printkampagnen bitte kurz anfragen.)
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Gibt es Rabatte für Teams?</h3>
              <p className="text-gray-600">
                Ja – siehe unsere <Link to="/teamfotos-wien/" className="text-purple-600 hover:text-purple-700 underline">Team- & Mitarbeiterfotos</Link> mit On-Site-Ablauf.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Linking - Related Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Weitere Business-Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/business-portrait-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
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
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
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
              to="/familienfotos-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <Heart className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Familienfotografie</h3>
              <p className="text-gray-600 text-sm mb-4">
                Authentische Familienfotos im Studio mit bis zu 12 Personen
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
            Bereit für professionelle Bewerbungsfotos in Wien?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Termine sind oft schnell voll. Sichern Sie sich Ihren Slot – oder tragen Sie sich in die Warteliste ein.
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
              to="/business-portrait-wien/"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg"
            >
              Mehr Business-Optionen
            </Link>
          </div>
        </div>
      </section>

    </div>
    </Layout>
  );
}
