import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Heart, Award, Users, MapPin, Clock, Star, Phone } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { SEOHead } from '../../components/SEO/SEOHead';

const UeberUnsPage: React.FC = () => {
  return (
    <Layout>
      <SEOHead
        title="Über Uns – New Age Fotografie Wien"
        description="Lernen Sie das Team von New Age Fotografie kennen. Professionelle Fotografen in Wien mit Leidenschaft für natürliche, emotionale Aufnahmen."
        canonical="/ueber-uns/"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Über New Age Fotografie
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Wir fangen Ihre schönsten Momente ein – mit Leidenschaft, Kreativität und Herz
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/kontakt"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Kontakt aufnehmen
              </Link>
              <Link
                to="/portfolio"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Portfolio ansehen
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900">Unsere Mission</h2>
                <p className="text-lg text-gray-700 mb-4">
                  Bei New Age Fotografie glauben wir daran, dass die wertvollsten Erinnerungen 
                  in natürlichen, ungestellten Momenten entstehen. Unsere Mission ist es, diese 
                  flüchtigen Augenblicke für Sie festzuhalten – authentisch, emotional und zeitlos schön.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  Seit unserer Gründung in Wien haben wir Hunderten von Familien, Paaren und 
                  Einzelpersonen geholfen, ihre wichtigsten Lebensmomente in wunderschönen Bildern 
                  zu verewigen. Von der Schwangerschaft über die ersten Schritte bis hin zu 
                  professionellen Businessportraits – wir sind für Sie da.
                </p>
                <p className="text-lg text-gray-700">
                  Unser Ansatz ist entspannt, persönlich und auf Ihre individuellen Wünsche abgestimmt. 
                  Wir nehmen uns Zeit, um Sie kennenzulernen und eine vertrauensvolle Atmosphäre zu 
                  schaffen, in der Sie sich wohlfühlen können.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Unsere Werte</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Leidenschaft</h3>
                <p className="text-gray-600">
                  Fotografie ist unsere Passion. Diese Begeisterung spiegelt sich in jedem Bild wider.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Qualität</h3>
                <p className="text-gray-600">
                  Höchste Standards bei Equipment, Bearbeitung und Kundenservice sind selbstverständlich.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Persönlichkeit</h3>
                <p className="text-gray-600">
                  Jeder Mensch ist einzigartig. Wir nehmen uns Zeit für individuelle Beratung und Umsetzung.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Kreativität</h3>
                <p className="text-gray-600">
                  Innovation und frische Ideen machen jedes Shooting zu einem besonderen Erlebnis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">Unser Team</h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Lernen Sie die kreativen Köpfe hinter New Age Fotografie kennen. Unsere Fotografen 
              bringen jahrelange Erfahrung und eine Leidenschaft für emotionale Bildgestaltung mit.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Sarah Müller</h3>
                <p className="text-purple-600 font-medium mb-2">Gründerin & Hauptfotografin</p>
                <p className="text-gray-600">
                  Spezialisiert auf Familie, Baby & Schwangerschaft. Mit 10+ Jahren Erfahrung.
                </p>
              </div>

              <div className="text-center">
                <div className="aspect-square bg-gradient-to-br from-pink-400 to-orange-400 rounded-2xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Michael Wagner</h3>
                <p className="text-pink-600 font-medium mb-2">Senior Fotograf</p>
                <p className="text-gray-600">
                  Experte für Business Portraits und professionelle Aufnahmen. 8 Jahre Erfahrung.
                </p>
              </div>

              <div className="text-center">
                <div className="aspect-square bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Julia Schneider</h3>
                <p className="text-orange-600 font-medium mb-2">Fotografin & Assistentin</p>
                <p className="text-gray-600">
                  Kreativkopf für Events und besondere Anlässe. Bringt frischen Wind ins Team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Studio Info */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-orange-400 to-pink-400 rounded-2xl"></div>
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900">Unser Studio in Wien</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Zentrale Lage</h3>
                      <p className="text-gray-600">
                        Unser Studio befindet sich im Herzen von Wien, gut erreichbar mit öffentlichen 
                        Verkehrsmitteln und ausreichend Parkmöglichkeiten in der Nähe.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Camera className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Professionelle Ausstattung</h3>
                      <p className="text-gray-600">
                        Modernste Kamera-Technik, verschiedene Hintergründe, professionelle Beleuchtung 
                        und eine gemütliche Atmosphäre für entspannte Shootings.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Flexible Termine</h3>
                      <p className="text-gray-600">
                        Wir bieten Termine auch am Abend und am Wochenende an. Outdoor-Shootings 
                        sind in ganz Wien möglich.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Star className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Wohlfühl-Atmosphäre</h3>
                      <p className="text-gray-600">
                        Besonders für Kinder und Babys haben wir eine entspannte, spielerische 
                        Umgebung geschaffen. Wickelmöglichkeiten und Stillbereich vorhanden.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Warum New Age Fotografie?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">✓ Erfahrung & Expertise</h3>
                <p className="text-gray-700">
                  Über 500 zufriedene Kunden, unzählige besondere Momente festgehalten. 
                  Wir wissen, worauf es ankommt.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">✓ Faire Preise</h3>
                <p className="text-gray-700">
                  Transparente Pakete ohne versteckte Kosten. Alle bearbeiteten Bilder inklusive, 
                  keine Nachkaufverpflichtung.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">✓ Schnelle Lieferung</h3>
                <p className="text-gray-700">
                  Ihre Bilder erhalten Sie innerhalb von 10-14 Tagen in voller Auflösung 
                  digital und druckfertig.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Bereit für Ihr Fotoshooting?</h2>
            <p className="text-xl mb-8">
              Lassen Sie uns gemeinsam Ihre schönsten Momente festhalten!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/kontakt"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Jetzt Termin vereinbaren
              </Link>
              <Link
                to="/preise"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Preise ansehen
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default UeberUnsPage;
