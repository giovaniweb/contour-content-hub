import { supabase } from '@/integrations/supabase/client';
import { Equipment, EquipmentCreationProps } from '@/types/equipment';

/**
 * Get all equipment from the database
 */
export const getEquipments = async (): Promise<Equipment[]> => {
  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .select('*')
      .order('nome');
      
    if (error) {
      throw error;
    }
    
    return data.map((item: any) => ({
      ...item,
      // Convert string to array if needed for indicacoes
      indicacoes: item.indicacoes || []
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
    const { data, error } = await supabase
      .from('equipamentos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { // Not found error code
        return null;
      }
      throw error;
    }
    
    if (!data) {
      return null;
    }

    // Convert string to array if needed
    return {
      ...data,
      indicacoes: data.indicacoes || []
    } as Equipment;
    
  } catch (error) {
    console.error(`Error fetching equipment with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new equipment
 */
export const createEquipment = async (equipment: EquipmentCreationProps): Promise<Equipment> => {
  try {
    // Ensure we're passing a single object, not an array of objects
    const { data, error } = await supabase
      .from('equipamentos')
      .insert([equipment]) // Wrap in array here for supabase
      .select();
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data returned from equipment creation');
    }
    
    return data[0] as Equipment;
    
  } catch (error) {
    console.error('Error creating equipment:', error);
    throw error;
  }
};

/**
 * Update an existing equipment
 */
export const updateEquipment = async (id: string, equipment: Partial<Equipment>): Promise<Equipment> => {
  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .update(equipment)
      .eq('id', id)
      .select();
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error(`Equipment with ID ${id} not found`);
    }
    
    return data[0] as Equipment;
    
  } catch (error) {
    console.error(`Error updating equipment with ID ${id}:`, error);
    throw error;
  }
};

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

/**
 * Import equipment from a file
 */
export const importEquipments = async (file: File): Promise<Equipment[]> => {
  try {
    // Simulate file upload and processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock data
    const importedEquipments: Equipment[] = [
      {
        id: `imported-${Date.now()}-1`,
        nome: 'Equipamento Importado 1',
        tecnologia: 'Tecnologia importada',
        beneficios: 'Benefícios importados',
        indicacoes: ['Indicação importada 1', 'Indicação importada 2'],
        diferenciais: 'Diferenciais importados',
        linguagem: 'pt-BR',
        ativo: true,
        efeito: 'Efeito importado',
        image_url: ''
      },
      {
        id: `imported-${Date.now()}-2`,
        nome: 'Equipamento Importado 2',
        tecnologia: 'Tecnologia importada 2',
        beneficios: 'Benefícios importados 2',
        indicacoes: ['Indicação importada 3', 'Indicação importada 4'],
        diferenciais: 'Diferenciais importados 2',
        linguagem: 'pt-BR',
        ativo: true,
        efeito: 'Efeito importado 2',
        image_url: ''
      }
    ];
    
    return importedEquipments;
    
  } catch (error) {
    console.error('Error importing equipments:', error);
    throw error;
  }
};

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
