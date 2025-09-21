
import React, { useState, useMemo, useEffect } from 'react';
import { Video, Search, Filter, Play, Grid, List, Tag, Zap, Heart, Download, Archive, Check } from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserVideos } from '@/hooks/useUserVideos';
import { useUserEquipments } from '@/hooks/useUserEquipments';
import { useLikes } from '@/hooks/video-player/use-likes';
import UserVideoPlayer from '@/components/video-storage/UserVideoPlayer';
import VideoDownloadMenu from '@/components/video-storage/VideoDownloadMenu';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';

interface Video {
  id: string;
  titulo: string;
  descricao_curta?: string;
  descricao_detalhada?: string;
  thumbnail_url?: string;
  url_video?: string;
  categoria?: string;
  equipamentos?: string[];
  tags?: string[];
  downloads_count?: number;
  data_upload: string;
  duracao?: string;
  favoritos_count?: number;
}

const Videos: React.FC = () => {
  const { videos, isLoading, error } = useUserVideos();
  const { equipments } = useUserEquipments();
  const { saveLike } = useLikes();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  // Carregar contagem de curtidas
  useEffect(() => {
    const loadLikesCount = async () => {
      if (videos.length === 0) return;
      
      const { data, error } = await supabase
        .from('favoritos')
        .select('video_id')
        .in('video_id', videos.map(v => v.id));
      
      if (!error && data) {
        const counts: Record<string, number> = {};
        data.forEach(like => {
          counts[like.video_id] = (counts[like.video_id] || 0) + 1;
        });
        setLikesCount(counts);
      }
    };
    
    loadLikesCount();
  }, [videos]);

  const handleVideoPlay = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  // Filtrar vídeos
  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesSearch = video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.descricao_curta?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEquipment = !selectedEquipment || selectedEquipment === 'all' || 
                              (video.equipamentos && video.equipamentos.some(eq => eq === selectedEquipment)) ||
                              video.categoria === selectedEquipment;
      
      return matchesSearch && matchesEquipment;
    });
  }, [videos, searchTerm, selectedEquipment]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getEquipmentName = (categoria: string | undefined, equipamentos: string[] | undefined) => {
    // Primeiro tenta buscar pelo array equipamentos
    if (equipamentos && equipamentos.length > 0) {
      const equipmentNames = equipamentos.map(eqId => {
        const equipment = equipments.find(eq => eq.id === eqId || eq.nome === eqId);
        return equipment ? equipment.nome : eqId;
      });
      return equipmentNames.join(', ');
    }
    
    // Fallback para categoria (compatibilidade)
    if (categoria) {
      const equipment = equipments.find(eq => eq.nome === categoria);
      return equipment ? equipment.nome : categoria;
    }
    
    return 'Equipamento não especificado';
  };

  const handleLike = async (videoId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (likedVideos.has(videoId)) {
      toast({
        title: "Vídeo já curtido",
        description: "Você já curtiu este vídeo anteriormente.",
      });
      return;
    }

    const success = await saveLike(videoId);
    if (success) {
      setLikedVideos(prev => new Set(prev).add(videoId));
      setLikesCount(prev => ({
        ...prev,
        [videoId]: (prev[videoId] || 0) + 1
      }));
      toast({
        title: "Vídeo curtido!",
        description: "Obrigado por curtir este vídeo.",
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

  const handleSingleDownload = async (videoUrl: string, videoTitle: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      setIsDownloading(true);
      const blob = await downloadFile(videoUrl, videoTitle);
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${videoTitle}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      toast({
        title: "Download concluído",
        description: "O download do vídeo foi concluído.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o vídeo.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMultipleDownload = async () => {
    if (selectedVideos.size === 0) {
      toast({
        title: "Nenhum vídeo selecionado",
        description: "Selecione pelo menos um vídeo para download.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsDownloading(true);
      const zip = new JSZip();
      
      const selectedVideosList = videos.filter(v => selectedVideos.has(v.id) && v.url_video);
      
      for (const video of selectedVideosList) {
        try {
          const blob = await downloadFile(video.url_video!, video.titulo);
          zip.file(`${video.titulo}.mp4`, blob);
        } catch (error) {
          console.error(`Erro ao baixar ${video.titulo}:`, error);
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `videos_selecionados_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      setSelectedVideos(new Set());
      
      toast({
        title: "Download concluído",
        description: `${selectedVideosList.length} vídeos foram baixados em um arquivo ZIP.`,
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

  const toggleVideoSelection = (videoId: string) => {
    setSelectedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const selectAllVideos = () => {
    const videosWithUrl = filteredVideos.filter(v => v.url_video).map(v => v.id);
    setSelectedVideos(new Set(videosWithUrl));
  };

  const clearSelection = () => {
    setSelectedVideos(new Set());
  };

  const statusBadges = [
    {
      icon: Video,
      label: `${filteredVideos.length} Vídeos`,
      variant: 'secondary' as const,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Video}
        title="Biblioteca de Vídeos"
        subtitle="Explore nossa coleção completa de vídeos com procedimentos e equipamentos"
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
                  placeholder="Buscar vídeos..."
                  className="pl-10 bg-black/20 border-cyan-400/30 text-white placeholder-slate-400 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger className="w-48 bg-black/20 border-cyan-400/30 text-white rounded-xl">
                  <SelectValue placeholder="Equipamento" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-cyan-400/30">
                  <SelectItem value="all" className="text-white">Todos Equipamentos</SelectItem>
                  {equipments.map(equipment => (
                    <SelectItem key={equipment.id} value={equipment.id} className="text-white">
                      {equipment.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {selectedVideos.size > 0 && (
                <div className="flex items-center gap-2 mr-4 px-3 py-2 bg-cyan-400/20 rounded-xl border border-cyan-400/30">
                  <span className="text-cyan-400 text-sm font-medium">
                    {selectedVideos.size} vídeo(s) selecionado(s)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMultipleDownload}
                    disabled={isDownloading}
                    className="aurora-button rounded-xl text-xs"
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    {isDownloading ? 'Baixando...' : 'Baixar ZIP'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                    className="rounded-xl border-red-400/30 text-red-400 hover:bg-red-400/20 text-xs"
                  >
                    Limpar
                  </Button>
                </div>
              )}
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="aurora-button rounded-xl"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="aurora-button rounded-xl"
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
          {filteredVideos.length} vídeo(s) encontrado(s)
        </div>

        {/* Videos Grid/List */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div key={video.id} className="bg-slate-800/50 border-2 border-slate-700/50 hover:border-cyan-400/50 overflow-hidden transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-400/10 rounded-2xl">
                {/* Selection Checkbox */}
                {video.url_video && (
                  <div className="absolute top-3 left-3 z-10">
                    <Checkbox
                      checked={selectedVideos.has(video.id)}
                      onCheckedChange={() => toggleVideoSelection(video.id)}
                      className="bg-black/50 border-cyan-400/50"
                    />
                  </div>
                )}
                
                {/* Thumbnail */}
                <div 
                  className="relative aspect-video bg-slate-800/50 overflow-hidden rounded-t-2xl cursor-pointer"
                  onClick={() => handleVideoPlay(video)}
                >
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.titulo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      <Play className="h-12 w-12 text-cyan-400" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="aurora-glass rounded-full p-4">
                      <Play className="h-8 w-8 text-cyan-400" />
                    </div>
                  </div>

                  {/* Duration */}
                  {video.duracao && (
                    <div className="absolute bottom-3 right-3 aurora-glass px-2 py-1 rounded-lg text-xs text-cyan-400">
                      {video.duracao}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-medium text-white mb-2 line-clamp-2">{video.titulo}</h3>
                  
                  {/* Equipment Name - Destacado como na referência */}
                  <div className="mb-3">
                    <p className="text-cyan-400 text-sm font-semibold">{getEquipmentName(video.categoria, video.equipamentos)}</p>
                  </div>
                  
                  {video.descricao_curta && (
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                      {video.descricao_curta}
                    </p>
                  )}

                  {/* Tags */}
                  {video.tags && video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {video.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-cyan-400/20 text-cyan-400 border-cyan-400/30">
                          {tag}
                        </Badge>
                      ))}
                      {video.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs border-cyan-400/30 text-cyan-400">
                          +{video.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/30">
                    <Button 
                      size="sm" 
                      onClick={() => handleVideoPlay(video)}
                      className="aurora-button rounded-xl flex-1"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleLike(video.id, e)}
                      className={`rounded-xl border-cyan-400/30 ${
                        likedVideos.has(video.id) 
                          ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400' 
                          : 'text-cyan-400 hover:bg-cyan-400/20'
                      }`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${likedVideos.has(video.id) ? 'fill-current' : ''}`} />
                      {likesCount[video.id] || 0}
                    </Button>
                    
                    {video.url_video && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleSingleDownload(video.url_video!, video.titulo, e)}
                        disabled={isDownloading}
                        className="rounded-xl border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVideos.map((video) => (
              <div key={video.id} className="bg-slate-800/50 border-2 border-slate-700/50 hover:border-cyan-400/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10">
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Selection Checkbox */}
                    {video.url_video && (
                      <Checkbox
                        checked={selectedVideos.has(video.id)}
                        onCheckedChange={() => toggleVideoSelection(video.id)}
                        className="bg-black/50 border-cyan-400/50"
                      />
                    )}
                    
                    {/* Thumbnail */}
                    <div 
                      className="relative w-32 h-18 bg-slate-800/50 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => handleVideoPlay(video)}
                    >
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="h-6 w-6 text-cyan-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white mb-1 truncate">{video.titulo}</h3>
                      
                      {/* Equipment Name - Destacado */}
                      <div className="mb-2">
                        <span className="text-cyan-400 text-sm font-semibold">{getEquipmentName(video.categoria, video.equipamentos)}</span>
                      </div>
                      
                      {video.descricao_curta && (
                        <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                          {video.descricao_curta}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        {video.duracao && <span>{video.duracao}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleVideoPlay(video)}
                        className="aurora-button rounded-xl"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleLike(video.id, e)}
                        className={`rounded-xl border-cyan-400/30 ${
                          likedVideos.has(video.id) 
                            ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400' 
                            : 'text-cyan-400 hover:bg-cyan-400/20'
                        }`}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${likedVideos.has(video.id) ? 'fill-current' : ''}`} />
                        {likesCount[video.id] || 0}
                      </Button>
                      
                      {video.url_video && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleSingleDownload(video.url_video!, video.titulo, e)}
                          disabled={isDownloading}
                          className="rounded-xl border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredVideos.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="aurora-glass rounded-2xl p-12 max-w-md mx-auto">
              <div className="mx-auto h-16 w-16 text-cyan-400 mb-6 flex items-center justify-center aurora-glow-intense rounded-full bg-cyan-400/10">
                <Video className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Nenhum vídeo encontrado</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm || selectedEquipment || selectedProcedure 
                  ? 'Tente ajustar seus filtros de busca'
                  : 'Ainda não há vídeos disponíveis'
                }
              </p>
            </div>
          </div>
        )}

        {/* Video Player */}
        <UserVideoPlayer
          video={selectedVideo}
          open={isPlayerOpen}
          onOpenChange={setIsPlayerOpen}
        />
      </div>
    </AuroraPageLayout>
  );
};

export default Videos;
