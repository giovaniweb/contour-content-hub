
import { supabase } from '@/integrations/supabase/client';
import { VideoMetadata } from '@/types/video-storage';
import { toast } from '@/hooks/use-toast';

/**
 * Updates equipment information for multiple videos
 */
export const batchUpdateEquipment = async (
  videoIds: string[],
  equipmentId: string,
  equipmentName?: string
): Promise<boolean> => {
  try {
    if (!videoIds || videoIds.length === 0 || !equipmentId) {
      toast({
        variant: 'destructive',
        title: 'Falha na atualização',
        description: 'IDs de vídeos ou equipamento inválidos.',
      });
      return false;
    }

    // For each video ID, we need to fetch the current metadata
    for (const videoId of videoIds) {
      const { data, error: fetchError } = await supabase
        .from('videos_storage')
        .select('metadata')
        .eq('id', videoId)
        .single();

      if (fetchError) {
        console.error('Error fetching video metadata:', fetchError);
        continue;
      }

      // Prepare updated metadata - ensure it's a valid object before processing
      // Safely handle currentMetadata to ensure it's an object before spread
      let currentMetadata: Record<string, any> = {};
      
      if (data?.metadata && typeof data.metadata === 'object') {
        // Copy object properties safely
        currentMetadata = Object.assign({}, data.metadata);
      } else if (typeof data?.metadata === 'string') {
        try {
          // Try to parse JSON string
          currentMetadata = JSON.parse(data.metadata);
          // Ensure it's an object
          if (typeof currentMetadata !== 'object' || currentMetadata === null) {
            currentMetadata = {};
          }
        } catch (e) {
          console.error('Invalid metadata JSON string:', e);
          // Keep currentMetadata as empty object
        }
      }
      
      // Create a new object with the necessary equipment properties
      const updatedMetadata = {
        ...currentMetadata,
        equipment_id: equipmentId,
        equipment_name: equipmentName || ''
      };

      // Update the record
      const { error: updateError } = await supabase
        .from('videos_storage')
        .update({
          metadata: updatedMetadata
        })
        .eq('id', videoId);

      if (updateError) {
        console.error('Error updating video metadata:', updateError);
        toast({
          variant: 'destructive',
          title: 'Erro ao atualizar vídeo',
          description: `Não foi possível atualizar o vídeo ${videoId}.`,
        });
        // Continue with other videos even if this one fails
      }
    }

    // Return success if we got this far
    return true;
  } catch (error) {
    console.error('Error in batchUpdateEquipment:', error);
    toast({
      variant: 'destructive',
      title: 'Erro ao atualizar vídeos',
      description: 'Ocorreu um erro ao atualizar os equipamentos dos vídeos.',
    });
    return false;
  }
};
