import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';

const DatenschutzPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Datenschutz & Impressum | New Age Fotografie Wien</title>
        <meta name="description" content="Datenschutzerklärung und Impressum von New Age Fotografie Wien. DSGVO-konform, transparent, Österreich." />
        <link rel="canonical" href="https://www.newagefotografie.com/datenschutz/" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Impressum & Datenschutzerklärung
            </h1>

            <div className="prose prose-lg max-w-none text-gray-700">
              
              {/* Impressum Section */}
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Anbieter</h2>
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="font-semibold text-gray-900 text-lg mb-2">New Age Fotografie</p>
                <p>Simon Parrott</p>
                
                <p className="font-semibold text-gray-900 mt-4 mb-1">📍 Studio:</p>
                <p>Eingang Ecke Schönbrunnerstraße<br />
                Wehrgasse 11A/2+5<br />
                1050 Wien</p>
                
                <p className="font-semibold text-gray-900 mt-4 mb-1">📮 Büro & Korrespondenz:</p>
                <p>Julius-Tandler-Platz 5 / 13<br />
                1090 Wien</p>
                
                <p className="mt-4">
                  📞 <strong>Telefon:</strong> <a href="tel:+4367763399210" className="text-purple-600 hover:text-purple-700">+43 677 633 99210</a><br />
                  📧 <strong>E-Mail:</strong> <a href="mailto:hallo@newagefotografie.com" className="text-purple-600 hover:text-purple-700">hallo@newagefotografie.com</a><br />
                  🌐 <strong>Website:</strong> <a href="https://www.newagefotografie.com" className="text-purple-600 hover:text-purple-700">www.newagefotografie.com</a>
                </p>
                
                <p className="mt-4 text-sm text-gray-500">Keine UID-Nummer (nicht umsatzsteuerpflichtig).</p>
              </div>

              {/* Datenschutz Section */}
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Datenschutz – Kurz & Klar</h2>
              <p>
                Wir nehmen Datenschutz ernst und verarbeiten personenbezogene Daten ausschließlich im Rahmen der DSGVO.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Welche Daten wir verarbeiten</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, E-Mail, Telefonnummer</li>
                <li>Buchungs- & Rechnungsdaten</li>
                <li>Fotos aus dem Shooting</li>
                <li>Website-Daten (nur mit Zustimmung)</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Zweck der Verarbeitung</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Terminabwicklung</li>
                <li>Vertragserfüllung</li>
                <li>Bildbearbeitung & Lieferung</li>
                <li>Buchhaltung</li>
                <li>Kommunikation</li>
                <li>Marketing nur mit Einwilligung</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Fotos & personenbezogene Daten</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fotos gelten als personenbezogene Daten.</li>
                <li>Speicherung erfolgt sicher.</li>
                <li>Keine Weitergabe ohne Zustimmung.</li>
                <li>Veröffentlichung nur mit Einwilligung oder wenn nicht widersprochen wurde.</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Cookies</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Notwendige Cookies für den Betrieb</li>
                <li>Analyse & Marketing nur nach Zustimmung</li>
                <li>Einwilligung jederzeit widerrufbar</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Deine Rechte</h3>
              <p>Du hast jederzeit das Recht auf:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Auskunft</li>
                <li>Berichtigung</li>
                <li>Löschung</li>
                <li>Einschränkung</li>
                <li>Widerruf deiner Einwilligung</li>
              </ul>

              <div className="bg-purple-50 rounded-xl p-6 mt-8">
                <p className="font-semibold text-gray-900">Beschwerdestelle:</p>
                <p>Österreichische Datenschutzbehörde (DSB)</p>
                <p className="mt-4">
                  📧 Kontakt: <a href="mailto:hallo@newagefotografie.com" className="text-purple-600 hover:text-purple-700">hallo@newagefotografie.com</a>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DatenschutzPage;
