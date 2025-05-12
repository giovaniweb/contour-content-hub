
import { supabase } from '@/integrations/supabase/client';
import { 
  StoredVideo, 
  VideoFilterOptions, 
  VideoSortOptions 
} from '@/types/video-storage';
import { Json } from '@/types/supabase';

/**
 * Get videos with optional filtering and sorting
 */
export async function getVideos(
  filters?: VideoFilterOptions,
  sort?: VideoSortOptions,
  page: number = 1,
  pageSize: number = 10
): Promise<{ videos: StoredVideo[]; total: number; error?: string }> {
  try {
    let query = supabase
      .from('videos_storage')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (filters) {
      if (filters.search && filters.search.trim() !== '') {
        query = query.ilike('title', `%${filters.search}%`);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }
      
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }
      
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString());
      }
      
      if (filters.owner) {
        query = query.eq('owner_id', filters.owner);
      }
    }
    
    // Apply sorting
    if (sort) {
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    return {
      videos: data as StoredVideo[],
      total: count || 0
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return {
      videos: [],
      total: 0,
      error: 'Failed to fetch videos. Please try again.'
    };
  }
}

/**
 * Get a specific video by ID
 */
export async function getVideoById(id: string): Promise<{ video: StoredVideo | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('videos_storage')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      video: data as StoredVideo
    };
  } catch (error) {
    console.error(`Error fetching video with ID ${id}:`, error);
    return {
      video: null,
      error: 'Failed to fetch video details. Please try again.'
    };
  }
}

/**
 * Get videos owned by the current user
 */
export async function getMyVideos(
  filters?: VideoFilterOptions,
  sort?: VideoSortOptions,
  page: number = 1,
  pageSize: number = 10
): Promise<{ videos: StoredVideo[]; total: number; error?: string }> {
  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    // Add owner filter to get only user's videos
    const userFilters: VideoFilterOptions = {
      ...filters,
      owner: user.user.id
    };
    
    return getVideos(userFilters, sort, page, pageSize);
  } catch (error) {
    console.error('Error fetching user videos:', error);
    return {
      videos: [],
      total: 0,
      error: 'Failed to fetch your videos. Please try again.'
    };
  }
}

/**
 * Update video metadata
 */
export async function updateVideo(id: string, updates: Partial<StoredVideo>): Promise<{ success: boolean; error?: string }> {
  try {
    // Remove properties that don't match the database schema
    const { file_urls, download_files, url, metadata, ...validUpdates } = updates;
    
    // Handle file_urls separately if it exists
    let fileUrlsUpdate = {};
    if (file_urls) {
      fileUrlsUpdate = {
        file_urls: file_urls as unknown as Json
      };
    }
    
    // Handle metadata separately if it exists
    let metadataUpdate = {};
    if (metadata) {
      metadataUpdate = {
        metadata: metadata as unknown as Json
      };
    }
    
    const { error } = await supabase
      .from('videos_storage')
      .update({
        ...validUpdates,
        ...fileUrlsUpdate,
        ...metadataUpdate,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating video with ID ${id}:`, error);
    return {
      success: false,
      error: 'Failed to update video. Please try again.'
    };
  }
}

/**
 * Delete a video
 */
export async function deleteVideo(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('videos_storage')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting video with ID ${id}:`, error);
    return {
      success: false,
      error: 'Failed to delete video. Please try again.'
    };
  }
}
