
import React from 'react';
import { Video, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const VideoPlayer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" onClick={() => navigate('/videos')} className="flex items-center gap-2 text-slate-50">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-3">
          <Video className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-slate-50">Player de Vídeo</h1>
        </div>
      </div>
      
      <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
        <div className="text-center text-white">
          <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Player de vídeo será implementado aqui</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
