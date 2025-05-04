
import { supabase } from './base';

/**
 * Get equipment files
 */
export const fetchEquipmentFiles = async (equipmentId: string): Promise<any[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data
    return [
      {
        id: 'file-1',
        name: 'Manual do Equipamento.pdf',
        type: 'pdf',
        size: '1.2 MB',
        url: '#',
      },
      {
        id: 'file-2',
        name: 'Especificações Técnicas.pdf',
        type: 'pdf',
        size: '890 KB',
        url: '#',
      },
      {
        id: 'file-3',
        name: 'Treinamento.mp4',
        type: 'video',
        size: '24 MB',
        url: '#',
      }
    ];
    
  } catch (error) {
    console.error(`Error fetching files for equipment ${equipmentId}:`, error);
    throw error;
  }
};

/**
 * Get equipment videos
 */
export const fetchEquipmentVideos = async (equipmentId: string): Promise<any[]> => {
  try {
    // Use supabase to get videos related to this equipment
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .contains('equipamentos', [equipmentId]);
      
    if (error) {
      throw error;
    }
    
    return data || [];
    
  } catch (error) {
    console.error(`Error fetching videos for equipment ${equipmentId}:`, error);
    return []; // Return empty array on error
  }
};
