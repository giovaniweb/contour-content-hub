import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Calendar } from 'lucide-react';
import { EquipmentVideo } from '@/hooks/useEquipmentContent';

interface EquipmentVideosProps {
  videos: EquipmentVideo[];
  loading: boolean;
}

export const EquipmentVideos: React.FC<EquipmentVideosProps> = ({ videos, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="aurora-glass border-aurora-electric-purple/30 animate-pulse">
            <CardContent className="p-4">
              <div className="aspect-video bg-white/20 rounded mb-3"></div>
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-3/4"></div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {videos.map((video) => (
        <Card key={video.id} className="aurora-glass border-aurora-electric-purple/30 aurora-glow hover:border-aurora-electric-purple/50 transition-colors">
          <CardContent className="p-4">
            {/* Video Thumbnail */}
            <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-black/20">
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
              
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  className="aurora-button aurora-glow hover:aurora-glow-intense"
                  onClick={() => window.open(video.url_video, '_blank')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Assistir
                </Button>
              </div>
            </div>

            {/* Video Info */}
            <div>
              <h3 className="aurora-heading text-lg text-white mb-2 line-clamp-2">
                {video.titulo}
              </h3>
              
              {video.descricao && (
                <p className="aurora-body text-white/80 text-sm mb-3 line-clamp-2">
                  {video.descricao}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
                <Calendar className="h-4 w-4" />
                {new Date(video.data_upload).toLocaleDateString('pt-BR')}
              </div>

              <div className="flex items-center justify-between">
                {video.categoria && (
                  <Badge 
                    variant="outline" 
                    className="border-aurora-electric-purple/30 text-aurora-electric-purple bg-aurora-electric-purple/10"
                  >
                    {video.categoria}
                  </Badge>
                )}

                {video.tags && video.tags.length > 0 && (
                  <div className="flex gap-1">
                    {video.tags.slice(0, 2).map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="border-aurora-electric-purple/20 text-aurora-electric-purple bg-aurora-electric-purple/5 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};