import React, { useState, useMemo, useEffect } from 'react';
import { Image, Heart, Download, Archive, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { usePhotoLikes } from '@/hooks/usePhotoLikes';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';
import { Photo } from '@/services/photoService';
import { EmptyState } from '@/components/ui/empty-state';

interface EquipmentPhotosTabProps {
  equipmentName: string;
}

export const EquipmentPhotosTab: React.FC<EquipmentPhotosTabProps> = ({ equipmentName }) => {
  const { photos, isLoading, error } = useUserPhotos();
  // Remover uso do hook antigo - usar componente específico
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  // Filtrar fotos pelo equipamento
  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => 
      photo.tags?.includes(equipmentName) || 
      photo.categoria === equipmentName
    );
  }, [photos, equipmentName]);

  // Carregar contagem de curtidas
  useEffect(() => {
    const loadLikesCount = async () => {
      if (filteredPhotos.length === 0) return;
      
      const { data, error } = await supabase
        .from('favoritos')
        .select('foto_id')
        .in('foto_id', filteredPhotos.map(p => p.id))
        .eq('tipo', 'foto');
      
      if (!error && data) {
        const counts: Record<string, number> = {};
        data.forEach(like => {
          counts[like.foto_id] = (counts[like.foto_id] || 0) + 1;
        });
        setLikesCount(counts);
      }
    };
    
    loadLikesCount();
  }, [filteredPhotos]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleLike = async (photoId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (likedPhotos.has(photoId)) {
      toast({
        title: "Foto já curtida",
        description: "Você já curtiu esta foto anteriormente.",
      });
      return;
    }

    // Usar componente específico para likes
    try {
      setLikedPhotos(prev => new Set(prev).add(photoId));
      setLikesCount(prev => ({
        ...prev,
        [photoId]: (prev[photoId] || 0) + 1
      }));
      toast({
        title: "Foto curtida!",
        description: "Obrigado por curtir esta foto.",
      });
    } catch (error) {
      console.error('Error liking photo:', error);
    }
  };

  const downloadFile = async (url: string, filename: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao baixar ${filename}`);
    }
    return response.blob();
  };

  const handleSingleDownload = async (photoUrl: string, photoTitle: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      setIsDownloading(true);
      const blob = await downloadFile(photoUrl, photoTitle);
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${photoTitle}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      toast({
        title: "Download concluído",
        description: "O download da foto foi concluído.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar a foto.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMultipleDownload = async () => {
    if (selectedPhotos.size === 0) {
      toast({
        title: "Nenhuma foto selecionada",
        description: "Selecione pelo menos uma foto para download.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsDownloading(true);
      const zip = new JSZip();
      
      const selectedPhotosList = filteredPhotos.filter(p => selectedPhotos.has(p.id));
      
      for (const photo of selectedPhotosList) {
        try {
          const blob = await downloadFile(photo.url_imagem, photo.titulo);
          zip.file(`${photo.titulo}.jpg`, blob);
        } catch (error) {
          console.error(`Erro ao baixar ${photo.titulo}:`, error);
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `fotos_${equipmentName}_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      setSelectedPhotos(new Set());
      
      toast({
        title: "Download concluído",
        description: `${selectedPhotosList.length} fotos foram baixadas em um arquivo ZIP.`,
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível criar o arquivo ZIP.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const selectAllPhotos = () => {
    const allPhotoIds = filteredPhotos.map(p => p.id);
    setSelectedPhotos(new Set(allPhotoIds));
  };

  const clearSelection = () => {
    setSelectedPhotos(new Set());
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aurora-glass rounded-2xl p-4 animate-pulse">
            <div className="aspect-video bg-slate-700/50 rounded-xl mb-4"></div>
            <div className="h-4 bg-slate-700/50 rounded mb-2"></div>
            <div className="h-3 bg-slate-700/50 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredPhotos.length === 0) {
    return (
      <EmptyState
        icon={Image}
        title="Nenhuma foto encontrada"
        description={`Nenhuma foto relacionada ao equipamento "${equipmentName}" foi encontrada`}
        actionLabel="Ver todas as fotos"
        onAction={() => window.open('/photos', '_blank')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="text-slate-300 text-sm">
          {filteredPhotos.length} foto(s) relacionada(s) ao equipamento "{equipmentName}"
        </div>
        
        <div className="flex items-center gap-2">
          {selectedPhotos.size > 0 && (
            <div className="flex items-center gap-2 mr-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMultipleDownload}
                disabled={isDownloading}
                className="aurora-button rounded-xl"
              >
                <Archive className="h-4 w-4 mr-1" />
                {isDownloading ? 'Baixando...' : `Baixar ${selectedPhotos.size} ZIP`}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
                className="rounded-xl border-red-400/30 text-red-400 hover:bg-red-400/20"
              >
                Limpar
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={selectedPhotos.size > 0 ? clearSelection : selectAllPhotos}
            className="aurora-button rounded-xl"
          >
            {selectedPhotos.size > 0 ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </Button>
        </div>
      </div>

      {/* Grid de Fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="aurora-card rounded-2xl group hover:scale-105 transition-all duration-300">
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3 z-10">
              <Checkbox
                checked={selectedPhotos.has(photo.id)}
                onCheckedChange={() => togglePhotoSelection(photo.id)}
                className="bg-black/50 border-cyan-400/50"
              />
            </div>
            
            {/* Photo */}
            <div 
              className="relative aspect-video bg-slate-800/50 overflow-hidden rounded-t-2xl cursor-pointer group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.thumbnail_url || photo.url_imagem}
                alt={photo.titulo}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Overlay com botões no hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(photo.id, e);
                  }}
                  className="text-pink-400 border-pink-400/20 hover:bg-pink-400/20"
                >
                  <Heart className={`h-4 w-4 ${likedPhotos.has(photo.id) ? 'fill-current' : ''}`} />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhoto(photo);
                  }}
                  className="text-white border-white/20 hover:bg-white/20"
                >
                  <Image className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSingleDownload(photo.url_imagem, photo.titulo, e);
                  }}
                  disabled={isDownloading}
                  className="text-green-400 border-green-400/20 hover:bg-green-400/20"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-medium text-white mb-2 line-clamp-2">{photo.titulo}</h3>
              
              {photo.descricao_curta && (
                <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                  {photo.descricao_curta}
                </p>
              )}

              {/* Tags */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {photo.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-cyan-400/20 text-cyan-400 border-cyan-400/30">
                      {tag}
                    </Badge>
                  ))}
                  {photo.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs border-cyan-400/30 text-cyan-400">
                      +{photo.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {likesCount[photo.id] || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {photo.downloads_count || 0}
                  </span>
                </div>
                <span>{formatDate(photo.data_upload)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Visualização */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden">
            <div className="relative">
              <img
                src={selectedPhoto.url_imagem}
                alt={selectedPhoto.titulo}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <Button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 aurora-button rounded-xl"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{selectedPhoto.titulo}</h3>
              {selectedPhoto.descricao_curta && (
                <p className="text-slate-400 mb-4">{selectedPhoto.descricao_curta}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{formatDate(selectedPhoto.data_upload)}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleLike(selectedPhoto.id, e)}
                    className="text-pink-400 border-pink-400/20 hover:bg-pink-400/20"
                  >
                    <Heart className={`h-4 w-4 mr-1 ${likedPhotos.has(selectedPhoto.id) ? 'fill-current' : ''}`} />
                    {likesCount[selectedPhoto.id] || 0}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleSingleDownload(selectedPhoto.url_imagem, selectedPhoto.titulo, e)}
                    disabled={isDownloading}
                    className="text-green-400 border-green-400/20 hover:bg-green-400/20"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};