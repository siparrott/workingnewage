import React from 'react';
import Layout from '../components/layout/Layout';
import { SEOHead } from '../components/SEO/SEOHead';

const CalculatorPage: React.FC = () => {
  return (
    <Layout>
      <SEOHead
        title="Calculator | New Age Fotografie"
        description="Use our photography pricing calculator to estimate costs for your next photoshoot."
        keywords="calculator, photography pricing, cost estimate"
        canonical="/calculator"
      />

      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-8">Calculator</h1>
          <div className="qk-widget" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <iframe
              src="https://pricingembed.com/embed/embed_ai_1772535371344_q0lkcwv9x"
              width="100%"
              height="600"
              frameBorder="0"
              style={{ border: 'none', borderRadius: '12px' }}
              title="Photography Calculator"
            />
            <div className="qk-credit" style={{ textAlign: 'center', padding: '8px 0', fontSize: '13px', fontFamily: 'sans-serif', opacity: 0.7 }}>
              <a href="https://pricingembed.com" target="_blank" rel="noopener"
                style={{ color: '#22C55E', textDecoration: 'none' }}>
                ⚡ Powered by PricingEmbed
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalculatorPage;
