
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, ThumbsUp } from "lucide-react";
import VideoStatusBadge from "./VideoStatusBadge";
import { StoredVideo } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';
import { generateDownloadUrl } from '@/services/videoStorage/videoDownloadService';

interface VideoPreviewDialogProps {
  video: StoredVideo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoPreviewDialog: React.FC<VideoPreviewDialogProps> = ({ 
  video, 
  open, 
  onOpenChange 
}) => {
  const { toast } = useToast();
  
  if (!video) return null;

  const handleDownload = async () => {
    try {
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
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description || 'Confira este vídeo',
        // In a real application, you would generate a public shareable link here
      }).catch(error => {
        console.error('Error sharing video:', error);
      });
    } else {
      toast({
        variant: "default",
        title: "Compartilhamento não suportado",
        description: "Seu navegador não suporta a funcionalidade de compartilhamento."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
        <div className="bg-black aspect-video max-h-[70vh] overflow-hidden">
          {video.status === 'ready' && video.file_urls?.original ? (
            <video
              src={video.file_urls.original}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <VideoStatusBadge status={video.status} className="text-lg" />
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-4">
          <DialogHeader>
            <DialogTitle>{video.title}</DialogTitle>
          </DialogHeader>
          
          {video.description && (
            <p className="text-muted-foreground">{video.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2">
            {video.tags?.map((tag, index) => (
              <span 
                key={index} 
                className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleDownload} disabled={video.status !== 'ready'}>
              <Download className="h-4 w-4 mr-2" /> Baixar
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> Compartilhar
            </Button>
            <Button variant="ghost">
              <ThumbsUp className="h-4 w-4 mr-2" /> Curtir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreviewDialog;
