import { supabase } from '@/integrations/supabase/client';
import { EditableVideo } from './types';
import type { VideoMetadataSchema } from '@/types/video-storage';

// Define as a constant object to use as value
const VIDEO_METADATA_SCHEMA = {
  equipment_id: '',
  equipment_name: ''
};

export const updateEquipmentInfo = async (videoId: string, equipmentId: string, originalEquipmentId?: string) => {
  try {
    if (!videoId || !equipmentId || equipmentId === 'none') {
      return { success: false, error: 'ID de equipamento inválido' };
    }

    // Get equipment details
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipamentos')
      .select('nome')
      .eq('id', equipmentId)
      .single();

    if (equipmentError) {
      console.error('Error fetching equipment:', equipmentError);
      return { success: false, error: 'Erro ao buscar detalhes do equipamento' };
    }

    // Create metadata update
    const metadataUpdate = {
      equipment_id: equipmentId,
      equipment_name: equipment?.nome || ''
    };

    // Update video
    const { error } = await supabase
      .from('videos_storage')
      .update({
        metadata: metadataUpdate
      })
      .eq('id', videoId);

    if (error) {
      console.error('Error updating video metadata:', error);
      return { success: false, error: 'Erro ao atualizar metadados do vídeo' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateEquipmentInfo:', error);
    return { success: false, error: 'Erro ao atualizar informações do equipamento' };
  }
};

export const batchUpdateEquipment = async (videoIds: string[], equipmentId: string): Promise<{ success: boolean, error?: string }> => {
  try {
    if (!equipmentId || equipmentId === 'none') {
      return { success: false, error: 'ID de equipamento inválido' };
    }

    // Get equipment details
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipamentos')
      .select('nome')
      .eq('id', equipmentId)
      .single();

    if (equipmentError) {
      console.error('Error fetching equipment:', equipmentError);
      return { success: false, error: 'Erro ao buscar detalhes do equipamento' };
    }

    // Update all videos
    for (const videoId of videoIds) {
      // Create metadata update
      const metadataUpdate = {
        equipment_id: equipmentId,
        equipment_name: equipment?.nome || ''
      };

      const { error } = await supabase
        .from('videos_storage')
        .update({
          metadata: metadataUpdate
        })
        .eq('id', videoId);

      if (error) {
        console.error(`Error updating video ${videoId} metadata:`, error);
        return { success: false, error: `Erro ao atualizar vídeo ID ${videoId}` };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in batchUpdateEquipment:', error);
    return { success: false, error: 'Erro ao atualizar equipamentos em lote' };
  }
};

export const getEquipmentFromMetadata = (video: EditableVideo) => {
  const equipmentId = video.metadata?.equipment_id || '';
  const equipmentName = video.metadata?.equipment_name || '';
  
  return {
    id: equipmentId,
    name: equipmentName
  };
};

// Additional utility functions for equipment operations can be added here
