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
          <div className="flex justify-center">
            <iframe
              src="https://quotekits.com/embed/embed_portrait-photography-modern_1771847326845_wiwq9drsp"
              width="800"
              height="600"
              frameBorder="0"
              style={{ maxWidth: '100%', border: 'none' }}
              title="Photography Calculator"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalculatorPage;
