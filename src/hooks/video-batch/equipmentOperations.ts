
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
    for (const video of videos) {
      // Create a proper typed metadata object
      let typedMetadata: VideoMetadata = {};
      
      // If existing metadata is present, parse it safely
      if (video.metadata) {
        if (typeof video.metadata === 'object') {
          typedMetadata = video.metadata as unknown as VideoMetadata;
        } else if (typeof video.metadata === 'string') {
          try {
            typedMetadata = JSON.parse(video.metadata) as VideoMetadata;
          } catch (e) {
            console.error('Error parsing metadata string:', e);
          }
        }
      }

      // Update equipment information
      const updatedMetadata: Record<string, any> = {
        ...typedMetadata,
        equipment_id: equipmentId,
        equipment_name: equipmentName
      };

      // Update the database
      const { error } = await supabase
        .from('videos_storage')
        .update({ metadata: updatedMetadata })
        .eq('id', video.id);

      if (error) {
        console.error(`Error updating video ${video.id} equipment:`, error);
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
