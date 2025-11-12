import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, Camera, Heart, Users, Baby, Briefcase, Phone } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { SEOHead } from '../../components/SEO/SEOHead';

interface Testimonial {
  name: string;
  service: string;
  rating: number;
  date: string;
  text: string;
  highlight?: boolean;
}

const KundenstimmenPage: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: 'Sarah & Michael K.',
      service: 'Familien-Fotoshooting',
      rating: 5,
      date: 'Januar 2024',
      text: 'Wir waren mit unseren zwei Kindern (3 und 5 Jahre) beim Shooting und waren begeistert! Das Team hat es geschafft, dass sich die Kinder sofort wohl gefühlt haben. Die Bilder sind wunderschön geworden - natürlich und voller Leben. Genau so, wie wir uns das vorgestellt haben!',
      highlight: true
    },
    {
      name: 'Julia M.',
      service: 'Newborn Shooting',
      rating: 5,
      date: 'Dezember 2023',
      text: 'Als frischgebackene Mama war ich etwas nervös, aber das Team hat uns so entspannt durch das Shooting begleitet. Mein Baby hat fast durchgeschlafen und die Fotos sind einfach unbezahlbar. So zarte, emotionale Aufnahmen - ich schaue sie mir jeden Tag an!',
      highlight: false
    },
    {
      name: 'Thomas W.',
      service: 'Business Portrait',
      rating: 5,
      date: 'November 2023',
      text: 'Professionell, schnell und mit tollem Ergebnis! Ich brauchte dringend neue Fotos für LinkedIn und meine Website. Das Express-Paket war perfekt - nach 20 Minuten war alles im Kasten und die Bilder kamen pünktlich. Klare Empfehlung!',
      highlight: false
    },
    {
      name: 'Anna & David L.',
      service: 'Schwangerschafts-Shooting',
      rating: 5,
      date: 'Oktober 2023',
      text: 'Unser Babybauch-Shooting war so schön! Wir haben uns vorher beraten lassen zu Outfits und Location. Die Fotografin hatte tolle Ideen und die Bilder sind traumhaft geworden. Ein wunderschönes Andenken an diese besondere Zeit.',
      highlight: true
    },
    {
      name: 'Melanie H.',
      service: 'Baby Fotografie',
      rating: 5,
      date: 'September 2023',
      text: 'Wir haben alle 3 Monate ein Shooting gemacht, um die Entwicklung unserer Tochter festzuhalten. Jedes Mal super organisiert, pünktlich und mit viel Geduld. Die Fotobücher sind jetzt unser größter Schatz!',
      highlight: false
    },
    {
      name: 'Markus R.',
      service: 'Portrait Shooting',
      rating: 5,
      date: 'August 2023',
      text: 'Ich wollte endlich mal professionelle Fotos von mir haben. Das Team hat mir geholfen, mich vor der Kamera wohl zu fühlen und hat mir genau erklärt, wie ich mich positionieren soll. Die Ergebnisse sind fantastisch - ich erkenne mich kaum wieder (im positiven Sinne)!',
      highlight: false
    },
    {
      name: 'Lisa & Peter F.',
      service: 'Familien-Fotoshooting',
      rating: 5,
      date: 'Juli 2023',
      text: 'Wir haben ein Outdoor-Shooting im Park gemacht - bei wunderschönem Abendlicht. Die Atmosphäre war total entspannt und die Kinder konnten spielen und toben. Die Fotos wirken so natürlich und echt. Genau das wollten wir!',
      highlight: false
    },
    {
      name: 'Christina B.',
      service: 'Cake Smash',
      rating: 5,
      date: 'Juni 2023',
      text: 'Zum ersten Geburtstag unseres Sohnes haben wir ein Cake Smash Shooting gemacht. Es war so lustig! Die Deko war wunderschön und die Fotos von unserem kleinen Schokoschnütchen sind einfach goldig. Ein unvergessliches Erlebnis!',
      highlight: true
    },
    {
      name: 'Robert S.',
      service: 'Business Portrait',
      rating: 5,
      date: 'Mai 2023',
      text: 'Als Selbstständiger brauche ich professionelle Fotos für meine Kommunikation. Das Team hat genau verstanden, welchen Look ich brauche - seriös aber sympathisch. Sehr zufrieden mit dem Ergebnis und dem Service!',
      highlight: false
    },
    {
      name: 'Nina & Alex W.',
      service: 'Paar-Shooting',
      rating: 5,
      date: 'April 2023',
      text: 'Wir haben uns zum Jahrestag ein Paar-Shooting geschenkt und es war wunderschön! Die Fotografin hatte super Ideen für Posen und Locations. Wir haben jetzt endlich mal richtig schöne Fotos von uns beiden zusammen.',
      highlight: false
    },
    {
      name: 'Sophie M.',
      service: 'Kinder-Fotografie',
      rating: 5,
      date: 'März 2023',
      text: 'Meine beiden Mädels (4 und 7) waren anfangs etwas schüchtern, aber nach 5 Minuten war das Eis gebrochen. Es wurde viel gelacht und gespielt. Die Fotos sind so lebendig und fangen die Persönlichkeit meiner Kinder perfekt ein!',
      highlight: false
    },
    {
      name: 'Daniel & Eva K.',
      service: 'Newborn Shooting',
      rating: 5,
      date: 'Februar 2023',
      text: 'Unser erstes Baby - und so wunderschöne Erinnerungsfotos! Das Team ist zu uns nach Hause gekommen, was super entspannt war. Die Geduld und Ruhe war genau das Richtige für unseren kleinen Schatz. Vielen Dank!',
      highlight: false
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1);

  return (
    <Layout>
      <SEOHead
        title="Kundenstimmen & Bewertungen | New Age Fotografie Wien"
        description="Lesen Sie Erfahrungsberichte unserer zufriedenen Kunden. Über 500 Familien vertrauen auf New Age Fotografie für ihre schönsten Erinnerungsfotos in Wien."
        canonical="/kundenstimmen/"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-500 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Kundenstimmen
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Das sagen unsere zufriedenen Kunden über uns
            </p>
            
            {/* Rating Summary */}
            <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-6xl font-bold">{averageRating}</div>
              <div className="flex gap-1">
                {renderStars(5)}
              </div>
              <p className="text-lg">Basierend auf {testimonials.length} Bewertungen</p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
                <p className="text-gray-600">Zufriedene Kunden</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-600 mb-2">1000+</div>
                <p className="text-gray-600">Shootings</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                <p className="text-gray-600">Weiterempfehlung</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-600 mb-2">5.0</div>
                <p className="text-gray-600">Durchschnittsbewertung</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Was unsere Kunden sagen
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow ${
                    testimonial.highlight ? 'ring-2 ring-orange-400' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Quote className="w-10 h-10 text-orange-200 flex-shrink-0" />
                    {testimonial.highlight && (
                      <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Highlight
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Camera className="w-4 h-4" />
                      <span>{testimonial.service}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{testimonial.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Bewertungen nach Service
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-8 rounded-2xl">
                <Users className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Familien-Shootings</h3>
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(5)}
                  <span className="font-semibold">5.0</span>
                </div>
                <p className="text-gray-600 text-sm">
                  "Natürliche Momente, entspannte Atmosphäre, wunderschöne Erinnerungen"
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl">
                <Baby className="w-12 h-12 text-pink-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Baby & Newborn</h3>
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(5)}
                  <span className="font-semibold">5.0</span>
                </div>
                <p className="text-gray-600 text-sm">
                  "Geduldig, einfühlsam, perfektes Timing - unbezahlbare Bilder"
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl">
                <Heart className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Schwangerschaft</h3>
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(5)}
                  <span className="font-semibold">5.0</span>
                </div>
                <p className="text-gray-600 text-sm">
                  "Emotionale Aufnahmen, tolle Beratung, wunderschöne Erinnerung"
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl">
                <Briefcase className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Business Portraits</h3>
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(5)}
                  <span className="font-semibold">5.0</span>
                </div>
                <p className="text-gray-600 text-sm">
                  "Professionell, schnell, perfekt für LinkedIn und Website"
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl">
                <Camera className="w-12 h-12 text-yellow-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Kinder-Fotografie</h3>
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(5)}
                  <span className="font-semibold">5.0</span>
                </div>
                <p className="text-gray-600 text-sm">
                  "Lebendige Fotos, spielerischer Ansatz, Kinder fühlen sich wohl"
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-red-50 p-8 rounded-2xl">
                <Heart className="w-12 h-12 text-pink-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Portraits</h3>
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(5)}
                  <span className="font-semibold">5.0</span>
                </div>
                <p className="text-gray-600 text-sm">
                  "Kreativ, individuell, tolle Ergebnisse - endlich schöne Fotos!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Video/Social Proof Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Folgen Sie uns auf Social Media
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Sehen Sie mehr Kundenstimmen, Behind-the-Scenes und fertige Shootings auf Instagram und Facebook
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://instagram.com/newagefotografie"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Instagram folgen
              </a>
              <a
                href="https://facebook.com/newagefotografie"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                Facebook besuchen
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Werden Sie Teil unserer Happy Family!</h2>
            <p className="text-xl mb-8">
              Buchen Sie jetzt Ihr Fotoshooting und erleben Sie selbst, warum unsere Kunden so begeistert sind.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/kontakt"
                className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Jetzt Termin buchen
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

export default KundenstimmenPage;
