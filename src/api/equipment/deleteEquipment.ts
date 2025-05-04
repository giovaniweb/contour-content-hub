
import { supabase } from './base';

/**
 * Delete an equipment by ID
 */
export const deleteEquipment = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('equipamentos')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
  } catch (error) {
    console.error(`Error deleting equipment with ID ${id}:`, error);
    throw error;
  }
};
