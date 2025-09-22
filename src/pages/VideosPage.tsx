
import React, { useState } from 'react';
import { Video, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserVideos } from '@/hooks/useUserVideos';
import UserVideoGrid from '@/components/video-storage/UserVideoGrid';
import UserVideoPlayer from '@/components/video-storage/UserVideoPlayer';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import SearchAndFilters from '@/components/layout/SearchAndFilters';
import { Pagination } from '@/components/ui/pagination';

const VideosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 20;
  const { videos, isLoading, error, total, loadVideos } = useUserVideos({
    page: currentPage,
    itemsPerPage
  });

  console.log('📊 Estado dos vídeos:', { 
    videosCount: videos.length, 
    total,
    currentPage,
    isLoading, 
    error 
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  const statusBadges = [
    {
      icon: Video,
      label: 'Biblioteca Completa',
      variant: 'secondary' as const,
      color: 'bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30'
    },
      {
      icon: Sparkles,
      label: `${total} Vídeos`,
      variant: 'secondary' as const,
      color: 'bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Video}
        title="Biblioteca de Vídeos"
        subtitle="Explore sua coleção de vídeos"
        statusBadges={statusBadges}
      />

      <SearchAndFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onViewModeChange={() => {}}
        viewMode="grid"
      />

      <div className="container mx-auto px-6 py-8">
        {isLoading ? (
          <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-cyan mx-auto mb-4"></div>
              <p className="aurora-body text-white/80">Carregando vídeos...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
              <UserVideoGrid
                videos={videos}
                onVideoPlay={handleVideoPlay}
                isLoading={isLoading}
                total={total}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            </div>
            
            {!isLoading && total > itemsPerPage && (
              <div className="flex justify-center">
                <Pagination
                  totalItems={total}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <UserVideoPlayer
        video={selectedVideo}
        open={isPlayerOpen}
        onOpenChange={setIsPlayerOpen}
      />
    </AuroraPageLayout>
  );
};

export default VideosPage;
