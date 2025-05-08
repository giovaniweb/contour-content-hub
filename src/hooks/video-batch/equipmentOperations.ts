
import { supabase } from '@/integrations/supabase/client';
import { VideoMetadataSchema } from '@/types/video-storage';
import { Json } from '@/types/supabase';
import { EditableVideo } from './types';
import { Equipment } from '@/hooks/useEquipments';

/**
 * Updates the equipment association for a video
 */
export const updateEquipmentAssociation = async (
  video: EditableVideo, 
  equipmentId: string,
  equipments: Equipment[]
): Promise<void> => {
  if (equipmentId === 'none') {
    // Remove equipment association
    const metadataObj = {
      ...(video.metadata || {}),
      equipment_id: null
    };
    
    // Validate and convert to plain object
    const validatedMetadata = VideoMetadataSchema.parse(metadataObj);
    // Use JSON.stringify/parse as defensive cleanup to ensure it's a plain JS object
    const metadata = JSON.parse(JSON.stringify(validatedMetadata)) as Json;
    
    await supabase.from('videos_storage')
      .update({
        metadata
      })
      .eq('id', video.id);
      
    // Also remove from videos table if applicable
    await supabase.from('videos')
      .update({
        equipment_id: null,
        equipamentos: []
      })
      .eq('id', video.id);
  } else {
    // Add/update equipment association
    const selectedEquipment = equipments.find(eq => eq.id === equipmentId);
    
    const metadataObj = {
      ...(video.metadata || {}),
      equipment_id: equipmentId
    };
    
    // Validate and convert to plain object
    const validatedMetadata = VideoMetadataSchema.parse(metadataObj);
    // Use JSON.stringify/parse as defensive cleanup to ensure it's a plain JS object
    const metadata = JSON.parse(JSON.stringify(validatedMetadata)) as Json;
    
    await supabase.from('videos_storage')
      .update({
        metadata
      })
      .eq('id', video.id);
      
    // Update videos table if applicable
    if (selectedEquipment) {
      // Check if record exists in videos table
      const { data: existingVideo } = await supabase
        .from('videos')
        .select()
        .eq('id', video.id)
        .single();
        
      if (existingVideo) {
        await supabase.from('videos')
          .update({
            equipment_id: equipmentId,
            equipamentos: [selectedEquipment.nome]
          })
          .eq('id', video.id);
      } else {
        // Create record if it doesn't exist
        // First, get video details from videos_storage
        const { data: videoData } = await supabase
          .from('videos_storage')
          .select('title, description, file_urls, tags')
          .eq('id', video.id)
          .single();
          
        if (videoData) {
          const fileUrls = videoData.file_urls as Record<string, string>;
          await supabase.from('videos')
            .insert({
              id: video.id,
              titulo: videoData.title,
              descricao: videoData.description || '',
              url_video: fileUrls?.original || '',
              equipamentos: [selectedEquipment.nome],
              equipment_id: equipmentId,
              tags: video.editTags || []
            });
        }
      }
    }
  }
};

/**
 * Updates equipment association for multiple videos in batch
 */
export const batchUpdateEquipment = async (
  videoIds: string[],
  equipmentId: string,
  equipments: Equipment[]
): Promise<{successCount: number, failCount: number}> => {
  let successCount = 0;
  let failCount = 0;
  
  const selectedEquipment = equipmentId === 'none' 
    ? null 
    : equipments.find(eq => eq.id === equipmentId);
  
  // Process updates sequentially
  for (const videoId of videoIds) {
    try {
      if (equipmentId === 'none') {
        // Remove equipment association
        const metadataObj = {
          equipment_id: null
        };
        
        // Validate with schema and convert to plain object
        const validatedMetadata = VideoMetadataSchema.parse(metadataObj);
        // Use JSON.stringify/parse as defensive cleanup to ensure it's a plain JS object
        const metadata = JSON.parse(JSON.stringify(validatedMetadata)) as Json;
        
        await supabase.from('videos_storage')
          .update({
            metadata
          })
          .eq('id', videoId);
          
        // Also remove from videos table if applicable
        await supabase.from('videos')
          .update({
            equipment_id: null,
            equipamentos: []
          })
          .eq('id', videoId);
      } else if (selectedEquipment) {
        // Add/update equipment association
        const metadataObj = {
          equipment_id: equipmentId
        };
        
        // Validate with schema and convert to plain object
        const validatedMetadata = VideoMetadataSchema.parse(metadataObj);
        // Use JSON.stringify/parse as defensive cleanup to ensure it's a plain JS object
        const metadata = JSON.parse(JSON.stringify(validatedMetadata)) as Json;
        
        await supabase.from('videos_storage')
          .update({
            metadata
          })
          .eq('id', videoId);
          
        // Check if record exists in videos table
        const { data: existingVideo } = await supabase
          .from('videos')
          .select()
          .eq('id', videoId)
          .single();
          
        if (existingVideo) {
          // For existing videos in the videos table, update the equipment_id
          await supabase.from('videos')
            .update({
              equipment_id: equipmentId,
              equipamentos: [selectedEquipment.nome]
            })
            .eq('id', videoId);
        } else {
          // Create a new entry in the videos table with equipment_id
          // First, get video details from videos_storage
          const { data: videoData } = await supabase
            .from('videos_storage')
            .select('title, description, file_urls, tags')
            .eq('id', videoId)
            .single();
            
          if (videoData) {
            const fileUrls = videoData.file_urls as Record<string, string>;
            await supabase.from('videos')
              .insert({
                id: videoId,
                titulo: videoData.title,
                descricao: videoData.description || '',
                url_video: fileUrls?.original || '',
                equipamentos: [selectedEquipment.nome],
                equipment_id: equipmentId,
                tags: videoData.tags || []
              });
          }
        }
      }
      
      successCount++;
    } catch (error) {
      console.error(`Error updating video ${videoId}:`, error);
      failCount++;
    }
  }
  
  return { successCount, failCount };
};
