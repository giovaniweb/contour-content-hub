
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useToast } from '@/hooks/use-toast';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Download, 
  BarChart3, 
  Link, 
  Loader2 
} from 'lucide-react';
import { Video } from '@/services/videoStorage/videoService';
import { StoredVideo } from '@/types/video-storage';
import VideoEditDialog from './VideoEditDialog';
import VideoStatisticsDialog from './VideoStatisticsDialog';
import { 
  deleteVideoCompletely, 
  downloadVideo, 
  copyVideoLink 
} from '@/services/videoStorage/videoManagementService';

interface VideoActionMenuProps {
  video: Video | StoredVideo;
  onEdit: (video: Video | StoredVideo) => void;
  onDelete: (video: Video | StoredVideo) => void;
  onDownload: (video: Video | StoredVideo) => void;
  onStatistics: (video: Video | StoredVideo) => void;
  onCopyLink: (video: Video | StoredVideo) => void;
  onRefresh?: () => void;
}

const VideoActionMenu: React.FC<VideoActionMenuProps> = ({
  video,
  onEdit,
  onDelete,
  onDownload,
  onStatistics,
  onCopyLink,
  onRefresh
}) => {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
    onEdit(video);
  };

  const handleDelete = async () => {
    setLoading('delete');
    try {
      const { success, error } = await deleteVideoCompletely(video.id);
      
      if (!success) {
        throw new Error(error);
      }

      toast({
        title: 'Sucesso',
        description: 'Vídeo excluído com sucesso!'
      });

      setIsDeleteDialogOpen(false);
      onDelete(video);
      onRefresh?.();
    } catch (error) {
      console.error('Erro ao excluir vídeo:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Erro ao excluir vídeo'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleDownload = async () => {
    setLoading('download');
    try {
      const { success, downloadUrl, error } = await downloadVideo(video.id);
      
      if (!success || !downloadUrl) {
        throw new Error(error || 'URL de download não disponível');
      }

      // Create download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = getVideoTitle();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Download iniciado',
        description: 'O download do vídeo foi iniciado com sucesso!'
      });

      onDownload(video);
    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no download',
        description: error.message || 'Erro ao fazer download do vídeo'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleStatistics = () => {
    setIsStatsDialogOpen(true);
    onStatistics(video);
  };

  const handleCopyLink = async () => {
    setLoading('copy');
    try {
      const { success, link, error } = await copyVideoLink(video.id);
      
      if (!success || !link) {
        throw new Error(error || 'Link não disponível');
      }

      await navigator.clipboard.writeText(link);
      
      toast({
        title: 'Link copiado!',
        description: 'O link do vídeo foi copiado para a área de transferência.'
      });

      onCopyLink(video);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Erro ao copiar link'
      });
    } finally {
      setLoading(null);
    }
  };

  const getVideoTitle = () => {
    return 'titulo' in video ? video.titulo : video.title;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleDownload} disabled={loading === 'download'}>
            {loading === 'download' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleStatistics}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Estatísticas
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleCopyLink} disabled={loading === 'copy'}>
            {loading === 'copy' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Link className="mr-2 h-4 w-4" />
            )}
            Copiar Link
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <VideoEditDialog
        video={video}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onUpdate={() => {
          onRefresh?.();
          setIsEditDialogOpen(false);
        }}
      />

      {/* Statistics Dialog */}
      <VideoStatisticsDialog
        video={video}
        open={isStatsDialogOpen}
        onOpenChange={setIsStatsDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o vídeo "{getVideoTitle()}"? 
              Esta ação não pode ser desfeita e o arquivo será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading === 'delete'}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading === 'delete'}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading === 'delete' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VideoActionMenu;
