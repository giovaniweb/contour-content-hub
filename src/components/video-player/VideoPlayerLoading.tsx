
import React from 'react';
import Layout from '@/components/Layout';

export const VideoPlayerLoading: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Player de Vídeo</h1>
        </div>
        <div className="h-[70vh] w-full flex items-center justify-center bg-muted rounded-lg">
          <div className="animate-pulse">Carregando...</div>
        </div>
      </div>
    </Layout>
  );
};
