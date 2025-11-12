import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fotoshootingsOpen, setFotoshootingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavClick = (path: string) => {
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fotoshootingItems = [
    { path: '/familien-fotoshooting-wien/', label: 'Familie' },
    { path: '/baby-fotografie-wien/', label: 'Baby & Newborn' },
    { path: '/schwangerschaftsfotos-wien/', label: 'Schwangerschaft' },
    { path: '/kinder-fotografie-wien/', label: 'Kinder' },
    { path: '/portrait-fotografie-wien/', label: 'Portrait' },
    { path: '/business-portrait-wien/', label: 'Business Portrait' },
    { path: '/fotoshootings/wedding', label: 'Hochzeit' },
    { path: '/fotoshootings/event', label: 'Event' },
  ];

  const aboutItems = [
    { path: '/ueber-uns/', label: 'Über uns' },
    { path: '/kontakt', label: t('nav.contact') },
  ];

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/vouchers', label: t('nav.vouchers') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/warteliste', label: t('nav.waitlist') },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/frontend-logo.jpg" 
            alt="New Age Fotografie"
            className="h-24 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`text-gray-700 hover:text-purple-600 transition-colors ${
                isActive(item.path) ? 'text-purple-600 font-semibold' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Fotoshootings Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setFotoshootingsOpen(true)}
            onMouseLeave={() => setFotoshootingsOpen(false)}
          >
            <button className="text-gray-700 hover:text-purple-600 transition-colors flex items-center">
              {t('nav.photoshoots')}
              <ChevronDown size={16} className="ml-1" />
            </button>
            {fotoshootingsOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50">
                {fotoshootingItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors ${
                      isActive(item.path) ? 'text-purple-600 font-semibold bg-purple-50' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* About Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button className="text-gray-700 hover:text-purple-600 transition-colors flex items-center">
              Über Uns
              <ChevronDown size={16} className="ml-1" />
            </button>
            {aboutOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                {aboutItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors ${
                      isActive(item.path) ? 'text-purple-600 font-semibold bg-purple-50' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={toggleLanguage}
            className="text-gray-700 hover:text-purple-600 transition-colors flex items-center"
            aria-label="Toggle language"
          >
            <Globe size={18} className="mr-1" />
            <span className="uppercase">{language}</span>
          </button>
          

        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none" 
          onClick={toggleMenu}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-2 flex flex-col">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`py-2 text-gray-700 hover:text-purple-600 transition-colors ${
                  isActive(item.path) ? 'text-purple-600 font-semibold' : ''
                }`}
                onClick={() => {
                  handleNavClick(item.path);
                  setMenuOpen(false);
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Fotoshootings Submenu */}
            <div className="py-2">
              <button
                onClick={() => setFotoshootingsOpen(!fotoshootingsOpen)}
                className="w-full text-left text-gray-700 hover:text-purple-600 transition-colors flex items-center justify-between"
              >
                {t('nav.photoshoots')}
                <ChevronDown size={16} className={`transition-transform ${fotoshootingsOpen ? 'rotate-180' : ''}`} />
              </button>
              {fotoshootingsOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  {fotoshootingItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block py-1 text-gray-600 hover:text-purple-600 transition-colors ${
                        isActive(item.path) ? 'text-purple-600 font-semibold' : ''
                      }`}
                      onClick={() => {
                        handleNavClick(item.path);
                        setMenuOpen(false);
                        setFotoshootingsOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile About Submenu */}
            <div className="py-2">
              <button
                onClick={() => setAboutOpen(!aboutOpen)}
                className="w-full text-left text-gray-700 hover:text-purple-600 transition-colors flex items-center justify-between"
              >
                Über Uns
                <ChevronDown size={16} className={`transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {aboutOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  {aboutItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block py-1 text-gray-600 hover:text-purple-600 transition-colors ${
                        isActive(item.path) ? 'text-purple-600 font-semibold' : ''
                      }`}
                      onClick={() => {
                        handleNavClick(item.path);
                        setMenuOpen(false);
                        setAboutOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                toggleLanguage();
                setMenuOpen(false);
              }}
              className="py-2 text-left text-gray-700 hover:text-purple-600 transition-colors flex items-center"
            >
              <Globe size={18} className="mr-1" />
              <span className="uppercase">{language}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;