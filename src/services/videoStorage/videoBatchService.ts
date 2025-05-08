
import { supabase } from '@/integrations/supabase/client';
import { VideoQueueItem } from '@/types/video-storage';
import { uploadVideo } from './videoUploadService';

/**
 * Upload multiple videos in batch
 */
export async function batchUploadVideos(
  queue: VideoQueueItem[],
  onProgress: (index: number, progress: number) => void,
  onItemComplete: (index: number, success: boolean, videoId?: string, error?: string) => void
): Promise<{success: boolean, completed: number, failed: number}> {
  let completed = 0;
  let failed = 0;
  
  // Process videos sequentially to avoid overloading the server
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    
    try {
      // Skip items that are already processed or failed
      if (item.status === 'completed' || item.status === 'error') {
        continue;
      }
      
      // Generate tags based on equipment if selected
      let tags: string[] = [];
      let equipmentId = item.equipmentId === 'none' ? null : item.equipmentId;
      
      // Only fetch equipment info if equipment ID is provided
      if (equipmentId) {
        try {
          const { data: equipmentData, error } = await supabase
            .from('equipamentos')
            .select('nome')
            .eq('id', equipmentId)
            .single();
            
          if (!error && equipmentData) {
            tags.push(equipmentData.nome);
          }
        } catch (error) {
          console.error('Error fetching equipment info:', error);
        }
      }
      
      // Upload the video
      const result = await uploadVideo(
        item.file,
        item.title,
        item.description,
        tags,
        (progress) => onProgress(i, progress),
        false // Default to private videos in batch upload
      );
      
      if (result.success && result.videoId) {
        // If equipment ID was provided, link the video to it
        if (equipmentId) {
          try {
            await supabase.from('videos_storage')
              .update({ 
                metadata: { 
                  equipment_id: equipmentId,
                  original_filename: item.file.name
                } 
              })
              .eq('id', result.videoId);
          } catch (error) {
            console.error('Error linking video to equipment:', error);
          }
        }
        
        completed++;
        onItemComplete(i, true, result.videoId);
      } else {
        failed++;
        onItemComplete(i, false, undefined, result.error);
      }
    } catch (error) {
      console.error(`Error processing item ${i}:`, error);
      failed++;
      onItemComplete(i, false, undefined, 'Erro inesperado no processamento');
    }
  }
  
  return {
    success: failed === 0,
    completed,
    failed
  };
}
