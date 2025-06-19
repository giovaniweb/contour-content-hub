
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Video, VideoFilterOptions } from '@/types/video-storage';
import { 
  getVideos,
  updateVideos
} from '@/services/videoStorage/videoManagementService';
import { UniversalDeleteService, createDeleteHandler } from '@/services/universalDeleteService';
import { useEquipments } from '@/hooks/useEquipments';

export const useVideoManager = () => {
  const { toast } = useToast();
  const { equipments } = useEquipments();
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VideoFilterOptions>({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Create standardized delete handler using Universal Delete Service
  const handleDeleteVideo = createDeleteHandler(
    'video',
    videos,
    setVideos,
    toast,
    () => {
      // Clear selection if deleted video was selected
      setSelectedVideos(prev => prev.filter(id => !videos.some(v => v.id === id)));
      loadVideos(); // Refresh the list
    }
  );

  // Carregar vídeos
  const loadVideos = async () => {
    console.log('[useVideoManager] Iniciando loadVideos com filtros:', filters, 'e página:', page);
    setLoading(true);
    try {
      const { videos: loadedVideos, total: totalCount, error } = await getVideos(
        filters, 
        { field: 'data_upload', direction: 'desc' },
        page, 
        20
      );
      console.log('[useVideoManager] Resultado de getVideos em loadVideos:', { loadedVideos, totalCount, error });
      
      if (error) {
        throw new Error(error);
      }
      
      setVideos(loadedVideos);
      setTotal(totalCount);
    } catch (error) {
      console.error('[useVideoManager] Erro capturado em loadVideos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os vídeos'
      });
    } finally {
      setLoading(false);
    }
  };

  // Excluir vídeos em massa usando Universal Delete Service
  const handleBulkDelete = async () => {
    if (selectedVideos.length === 0) return;
    
    if (!confirm(`Tem certeza que deseja excluir ${selectedVideos.length} vídeo(s)?`)) return;

    console.log('[useVideoManager] Iniciando handleBulkDelete com selectedVideos:', selectedVideos);

    // Optimistic update - remove from UI immediately
    const optimisticVideos = videos.filter(v => !selectedVideos.includes(v.id));
    setVideos(optimisticVideos);
    
    // Show loading toast
    toast({
      title: 'Excluindo vídeos...',
      description: `Removendo ${selectedVideos.length} vídeo(s) e todas as referências...`
    });

    try {
      // Delete videos one by one using the cascade function
      const results = await Promise.all(
        selectedVideos.map(id => UniversalDeleteService.deleteVideo(id))
      );
      
      // Check for failures
      const failures = results.filter(r => !r.success);
      if (failures.length > 0) {
        throw new Error(`Falha ao excluir ${failures.length} vídeo(s)`);
      }

      toast({
        title: 'Sucesso',
        description: `${selectedVideos.length} vídeo(s) excluído(s) com sucesso`
      });

      setSelectedVideos([]);
      console.log('[useVideoManager] handleBulkDelete: Sucesso na exclusão em massa, prestes a chamar loadVideos().');
      setPage(1);
      loadVideos();
    } catch (error) {
      // Rollback optimistic update on error
      setVideos(videos);
      
      console.error('[useVideoManager] Erro capturado no CATCH EXTERNO de handleBulkDelete:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível excluir os vídeos'
      });
    }
  };

  // Atualizar equipamento em massa
  const handleBulkUpdateEquipment = async (equipmentId: string) => {
    if (selectedVideos.length === 0) return;

    try {
      const updates: Partial<Video> = {
        equipamentos: equipmentId === 'none' ? [] : [equipmentId]
      };

      const { success, error } = await updateVideos(selectedVideos, updates);
      
      if (!success || error) {
        throw new Error(error);
      }

      const equipmentName = equipmentId === 'none' 
        ? 'removido' 
        : equipments.find(eq => eq.id === equipmentId)?.nome || 'atualizado';

      toast({
        title: 'Sucesso',
        description: `Equipamento ${equipmentName} para ${selectedVideos.length} vídeo(s)`
      });

      setSelectedVideos([]);
      loadVideos();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar os vídeos'
      });
    }
  };

  // Adicionar tags em massa
  const handleBulkAddTags = async (newTags: string[]) => {
    if (selectedVideos.length === 0 || newTags.length === 0) return;

    try {
      // Para cada vídeo selecionado, adicionar as novas tags
      const updates = selectedVideos.map(async (videoId) => {
        const video = videos.find(v => v.id === videoId);
        if (!video) return;

        const currentTags = video.tags || [];
        const updatedTags = [...new Set([...currentTags, ...newTags])];

        return updateVideos([videoId], { tags: updatedTags });
      });

      await Promise.all(updates);

      toast({
        title: 'Sucesso',
        description: `Tags adicionadas a ${selectedVideos.length} vídeo(s)`
      });

      setSelectedVideos([]);
      loadVideos();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível adicionar as tags'
      });
    }
  };

  // Aplicar filtros
  const handleFilterChange = (newFilters: VideoFilterOptions) => {
    console.log('[useVideoManager] handleFilterChange: Resetando página para 1 devido à mudança de filtros. Novos filtros:', newFilters);
    setFilters(newFilters);
    setPage(1);
  };

  // Carregar vídeos quando filtros ou página mudam
  useEffect(() => {
    loadVideos();
  }, [filters, page]);

  return {
    videos,
    selectedVideos,
    loading,
    filters,
    page,
    total,
    equipments,
    handleSelectVideo: (videoId: string) => {
      setSelectedVideos(prev => {
        if (prev.includes(videoId)) {
          return prev.filter(id => id !== videoId);
        } else {
          return [...prev, videoId];
        }
      });
    },
    handleSelectAll: () => {
      if (selectedVideos.length === videos.length) {
        setSelectedVideos([]);
      } else {
        setSelectedVideos(videos.map(video => video.id));
      }
    },
    handleClearSelection: () => {
      setSelectedVideos([]);
    },
    handleDeleteVideo, // Now using Universal Delete Service
    handleBulkDelete,
    handleBulkUpdateEquipment,
    handleBulkAddTags,
    handleFilterChange,
    setPage,
    loadVideos
  };
};
