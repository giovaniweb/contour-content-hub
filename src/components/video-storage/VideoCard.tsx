
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download, Trash2, AlertTriangle } from 'lucide-react';
import { StoredVideo } from '@/types/video-storage';
import { deleteVideo } from '@/services/videoStorageService';
import { useToast } from '@/hooks/use-toast';
import VideoStatusBadge from './VideoStatusBadge';
import { usePermissions } from '@/hooks/use-permissions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VideoCardProps {
  video: StoredVideo;
  onRefresh: () => void;
  onDownload: () => void;
  processingTimeout?: boolean;
  timeSinceUpload: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onRefresh, 
  onDownload, 
  processingTimeout = false,
  timeSinceUpload 
}) => {
  const { toast } = useToast();
  const { isAdmin } = usePermissions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const isProcessing = video.status === 'processing' || video.status === 'uploading';
  
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

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video">
        {video.thumbnail_url ? (
          <img 
            src={video.thumbnail_url} 
            alt={video.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            {isProcessing ? (
              <div className="text-center">
                <div className="flex justify-center">
                  {processingTimeout ? (
                    <AlertTriangle className="h-8 w-8 text-amber-500" />
                  ) : (
                    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                <p className="mt-2 text-sm font-medium">Processando</p>
                {processingTimeout && (
                  <p className="text-xs text-amber-500">Demorando mais que o normal</p>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">Sem miniatura</span>
            )}
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <VideoStatusBadge 
            status={video.status} 
            timeout={processingTimeout}
          />
        </div>
      </div>
      
      <CardContent className="flex-grow p-4">
        <div className="mb-1 flex justify-between items-start">
          <h3 className="font-medium line-clamp-2" title={video.title}>{video.title}</h3>
        </div>
        
        <div className="text-xs text-muted-foreground mb-2">
          {timeSinceUpload} 
          {video.metadata?.equipment_id && (
            <span className="ml-1">
              • {video.metadata.equipment_id}
            </span>
          )}
        </div>
        
        {video.description && (
          <p className="text-sm text-muted-foreground line-clamp-2" title={video.description}>
            {video.description}
          </p>
        )}
        
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {video.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                {tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                +{video.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t mt-auto flex justify-between">
        <TooltipProvider>
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={isProcessing || video.status === 'error'}
                  onClick={() => window.open(video.file_urls.original || video.file_urls.hd || video.file_urls.sd, '_blank')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver vídeo</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={isProcessing || video.status === 'error'}
                  onClick={onDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
            
            {isAdmin() && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Excluir</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      </CardFooter>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir vídeo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o vídeo "{video.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default VideoCard;
