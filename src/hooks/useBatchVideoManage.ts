
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useEquipments } from '@/hooks/useEquipments';
import { StoredVideo, VideoMetadata } from '@/types/video-storage';
import { getVideos, updateVideo, deleteVideo } from '@/services/videoStorageService';
import { usePermissions } from '@/hooks/use-permissions';
import { supabase } from '@/integrations/supabase/client';

interface EditableVideo extends StoredVideo {
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  editEquipmentId: string;
  editTags: string[];
  originalEquipmentId?: string;
}

export const useBatchVideoManage = () => {
  const { toast } = useToast();
  const { isAdmin } = usePermissions();
  const { equipments } = useEquipments();
  
  const [videos, setVideos] = useState<EditableVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [batchEquipmentId, setBatchEquipmentId] = useState<string>('');
  const [showBatchEditDialog, setShowBatchEditDialog] = useState(false);

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
      const response = await getVideos();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Transform videos to add editing state
      const editableVideos: EditableVideo[] = response.videos.map(video => {
        // Extract equipment ID from metadata
        let equipmentId = 'none';
        if (video.metadata) {
          const metadata = video.metadata as VideoMetadata;
          if (metadata.equipment_id) {
            equipmentId = metadata.equipment_id;
          }
        }
        
        return {
          ...video,
          isEditing: false,
          editTitle: video.title,
          editDescription: video.description || '',
          editTags: [...video.tags],
          editEquipmentId: equipmentId,
          originalEquipmentId: equipmentId === 'none' ? undefined : equipmentId
        };
      });
      
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
      // Update video basic info
      const updateResult = await updateVideo(videoId, {
        title: video.editTitle,
        description: video.editDescription,
        tags: video.editTags,
      });
      
      if (!updateResult.success) {
        throw new Error(updateResult.error);
      }
      
      // If equipment changed, update the metadata
      if (video.editEquipmentId !== video.originalEquipmentId) {
        if (video.editEquipmentId === 'none') {
          // Remove equipment association
          await supabase.from('videos_storage')
            .update({
              metadata: {
                ...(video.metadata || {}),
                equipment_id: null
              }
            })
            .eq('id', videoId);
            
          // Also remove from videos table if applicable
          await supabase.from('videos')
            .update({
              equipment_id: null
            })
            .eq('id', videoId);
        } else {
          // Add/update equipment association
          const selectedEquipment = equipments.find(eq => eq.id === video.editEquipmentId);
          
          await supabase.from('videos_storage')
            .update({
              metadata: {
                ...(video.metadata || {}),
                equipment_id: video.editEquipmentId
              }
            })
            .eq('id', videoId);
            
          // Update videos table if applicable
          if (selectedEquipment) {
            // Check if record exists in videos table
            const { data: existingVideo } = await supabase
              .from('videos')
              .select()
              .eq('id', videoId)
              .single();
              
            if (existingVideo) {
              await supabase.from('videos')
                .update({
                  equipment_id: video.editEquipmentId,
                  equipamentos: [selectedEquipment.nome]
                })
                .eq('id', videoId);
            } else {
              // Create record if it doesn't exist
              // First, get video details from videos_storage
              const { data: videoData } = await supabase
                .from('videos_storage')
                .select('title, description, file_urls')
                .eq('id', videoId)
                .single();
                
              if (videoData) {
                const fileUrls = videoData.file_urls as Record<string, string>;
                await supabase.from('videos')
                  .insert({
                    id: videoId,
                    titulo: videoData.title,
                    descricao: videoData.description || '',
                    url_video: fileUrls?.original || '',
                    equipamentos: [selectedEquipment.nome],
                    equipment_id: video.editEquipmentId
                  });
              }
            }
          }
        }
      }
      
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
      const result = await deleteVideo(videoId);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
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
        const result = await deleteVideo(videoId);
        
        if (result.success) {
          successCount++;
        } else {
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
      let successCount = 0;
      let failCount = 0;
      
      const selectedEquipment = batchEquipmentId === 'none' 
        ? null 
        : equipments.find(eq => eq.id === batchEquipmentId);
      
      // Process updates sequentially
      for (const videoId of selectedVideos) {
        try {
          if (batchEquipmentId === 'none') {
            // Remove equipment association
            await supabase.from('videos_storage')
              .update({
                metadata: {
                  equipment_id: null
                }
              })
              .eq('id', videoId);
              
            // Also remove from videos table if applicable
            await supabase.from('videos')
              .update({
                equipment_id: null,
                equipamentos: []
              })
              .eq('id', videoId);
          } else if (selectedEquipment) {
            // Add/update equipment association
            await supabase.from('videos_storage')
              .update({
                metadata: {
                  equipment_id: batchEquipmentId
                }
              })
              .eq('id', videoId);
              
            // Check if record exists in videos table
            const { data: existingVideo } = await supabase
              .from('videos')
              .select()
              .eq('id', videoId)
              .single();
              
            if (existingVideo) {
              // For existing videos in the videos table, update the equipment_id
              await supabase.from('videos')
                .update({
                  equipment_id: batchEquipmentId,
                  equipamentos: [selectedEquipment.nome]
                })
                .eq('id', videoId);
            } else {
              // Create a new entry in the videos table with equipment_id
              // First, get video details from videos_storage
              const { data: videoData } = await supabase
                .from('videos_storage')
                .select('title, description, file_urls')
                .eq('id', videoId)
                .single();
                
              if (videoData) {
                const fileUrls = videoData.file_urls as Record<string, string>;
                await supabase.from('videos')
                  .insert({
                    id: videoId,
                    titulo: videoData.title,
                    descricao: videoData.description || '',
                    url_video: fileUrls?.original || '',
                    equipamentos: [selectedEquipment.nome],
                    equipment_id: batchEquipmentId
                  });
              }
            }
          }
          
          successCount++;
        } catch (error) {
          console.error(`Error updating video ${videoId}:`, error);
          failCount++;
        }
      }
      
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
