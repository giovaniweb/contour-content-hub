import React, { useState } from 'react';
import { Play, Download, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  console.log('🎬 UserVideoGrid recebeu:', videos.length, 'vídeos');

  const handleVideoSelect = (videoId: string, checked: boolean) => {
    if (checked) {
      setSelectedVideos(prev => [...prev, videoId]);
    } else {
      setSelectedVideos(prev => prev.filter(id => id !== videoId));
    }
  };

  const handleSelectAll = () => {
    if (selectedVideos.length === videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map(v => v.id));
    }
  };

  const handleDownloadSelected = async () => {
    const selectedVideoData = videos.filter(video => selectedVideos.includes(video.id));
    
    if (selectedVideoData.length === 1) {
      // Download único
      const video = selectedVideoData[0];
      if (video.url_video) {
        const link = document.createElement('a');
        link.href = video.url_video;
        link.download = `${video.titulo}.mp4`;
        link.click();
      }
    } else if (selectedVideoData.length > 1) {
      // Download múltiplo - ZIP
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      for (const video of selectedVideoData) {
        if (video.url_video) {
          try {
            const response = await fetch(video.url_video);
            const blob = await response.blob();
            zip.file(`${video.titulo}.mp4`, blob);
          } catch (error) {
            console.error(`Erro ao baixar ${video.titulo}:`, error);
          }
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `videos_selecionados.zip`;
      link.click();
    }
  };

  const clearSelection = () => {
    setSelectedVideos([]);
  };

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
      {/* Controles de Seleção */}
      {selectedVideos.length > 0 && (
        <div className="bg-slate-700/50 border border-cyan-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                {selectedVideos.length} vídeo(s) selecionado(s)
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAll}
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl"
              >
                {selectedVideos.length === videos.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleDownloadSelected}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl"
              >
                <Download className="h-4 w-4 mr-2" />
                Download {selectedVideos.length > 1 ? 'ZIP' : ''}
              </Button>
              <Button 
                variant="outline" 
                onClick={clearSelection}
                className="border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl"
              >
                Limpar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="text-sm text-slate-400">
        {videos.length} vídeo(s) encontrado(s)
      </div>

      {/* Grid de vídeos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="group hover:shadow-xl transition-all duration-300 bg-slate-800/50 border-cyan-500/20 rounded-xl overflow-hidden backdrop-blur-sm relative">
            {/* Checkbox de seleção */}
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-black/70 rounded-lg p-1 backdrop-blur-sm">
                <Checkbox
                  checked={selectedVideos.includes(video.id)}
                  onCheckedChange={(checked) => handleVideoSelect(video.id, checked as boolean)}
                  className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                />
              </div>
            </div>
            
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

      {/* Empty state */}
      {videos.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-slate-400 mb-4 flex items-center justify-center">
            <Play className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-slate-200">Nenhum vídeo encontrado</h3>
          <p className="text-slate-400">
            Ainda não há vídeos disponíveis
          </p>
        </div>
      )}
    </div>
  );
};

export default UserVideoGrid;