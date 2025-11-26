import { SEOHead } from '../../components/SEO/SEOHead';
import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Camera, ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useManualPageContent } from '../../hooks/useManualPageContent';

export default function SchwangerschaftsfotosWienPage() {
  const { t } = useLanguage();
  const tm = useManualPageContent('schwangerschaftsfotos');
  
  const fromManual = (key: string, fallback: string) => {
    const value = tm(key);
    if (!value || value === key) {
      return fallback;
    }
    return value;
  };

  const heroTitle = fromManual('manual.schwangerschaftsfotos.heroTitle', t('maternity.hero.title'));
  const heroSubtitle = fromManual('manual.schwangerschaftsfotos.heroTagline', '');
  const heroDescription = fromManual('manual.schwangerschaftsfotos.heroDescription', t('maternity.hero.description'));
  const primaryCta = fromManual('manual.schwangerschaftsfotos.primaryCta', t('maternity.hero.bookButton'));
  const secondaryCta = fromManual('manual.schwangerschaftsfotos.secondaryCta', t('maternity.hero.voucherButton'));
  const heroImage1 = fromManual('manual.schwangerschaftsfotos.heroImage1', '/images/maternity-hero.jpg');
  const heroImage2 = fromManual('manual.schwangerschaftsfotos.heroImage2', '/images/maternity-2.jpg');
  const heroImage3 = fromManual('manual.schwangerschaftsfotos.heroImage3', '/images/maternity-3.jpg');
  const heroImage4 = fromManual('manual.schwangerschaftsfotos.heroImage4', '/images/maternity-4.jpg');
  const heroImage5 = fromManual('manual.schwangerschaftsfotos.heroImage5', '/images/maternity-5.jpg');
  
  return (
    <Layout>
    <div className="min-h-screen bg-white">
      <SEOHead
        title={t('maternity.seo.title')}
        description={t('maternity.seo.description')}
        keywords={t('maternity.seo.keywords')}
        canonical="/schwangerschaftsfotos-wien/"
        ogImage="https://www.newagefotografie.com/images/maternity-hero.jpg"
        hreflang={[
          { lang: 'de', url: '/schwangerschaftsfotos-wien/' },
          { lang: 'en', url: '/en/maternity-photography-vienna/' }
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {heroTitle}
              </h1>
              {heroSubtitle && (
                <p className="text-xl text-gray-700 mb-4 leading-relaxed font-semibold">
                  {heroSubtitle}
                </p>
              )}
              <p className="text-xl text-gray-600 mb-8">
                {heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/termin-planen"
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  {primaryCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/gutschein/maternity"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
                >
                  {secondaryCta}
                </Link>
              </div>
            </div>
            {/* Right: Hero Images Grid (5 images total) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <img src={heroImage1} alt="Schwangere Frau beim Babybauch Fotoshooting in Wien" className="rounded-2xl shadow-2xl w-full h-auto object-contain" loading="eager" />
              </div>
              <div className="col-span-2">
                <img src={heroImage2} alt="Schwangerschaftsfotos Studio Wien" className="rounded-xl shadow-lg w-full h-auto object-contain" loading="eager" />
              </div>
              <div className="col-span-2">
                <img src={heroImage3} alt="Babybauch Shooting Wien" className="rounded-xl shadow-lg w-full h-auto object-contain" loading="eager" />
              </div>
              <div className="col-span-2">
                <img src={heroImage4} alt="Maternity Fotografie Wien" className="rounded-xl shadow-lg w-full h-auto object-contain" loading="eager" />
              </div>
              <div className="col-span-2">
                <img src={heroImage5} alt="Schwangerschaftsfotos Outdoor Wien" className="rounded-xl shadow-lg w-full h-auto object-contain" loading="eager" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('maternity.features.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('maternity.features.unique.title')}</h3>
              <p className="text-gray-600">
                {t('maternity.features.unique.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('maternity.features.natural.title')}</h3>
              <p className="text-gray-600">
                {t('maternity.features.natural.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Camera className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('maternity.features.flexible.title')}</h3>
              <p className="text-gray-600">
                {t('maternity.features.flexible.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Time Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t('maternity.timing.title')}
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            {t('maternity.timing.description')}
          </p>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="font-semibold text-xl mb-4">{t('maternity.timing.proTipTitle')}</h3>
            <p className="text-gray-600">
              {t('maternity.timing.proTip')}
            </p>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('maternity.packages.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Studio Package */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-4">{t('maternity.packages.studio.title')}</h3>
              <div className="text-3xl font-bold text-purple-600 mb-6">
                {t('maternity.packages.studio.price')}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.studio.feature1')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.studio.feature2')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.studio.feature3')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.studio.feature4')}</span>
                </li>
              </ul>
              <Link
                to="/termin-planen"
                className="block text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                {t('maternity.packages.studio.button')}
              </Link>
            </div>

            {/* Premium Package */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl shadow-2xl p-8 transform scale-105">
              <div className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                {t('maternity.packages.premium.badge')}
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('maternity.packages.premium.title')}</h3>
              <div className="text-3xl font-bold mb-6">
                {t('maternity.packages.premium.price')}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.premium.feature1')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.premium.feature2')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.premium.feature3')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.premium.feature4')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.premium.feature5')}</span>
                </li>
              </ul>
              <Link
                to="/termin-planen"
                className="block text-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                {t('maternity.packages.premium.button')}
              </Link>
            </div>

            {/* Outdoor Package */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-4">{t('maternity.packages.outdoor.title')}</h3>
              <div className="text-3xl font-bold text-purple-600 mb-6">
                {t('maternity.packages.outdoor.price')}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.outdoor.feature1')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.outdoor.feature2')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.outdoor.feature3')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t('maternity.packages.outdoor.feature4')}</span>
                </li>
              </ul>
              <Link
                to="/termin-planen"
                className="block text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                {t('maternity.packages.outdoor.button')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What to Wear Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('maternity.clothing.title')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">{t('maternity.clothing.forYou.title')}</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• {t('maternity.clothing.forYou.item1')}</li>
                <li>• {t('maternity.clothing.forYou.item2')}</li>
                <li>• {t('maternity.clothing.forYou.item3')}</li>
                <li>• {t('maternity.clothing.forYou.item4')}</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">{t('maternity.clothing.forPartner.title')}</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• {t('maternity.clothing.forPartner.item1')}</li>
                <li>• {t('maternity.clothing.forPartner.item2')}</li>
                <li>• {t('maternity.clothing.forPartner.item3')}</li>
                <li>• {t('maternity.clothing.forPartner.item4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">{t('maternity.related.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/baby-fotografie-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{t('maternity.related.newborn.title')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('maternity.related.newborn.description')}
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                {t('maternity.related.newborn.link')} <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/familien-fotoshooting-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{t('maternity.related.family.title')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('maternity.related.family.description')}
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                {t('maternity.related.family.link')} <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/paar-fotoshooting-wien/"
              className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{t('maternity.related.couple.title')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('maternity.related.couple.description')}
              </p>
              <span className="text-purple-600 font-semibold flex items-center">
                {t('maternity.related.couple.link')} <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('maternity.cta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('maternity.cta.description')}
          </p>
          <Link
            to="/termin-planen"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            {t('maternity.cta.button')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

    </div>
    </Layout>
  );
}
