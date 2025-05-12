
import React from 'react';
import Layout from '@/components/Layout';

const VideoPlayer: React.FC = () => {
  return (
    <Layout title="Player de Vídeo">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Player de Vídeo</h1>
        {/* Video player content will be implemented here */}
        <p>Player de vídeo com controles avançados.</p>
      </div>
    </Layout>
  );
};

export default VideoPlayer;
