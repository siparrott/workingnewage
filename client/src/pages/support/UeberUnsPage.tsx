import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, MapPin, Phone } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { RelatedTopicsBlock } from '../../components/SEO/RelatedTopicsBlock';
import { PillarLinksBlock } from '../../components/SEO/PillarLinksBlock';
import { SEOHead } from '../../components/SEO/SEOHead';
import { SITE } from '../../config/site';

const UeberUnsPage: React.FC = () => {
  const trustLogos = ['BBC', 'Canon', 'Stadt Wien', 'ÖBB', 'Internationale Unternehmen'];
  const storyRows = [
    {
      year: 'Vor Wien',
      station: 'Südafrika & Großbritannien',
      story: 'Die ersten Schritte in der Portraitfotografie – geprägt durch unterschiedliche Menschen, Kulturen und Geschichten.',
    },
    {
      year: 'London',
      station: 'Professionelle Fotografie',
      story: 'Arbeit in einem der kreativsten Märkte Europas.',
    },
    {
      year: '2012',
      station: 'Wien',
      story: `Die Eröffnung von ${SITE.name}.`,
    },
    {
      year: 'Heute',
      station: 'Fotostudio Wien 1050',
      story: 'Tausende Shootings mit Familien, Babys, Paaren und Unternehmen.',
    },
  ];

  const beliefs = [
    {
      title: 'Mensch vor Kamera',
      body: 'Niemand muss ein Model sein. Unsere Aufgabe ist es, eine Atmosphäre zu schaffen, in der echte Emotionen entstehen können.',
    },
    {
      title: 'Natürlichkeit statt steifer Posen',
      body: 'Die schönsten Bilder entstehen oft zwischen den geplanten Momenten: ein Lachen, eine Umarmung, ein Blick.',
    },
    {
      title: 'Erfahrung macht den Unterschied',
      body: 'Nach tausenden Portraits erkennen wir kleine Details: die richtige Körperhaltung, natürliches Licht, echte Ausdrücke und den perfekten Moment zum Auslösen.',
    },
  ];

  const studioBullets = [
    'Familienfotos Wien',
    'Babybauch Fotoshootings',
    'Neugeborenenfotografie',
    'Kinderfotos',
    'Business Portraits',
    'Personal Branding Fotos',
    'Bewerbungsbilder',
    'Paarshootings',
  ];

  const shootings = [
    {
      title: 'Familienfotografie Wien',
      body: 'Familien verändern sich schnell. Unsere Familienfotos halten genau diese Zeit fest – natürlich, emotional und zeitlos.',
      cta: 'Familien Fotoshooting entdecken',
      href: '/familien-fotoshooting-wien/',
    },
    {
      title: 'Babybauch Fotoshooting Wien',
      body: 'Eine besondere Zeit verdient besondere Erinnerungen. Wir fotografieren Schwangerschaften elegant, modern und mit viel Gefühl.',
      cta: 'Babybauch Shooting ansehen',
      href: '/schwangerschaftsfotos-wien/',
    },
    {
      title: 'Neugeborenen Fotoshooting Wien',
      body: 'Die ersten Tage kommen nie zurück. Mit viel Ruhe und Geduld entstehen liebevolle Erinnerungen an diese besondere Anfangszeit.',
      cta: 'Newborn Shooting entdecken',
      href: '/neugeborenenfotos-wien/',
    },
    {
      title: 'Business Portrait Wien',
      body: 'Der erste Eindruck entsteht oft online. Wir erstellen professionelle Portraits für LinkedIn, Webseiten, Bewerbungen und Personal Branding.',
      cta: 'Business Portraits ansehen',
      href: '/business-portrait-wien/',
    },
  ];

  const steps = [
    {
      title: '1. Kennenlernen',
      body: 'Wir sprechen darüber, welche Bilder ihr euch wünscht.',
    },
    {
      title: '2. Entspannte Atmosphäre',
      body: 'Keine Unsicherheit. Kein Stress. Wir führen euch Schritt für Schritt durch das Shooting.',
    },
    {
      title: '3. Auswahl eurer Lieblingsbilder',
      body: 'Nach dem Shooting sucht ihr eure Favoriten bequem aus.',
    },
    {
      title: '4. Erinnerungen für Zuhause',
      body: 'Hochwertige Bilder, Wandkunst und Portraits, die bleiben.',
    },
  ];

  const reasons = [
    'Über 12 Jahre Erfahrung als Fotostudio in Wien',
    'Tausende Menschen fotografiert',
    'Internationale Erfahrung',
    'Persönliche Betreuung',
    'Professionelle Studioqualität',
    'Familienfreundliche Atmosphäre',
    'Bewertungen von echten Kunden',
  ];

  const faqs = [
    {
      question: `Wie lange gibt es ${SITE.name} schon?`,
      answer: 'Unser Fotostudio gibt es seit 2012 in Wien. Seitdem durften wir zahlreiche Familien, Unternehmen und Privatpersonen fotografieren.',
    },
    {
      question: 'Wo befindet sich das Studio?',
      answer: 'Unser Fotostudio befindet sich im 5. Bezirk in Wien und ist einfach erreichbar.',
    },
    {
      question: 'Muss ich Erfahrung vor der Kamera haben?',
      answer: 'Nein. Die meisten unserer Kunden stehen selten vor einer professionellen Kamera. Wir helfen mit natürlicher Anleitung während des gesamten Shootings.',
    },
    {
      question: 'Welche Fotoshootings bietet ihr an?',
      answer: 'Wir fotografieren Familien, Babys, Schwangerschaften, Business Portraits, Paare und besondere Anlässe.',
    },
    {
      question: 'Kann man ein Fotoshooting verschenken?',
      answer: 'Ja. Ein Fotoshooting Gutschein ist eines unserer beliebtesten Geschenke für Geburtstage, Weihnachten oder besondere Momente.',
    },
  ];

  return (
    <Layout>
      <SEOHead
        title={`Über uns | Fotostudio Wien seit 2012 – ${SITE.name}`}
        description={`Lerne ${SITE.name} kennen – dein Fotostudio in Wien seit 2012 für Familienfotografie, Babybauch, Neugeborene und Business Portraits. Persönlich, modern und authentisch.`}
        keywords={`Fotostudio Wien, ${SITE.name} Wien, Familienfotografie Wien, Babybauch Wien, Neugeborene Wien, Business Portrait Wien`}
        canonical="/ueber-uns/"
      />

      {/* Schema.org LocalBusiness structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": SITE.name,
          "description": "Fotostudio in Wien seit 2012 für Familienfotografie, Babybauch, Neugeborene und Business Portraits.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Wien",
            "addressCountry": "AT"
          },
          "areaServed": "Vienna, Austria",
          "url": SITE.url,
          "sameAs": [
            "https://www.capetowncarnival.com/",
            "https://eurovision.tv/event/vienna-2015"
          ],
          "founder": {
            "@type": "Person",
            "name": "Matthew",
            "jobTitle": "Photographer"
          },
          "knowsAbout": [
            "family photography",
            "newborn photography",
            "maternity photography",
            "portrait photography",
            "wedding photography",
            "corporate headshots",
            "product photography",
            "real estate photography"
          ]
        })}
      </script>
      
      <div className="min-h-screen bg-white text-slate-900">
        <section className="bg-slate-950 text-white py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-300 mb-6">Über uns</p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">Über uns – {SITE.name} Wien</h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white/95">Euer Fotostudio in Wien für echte Erinnerungen seit 2012</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-lg md:text-xl text-white/85 leading-relaxed">
              <p>Manche Momente passieren nur einmal.</p>
              <p>Ein Baby ist nur wenige Tage ein Neugeborenes. Kinder verändern sich jedes Jahr. Familien wachsen. Menschen beginnen neue Kapitel.</p>
              <p>Genau deshalb fotografieren wir nicht einfach Bilder.</p>
              <p>Wir erschaffen Erinnerungen, die auch in vielen Jahren noch Bedeutung haben.</p>
              <p>Willkommen bei <strong>{SITE.name} – eurem Fotostudio in Wien für Familien, Babybauch, Neugeborene, Business Portraits und besondere Lebensmomente.</strong></p>
              <p>Seit 2012 durften wir bereits tausende Menschen vor unserer Kamera begleiten – immer mit demselben Ziel:</p>
              <p className="font-semibold text-white">Natürlich. Persönlich. Zeitlos.</p>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/fotoshootings/"
                className="inline-flex items-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Jetzt Fotoshooting entdecken
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Vertraut von Familien, Unternehmen und bekannten Marken</h2>
            <p className="text-lg text-slate-700 leading-relaxed max-w-4xl">
              Über die Jahre durften wir nicht nur Familien aus Wien fotografieren, sondern auch mit bekannten Unternehmen, Organisationen und internationalen Marken arbeiten.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {trustLogos.map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-8 text-lg text-slate-700">Aber unser wichtigster Auftrag bleibt immer derselbe: <strong>Den Menschen vor unserer Kamera authentisch zu zeigen.</strong></p>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Die Geschichte hinter {SITE.name}</h2>
            <h3 className="text-2xl font-semibold text-slate-800 mb-8">Vom internationalen Fotografen zum Fotostudio in Wien</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[720px] border-collapse">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Jahr</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Station</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Unsere Geschichte</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {storyRows.map((row) => (
                    <tr key={row.year} className="align-top">
                      <td className="px-6 py-4 font-semibold text-slate-900">{row.year}</td>
                      <td className="px-6 py-4 text-slate-700">{row.station}</td>
                      <td className="px-6 py-4 text-slate-700">{row.story}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Matthew – der Fotograf hinter {SITE.name}</h2>
            <p className="text-lg text-slate-700">Hallo, ich bin Matthew.</p>
            <p className="text-lg text-slate-700">Nach vielen Jahren hinter der Kamera habe ich eines gelernt: Die beste Technik der Welt bedeutet wenig, wenn Menschen sich vor der Kamera nicht wohlfühlen.</p>
            <p className="text-lg text-slate-700">Ein gutes Portrait beginnt nicht mit dem Auslösen der Kamera. Es beginnt mit Vertrauen.</p>
            <p className="text-lg text-slate-700">Mein Weg führte mich von Südafrika über London nach Wien. Diese internationale Erfahrung prägt bis heute meinen Stil: <strong>Modern, natürlich und voller Persönlichkeit.</strong></p>
            <p className="text-lg text-slate-700">Seit der Eröffnung unseres Studios in Wien durfte ich Familien wachsen sehen, Babys fotografieren, die heute schon zur Schule gehen, und Menschen begleiten, die normalerweise sagen:</p>
            <p className="text-lg italic text-slate-800">&quot;Ich bin nicht fotogen.&quot;</p>
            <p className="text-lg text-slate-700">Meine Antwort ist immer dieselbe:</p>
            <p className="text-xl font-semibold text-slate-950">Doch. Du brauchst nur jemanden hinter der Kamera, der dich richtig sieht.</p>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Woran wir als Fotografen glauben</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {beliefs.map((belief) => (
                <div key={belief.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">{belief.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{belief.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-lg text-slate-700 mb-4">Diese Erfahrung bringen wir in jedes Shooting ein.</p>
              <ul className="grid gap-3 sm:grid-cols-2 text-slate-700">
                <li>• die richtige Körperhaltung</li>
                <li>• natürliches Licht</li>
                <li>• echte Ausdrücke</li>
                <li>• den perfekten Moment zum Auslösen</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Unser Fotostudio in Wien</h2>
                <p className="text-lg text-slate-700 leading-relaxed mb-6">Unser Studio befindet sich im Herzen von Wien im 5. Bezirk.</p>
                <p className="text-lg text-slate-700 leading-relaxed mb-6">Ein heller, entspannter Ort für:</p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {studioBullets.map((item) => (
                    <li key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">{item}</li>
                  ))}
                </ul>
                <p className="mt-8 text-lg text-slate-700 leading-relaxed">Jedes Shooting ist anders. Deshalb arbeiten wir nicht nach einer festen Vorlage. Wir nehmen uns Zeit für euch.</p>
              </div>
              <div className="rounded-2xl bg-slate-950 p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-purple-300" />
                  <h3 className="text-xl font-semibold">Fotostudio Wien 1050</h3>
                </div>
                <p className="text-white/80 leading-relaxed">Persönlich. Modern. Entspannt. Ein Studio für Familien, Babys, Business Portraits und echte Erinnerungen mitten in Wien.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unsere Fotoshootings in Wien</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {shootings.map((shooting) => (
                <div key={shooting.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h3 className="text-2xl font-semibold mb-3">{shooting.title}</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">{shooting.body}</p>
                  <Link to={shooting.href} className="inline-flex items-center text-sm font-semibold text-purple-700 hover:text-purple-900">
                    {shooting.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">So fühlt sich ein Fotoshooting bei uns an</h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {steps.map((step) => (
                <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-950 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Warum Kunden {SITE.name} wählen</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {reasons.map((reason) => (
                <div key={reason} className="flex items-start gap-3 rounded-xl bg-white/5 px-5 py-4 border border-white/10">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/90">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Auszeichnungen & Bewertungen</h2>
            <p className="text-lg text-slate-700 leading-relaxed">Unsere Kundenbewertungen bedeuten uns besonders viel, weil sie zeigen, was hinter jedem Bild steckt: Vertrauen. Geduld. Und echte Erinnerungen.</p>
            <p className="text-3xl tracking-[0.35em] text-amber-500">★★★★★</p>
            <p className="text-lg text-slate-700">Bewertungen auf Google, ProvenExpert und weiteren Plattformen.</p>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Häufige Fragen über unser Fotostudio in Wien</h2>
            <div className="space-y-5">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Am Ende geht es nicht um Fotos</h2>
            <div className="space-y-4 text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              <p>Es geht um Menschen.</p>
              <p>Um kleine Momente, die irgendwann große Bedeutung bekommen.</p>
              <p>Um Erinnerungen, die bleiben.</p>
              <p>Wir freuen uns darauf, eure Geschichte festzuhalten.</p>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/fotoshootings/"
                className="inline-flex items-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-purple-700 transition hover:bg-slate-100"
              >
                Jetzt Fotoshooting planen
              </Link>
              <Link
                to="/kontakt/"
                className="inline-flex items-center rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                <Phone className="mr-2 h-5 w-5" /> Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </section>
      </div>
      <PillarLinksBlock currentPath="/ueber-uns/" title="Unsere Fotoshootings in Wien entdecken" />
      <RelatedTopicsBlock pathname="/ueber-uns/" language="de" />
    </Layout>
  );
};

export default UeberUnsPage;
