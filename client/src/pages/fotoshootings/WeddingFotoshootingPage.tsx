import React from 'react';
import GutscheinLayout from '../../components/gutschein/GutscheinLayout';
import { Clock, Heart, Camera, Calendar } from 'lucide-react';

const WeddingFotoshootingPage: React.FC = () => {
  const weddingPhotos = [
    {
      url: "https://i.postimg.cc/P5Y6qBwf/4S8A7472.jpg",
      title: "Wedding Ceremony"
    },
    {
      url: "https://i.postimg.cc/3R6QYX2s/00134022.jpg",
      title: "Wedding Portraits"
    },
    {
      url: "https://i.postimg.cc/zG15yF45/00371059.jpg",
      title: "Wedding Reception"
    }
  ];

  const additionalPhotos = [
    {
      url: "https://i.postimg.cc/VvWyM3x8/00145408.jpg",
      title: "Getting Ready"
    },
    {
      url: "https://i.postimg.cc/4Nwk3Rvv/00371294.jpg",
      title: "First Look"
    },
    {
      url: "https://i.postimg.cc/fyNnVwgC/events1.jpg",
      title: "Ceremony"
    },
    {
      url: "https://i.postimg.cc/t4T0ZvDK/HOFBAUER-70x50-L.jpg",
      title: "Bridal Portraits"
    },
    {
      url: "https://i.postimg.cc/YqtBkCFq/IMG-6997.jpg",
      title: "Reception"
    },
    {
      url: "https://i.postimg.cc/CMGpWqzQ/IMG-7898.jpg",
      title: "Party"
    }
  ];

  const galleryPhotos = [
    {
      url: "https://i.postimg.cc/85wB64ZY/4-S8-A0596aaa.jpg",
      title: "Romantic Moments",
      description: "Capturing intimate moments between newlyweds"
    },
    {
      url: "https://i.postimg.cc/k53c3BVT/COS-0308.jpg",
      title: "Wedding Details",
      description: "Beautiful wedding day details"
    },
    {
      url: "https://i.postimg.cc/bvxRzpkp/KULHAVY13032020-194-of-671-ddd.jpg",
      title: "Candid Moments",
      description: "Natural and spontaneous celebrations"
    },
    {
      url: "https://i.postimg.cc/4yS68dkb/Pic-9.jpg",
      title: "Venue Photography",
      description: "Stunning wedding venues"
    },
    {
      url: "https://i.postimg.cc/pTPJr4J8/TN-Post-wedding-portraits-168.jpg",
      title: "Portrait Sessions",
      description: "Professional wedding portraits"
    },
    {
      url: "https://i.postimg.cc/Gt2PJDNm/Villa-Antoinette-Gl-serstra-e-9-2680-Semmering-Kurort-Austria.jpg",
      title: "Location Shots",
      description: "Beautiful wedding locations"
    }
  ];

  return (
    <GutscheinLayout
      title="Hochzeitsfotografie Wien – Romantische Hochzeitsbilder"
      subtitle="New Age Fotografie – Eure Geschichte. Echt. Berührend. Für immer."
      image="https://i.postimg.cc/vBxS7p6K/DSC-0318-01299.jpg"
      seoTitle="Hochzeits-Fotoshooting Wien – Authentische Hochzeitsfotografie | New Age Fotografie"
      seoDescription="Hochzeitsfotografie in Wien: Romantische, authentische Hochzeitsbilder von Ihrem schönsten Tag. Standesamt, Kirche & Feier. Individuell, emotional, unvergesslich – jetzt anfragen!"
      seoKeywords="Hochzeits Fotoshooting Wien, Hochzeitsfotograf Wien, Brautpaar Fotos Wien, Hochzeitsreportage Wien"
      canonical="/fotoshootings/wedding/"
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">Eure Liebe, authentisch eingefangen.</h2>
            <p className="text-gray-700 text-lg">
              Euer Hochzeitstag ist einzigartig – ein Tag voller Emotionen, Lachen und bedeutungsvoller Momente.
              <br />
              Wir sorgen dafür, dass ihr ihn nie vergesst. Mit Bildern, die nicht gestellt wirken – sondern echt.
            </p>
          </div>

          {/* Photo Grid - Three Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {weddingPhotos.map((photo, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg">
                <img 
                  src={photo.url} 
                  alt={photo.title}
                  className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="font-bold text-lg mb-1">{photo.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">Warum Paare uns wählen:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Natürlich & unaufdringlich</h4>
                <p className="text-gray-600">
                  Wir halten echte Emotionen fest, ohne zu stören.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Professionell & herzlich</h4>
                <p className="text-gray-600">
                  Ihr fühlt euch bei uns wohl, auch wenn ihr keine Kameraprofis seid.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Detailverliebt & kreativ</h4>
                <p className="text-gray-600">
                  Vom kleinen Blick bis zur großen Geste – nichts geht verloren.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Nachhaltige Erinnerungen</h4>
                <p className="text-gray-600">
                  Eure Fotos werden zum visuellen Erbe eurer Liebesgeschichte.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Photo Grid */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-purple-900 mb-6 text-center">Impressionen unserer Arbeit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {additionalPhotos.map((photo, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-1">{photo.title}</h3>
                      <p className="text-sm opacity-90">{photo.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flexible Booking */}
          <div className="bg-purple-50 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">Flexible Buchung – Auch an Wochenenden und Feiertagen</h3>
            <p className="text-gray-700">
              Ganz nach eurem Zeitplan – wir passen uns euch an, nicht umgekehrt.
            </p>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-700 italic mb-4">
                "Unvergesslich! Matt und sein Team haben jeden Moment eingefangen – kreativ, entspannt und mit einem tollen Gespür für Timing."
              </p>
              <p className="font-semibold">– Sasha & Marten ⭐⭐⭐⭐⭐</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-700 italic mb-4">
                "Einfühlsam, professionell und einfach top. Wir würden sie jederzeit wieder buchen!"
              </p>
              <p className="font-semibold">– Christina M. ⭐⭐⭐⭐⭐</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-700 italic mb-4">
                "Die Bilder sind magisch – so viele echte Emotionen. Und der Service war von Anfang bis Ende perfekt."
              </p>
              <p className="font-semibold">– Tina & Robin ⭐⭐⭐⭐⭐</p>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-purple-900 mb-8 text-center">
              Hochzeitsmomente für die Ewigkeit
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galleryPhotos.map((photo, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-1">{photo.title}</h3>
                      <p className="text-sm opacity-90">{photo.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">Eure Hochzeit. Euer Moment. Unser Versprechen.</h3>
            <p className="text-gray-700 mb-6">
              Ob Standesamt, Gartenhochzeit oder großes Fest – wir begleiten euch mit Erfahrung, Gefühl und einem Blick für das, was wirklich zählt.
            </p>
            <p className="text-lg mb-4">📅 Jetzt Termin sichern: <a href="/warteliste" className="text-purple-600 hover:text-purple-700">Hochzeitsfotografie in Wien & Zürich</a></p>
            <p className="text-lg">📸 New Age Fotografie – Für bleibende Erinnerungen.</p>
          </div>
        </div>
      </div>
    </GutscheinLayout>
  );
};

export default WeddingFotoshootingPage;