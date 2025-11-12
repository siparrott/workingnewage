import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Baby, Heart, Smile, Camera, ArrowRight, Check, Gift } from 'lucide-react';

export default function KinderFotografieWienPage() {
  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Kinder-Fotografie Wien – Natürliche Kinderfotos | New Age Fotografie"
        description="Professionelle Kinderfotografie in Wien. Natürliche, lebendige Kinderfotos im Studio oder Outdoor. Vom Kleinkind bis zum Teenager. Jetzt Termin buchen!"
        keywords="kinderfotografie wien, kinderfotos wien, kinderfotograf wien, kindershooting wien, kinderportraits wien"
        canonical="/kinder-fotografie-wien/"
        hreflang={[
          { lang: 'de', url: '/kinder-fotografie-wien/' },
          { lang: 'en', url: '/en/children-photography-vienna/' }
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Kinder-Fotografie in Wien
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Lebendige, natürliche Kinderfotos, die die Persönlichkeit Ihres Kindes einfangen. 
                Vom verspielten Kleinkind bis zum selbstbewussten Teenager – wir halten jeden Moment fest.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  Jetzt Termin buchen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/vouchers"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 border-2 border-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
                >
                  Gutschein verschenken
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center">
                <Camera className="w-32 h-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Age Groups Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Für jedes Alter das richtige Shooting</h2>
            <p className="text-lg text-gray-600">Von Kleinkindern bis zu Teenagern – wir passen uns dem Alter und Charakter an</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-yellow-50 rounded-xl p-6">
              <Baby className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kleinkinder (1-3 Jahre)</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Spielerischer Ansatz</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Kurze, flexible Sessions</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Eltern-Kind-Interaktion</span>
                </li>
              </ul>
            </div>

            <div className="bg-orange-50 rounded-xl p-6">
              <Smile className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kindergartenkinder (3-6 Jahre)</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Energie und Verspieltheit</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Thematische Shootings</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Kreative Requisiten</span>
                </li>
              </ul>
            </div>

            <div className="bg-pink-50 rounded-xl p-6">
              <Heart className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Schulkinder & Teens (6-16 Jahre)</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Individuelle Persönlichkeit</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Moderne Portraits</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Styling-Beratung</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Unsere Kinder-Fotografie Pakete</h2>
            <p className="text-lg text-gray-600">Transparente Preise für unvergessliche Kinderfotos</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mini Package */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mini Shooting</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-orange-600">€179</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>20 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>10 bearbeitete Bilder digital</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>1 Location (Studio oder Outdoor)</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>1 Outfit</span>
                </li>
              </ul>
              <Link
                to="/kontakt"
                className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Standard Package */}
            <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-orange-500 relative transform scale-105">
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                BELIEBT
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Standard Shooting</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-orange-600">€299</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>45 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>20 bearbeitete Bilder digital</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>2 Locations oder Outfits</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Requisiten & Accessoires</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Online-Galerie für 3 Monate</span>
                </li>
              </ul>
              <Link
                to="/kontakt"
                className="block w-full text-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                Jetzt buchen
              </Link>
            </div>

            {/* Premium Package */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Shooting</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-orange-600">€449</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>90 Minuten Shooting</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>35 bearbeitete Bilder digital</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>3 Locations oder Outfits</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Styling-Beratung inklusive</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Premium Fotoalbum (20x30cm)</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Geschwister dürfen mitmachen</span>
                </li>
              </ul>
              <Link
                to="/kontakt"
                className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tipps für ein gelungenes Kindershooting</h2>
          
          <div className="space-y-6">
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Beste Zeit für das Shooting</h3>
              <p className="text-gray-600">
                Wählen Sie eine Tageszeit, zu der Ihr Kind ausgeruht und gut gelaunt ist. 
                Vermeiden Sie Zeiten kurz vor dem Mittagsschlaf oder Essenszeiten.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kleidung & Styling</h3>
              <p className="text-gray-600">
                Bequeme Kleidung in hellen, freundlichen Farben funktioniert am besten. 
                Vermeiden Sie auffällige Muster oder Logos. Bringen Sie gerne 2-3 Outfits mit.
              </p>
            </div>

            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lieblingsspielzeug mitbringen</h3>
              <p className="text-gray-600">
                Ein vertrautes Spielzeug oder Kuscheltier kann helfen, dass sich Ihr Kind wohlfühlt 
                und natürliche, authentische Momente entstehen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Weitere Fotoshootings</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/familien-fotoshooting-wien/" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Heart className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Familien-Fotoshooting</h3>
              <p className="text-gray-600">
                Die ganze Familie gemeinsam vor der Kamera – unvergessliche Erinnerungen für die Ewigkeit.
              </p>
            </Link>

            <Link to="/baby-fotografie-wien/" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Baby className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Baby-Fotografie</h3>
              <p className="text-gray-600">
                Professionelle Newborn- und Babyfotografie in Wien. Sichere und liebevolle Babyshootings.
              </p>
            </Link>

            <Link to="/schwangerschaftsfotos-wien/" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Gift className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Schwangerschaftsfotos</h3>
              <p className="text-gray-600">
                Wunderschöne Babybauch-Fotos die die Vorfreude auf Ihr Baby festhalten.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-orange-500 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit für unvergessliche Kinderfotos?</h2>
          <p className="text-xl mb-8 text-orange-50">
            Buchen Sie jetzt Ihr Kinder-Fotoshooting in Wien und halten Sie die Kindheit fest!
          </p>
          <Link
            to="/kontakt"
            className="inline-flex items-center px-8 py-4 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
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
