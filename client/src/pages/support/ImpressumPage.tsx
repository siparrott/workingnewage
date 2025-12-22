import React from 'react';
import Layout from '../../components/layout/Layout';
import { SEOHead } from '../../components/SEO/SEOHead';
import { Mail, Phone, MapPin } from 'lucide-react';

const ImpressumPage: React.FC = () => {
  return (
    <Layout>
      <SEOHead 
        title="Impressum - New Age Fotografie"
        description="Impressum und rechtliche Informationen von New Age Fotografie - Professionelle Fotografie in Wien"
        canonicalUrl="https://newagefotografie.com/impressum/"
      />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Impressum</h1>
        
        <div className="space-y-8">
          {/* Company Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Unternehmensname</h2>
            <p className="text-gray-700">New Age Fotografie</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Inhaber</h2>
            <p className="text-gray-700">Simon Parrott</p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Kontakt</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <Phone className="w-5 h-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Telefon</p>
                  <a href="tel:+4367763399210" className="text-purple-600 hover:text-purple-700">
                    +43 677 633 99210
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-5 h-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">E-Mail</p>
                  <a href="mailto:hallo@newagefotografie.com" className="text-purple-600 hover:text-purple-700">
                    hallo@newagefotografie.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Studio Address */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Studioadresse</h2>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
              <div className="text-gray-700">
                <p className="text-sm text-gray-600 mb-1">(Eingang Ecke Schönbrunnerstraße)</p>
                <p>Wehrgasse 11A / 2+5</p>
                <p>1050 Wien</p>
                <p>Österreich</p>
              </div>
            </div>
          </section>

          {/* Office Address */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Büro & Korrespondenzadresse</h2>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
              <div className="text-gray-700">
                <p>Julius-Tandler-Platz 5 / 13</p>
                <p>1090 Wien</p>
                <p>Österreich</p>
              </div>
            </div>
          </section>

          {/* Business Purpose */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Unternehmensgegenstand</h2>
            <p className="text-gray-700">
              Fotografie, insbesondere Familien-, Baby-, Portrait- und Businessfotografie.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Haftungsausschluss</h2>
            <p className="text-gray-700">
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für externe Links. 
              Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
            </p>
          </section>

          {/* Copyright */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Urheberrecht</h2>
            <p className="text-gray-700">
              Die auf dieser Website veröffentlichten Inhalte und Bilder unterliegen dem österreichischen Urheberrecht. 
              Eine Verwendung außerhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung 
              von New Age Fotografie.
            </p>
          </section>

          {/* Privacy Policy */}
          <section className="border-t pt-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Datenschutzerklärung</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Allgemeines</h3>
                <p className="text-gray-700">
                  Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten 
                  ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003).
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Kontakt mit uns</h3>
                <p className="text-gray-700">
                  Wenn Sie per Formular, E-Mail, Telefon oder WhatsApp Kontakt mit uns aufnehmen, werden Ihre 
                  angegebenen Daten zur Bearbeitung der Anfrage und für den Fall von Anschlussfragen gespeichert. 
                  Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Speicherung von Kundendaten</h3>
                <p className="text-gray-700 mb-3">
                  Im Rahmen unserer fotografischen Dienstleistungen verarbeiten wir personenbezogene Daten 
                  (z. B. Name, E-Mail-Adresse, Rechnungsdaten sowie Bilddaten), soweit dies zur Vertragserfüllung 
                  erforderlich ist.
                </p>
                <p className="text-gray-700">
                  Bilddaten werden nur mit ausdrücklicher Einwilligung für Galerie-, Website- oder Portfoliozwecke 
                  verwendet.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Ihre Rechte</h3>
                <p className="text-gray-700 mb-3">Ihnen stehen grundsätzlich folgende Rechte zu:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Auskunft</li>
                  <li>Berichtigung</li>
                  <li>Löschung</li>
                  <li>Einschränkung</li>
                  <li>Datenübertragbarkeit</li>
                  <li>Widerruf und Widerspruch</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, 
                  haben Sie das Recht, sich bei der Datenschutzbehörde zu beschweren.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Widerruf von Einwilligungen</h3>
                <p className="text-gray-700">
                  Eine erteilte Einwilligung zur Verwendung von Fotos kann jederzeit mit Wirkung für die Zukunft 
                  per E-Mail an{' '}
                  <a href="mailto:hallo@newagefotografie.com" className="text-purple-600 hover:text-purple-700">
                    hallo@newagefotografie.com
                  </a>{' '}
                  widerrufen werden.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Datensicherheit</h3>
                <p className="text-gray-700">
                  Wir treffen angemessene technische und organisatorische Maßnahmen, um Ihre personenbezogenen 
                  Daten vor Verlust, Missbrauch oder unbefugtem Zugriff zu schützen.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ImpressumPage;
