
import { supabase } from '@/integrations/supabase/client';
import { EditableVideo } from './types';
import { toast } from '@/hooks/use-toast';

/**
 * Batch update equipment for multiple videos
 */
export const batchUpdateEquipment = async (
  videoIds: string[], 
  equipmentId: string,
  equipmentName?: string
): Promise<boolean> => {
  try {
    if (!videoIds || videoIds.length === 0) {
      return false;
    }

    // For each video ID, update the metadata with the new equipment
    for (const id of videoIds) {
      const { data: video, error: fetchError } = await supabase
        .from('videos_storage')
        .select('metadata')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error(`Error fetching video ${id}:`, fetchError);
        continue;
      }

      // Prepare updated metadata
      const metadata = video?.metadata || {};
      const updatedMetadata = {
        ...metadata,
        equipment_id: equipmentId,
        equipment_name: equipmentName
      };

      // Update the video record
      const { error: updateError } = await supabase
        .from('videos_storage')
        .update({ metadata: updatedMetadata })
        .eq('id', id);

      if (updateError) {
        console.error(`Error updating video ${id}:`, updateError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in batchUpdateEquipment:', error);
    return false;
  }
};

/**
 * Deletes multiple videos by their IDs
 */
export const batchDeleteVideos = async (videoIds: string[]): Promise<boolean> => {
  try {
    if (!videoIds || videoIds.length === 0) {
      return false;
    }

    const { error } = await supabase
      .from('videos_storage')
      .delete()
      .in('id', videoIds);

    if (error) {
      console.error('Error deleting videos:', error);
      toast({
        title: 'Erro ao excluir vídeos',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in batchDeleteVideos:', error);
    return false;
  }
};

// Re-export other functions
export * from './basicVideoOperations';
