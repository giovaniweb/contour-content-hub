
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useEquipments } from '@/hooks/useEquipments';
import { usePermissions } from '@/hooks/use-permissions';
import { EditableVideo, UseBatchVideoManageResult } from './video-batch/types';
import { useVideoBatchState } from './video-batch/stateManagement';
import { 
  loadVideosData, 
  saveVideoData, 
  deleteVideoData, 
  batchUpdateEquipment 
} from './video-batch/videoOperations';

export const useBatchVideoManage = (): UseBatchVideoManageResult => {
  const { toast } = useToast();
  const { isAdmin } = usePermissions();
  const { equipments } = useEquipments();
  
  const { 
    videos, loading, selectedVideos, searchQuery, 
    batchEquipmentId, showBatchEditDialog,
    setVideos, setLoading, setSelectedVideos,
    setSearchQuery, setBatchEquipmentId, setShowBatchEditDialog
  } = useVideoBatchState();

  // Filter videos based on search query
  const filteredVideos = videos.filter(video => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      video.title.toLowerCase().includes(query) ||
      (video.description || '').toLowerCase().includes(query) ||
      video.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const loadVideos = async () => {
    try {
      setLoading(true);
      const editableVideos = await loadVideosData();
      setVideos(editableVideos);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar vídeos",
        description: error.message || "Ocorreu um erro ao carregar a lista de vídeos."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedVideos.length === filteredVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(filteredVideos.map(v => v.id));
    }
  };

  const handleSelect = (videoId: string) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter(id => id !== videoId));
    } else {
      setSelectedVideos([...selectedVideos, videoId]);
    }
  };
  
  const handleEdit = (videoId: string) => {
    setVideos(videos.map(video => {
      if (video.id === videoId) {
        return {
          ...video,
          isEditing: true
        };
      }
      return video;
    }));
  };
  
  const handleUpdate = (index: number, updates: Partial<EditableVideo>) => {
    setVideos(prevVideos => {
      const newVideos = [...prevVideos];
      newVideos[index] = { ...newVideos[index], ...updates };
      return newVideos;
    });
  };
  
  const handleSave = async (videoId: string): Promise<void> => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    try {
      await saveVideoData(video, equipments);
      
      // Update local state
      setVideos(videos.map(v => {
        if (v.id === videoId) {
          return {
            ...v,
            title: v.editTitle,
            description: v.editDescription,
            tags: v.editTags,
            isEditing: false,
            originalEquipmentId: v.editEquipmentId === 'none' ? undefined : v.editEquipmentId
          };
        }
        return v;
      }));
      
      toast({
        title: "Vídeo atualizado",
        description: "As alterações foram salvas com sucesso."
      });
    } catch (error: any) {
      console.error('Error updating video:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar alterações",
        description: error.message || "Não foi possível salvar as alterações."
      });
    }
  };
  
  const handleCancel = (videoId: string) => {
    setVideos(videos.map(video => {
      if (video.id === videoId) {
        return {
          ...video,
          isEditing: false,
          editTitle: video.title,
          editDescription: video.description || '',
          editTags: [...video.tags],
          editEquipmentId: video.originalEquipmentId || 'none'
        };
      }
      return video;
    }));
  };
  
  const handleDelete = async (videoId: string): Promise<void> => {
    if (!confirm('Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await deleteVideoData(videoId);
      
      setVideos(videos.filter(v => v.id !== videoId));
      setSelectedVideos(selectedVideos.filter(id => id !== videoId));
      
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi excluído permanentemente."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir vídeo",
        description: error.message || "Não foi possível excluir o vídeo."
      });
    }
  };
  
  const handleBatchDelete = async (): Promise<void> => {
    if (selectedVideos.length === 0) return;
    
    if (!confirm(`Tem certeza que deseja excluir ${selectedVideos.length} vídeos selecionados? Esta ação não pode ser desfeita.`)) {
      return;
    }
    
    try {
      let successCount = 0;
      let failCount = 0;
      
      // Process deletes sequentially to avoid rate limiting
      for (const videoId of selectedVideos) {
        try {
          await deleteVideoData(videoId);
          successCount++;
        } catch (error) {
          console.error(`Error deleting video ${videoId}:`, error);
          failCount++;
        }
      }
      
      // Update state after all deletes
      setVideos(videos.filter(v => !selectedVideos.includes(v.id)));
      setSelectedVideos([]);
      
      if (failCount === 0) {
        toast({
          title: "Vídeos excluídos",
          description: `${successCount} vídeos foram excluídos com sucesso.`
        });
      } else {
        toast({
          variant: "default",
          title: "Processo concluído com avisos",
          description: `${successCount} vídeos excluídos, ${failCount} falhas.`
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na operação em lote",
        description: error.message || "Ocorreu um erro durante o processamento."
      });
    }
  };
  
  const handleBatchEquipmentUpdate = async (): Promise<void> => {
    if (selectedVideos.length === 0 || !batchEquipmentId) return;
    
    try {
      const { successCount, failCount } = await batchUpdateEquipment(
        selectedVideos, 
        batchEquipmentId, 
        equipments
      );
      
      // Update local state
      setVideos(videos.map(video => {
        if (selectedVideos.includes(video.id)) {
          return {
            ...video,
            editEquipmentId: batchEquipmentId,
            originalEquipmentId: batchEquipmentId === 'none' ? undefined : batchEquipmentId
          };
        }
        return video;
      }));
      
      setShowBatchEditDialog(false);
      
      if (failCount === 0) {
        toast({
          title: "Equipamentos atualizados",
          description: `${successCount} vídeos foram atualizados com sucesso.`
        });
      } else {
        toast({
          variant: "default",
          title: "Processo concluído com avisos",
          description: `${successCount} vídeos atualizados, ${failCount} falhas.`
        });
      }
      
      // Reload videos to get fresh data
      loadVideos();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na operação em lote",
        description: error.message || "Ocorreu um erro durante o processamento."
      });
    }
  };

  useEffect(() => {
    if (isAdmin()) {
      loadVideos();
    }
  }, [isAdmin]);

  return {
    videos: filteredVideos,
    loading,
    searchQuery,
    setSearchQuery,
    selectedVideos,
    setSelectedVideos,
    batchEquipmentId,
    setBatchEquipmentId,
    showBatchEditDialog,
    setShowBatchEditDialog,
    loadVideos,
    handleSelectAll,
    handleSelect,
    handleEdit,
    handleUpdate,
    handleSave,
    handleCancel,
    handleDelete,
    handleBatchDelete,
    handleBatchEquipmentUpdate,
    isAdmin,
    equipments
  };
};
