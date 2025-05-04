
import { supabase, logQuery, logQueryResult, convertStringToArray, Equipment } from './base';

/**
 * Get all equipment from the database
 */
export const getEquipments = async (): Promise<Equipment[]> => {
  try {
    console.log('Fetching all equipments...');
    logQuery('select', 'equipamentos', { all: true });
    
    // Use any to break type inference chain
    const query = supabase
      .from('equipamentos')
      .select('*')
      .order('nome') as any;
      
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching equipments:', error);
      logQueryResult('select', 'equipamentos', false, null, error);
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} equipments`);
    logQueryResult('select', 'equipamentos', true, { count: data?.length || 0 });
    
    // Process with explicit typing
    const processedData = (data || []) as any[];
    return processedData.map((item: any) => ({
      ...item,
      // Convert string to array if needed for indicacoes
      indicacoes: item.indicacoes ? convertStringToArray(item.indicacoes) : []
    })) as Equipment[];
    
  } catch (error) {
    console.error('Error fetching equipments:', error);
    throw error;
  }
};

/**
 * Get a single equipment by ID
 */
export const getEquipmentById = async (id: string): Promise<Equipment | null> => {
  try {
    console.log(`Fetching equipment with ID: ${id}`);
    logQuery('select', 'equipamentos', { id, method: 'getEquipmentById' });
    
    if (!id) {
      console.error('Invalid equipment ID provided: empty or undefined');
      return null;
    }
    
    const { data, error } = await supabase
      .from('equipamentos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { // Not found error code
        console.log(`No equipment found with ID: ${id}`);
        logQueryResult('select', 'equipamentos', false, null, { message: 'Not found' });
        return null;
      }
      console.error(`Error fetching equipment with ID ${id}:`, error);
      logQueryResult('select', 'equipamentos', false, null, error);
      throw error;
    }
    
    if (!data) {
      console.log(`No equipment found with ID: ${id}`);
      return null;
    }

    console.log(`Successfully fetched equipment: ${data.nome}`);
    logQueryResult('select', 'equipamentos', true, { id: data.id, nome: data.nome });
    
    // Convert string to array if needed with explicit typing
    const equipment = {
      ...data,
      indicacoes: data.indicacoes ? convertStringToArray(data.indicacoes) : []
    } as Equipment;
    
    return equipment;
    
  } catch (error) {
    console.error(`Error fetching equipment with ID ${id}:`, error);
    throw error;
  }
};
