
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Grid2x2, LayoutList } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import VideoCard from './VideoCard';
import { Video } from '@/services/videoStorage/videoService';

interface VideoGridProps {
  videos: Video[];
  selectedVideos: string[];
  onSelectVideo: (videoId: string) => void;
  onSelectAll: () => void;
  onEdit: (video: Video) => void;
  onDelete: (videoId: string) => void;
  onPlay: (video: Video) => void;
  onDownload: (video: Video) => void;
  isLoading?: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  selectedVideos,
  onSelectVideo,
  onSelectAll,
  onEdit,
  onDelete,
  onPlay,
  onDownload,
  isLoading = false
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  const isAllSelected = videos.length > 0 && selectedVideos.length === videos.length;

  const handleDeleteClick = (video: Video) => {
    setVideoToDelete(video);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (videoToDelete) {
      onDelete(videoToDelete.id);
      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    }
  };

  const handleStatistics = (video: Video) => {
    console.log('Estatísticas para:', video.titulo);
    // TODO: Implementar modal de estatísticas
  };

  const handleCopyLink = (video: Video) => {
    if (video.url_video) {
      navigator.clipboard.writeText(video.url_video);
      console.log('Link copiado:', video.url_video);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-video bg-muted rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com seleção e toggle de visualização */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
          />
          <span className="text-sm font-medium">
            {selectedVideos.length > 0 
              ? `${selectedVideos.length} vídeo(s) selecionado(s)`
              : `${videos.length} vídeo(s) total`
            }
          </span>
        </div>

        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
          <ToggleGroupItem value="grid" aria-label="Visualização em grid">
            <Grid2x2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Visualização em lista">
            <LayoutList className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Grid/List de vídeos */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        : 'space-y-2'
      }>
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            viewMode={viewMode}
            onPlay={onPlay}
            onEdit={onEdit}
            onDelete={handleDeleteClick}
            onDownload={onDownload}
            onStatistics={handleStatistics}
            onCopyLink={handleCopyLink}
          />
        ))}
      </div>

      {/* Empty state */}
      {videos.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-muted-foreground mb-4 flex items-center justify-center">
            <Grid2x2 className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum vídeo encontrado</h3>
          <p className="text-muted-foreground">
            Faça upload do seu primeiro vídeo para começar
          </p>
        </div>
      )}

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o vídeo "{videoToDelete?.titulo}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VideoGrid;
