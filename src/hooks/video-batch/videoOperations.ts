
import { supabase } from '@/integrations/supabase/client';
import { EditableVideo } from './types';
import { toast } from '@/hooks/use-toast';

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

// Don't export batchUpdateEquipment from here to avoid duplicate exports
