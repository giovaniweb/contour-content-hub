
import { Equipment } from "@/types/equipment";
import { supabase } from "@/integrations/supabase/client";

/**
 * Busca todos os equipamentos
 */
export async function getEquipments(): Promise<Equipment[]> {
  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .select('*')
      .order('nome');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar equipamentos:", error);
    throw new Error("Não foi possível carregar os equipamentos");
  }
}

/**
 * Busca um equipamento específico pelo ID
 */
export async function getEquipmentById(id: string): Promise<Equipment> {
  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Erro ao buscar equipamento com ID ${id}:`, error);
    throw new Error("Não foi possível carregar os dados do equipamento");
  }
}

/**
 * Cria um novo equipamento
 */
export async function createEquipment(equipmentData: Omit<Equipment, 'id'>): Promise<Equipment> {
  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .insert([equipmentData])
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro ao criar equipamento:", error);
    throw new Error("Não foi possível criar o equipamento");
  }
}

/**
 * Atualiza um equipamento existente
 */
export async function updateEquipment(id: string, equipmentData: Partial<Equipment>): Promise<Equipment> {
  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .update(equipmentData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar equipamento com ID ${id}:`, error);
    throw new Error("Não foi possível atualizar o equipamento");
  }
}

/**
 * Remove um equipamento
 */
export async function deleteEquipment(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('equipamentos')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error(`Erro ao remover equipamento com ID ${id}:`, error);
    throw new Error("Não foi possível remover o equipamento");
  }
}

/**
 * Importa equipamentos a partir de um arquivo
 */
export async function importEquipments(file: File): Promise<{ imported: number }> {
  try {
    // Ler o arquivo
    const text = await file.text();
    let equipments = [];
    
    if (file.name.endsWith('.json')) {
      equipments = JSON.parse(text);
    } else if (file.name.endsWith('.csv')) {
      // Implementar parser CSV se necessário
      throw new Error("Formato CSV não suportado no momento");
    } else {
      throw new Error("Formato de arquivo não suportado");
    }
    
    if (!Array.isArray(equipments)) {
      throw new Error("O arquivo deve conter um array de equipamentos");
    }
    
    // Inserir equipamentos no banco de dados
    const { data, error } = await supabase
      .from('equipamentos')
      .insert(equipments);
      
    if (error) throw error;
    
    return { imported: equipments.length };
  } catch (error) {
    console.error("Erro ao importar equipamentos:", error);
    throw new Error("Não foi possível importar os equipamentos");
  }
}

/**
 * Busca as categorias distintas de equipamentos
 */
export async function getEquipmentCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .select('categoria');
      
    if (error) throw error;
    
    // Extrair categorias únicas
    const categories = data
      .map(item => item.categoria)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    
    return categories;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw new Error("Não foi possível carregar as categorias");
  }
}
