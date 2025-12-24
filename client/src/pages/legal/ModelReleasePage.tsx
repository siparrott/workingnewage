import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import { Users, Baby, Briefcase } from 'lucide-react';

const ModelReleasePage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Model-Release Klauseln | New Age Fotografie Wien</title>
        <meta name="description" content="Model-Release Klauseln für Familien-, Baby- und Business-Shootings bei New Age Fotografie Wien. DSGVO-konform." />
        <link rel="canonical" href="https://www.newagefotografie.com/model-release/" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Model-Release Klauseln
            </h1>
            <p className="text-gray-600 mb-8">
              Je nach Art des Shootings gelten unterschiedliche Einwilligungsklauseln für die Verwendung der Bilder.
            </p>

            <div className="space-y-8">
              
              {/* Family & Lifestyle */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Familien- & Lifestyle-Shootings</h2>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    Ich erteile New Age Fotografie die Erlaubnis, ausgewählte Bilder aus dem Shooting für 
                    Portfolio-, Website-, Social-Media- und Marketingzwecke zu verwenden.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Diese Einwilligung gilt zeitlich unbegrenzt und kann jederzeit per E-Mail widerrufen werden.
                  </p>
                </div>
              </div>

              {/* Baby & Newborn */}
              <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-6 border border-pink-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-pink-100 rounded-full">
                    <Baby className="w-6 h-6 text-pink-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Baby- & Neugeborenenfotografie</h2>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    Mir ist bewusst, dass es sich bei den Fotos um sensible personenbezogene Daten handelt.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Ich erteile New Age Fotografie ausdrücklich die Erlaubnis, ausgewählte Bilder meines 
                    Kindes für Portfolio- und Marketingzwecke zu verwenden.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Eine Weitergabe an Dritte erfolgt nicht. Die Einwilligung kann jederzeit widerrufen werden.
                  </p>
                </div>
              </div>

              {/* Business & Corporate */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Business- & Corporate-Shootings</h2>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    Ich / unser Unternehmen erteilen New Age Fotografie das Recht, die entstandenen Bilder 
                    für eigene Marketing-, Portfolio- und Referenzzwecke zu nutzen.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Die kommerzielle Nutzung durch den Auftraggeber ist im vereinbarten Umfang gestattet.
                  </p>
                </div>
              </div>

            </div>

            {/* Contact Note */}
            <div className="mt-10 bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600">
                <strong>Fragen?</strong> Schreib uns an{' '}
                <a href="mailto:hallo@newagefotografie.com" className="text-purple-600 hover:text-purple-700">
                  hallo@newagefotografie.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ModelReleasePage;
