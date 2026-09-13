import React, { ReactNode } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
import PartnerLogos from './PartnerLogos';
import GoogleReviews from './GoogleReviews';
import WhatsAppButton from '../WhatsAppButton';
import ExitIntentPopup from '../ExitIntentPopup';
import RelatedPages from '../SEO/RelatedPages';

interface LayoutProps {
  children: ReactNode;
  /**
   * Reviews and the partner logo wall render here, after the page's own content, on EVERY
   * page. Both default to shown, so nothing changes anywhere unless a page opts out.
   *
   * WHY A PAGE WOULD OPT OUT. The homepage needs its reviews partway down — after the work and
   * the prices, before the objections — rather than in the run-up to the footer, and a page
   * cannot move a component its layout renders. So it turns this one off and places its own.
   * Rendering both is the duplicate-testimonials problem HomePage already carries a comment
   * about; this is the switch that makes moving them possible without it.
   */
  showReviews?: boolean;
  /**
   * The corporate logo wall — Erste Bank, REMAX, Mattel, Canon and the rest. Real proof, and
   * the wrong proof on a page a parent arrives at looking for family portraits. It stays on
   * every other page, business photography included, where it is exactly the right argument.
   */
  showPartnerLogos?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showReviews = true, showPartnerLogos = true }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen" style={{ position: 'static', overflow: 'visible' }}>
      <Header />
      <Breadcrumbs />
      <main className="flex-grow" style={{ position: 'static', overflow: 'visible' }}>
        {children}
      </main>
      <RelatedPages />
      {showReviews && <GoogleReviews />}
      {showPartnerLogos && <PartnerLogos />}
      <Footer />
      <WhatsAppButton />
      <ExitIntentPopup />
    </div>
  );
};

export default Layout;