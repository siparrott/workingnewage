import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, User, Phone, Mail, MapPin, Camera, 
  Scale, Shield, FileText, ExternalLink
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { SEOHead } from '../../components/SEO/SEOHead';
import { SITE } from '../../config/site';

const ImpressumPage: React.FC = () => {
  return (
    <Layout>
      <SEOHead
        title={`Impressum & Datenschutz | ${SITE.name}`}
        description={`Impressum und Datenschutzerklärung von ${SITE.name} in Wien. Rechtliche Informationen, Kontaktdaten und Datenschutzhinweise.`}
        keywords={`Impressum ${SITE.name}, Datenschutz Fotograf Wien, Rechtliche Informationen`}
        canonical="/impressum/"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Impressum & Datenschutz</h1>
            <p className="text-xl text-purple-100 max-w-2xl">
              Rechtliche Informationen und Datenschutzerklärung von {SITE.name}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Impressum Section */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Building2 className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Impressum</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Company Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-purple-500" />
                      Unternehmensname
                    </h3>
                    <p className="text-gray-700">{SITE.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <User className="w-5 h-5 mr-2 text-purple-500" />
                      Inhaber
                    </h3>
                    <p className="text-gray-700">Simon Parrott</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-purple-500" />
                      Telefon
                    </h3>
                    <a
                      href={`tel:+${SITE.phone.replace(/[^0-9]/g,'')}`}
                      className="text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      {SITE.phone}
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-purple-500" />
                      E-Mail
                    </h3>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </div>
                
                {/* Business Registration */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">GLN (Global Location Number)</h3>
                    <p className="text-gray-700 font-mono">9110013674127</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">GISA-Zahl</h3>
                    <p className="text-gray-700 font-mono">35529712</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Berechtigungen</h3>
                    <p className="text-gray-700">LI Berufsfotografie</p>
                    <p className="text-gray-700">Berufsfotograf</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Gewerberechtliche Geschäftsführung</h3>
                    <p className="text-gray-700">—</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Addresses Section */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <MapPin className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Adressen</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-purple-500" />
                    Studioadresse
                  </h3>
                  <p className="text-gray-700 text-sm mb-2 italic">
                    (Eingang Ecke Schönbrunnerstraße)
                  </p>
                  <address className="text-gray-700 not-italic">
                    Wehrgasse 11A / 2+5<br />
                    1050 Wien<br />
                    Österreich
                  </address>
                  <a 
                    href="https://maps.google.com/?q=Wehrgasse+11A,+1050+Wien" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-3 text-purple-600 hover:text-purple-700 text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Auf Google Maps anzeigen
                  </a>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-500" />
                    Büro & Korrespondenzadresse
                  </h3>
                  <address className="text-gray-700 not-italic">
                    Julius-Tandler-Platz 5 / 13<br />
                    1090 Wien<br />
                    Österreich
                  </address>
                </div>
              </div>
            </section>

            {/* Business Subject */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Camera className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Unternehmensgegenstand</h2>
              </div>
              <p className="text-gray-700">
                Fotografie, insbesondere Familien-, Baby-, Portrait- und Businessfotografie.
              </p>
            </section>

            {/* Disclaimer */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Scale className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Haftungsausschluss</h2>
              </div>
              <p className="text-gray-700">
                Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für externe Links. 
                Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
              </p>
            </section>

            {/* Copyright */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <FileText className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Urheberrecht</h2>
              </div>
              <p className="text-gray-700">
                Die auf dieser Website veröffentlichten Inhalte und Bilder unterliegen dem österreichischen Urheberrecht. 
                Eine Verwendung außerhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung von {SITE.name}.
              </p>
            </section>

            {/* Privacy Policy */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Datenschutzerklärung</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Allgemeines</h3>
                  <p className="text-gray-700">
                    Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. 
                    Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003).
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Kontakt mit uns</h3>
                  <p className="text-gray-700">
                    Wenn Sie per Formular, E-Mail, Telefon oder WhatsApp Kontakt mit uns aufnehmen, werden Ihre angegebenen Daten 
                    zur Bearbeitung der Anfrage und für den Fall von Anschlussfragen gespeichert. Diese Daten geben wir nicht ohne 
                    Ihre Einwilligung weiter.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Speicherung von Kundendaten</h3>
                  <p className="text-gray-700">
                    Im Rahmen unserer fotografischen Dienstleistungen verarbeiten wir personenbezogene Daten 
                    (z. B. Name, E-Mail-Adresse, Rechnungsdaten sowie Bilddaten), soweit dies zur Vertragserfüllung erforderlich ist.
                  </p>
                  <p className="text-gray-700 mt-2">
                    Bilddaten werden nur mit ausdrücklicher Einwilligung für Galerie-, Website- oder Portfoliozwecke verwendet.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ihre Rechte</h3>
                  <p className="text-gray-700 mb-3">
                    Ihnen stehen grundsätzlich folgende Rechte zu:
                  </p>
                  <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Auskunft', 'Berichtigung', 'Löschung', 'Einschränkung', 'Datenübertragbarkeit', 'Widerruf und Widerspruch'].map((right) => (
                      <li key={right} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        {right}
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-700 mt-4">
                    Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, 
                    haben Sie das Recht, sich bei der Datenschutzbehörde zu beschweren.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Widerruf von Einwilligungen</h3>
                  <p className="text-gray-700">
                    Eine erteilte Einwilligung zur Verwendung von Fotos kann jederzeit mit Wirkung für die Zukunft per E-Mail an{' '}
                    <a
                      href={`mailto:${SITE.email}`}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      {SITE.email}
                    </a>{' '}
                    widerrufen werden.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Datensicherheit</h3>
                  <p className="text-gray-700">
                    Wir treffen angemessene technische und organisatorische Maßnahmen, um Ihre personenbezogenen Daten 
                    vor Verlust, Missbrauch oder unbefugtem Zugriff zu schützen.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl shadow-lg p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Fragen?</h2>
              <p className="mb-6 text-purple-100">
                Bei Fragen zu unseren rechtlichen Informationen oder zum Datenschutz kontaktieren Sie uns gerne.
              </p>
              <Link 
                to="/kontakt" 
                className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors"
              >
                Kontakt aufnehmen
              </Link>
            </section>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ImpressumPage;
