
import { supabase } from '@/integrations/supabase/client';
import { VideoMetadata } from '@/types/video-storage';
import { toast } from '@/hooks/use-toast';

/**
 * Updates equipment association for multiple videos
 */
export const batchUpdateEquipment = async (
  videoIds: string[],
  equipmentId: string,
  equipmentName?: string
): Promise<boolean> => {
  try {
    if (!videoIds || videoIds.length === 0 || !equipmentId) {
      return false;
    }

    // Fetch the current videos to update their metadata
    const { data: videos, error: fetchError } = await supabase
      .from('videos_storage')
      .select('id, metadata')
      .in('id', videoIds);

    if (fetchError) {
      console.error('Error fetching videos for equipment update:', fetchError);
      throw fetchError;
    }

    // For each video, update the metadata
    const updates = videos.map(video => {
      let currentMetadata: VideoMetadata = {};
      
      // Handle different metadata formats
      if (video.metadata) {
        if (typeof video.metadata === 'object') {
          currentMetadata = video.metadata as VideoMetadata;
        } else if (typeof video.metadata === 'string') {
          try {
            currentMetadata = JSON.parse(video.metadata) as VideoMetadata;
          } catch (e) {
            console.error('Error parsing metadata string:', e);
          }
        }
      }

      // Update equipment information
      const updatedMetadata: VideoMetadata = {
        ...currentMetadata,
        equipment_id: equipmentId,
        equipment_name: equipmentName
      };

      return {
        id: video.id,
        metadata: updatedMetadata
      };
    });

    // Batch update all videos
    for (const update of updates) {
      const { error } = await supabase
        .from('videos_storage')
        .update({ metadata: update.metadata })
        .eq('id', update.id);

      if (error) {
        console.error(`Error updating video ${update.id} equipment:`, error);
        toast({
          title: 'Erro ao atualizar equipamento',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in batchUpdateEquipment:', error);
    return false;
  }
};
