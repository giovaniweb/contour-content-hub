
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getVideos, 
  updateVideos, 
  Video, 
  VideoFilters,
  // removeMockupVideos // Removido daqui se for para videoManagementService ou se não for usado no hook
} from '@/services/videoStorage/videoService'; // Funções de leitura e atualização geral
import {
  deleteVideo,
  deleteVideos,
  removeMockupVideos // Assumindo que removeMockupVideos também foi para videoManagementService
} from '@/services/videoStorage/videoManagementService'; // Funções de gerenciamento/exclusão
import { useEquipments } from '@/hooks/useEquipments';

export const useVideoManager = () => {
  const { toast } = useToast();
  const { equipments } = useEquipments();
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VideoFilters>({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Carregar vídeos
  const loadVideos = async () => {
    console.log('[useVideoManager] Iniciando loadVideos com filtros:', filters, 'e página:', page);
    setLoading(true);
    try {
      const { videos: loadedVideos, total: totalCount, error } = await getVideos(filters, page, 20);
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

  // Selecionar vídeo
  const handleSelectVideo = (videoId: string) => {
    setSelectedVideos(prev => {
      if (prev.includes(videoId)) {
        return prev.filter(id => id !== videoId);
      } else {
        return [...prev, videoId];
      }
    });
  };

  // Selecionar todos
  const handleSelectAll = () => {
    if (selectedVideos.length === videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map(video => video.id));
    }
  };

  // Limpar seleção
  const handleClearSelection = () => {
    setSelectedVideos([]);
  };

  // Excluir vídeo único - REMOVIDO o confirm() duplo
  const handleDeleteVideo = async (videoId: string) => {
    console.log('[useVideoManager] Iniciando handleDeleteVideo com videoId:', videoId);
    try {
      const { success, error } = await deleteVideo(videoId);
      console.log('[useVideoManager] Resultado de deleteVideo:', { success, error });
      
      if (!success || error) {
        throw new Error(error);
      }

      toast({
        title: 'Sucesso',
        description: 'Vídeo excluído com sucesso'
      });

      console.log('[useVideoManager] handleDeleteVideo: Sucesso na exclusão, prestes a chamar loadVideos().');
      loadVideos();
    } catch (error) {
      console.error('[useVideoManager] Erro capturado no CATCH EXTERNO de handleDeleteVideo:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível excluir o vídeo'
      });
    }
  };

  // Excluir vídeos em massa
  const handleBulkDelete = async () => {
    if (selectedVideos.length === 0) return;
    
    if (!confirm(`Tem certeza que deseja excluir ${selectedVideos.length} vídeo(s)?`)) return;

    console.log('[useVideoManager] Iniciando handleBulkDelete com selectedVideos:', selectedVideos);
    try {
      const { success, error } = await deleteVideos(selectedVideos);
      console.log('[useVideoManager] Resultado de deleteVideos:', { success, error });
      
      if (!success || error) {
        throw new Error(error);
      }

      toast({
        title: 'Sucesso',
        description: `${selectedVideos.length} vídeo(s) excluído(s) com sucesso`
      });

      setSelectedVideos([]);
      console.log('[useVideoManager] handleBulkDelete: Sucesso na exclusão em massa, prestes a chamar loadVideos().');
      loadVideos();
    } catch (error) {
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

  // Remover vídeos mockup
  const handleRemoveMockupVideos = async () => {
    try {
      const { success, error } = await removeMockupVideos();
      
      if (!success || error) {
        throw new Error(error);
      }

      toast({
        title: 'Sucesso',
        description: 'Vídeos mockup removidos com sucesso'
      });

      loadVideos();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível remover vídeos mockup'
      });
    }
  };

  // Aplicar filtros
  const handleFilterChange = (newFilters: VideoFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // Carregar vídeos quando filtros ou página mudam
  useEffect(() => {
    loadVideos();
  }, [filters, page]);

  // Remover vídeos mockup ao carregar o hook
  useEffect(() => {
    handleRemoveMockupVideos();
  }, []);

  return {
    videos,
    selectedVideos,
    loading,
    filters,
    page,
    total,
    equipments,
    handleSelectVideo,
    handleSelectAll,
    handleClearSelection,
    handleDeleteVideo,
    handleBulkDelete,
    handleBulkUpdateEquipment,
    handleBulkAddTags,
    handleFilterChange,
    setPage,
    loadVideos
  };
};
