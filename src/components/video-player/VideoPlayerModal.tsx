
import React, { useState } from 'react';
import { StoredVideo } from '@/types/video-storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Maximize, Minimize, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface VideoPlayerModalProps {
  video: StoredVideo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ 
  video, 
  open,
  onOpenChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoUrl = video.file_urls?.original || video.file_urls?.hd || video.file_urls?.sd;
  const isVimeoVideo = video.metadata?.vimeo_id || (videoUrl && videoUrl.includes('vimeo.com'));
  const isYoutubeVideo = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  
  const getEmbedUrl = () => {
    if (!videoUrl) return '';
    
    if (isVimeoVideo) {
      // Extrair o ID do Vimeo da URL ou usar o ID armazenado
      const vimeoId = video.metadata?.vimeo_id || videoUrl.match(/(?:vimeo\.com\/(?:video\/)?)?(\d+)/)?.[1];
      return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : '';
    }
    
    if (isYoutubeVideo) {
      // Extrair o ID do YouTube da URL
      let youtubeId;
      if (videoUrl.includes('youtu.be/')) {
        youtubeId = videoUrl.split('youtu.be/')[1];
      } else if (videoUrl.includes('watch?v=')) {
        youtubeId = videoUrl.split('watch?v=')[1];
      }
      
      // Remover quaisquer parâmetros extras
      if (youtubeId && youtubeId.includes('&')) {
        youtubeId = youtubeId.split('&')[0];
      }
      
      return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : '';
    }
    
    // Retornar a URL direta para vídeos MP4 ou outros formatos
    return videoUrl;
  };
  
  const handleDownload = async () => {
    if (!videoUrl) {
      toast.error("URL do vídeo não disponível");
      return;
    }
    
    try {
      // Para vídeos diretos (não embeds)
      if (!isVimeoVideo && !isYoutubeVideo) {
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast.success("Download iniciado");
      } else {
        // Para vídeos embed, mostrar mensagem explicando que não é possível baixar diretamente
        toast.info("O download direto não está disponível para este vídeo", {
          description: "Acesse a plataforma original para fazer o download."
        });
      }
    } catch (error) {
      console.error("Erro ao baixar vídeo:", error);
      toast.error("Erro ao iniciar o download");
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description || 'Confira este vídeo',
          url: window.location.href
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    } else {
      // Fallback para navegadores que não suportam a API de compartilhamento
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência");
    }
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const videoElement = document.querySelector('.video-player-container') as HTMLElement;
      if (videoElement && videoElement.requestFullscreen) {
        videoElement.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error("Erro ao entrar em tela cheia:", err));
      }
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error("Erro ao sair da tela cheia:", err));
    }
  };
  
  const embedUrl = getEmbedUrl();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-background p-4">
          <DialogHeader>
            <DialogTitle className="text-xl">{video.title}</DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="video-player-container relative">
          {embedUrl ? (
            <div className="aspect-video bg-black">
              {isVimeoVideo || isYoutubeVideo ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                ></iframe>
              ) : (
                <video
                  src={embedUrl}
                  className="w-full h-full"
                  controls
                  autoPlay
                ></video>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Vídeo não disponível</p>
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-4">
          {video.description && (
            <p className="text-muted-foreground">{video.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2 justify-between">
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={!videoUrl || isVimeoVideo || isYoutubeVideo}>
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? (
                <>
                  <Minimize className="h-4 w-4 mr-2" />
                  Sair da tela cheia
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4 mr-2" />
                  Tela cheia
                </>
              )}
            </Button>
          </div>
          
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {video.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
