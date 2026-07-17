import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { SEOHead } from '../components/SEO/SEOHead';
import GoogleReviews from '../components/layout/GoogleReviews';
import { useLanguage } from '../context/LanguageContext';
import { Star, Users, HelpCircle, BookOpen, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

/**
 * Trust-hub pillar page (July 2026 SEO audit: "Vertrauen & Social Proof" had
 * no unified destination). Gives undecided prospects ONE page that ties
 * together reviews, FAQ, about-us, case studies and guarantees.
 * NOTE: deliberately NO self-serving aggregateRating JSON-LD — review markup
 * about one's own business violates Google's structured-data guidelines.
 */
export default function WarumNewAgePage() {
  const { language } = useLanguage();
  const de = language === 'de';

  const proofs = [
    {
      icon: Star,
      title: de ? '4,9★ auf Google' : '4.9★ on Google',
      desc: de ? 'Über 250 echte Bewertungen von Wiener Familien und Unternehmen.' : 'Over 250 real reviews from Viennese families and businesses.',
      to: '/kundenstimmen/',
      cta: de ? 'Kundenstimmen lesen' : 'Read testimonials',
    },
    {
      icon: Users,
      title: de ? 'Seit 2012 in Wien' : 'In Vienna since 2012',
      desc: de ? '13+ Jahre, hunderte Shootings pro Jahr — lernen Sie das Team kennen.' : '13+ years, hundreds of shoots per year — meet the team.',
      to: '/ueber-uns/',
      cta: de ? 'Über uns' : 'About us',
    },
    {
      icon: BookOpen,
      title: de ? 'Echte Fallstudien' : 'Real case studies',
      desc: de ? 'Wie Shootings bei uns wirklich ablaufen — von der Anfrage bis zum Wandbild.' : 'How our shoots actually run — from enquiry to wall art.',
      to: '/blog',
      cta: de ? 'Zum Blog' : 'To the blog',
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      desc: de ? 'Preise, Ablauf, Outfits, Lieferzeiten — die häufigsten Fragen, ehrlich beantwortet.' : 'Pricing, process, outfits, delivery — the most common questions answered honestly.',
      to: '/faq/',
      cta: de ? 'Fragen ansehen' : 'View FAQ',
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <SEOHead
          title="Warum New Age Fotografie? Bewertungen, Erfahrung & Team | Fotostudio Wien"
          description="Alles, was Sie vor der Buchung wissen wollen: 4,9★ Google-Bewertungen, 13+ Jahre Erfahrung, echte Fallstudien, FAQ und das Team hinter New Age Fotografie Wien."
          keywords="new age fotografie erfahrungen, fotograf wien bewertungen, fotostudio wien empfehlung"
          canonical="/warum-new-age-fotografie/"
        />

        {/* Hero */}
        <section className="relative bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 text-white pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {de ? 'Warum New Age Fotografie?' : 'Why New Age Fotografie?'}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {de
                ? 'Ein Fotoshooting ist Vertrauenssache. Hier ist alles an einem Ort, was Ihnen die Entscheidung leicht macht — echte Bewertungen, unser Team, Fallstudien und ehrliche Antworten.'
                : 'A photoshoot is a matter of trust. Everything that makes the decision easy, in one place — real reviews, our team, case studies and honest answers.'}
            </p>
          </div>
        </section>

        <GoogleReviews />

        {/* Proof grid */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {proofs.map((p) => (
                <Link key={p.to} to={p.to} className="block bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100">
                  <p.icon className="h-10 w-10 text-purple-600 mb-4" />
                  <h2 className="font-semibold text-xl mb-2 text-gray-900">{p.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">{p.desc}</p>
                  <span className="text-purple-600 font-semibold flex items-center text-sm">
                    {p.cta} <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantees (German) */}
        {de && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-purple-600" /> Woran Sie uns messen können
              </h2>
              <ul className="space-y-4 text-gray-700">
                <li><strong>Wohlfühlen zuerst.</strong> „Ich bin unfotogen" hören wir jede Woche — und widerlegen es jede Woche. Die ersten Minuten jedes Shootings investieren wir in Atmosphäre, nicht in Technik.</li>
                <li><strong>Ehrliche Beratung.</strong> Wir empfehlen das kleinere Paket, wenn es reicht — nachzulesen in den <Link to="/kundenstimmen/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">Bewertungen</Link>.</li>
                <li><strong>Transparente Preise.</strong> Alle Pakete offen auf der <Link to="/preise/" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">Preisseite</Link> — keine versteckten Kosten.</li>
                <li><strong>Sichere Bilder.</strong> Dual-Card-Aufnahme, redundante Backups, passwortgeschützte Online-Galerie.</li>
              </ul>
              <p className="mt-8 text-gray-700 flex items-start gap-2">
                <MapPin className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Sie finden uns zentral in 1050 Wien, Ecke Schönbrunnerstraße (U4 Kettenbrückengasse) — <Link to="/kontakt" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">Kontakt & Anfahrt</Link>.</span>
              </p>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-purple-700 to-purple-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">{de ? 'Überzeugt? Dann lernen wir uns kennen.' : 'Convinced? Let’s meet.'}</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kontakt" className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg">
                {de ? 'Termin anfragen' : 'Request a session'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/portfolio" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg">
                {de ? 'Portfolio ansehen' : 'View portfolio'}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
