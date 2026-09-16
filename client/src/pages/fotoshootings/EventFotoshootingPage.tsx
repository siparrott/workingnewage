import React from 'react';
import GutscheinLayout from '../../components/gutschein/GutscheinLayout';
import { Clock, Heart, Camera, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SITE } from '../../config/site';

const EventFotoshootingPage: React.FC = () => {
  const { language } = useLanguage();
  const de = language === 'de';
  /**
   * CAPTION AND ALT ARE TWO DIFFERENT JOBS, AND THIS HELD ONE STRING FOR BOTH.
   *
   * `title` was both the visible overlay heading and the alt text, in English, on a page
   * that otherwise switches every word on `de`. A German visitor read "Dance Floor" over
   * the photograph, and a screen-reader user heard those same two words twice — once as
   * the caption, once as the description of the image behind it.
   *
   * title/titleEn is the short label a sighted visitor reads. alt/altEn is the sentence
   * that has to stand in for the photograph: it names the occasion and the city, because
   * nobody searching in Vienna types "Networking Events".
   *
   * The ball series is a real, named, datable event, so the alt says so. Everything else
   * asserts only the kind of shoot and where it happened — never clothing, faces or decor,
   * which cannot be checked from here and mislead badly when read aloud.
   */
  const eventPhotos = [
    {
      url: "https://i.postimg.cc/907tz7nR/21469528-10155302675513124-226449768-n.jpg",
      title: "Firmenevent",
      titleEn: "Corporate Event",
      alt: "Firmenevent in Wien – Eventfotografie während der Veranstaltung",
      altEn: "Corporate event in Vienna – event photography during the occasion",
    },
    {
      url: "https://i.postimg.cc/QdHN7Jqy/121588004-364470784911600-8688844506532345601-n.jpg",
      title: "Konferenz",
      titleEn: "Conference",
      alt: "Konferenz in Wien – Vortrag und Publikum während der Veranstaltung",
      altEn: "Conference in Vienna – a talk and its audience during the event",
    },
    {
      url: "https://i.postimg.cc/vBdGpFwJ/COS-1254.jpg",
      title: "Teambuilding",
      titleEn: "Team Building",
      alt: "Teambuilding-Event eines Wiener Unternehmens",
      altEn: "Team building event for a Viennese company",
    }
  ];

  const additionalPhotos = [
    {
      url: "https://i.postimg.cc/wTDQpDNn/IMG-2582.jpg",
      title: "Businesskonferenz",
      titleEn: "Business Conference",
      alt: "Businesskonferenz in Wien – Eventfotografie für Unternehmen",
      altEn: "Business conference in Vienna – event photography for companies",
    },
    {
      url: "https://i.postimg.cc/bY79WmZQ/K36C7261.jpg",
      title: "Teamevents",
      titleEn: "Team Events",
      alt: "Teamevent einer Wiener Firma – Mitarbeiter während der Veranstaltung",
      altEn: "Team event for a Vienna company – staff during the occasion",
    },
    {
      url: "https://i.postimg.cc/Y9kwd61k/4S8A8486.jpg",
      title: "Networking-Events",
      titleEn: "Networking Events",
      alt: "Networking-Event in Wien – Gäste im Gespräch",
      altEn: "Networking event in Vienna – guests in conversation",
    },
    {
      url: "https://i.postimg.cc/gj2bWGST/IGEPHA-Park-Hyatt-6003.jpg",
      title: "Firmenfeiern",
      titleEn: "Corporate Celebrations",
      alt: "Firmenfeier in Wien – Eventfotografie der Feierlichkeiten",
      altEn: "Corporate celebration in Vienna – event photography of the festivities",
    },
    {
      url: "https://i.postimg.cc/Y9XyQYRd/COS-1203.jpg",
      title: "Produktpräsentationen",
      titleEn: "Product Presentations",
      alt: "Produktpräsentation in Wien – Eventfotografie der Präsentation",
      altEn: "Product presentation in Vienna – event photography of the launch",
    },
    {
      url: "https://i.postimg.cc/Tw24yCVy/K36C8454.jpg",
      title: "Firmenjubiläen",
      titleEn: "Company Milestones",
      alt: "Firmenjubiläum in Wien – Eventfotografie zum Firmenmeilenstein",
      altEn: "Company anniversary in Vienna – event photography of the milestone",
    }
  ];

  // Every frame below is from one identifiable evening — the Ball des Sports 2025 in
  // Vienna — so the alt text names it. That is a real, searchable thing, which "Elegant
  // Moments" is not.
  const ballSportsPhotos = [
    {
      url: "https://i.postimg.cc/QMxS8Vks/Ball-des-Sports-2025-www-newagefotografie-com-5590.jpg",
      title: "Elegante Momente",
      titleEn: "Elegant Moments",
      description: "Die Grazie festlicher Anlässe",
      descriptionEn: "Capturing the grace of formal events",
      alt: "Ball des Sports 2025 in Wien – eleganter Moment des Ballabends",
      altEn: "Ball des Sports 2025 in Vienna – an elegant moment from the evening",
    },
    {
      url: "https://i.postimg.cc/bwP35mZZ/Ball-des-Sports-2025-www-newagefotografie-com-5766.jpg",
      title: "Gesellige Runden",
      titleEn: "Social Gatherings",
      description: "Networking mit Stil",
      descriptionEn: "Networking in style",
      alt: "Ball des Sports 2025 in Wien – Gäste beim Networking",
      altEn: "Ball des Sports 2025 in Vienna – guests networking",
    },
    {
      url: "https://i.postimg.cc/mrXjtR89/Ball-des-Sports-2025-www-newagefotografie-com-5825.jpg",
      title: "Höhepunkte",
      titleEn: "Event Highlights",
      description: "Die wichtigsten Momente des Abends",
      descriptionEn: "Key moments from the evening",
      alt: "Ball des Sports 2025 in Wien – Höhepunkt der Veranstaltung",
      altEn: "Ball des Sports 2025 in Vienna – a highlight of the event",
    },
    {
      url: "https://i.postimg.cc/FRYZSqBB/Ball-des-Sports-2025-www-newagefotografie-com-5855.jpg",
      title: "Ungestellte Momente",
      titleEn: "Candid Interactions",
      description: "Natürliche Augenblicke zwischen den Gästen",
      descriptionEn: "Natural moments between guests",
      alt: "Ball des Sports 2025 in Wien – ungestellter Moment zwischen Gästen",
      altEn: "Ball des Sports 2025 in Vienna – a candid moment between guests",
    },
    {
      url: "https://i.postimg.cc/FFJpsMcf/Ball-des-Sports-2025-www-newagefotografie-com-5878.jpg",
      title: "Ballatmosphäre",
      titleEn: "Event Atmosphere",
      description: "Die Stimmung des Abends",
      descriptionEn: "The ambiance of the ball",
      alt: "Ball des Sports 2025 in Wien – Atmosphäre des Ballabends",
      altEn: "Ball des Sports 2025 in Vienna – the atmosphere of the evening",
    },
    {
      url: "https://i.postimg.cc/yd2TyjqY/Ball-des-Sports-2025-www-newagefotografie-com-6331.jpg",
      title: "Ehrengäste",
      titleEn: "Distinguished Guests",
      description: "VIP-Momente festgehalten",
      descriptionEn: "VIP moments captured",
      alt: "Ball des Sports 2025 in Wien – Ehrengäste des Abends",
      altEn: "Ball des Sports 2025 in Vienna – distinguished guests of the evening",
    },
    {
      url: "https://i.postimg.cc/8cWmKvDd/Ball-des-Sports-2025-www-newagefotografie-com-6382.jpg",
      title: "Tanzfläche",
      titleEn: "Dance Floor",
      description: "Feiern in Bewegung",
      descriptionEn: "Celebration in motion",
      alt: "Ball des Sports 2025 in Wien – Gäste auf der Tanzfläche",
      altEn: "Ball des Sports 2025 in Vienna – guests on the dance floor",
    },
    {
      url: "https://i.postimg.cc/RV5R3gQg/Ball-des-Sports-2025-www-newagefotografie-com-6459.jpg",
      title: "Abendprogramm",
      titleEn: "Evening Entertainment",
      description: "Auftritte und Showacts",
      descriptionEn: "Performances and shows",
      alt: "Ball des Sports 2025 in Wien – Auftritt im Abendprogramm",
      altEn: "Ball des Sports 2025 in Vienna – a performance during the evening programme",
    },
    {
      url: "https://i.postimg.cc/SN6Gccgk/Ball-des-Sports-2025-www-newagefotografie-com-7025.jpg",
      title: "Festliche Porträts",
      titleEn: "Formal Portraits",
      description: "Professionelle Eventfotografie",
      descriptionEn: "Professional event photography",
      alt: "Ball des Sports 2025 in Wien – festliches Porträt eines Gastes",
      altEn: "Ball des Sports 2025 in Vienna – a formal portrait of a guest",
    },
    {
      url: "https://i.postimg.cc/7b8TftF0/Ball-des-Sports-2025-www-newagefotografie-com-7789.jpg",
      title: "Details",
      titleEn: "Event Details",
      description: "Die feinen Details des Abends",
      descriptionEn: "The finer points of the evening",
      alt: "Ball des Sports 2025 in Wien – Detailaufnahme des Ballabends",
      altEn: "Ball des Sports 2025 in Vienna – a detail from the evening",
    },
    {
      url: "https://i.postimg.cc/3xZnQ2Gn/Ball-des-Sports-2025-www-newagefotografie-com-7920.jpg",
      title: "Begegnungen",
      titleEn: "Social Moments",
      description: "Begegnungen und Gespräche",
      descriptionEn: "Connections and conversations",
      alt: "Ball des Sports 2025 in Wien – Gäste im Gespräch",
      altEn: "Ball des Sports 2025 in Vienna – guests in conversation",
    },
    {
      url: "https://i.postimg.cc/Nfmdb3jh/Ball-des-Sports-2025-www-newagefotografie-com-7978.jpg",
      title: "Großes Finale",
      titleEn: "Grand Finale",
      description: "Der Abschluss des Abends",
      descriptionEn: "Memorable closing moments",
      alt: "Ball des Sports 2025 in Wien – Abschluss des Ballabends",
      altEn: "Ball des Sports 2025 in Vienna – the close of the evening",
    }
  ];

  return (
    <GutscheinLayout
      title={de ? 'Eventfotografie Wien – Professionelle Veranstaltungsfotos' : 'Event Photography Vienna – Professional Event Photos'}
      subtitle={de ? `${SITE.name} – Authentisch. Professionell. Unvergesslich.` : `${SITE.name} – Authentic. Professional. Unforgettable.`}
      image="https://i.postimg.cc/rwtMhFtV/Ball-des-Sports-2025-www-newagefotografie-com-5513.jpg"
      seoTitle={`Event Fotoshooting Wien – Professionelle Eventfotografie | ${SITE.name}`}
      seoDescription="Eventfotografie in Wien: Professionelle Dokumentation Ihrer Veranstaltungen, Firmenfeiern, Konferenzen und besonderen Anlässe. Unaufdringlich, authentisch, hochwertig – jetzt anfragen!"
      seoKeywords="Event Fotoshooting Wien, Eventfotograf Wien buchen, Veranstaltungsfotos Wien, Konferenzfotografie Wien"
      canonical="/fotoshootings/event/"
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">{de ? 'Ihre Veranstaltung. Ihre Emotionen. Perfekt eingefangen.' : 'Your event. Your emotions. Perfectly captured.'}</h2>
            <p className="text-gray-700 text-lg">
              {de ? (
                <>
                  Sie planen ein Event und möchten sich darauf verlassen können, dass alle wichtigen Momente eingefangen werden?
                  <br />
                  Wir sind auf natürliche, stimmungsvolle Eventfotografie spezialisiert – ohne gestellte Posen, ohne steife Atmosphäre.
                </>
              ) : (
                <>
                  Planning an event and want to be sure every important moment is captured?
                  <br />
                  We specialise in natural, atmospheric event photography – no staged poses, no stiff atmosphere.
                </>
              )}
            </p>
          </div>

          {/* Photo Grid - Three Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {eventPhotos.map((photo, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg">
                <img
                  src={photo.url}
                  alt={de ? photo.alt : photo.altEn}
                  className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="font-bold text-lg mb-1">{de ? photo.title : photo.titleEn}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">{de ? 'Warum Kunden uns wählen:' : 'Why clients choose us:'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">{de ? 'Unauffällig & präsent' : 'Discreet yet present'}</h4>
                <p className="text-gray-600">
                  {de ? 'Wir bewegen uns dezent im Hintergrund und fangen echte Emotionen ein.' : 'We move quietly in the background and capture genuine emotions.'}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">{de ? 'Authentisch & natürlich' : 'Authentic & natural'}</h4>
                <p className="text-gray-600">
                  {de ? 'Keine gestellten Bilder. Wir zeigen Sie, wie Sie wirklich sind – entspannt und sympathisch.' : 'No staged shots. We show you as you really are – relaxed and likeable.'}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">{de ? 'Ruhig in jeder Situation' : 'Calm in every situation'}</h4>
                <p className="text-gray-600">
                  {de ? 'Selbst in stressigen Momenten behalten wir den Überblick und dokumentieren jedes Detail.' : 'Even in hectic moments we keep the overview and document every detail.'}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">{de ? 'Schmeichelhafte Perspektiven' : 'Flattering perspectives'}</h4>
                <p className="text-gray-600">
                  {de ? 'Wir kennen die besten Blickwinkel, damit sich alle auf den Bildern wiedererkennen und mögen.' : 'We know the best angles, so everyone recognises and loves themselves in the photos.'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Photo Grid */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-purple-900 mb-6 text-center">{de ? 'Impressionen unserer Arbeit' : 'Impressions of our work'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {additionalPhotos.map((photo, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={photo.url}
                    alt={de ? photo.alt : photo.altEn}
                    className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-1">{de ? photo.title : photo.titleEn}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ball des Sports Grid */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-purple-900 mb-8 text-center">
             {de ? 'Eleganz & Stil' : 'Elegance & Style'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ballSportsPhotos.map((photo, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <img 
                    src={photo.url} 
                    alt={de ? photo.alt : photo.altEn}
                    className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-1">{de ? photo.title : photo.titleEn}</h3>
                      <p className="text-sm opacity-90">{de ? photo.description : photo.descriptionEn}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flexible Booking */}
          <div className="bg-purple-50 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">{de ? 'Flexibel buchbar – auch an Wochenenden & Feiertagen' : 'Flexible booking – including weekends & holidays'}</h3>
            <p className="text-gray-700">
              {de
                ? 'Unser einfacher Buchungsprozess ist 7 Tage die Woche verfügbar – so passt sich Ihr Fotograf Ihrem Zeitplan an, nicht umgekehrt.'
                : 'Our simple booking process is available 7 days a week – so your photographer fits your schedule, not the other way around.'}
            </p>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-700 italic mb-4">{de ? '"Perfekt für jedes Event."' : '“Perfect for any event.”'}</p>
              <p className="text-gray-700 italic mb-4">{de ? '"Unauffällig, professionell, sympathisch."' : '“Discreet, professional, and warm.”'}</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-700 italic mb-4">{de ? '"Fotos, die man wirklich gerne teilt."' : '“Photos you actually love to share.”'}</p>
              <p className="text-gray-700 italic mb-4">{de ? '"Einfach zu buchen, zuverlässig und herzlich."' : '“Easy to book, reliable, and warm-hearted.”'}</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">{de ? '📍 Verfügbar in Wien' : '📍 Available in Vienna'}</h3>
            <p className="text-lg mb-4">📅 {de ? 'Jetzt Termin sichern:' : 'Secure your date now:'} <a href="/warteliste" className="text-purple-600 hover:text-purple-700">{de ? 'Termin planen' : 'Plan a date'}</a></p>
            <p className="text-lg">📸 {SITE.name} – {de ? 'Für bleibende Erinnerungen.' : 'For lasting memories.'}</p>
          </div>
        </div>
      </div>
    </GutscheinLayout>
  );
};

export default EventFotoshootingPage;