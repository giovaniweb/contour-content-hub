
import { supabase } from '@/integrations/supabase/client';
import { Equipment } from '@/types/equipment';

// Obter lista de equipamentos
export const getEquipments = async (): Promise<Equipment[]> => {
  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .select('*')
      .order('nome');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
    throw error;
  }
};

// Obter um equipamento específico
export const getEquipmentById = async (id: string): Promise<Equipment> => {
  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data as Equipment;
  } catch (error) {
    console.error(`Erro ao buscar equipamento ID ${id}:`, error);
    throw error;
  }
};

// Criar novo equipamento
export const createEquipment = async (equipment: Equipment): Promise<Equipment> => {
  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .insert([equipment])
      .select()
      .single();
      
    if (error) throw error;
    
    return data as Equipment;
  } catch (error) {
    console.error('Erro ao criar equipamento:', error);
    throw error;
  }
};

// Atualizar equipamento existente
export const updateEquipment = async (equipment: Equipment): Promise<Equipment> => {
  if (!equipment.id) {
    throw new Error('ID do equipamento é necessário para atualização');
  }

  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .update(equipment)
      .eq('id', equipment.id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as Equipment;
  } catch (error) {
    console.error(`Erro ao atualizar equipamento ID ${equipment.id}:`, error);
    throw error;
  }
};

// Excluir equipamento
export const deleteEquipment = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('equipamentos')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error(`Erro ao excluir equipamento ID ${id}:`, error);
    throw error;
  }
};

// Importar equipamentos em lote
export const importEquipments = async (equipments: Equipment[]): Promise<void> => {
  try {
    const { error } = await supabase
      .from('equipamentos')
      .insert(equipments);
      
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao importar equipamentos:', error);
    throw error;
  }
};
