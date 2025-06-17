
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Upload, Loader2, Search, Filter, Grid, List, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { useUserVideos } from '@/hooks/useUserVideos';
import UserVideoPlayer from '@/components/video-storage/UserVideoPlayer';
import VideoDownloadMenu from '@/components/video-storage/VideoDownloadMenu';
import AuroraParticles from '@/components/ui/AuroraParticles';

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

const VideosPage: React.FC = () => {
  const { videos, isLoading, error, loadVideos } = useUserVideos();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const handleVideoPlay = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };
  
  const handleClosePlayer = () => {
    setSelectedVideo(null);
    setIsPlayerOpen(false);
  };

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

  return (
    <AppLayout>
      {/* Aurora Background Effects */}
      <AuroraParticles count={15} active={true} />
      
      <div className="min-h-screen aurora-dark-bg relative overflow-hidden">
        {/* Aurora animated background overlay */}
        <div className="absolute inset-0 aurora-gradient-bg opacity-20 pointer-events-none" />
        
        <div className="container mx-auto py-8 space-y-8 relative z-10">
          {/* Aurora Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="flex items-center justify-center gap-4">
              <div className="aurora-glass p-4 rounded-2xl">
                <Video className="h-12 w-12 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold aurora-text-gradient mb-2">
                  Aurora Video Gallery
                </h1>
                <p className="text-slate-300 text-lg">
                  Explore nossa coleção de vídeos com tecnologia aurora
                </p>
              </div>
            </div>
          </div>

          {/* Aurora Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="aurora-glass rounded-2xl p-6 aurora-floating">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2 aurora-glow-intense">
                  {isLoading ? '--' : videos.length}
                </div>
                <div className="text-slate-300">Vídeos Disponíveis</div>
              </div>
            </div>
            
            <div className="aurora-glass rounded-2xl p-6 aurora-floating" style={{ animationDelay: '0.2s' }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {isLoading ? '--' : categories.length}
                </div>
                <div className="text-slate-300">Categorias</div>
              </div>
            </div>
            
            <div className="aurora-glass rounded-2xl p-6 aurora-floating" style={{ animationDelay: '0.4s' }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {isLoading ? '--' : videos.reduce((total, video) => total + (video.downloads_count || 0), 0)}
                </div>
                <div className="text-slate-300">Total Downloads</div>
              </div>
            </div>
          </div>

          {/* Aurora Controls */}
          <div className="aurora-glass rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
                  <Input
                    placeholder="Buscar na aurora..."
                    className="pl-10 bg-black/20 border-cyan-400/30 text-white placeholder-slate-400 rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-black/20 border-cyan-400/30 text-white rounded-xl">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-cyan-400/30">
                    <SelectItem value="">Todas</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category} className="text-white">
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
                
                <Link to={ROUTES.VIDEOS.STORAGE}>
                  <Button className="aurora-button rounded-xl">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="aurora-glass rounded-2xl p-6 border-red-500/30">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Button onClick={loadVideos} className="aurora-button rounded-xl">
                  <Loader2 className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            </div>
          )}

          {/* Results counter */}
          <div className="text-slate-300 text-sm">
            {filteredVideos.length} vídeo(s) na aurora encontrado(s)
          </div>

          {/* Aurora Video Grid */}
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
                    
                    {/* Aurora overlay */}
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
                <h3 className="text-xl font-medium text-white mb-3">Nenhum vídeo encontrado na aurora</h3>
                <p className="text-slate-400 mb-6">
                  {searchTerm || selectedCategory 
                    ? 'Tente ajustar seus filtros de busca'
                    : 'Ainda não há vídeos disponíveis'
                  }
                </p>
                <Link to={ROUTES.VIDEOS.STORAGE}>
                  <Button className="aurora-button rounded-xl">
                    <Upload className="h-4 w-4 mr-2" />
                    Fazer Upload
                  </Button>
                </Link>
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
      </div>
    </AppLayout>
  );
};

export default VideosPage;
