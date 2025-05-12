
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-semibold">Visualização de Vídeo</h1>
        <div className="mt-6 aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
          {/* Video player will be implemented here */}
          <p className="text-xl text-gray-500">Player de vídeo ID: {id}</p>
        </div>
      </div>
    </Layout>
  );
};

export default VideoPlayer;
