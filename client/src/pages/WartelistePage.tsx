import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Calendar, Mail, Phone, User, Camera, Gift, ChevronRight } from 'lucide-react';
import { submitWaitlistForm } from '../lib/forms';
import { useManualPageContent } from '../hooks/useManualPageContent';
import { SEOHead } from '../components/SEO/SEOHead';

const WartelistePage: React.FC = () => {
  const t = useManualPageContent('waitlist');
  const [formData, setFormData] = useState({
    fullName: '',
    preferredDate: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await submitWaitlistForm(formData);
      setSuccess(true);
      setFormData({ fullName: '', preferredDate: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
      <SEOHead
        title="Warteliste für Fotoshootings | New Age Fotografie"
        description="Tragen Sie sich auf unsere Warteliste ein und erfahren Sie als Erste/r von freien Terminen und Aktionen."
        keywords="Warteliste Fotoshooting, Termin Fotograf Wien, Benachrichtigung"
        canonical="/warteliste"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-600 mb-4">
            {t('waitlist.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('waitlist.subtitle')}
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {t('waitlist.successMessage')}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <User size={18} className="mr-2 text-purple-600" />
                {t('waitlist.fullName')} <span className="text-purple-600 ml-1">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors"
                placeholder={t('waitlist.fullNamePlaceholder')}
              />
            </div>

            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <Calendar size={18} className="mr-2 text-purple-600" />
                {t('waitlist.preferredDate')} <span className="text-purple-600 ml-1">*</span>
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <Mail size={18} className="mr-2 text-purple-600" />
                {t('waitlist.email')} <span className="text-purple-600 ml-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors"
                placeholder={t('waitlist.emailPlaceholder')}
              />
            </div>

            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <Phone size={18} className="mr-2 text-purple-600" />
                {t('waitlist.phone')} <span className="text-purple-600 ml-1">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors"
                placeholder="+43 "
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {t('waitlist.message')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors"
                placeholder={t('waitlist.messagePlaceholder')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? t('waitlist.submitting') : t('waitlist.submit')}
            </button>

            <p className="text-sm text-gray-500 text-center">
              <span className="text-purple-600">*</span> Pflichtfelder
            </p>
          </form>
        </div>

        {/* Services Sidebar/Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Während Sie warten - Entdecken Sie unsere Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/fotoshooting/familienfotos-wien/" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center group">
              <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 group-hover:text-purple-600">Familienfotos</h3>
            </Link>
            <Link to="/fotoshooting/neugeborenenfotos-wien/" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center group">
              <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 group-hover:text-purple-600">Neugeborene</h3>
            </Link>
            <Link to="/fotoshooting/schwangerschaftsfotos-wien/" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center group">
              <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 group-hover:text-purple-600">Schwangerschaft</h3>
            </Link>
            <Link to="/gutscheine" className="bg-purple-600 text-white p-4 rounded-lg shadow hover:bg-purple-700 transition-colors text-center">
              <Gift className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-medium">Gutscheine</h3>
            </Link>
          </div>
          <p className="text-center text-gray-600 mt-6">
            <Link to="/blog" className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center">
              Lesen Sie unseren Blog für Fotografie-Tipps <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default WartelistePage;