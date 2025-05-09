import { supabase } from '@/integrations/supabase/client';
import { EditableVideo } from './types';
import { VideoMetadataSchema } from '@/types/video-storage';

// Create a VideoMetadataSchema constant since it should be a value, not just a type
const VideoMetadataSchemaValue = {
  equipment_id: "",
  equipment_name: ""
};

export const updateEquipmentAssociationForVideo = async (videoId: string, equipmentId: string, equipmentName: string) => {
  try {
    // Get current video data to extract existing metadata
    const { data: videoData, error: fetchError } = await supabase
      .from('videos_storage')
      .select('metadata')
      .eq('id', videoId)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    // Create updated metadata
    const existingMetadata = videoData?.metadata || {};
    const updatedMetadata = {
      ...existingMetadata,
      equipment_id: equipmentId,
      equipment_name: equipmentName
    };
    
    // Update video with new metadata
    const { error: updateError } = await supabase
      .from('videos_storage')
      .update({ metadata: updatedMetadata })
      .eq('id', videoId);
      
    if (updateError) {
      throw updateError;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating equipment association:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const removeEquipmentAssociationFromVideo = async (videoId: string) => {
  try {
    // Get current video data to extract existing metadata
    const { data: videoData, error: fetchError } = await supabase
      .from('videos_storage')
      .select('metadata')
      .eq('id', videoId)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    // Create updated metadata without equipment info
    const existingMetadata = videoData?.metadata || {};
    const { equipment_id, equipment_name, ...restMetadata } = existingMetadata;
    
    // Update video with new metadata
    const { error: updateError } = await supabase
      .from('videos_storage')
      .update({ metadata: restMetadata })
      .eq('id', videoId);
      
    if (updateError) {
      throw updateError;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error removing equipment association:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const updateEquipmentAssociation = async (videoId: string, equipmentId: string, equipmentName: string) => {
  // Check if we're removing equipment
  if (!equipmentId) {
    return removeEquipmentAssociationFromVideo(videoId);
  }
  
  // Otherwise update with new equipment
  return updateEquipmentAssociationForVideo(videoId, equipmentId, equipmentName);
};

export const batchUpdateEquipmentAssociation = async (videoIds: string[], equipmentId: string, equipmentName: string) => {
  try {
    let successCount = 0;
    let failCount = 0;
    
    // Process each video one by one
    for (const videoId of videoIds) {
      const result = await updateEquipmentAssociation(videoId, equipmentId, equipmentName);
      
      if (result.success) {
        successCount++;
      } else {
        failCount++;
        console.error(`Failed to update equipment for video ${videoId}:`, result.error);
      }
    }
    
    return {
      success: failCount === 0,
      error: failCount > 0 ? `Failed to update ${failCount} videos` : undefined,
      successCount,
      failCount,
      affectedCount: successCount
    };
  } catch (error) {
    console.error("Error in batch equipment update:", error);
    return {
      success: false,
      error: (error as Error).message,
      successCount: 0,
      failCount: videoIds.length,
      affectedCount: 0
    };
  }
};

export const getEquipmentFromVideo = (video: EditableVideo) => {
  return {
    id: video.metadata?.equipment_id || '',
    name: video.metadata?.equipment_name || ''
  };
};
