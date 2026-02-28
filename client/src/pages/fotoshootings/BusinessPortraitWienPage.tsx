import { SEOHead } from '../../components/SEO/SEOHead';
import { ServiceSchema } from '../../components/SEO/ServiceSchema';
import { RelatedServices } from '../../components/SEO/RelatedServices';
import Layout from '../../components/layout/Layout';
import GoogleReviews from '../../components/layout/GoogleReviews';
import MarkdownCopySlot from '../../components/MarkdownCopySlot';
import { newageCopyMap } from '../../content/newageCopyMap';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Heart, Users, Star, ArrowRight, Check, Clock, Briefcase, Linkedin, TrendingUp, Palette, Shield } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useManualPageContent } from '../../hooks/useManualPageContent';
import { useLanguage } from '../../context/LanguageContext';

export default function BusinessPortraitWienPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const t = useManualPageContent('businessportraits');
  const { language } = useLanguage();

  // Language-aware fallbacks
  const fallbacks = {
    en: {
      heroTitle: 'Business Portraits & Corporate Photography in Vienna',
      heroSubtitle: 'Strong Image. Clear Message.',
      heroDescription: 'Your business portraits are created at New Age Fotografie in our Vienna studio – perfect for LinkedIn, CEO portraits and personal branding. We guide you relaxed through the shoot, coach expression & posture, and deliver fully retouched files in high-res – commercial usage rights included.',
      primaryCta: 'Book a Spot on the Waitlist',
      secondaryCta: 'Give a Business Voucher',
    },
    de: {
      heroTitle: 'Business-Portraits & Corporate-Fotografie in Wien',
      heroSubtitle: 'Starkes Bild. Klare Botschaft.',
      heroDescription: 'Ihre Business-Portraits entstehen bei New Age Fotografie im Studio in Wien – perfekt für LinkedIn, CEO-Porträts und Personal-Branding. Wir führen Sie entspannt durchs Shooting, coachen Ausdruck & Haltung und liefern vollständig retuschierte Dateien in High-Res – kommerzielle Nutzungsrechte inklusive.',
      primaryCta: 'Termin auf der Warteliste sichern',
      secondaryCta: 'Business-Gutschein verschenken',
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

  const heroTitle = fromManual('manual.businessportraits.heroTitle', fb.heroTitle);
  const heroSubtitle = fromManual('manual.businessportraits.heroTagline', fb.heroSubtitle);
  const heroDescription = fromManual('manual.businessportraits.heroDescription', fb.heroDescription);
  const primaryCta = fromManual('manual.businessportraits.primaryCta', fb.primaryCta);
  const secondaryCta = fromManual('manual.businessportraits.secondaryCta', fb.secondaryCta);
  const heroImage1 = fromManual('manual.businessportraits.heroImage1', '');
  const heroImage2 = fromManual('manual.businessportraits.heroImage2', '');
  const heroImage3 = fromManual('manual.businessportraits.heroImage3', '');
  const heroImage4 = fromManual('manual.businessportraits.heroImage4', '');
  const heroImage5 = fromManual('manual.businessportraits.heroImage5', '');

  const handleBookPackage = (packageName: string, price: number, description: string) => {
    addItem({
      title: packageName,
      price: price,
      quantity: 1,
      packageType: 'Business Portrait',
      type: 'voucher'
    });
    navigate('/cart');
  };

  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title={newageCopyMap['business-portrait-wien'].title}
        description={newageCopyMap['business-portrait-wien'].metaDescription}
        keywords="business portrait wien, corporate fotografie wien, linkedin foto wien, ceo portrait wien"
        canonical="/business-portrait-wien/"
        ogImage="https://www.newagefotografie.com/images/business-hero.jpg"
        hreflang={[
          { lang: 'de', url: '/business-portrait-wien/' },
          { lang: 'en', url: '/en/business-portrait-vienna/' }
        ]}
      />
      <ServiceSchema
        serviceName={newageCopyMap['business-portrait-wien'].h1}
        description={newageCopyMap['business-portrait-wien'].metaDescription}
        url="/business-portrait-wien/"
        serviceType="PhotographyService"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-xl text-gray-300 mb-4 leading-relaxed font-semibold">
                {heroSubtitle}
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
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
                  to="/gutschein/business"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg"
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
                  alt="Professionelles Business Portrait Wien - Headshot im modernen Fotostudio"
                  className="rounded-2xl shadow-2xl w-full h-auto object-contain"
                  loading="eager"
                />
              </div>
              <div>
                <img
                  src={heroImage2}
                  alt="LinkedIn Profilbild Wien - Professionelles Bewerbungsfoto für Social Media"
                  className="rounded-xl shadow-lg w-full h-auto object-contain"
                  loading="eager"
                />
              </div>
              <div>
                <img
                  src={heroImage3}
                  alt="CEO Business Portrait Wien - Executive Headshots für Führungskräfte"
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
                Willkommen bei New Age Fotografie – Ihrem Partner für professionelle Business-Portraits in Wien! 
                Unser Studio bietet die perfekte Umgebung für LinkedIn-Headshots, CEO-Porträts und Personal-Branding-Fotografie. 
                Mit präzisem Licht, variablen Hintergründen und professionellem Ausdrucks-Coaching entstehen Portraits, 
                die auf LinkedIn performen und im Geschäftsbericht bestehen.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mt-4">
                Sie kommen mit Outfits – wir liefern starke, markenkonforme Portraits in High-Res, vollständig retuschiert 
                und mit kommerziellen Nutzungsrechten für Web, Social Media, Presse und Print.
              </p>
            </div>
            <div>
              <img
                src={heroImage4}
                alt="Business Fotoshooting Wien - Natürliche Corporate Portraits im Studio"
                className="rounded-2xl shadow-lg w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Extended Content Section - Safe Copy Slot */}
      <MarkdownCopySlot content={newageCopyMap['business-portrait-wien'].markdown} />

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pakete & Preise (Studio)
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Preise richten sich nach Anzahl der Looks/Outfits und der gewünschten Bildmenge. 
              Jede Option inkl. High-Res + Web-Größen, Retusche & kommerzieller Lizenz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Business Portrait Basic Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Portrait Basic</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-sm text-gray-500 mr-1">Ab</span>
                  <span className="text-4xl font-bold text-purple-600">€69</span>
                </div>
              </div>

              <div className="space-y-4 mb-4">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Business-Headshot, 30 Minuten</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 retuschiertes Foto</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Suitable for LinkedIn</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-6">Gültig bis 2 Jahre</p>

              <button
                onClick={() => handleBookPackage('Business Portrait Basic', 69, 'Business-Headshot - 30 Min, 1 retuschiertes Foto')}
                className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Jetzt Buchen
              </button>
            </div>

            {/* Express Headshot Package - BELIEBT */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8 transform scale-105 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-bl-lg rounded-tr-2xl">
                BELIEBT
              </div>
              
              <div className="mb-6 mt-4">
                <h3 className="text-2xl font-bold mb-2">Express Headshot</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-sm mr-1">Ab</span>
                  <span className="text-4xl font-bold">€95</span>
                </div>
              </div>

              <div className="space-y-4 mb-4">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Schnell & effizient</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>x2 Bilder nach Wahl als Datei</span>
                </div>
              </div>

              <p className="text-purple-200 text-sm mb-6">Gültig bis 2 Jahre</p>

              <button
                onClick={() => handleBookPackage('Express Headshot', 95, 'Express Headshot - Schnell & effizient, x2 Bilder als Datei')}
                className="block w-full text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Jetzt Buchen
              </button>
            </div>

            {/* Solo Pro Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Solo Pro</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-sm text-gray-500 mr-1">Ab</span>
                  <span className="text-4xl font-bold text-purple-600">€195</span>
                </div>
              </div>

              <div className="space-y-4 mb-4">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Für Professionals</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Alle Bilder als Datei inkl.</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-6">Gültig bis 2 Jahre</p>

              <button
                onClick={() => handleBookPackage('Solo Pro', 195, 'Solo Pro - Für Professionals, alle Bilder als Datei')}
                className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Jetzt Buchen
              </button>
            </div>
          </div>

          {/* Team Photos Note */}
          <div className="bg-white rounded-xl p-6 mb-8 border-2 border-purple-100">
            <div className="flex items-start">
              <Users className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Team- & Mitarbeiterfotos:</p>
                <p className="text-gray-600">
                  Ab €299. Paketpreise by headcount. In-Studio or OnSite options, ab 50€ pro Kopf mit alle Portraits als Datei dazu.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons after packages */}
          <div className="mt-12 text-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Keine Zeit?</h3>
            <p className="text-gray-700 mb-6">
              Setzen Sie sich auf unsere Warteliste – wir melden freie Slots sofort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/warteliste"
                className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Termin auf der Warteliste sichern
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Style Options Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Style-Optionen (Sie wählen – wir führen)</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <Palette className="h-5 w-5 text-purple-600 mr-2" />
                Hintergründe
              </h3>
              <p className="text-gray-700 text-sm">
                Hell (clean), Dunkel (dramatisch), Farbverlauf, Firmenfarbe.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <Camera className="h-5 w-5 text-purple-600 mr-2" />
                Licht-Setups
              </h3>
              <p className="text-gray-700 text-sm">
                Beauty/Clamshell (glatt & modern), Rembrandt (prägnant), Edge/Profil (kantig).
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                Bildsprache
              </h3>
              <p className="text-gray-700 text-sm">
                Headshot, Halbportrait, Querformate für Website-Header.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <Briefcase className="h-5 w-5 text-purple-600 mr-2" />
                Look & Feel
              </h3>
              <p className="text-gray-700 text-sm">
                Business-formal, Smart-Casual, Kreativ – gern mit Accessoires (Laptop, Notizbuch).
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <Star className="h-5 w-5 text-purple-600 mr-2" />
                Farbwelt
              </h3>
              <p className="text-gray-700 text-sm">
                Farblook oder Schwarzweiß-Serie passend zur Marke.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <Shield className="h-5 w-5 text-purple-600 mr-2" />
                Kommerzielle Rechte
              </h3>
              <p className="text-gray-700 text-sm">
                Volle Nutzungsrechte für Web, Social, PR & Print inklusive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <img
              src={heroImage5}
              alt="Business Portrait Shooting Ablauf Wien - Professionelle Mitarbeiterfotos in 30 Minuten"
              className="rounded-2xl shadow-lg w-full h-auto object-contain"
              loading="lazy"
            />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Ablauf – schnell & professionell</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Briefing</h3>
              <p className="text-gray-600 text-sm">Ziel, Verwendungsorte, Dresscode, Stil</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Shooting</h3>
              <p className="text-gray-600 text-sm">Mit Ausdrucks-Coaching, Wechsel von Licht & Hintergründen je Look</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Auswahl</h3>
              <p className="text-gray-600 text-sm">Auswahlgalerie online – Favoriten markieren</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Retusche</h3>
              <p className="text-gray-600 text-sm">Natürliche Haut, Staub/Fussel, Brille/Glanz, Kontur</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">5</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Lieferung</h3>
              <p className="text-gray-600 text-sm">High-Res + Web inkl. kommerzielle Lizenz</p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Bring Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Vorbereitung – was mitbringen?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Outfits</h3>
              <p className="text-gray-700 text-sm">
                2–3 Outfits (Blazer/Jackett, Hemd/Bluse, optional Casual).
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Details</h3>
              <p className="text-gray-700 text-sm">
                Saubere Brille, gebügelte Stoffe, dezentes Make-up.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Finishing</h3>
              <p className="text-gray-700 text-sm">
                Haare: Bürste/Stylingprodukt, Lippenpflege; Rasur am Shooting-Tag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Bekomme ich alle Dateien in druckfähiger Qualität?</h3>
              <p className="text-gray-600">
                Ja. Sie erhalten High-Res (Print) und Web-Größen – beide vollständig retuschiert.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Sind kommerzielle Rechte inkludiert?</h3>
              <p className="text-gray-600">
                Ja. Nutzung für Website, Social Media, Presse & Print ist im Paket enthalten.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wie schnell sind die Bilder da?</h3>
              <p className="text-gray-600">
                Preview i. d. R. 48–72 h, finale Retuschen 3–5 Werktage (Express möglich).
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Können wir mehrere Looks/CI-Farben testen?</h3>
              <p className="text-gray-600">
                Gern – wählen Sie im Paket 2–3 Looks. Wir matchen Hintergründe & Licht an Ihre Marke.
              </p>
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
              to="/familienfotos-wien/"
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
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
              to="/neugeborenenfotos-wien/"
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <Camera className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Neugeborenenfotos</h3>
              <p className="text-gray-600 text-sm mb-4">
                Warmes Studio, sichere Posen, Tag 5-14 nach der Geburt
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Weitere Fotografie-Services
            </h2>
            <p className="text-lg text-gray-600">
              Entdecken Sie unsere anderen professionellen Fotografie-Angebote in Wien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Event Photography */}
            <Link
              to="/eventfotografie-wien/"
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow group"
            >
              <Camera className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                Eventfotografie
              </h3>
              <p className="text-gray-600 mb-4">
                Professionelle Dokumentation von Firmenevents, Konferenzen und Galas in Wien.
              </p>
              <span className="text-purple-600 font-semibold inline-flex items-center">
                Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>

            {/* Product Photography */}
            <Link
              to="/produkt-fotografie-wien/"
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow group"
            >
              <Briefcase className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                Produktfotografie
              </h3>
              <p className="text-gray-600 mb-4">
                Hochwertige Produktfotos für E-Commerce, Amazon und Marketing-Kampagnen.
              </p>
              <span className="text-purple-600 font-semibold inline-flex items-center">
                Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>

            {/* Family Photography */}
            <Link
              to="/familien-fotoshooting-wien/"
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow group"
            >
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                Familienfotografie
              </h3>
              <p className="text-gray-600 mb-4">
                Natürliche Familienporträts im Studio oder Outdoor – unvergessliche Erinnerungen schaffen.
              </p>
              <span className="text-purple-600 font-semibold inline-flex items-center">
                Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Services - Internal Links */}
      <RelatedServices currentPath="/business-portrait-wien/" />

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für professionelle Business-Portraits?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sichern Sie sich jetzt Ihren Termin – Warteliste verfügbar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/warteliste"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
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
