
import { supabase, Equipment, convertStringToArray } from './base';

/**
 * Update an existing equipment
 */
export const updateEquipment = async (id: string, equipment: Partial<Equipment>): Promise<Equipment> => {
  try {
    // Process indicacoes to ensure it's a string for database storage if it exists
    const processedEquipment = {
      ...equipment,
      indicacoes: equipment.indicacoes ? 
        (Array.isArray(equipment.indicacoes) ? 
          equipment.indicacoes.join(';') : 
          equipment.indicacoes) : 
        undefined
    };
    
    const { data, error } = await supabase
      .from('equipamentos')
      .update(processedEquipment)
      .eq('id', id)
      .select();
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error(`Equipment with ID ${id} not found`);
    }
    
    return {
      ...data[0],
      indicacoes: convertStringToArray(data[0].indicacoes)
    } as Equipment;
    
  } catch (error) {
    console.error(`Error updating equipment with ID ${id}:`, error);
    throw error;
  }
};
