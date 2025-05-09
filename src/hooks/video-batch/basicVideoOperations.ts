
import { supabase } from '@/integrations/supabase/client';
import { EditableVideo, BatchActionResult } from './types';
import { updateEquipmentInfo } from './equipmentOperations';

export const saveVideoChanges = async (video: EditableVideo): Promise<BatchActionResult> => {
  try {
    // Update basic video properties
    const { error } = await supabase
      .from('videos_storage')
      .update({
        title: video.editTitle,
        description: video.editDescription,
        tags: video.editTags
      })
      .eq('id', video.id);
      
    if (error) {
      console.error('Error updating video:', error);
      return { success: false, error: 'Falha ao atualizar informações do vídeo.' };
    }
    
    // If equipment changed, update metadata
    if (video.editEquipmentId !== video.originalEquipmentId) {
      const result = await updateEquipmentInfo(video.id, video.editEquipmentId);
      if (!result.success) {
        return { success: false, error: result.error };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in saveVideoChanges:', error);
    return { success: false, error: 'Ocorreu um erro inesperado ao salvar mudanças.' };
  }
};

export const deleteVideo = async (videoId: string): Promise<BatchActionResult> => {
  try {
    const { error } = await supabase
      .from('videos_storage')
      .delete()
      .eq('id', videoId);
      
    if (error) {
      console.error('Error deleting video:', error);
      return { success: false, error: 'Falha ao excluir vídeo.' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in deleteVideo:', error);
    return { success: false, error: 'Ocorreu um erro inesperado ao excluir vídeo.' };
  }
};

export const deleteVideos = async (videoIds: string[]): Promise<BatchActionResult> => {
  try {
    const { error, count } = await supabase
      .from('videos_storage')
      .delete({ count: 'exact' })
      .in('id', videoIds);
      
    if (error) {
      console.error('Error batch deleting videos:', error);
      return { success: false, error: 'Falha ao excluir vídeos.' };
    }
    
    return { 
      success: true, 
      affectedCount: count || 0 
    };
  } catch (error) {
    console.error('Error in deleteVideos:', error);
    return { success: false, error: 'Ocorreu um erro inesperado ao excluir vídeos em lote.' };
  }
};
