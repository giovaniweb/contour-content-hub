
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Download, Eye, Share2, Star, Clock, HardDrive } from 'lucide-react';
import { getVideoStatistics, VideoStatistics } from '@/services/videoStorage/videoManagementService';
import { Video } from '@/services/videoStorage/videoService';
import { StoredVideo } from '@/types/video-storage';

interface VideoStatisticsDialogProps {
  video: Video | StoredVideo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoStatisticsDialog: React.FC<VideoStatisticsDialogProps> = ({
  video,
  open,
  onOpenChange
}) => {
  const [statistics, setStatistics] = useState<VideoStatistics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && video) {
      loadStatistics();
    }
  }, [open, video]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const { success, statistics: stats, error } = await getVideoStatistics(video.id);
      
      if (success && stats) {
        setStatistics(stats);
      } else {
        console.error('Erro ao carregar estatísticas:', error);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVideoTitle = () => {
    return 'titulo' in video ? video.titulo : video.title;
  };

  const getVideoTags = () => {
    return 'tags' in video ? video.tags : [];
  };

  const getVideoEquipments = () => {
    return 'equipamentos' in video ? video.equipamentos : [];
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Estatísticas do Vídeo</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando estatísticas...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Estatísticas do Vídeo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{getVideoTitle()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Enviado em: {formatDate(statistics?.uploadDate || '')}</span>
                </div>
                {statistics?.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Duração: {statistics.duration}</span>
                  </div>
                )}
                {statistics?.fileSize && (
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span>Tamanho: {statistics.fileSize}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{statistics?.totalViews || 0}</div>
                <div className="text-xs text-muted-foreground">Visualizações</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Download className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold">{statistics?.totalDownloads || 0}</div>
                <div className="text-xs text-muted-foreground">Downloads</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Share2 className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">{statistics?.totalShares || 0}</div>
                <div className="text-xs text-muted-foreground">Compartilhamentos</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold">{statistics?.averageRating?.toFixed(1) || '0.0'}</div>
                <div className="text-xs text-muted-foreground">Avaliação Média</div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          {getVideoTags()?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {getVideoTags().map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Equipment */}
          {getVideoEquipments()?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Equipamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {getVideoEquipments().map((equipment, index) => (
                    <Badge key={index} variant="outline">
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoStatisticsDialog;
