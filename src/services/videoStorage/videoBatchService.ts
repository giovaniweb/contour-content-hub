
import { supabase } from '@/integrations/supabase/client';
import { StoredVideo } from '@/types/video-storage';

/**
 * Import a batch of videos from external sources (like Vimeo)
 */
export async function batchImportVideos(
  source: 'vimeo' | 'youtube',
  options?: {
    tags?: string[];
    public?: boolean;
  }
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    // Call the appropriate batch import function based on source
    if (source === 'vimeo') {
      const { error } = await supabase.functions.invoke('vimeo-batch-import', {
        body: { 
          tags: options?.tags || [],
          makePublic: options?.public || false
        }
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } else {
      return { 
        success: false,
        error: `Import from ${source} is not supported yet` 
      };
    }
  } catch (error) {
    console.error(`Error batch importing from ${source}:`, error);
    return { 
      success: false,
      error: `Failed to import videos: ${error.message || 'Unknown error'}` 
    };
  }
}

/**
 * Delete multiple videos at once
 */
export async function bulkDeleteVideos(
  videoIds: string[]
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    // Verify user has permission to delete these videos
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Authentication required' };
    }
    
    let successCount = 0;
    let errors = [];
    
    // Delete each video individually to ensure proper cleanup
    for (const videoId of videoIds) {
      try {
        // First check if user owns this video
        const { data, error: checkError } = await supabase
          .from('videos_storage')
          .select('id')
          .eq('id', videoId)
          .eq('owner_id', user.user.id)
          .single();
          
        if (checkError || !data) {
          errors.push(`No permission to delete video ${videoId}`);
          continue;
        }
        
        // Now attempt to delete the video
        // 1. Remove files from storage
        const { data: files } = await supabase.storage
          .from('videos')
          .list(videoId);
          
        if (files && files.length > 0) {
          const filePaths = files.map(file => `${videoId}/${file.name}`);
          await supabase.storage.from('videos').remove(filePaths);
        }
        
        // 2. Delete database record
        const { error: deleteError } = await supabase
          .from('videos_storage')
          .delete()
          .eq('id', videoId);
          
        if (deleteError) {
          errors.push(`Error deleting video ${videoId}: ${deleteError.message}`);
          continue;
        }
        
        successCount++;
      } catch (e) {
        errors.push(`Error processing video ${videoId}: ${e.message}`);
      }
    }
    
    return { 
      success: errors.length === 0,
      count: successCount,
      error: errors.length > 0 ? `Deleted ${successCount} of ${videoIds.length} videos. Errors: ${errors.join('; ')}` : undefined
    };
    
  } catch (error) {
    console.error('Error bulk deleting videos:', error);
    return { 
      success: false,
      error: `Failed to bulk delete videos: ${error.message || 'Unknown error'}` 
    };
  }
}

/**
 * Update metadata for multiple videos at once
 */
export async function bulkUpdateVideos(
  videoIds: string[],
  updates: {
    title?: string;
    description?: string;
    tags?: string[];
    public?: boolean;
  }
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    // Verify user has permission
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Authentication required' };
    }
    
    // Check if there's anything to update
    if (!updates.title && !updates.description && !updates.tags && updates.public === undefined) {
      return { success: false, error: 'No update fields specified' };
    }
    
    // Prepare update object with only provided fields
    const updateData = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.public !== undefined) updateData.public = updates.public;
    
    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();
    
    // Update all videos that match the IDs and are owned by the user
    const { data, error } = await supabase
      .from('videos_storage')
      .update(updateData)
      .in('id', videoIds)
      .eq('owner_id', user.user.id);
      
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { 
      success: true,
      count: videoIds.length // Assuming all were updated
    };
  } catch (error) {
    console.error('Error bulk updating videos:', error);
    return { 
      success: false,
      error: `Failed to bulk update videos: ${error.message || 'Unknown error'}` 
    };
  }
}
