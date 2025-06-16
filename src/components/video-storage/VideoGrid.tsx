
import React, { useState } from 'react';
import { Play, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
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

interface Video {
  id: string;
  titulo: string;
  descricao_curta?: string;
  url_video?: string;
  preview_url?: string;
  tipo_video: string;
  equipamentos?: string[];
  tags?: string[];
  data_upload: string;
}

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
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  const isAllSelected = videos.length > 0 && selectedVideos.length === videos.length;
  const isIndeterminate = selectedVideos.length > 0 && selectedVideos.length < videos.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const truncateTitle = (title: string, maxLength: number = 25) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const getVideoStatus = (video: Video) => {
    if (!video.url_video) return { label: 'Processando', variant: 'secondary' as const };
    return { label: 'Pronto', variant: 'success' as const };
  };

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="aspect-video bg-muted rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header com seleção */}
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            className={isIndeterminate ? "data-[state=checked]:bg-primary/50" : ""}
          />
          <span className="text-sm font-medium">
            {selectedVideos.length > 0 
              ? `${selectedVideos.length} vídeo(s) selecionado(s)`
              : `${videos.length} vídeo(s) total`
            }
          </span>
        </div>

        {/* Grid de vídeos - 4 colunas fixas */}
        <div className="grid grid-cols-4 gap-4">
          {videos.map((video) => {
            const isSelected = selectedVideos.includes(video.id);
            const status = getVideoStatus(video);
            
            return (
              <Card 
                key={video.id} 
                className={`transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
                onMouseEnter={() => setHoveredVideo(video.id)}
                onMouseLeave={() => setHoveredVideo(null)}
              >
                {/* Thumbnail com checkbox */}
                <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                  {/* Placeholder para thumbnail */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <Play className="h-8 w-8 text-muted-foreground" />
                  </div>
                  
                  {/* Checkbox no canto superior esquerdo */}
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectVideo(video.id)}
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-2 right-2">
                    <Badge variant={status.variant} className="text-xs">
                      {status.label}
                    </Badge>
                  </div>

                  {/* Overlay com play button no hover */}
                  {hoveredVideo === video.id && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="rounded-full"
                        onClick={() => onPlay(video)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <CardContent className="p-3">
                  {/* Título com tooltip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-medium text-sm mb-1 cursor-default">
                        {truncateTitle(video.titulo)}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{video.titulo}</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Descrição */}
                  {video.descricao_curta && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {video.descricao_curta}
                    </p>
                  )}

                  {/* Tags */}
                  {video.tags && video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {video.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                      {video.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          +{video.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Data e ações */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(video.data_upload)}
                    </span>
                    
                    {/* Ações com ícones */}
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => onEdit(video)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => onDownload(video)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(video)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Excluir</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty state */}
        {videos.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Play className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
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
    </TooltipProvider>
  );
};

export default VideoGrid;
