import React, { useState, useMemo, useEffect } from 'react';
import { Image, Search, Grid, List, Tag, Zap, Heart, Download, Archive, Check, Eye } from 'lucide-react';
import { EquipmentFilter } from '@/components/filters/EquipmentFilter';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { useEquipmentFilter } from '@/hooks/useEquipmentFilter';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';
import { Photo } from '@/services/photoService';
import { PhotoGrid } from '@/components/photos/PhotoGrid';

const Photos: React.FC = () => {
  const { photos, isLoading, error } = useUserPhotos();
  const { getEquipmentName } = useEquipmentFilter();
  // Remover uso do hook antigo
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  // Carregar contagem de curtidas e status de curtida do usuário
  useEffect(() => {
    const loadLikesData = async () => {
      if (photos.length === 0) return;
      
      // Carregar contagem total de curtidas
      const { data: allLikes, error: likesError } = await supabase
        .from('favoritos')
        .select('foto_id')
        .in('foto_id', photos.map(p => p.id))
        .eq('tipo', 'foto');
      
      if (!likesError && allLikes) {
        const counts: Record<string, number> = {};
        allLikes.forEach(like => {
          counts[like.foto_id] = (counts[like.foto_id] || 0) + 1;
        });
        setLikesCount(counts);
      }

      // Carregar curtidas do usuário atual
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        const { data: userLikes, error: userLikesError } = await supabase
          .from('favoritos')
          .select('foto_id')
          .in('foto_id', photos.map(p => p.id))
          .eq('tipo', 'foto')
          .eq('usuario_id', user.user.id);
        
        if (!userLikesError && userLikes) {
          const likedPhotoIds = new Set(userLikes.map(like => like.foto_id));
          setLikedPhotos(likedPhotoIds);
        }
      }
    };
    
    loadLikesData();
  }, [photos]);

  // Filtrar fotos
  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      const matchesSearch = photo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           photo.descricao_curta?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEquipment = !selectedEquipment || selectedEquipment === 'all' || 
                              photo.categoria === selectedEquipment;
      
      return matchesSearch && matchesEquipment;
    });
  }, [photos, searchTerm, selectedEquipment]);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função removida - usando hook useEquipmentFilter

  const handleLike = async (photoId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para curtir fotos.",
          variant: "destructive"
        });
        return;
      }

      const isCurrentlyLiked = likedPhotos.has(photoId);
      
      if (isCurrentlyLiked) {
        // Remover curtida
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('foto_id', photoId)
          .eq('usuario_id', user.user.id)
          .eq('tipo', 'foto');
        
        if (error) throw error;
        
        setLikedPhotos(prev => {
          const newSet = new Set(prev);
          newSet.delete(photoId);
          return newSet;
        });
        setLikesCount(prev => ({
          ...prev,
          [photoId]: Math.max(0, (prev[photoId] || 1) - 1)
        }));
        
        toast({
          title: "Curtida removida",
          description: "Foto removida dos favoritos."
        });
      } else {
        // Adicionar curtida
        const { error } = await supabase
          .from('favoritos')
          .insert({
            foto_id: photoId,
            usuario_id: user.user.id,
            tipo: 'foto'
          });
        
        if (error) throw error;
        
        setLikedPhotos(prev => new Set(prev).add(photoId));
        setLikesCount(prev => ({
          ...prev,
          [photoId]: (prev[photoId] || 0) + 1
        }));
        
        toast({
          title: "Foto curtida!",
          description: "Foto adicionada aos favoritos."
        });
      }
    } catch (error) {
      console.error('Error liking photo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a curtida.",
        variant: "destructive"
      });
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
      
      const selectedPhotosList = photos.filter(p => selectedPhotos.has(p.id));
      
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
      link.download = `fotos_selecionadas_${new Date().toISOString().split('T')[0]}.zip`;
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

  const statusBadges = [
    {
      icon: Image,
      label: `${filteredPhotos.length} Fotos`,
      variant: 'secondary' as const,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Image}
        title="Biblioteca de Fotos"
        subtitle="Explore nossa coleção completa de fotos com procedimentos e equipamentos"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6 space-y-8">
        {/* Filtros e Controles */}
        <div className="aurora-glass rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
                <Input
                  placeholder="Buscar fotos..."
                  className="pl-10 bg-black/20 border-cyan-400/30 text-white placeholder-slate-400 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-48">
                <EquipmentFilter
                  value={selectedEquipment}
                  onValueChange={setSelectedEquipment}
                />
              </div>
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
                    className="bg-slate-800/50 border-white/15 text-white hover:bg-slate-700 hover:text-white rounded-xl"
                  >
                    Limpar
                  </Button>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={selectedPhotos.size > 0 ? clearSelection : selectAllPhotos}
                className="bg-slate-800/50 border-white/15 text-white hover:bg-slate-700 hover:text-white rounded-xl mr-2"
              >
                {selectedPhotos.size > 0 ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-xl ${viewMode === 'grid' 
                  ? 'bg-aurora-cyan text-slate-900 font-medium shadow-sm' 
                  : 'bg-slate-800/50 border-white/15 text-white hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`rounded-xl ${viewMode === 'list' 
                  ? 'bg-aurora-cyan text-slate-900 font-medium shadow-sm' 
                  : 'bg-slate-800/50 border-white/15 text-white hover:bg-slate-700 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="aurora-glass rounded-2xl p-6 border-red-500/30">
            <div className="text-center">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Results counter */}
        <div className="text-slate-300 text-sm">
          {filteredPhotos.length} foto(s) encontrada(s)
        </div>

        {/* Photos Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aurora-glass rounded-2xl p-4 animate-pulse">
                <div className="aspect-video bg-slate-700/50 rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-700/50 rounded mb-2"></div>
                <div className="h-3 bg-slate-700/50 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <PhotoGrid
            photos={filteredPhotos}
            onPhotoClick={setSelectedPhoto}
          />
        ) : (
          <div className="space-y-4">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="aurora-card rounded-2xl hover:scale-[1.02] transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Selection Checkbox */}
                    <Checkbox
                      checked={selectedPhotos.has(photo.id)}
                      onCheckedChange={() => togglePhotoSelection(photo.id)}
                      className="bg-black/50 border-cyan-400/50"
                    />
                    
                    {/* Thumbnail */}
                    <div 
                      className="relative w-20 h-20 bg-slate-800/50 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <img
                        src={photo.thumbnail_url || photo.url_imagem}
                        alt={photo.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white mb-1 truncate">{photo.titulo}</h3>
                      {photo.descricao_curta && (
                        <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                          {photo.descricao_curta}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>{formatDate(photo.created_at)}</span>
                        {photo.categoria && getEquipmentName(photo.categoria) !== photo.categoria && (
                          <span className="text-cyan-400 font-medium">{getEquipmentName(photo.categoria)}</span>
                        )}
                        <span>{photo.downloads_count || 0} downloads</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedPhoto(photo)}
                        className="bg-aurora-cyan text-slate-900 hover:bg-aurora-cyan/80 font-medium rounded-lg"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleLike(photo.id, e)}
                        className={`bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 rounded-lg min-w-[60px] ${
                          likedPhotos.has(photo.id) ? 'text-red-400 border-red-400/30' : ''
                        }`}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${likedPhotos.has(photo.id) ? 'fill-current' : ''}`} />
                        {likesCount[photo.id] || 0}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleSingleDownload(photo.url_imagem, photo.titulo, e)}
                        disabled={isDownloading}
                        className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 rounded-lg"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredPhotos.length === 0 && (
          <div className="aurora-glass rounded-2xl p-12 text-center">
            <Image className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhuma foto encontrada</h3>
            <p className="text-slate-400">
              {photos.length === 0 
                ? "Você ainda não possui fotos cadastradas." 
                : "Tente ajustar os filtros para encontrar o que procura."}
            </p>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl max-h-full flex items-center justify-center">
            <img
              src={selectedPhoto.url_imagem}
              alt={selectedPhoto.titulo}
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-cyan-400 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </AuroraPageLayout>
  );
};

export default Photos;