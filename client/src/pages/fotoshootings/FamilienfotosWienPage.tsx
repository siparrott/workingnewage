import { SEOHead } from '../../components/SEO/SEOHead';
import { ServiceSchema } from '../../components/SEO/ServiceSchema';
import { RelatedServices } from '../../components/SEO/RelatedServices';
import Layout from '../../components/layout/Layout';
import GoogleReviews from '../../components/layout/GoogleReviews';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Heart, Users, Star, ArrowRight, Check, Clock, Baby, Music, Smile } from 'lucide-react';
import { useManualPageContent } from '../../hooks/useManualPageContent';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export default function FamilienfotosWienPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const t = useManualPageContent('familienfotos');
  const { language } = useLanguage();

  // Language-aware fallbacks
  const fallbacks = {
    en: {
      heroTitle: 'Family Photography in Vienna',
      heroSubtitle: 'Family Photos – Studio Packages (up to 12 people)',
      heroDescription: 'Our promise: Quiet studio, friendly guidance, real moments. Max. 12 people per session – children, grandparents & pets are warmly welcome. Outfit changes? Absolutely. Feel free to bring toys & hobby props (ball, violin, favorite book...).',
      primaryCta: 'Book a Spot on the Waitlist',
      secondaryCta: 'Give a Family Voucher',
    },
    de: {
      heroTitle: 'Familienfotografie in Wien',
      heroSubtitle: 'Familienfotos – Studio-Pakete (bis 12 Personen)',
      heroDescription: 'Kurzversprechen: Ruhiges Studio, freundliche Anleitung, echte Momente. Max. 12 Personen pro Termin – Kinder, Großeltern & Haustiere sind herzlich willkommen. Outfitwechsel? Sehr gern. Bringt gern Spielzeug & Hobby-Requisiten (Ball, Geige, Lieblingsbuch …) mit.',
      primaryCta: 'Termin auf der Warteliste sichern',
      secondaryCta: 'Familien-Gutschein verschenken',
    }
  };

  const fb = fallbacks[language] || fallbacks.de;

  const fromManual = (key: string, fallback: string) => {
    const value = t(key);
    if (!value || value === key) {
      return fallback;
    }
    return value;
  };

  const heroTitle = fromManual('manual.familienfotos.heroTitle', fb.heroTitle);
  const heroSubtitle = fromManual('manual.familienfotos.heroTagline', fb.heroSubtitle);
  const heroDescription = fromManual(
    'manual.familienfotos.heroDescription',
    fb.heroDescription
  );
  const primaryCta = fromManual('manual.familienfotos.primaryCta', fb.primaryCta);
  const secondaryCta = fromManual('manual.familienfotos.secondaryCta', fb.secondaryCta);
  const heroImage1 = fromManual('manual.familienfotos.heroImage1', '');
  const heroImage2 = fromManual('manual.familienfotos.heroImage2', '');
  const heroImage3 = fromManual('manual.familienfotos.heroImage3', '');
  const heroImage4 = fromManual('manual.familienfotos.heroImage4', '');
  const heroImage5 = fromManual('manual.familienfotos.heroImage5', '');
  const heroDescriptionContent = (() => {
    if (!heroDescription) return null;
    const [firstSegment, ...rest] = heroDescription.split(':');
    if (rest.length === 0) return heroDescription;
    return (
      <>
        <strong>{firstSegment}:</strong>
        {rest.join(':')}
      </>
    );
  })();

  const handleBookPackage = (packageName: string, price: number, description: string) => {
    addItem({
      title: packageName,
      price: price,
      quantity: 1,
      packageType: 'Familienfotografie',
      type: 'voucher'
    });
    navigate('/cart');
  };

  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Familienfotografie in Wien – Studio & Outdoor | New Age Fotografie"
        description="Ruhiges Studio, freundliche Anleitung, echte Momente. Max. 12 Personen pro Termin – Kinder, Großeltern & Haustiere herzlich willkommen."
        keywords="familienfotograf wien, familienfotos wien, familienfotografie wien, fotoshooting familie wien"
        canonical="/familienfotos-wien/"
        ogImage="https://www.newagefotografie.com/images/family-hero.jpg"
        hreflang={[
          { lang: 'de', url: '/familienfotos-wien/' },
          { lang: 'en', url: '/en/family-photos-vienna/' }
        ]}
      />
      <ServiceSchema
        serviceName="Familienfotografie in Wien"
        description="Ruhiges Studio, freundliche Anleitung, echte Momente. Max. 12 Personen pro Termin."
        url="/familienfotos-wien/"
        serviceType="PhotographyService"
      />

      {/* Hero Section - with space for 2-3 images */}
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
                {heroDescriptionContent}
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
                  to="/gutschein/family"
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
                  alt="Familienfotografie in Wien - Glückliche Großfamilie beim professionellen Fotoshooting im Studio"
                  title="Professionelle Familienfotografie Wien - Studio Shooting mit bis zu 12 Personen"
                  className="rounded-2xl shadow-2xl w-full h-auto object-contain"
                  loading="eager"
                />
              </div>
              <div>
                <img
                  src={heroImage2}
                  alt="Familienportrait Wien - Natürliche Familienfotos im modernen Studio"
                  title="Familienfotos Wien - Authentische Momente und echte Emotionen"
                  className="rounded-xl shadow-lg w-full h-auto object-contain"
                  loading="eager"
                />
              </div>
              <div>
                <img
                  src={heroImage3}
                  alt="Familie Fotoshooting Wien - Professionelle Familienportraits mit Kindern und Eltern"
                  title="Familienfotograf Wien - Erinnerungen für die Ewigkeit festhalten"
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

      {/* Introduction Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                Willkommen bei New Age Fotografie – Ihrem Familienfotografen in Wien! Unser ruhiges Studio bietet den perfekten 
                Rahmen für authentische Familienfotos. Ob kleine Familie oder Großfamilie mit bis zu 12 Personen – wir nehmen uns 
                Zeit für echte Momente und natürliche Emotionen.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mt-4">
                Bringt gerne eure Persönlichkeit mit: Lieblingsspielzeug der Kinder, Musikinstrumente, Sportgeräte oder das 
                Familienmaskottchen. Diese persönlichen Details machen eure Fotos einzigartig und erzählen eure Geschichte.
              </p>
            </div>
            <div>
              <img
                src={heroImage4}
                alt="Familienfotos Wien - Großfamilie professionell fotografiert mit persönlichen Details"
                title="Familienfotografie Wien - Bis zu 12 Personen mit Haustieren und Requisiten"
                className="rounded-2xl shadow-lg w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section - Familienfotos Studio-Pakete */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unsere Pakete
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Bis 12 Personen pro Termin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Family Basic Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Family Basic</h3>
                <p className="text-purple-600 font-medium">Ideal für: Kleine Familien, ein Hauptmotiv</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">€95</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">60 Min Shooting</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 retuschiertes Portrait digital + Leinwand 40×30 cm</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Auswahlgalerie online</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Nutzungsrechte privat</span>
                </div>
              </div>

              <button
                onClick={() => handleBookPackage('Family Basic', 95, 'Familienfotografie - 60 Min Shooting')}
                className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Jetzt buchen
              </button>
            </div>

            {/* Family Premium Package - BESTSELLER */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8 transform scale-105 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-bl-lg rounded-tr-2xl">
                BESTSELLER
              </div>
              
              <div className="mb-6 mt-4">
                <h3 className="text-2xl font-bold mb-2">Family Premium</h3>
                <p className="text-purple-100 font-medium">Ideal für: Größere Familien, mehrere Kombis</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">€195</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>90 Min Shooting</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>5 retuschierte Fotos digital (Motive frei wählbar)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Leinwand 40×30 cm (Motiv nach Wahl)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Auswahlgalerie & Nutzungsrechte privat</span>
                </div>
              </div>

              <button
                onClick={() => handleBookPackage('Family Premium', 195, 'Familienfotografie - 90 Min Shooting')}
                className="block w-full text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Jetzt buchen
              </button>
            </div>

            {/* Family Deluxe Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Family Deluxe</h3>
                <p className="text-purple-600 font-medium">Ideal für: Komplettes Familienerlebnis</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">€295</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">90–120 Min Shooting</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">10 retuschierte Fotos digital</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Leinwand 60×40 cm (Motiv nach Wahl)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Auswahlgalerie & Nutzungsrechte privat</span>
                </div>
              </div>

              <button
                onClick={() => handleBookPackage('Family Deluxe', 295, 'Familienfotografie - 90-120 Min Shooting')}
                className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Jetzt buchen
              </button>
            </div>
          </div>

          {/* Immer inklusive Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Immer inklusive:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Users className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Bis 12 Personen pro Termin</p>
                  <p className="text-gray-600 text-sm">Kinder & Pets zählen mit – wir planen die Kombinationen</p>
                </div>
              </div>
              <div className="flex items-start">
                <Smile className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Outfitwechsel erwünscht</p>
                  <p className="text-gray-600 text-sm">Wir empfehlen 2 Looks pro Person.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Music className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Requisiten/Hobby-Items willkommen</p>
                  <p className="text-gray-600 text-sm">Musikinstrumente, Sport, Kuscheltier – bringt euer Leben mit!</p>
                </div>
              </div>
              <div className="flex items-start">
                <Camera className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Ruhige Auswahlgalerie online</p>
                  <p className="text-gray-600 text-sm">Retusche nach eurer Auswahl – kein Zeitdruck</p>
                </div>
              </div>
            </div>
          </div>

          {/* Optionen */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4">Optionen (auf Wunsch):</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>Zusatzdatei retuschiert <strong>€15</strong></span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>Express-Bearbeitung 72 h: <strong>€60</strong></span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>Fine-Art-Album ab <strong>€195</strong></span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>Duplikat-Leinwand 40×30 <strong>€59</strong> / 60×40 <strong>€89</strong></span>
              </div>
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
                to="/gutschein/family"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
              >
                Familien-Gutschein verschenken
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shooting-Ablauf Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <img
              src={heroImage5}
              alt="Familienfotografie Wien Ablauf - Professionelles Studio-Shooting für diverse Familien"
              title="Familienfotograf Wien - Shooting-Ablauf im modernen Fotostudio"
              className="rounded-xl shadow-lg w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Shooting-Ablauf (Studio)</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Kurzbriefing</h3>
              <p className="text-gray-600 text-sm">Familiengröße, Looks, besondere Wünsche</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Ankommen & Outfitcheck</h3>
              <p className="text-gray-600 text-sm">Wir stimmen Farben ab</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Shooting mit Anleitung</h3>
              <p className="text-gray-600 text-sm">Gesamt, Teilgruppen, Geschwister, Eltern-Kind, Einzelportraits</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Requisiten & Hobbys</h3>
              <p className="text-gray-600 text-sm">1–2 Motive mit Items einplanen</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">5</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Auswahlgalerie</h3>
              <p className="text-gray-600 text-sm">Favoriten markieren → Retusche → Download & Leinwand</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mini-FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Mini-FAQ</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wie viele Outfitwechsel schaffen wir?</h3>
              <p className="text-gray-600">In 90 Min. meist 2 Looks pro Person; Basic: 1–2 Looks je nach Gruppengröße.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Dürfen Haustiere mit?</h3>
              <p className="text-gray-600">Ja – kurze Info vorab, damit wir eine „Pet-Pause" einplanen.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wie schnell bekommen wir die Bilder?</h3>
              <p className="text-gray-600">Auswahl in 3–5 Tagen, finale Retusche in 10–14 Tagen (Express möglich).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Linking - Related Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Weitere Fotografie-Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/baby-fotografie-wien/"
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <Baby className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Baby & Newborn Fotografie</h3>
              <p className="text-gray-600 text-sm mb-4">
                Zarte Neugeborenenfotos mit Herz und Sicherheit
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
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
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

      {/* Related Services - Internal Links */}
      <RelatedServices currentPath="/familienfotos-wien/" />

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für unvergessliche Familienfotos?
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
