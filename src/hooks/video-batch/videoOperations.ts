import { supabase } from '@/integrations/supabase/client';
import { EditableVideo } from './types';
import { transformVideosToEditableVideos } from './transformUtils';
import { saveVideoEquipment, batchUpdateEquipment } from './equipmentOperations';

// Existing export from your file
export const loadVideosData = async () => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Transform to EditableVideo format
    return transformVideosToEditableVideos(data || []);
  } catch (error) {
    console.error('Error loading videos data:', error);
    throw error;
  }
};

export const saveVideoData = async (video: EditableVideo, equipments: any[]) => {
  try {
    // Prepare update data
    const updateData = {
      titulo: video.editTitle,
      descricao_curta: video.editDescription,
      tags: video.editTags,
      equipment_id: video.editEquipmentId === 'none' ? null : video.editEquipmentId
    };
    
    // Update video record
    const { error } = await supabase
      .from('videos')
      .update(updateData)
      .eq('id', video.id);
    
    if (error) {
      throw error;
    }
    
    // If equipment changed, update equipment relationship
    if (video.originalEquipmentId !== video.editEquipmentId) {
      await saveVideoEquipment(
        video.id, 
        video.editEquipmentId === 'none' ? null : video.editEquipmentId
      );
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error saving video:', error);
    return { success: false, error: error.message };
  }
};

export const deleteVideoData = async (videoId: string) => {
  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting video:', error);
    return { success: false, error: error.message };
  }
};

// Add the missing batchDeleteVideos function
export const batchDeleteVideos = async (videoIds: string[]) => {
  try {
    const { data, error, count } = await supabase
      .from('videos')
      .delete()
      .in('id', videoIds)
      .select();
    
    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { 
      success: true, 
      affectedCount: count || videoIds.length 
    };
  } catch (error: any) {
    console.error('Error in batch delete:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete videos'
    };
  }
};

// Export batchUpdateEquipment from here as well to fix the import issue
export { batchUpdateEquipment };
