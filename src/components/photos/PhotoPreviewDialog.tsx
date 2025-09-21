import React from 'react';
import { Photo } from '@/services/photoService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Download, Share2, X } from 'lucide-react';
import { usePhotoLikes } from '@/hooks/usePhotoLikes';
import { useEquipmentFilter } from '@/hooks/useEquipmentFilter';
import { toast } from '@/hooks/use-toast';
import { forceDownload } from '@/lib/forceDownload';

interface PhotoPreviewDialogProps {
  photo: Photo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PhotoPreviewDialog: React.FC<PhotoPreviewDialogProps> = ({
  photo,
  open,
  onOpenChange,
}) => {
  const { getEquipmentName } = useEquipmentFilter();
  const { isLiked, toggleLike, isToggling } = usePhotoLikes(photo?.id || '');

  if (!photo) return null;

  const handleShare = async () => {
    const shareData = {
      title: photo.titulo,
      text: `Confira esta foto: ${photo.titulo}`,
      url: photo.url_imagem,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(photo.url_imagem);
      toast({
        title: "Link copiado!",
        description: "O link da foto foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      await forceDownload(photo.url_imagem, `${photo.titulo}.jpg`);
      
      toast({
        title: "Download iniciado",
        description: "O download da foto foi iniciado.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar a foto.",
        variant: "destructive",
      });
    }
  };

  const handleFavorite = () => {
    toggleLike();
    toast({
      title: isLiked ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isLiked ? "Foto removida dos favoritos." : "Foto adicionada aos favoritos.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-slate-900/95 border border-slate-700/50">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 p-6 pb-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {photo.titulo}
                </DialogTitle>
                
                {/* Equipment Info */}
                {photo.categoria && (
                  <div className="mb-3">
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-sm px-3 py-1">
                      {getEquipmentName(photo.categoria)}
                    </Badge>
                  </div>
                )}
                
                {!photo.categoria && (
                  <div className="mb-3">
                    <Badge variant="secondary" className="bg-slate-700/50 text-slate-400 text-sm px-3 py-1">
                      Equipamento não especificado
                    </Badge>
                  </div>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  
                  {photo.tags && photo.tags.length > 0 && (
                    photo.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-slate-700/50 text-slate-300">
                        {tag}
                      </Badge>
                    ))
                  )}
                  
                  {photo.tags && photo.tags.length > 3 && (
                    <Badge variant="secondary" className="bg-slate-700/50 text-slate-400">
                      +{photo.tags.length - 3} mais
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center p-6 pt-0 overflow-hidden">
            <img
              src={photo.url_imagem}
              alt={photo.titulo}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Footer with Actions */}
          <div className="flex-shrink-0 p-6 pt-0">
            {photo.descricao_curta && (
              <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                {photo.descricao_curta}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleFavorite}
                  disabled={isToggling}
                  variant={isLiked ? "default" : "outline"}
                  className={`flex-1 sm:flex-none rounded-xl ${
                    isLiked 
                      ? 'bg-pink-500 hover:bg-pink-600 text-white' 
                      : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-pink-500/20 hover:border-pink-400/50 hover:text-pink-300'
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Favoritado' : 'Favoritar'}
                </Button>

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex-1 sm:flex-none bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-blue-500/20 hover:border-blue-400/50 hover:text-blue-300 rounded-xl"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>

                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1 sm:flex-none bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-green-500/20 hover:border-green-400/50 hover:text-green-300 rounded-xl"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};