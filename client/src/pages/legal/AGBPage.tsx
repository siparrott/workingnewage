import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';

const AGBPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>AGB – Allgemeine Geschäftsbedingungen | New Age Fotografie</title>
        <meta name="description" content="AGB von New Age Fotografie Wien. Buchung, Storno, Urheberrecht, Nutzung – alle wichtigen Bedingungen auf einen Blick." />
        <link rel="canonical" href="https://www.newagefotografie.com/agb/" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              AGB – New Age Fotografie
            </h1>
            <p className="text-gray-500 mb-8">Stand: Dezember 2025</p>

            <div className="prose prose-lg max-w-none text-gray-700">
              
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Geltungsbereich</h2>
              <p>
                Diese AGB gelten für alle Fotoshootings, Buchungen, Gutscheine, Bildbestellungen und Leistungen 
                von New Age Fotografie, sofern nichts anderes schriftlich vereinbart wurde.
              </p>
              <p>
                Mit der Buchung erklärst du dich mit diesen Bedingungen einverstanden.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Buchung & Ablauf</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ein Shooting gilt als fix gebucht, sobald wir es bestätigen.</li>
                <li>Dauer, Umfang und Stil richten sich nach dem gebuchten Paket.</li>
                <li>Der fotografische Stil bleibt Teil unserer kreativen Freiheit.</li>
                <li>Leichte Abweichungen von Beispielbildern sind kein Reklamationsgrund.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Preise & Zahlung</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Alle Preise verstehen sich in Euro.</li>
                <li>Zahlung erfolgt direkt nach dem Shooting oder bei Übergabe.</li>
                <li>Digitale Bilder und Prints bleiben bis zur vollständigen Bezahlung unser Eigentum.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Storno & Nichterscheinen</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Absage unter 48 Stunden:</strong> bis zu 50 % des Shootingpreises.</li>
                <li><strong>Nichterscheinen ohne Absage:</strong> 100 % des Preises.</li>
                <li>Bei Krankheit oder höherer Gewalt finden wir fair eine Lösung.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Bildauswahl & Lieferung</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Die Bildauswahl erfolgt durch New Age Fotografie, außer anders vereinbart.</li>
                <li>RAW-Dateien werden nicht herausgegeben.</li>
                <li>Retusche umfasst Farbe, Licht und leichte Hautkorrekturen.</li>
                <li>Lieferzeiten sind Richtwerte.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Urheberrecht & Nutzung</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Das Urheberrecht bleibt immer bei New Age Fotografie.</li>
                <li>Du erhältst private Nutzungsrechte.</li>
                <li>Kommerzielle Nutzung (Werbung, Website, Social Media von Firmen etc.) nur mit schriftlicher Zustimmung.</li>
                <li>Bilder dürfen nicht verfremdet oder mit Filtern verändert werden.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Haftung</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Keine Haftung bei höherer Gewalt oder technischen Ausfällen.</li>
                <li>Keine Haftung für subjektive Unzufriedenheit.</li>
                <li>Keine Haftung für Datenverlust nach Übergabe.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Gerichtsstand</h2>
              <p>Es gilt österreichisches Recht.</p>
              <p><strong>Gerichtsstand:</strong> Wien</p>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AGBPage;
