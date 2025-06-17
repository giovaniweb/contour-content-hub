
import React, { useState } from 'react';
import { Video, Upload, Grid, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserVideos } from '@/hooks/useUserVideos';
import UserVideoGrid from '@/components/video-storage/UserVideoGrid';
import UserVideoPlayer from '@/components/video-storage/UserVideoPlayer';

const VideosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  
  const { videos, isLoading, error, loadVideos } = useUserVideos();

  const handleVideoPlay = (video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  if (error) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Video className="h-12 w-12 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Biblioteca de Vídeos</h1>
              <p className="text-slate-400">Erro ao carregar vídeos</p>
            </div>
          </div>
        </div>
        
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={loadVideos}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Video className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Biblioteca de Vídeos</h1>
            <p className="text-slate-400">Gerencie e assista seus vídeos</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar vídeos..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Enviar Vídeo
        </Button>
      </div>

      {/* Video Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-300">Carregando vídeos...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2 text-slate-50">Nenhum vídeo encontrado</h3>
          <p className="text-slate-400 mb-4">Comece enviando seus primeiros vídeos</p>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Enviar Primeiro Vídeo
          </Button>
        </div>
      ) : (
        <UserVideoGrid
          videos={videos}
          onVideoPlay={handleVideoPlay}
          isLoading={isLoading}
        />
      )}

      {/* Video Player Modal */}
      <UserVideoPlayer
        video={selectedVideo}
        open={isPlayerOpen}
        onOpenChange={setIsPlayerOpen}
      />
    </div>
  );
};

export default VideosPage;
