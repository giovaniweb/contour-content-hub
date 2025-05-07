
import React from 'react';
import { StoredVideo } from '@/types/video-storage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Folder, Tag } from 'lucide-react';
import { generateDownloadUrl } from '@/services/videoStorageService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VideoStatusBadge from './VideoStatusBadge';

interface VideoPreviewDialogProps {
  video: StoredVideo;
  onClose: () => void;
}

const VideoPreviewDialog: React.FC<VideoPreviewDialogProps> = ({ video, onClose }) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const formattedSize = video.size < 1024 * 1024
    ? `${(video.size / 1024).toFixed(1)} KB`
    : `${(video.size / (1024 * 1024)).toFixed(1)} MB`;

  const handleDownload = async (quality: 'sd' | 'hd' | 'original' = 'original') => {
    setIsDownloading(true);
    try {
      const result = await generateDownloadUrl(video.id, quality);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Erro ao baixar",
          description: result.error
        });
        return;
      }
      
      if (result.url) {
        const a = document.createElement('a');
        a.href = result.url;
        a.download = result.filename || `${video.title.replace(/\s+/g, '_')}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast({
          title: "Download iniciado",
          description: "O download do vídeo foi iniciado."
        });
      }
    } catch (error) {
      console.error('Erro ao gerar URL de download:', error);
      toast({
        variant: "destructive",
        title: "Erro ao baixar",
        description: "Não foi possível gerar o link de download."
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl lg:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{video.title}</DialogTitle>
            <VideoStatusBadge status={video.status} />
          </div>
          {video.description && (
            <DialogDescription>
              {video.description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
            {video.status === 'ready' && video.file_urls?.original ? (
              <video 
                src={video.file_urls.original} 
                controls 
                poster={video.thumbnail_url} 
                className="h-full w-full"
                controlsList="nodownload"
              />
            ) : video.thumbnail_url ? (
              <img 
                src={video.thumbnail_url} 
                alt={video.title} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <p className="text-muted-foreground">
                  {video.status === 'processing' ? 'Vídeo em processamento...' : 
                   video.status === 'uploading' ? 'Upload em andamento...' : 
                   video.status === 'error' ? 'Erro no processamento' :
                   'Pré-visualização não disponível'}
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Adicionado em: {format(new Date(video.created_at), 'PPP', { locale: ptBR })}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Folder className="h-4 w-4" />
                <span>Tamanho: {formattedSize}</span>
              </div>
            </div>
            
            {video.tags && video.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {video.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {video.status === 'ready' && (
            <div className="flex flex-wrap gap-2 justify-end">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleDownload('sd')}
                disabled={isDownloading || !video.file_urls?.sd}
              >
                <Download className="h-4 w-4 mr-2" />
                SD
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleDownload('hd')}
                disabled={isDownloading || !video.file_urls?.hd}
              >
                <Download className="h-4 w-4 mr-2" />
                HD
              </Button>
              
              <Button 
                variant="default"
                size="sm"
                onClick={() => handleDownload('original')}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Original
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreviewDialog;
