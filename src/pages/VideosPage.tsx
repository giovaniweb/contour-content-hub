
import React from 'react';
import { FeatureBanner } from '@/components/media-library/FeatureBanner';
import MediaActionCards from '@/components/media-library/MediaActionCards';
import Layout from '@/components/Layout';

const VideosPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-semibold">Vídeos em destaque</h1>
        <FeatureBanner />
        
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">Gerenciar Vídeos</h2>
          <MediaActionCards />
        </div>
      </div>
    </Layout>
  );
};

export default VideosPage;
