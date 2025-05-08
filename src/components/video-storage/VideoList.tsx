import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download, Loader2, AlertTriangle } from 'lucide-react';
import { getVideos, getMyVideos } from '@/services/videoStorageService';
import VideoStatusBadge from './VideoStatusBadge';
import { StoredVideo, VideoStatus } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';
import VideoCard from './VideoCard';
import VideoDownloadDialog from './VideoDownloadDialog';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface VideoListProps {
  onlyMine?: boolean;
  equipmentId?: string;
  emptyStateMessage?: React.ReactNode | string;
}

const VideoList: React.FC<VideoListProps> = ({ 
  onlyMine = false, 
  equipmentId, 
  emptyStateMessage = "Nenhum vídeo encontrado"
}) => {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const pageSize = 12;
  const { toast } = useToast();
  
  // Estado para controle do diálogo de download
  const [selectedVideo, setSelectedVideo] = useState<StoredVideo | null>(null);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  
  // Estado para monitorar o tempo de processamento dos vídeos
  const [processingTimeouts, setProcessingTimeouts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadVideos();
    
    // Configurar intervalo para verificar vídeos em processamento
    const interval = setInterval(() => {
      checkProcessingVideos();
    }, 15000); // Verificar a cada 15 segundos
    
    return () => clearInterval(interval);
  }, [onlyMine, equipmentId, page]);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      // Construir o filtro básico
      const filter = equipmentId ? {
        search: '', 
        tags: []
      } : {};
      
      // Se tiver equipmentId, adicionar à busca
      if (equipmentId) {
        // Buscar nos metadados do vídeo
        const { data: equipData } = await supabase
          .from('equipamentos')
          .select('nome')
          .eq('id', equipmentId)
          .single();
          
        if (equipData?.nome) {
          filter.tags = [equipData.nome];
        }
      }
      
      // Fazer a busca com os filtros
      const result = onlyMine
        ? await getMyVideos(filter, { field: 'created_at', direction: 'desc' }, page, pageSize)
        : await getVideos(filter, { field: 'created_at', direction: 'desc' }, page, pageSize);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setVideos(result.videos);
      setTotalVideos(result.total);
      
      // Verificar vídeos em processamento há muito tempo
      checkProcessingVideos(result.videos);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar vídeos",
        description: "Não foi possível carregar a lista de vídeos."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para verificar vídeos que estão em processamento há muito tempo
  const checkProcessingVideos = (videosToCheck = videos) => {
    const processingVideos = videosToCheck.filter(v => 
      v.status === 'processing' || v.status === 'uploading'
    );
    
    if (processingVideos.length === 0) return;
    
    const newTimeouts = { ...processingTimeouts };
    
    // Verificar cada vídeo em processamento
    processingVideos.forEach(video => {
      const createdAt = new Date(video.created_at).getTime();
      const now = Date.now();
      const processingTime = now - createdAt;
      
      // Se o vídeo está em processamento há mais de 5 minutos, marcar como timeout
      if (processingTime > 5 * 60 * 1000 && !newTimeouts[video.id]) {
        newTimeouts[video.id] = true;
        
        // Notificar o usuário apenas uma vez por vídeo
        toast({
          title: "Processamento demorado",
          description: `O vídeo "${video.title}" está demorando mais do que o esperado.`,
          variant: "warning"
        });
      }
    });
    
    setProcessingTimeouts(newTimeouts);
  };

  const handleRefresh = () => {
    loadVideos();
  };
  
  const handleDownloadClick = (video: StoredVideo) => {
    setSelectedVideo(video);
    setIsDownloadDialogOpen(true);
  };
  
  const getTimeSinceUpload = (dateString: string): string => {
    const uploadDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - uploadDate.getTime();
    
    // Menos de um minuto
    if (diffMs < 60000) {
      return 'há menos de um minuto';
    }
    
    // Minutos
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) {
      return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }
    
    // Horas
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    
    // Dias
    const days = Math.floor(hours / 24);
    return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
  };
  
  // Renderizar estado vazio
  if (!isLoading && videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {typeof emptyStateMessage === 'string' ? (
          <p className="text-muted-foreground">{emptyStateMessage}</p>
        ) : (
          emptyStateMessage
        )}
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando vídeos...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onRefresh={handleRefresh}
                onDownload={() => handleDownloadClick(video)}
                processingTimeout={processingTimeouts[video.id]}
                timeSinceUpload={getTimeSinceUpload(video.created_at)}
              />
            ))}
          </div>
          
          {/* Paginação */}
          {totalVideos > pageSize && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center justify-center px-3 py-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">
                    Página {page} de {Math.ceil(totalVideos / pageSize)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(totalVideos / pageSize)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Diálogo de download */}
      {selectedVideo && (
        <VideoDownloadDialog
          video={selectedVideo}
          isOpen={isDownloadDialogOpen}
          onOpenChange={setIsDownloadDialogOpen}
        />
      )}
    </div>
  );
};

export default VideoList;
