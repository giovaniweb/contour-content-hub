
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StoredVideo } from '@/types/video-storage';
import { generateDownloadUrl, deleteVideo } from '@/services/videoStorageService';
import { useToast } from '@/hooks/use-toast';
import { 
  Download,
  MoreVertical, 
  Play, 
  Trash, 
  Edit,
  Loader 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from '@/hooks/useUser';
import VideoStatusBadge from './VideoStatusBadge';
import VideoEditDialog from './VideoEditDialog';
import VideoPreviewDialog from './VideoPreviewDialog';

interface VideoCardProps {
  video: StoredVideo;
  onClick?: () => void;
  onUpdate?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, onUpdate }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === video.owner_id;
  const canEdit = isOwner && video.status !== 'uploading' && video.status !== 'processing';
  
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

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const result = await deleteVideo(video.id);
      
      if (result.success) {
        toast({
          title: "Vídeo excluído",
          description: "O vídeo foi excluído com sucesso."
        });
        if (onUpdate) onUpdate();
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao excluir",
          description: result.error || "Não foi possível excluir o vídeo."
        });
      }
    } catch (error) {
      console.error('Erro ao excluir vídeo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o vídeo."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div 
          className="relative aspect-video cursor-pointer bg-muted overflow-hidden"
          onClick={() => setShowPreviewDialog(true)}
        >
          {video.thumbnail_url ? (
            <img 
              src={video.thumbnail_url} 
              alt={video.title} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <Play className="h-12 w-12 text-white opacity-70" />
            </div>
          )}
          
          <VideoStatusBadge status={video.status} className="absolute top-2 right-2" />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-white font-medium truncate">{video.title}</p>
            <p className="text-white/80 text-xs">
              {formatDistanceToNow(new Date(video.created_at), { addSuffix: true, locale: ptBR })}
            </p>
          </div>
        </div>
        
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{formattedSize}</p>
              {video.duration && (
                <p className="text-xs text-muted-foreground">{video.duration}</p>
              )}
            </div>
            
            {video.tags && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 overflow-hidden h-6">
                {video.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
                {video.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">+{video.tags.length - 3}</Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="secondary" 
            size="sm"
            disabled={video.status !== 'ready' || isDownloading}
            onClick={() => handleDownload('original')}
          >
            {isDownloading ? (
              <Loader className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Download className="h-4 w-4 mr-1" />
            )}
            Download
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowPreviewDialog(true)}>
                <Play className="h-4 w-4 mr-2" /> Visualizar
              </DropdownMenuItem>
              
              {video.status === 'ready' && (
                <>
                  <DropdownMenuItem onClick={() => handleDownload('hd')}>
                    <Download className="h-4 w-4 mr-2" /> Download HD
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('sd')}>
                    <Download className="h-4 w-4 mr-2" /> Download SD
                  </DropdownMenuItem>
                </>
              )}
              
              {canEdit && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <><Loader className="h-4 w-4 mr-2 animate-spin" /> Excluindo...</>
                    ) : (
                      <><Trash className="h-4 w-4 mr-2" /> Excluir</>
                    )}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>

      {showEditDialog && (
        <VideoEditDialog 
          video={video} 
          onClose={() => setShowEditDialog(false)}
          onUpdate={() => {
            setShowEditDialog(false);
            if (onUpdate) onUpdate();
          }}
        />
      )}
      
      {showPreviewDialog && (
        <VideoPreviewDialog
          video={video}
          onClose={() => setShowPreviewDialog(false)}
        />
      )}
    </>
  );
};

export default VideoCard;
