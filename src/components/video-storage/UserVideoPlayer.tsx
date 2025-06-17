
import React from 'react';
import { X, Download, Share, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import VideoDownloadMenu from './VideoDownloadMenu';

interface Video {
  id: string;
  titulo: string;
  descricao_curta?: string;
  descricao_detalhada?: string;
  thumbnail_url?: string;
  url_video?: string;
  categoria?: string;
  tags?: string[];
  downloads_count?: number;
  data_upload: string;
  duracao?: string;
}

interface UserVideoPlayerProps {
  video: Video | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserVideoPlayer: React.FC<UserVideoPlayerProps> = ({
  video,
  open,
  onOpenChange
}) => {
  const { toast } = useToast();

  if (!video) return null;

  const handleShare = async () => {
    if (navigator.share && video.url_video) {
      try {
        await navigator.share({
          title: video.titulo,
          text: video.descricao_curta || '',
          url: video.url_video
        });
      } catch (error) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    if (video.url_video) {
      try {
        await navigator.clipboard.writeText(video.url_video);
        toast({
          title: 'Link copiado!',
          description: 'O link do vídeo foi copiado para a área de transferência.'
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível copiar o link.'
        });
      }
    }
  };

  const handleFavorite = async () => {
    toast({
      title: 'Adicionado aos favoritos!',
      description: 'O vídeo foi adicionado à sua lista de favoritos.'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-slate-900/95 border-cyan-500/20">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <DialogTitle className="text-lg font-semibold mb-2 text-slate-100">
                  {video.titulo}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>{formatDate(video.data_upload)}</span>
                  {video.duracao && <span>{video.duracao}</span>}
                  <span>{video.downloads_count || 0} downloads</span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Video Player */}
          <div className="px-6 py-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {video.url_video ? (
                <video
                  controls
                  className="w-full h-full"
                  poster={video.thumbnail_url}
                  preload="metadata"
                >
                  <source src={video.url_video} type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <p className="mb-2">Vídeo não disponível</p>
                    <p className="text-sm opacity-70">
                      O arquivo de vídeo não pôde ser carregado
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {video.categoria && (
                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                    {video.categoria}
                  </Badge>
                )}
                {video.tags && video.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-400">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleFavorite}
                  className="bg-slate-800/50 border-pink-500/30 text-pink-400 hover:bg-pink-500/20"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Favoritar
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShare}
                  className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                >
                  <Share className="h-4 w-4 mr-1" />
                  Compartilhar
                </Button>
                
                {video.url_video && (
                  <VideoDownloadMenu
                    downloads={[{ quality: 'Original', link: video.url_video }]}
                    videoId={video.id}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {(video.descricao_curta || video.descricao_detalhada) && (
            <div className="px-6 pb-6">
              <h4 className="font-medium mb-2 text-slate-200">Descrição</h4>
              <p className="text-sm text-slate-400">
                {video.descricao_detalhada || video.descricao_curta}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserVideoPlayer;
