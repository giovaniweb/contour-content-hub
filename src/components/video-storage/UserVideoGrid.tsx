
import React, { useState } from 'react';
import { Play, Search, Filter, Grid, List, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VideoDownloadMenu from './VideoDownloadMenu';

interface Video {
  id: string;
  titulo: string;
  descricao_curta?: string;
  thumbnail_url?: string;
  url_video?: string;
  categoria?: string;
  tags?: string[];
  downloads_count?: number;
  data_upload: string;
  duracao?: string;
}

interface UserVideoGridProps {
  videos: Video[];
  onVideoPlay: (video: Video) => void;
  isLoading?: boolean;
}

const UserVideoGrid: React.FC<UserVideoGridProps> = ({
  videos,
  onVideoPlay,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  console.log('🎬 UserVideoGrid recebeu:', videos.length, 'vídeos');

  // Filtrar vídeos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.descricao_curta?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || video.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obter categorias únicas
  const categories = [...new Set(videos.map(v => v.categoria).filter(Boolean))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para determinar se um vídeo é "novo" (últimos 7 dias)
  const isNewVideo = (dateString: string) => {
    const videoDate = new Date(dateString);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return videoDate > sevenDaysAgo;
  };

  // Função para determinar se um vídeo está "baixando" (exemplo: vídeos com downloads > 10)
  const isDownloadingVideo = (video: Video) => {
    return (video.downloads_count || 0) > 10;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-video bg-slate-700/50 rounded-xl mb-3"></div>
            <div className="h-4 bg-slate-700/50 rounded mb-2"></div>
            <div className="h-3 bg-slate-700/50 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
            <Input
              placeholder="Buscar vídeos..."
              className="pl-10 bg-slate-700/50 border-cyan-500/30 text-slate-100 placeholder:text-slate-400 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {categories.length > 0 && (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-slate-700/50 border-cyan-500/30 text-slate-100 rounded-xl">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-cyan-500/30">
                <SelectItem value="">Todas</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-xl"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-xl"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Resultados */}
      <div className="text-sm text-slate-400">
        {filteredVideos.length} vídeo(s) encontrado(s)
      </div>

      {/* Grid/Lista de vídeos */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="group hover:shadow-xl transition-all duration-300 bg-slate-800/50 border-cyan-500/20 rounded-xl overflow-hidden backdrop-blur-sm">
              {/* Thumbnail */}
              <div 
                className="relative aspect-video bg-slate-700/50 overflow-hidden cursor-pointer"
                onClick={() => onVideoPlay(video)}
              >
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                    <Play className="h-12 w-12 text-cyan-400" />
                  </div>
                )}
                
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-cyan-400/90 rounded-full p-3">
                    <Play className="h-6 w-6 text-slate-900" />
                  </div>
                </div>

                {/* Tags sobre o vídeo */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {isDownloadingVideo(video) && (
                    <div className="bg-orange-500/90 rounded-full p-2 backdrop-blur-sm">
                      <Flame className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {isNewVideo(video.data_upload) && (
                    <div className="bg-green-500/90 rounded-full p-2 backdrop-blur-sm">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Duração */}
                {video.duracao && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                    {video.duracao}
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-2 line-clamp-2 text-slate-100">{video.titulo}</h3>
                
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
                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-400">
                        {tag}
                      </Badge>
                    ))}
                    {video.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                        +{video.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Ações */}
                <div className="flex items-center justify-between">
                  <Button 
                    size="sm" 
                    onClick={() => onVideoPlay(video)}
                    className="flex-1 mr-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-xl"
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="hover:shadow-md transition-shadow bg-slate-800/50 border-cyan-500/20 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div 
                    className="relative w-32 h-18 bg-slate-700/50 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => onVideoPlay(video)}
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

                    {/* Tags sobre o vídeo na lista */}
                    <div className="absolute top-1 left-1 flex gap-1">
                      {isDownloadingVideo(video) && (
                        <div className="bg-orange-500/90 rounded-full p-1 backdrop-blur-sm">
                          <Flame className="h-3 w-3 text-white" />
                        </div>
                      )}
                      {isNewVideo(video.data_upload) && (
                        <div className="bg-green-500/90 rounded-full p-1 backdrop-blur-sm">
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 truncate text-slate-100">{video.titulo}</h3>
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

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => onVideoPlay(video)}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-xl"
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredVideos.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-slate-400 mb-4 flex items-center justify-center">
            <Play className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-slate-200">Nenhum vídeo encontrado</h3>
          <p className="text-slate-400">
            {searchTerm || selectedCategory 
              ? 'Tente ajustar seus filtros de busca'
              : 'Ainda não há vídeos disponíveis'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default UserVideoGrid;
