import { useState, useEffect, useCallback } from 'react';
import { StoredVideo } from '@/types/video-storage';
import { Equipment } from '@/types/equipment';
import { useBatchVideoStore } from './video-batch/videoBatchStore';
import { loadVideosData, batchUpdateEquipment } from './video-batch/videoBatchOperations';
import { batchDeleteVideos } from './video-batch/videoOperations';
import { EditableVideo } from './video-batch/types';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UseBatchVideoManageResult {
  videos: EditableVideo[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedVideos: string[];
  setSelectedVideos: (ids: string[]) => void;
  batchEquipmentId: string;
  setBatchEquipmentId: (id: string) => void;
  showBatchEditDialog: boolean;
  setShowBatchEditDialog: (show: boolean) => void;
  loadVideos: () => Promise<void>;
  handleSelectAll: () => void;
  handleSelect: (videoId: string) => void;
  handleEdit: (videoId: string) => void;
  handleUpdate: (index: number, updates: Partial<EditableVideo>) => void;
  handleSave: (videoId: string) => Promise<void>;
  handleCancel: (videoId: string) => void;
  handleDelete: (videoId: string) => Promise<void>;
  handleBatchDelete: () => Promise<void>;
  handleBatchEquipmentUpdate: () => Promise<void>;
  isAdmin: () => boolean;
  equipments: Equipment[];
}

export const useBatchVideoManage = (): UseBatchVideoManageResult => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [batchEquipmentId, setBatchEquipmentId] = useState('');
  const [showBatchEditDialog, setShowBatchEditDialog] = useState(false);
  const { videos, loading, setVideos, setLoading, setError } = useBatchVideoStore();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const loadVideos = useCallback(async () => {
    setLoading(true);
    try {
      const result = await loadVideosData();
      if (result.success && result.data) {
        const editableVideos = result.data.map(video => ({
          id: video.id,
          title: video.title,
          description: video.description,
          status: video.status,
          tags: video.tags,
          isEditing: false,
          editTitle: video.title,
          editDescription: video.description || '',
          editEquipmentId: video.metadata?.equipment_id || '',
          editTags: video.tags,
          originalEquipmentId: video.metadata?.equipment_id,
          metadata: video.metadata,
          url: video.file_urls?.original
        }));
        setVideos(editableVideos);
      } else {
        setError(result.error || 'Failed to load videos');
        toast({
          title: "Erro ao carregar vídeos",
          description: result.error || 'Failed to load videos',
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
      toast({
        title: "Erro inesperado",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [setLoading, setVideos, setError, toast]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleSelectAll = () => {
    if (selectedVideos.length === videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map(video => video.id));
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
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId ? { ...video, isEditing: true } : video
      )
    );
  };

  const handleUpdate = (index: number, updates: Partial<EditableVideo>) => {
    setVideos(prevVideos => {
      const newVideos = [...prevVideos];
      newVideos[index] = { ...newVideos[index], ...updates };
      return newVideos;
    });
  };

  const handleSave = async (videoId: string) => {
    setLoading(true);
    try {
      const videoIndex = videos.findIndex(video => video.id === videoId);
      if (videoIndex === -1) {
        throw new Error('Video not found');
      }

      const videoToUpdate = videos[videoIndex];
      const updatedMetadata = {
        ...videoToUpdate.metadata,
        equipment_id: videoToUpdate.editEquipmentId,
      };

      const { error } = await supabase
        .from('videos_storage')
        .update({
          title: videoToUpdate.editTitle,
          description: videoToUpdate.editDescription,
          tags: videoToUpdate.editTags,
          metadata: updatedMetadata,
        })
        .eq('id', videoId);

      if (error) {
        console.error('Error updating video:', error);
        toast({
          title: "Erro ao salvar vídeo",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setVideos(prevVideos =>
        prevVideos.map(video =>
          video.id === videoId
            ? {
                ...video,
                title: video.editTitle,
                description: video.editDescription,
                tags: video.editTags,
                isEditing: false,
                metadata: updatedMetadata,
                originalEquipmentId: videoToUpdate.editEquipmentId,
              }
            : video
        )
      );
      toast({
        title: "Vídeo atualizado",
        description: "Vídeo atualizado com sucesso!",
      });
    } catch (error: any) {
      console.error('Error updating video:', error);
      toast({
        title: "Erro ao atualizar vídeo",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (videoId: string) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId ? {
          ...video,
          isEditing: false,
          editTitle: video.title,
          editDescription: video.description || '',
          editEquipmentId: video.originalEquipmentId || '',
          editTags: video.tags,
        } : video
      )
    );
  };

  const handleDelete = async (videoId: string) => {
    setLoading(true);
    try {
      await batchDeleteVideos([videoId]);
      setVideos(prevVideos => prevVideos.filter(video => video.id !== videoId));
      setSelectedVideos(prevSelected => prevSelected.filter(id => id !== videoId));
      toast({
        title: "Vídeo excluído",
        description: "Vídeo excluído com sucesso!",
      });
    } catch (error: any) {
      console.error('Error deleting video:', error);
      toast({
        title: "Erro ao excluir vídeo",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBatchDelete = async () => {
    setLoading(true);
    try {
      await batchDeleteVideos(selectedVideos);
      setVideos(prevVideos => prevVideos.filter(video => !selectedVideos.includes(video.id)));
      setSelectedVideos([]);
      toast({
        title: "Vídeos excluídos",
        description: "Vídeos excluídos com sucesso!",
      });
    } catch (error: any) {
      console.error('Error deleting videos:', error);
      toast({
        title: "Erro ao excluir vídeos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBatchEquipmentUpdate = async () => {
    setLoading(true);
    try {
      const success = await batchUpdateEquipment(selectedVideos, batchEquipmentId);
      if (success) {
        setVideos(prevVideos =>
          prevVideos.map(video =>
            selectedVideos.includes(video.id) ? {
              ...video,
              metadata: {
                ...video.metadata,
                equipment_id: batchEquipmentId,
              },
              originalEquipmentId: batchEquipmentId,
              editEquipmentId: batchEquipmentId,
            } : video
          )
        );
        setShowBatchEditDialog(false);
        setSelectedVideos([]);
        toast({
          title: "Equipamentos atualizados",
          description: "Equipamentos atualizados com sucesso!",
        });
      } else {
        toast({
          title: "Erro ao atualizar equipamentos",
          description: "Ocorreu um erro ao atualizar os equipamentos.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error updating equipment:', error);
      toast({
        title: "Erro ao atualizar equipamentos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch equipments with types based on your specific schema
  const fetchEquipments = async (): Promise<Equipment[]> => {
    const { data, error } = await supabase
      .from('equipamentos')
      .select('*')
      .order('nome');
      
    if (error) {
      console.error('Error fetching equipments:', error);
      return [];
    }

    // Transform the data to match the Equipment type
    const equipmentsList: Equipment[] = data.map(item => ({
      id: item.id,
      nome: item.nome,
      descricao: item.descricao || '',  // Provide default values for required fields
      categoria: item.categoria || '',   // Provide default values for required fields
      tecnologia: item.tecnologia,
      beneficios: item.beneficios,
      diferenciais: item.diferenciais,
      linguagem: item.linguagem,
      indicacoes: Array.isArray(item.indicacoes) 
        ? item.indicacoes 
        : typeof item.indicacoes === 'string'
          ? [item.indicacoes]
          : [],  // Convert string to array or use empty array as default
      ativo: item.ativo,
      image_url: item.image_url,
      data_cadastro: item.data_cadastro,
      efeito: item.efeito
    }));

    return equipmentsList;
  };

  // Use the fetchEquipments function in your useQuery
  const { data: equipments = [] } = useQuery({
    queryKey: ['equipments'],
    queryFn: fetchEquipments
  });
  
  return {
    videos,
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
