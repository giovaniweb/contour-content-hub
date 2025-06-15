
// Substituir Layout legado por AppLayout
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';

export const VideoPlayerEmpty: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Player de Vídeo</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
        </div>
        <div className="h-[70vh] w-full flex items-center justify-center bg-muted rounded-lg">
          <div className="text-center">
            <p className="text-xl font-medium mb-4">Nenhum vídeo encontrado</p>
            <Button variant="default" onClick={() => window.history.back()}>
              Voltar para a galeria
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
