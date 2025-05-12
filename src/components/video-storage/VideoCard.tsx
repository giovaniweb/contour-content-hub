
import React from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { deleteVideo } from '@/services/videoStorageService';
import { VideoCardProps } from './types';

import VideoCardThumbnail from './VideoCardThumbnail';
import VideoCardContent from './VideoCardContent';
import { VideoCardFooter } from './VideoCardFooter';
import VideoCardDeleteDialog from './VideoCardDeleteDialog';

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onRefresh, 
  onDownload, 
  processingTimeout = false,
  timeSinceUpload,
  onReprocess,
  isReprocessing = false
}) => {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const isProcessing = video.status === 'processing' || video.status === 'uploading';
  const hasFileUrl = Boolean(video.file_urls?.original || video.file_urls?.hd || video.file_urls?.sd);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteVideo(video.id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi excluído com sucesso."
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir vídeo",
        description: "Não foi possível excluir o vídeo."
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Função para abrir o vídeo para visualização
  const handleViewVideo = () => {
    const videoUrl = video.file_urls?.original || video.file_urls?.hd || video.file_urls?.sd;
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao abrir vídeo",
        description: "URL do vídeo não encontrada."
      });
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <VideoCardThumbnail 
        video={video} 
        processingTimeout={processingTimeout} 
        timeSinceUpload={timeSinceUpload}
        onReprocess={onReprocess}
        isReprocessing={isReprocessing}
      />
      
      <VideoCardContent 
        video={video} 
        processingTimeout={processingTimeout} 
        timeSinceUpload={timeSinceUpload}
      />
      
      <VideoCardFooter 
        video={video}
        onOpenDeleteDialog={() => setIsDeleteDialogOpen(true)}
        onDownload={onDownload}
        onViewVideo={handleViewVideo}
        isProcessing={isProcessing}
        hasFileUrl={hasFileUrl}
      />
      
      <VideoCardDeleteDialog 
        video={video}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </Card>
  );
};

export default VideoCard;
