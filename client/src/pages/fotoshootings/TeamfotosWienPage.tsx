import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import GoogleReviews from '../../components/layout/GoogleReviews';
import { Link } from 'react-router-dom';
import { Camera, Heart, Users, Star, ArrowRight, Check, Clock, Briefcase, Building, Zap, Shield, TrendingUp, MapPin } from 'lucide-react';
import { useManualPageContent } from '../../hooks/useManualPageContent';
import MarkdownCopySlot from '../../components/MarkdownCopySlot';
import { newageCopyMap } from '../../content/newageCopyMap';
import { useLanguage } from '../../context/LanguageContext';

export default function TeamfotosWienPage() {
  const t = useManualPageContent('teamfotos');
  const { language } = useLanguage();

  // Language-aware fallbacks
  const fallbacks = {
    en: {
      heroTitle: 'Team & Employee Photos in Vienna',
      heroSubtitle: 'Strong. Consistent. Brand-aligned.',
      heroDescription: 'We photograph team photos in Vienna directly at your company – with mobile studio, fast workflow and a look that matches your brand. Ideal for website, LinkedIn, press & recruiting.',
      primaryCta: 'Book a Spot on the Waitlist',
      secondaryCta: 'Contact Us Directly',
    },
    de: {
      heroTitle: 'Team- & Mitarbeiterfotos in Wien',
      heroSubtitle: 'Stark. Einheitlich. Markengetreu.',
      heroDescription: 'Wir fotografieren Teamfotos in Wien direkt bei Ihnen im Unternehmen – mit mobilem Studio, schnellem Ablauf und einem Look, der zu Ihrer Brand passt. Ideal für Website, LinkedIn, Presse & Recruiting.',
      primaryCta: 'Termin auf der Warteliste sichern',
      secondaryCta: 'Direkt anfragen',
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

  const heroTitle = fromManual('manual.teamfotos.heroTitle', fb.heroTitle);
  const heroSubtitle = fromManual('manual.teamfotos.heroTagline', fb.heroSubtitle);
  const heroDescription = fromManual('manual.teamfotos.heroDescription', fb.heroDescription);
  const primaryCta = fromManual('manual.teamfotos.primaryCta', fb.primaryCta);
  const secondaryCta = fromManual('manual.teamfotos.secondaryCta', fb.secondaryCta);
  const heroImage1 = fromManual('manual.teamfotos.heroImage1', '');
  const heroImage2 = fromManual('manual.teamfotos.heroImage2', '');
  const heroImage3 = fromManual('manual.teamfotos.heroImage3', '');
  const heroImage4 = fromManual('manual.teamfotos.heroImage4', '');
  const heroImage5 = fromManual('manual.teamfotos.heroImage5', '');

  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title={newageCopyMap['teamfotos-wien'].title}
        description={newageCopyMap['teamfotos-wien'].metaDescription}
        keywords="teamfotos wien, mitarbeiterfotos wien, team fotografie wien, corporate team shooting wien"
        canonical="/teamfotos-wien/"
        ogImage="https://www.newagefotografie.com/images/team-hero.jpg"
        hreflang={[
          { lang: 'de', url: '/teamfotos-wien/' },
          { lang: 'en', url: '/en/team-photos-vienna/' }
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
                  to="/kontakt"
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
                  alt="Team- und Mitarbeiterfotos Wien"
                  className="rounded-2xl shadow-2xl w-full h-auto object-contain"
                  loading="eager"
                />
              </div>
              <div>
                <img
                  src={heroImage2}
                  alt="Mitarbeiterfotos On-Site Wien"
                  className="rounded-xl shadow-lg w-full h-auto object-contain"
                  loading="eager"
                />
              </div>
              <div>
                <img
                  src={heroImage3}
                  alt="Corporate Team Fotografie Wien"
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
                Willkommen bei New Age Fotografie – Ihrem Partner für professionelle Teamfotos in Wien! 
                Wir kommen mit mobilem Studio direkt zu Ihnen ins Unternehmen und erstellen einheitliche, 
                markenkonforme Mitarbeiterportraits. Durchschnittlich 7–8 Minuten pro Person, inklusive Gruppenfoto 
                und voller kommerzieller Nutzungsrechte.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mt-4">
                Schneller Ablauf, professionelles Setup, konsistente Ergebnisse – perfekt für Ihre Website, 
                LinkedIn-Profile, Pressematerialien und Recruiting-Kampagnen.
              </p>
            </div>
            <div>
              <img
                src={heroImage4}
                alt="Teamfotografie im Unternehmen"
                className="rounded-2xl shadow-lg w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Extended Content Section - Safe Copy Slot */}
      <MarkdownCopySlot content={newageCopyMap['teamfotos-wien'].markdown} />

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pakete & Preise (On-Site)
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Alle Pakete inkl. Setup, Licht, Hintergrund, Tether-Preview, kommerzielle Nutzungsrechte, 
              High-Res & Web-Export, natürliche Retusche.
            </p>
            <div className="bg-purple-100 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-800 font-semibold">
                <strong>On-Site Setup:</strong> €150 pauschal (Raum, Aufbau, Lichtmessung, Testshots)
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Starter Team Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter Team</h3>
                <p className="text-purple-600 font-medium">Für 5–9 Personen</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">€95</span>
                  <span className="text-gray-600 ml-2">p. P.</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 Look / neutraler Hintergrund</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 retuschiertes Portrait p. P.</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 Gruppenfoto</span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">ca. 8–10 Min. p. P.</span>
                </div>
              </div>

              <Link
                to="/warteliste"
                className="block text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Jetzt anfragen
              </Link>
            </div>

            {/* Scale Team Package */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8 transform scale-105 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-bl-lg rounded-tr-2xl">
                BELIEBT
              </div>
              
              <div className="mb-6 mt-4">
                <h3 className="text-2xl font-bold mb-2">Scale Team</h3>
                <p className="text-purple-100 font-medium">Für 10–30 Personen</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">€95</span>
                  <span className="text-purple-100 ml-2">p. P.</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>1–2 Looks (z. B. Hell & Dunkel)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>2 retuschierte Portraits p. P.</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Gruppenfoto(s)</span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-purple-100 text-sm">7–8 Min. p. P.</span>
                </div>
              </div>

              <Link
                to="/warteliste"
                className="block text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Jetzt anfragen
              </Link>
            </div>

            {/* Plus Branding Package */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plus Branding</h3>
                <p className="text-purple-600 font-medium">Abteilungen / größere Crews</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-purple-600">Auf Anfrage</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">CI-Farbe, Logo-Wall</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Reportage-Extras (Lobby/Meeting)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">2 Portraits p. P. + Team-Varianten</span>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">Individuelle Zeitplanung</span>
                </div>
              </div>

              <Link
                to="/kontakt"
                className="block text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Anfrage senden
              </Link>
            </div>
          </div>

          {/* Optional Services */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4">Optional:</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>Zusätzl. retuschiertes Bild <strong>€30 p. P.</strong></span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-purple-600 mr-2" />
                <span>Express-Retusche 24–48 h <strong>€15 p. P.</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* On-Site Lighting Plan Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">On-Site Lighting Plan (bewährt & schnell)</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <Zap className="h-5 w-5 text-purple-600 mr-2" />
                Key Light
              </h3>
              <p className="text-gray-700 text-sm">
                120 cm Parabol/Octa, soft & clean (Clamshell/Beauty).
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <Camera className="h-5 w-5 text-purple-600 mr-2" />
                Fill/Negative Fill
              </h3>
              <p className="text-gray-700 text-sm">
                Je nach Gesichtsform; gleichmäßige Serie garantiert.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <Star className="h-5 w-5 text-purple-600 mr-2" />
                Hair/Edge Light
              </h3>
              <p className="text-gray-700 text-sm">
                Dezentes Kantenlicht für Separation.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <Building className="h-5 w-5 text-purple-600 mr-2" />
                Hintergründe
              </h3>
              <p className="text-gray-700 text-sm">
                Hell, Dunkel, Mittelgrau oder CI-Farbe; alternativ Corporate-Location (Glas, Holz, Flur).
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <Shield className="h-5 w-5 text-purple-600 mr-2" />
                Tethered Capture
              </h3>
              <p className="text-gray-700 text-sm">
                Sofort-Ansicht am Laptop; schnelle Auswahl direkt vor Ort.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                Platzbedarf
              </h3>
              <p className="text-gray-700 text-sm">
                Ca. 3 × 5 m, Deckenhöhe 2,6 m+; Strom 230 V.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process & Timing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <img
              src={heroImage5}
              alt="Team Fotoshooting Wien On-Site"
              className="rounded-2xl shadow-lg w-full h-auto object-contain"
              loading="lazy"
            />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Zeit pro Person & Ablauf</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Realistisch planbar: <strong>Ø 7–8 Minuten pro Person</strong><br />
            <span className="text-sm">(2–3 Min. Micro-Coaching, 3–4 Min. Serien, 1 Min. Check)</span>
          </p>

          <div className="max-w-3xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Standard-Ablauf</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 flex items-start">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ankunft & Aufbau</h4>
                  <p className="text-gray-600 text-sm">30–40 Min.</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 flex items-start">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Test & Style-Abstimmung</h4>
                  <p className="text-gray-600 text-sm">5–10 Min.</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 flex items-start">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Portrait-Slot je Person</h4>
                  <p className="text-gray-600 text-sm">7–8 Min.</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 flex items-start">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-purple-600 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Gruppenfoto(s)</h4>
                  <p className="text-gray-600 text-sm">10–15 Min.</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 flex items-start">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-purple-600 font-bold">5</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Abbau</h4>
                  <p className="text-gray-600 text-sm">30 Min.</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 flex items-start">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-purple-600 font-bold">6</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Auswahl & Retusche</h4>
                  <p className="text-gray-600 text-sm">Nach Online-Galerie</p>
                </div>
              </div>
            </div>
          </div>

          {/* Example Day Schedule */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Beispiel-Tagesplan (20 Personen)</h3>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Uhrzeit</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Programmpunkt</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Notizen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">08:15</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Ankunft & Aufbau</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Raum freihalten, Strom check</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">09:00</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Testshots / Style-Feinschliff</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Helligkeit / Hintergrund</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">09:10–10:50</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Slots 1–12</td>
                    <td className="px-6 py-4 text-sm text-gray-600">8 Min. je Person, 10-Min-Buffer</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">10:50–11:05</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Pause</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Make-Up/Outfit-Check</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">11:05–12:15</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Slots 13–20</td>
                    <td className="px-6 py-4 text-sm text-gray-600">8 Min. je Person</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">12:15–12:35</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Gruppenfotos</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Abteilung + Gesamt</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">12:35–13:05</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Abbau</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Übergabe Nächste Schritte</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Preparation Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Vorbereitung für Ihr Team</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Outfit-Guides</h3>
              <p className="text-gray-700 text-sm">
                Uni-Farben, feine Strukturen, keine großen Logos.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Brillencheck</h3>
              <p className="text-gray-700 text-sm">
                Entspiegeln/reinigen; Glanz reduzieren.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Haare/Make-Up</h3>
              <p className="text-gray-700 text-sm">
                Dezent, matt; Kamm/Lippenpflege bereithalten.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Briefing</h3>
              <p className="text-gray-700 text-sm">
                1–2 Tage vorher mit Slots (Kalender-Invite); Kontaktperson vor Ort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ – Teamfotos Wien</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wie schnell liefern wir?</h3>
              <p className="text-gray-600">
                Preview-Galerie 48–72 h, finale Retuschen 3–5 Werktage (Express möglich).
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Erhalten wir einheitliche Ergebnisse über Standorte?</h3>
              <p className="text-gray-600">
                Ja – wir dokumentieren Licht-/Kamera-Settings für wiederkehrende Sessions.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Können Hintergründe markenkonform sein?</h3>
              <p className="text-gray-600">
                Klar – CI-Farbkarton oder Location-Look (Lobby, Glasfront, Holz).
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Gibt es Mitarbeiter-Onboarding später?</h3>
              <p className="text-gray-600">
                Ja – Nachbuchungen im selben Stil jederzeit möglich (Mindestmenge 3 P.).
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
              to="/business-portrait-wien/"
              className="block bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
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
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für professionelle Teamfotos in Wien?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Termine knapp? Setzen Sie sich auf unsere Warteliste – wir melden freie Slots sofort.
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
              to="/kontakt"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg"
            >
              Direkt anfragen mit Wunschdatum
            </Link>
          </div>
        </div>
      </section>

    </div>
    </Layout>
  );
}
