import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Calendar, Heart, Download, Eye } from 'lucide-react';
import { EquipmentVideo } from '@/hooks/useEquipmentContent';
import { useVideoLikes } from '@/hooks/useVideoLikes';
import { useVideoDownload } from '@/hooks/useVideoDownload';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EquipmentVideosProps {
  videos: EquipmentVideo[];
  loading: boolean;
}

// Individual Video Card Component
const VideoCard: React.FC<{ video: EquipmentVideo; index: number }> = ({ video, index }) => {
  const [selectedVideo, setSelectedVideo] = useState<EquipmentVideo | null>(null);
  const { isLiked, setIsLiked, toggleLike, isToggling } = useVideoLikes(video.id);
  const { downloadVideo, isDownloading } = useVideoDownload();

  // Check if user has liked this video on mount
  useEffect(() => {
    const checkLikeStatus = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        const { data } = await supabase
          .from('favoritos')
          .select('id')
          .eq('video_id', video.id)
          .eq('usuario_id', user.user.id)
          .maybeSingle();
        
        setIsLiked(!!data);
      }
    };
    
    checkLikeStatus();
  }, [video.id, setIsLiked]);

  return (
    <>
      <Card className="aurora-glass border-aurora-electric-purple/30 aurora-glow hover:border-aurora-electric-purple/50 transition-colors group">
        <CardContent className="p-0">
          {/* Video Thumbnail - 16:9 aspect ratio */}
          <div className="relative aspect-[16/9] h-40 rounded-t-lg overflow-hidden bg-black/20">
            {video.thumbnail_url ? (
              <img 
                src={video.thumbnail_url} 
                alt={video.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="h-12 w-12 text-white/40" />
              </div>
            )}
            
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                className="aurora-button aurora-glow hover:aurora-glow-intense"
                onClick={() => setSelectedVideo(video)}
              >
                <Play className="h-4 w-4 mr-2" />
                Assistir
              </Button>
            </div>
          </div>

          {/* Video Info */}
          <div className="p-4">
            <h3 className="aurora-heading text-lg text-white mb-2 line-clamp-2">
              {video.titulo}
            </h3>
            
            {video.descricao && (
              <p className="aurora-body text-white/80 text-sm mb-3 line-clamp-2">
                {video.descricao}
              </p>
            )}

            {/* Video stats */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {video.favoritos_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {video.downloads_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(video.data_upload).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`${isLiked ? 'text-red-400 hover:text-red-300' : 'text-white/60 hover:text-red-400'} transition-colors`}
                  onClick={toggleLike}
                  disabled={isToggling}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-aurora-emerald hover:text-white hover:bg-aurora-emerald/20"
                  onClick={() => downloadVideo(video.id)}
                  disabled={isDownloading}
                >
                  <Download className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-aurora-electric-purple hover:text-white hover:bg-aurora-electric-purple/20"
                  onClick={() => setSelectedVideo(video)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {/* Tags */}
              <div className="flex gap-1">
                {video.tags && video.tags.slice(0, 2).map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="border-aurora-electric-purple/20 text-aurora-electric-purple bg-aurora-electric-purple/5 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedVideo && (
            <div className="relative">
              <div className="aspect-[16/9] bg-black rounded-t-lg overflow-hidden">
                {selectedVideo.url_video ? (
                  <video
                    controls
                    className="w-full h-full"
                    poster={selectedVideo.thumbnail_url}
                  >
                    <source src={selectedVideo.url_video} type="video/mp4" />
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <p>Vídeo não disponível</p>
                  </div>
                )}
              </div>
              <div className="p-6 bg-aurora-dark-blue rounded-b-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="aurora-heading text-xl font-semibold text-white mb-2">
                      {selectedVideo.titulo}
                    </h3>
                    {selectedVideo.descricao && (
                      <p className="aurora-body text-white/80 mb-4">
                        {selectedVideo.descricao}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => downloadVideo(selectedVideo.id)}
                    disabled={isDownloading}
                    className="aurora-button aurora-glow hover:aurora-glow-intense"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="text-aurora-electric-purple border-aurora-electric-purple/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export const EquipmentVideos: React.FC<EquipmentVideosProps> = ({ videos, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="aurora-glass border-aurora-electric-purple/30 animate-pulse">
            <CardContent className="p-0">
              <div className="aspect-[16/9] bg-white/20 rounded-t-lg mb-0"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-white/20 rounded"></div>
                <div className="h-3 bg-white/10 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <Card className="aurora-glass border-aurora-electric-purple/30 aurora-glow">
        <CardContent className="p-8 text-center">
          <Play className="h-12 w-12 text-white/60 mx-auto mb-4" />
          <h3 className="aurora-heading text-xl text-white mb-2">Nenhum vídeo encontrado</h3>
          <p className="aurora-body text-white/70">
            Ainda não há vídeos cadastrados para este equipamento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="aurora-heading text-xl font-semibold text-white">
          Vídeos ({videos.length})
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} />
        ))}
      </div>
    </div>
  );
};