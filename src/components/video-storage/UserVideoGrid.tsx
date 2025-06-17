
import React, { useState } from 'react';
import { Play, Search, Filter, Grid, List } from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-video bg-muted rounded-lg mb-3"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vídeos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
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
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Resultados */}
      <div className="text-sm text-muted-foreground">
        {filteredVideos.length} vídeo(s) encontrado(s)
      </div>

      {/* Grid/Lista de vídeos */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-shadow">
              {/* Thumbnail */}
              <div 
                className="relative aspect-video bg-muted overflow-hidden rounded-t-lg cursor-pointer"
                onClick={() => onVideoPlay(video)}
              >
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <Play className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3">
                    <Play className="h-6 w-6 text-black" />
                  </div>
                </div>

                {/* Duração */}
                {video.duracao && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duracao}
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{video.titulo}</h3>
                
                {video.descricao_curta && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {video.descricao_curta}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{formatDate(video.data_upload)}</span>
                  <span>{video.downloads_count || 0} downloads</span>
                </div>

                {/* Tags */}
                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {video.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
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
                    className="flex-1 mr-2"
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
            <Card key={video.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div 
                    className="relative w-32 h-18 bg-muted rounded overflow-hidden flex-shrink-0 cursor-pointer"
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
                        <Play className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 truncate">{video.titulo}</h3>
                    {video.descricao_curta && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {video.descricao_curta}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
          <div className="mx-auto h-12 w-12 text-muted-foreground mb-4 flex items-center justify-center">
            <Play className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum vídeo encontrado</h3>
          <p className="text-muted-foreground">
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
