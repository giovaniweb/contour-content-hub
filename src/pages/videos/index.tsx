
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import UserVideoGrid from '@/components/video-storage/UserVideoGrid';
import UserVideoPlayer from '@/components/video-storage/UserVideoPlayer';
import { useUserVideos } from '@/hooks/useUserVideos';

interface Video {
  id: string;
  titulo: string;
  descricao_curta?: string;
  descricao_detalhada?: string;
  thumbnail_url?: string;
  url_video?: string;
  categoria?: string;
  tags?: string[];
  downloads_count?: number;
  data_upload: string;
  duracao?: string;
}

const VideosPage: React.FC = () => {
  const { videos, isLoading, error, loadVideos } = useUserVideos();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  
  const handleVideoPlay = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };
  
  const handleClosePlayer = () => {
    setSelectedVideo(null);
    setIsPlayerOpen(false);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Video className="h-12 w-12 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Biblioteca de Vídeos</h1>
              <p className="text-slate-400">Explore nossa coleção de vídeos educativos</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {isLoading ? '--' : videos.length}
              </div>
              <div className="text-sm text-muted-foreground">Vídeos Disponíveis</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {isLoading ? '--' : [...new Set(videos.map(v => v.categoria).filter(Boolean))].length}
              </div>
              <div className="text-sm text-muted-foreground">Categorias</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {isLoading ? '--' : videos.reduce((total, video) => total + (video.downloads_count || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Downloads</div>
            </CardContent>
          </Card>
        </div>

        {/* Error state */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadVideos} variant="outline">
                <Loader2 className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Vídeos
              </CardTitle>
              
              <Link to={ROUTES.VIDEOS.STORAGE}>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Fazer Upload
                </Button>
              </Link>
            </div>
          </CardHeader>
          
          <CardContent>
            <UserVideoGrid
              videos={videos}
              onVideoPlay={handleVideoPlay}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Video Player */}
        <UserVideoPlayer
          video={selectedVideo}
          open={isPlayerOpen}
          onOpenChange={setIsPlayerOpen}
        />
      </div>
    </AppLayout>
  );
};

export default VideosPage;
