import React, { useState, useMemo, useEffect } from 'react';
import { Video, Play, Heart, Download, Archive, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserVideos } from '@/hooks/useUserVideos';
import { useLikes } from '@/hooks/video-player/use-likes';
import UserVideoPlayer from '@/components/video-storage/UserVideoPlayer';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';
import { EmptyState } from '@/components/ui/empty-state';

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
  favoritos_count?: number;
}

interface EquipmentVideosTabProps {
  equipmentName: string;
}

export const EquipmentVideosTab: React.FC<EquipmentVideosTabProps> = ({ equipmentName }) => {
  const { videos, isLoading, error } = useUserVideos();
  const { saveLike } = useLikes();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  // Filtrar vídeos pelo equipamento
  const filteredVideos = useMemo(() => {
    return videos.filter(video => 
      video.tags?.includes(equipmentName) || 
      video.categoria === equipmentName
    );
  }, [videos, equipmentName]);

  // Carregar contagem de curtidas
  useEffect(() => {
    const loadLikesCount = async () => {
      if (filteredVideos.length === 0) return;
      
      const { data, error } = await supabase
        .from('favoritos')
        .select('video_id')
        .in('video_id', filteredVideos.map(v => v.id));
      
      if (!error && data) {
        const counts: Record<string, number> = {};
        data.forEach(like => {
          counts[like.video_id] = (counts[like.video_id] || 0) + 1;
        });
        setLikesCount(counts);
      }
    };
    
    loadLikesCount();
  }, [filteredVideos]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleVideoPlay = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
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
      
      const selectedVideosList = filteredVideos.filter(v => selectedVideos.has(v.id) && v.url_video);
      
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
      link.download = `videos_${equipmentName}_${new Date().toISOString().split('T')[0]}.zip`;
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

  if (filteredVideos.length === 0) {
    return (
      <EmptyState
        icon={Video}
        title="Nenhum vídeo encontrado"
        description={`Nenhum vídeo relacionado ao equipamento "${equipmentName}" foi encontrado`}
        actionLabel="Ver todos os vídeos"
        onAction={() => window.open('/videos', '_blank')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="text-slate-300 text-sm">
          {filteredVideos.length} vídeo(s) relacionado(s) ao equipamento "{equipmentName}"
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
            variant="outline"
            size="sm"
            onClick={selectedVideos.size > 0 ? clearSelection : selectAllVideos}
            className="aurora-button rounded-xl"
          >
            {selectedVideos.size > 0 ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </Button>
        </div>
      </div>

      {/* Grid de Vídeos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <div key={video.id} className="aurora-card rounded-2xl group hover:scale-105 transition-all duration-300">
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
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleVideoPlay(video)}
                  className="aurora-button rounded-xl flex-1"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Assistir
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
                    className="text-green-400 border-green-400/30 hover:bg-green-400/20 rounded-xl"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-slate-400 mt-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {likesCount[video.id] || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {video.downloads_count || 0}
                  </span>
                </div>
                <span>{formatDate(video.data_upload)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && isPlayerOpen && (
        <UserVideoPlayer
          video={selectedVideo}
          open={isPlayerOpen}
          onOpenChange={(open) => {
            setIsPlayerOpen(open);
            if (!open) setSelectedVideo(null);
          }}
        />
      )}
    </div>
  );
};