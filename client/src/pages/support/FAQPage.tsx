import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Camera, Calendar, CreditCard, Image, Phone, Mail } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { SEOHead } from '../../components/SEO/SEOHead';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData: FAQItem[] = [
    // Booking & Preparation
    {
      category: 'Buchung & Vorbereitung',
      question: 'Wie buche ich ein Fotoshooting?',
      answer: 'Sie können ganz einfach über unser Kontaktformular, per E-Mail (hallo@newagefotografie.com) oder telefonisch (+43 660 123 4567) einen Termin vereinbaren. Wir besprechen dann alle Details mit Ihnen.'
    },
    {
      category: 'Buchung & Vorbereitung',
      question: 'Wie weit im Voraus sollte ich buchen?',
      answer: 'Wir empfehlen eine Buchung 2-4 Wochen im Voraus, besonders für Wochenendtermine. Für Newborn-Shootings am besten bereits während der Schwangerschaft.'
    },
    {
      category: 'Buchung & Vorbereitung',
      question: 'Was soll ich zum Shooting anziehen?',
      answer: 'Wir empfehlen bequeme Kleidung, in der Sie sich wohlfühlen. Vermeiden Sie zu auffällige Muster oder Logos. Gerne beraten wir Sie vorab individuell per WhatsApp oder E-Mail mit konkreten Stylingtipps.'
    },
    {
      category: 'Buchung & Vorbereitung',
      question: 'Kann ich Requisiten oder besondere Wünsche mitbringen?',
      answer: 'Absolut! Lieblingsspielzeug, besondere Outfits oder persönliche Gegenstände machen die Fotos noch individueller. Teilen Sie uns Ihre Wünsche einfach vorab mit.'
    },
    
    // During the Shooting
    {
      category: 'Während des Shootings',
      question: 'Wie lange dauert ein Shooting?',
      answer: 'Je nach Paket zwischen 20 und 90 Minuten. Bei Babys und Kindern planen wir immer etwas Puffer ein für Pausen, Stillen oder Wickeln.'
    },
    {
      category: 'Während des Shootings',
      question: 'Was ist, wenn mein Baby während des Shootings weint?',
      answer: 'Das ist völlig normal! Wir arbeiten geduldig und passen uns dem Rhythmus Ihres Babys an. Füttern, wickeln und kuscheln ist jederzeit möglich. Wir haben viel Erfahrung mit kleinen Kindern.'
    },
    {
      category: 'Während des Shootings',
      question: 'Wo finden die Shootings statt?',
      answer: 'Je nach Paket in unserem Studio in Wien oder an einem Outdoor-Location Ihrer Wahl (Parks, Stadtlocations etc.). Gerne beraten wir Sie zu den schönsten Foto-Spots in Wien.'
    },
    {
      category: 'Während des Shootings',
      question: 'Können mehrere Personen mit aufs Shooting kommen?',
      answer: 'Natürlich! Familienmitglieder sind herzlich willkommen. Bei Business-Shootings empfehlen wir weniger Begleitung für mehr Konzentration.'
    },

    // After the Shooting
    {
      category: 'Nach dem Shooting',
      question: 'Wann bekomme ich meine Bilder?',
      answer: 'Die fertig bearbeiteten Bilder erhalten Sie innerhalb von 10-14 Werktagen nach dem Shooting in Ihrer persönlichen Online-Galerie.'
    },
    {
      category: 'Nach dem Shooting',
      question: 'In welchem Format erhalte ich die Bilder?',
      answer: 'Sie erhalten alle Bilder in hoher Auflösung als JPG-Dateien, optimiert zum Ausdrucken und für digitale Nutzung (Social Media etc.).'
    },
    {
      category: 'Nach dem Shooting',
      question: 'Kann ich die Bilder selbst bearbeiten?',
      answer: 'Die Bilder sind bereits professionell bearbeitet. Weitere Anpassungen empfehlen wir nicht, da diese die Qualität beeinträchtigen können. Bei speziellen Wünschen sprechen Sie uns gerne an.'
    },
    {
      category: 'Nach dem Shooting',
      question: 'Darf ich die Bilder auf Social Media teilen?',
      answer: 'Ja! Die Nutzungsrechte für private Zwecke sind im Preis enthalten. Wir freuen uns über eine Markierung (@newagefotografie) – ist aber keine Pflicht.'
    },
    {
      category: 'Nach dem Shooting',
      question: 'Kann ich zusätzliche Bilder bekommen?',
      answer: 'Ja, Sie können weitere bearbeitete Bilder für €15 pro Stück nachbestellen. Kontaktieren Sie uns einfach.'
    },

    // Payment & Cancellation
    {
      category: 'Zahlung & Stornierung',
      question: 'Wie kann ich bezahlen?',
      answer: 'Wir akzeptieren Überweisung, Barzahlung vor Ort oder PayPal. Die Zahlung erfolgt in der Regel nach dem Shooting.'
    },
    {
      category: 'Zahlung & Stornierung',
      question: 'Muss ich eine Anzahlung leisten?',
      answer: 'Bei den meisten Paketen ist keine Anzahlung nötig. Bei größeren Projekten (Premium-Pakete, Hochzeiten) bitten wir um eine Anzahlung von 30%.'
    },
    {
      category: 'Zahlung & Stornierung',
      question: 'Was passiert bei schlechtem Wetter (Outdoor-Shooting)?',
      answer: 'Bei Outdoor-Shootings können wir bei schlechtem Wetter kostenlos verschieben oder ins Studio wechseln – ganz wie Sie möchten.'
    },
    {
      category: 'Zahlung & Stornierung',
      question: 'Kann ich einen Termin stornieren oder verschieben?',
      answer: 'Bis 48 Stunden vor dem Termin können Sie kostenlos verschieben. Bei kurzfristigeren Absagen behalten wir uns eine Stornogebühr von 50% vor.'
    },

    // Vouchers
    {
      category: 'Gutscheine',
      question: 'Wie funktionieren die Fotoshooting-Gutscheine?',
      answer: 'Gutscheine können für einen bestimmten Betrag oder ein spezifisches Paket erworben werden. Sie sind 3 Jahre gültig und können für alle unsere Leistungen eingelöst werden.'
    },
    {
      category: 'Gutscheine',
      question: 'Kann ich einen Gutschein verschenken?',
      answer: 'Ja! Gutscheine sind das perfekte Geschenk. Wir senden Ihnen den Gutschein schön gestaltet per E-Mail zu – ideal zum Ausdrucken oder digitalen Verschicken.'
    },

    // Special Cases
    {
      category: 'Spezielle Anliegen',
      question: 'Fotografiert ihr auch bei uns zu Hause?',
      answer: 'Ja! Besonders bei Newborn-Shootings kommen wir gerne zu Ihnen nach Hause. Dies ist bei den meisten Paketen als Alternative zum Studio möglich.'
    },
    {
      category: 'Spezielle Anliegen',
      question: 'Bietet ihr auch Fotoshootings für größere Gruppen an?',
      answer: 'Ja, wir fotografieren auch größere Familien, Freundesgruppen oder Firmenevents. Kontaktieren Sie uns für ein individuelles Angebot.'
    },
    {
      category: 'Spezielle Anliegen',
      question: 'Macht ihr auch Hochzeitsfotografie?',
      answer: 'Ja! Wir bieten Hochzeitsfotografie mit verschiedenen Paketen an. Kontaktieren Sie uns für eine persönliche Beratung und ein individuelles Angebot.'
    },
    {
      category: 'Spezielle Anliegen',
      question: 'Fotografiert ihr auch Haustiere?',
      answer: 'Haustiere sind bei Familien-Shootings herzlich willkommen! Reine Tierfotografie bieten wir aktuell nicht an.'
    }
  ];

  const categories = Array.from(new Set(faqData.map(item => item.category)));

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Layout>
      <SEOHead
        title="FAQ - Häufige Fragen | New Age Fotografie"
        description="Antworten auf Ihre Fragen zu Fotoshootings bei New Age Fotografie Wien. Ablauf, Preise, Termine und mehr."
        keywords="FAQ Fotoshooting, Fragen Fotograf Wien, Fotoshooting Ablauf"
        canonical="/faq/"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Häufig gestellte Fragen
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Hier finden Sie Antworten auf die wichtigsten Fragen rund um Ihr Fotoshooting
            </p>
          </div>
        </section>

        {/* Quick Contact Banner */}
        <section className="bg-purple-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                Ihre Frage ist nicht dabei? Wir helfen gerne persönlich weiter!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="tel:+436601234567"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +43 660 123 4567
                </a>
                <a
                  href="mailto:hallo@newagefotografie.com"
                  className="inline-flex items-center gap-2 bg-white text-purple-600 border-2 border-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-50 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  hallo@newagefotografie.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        {categories.map((category, categoryIndex) => (
          <section key={category} className={categoryIndex % 2 === 0 ? 'bg-white py-16' : 'bg-gray-50 py-16'}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                {category === 'Buchung & Vorbereitung' && <Calendar className="w-8 h-8 text-purple-600" />}
                {category === 'Während des Shootings' && <Camera className="w-8 h-8 text-purple-600" />}
                {category === 'Nach dem Shooting' && <Image className="w-8 h-8 text-purple-600" />}
                {category === 'Zahlung & Stornierung' && <CreditCard className="w-8 h-8 text-purple-600" />}
                {category === 'Gutscheine' && <span className="text-3xl">🎁</span>}
                {category === 'Spezielle Anliegen' && <span className="text-3xl">💡</span>}
                <h2 className="text-3xl font-bold text-gray-900">{category}</h2>
              </div>

              <div className="space-y-4">
                {faqData
                  .filter(item => item.category === category)
                  .map((item, index) => {
                    const globalIndex = faqData.indexOf(item);
                    const isOpen = openIndex === globalIndex;

                    return (
                      <div
                        key={globalIndex}
                        className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition-colors"
                      >
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-purple-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-purple-600 flex-shrink-0 transition-transform ${
                              isOpen ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-6 py-4 bg-purple-50 border-t-2 border-purple-100">
                            <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        ))}

        {/* Related Links */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Weitere hilfreiche Informationen
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Link
                to="/preise"
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <CreditCard className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Preise & Pakete</h3>
                <p className="text-gray-600 mb-4">
                  Alle unsere Fotoshooting-Pakete und Preise im Überblick.
                </p>
                <span className="text-purple-600 font-semibold">Mehr erfahren →</span>
              </Link>

              <Link
                to="/ueber-uns"
                className="bg-gradient-to-br from-pink-50 to-orange-50 p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <Camera className="w-12 h-12 text-pink-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Über uns</h3>
                <p className="text-gray-600 mb-4">
                  Lernen Sie unser Team und unsere Philosophie kennen.
                </p>
                <span className="text-pink-600 font-semibold">Mehr erfahren →</span>
              </Link>

              <Link
                to="/kontakt"
                className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <Phone className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Kontakt</h3>
                <p className="text-gray-600 mb-4">
                  Nehmen Sie Kontakt mit uns auf für eine persönliche Beratung.
                </p>
                <span className="text-orange-600 font-semibold">Mehr erfahren →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Bereit für Ihr Fotoshooting?</h2>
            <p className="text-xl mb-8">
              Buchen Sie jetzt Ihren Wunschtermin oder lassen Sie sich persönlich beraten!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/kontakt"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Termin vereinbaren
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

export default FAQPage;
