
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download, Loader2, AlertTriangle, RefreshCcw } from 'lucide-react';
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
  
  // Novo estado para controlar reprocessamento
  const [reprocessingId, setReprocessingId] = useState<string | null>(null);

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
        
        // Verificar se o vídeo realmente existe no storage
        checkVideoFilesAndUpdate(video);
        
        // Notificar o usuário apenas uma vez por vídeo
        toast({
          title: "Processamento demorado",
          description: `O vídeo "${video.title}" está demorando mais do que o esperado.`,
          variant: "destructive"
        });
      }
    });
    
    setProcessingTimeouts(newTimeouts);
  };

  // Nova função para verificar se o arquivo existe no storage e atualizar o status se necessário
  const checkVideoFilesAndUpdate = async (video: StoredVideo) => {
    try {
      // Extrair o nome do arquivo do metadata ou file_urls
      const fileName = video.metadata && video.metadata.original_filename 
        ? `${video.id}/original_${video.metadata.original_filename.replace(/[^a-zA-Z0-9.-]/g, '_')}` 
        : null;
      
      if (!fileName) {
        console.warn('Nome do arquivo não encontrado para verificar existência no storage');
        return;
      }

      // Verificar se o arquivo existe no storage
      const { data: fileExists } = await supabase
        .storage
        .from('videos')
        .getPublicUrl(fileName);

      if (fileExists?.publicUrl) {
        // O arquivo existe no storage, vamos atualizar o status para 'ready' se ainda estiver em processamento
        if (video.status === 'processing' || video.status === 'uploading') {
          const { error } = await supabase
            .from('videos_storage')
            .update({
              status: 'ready',
              file_urls: {
                ...video.file_urls,
                original: fileExists.publicUrl,
                hd: fileExists.publicUrl,
                sd: fileExists.publicUrl
              }
            })
            .eq('id', video.id);

          if (!error) {
            // Recarregar vídeos para mostrar o atualizado
            loadVideos();
            toast({
              title: "Vídeo disponível",
              description: `O vídeo "${video.title}" foi automaticamente marcado como pronto.`
            });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar arquivos de vídeo:', error);
    }
  };

  // Nova função para tentar reprocessar um vídeo travado
  const handleReprocessVideo = async (video: StoredVideo) => {
    try {
      setReprocessingId(video.id);
      
      // Verificar se existe um nome de arquivo
      let fileName = '';
      
      if (video.metadata && video.metadata.original_filename) {
        fileName = `${video.id}/original_${video.metadata.original_filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      } else if (video.file_urls?.original) {
        // Tentar extrair o nome do arquivo da URL
        const url = video.file_urls.original;
        const pathParts = url.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          fileName = `${video.id}/${pathParts[pathParts.length - 1]}`;
        }
      }
      
      if (!fileName) {
        toast({
          variant: "destructive",
          title: "Erro no reprocessamento",
          description: "Não foi possível identificar o arquivo do vídeo."
        });
        return;
      }
      
      // Chamar a função de processamento novamente
      const { error } = await supabase.functions.invoke('process-video', {
        body: { videoId: video.id, fileName }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Reprocessamento iniciado",
        description: `O vídeo "${video.title}" está sendo processado novamente.`
      });
      
      // Atualizar a lista após um pequeno delay
      setTimeout(() => {
        loadVideos();
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao reprocessar vídeo:', error);
      toast({
        variant: "destructive",
        title: "Erro no reprocessamento",
        description: "Não foi possível iniciar o reprocessamento do vídeo."
      });
    } finally {
      setReprocessingId(null);
    }
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Vídeos ({totalVideos})</h2>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onRefresh={handleRefresh}
                onDownload={() => handleDownloadClick(video)}
                processingTimeout={processingTimeouts[video.id]}
                timeSinceUpload={getTimeSinceUpload(video.created_at)}
                onReprocess={processingTimeouts[video.id] ? () => handleReprocessVideo(video) : undefined}
                isReprocessing={reprocessingId === video.id}
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
