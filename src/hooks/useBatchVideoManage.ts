
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { EditableVideo, UseBatchVideoManageResult } from './video-batch/types';
import { transformStoredVideosToEditable } from './video-batch/transformUtils';
import { batchDeleteVideos } from './video-batch/videoOperations';
import { batchUpdateEquipment } from './video-batch/equipmentOperations';
import { Equipment } from '@/types/equipment';

export const useBatchVideoManage = (): UseBatchVideoManageResult => {
  const [videos, setVideos] = useState<EditableVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [batchEquipmentId, setBatchEquipmentId] = useState('');
  const [showBatchEditDialog, setShowBatchEditDialog] = useState(false);
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  const { toast } = useToast();
  const { user } = useAuth();

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('videos_storage')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the videos to our editable format
      const editableVideos = transformStoredVideosToEditable(data || []);
      setVideos(editableVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar vídeos',
        description: 'Não foi possível carregar os vídeos. Tente novamente mais tarde.'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load equipments for the dropdown
  const loadEquipments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('equipamentos')
        .select('*')
        .order('nome');

      if (error) {
        throw error;
      }

      setEquipments(data || []);
    } catch (error) {
      console.error('Error loading equipments:', error);
    }
  }, []);

  useEffect(() => {
    loadVideos();
    loadEquipments();
  }, [loadVideos, loadEquipments]);

  // Video selection handlers
  const handleSelectAll = () => {
    if (selectedVideos.length === videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map(video => video.id));
    }
  };

  const handleSelect = (videoId: string) => {
    setSelectedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId) 
        : [...prev, videoId]
    );
  };

  // Video editing handlers
  const handleEdit = (videoId: string) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === videoId 
          ? { ...video, isEditing: true } 
          : video
      )
    );
  };

  const handleUpdate = (index: number, updates: Partial<EditableVideo>) => {
    setVideos(prev => {
      const newVideos = [...prev];
      newVideos[index] = { ...newVideos[index], ...updates };
      return newVideos;
    });
  };

  const handleSave = async (videoId: string) => {
    try {
      const videoIndex = videos.findIndex(v => v.id === videoId);
      if (videoIndex === -1) return;

      const video = videos[videoIndex];
      const { error } = await supabase
        .from('videos_storage')
        .update({
          title: video.editTitle,
          description: video.editDescription,
          tags: video.editTags,
          metadata: {
            ...video.metadata,
            equipment_id: video.editEquipmentId
          }
        })
        .eq('id', videoId);

      if (error) throw error;

      setVideos(prev => 
        prev.map(v => 
          v.id === videoId 
            ? { 
                ...v, 
                title: v.editTitle, 
                description: v.editDescription,
                tags: v.editTags,
                isEditing: false,
                metadata: {
                  ...v.metadata,
                  equipment_id: v.editEquipmentId
                }
              } 
            : v
        )
      );

      toast({
        title: 'Vídeo atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as alterações. Tente novamente.'
      });
    }
  };

  const handleCancel = (videoId: string) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === videoId 
          ? { ...video, isEditing: false, editTitle: video.title, editDescription: video.description || '', editTags: video.tags || [], editEquipmentId: video.originalEquipmentId || '' } 
          : video
      )
    );
  };

  const handleDelete = async (videoId: string) => {
    try {
      const success = await batchDeleteVideos([videoId]);

      if (!success) {
        throw new Error('Failed to delete video');
      }

      setVideos(prev => prev.filter(video => video.id !== videoId));
      toast({
        title: 'Vídeo excluído',
        description: 'O vídeo foi excluído com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o vídeo. Tente novamente.'
      });
    }
  };

  const handleBatchDelete = async () => {
    if (selectedVideos.length === 0) return;

    try {
      const success = await batchDeleteVideos(selectedVideos);

      if (!success) {
        throw new Error('Failed to delete videos');
      }

      setVideos(prev => prev.filter(video => !selectedVideos.includes(video.id)));
      setSelectedVideos([]);
      toast({
        title: 'Vídeos excluídos',
        description: `${selectedVideos.length} vídeos foram excluídos com sucesso.`,
      });
    } catch (error) {
      console.error('Error batch deleting videos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir os vídeos. Tente novamente.'
      });
    }
  };

  const handleBatchEquipmentUpdate = async () => {
    if (selectedVideos.length === 0 || !batchEquipmentId) return;

    try {
      // Find equipment name from equipments list
      const equipment = equipments.find(eq => eq.id === batchEquipmentId);
      const equipmentName = equipment?.nome;

      const success = await batchUpdateEquipment(
        selectedVideos, 
        batchEquipmentId,
        equipmentName
      );

      if (!success) {
        throw new Error('Failed to update videos');
      }

      // Update local state
      setVideos(prev => 
        prev.map(video => 
          selectedVideos.includes(video.id) 
            ? { 
                ...video, 
                editEquipmentId: batchEquipmentId,
                originalEquipmentId: batchEquipmentId,
                metadata: {
                  ...video.metadata,
                  equipment_id: batchEquipmentId,
                  equipment_name: equipmentName
                }
              } 
            : video
        )
      );
      
      setShowBatchEditDialog(false);
      toast({
        title: 'Equipamentos atualizados',
        description: `${selectedVideos.length} vídeos foram atualizados com sucesso.`,
      });
    } catch (error) {
      console.error('Error batch updating videos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar os vídeos. Tente novamente.'
      });
    }
  };

  const isAdmin = () => {
    // Simple admin check based on user email
    return user?.email?.endsWith('@admin.com') || true; // For demo purposes, all users are admins
  };

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
