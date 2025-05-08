
import { supabase } from '@/integrations/supabase/client';
import { getVideos, updateVideo, deleteVideo } from '@/services/videoStorage';
import { EditableVideo } from './types';
import { Equipment } from '@/hooks/useEquipments';
import { transformToEditableVideos } from './transformUtils';
import { updateEquipmentAssociation } from './equipmentOperations';

/**
 * Loads all videos data and transforms them to editable format
 */
export const loadVideosData = async () => {
  const response = await getVideos();
  
  if (response.error) {
    throw new Error(response.error);
  }
  
  return transformToEditableVideos(response.videos);
};

/**
 * Saves changes to a video
 */
export const saveVideoData = async (
  video: EditableVideo, 
  equipments: Equipment[]
): Promise<void> => {
  // Update video basic info
  const updateResult = await updateVideo(video.id, {
    title: video.editTitle,
    description: video.editDescription,
    tags: video.editTags,
  });
  
  if (!updateResult.success) {
    throw new Error(updateResult.error);
  }
  
  // If equipment changed, update the metadata
  if (video.editEquipmentId !== video.originalEquipmentId) {
    await updateEquipmentAssociation(video, video.editEquipmentId, equipments);
  }
};

/**
 * Deletes a video
 */
export const deleteVideoData = async (videoId: string): Promise<void> => {
  const result = await deleteVideo(videoId);
  
  if (!result.success) {
    throw new Error(result.error);
  }
};
