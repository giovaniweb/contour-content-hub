
import { supabase } from '@/integrations/supabase/client';
import type { EditableVideo } from './types';

export const loadVideosData = async () => {
  try {
    const { data, error } = await supabase
      .from('videos_storage')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Error loading videos:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const saveVideoData = async (videoId: string, updates: Partial<EditableVideo>) => {
  try {
    // Extract only updatable fields
    const { title, description, tags, metadata } = updates;
    
    const { error } = await supabase
      .from('videos_storage')
      .update({ 
        title, 
        description, 
        tags,
        metadata
      })
      .eq('id', videoId);
      
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error saving video:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const deleteVideo = async (videoId: string) => {
  try {
    const { error } = await supabase
      .from('videos_storage')
      .delete()
      .eq('id', videoId);
      
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting video:", error);
    return { success: false, error: (error as Error).message };
  }
};

// Alias for backward compatibility
export const deleteVideoData = deleteVideo;
