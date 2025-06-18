
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
  // deleteVideo, // Removido se não for mais usado diretamente aqui
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
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Removido
  const [loading, setLoading] = useState<string | null>(null); // Mantido para Download/CopyLink

  const handleEdit = () => {
    setIsEditDialogOpen(true);
    onEdit(video);
  };

  // handleDelete local foi removido

  const handleDownload = async () => {
    setLoading('download'); // 'download' é um exemplo, pode ser 'downloading'
    try {
      const { success, downloadUrl, error } = await downloadVideo(video.id);
      
      if (!success || !downloadUrl) {
        throw new Error(error || 'URL de download não disponível');
      }

      // Create a temporary link and trigger download automatically
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = getVideoTitle() + '.mp4';
      link.target = '_blank';
      
      // Add to DOM temporarily to ensure it works in all browsers
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Download iniciado',
        description: 'O download do vídeo foi iniciado automaticamente!'
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
            onClick={() => onDelete(video)} // Chama diretamente a prop onDelete
            className="text-destructive focus:text-destructive"
            disabled={loading === 'delete'} // Opcional: desabilitar se o pai estiver lidando com loading
          >
            {loading === 'delete' ? ( // Opcional: feedback de loading se o pai controlar
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="mr-2 h-4 w-4" />
            )}
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

      {/* AlertDialog de confirmação de exclusão foi removido daqui */}
    </>
  );
};

export default VideoActionMenu;
