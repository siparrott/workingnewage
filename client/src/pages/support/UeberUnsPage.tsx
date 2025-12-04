import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, Heart, Award, Users, MapPin, Clock, Star, Phone, 
  CheckCircle, ExternalLink, Lightbulb, TrendingUp, Eye, Film
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { SEOHead } from '../../components/SEO/SEOHead';
import { useLanguage } from '../../context/LanguageContext';

const UeberUnsPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <SEOHead
        title="About New Age Fotografie Vienna | Founder Story, Style & Credentials"
        description="Learn how New Age Fotografie grew from film-era portraits in England to a Vienna studio trusted for families, newborns, maternity, weddings & corporate shoots. Founder-led. Real experience. Clear results."
        canonical="/ueber-uns/"
      />

      {/* Schema.org LocalBusiness structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "New Age Fotografie",
          "description": "Vienna portrait studio for family, newborn, maternity, weddings and corporate photography. Founder-led, film-era craft with modern studio precision.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Wien",
            "addressCountry": "AT"
          },
          "areaServed": "Vienna, Austria",
          "url": "https://www.newagefotografie.com",
          "sameAs": [
            "https://www.capetowncarnival.com/",
            "https://eurovision.tv/event/vienna-2015"
          ],
          "founder": {
            "@type": "Person",
            "name": "Matt",
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
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              {t('about.hero.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/warteliste"
                className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
              >
                <TrendingUp className="w-5 h-5" />
                {t('about.hero.cta')}
              </Link>
            </div>
          </div>
        </section>

        {/* Story Timeline */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">{t('about.story.title')}</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl">
              {t('about.story.intro')}
            </p>

            {/* Timeline Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">{t('about.timeline.year')}</th>
                    <th className="px-6 py-4 text-left font-semibold">{t('about.timeline.where')}</th>
                    <th className="px-6 py-4 text-left font-semibold">{t('about.timeline.what')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{t('about.timeline.predigital')}</td>
                    <td className="px-6 py-4 text-gray-700">{t('about.timeline.predigital.where')}</td>
                    <td className="px-6 py-4 text-gray-700">{t('about.timeline.predigital.what')}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{t('about.timeline.earlycareer')}</td>
                    <td className="px-6 py-4 text-gray-700">{t('about.timeline.earlycareer.where')}</td>
                    <td className="px-6 py-4 text-gray-700">{t('about.timeline.earlycareer.what')}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">2003</td>
                    <td className="px-6 py-4 text-gray-700">{t('about.timeline.2003.where')}</td>
                    <td className="px-6 py-4 text-gray-700">{t('about.timeline.2003.what')}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">2004</td>
                    <td className="px-6 py-4 text-gray-700">{t('about.timeline.2004.where')}</td>
                    <td className="px-6 py-4 text-gray-700">{t('about.timeline.2004.what')}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">2012</td>
                    <td className="px-6 py-4 text-gray-700">{t('about.timeline.2012.where')}</td>
                    <td className="px-6 py-4 text-gray-700">{t('about.timeline.2012.what')}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{t('about.timeline.since')}</td>
                    <td className="px-6 py-4 text-gray-700">{t('about.timeline.since.where')}</td>
                    <td className="px-6 py-4 text-gray-700">{t('about.timeline.since.what')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* External Press Note */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-700">
                <strong>External press note:</strong> {t('about.press.note')}{' '}
                <a 
                  href="https://www.capetowncarnival.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  {t('about.press.capetown')} <ExternalLink className="w-4 h-4" />
                </a>
                {' '}{t('about.press.and')}{' '}
                <a 
                  href="https://eurovision.tv/event/vienna-2015" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  {t('about.press.eurovision')} <ExternalLink className="w-4 h-4" />
                </a>.
              </p>
            </div>
          </div>
        </section>

        {/* What We Believe */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">{t('about.believe.title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-600">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('about.believe.people.title')}</h3>
                <p className="text-gray-700">{t('about.believe.people.desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('about.believe.light.title')}</h3>
                <p className="text-gray-700">{t('about.believe.light.desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-pink-600">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('about.believe.simple.title')}</h3>
                <p className="text-gray-700">{t('about.believe.simple.desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-600">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('about.believe.consistency.title')}</h3>
                <p className="text-gray-700">{t('about.believe.consistency.desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-600">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('about.believe.speed.title')}</h3>
                <p className="text-gray-700">{t('about.believe.speed.desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Photograph */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">{t('about.photograph.title')}</h2>
            <p className="text-lg text-gray-600 mb-12">{t('about.photograph.subtitle')}</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-gray-200">
                <Camera className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{t('about.photograph.family')}</h3>
                <p className="text-gray-600">{t('about.photograph.family.desc')}</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-xl border border-gray-200">
                <Heart className="w-10 h-10 text-pink-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{t('about.photograph.newborn')}</h3>
                <p className="text-gray-600">{t('about.photograph.newborn.desc')}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-gray-200">
                <Users className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{t('about.photograph.portraits')}</h3>
                <p className="text-gray-600">{t('about.photograph.portraits.desc')}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-gray-200">
                <Film className="w-10 h-10 text-orange-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{t('about.photograph.weddings')}</h3>
                <p className="text-gray-600">{t('about.photograph.weddings.desc')}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-gray-200">
                <Award className="w-10 h-10 text-green-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{t('about.photograph.corporate')}</h3>
                <p className="text-gray-600">{t('about.photograph.corporate.desc')}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-gray-200">
                <Eye className="w-10 h-10 text-yellow-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{t('about.photograph.products')}</h3>
                <p className="text-gray-600">{t('about.photograph.products.desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Look Table */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">Our Look, in one table</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Look</th>
                    <th className="px-6 py-4 text-left font-semibold">Where it shines</th>
                    <th className="px-6 py-4 text-left font-semibold">Lighting & set</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Clean editorial</td>
                    <td className="px-6 py-4 text-gray-700">Headshots, teams, brand PR</td>
                    <td className="px-6 py-4 text-gray-600">90–105 cm soft source, subtle negative fill</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Warm lifestyle</td>
                    <td className="px-6 py-4 text-gray-700">Families, couples</td>
                    <td className="px-6 py-4 text-gray-600">Large key + bounce, layered background</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Studio classic</td>
                    <td className="px-6 py-4 text-gray-700">Timeless portraits</td>
                    <td className="px-6 py-4 text-gray-600">Mid-grey or pure white, controlled ratios</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Dramatic low-key</td>
                    <td className="px-6 py-4 text-gray-700">Musicians, fashion, athletes</td>
                    <td className="px-6 py-4 text-gray-600">Gridded strip + rim, minimal fill</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">Credentials at a glance</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Camera, text: "Film-era foundations → fast, accurate exposure and color discipline" },
                { icon: Users, text: "High-street volume → calm, efficient sessions for every age and stage" },
                { icon: Star, text: "Fashion agency → styling instincts and posing nuance" },
                { icon: MapPin, text: "Global events → pressure-proof delivery and logistics" },
                { icon: Award, text: "Vienna studio → repeatable quality, rain or shine" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <item.icon className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How a session feels */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">How a session feels</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { num: "1", title: "Plan", desc: "You share goals, outfits, and where the images will live." },
                { num: "2", title: "Light test", desc: "We dial your best angles and the right contrast." },
                { num: "3", title: "Shoot", desc: "Clear, friendly direction. Natural expression wins." },
                { num: "4", title: "Select", desc: "You mark favorites; we advise on crops and usage." },
                { num: "5", title: "Deliver", desc: "Retouched files, sized for print and web, on time." }
              ].map((step) => (
                <div key={step.num} className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-gray-600">
              <strong>Turnarounds:</strong> Preview in 48–72 h. Final gallery in 1–2 weeks (weddings per agreement).
            </p>
          </div>
        </section>

        {/* Trusted for */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-8 text-center">Trusted for moments that matter</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <CheckCircle className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <p className="text-lg">Eurovision Vienna • UEFA / Champions League • Euro finals</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <CheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <p className="text-lg">Corporate brand launches and conferences across AT & EU</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <CheckCircle className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                <p className="text-lg">Weddings and elopements from England to Malta, South Africa to Austria</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">FAQs (quick answers)</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Where are you based?",
                  a: "Vienna city. Studio sessions near the center with easy access and parking tips in your confirmation."
                },
                {
                  q: "Do you offer both studio and outdoor?",
                  a: "Yes. Studio for control. Outdoor for mood. We plan around light and weather."
                },
                {
                  q: "How do we book?",
                  a: "Tell us your dates and goal. We send a plan, price, and a simple contract. Or add your name to our Warteliste if you need the next available slot.",
                  link: "/warteliste"
                },
                {
                  q: "Do you travel?",
                  a: "Yes. Across Austria and the EU. Travel fees are transparent and agreed up front."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{faq.q}</h3>
                  <p className="text-gray-700">
                    {faq.a}
                    {faq.link && (
                      <>
                        {' '}
                        <Link to={faq.link} className="text-purple-600 hover:underline font-medium">
                          Warteliste →
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tone & Ethics */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Tone, ethics, and quality</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                We edit lightly. Skin looks like skin. Color stays true.
              </p>
              <p className="text-gray-700 mb-4">
                We never over-promise. We always deliver what we show.
              </p>
              <p className="text-gray-700">
                Consent and privacy matter—especially for kids and corporate clients.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">{t('about.cta.title')}</h2>
            <p className="text-xl mb-8">
              {t('about.cta.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/warteliste"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
              >
                <TrendingUp className="w-5 h-5" />
                {t('about.cta.waitlist')}
              </Link>
              <Link
                to="/kontakt"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {t('about.cta.contact')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default UeberUnsPage;
