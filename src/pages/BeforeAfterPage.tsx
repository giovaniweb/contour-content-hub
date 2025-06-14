
import React from 'react';
import Layout from '@/components/Layout';
import BeforeAfterManager from '@/components/before-after/BeforeAfterManager';

const BeforeAfterPage: React.FC = () => {
  return (
    <Layout title="Antes & Depois">
      <div className="container-fluid max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            📸 Galeria Antes & Depois
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Documente e compartilhe os resultados dos seus tratamentos estéticos.
          </p>
        </div>
        
        <BeforeAfterManager />
      </div>
    </Layout>
  );
};

export default BeforeAfterPage;
