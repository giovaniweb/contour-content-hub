
import React, { useState, useMemo } from 'react';
import { Video, Search, Filter, Play, Grid, List, Tag, Zap } from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUserVideos } from '@/hooks/useUserVideos';
import { useUserEquipments } from '@/hooks/useUserEquipments';
import UserVideoPlayer from '@/components/video-storage/UserVideoPlayer';
import VideoDownloadMenu from '@/components/video-storage/VideoDownloadMenu';

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

const Videos: React.FC = () => {
  const { videos, isLoading, error } = useUserVideos();
  const { equipments } = useUserEquipments();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleVideoPlay = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  // Filtrar vídeos
  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesSearch = video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.descricao_curta?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEquipment = !selectedEquipment || 
                              video.categoria === selectedEquipment;
      
      const matchesProcedure = !selectedProcedure || 
                              video.tags?.some(tag => tag.toLowerCase().includes(selectedProcedure.toLowerCase())) ||
                              video.categoria?.toLowerCase().includes(selectedProcedure.toLowerCase());
      
      return matchesSearch && matchesEquipment && matchesProcedure;
    });
  }, [videos, searchTerm, selectedEquipment, selectedProcedure]);

  // Obter procedimentos únicos das tags e categorias
  const procedures = useMemo(() => {
    const allProcedures = new Set<string>();
    videos.forEach(video => {
      if (video.categoria) allProcedures.add(video.categoria);
      video.tags?.forEach(tag => allProcedures.add(tag));
    });
    return Array.from(allProcedures).sort();
  }, [videos]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const statusBadges = [
    {
      icon: Video,
      label: `${filteredVideos.length} Vídeos`,
      variant: 'secondary' as const,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
      icon: Zap,
      label: `${procedures.length} Procedimentos`,
      variant: 'secondary' as const,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
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
                  <SelectItem value="">Todos Equipamentos</SelectItem>
                  {equipments.map(equipment => (
                    <SelectItem key={equipment.id} value={equipment.nome} className="text-white">
                      {equipment.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedProcedure} onValueChange={setSelectedProcedure}>
                <SelectTrigger className="w-48 bg-black/20 border-cyan-400/30 text-white rounded-xl">
                  <SelectValue placeholder="Procedimento" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-cyan-400/30">
                  <SelectItem value="">Todos Procedimentos</SelectItem>
                  {procedures.map(procedure => (
                    <SelectItem key={procedure} value={procedure} className="text-white">
                      {procedure}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
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
              <div key={video.id} className="aurora-card rounded-2xl group hover:scale-105 transition-all duration-300">
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
                  
                  {video.descricao_curta && (
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                      {video.descricao_curta}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span>{formatDate(video.data_upload)}</span>
                    <span>{video.downloads_count || 0} downloads</span>
                  </div>

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
                  <div className="flex items-center justify-between">
                    <Button 
                      size="sm" 
                      onClick={() => handleVideoPlay(video)}
                      className="aurora-button rounded-xl flex-1 mr-2"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Assistir
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
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVideos.map((video) => (
              <div key={video.id} className="aurora-card rounded-2xl hover:scale-[1.02] transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-center gap-4">
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
                      {video.descricao_curta && (
                        <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                          {video.descricao_curta}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>{formatDate(video.data_upload)}</span>
                        <span>{video.downloads_count || 0} downloads</span>
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
                        Assistir
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
