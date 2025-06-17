
import React, { useState } from 'react';
import { Video, Grid, Search, Filter, Upload, Camera } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
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

  console.log('📊 Estado dos vídeos:', { 
    videosCount: videos.length, 
    isLoading, 
    error 
  });

  const handleVideoPlay = (video) => {
    console.log('🎬 Reproduzindo vídeo:', video.titulo);
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
            <p className="text-slate-400">Gerencie e organize seus vídeos</p>
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
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Gravar Vídeo
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Enviar Vídeos
          </Button>
        </div>
      </div>

      {/* Video Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-300">Carregando vídeos...</p>
        </div>
      ) : videos.length === 0 ? (
        <EmptyState
          icon={Video}
          title="Nenhum vídeo encontrado"
          description="Comece enviando seus primeiros vídeos"
          actionLabel="Enviar Primeiro Vídeo"
          actionIcon={Upload}
          onAction={() => console.log('Upload video')}
        />
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
