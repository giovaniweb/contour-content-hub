
import { supabase, EquipmentCreationProps, Equipment, convertStringToArray } from './base';

/**
 * Create a new equipment
 */
export const createEquipment = async (equipment: EquipmentCreationProps): Promise<Equipment> => {
  try {
    // Process indicacoes to ensure it's a string for database storage
    const processedEquipment = {
      ...equipment,
      indicacoes: Array.isArray(equipment.indicacoes) 
        ? equipment.indicacoes.join(';') 
        : equipment.indicacoes
    };
    
    // Ensure we're passing a single object, not an array of objects
    const { data, error } = await supabase
      .from('equipamentos')
      .insert(processedEquipment)
      .select();
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data returned from equipment creation');
    }
    
    return {
      ...data[0],
      indicacoes: convertStringToArray(data[0].indicacoes)
    } as Equipment;
    
  } catch (error) {
    console.error('Error creating equipment:', error);
    throw error;
  }
};
