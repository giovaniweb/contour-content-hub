
import { supabase } from '@/integrations/supabase/client';
import { StoredVideo } from '@/types/video-storage';
import { Json } from '@/types/supabase';

export async function loadVideos(
  options?: {
    search?: string;
    status?: string[];
    page?: number;
    pageSize?: number;
  }
): Promise<{ 
  success: boolean; 
  data?: StoredVideo[]; 
  total?: number; 
  error?: string 
}> {
  try {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    let query = supabase
      .from('videos_storage')
      .select('*', { count: 'exact' });
    
    if (options?.search) {
      query = query.ilike('title', `%${options.search}%`);
    }
    
    if (options?.status && options.status.length > 0) {
      query = query.in('status', options.status);
    }
    
    query = query
      .order('created_at', { ascending: false })
      .range(start, end);
    
    const { data, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      data: data as StoredVideo[],
      total: count || 0
    };
  } catch (error) {
    console.error('Error loading videos:', error);
    return {
      success: false,
      error: error.message || 'Failed to load videos'
    };
  }
}

export async function updateVideoMetadata(
  videoId: string,
  updates: Partial<StoredVideo>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Remove properties that don't match the database schema
    const { file_urls, download_files, url, ...validUpdates } = updates;
    
    // Handle file_urls separately if it exists
    let fileUrlsUpdate = {};
    if (file_urls) {
      fileUrlsUpdate = {
        file_urls: file_urls as unknown as Json
      };
    }
    
    const { error } = await supabase
      .from('videos_storage')
      .update({
        ...validUpdates,
        ...fileUrlsUpdate,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating video:', error);
    return {
      success: false,
      error: error.message || 'Failed to update video'
    };
  }
}

export async function batchUpdateVideos(
  videoIds: string[],
  updates: Partial<StoredVideo>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Remove properties that don't match the database schema
    const { file_urls, download_files, url, ...validUpdates } = updates;
    
    // Handle file_urls separately if it exists
    let fileUrlsUpdate = {};
    if (file_urls) {
      fileUrlsUpdate = {
        file_urls: file_urls as unknown as Json
      };
    }
    
    // Update each video one by one (Supabase doesn't support batch updates)
    for (const videoId of videoIds) {
      const { error } = await supabase
        .from('videos_storage')
        .update({
          ...validUpdates,
          ...fileUrlsUpdate,
          updated_at: new Date().toISOString()
        })
        .eq('id', videoId);
      
      if (error) {
        throw error;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error batch updating videos:', error);
    return {
      success: false,
      error: error.message || 'Failed to update videos'
    };
  }
}

export async function deleteVideoBatch(
  videoIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete each video one by one (Supabase doesn't support batch deletes with complex conditions)
    for (const videoId of videoIds) {
      const { error } = await supabase
        .from('videos_storage')
        .delete()
        .eq('id', videoId);
      
      if (error) {
        throw error;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting videos:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete videos'
    };
  }
}
