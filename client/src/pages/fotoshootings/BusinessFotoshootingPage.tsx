import React from 'react';
import GutscheinLayout from '../../components/gutschein/GutscheinLayout';
import { Clock, Users, Camera, Briefcase } from 'lucide-react';

const BusinessFotoshootingPage: React.FC = () => {
  const businessPhotos = [
    {
      url: "https://i.postimg.cc/RZjf8FsX/Whats-App-Image-2025-05-24-at-2-38-45-PM-1.jpg",
      title: "Professional Headshots"
    },
    {
      url: "https://i.postimg.cc/tRKspft4/19-L9686-683x1024.jpg",
      title: "Corporate Portraits"
    },
    {
      url: "https://imgur.com/2EsZmcP.jpg",
      title: "Team Photos"
    }
  ];

  const portfolioPhotos = [
    {
      url: "https://i.postimg.cc/6QqWdLLP/Whats-App-Image-2025-05-24-at-2-38-46-PM.jpg",
      title: "Executive Portraits"
    },
    {
      url: "https://i.postimg.cc/rFg2QRm2/Whats-App-Image-2025-05-24-at-2-38-45-PM.jpg",
      title: "Business Casual"
    },
    {
      url: "https://i.postimg.cc/CMGgnQp1/11082260-883838491675315-8361533607387200890-o.jpg",
      title: "Corporate Events"
    },
    {
      url: "https://imgur.com/OvQtkkB.jpg",
      title: "Team Building"
    },
    {
      url: "https://imgur.com/XF8OK3q.jpg",
      title: "Office Culture"
    },
    {
      url: "https://imgur.com/L3gwSlu.jpg",
      title: "Professional Environment"
    }
  ];

  return (
    <GutscheinLayout
      title="Businessportraits, die Eindruck machen"
      subtitle="Professionell. Authentisch. Unvergesslich."
      image="https://i.postimg.cc/6Q2c2gS1/Whats-App-Image-2025-05-24-at-2-38-45-PM-2.jpg"
      seoTitle="Business Fotoshooting Wien | New Age Fotografie"
      seoDescription="Business Fotoshooting in Wien: Professionelle Fotos für Ihr Unternehmen, Team und Personal Branding. Pakete ab €95."
      seoKeywords="Business Fotoshooting Wien, Corporate Photography, Businessfotos"
      canonical="/fotoshootings/business"
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">✅ Starker Auftritt für Sie und Ihre Marke</h2>
            <p className="text-gray-700 text-lg">
              Ob für LinkedIn, Website oder Pitchdeck – Ihre Businessfotos sagen mehr als Worte. In unserem Studio in Wien (und Zürich) setzen wir Sie professionell in Szene: klar, sympathisch und markengerecht.
            </p>
          </div>

          {/* Photo Grid - Three Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {businessPhotos.map((photo, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="font-bold text-lg mb-1">{photo.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* What to Expect */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">Was Sie erwartet:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Entspannte Atmosphäre</h4>
                <p className="text-gray-600">
                  Kein Stress, keine steifen Posen, einfach Sie in Bestform.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Professionelles Licht & Posing</h4>
                <p className="text-gray-600">
                  Wir zeigen Ihnen, wie Sie authentisch & souverän wirken.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Individuelle Bildsprache</h4>
                <p className="text-gray-600">
                  Auf Ihre Branche und Zielgruppe abgestimmt.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Schnelle & einfache Buchung</h4>
                <p className="text-gray-600">
                  Auch abends oder am Wochenende möglich.
                </p>
              </div>
            </div>
          </div>

          {/* Pain Points */}
          <div className="bg-red-50 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-red-800 mb-6">❌ Unscharfes Selfie statt souveränem Auftritt?</h3>
            <ul className="space-y-4 text-red-700">
              <li>• Ihre Website wirkt hochwertig – bis man Ihr „Über uns"-Foto sieht?</li>
              <li>• Ihr LinkedIn-Profil überzeugt inhaltlich, aber das Bild wirkt wie ein Schnappschuss?</li>
              <li>• Ihre Mitbewerber wirken präsent – Sie fragen sich, woran's liegt?</li>
            </ul>
          </div>

          {/* Solution */}
          <div className="bg-purple-50 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">📸 Professionelle Businessportraits</h3>
            <p className="text-gray-700 mb-6">
              Zeigen auf den ersten Blick, was Sie können. Sie schaffen Nähe, Vertrauen und bleiben im Gedächtnis.
            </p>
            <p className="text-lg font-semibold text-purple-800">
              Für Selbstständige, Gründer:innen, Teams & Führungskräfte
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-purple-900 mb-6 text-center">Impressionen unserer Arbeit</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {portfolioPhotos.map((photo, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">{photo.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-700 italic mb-4">
                "Perfekt für LinkedIn & PR – endlich Fotos, die mich wirklich repräsentieren."
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-700 italic mb-4">
                "Professionell, entspannt & effizient – ein Shooting, das Spaß macht."
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-700 italic mb-4">
                "Die Bilder haben sofort Wirkung gezeigt – auf Website, Socials und in Gesprächen."
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">Warum unsere Kunden wiederkommen:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">💼 Starke Bildsprache</h4>
                <p className="text-gray-600">Die Vertrauen schafft</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">🤝 Locker & professionell</h4>
                <p className="text-gray-600">Für Einzelpersonen & große Teams</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">📐 Vorteilhafte Darstellung</h4>
                <p className="text-gray-600">Aller Körpertypen</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">🎯 Klare Anleitung</h4>
                <p className="text-gray-600">Auch wenn Sie sich vor der Kamera unwohl fühlen</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">🖼️ Langfristige Nutzung</h4>
                <p className="text-gray-600">Bilder für alle Kanäle</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-purple-600 text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Jetzt Shooting buchen und Eindruck hinterlassen.</h3>
            <p className="text-lg mb-6">Businessfotos in Wien & Zürich – New Age Fotografie</p>
            <a 
              href="/warteliste" 
              className="inline-block bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Termin vereinbaren
            </a>
          </div>
        </div>
      </div>
    </GutscheinLayout>
  );
};

export default BusinessFotoshootingPage;