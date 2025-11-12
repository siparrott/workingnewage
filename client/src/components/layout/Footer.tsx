import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, User, LogIn, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { submitNewsletterForm } from '../../lib/forms';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const [email, setEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await submitNewsletterForm(email.trim(), { consent: true, sourcePath: window.location.pathname });
      
      if (result.success) {
        setSubscribed(true);
        setEmail('');
        // Reset after 5 seconds to allow new signups
        setTimeout(() => setSubscribed(false), 5000);
      } else {
        throw new Error(result.message || 'Signup failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link 
              to="/" 
              onClick={scrollToTop}
              className="text-white text-xl font-bold mb-4 block"
            >
              New Age Fotografie
            </Link>
            <p className="text-gray-300 mb-4">
              Professionelle Fotografie in Wien. Wir halten Ihre schönsten Momente fest.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/newagefotografie" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com/newagefotografie" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Photography Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Fotoshootings</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/familien-fotoshooting-wien/" 
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Familien-Fotoshooting
                </Link>
              </li>
              <li>
                <Link 
                  to="/baby-fotografie-wien/" 
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Baby & Newborn
                </Link>
              </li>
              <li>
                <Link 
                  to="/schwangerschaftsfotos-wien/" 
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Schwangerschaftsfotos
                </Link>
              </li>
              <li>
                <Link 
                  to="/business-portrait-wien/" 
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Business Portrait
                </Link>
              </li>
              <li>
                <Link 
                  to="/fotoshootings/wedding" 
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Hochzeitsfotografie
                </Link>
              </li>
              <li>
                <Link 
                  to="/fotoshootings/event" 
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Eventfotografie
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support & Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support & Info</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/kontakt" 
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link 
                  to="/vouchers" 
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Gutscheine
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Blog & Tipps
                </Link>
              </li>
              <li>
                <Link 
                  to="/warteliste" 
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Warteliste
                </Link>
              </li>
              <li>
                <Link 
                  to="/galleries" 
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="text-sm">
                {t('contact.studioAddress')}
              </li>
              <li className="text-sm">
                {t('contact.addressNote')}
              </li>
              <li>
                <a 
                  href="https://wa.me/4367763399210" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm hover:text-purple-300 transition-colors"
                >
                  Tel/WhatsApp: +43 677 633 99210
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hallo@newagefotografie.com"
                  className="text-sm hover:text-purple-300 transition-colors"
                >
                  hallo@newagefotografie.com
                </a>
              </li>
              {user ? (
                <>
                  <li className="pt-2">
                    <Link 
                      to="/gallery" 
                      onClick={scrollToTop}
                      className="text-purple-400 hover:text-purple-300 transition-colors flex items-center text-sm"
                    >
                      <User size={16} className="mr-2" />
                      {t('nav.gallery')}
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => signOut()}
                      className="text-gray-300 hover:text-white transition-colors flex items-center text-sm"
                    >
                      <LogIn size={16} className="mr-2" />
                      {t('nav.logout')}
                    </button>
                  </li>
                </>
              ) : (
                <li className="pt-2">
                  <Link 
                    to="/gallery"
                    onClick={scrollToTop}
                    className="text-purple-400 hover:text-purple-300 transition-colors flex items-center text-sm"
                  >
                    <User size={16} className="mr-2" />
                    Client Login
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="md:col-span-2 lg:col-span-4 mt-8">
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">{t('newsletter.signup')}</h3>
              {subscribed ? (
                <div className="text-green-400 flex items-center">
                  <Mail className="mr-2" />
                  {t('newsletter.thanks')}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    required
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-600 text-white placeholder-gray-400 border border-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Wird gesendet...' : t('newsletter.button')}
                  </button>
                </form>
              )}
              {error && (
                <p className="mt-2 text-red-400 text-sm">{error}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 New Age Fotografie. Alle Rechte vorbehalten.</p>
          <p className="mt-2 text-sm">
            <a 
              href="https://www.togninja.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Powered By TogNinja
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;