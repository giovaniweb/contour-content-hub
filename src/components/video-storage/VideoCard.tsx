
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StoredVideo } from '@/types/video-storage';
import { Eye, Download, Trash, Clock } from 'lucide-react';
import VideoStatusBadge from './VideoStatusBadge';
import { usePermissions } from '@/hooks/use-permissions';
import { deleteVideo, generateDownloadUrl } from '@/services/videoStorageService';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface VideoCardProps {
  video: StoredVideo;
  onVideoDeleted?: (videoId: string) => void;
  onPreviewClick?: (video: StoredVideo) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoDeleted, onPreviewClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { isAdmin } = usePermissions();
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && video.status === 'ready' && video.file_urls?.original) {
      videoRef.current.play().catch(err => {
        console.error("Error playing video on hover:", err);
      });
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };
  
  const handleDeleteClick = async () => {
    if (!isAdmin()) {
      toast({
        variant: "destructive",
        title: "Acesso restrito",
        description: "Apenas administradores podem excluir vídeos."
      });
      return;
    }
    
    try {
      setIsDeleting(true);
      
      const { success, error } = await deleteVideo(video.id);
      
      if (!success) {
        throw new Error(error);
      }
      
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi excluído com sucesso."
      });
      
      if (onVideoDeleted) {
        onVideoDeleted(video.id);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir vídeo",
        description: error.message || "Ocorreu um erro ao excluir o vídeo."
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleDownloadClick = async () => {
    try {
      setIsDownloading(true);
      
      const { url, filename, error } = await generateDownloadUrl(video.id);
      
      if (error || !url) {
        throw new Error(error || "Não foi possível gerar o link de download.");
      }
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `${video.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "O download do vídeo foi iniciado."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao baixar vídeo",
        description: error.message || "Ocorreu um erro ao gerar o link de download."
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  const uploadDate = video.created_at 
    ? formatDistanceToNow(new Date(video.created_at), { addSuffix: true, locale: ptBR })
    : "Data desconhecida";

  return (
    <Card 
      className="overflow-hidden transition-all duration-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-900">
        {video.status === 'ready' && video.file_urls?.original ? (
          <>
            {video.thumbnail_url && !isHovered && (
              <img 
                src={video.thumbnail_url} 
                alt={video.title} 
                className="w-full h-full object-cover"
              />
            )}
            
            <video
              ref={videoRef}
              src={video.file_urls.original}
              className={`w-full h-full object-cover ${!isHovered ? 'opacity-0 absolute' : 'opacity-100'}`}
              muted
              playsInline
              loop
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
            <VideoStatusBadge status={video.status} className="text-lg" />
          </div>
        )}
        
        {/* Status badge and duration */}
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <VideoStatusBadge status={video.status} />
          {video.duration && (
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </span>
          )}
        </div>
      </div>
      
      <CardHeader className="p-3 pb-0">
        <h3 className="text-base font-medium line-clamp-1">{video.title}</h3>
      </CardHeader>
      
      <CardContent className="p-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>{uploadDate}</span>
        </div>
        
        {video.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {video.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between">
        <Button
          variant="outline" 
          size="sm"
          className="text-xs h-8"
          onClick={() => onPreviewClick && onPreviewClick(video)}
          disabled={video.status !== 'ready'}
        >
          <Eye className="h-3 w-3 mr-1" /> Ver
        </Button>
        
        <div className="flex gap-1">
          <Button
            variant="outline" 
            size="sm"
            className="text-xs h-8 px-2"
            onClick={handleDownloadClick}
            disabled={isDownloading || video.status !== 'ready'}
          >
            <Download className="h-3 w-3" />
          </Button>
          
          {isAdmin() && (
            <Button
              variant="outline" 
              size="sm"
              className="text-xs h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              <Trash className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
