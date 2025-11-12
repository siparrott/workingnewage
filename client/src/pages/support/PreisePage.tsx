import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Baby, Heart, Users, Briefcase, User, Check, Gift, Info } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { SEOHead } from '../../components/SEO/SEOHead';

const PreisePage: React.FC = () => {
  return (
    <Layout>
      <SEOHead
        title="Preise – Fotoshooting Pakete in Wien | New Age Fotografie"
        description="Transparente Preise für Fotoshootings in Wien. Alle bearbeiteten Bilder inklusive. Faire Pakete für Familie, Baby, Schwangerschaft, Business und mehr."
        canonical="/preise/"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Preise & Pakete
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Transparente Preise, faire Pakete – alle bearbeiteten Bilder inklusive
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/vouchers"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Gutschein verschenken
              </Link>
              <Link
                to="/kontakt"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Beratung anfragen
              </Link>
            </div>
          </div>
        </section>

        {/* Info Banner */}
        <section className="bg-purple-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Das ist bei allen Paketen inklusive:</h3>
                <ul className="grid md:grid-cols-3 gap-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Professionelle Bildbearbeitung
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Alle Bilder in voller Auflösung
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Online-Galerie zum Teilen
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Nutzungsrechte inklusive
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Persönliche Beratung
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600" />
                    Keine versteckten Kosten
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Family Packages */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Familien-Fotoshooting</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Authentische Familienmomente für die Ewigkeit
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-300 transition-colors">
                <h3 className="text-2xl font-bold mb-2">Mini</h3>
                <div className="text-4xl font-bold mb-6 text-orange-600">€199</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>30 Minuten Shooting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>12 bearbeitete Bilder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>1 Location (Studio oder Outdoor)</span>
                  </li>
                </ul>
                <Link
                  to="/familien-fotoshooting-wien/"
                  className="block w-full bg-orange-600 text-white text-center py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
                >
                  Mehr erfahren
                </Link>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-400 rounded-2xl p-8 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  BELIEBT
                </div>
                <h3 className="text-2xl font-bold mb-2">Standard</h3>
                <div className="text-4xl font-bold mb-6 text-orange-600">€349</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>60 Minuten Shooting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>25 bearbeitete Bilder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>2 Locations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Styling-Tipps vorab</span>
                  </li>
                </ul>
                <Link
                  to="/familien-fotoshooting-wien/"
                  className="block w-full bg-orange-600 text-white text-center py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
                >
                  Mehr erfahren
                </Link>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-300 transition-colors">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold mb-6 text-orange-600">€549</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>90 Minuten Shooting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>40 bearbeitete Bilder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>3 Locations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Hochwertiges Fotobuch</span>
                  </li>
                </ul>
                <Link
                  to="/familien-fotoshooting-wien/"
                  className="block w-full bg-orange-600 text-white text-center py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
                >
                  Mehr erfahren
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Baby & Newborn */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Baby className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Baby & Newborn</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Zarte Babyfotos in den ersten Lebenswochen
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">Newborn</h3>
                <div className="text-3xl font-bold mb-4 text-pink-600">€249</div>
                <p className="text-gray-600 text-sm mb-4">90 Min | 20 Bilder | Props inklusive</p>
                <Link to="/baby-fotografie-wien/" className="text-pink-600 font-semibold hover:underline">
                  Details →
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">Baby 3-12 Monate</h3>
                <div className="text-3xl font-bold mb-4 text-pink-600">€199</div>
                <p className="text-gray-600 text-sm mb-4">60 Min | 15 Bilder | Requisiten</p>
                <Link to="/baby-fotografie-wien/" className="text-pink-600 font-semibold hover:underline">
                  Details →
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">Cake Smash</h3>
                <div className="text-3xl font-bold mb-4 text-pink-600">€289</div>
                <p className="text-gray-600 text-sm mb-4">60 Min | 20 Bilder | Torte & Deko</p>
                <Link to="/baby-fotografie-wien/" className="text-pink-600 font-semibold hover:underline">
                  Details →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pregnancy */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Schwangerschaftsfotos</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Die besondere Zeit vor der Geburt festhalten
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-2">Basis</h3>
                <div className="text-3xl font-bold mb-4 text-purple-600">€179</div>
                <p className="text-gray-600 text-sm">45 Min | 12 Bilder | Studio</p>
                <Link to="/schwangerschaftsfotos-wien/" className="text-purple-600 font-semibold hover:underline mt-4 inline-block">
                  Details →
                </Link>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-2">Deluxe</h3>
                <div className="text-3xl font-bold mb-4 text-purple-600">€299</div>
                <p className="text-gray-600 text-sm">60 Min | 20 Bilder | Studio + Outdoor</p>
                <Link to="/schwangerschaftsfotos-wien/" className="text-purple-600 font-semibold hover:underline mt-4 inline-block">
                  Details →
                </Link>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <div className="text-3xl font-bold mb-4 text-purple-600">€449</div>
                <p className="text-gray-600 text-sm">90 Min | 30 Bilder | Mit Partner & Geschwistern</p>
                <Link to="/schwangerschaftsfotos-wien/" className="text-purple-600 font-semibold hover:underline mt-4 inline-block">
                  Details →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Business & Portrait */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Business */}
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">Business Portrait</h2>
                  <p className="text-gray-600">Professionell für Ihre Karriere</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold mb-1">Express</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-2">€129</div>
                    <p className="text-sm text-gray-600">20 Min | 5 Bilder | LinkedIn/XING ready</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold mb-1">Professional</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-2">€249</div>
                    <p className="text-sm text-gray-600">45 Min | 12 Bilder | Verschiedene Looks</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold mb-1">Executive</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-2">€449</div>
                    <p className="text-sm text-gray-600">90 Min | 25 Bilder | On-Location möglich</p>
                  </div>
                </div>

                <Link
                  to="/business-portrait-wien/"
                  className="mt-6 block text-center bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                  Mehr zu Business Portraits
                </Link>
              </div>

              {/* Portrait */}
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">Portraitfotografie</h2>
                  <p className="text-gray-600">Persönliche Portraits mit Charakter</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold mb-1">Basis</h3>
                    <div className="text-2xl font-bold text-indigo-600 mb-2">€149</div>
                    <p className="text-sm text-gray-600">30 Min | 8 Bilder | Studio</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold mb-1">Premium</h3>
                    <div className="text-2xl font-bold text-indigo-600 mb-2">€249</div>
                    <p className="text-sm text-gray-600">60 Min | 15 Bilder | Styling-Beratung</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold mb-1">Deluxe</h3>
                    <div className="text-2xl font-bold text-indigo-600 mb-2">€399</div>
                    <p className="text-sm text-gray-600">90 Min | 25 Bilder | Make-up & Fotobuch</p>
                  </div>
                </div>

                <Link
                  to="/portrait-fotografie-wien/"
                  className="mt-6 block text-center bg-indigo-600 text-white py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Mehr zu Portrait Shootings
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Children Photography */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Kinder-Fotografie</h2>
              <p className="text-lg text-gray-600">
                Natürliche Kinderfotos voller Lebensfreude
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 text-center">
                <h3 className="font-bold mb-2">Mini</h3>
                <div className="text-3xl font-bold text-yellow-600 mb-2">€179</div>
                <p className="text-sm text-gray-600">20 Min | 10 Bilder</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-6 text-center border-2 border-orange-400">
                <div className="text-xs font-semibold text-orange-600 mb-2">BELIEBT</div>
                <h3 className="font-bold mb-2">Standard</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">€299</div>
                <p className="text-sm text-gray-600">45 Min | 20 Bilder</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 text-center">
                <h3 className="font-bold mb-2">Premium</h3>
                <div className="text-3xl font-bold text-pink-600 mb-2">€449</div>
                <p className="text-sm text-gray-600">90 Min | 35 Bilder</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                to="/kinder-fotografie-wien/"
                className="inline-block bg-yellow-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-yellow-700 transition-colors"
              >
                Details zu Kinder-Fotografie
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Häufige Fragen zu Preisen
            </h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  Sind alle Bilder im Preis enthalten?
                </h3>
                <p className="text-gray-600">
                  Ja! Sie erhalten alle im Paket angegebenen Bilder professionell bearbeitet in 
                  voller Auflösung. Es gibt keine versteckten Kosten oder Nachkaufverpflichtungen.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  Kann ich zusätzliche Bilder erwerben?
                </h3>
                <p className="text-gray-600">
                  Auf Wunsch können Sie gerne weitere bearbeitete Bilder dazukaufen. 
                  Der Preis beträgt €15 pro zusätzlichem Bild.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  Gibt es Rabatte für mehrere Shootings?
                </h3>
                <p className="text-gray-600">
                  Ja! Wenn Sie mehrere Shootings buchen (z.B. Schwangerschaft + Newborn + Baby), 
                  erhalten Sie 10% Rabatt auf das Gesamtpaket.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  Wie funktionieren die Gutscheine?
                </h3>
                <p className="text-gray-600">
                  Gutscheine können für beliebige Beträge oder spezifische Pakete erworben werden. 
                  Sie sind 3 Jahre gültig und können für alle unsere Leistungen eingelöst werden.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/faq"
                className="text-purple-600 font-semibold hover:underline text-lg"
              >
                Alle FAQs ansehen →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Noch Fragen zu unseren Preisen?</h2>
            <p className="text-xl mb-8">
              Wir beraten Sie gerne persönlich und finden das perfekte Paket für Ihre Wünsche!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/kontakt"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Jetzt beraten lassen
              </Link>
              <Link
                to="/vouchers"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Gutschein verschenken
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PreisePage;
