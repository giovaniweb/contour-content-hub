
import { supabase } from '@/integrations/supabase/client';
import { Equipment } from '@/types/equipment';

// Obter lista de equipamentos
export const getEquipments = async (): Promise<Equipment[]> => {
  try {
    console.log("Iniciando requisição para buscar equipamentos");
    
    // Verificar se a tabela existe antes de fazer a consulta
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('equipamentos')
      .select('id', { count: 'exact', head: true });
      
    if (tableCheckError) {
      console.error('Erro ao verificar tabela de equipamentos:', tableCheckError);
      console.error('Detalhes do erro:', JSON.stringify(tableCheckError));
      throw tableCheckError;
    }
    
    console.log("Tabela equipamentos existe:", tableExists !== null);
    
    // Buscar todos os equipamentos sem filtros para garantir que tudo seja retornado
    const { data, error, count } = await supabase
      .from('equipamentos')
      .select('*', { count: 'exact' })
      .order('nome');
      
    if (error) {
      console.error('Erro detalhado ao buscar equipamentos:', error);
      console.error('Detalhes completos:', JSON.stringify(error));
      throw error;
    }
    
    console.log(`Encontrados ${count || 0} equipamentos no banco de dados`);
    if (data) {
      console.log('Nomes dos equipamentos encontrados:', data.map(eq => eq.nome).join(', '));
      console.log('Total de equipamentos da API:', data.length);
    }
    
    // Se não houver dados ou o array estiver vazio, retornar um array vazio
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
    console.log('Iniciando criação de equipamento:', equipment.nome);
    
    const { data, error } = await supabase
      .from('equipamentos')
      .insert([equipment])
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao criar equipamento:', error);
      throw error;
    }
    
    console.log('Equipamento criado com sucesso:', data.nome);
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
    console.log(`Iniciando atualização do equipamento ID: ${equipment.id}`);
    
    const { data, error } = await supabase
      .from('equipamentos')
      .update(equipment)
      .eq('id', equipment.id)
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao atualizar equipamento:', error);
      throw error;
    }
    
    console.log('Equipamento atualizado com sucesso:', data.nome);
    return data as Equipment;
  } catch (error) {
    console.error(`Erro ao atualizar equipamento ID ${equipment.id}:`, error);
    throw error;
  }
};

// Excluir equipamento
export const deleteEquipment = async (id: string): Promise<void> => {
  try {
    console.log(`Iniciando exclusão do equipamento ID: ${id}`);
    
    const { error } = await supabase
      .from('equipamentos')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Erro ao excluir equipamento:', error);
      throw error;
    }
    
    console.log(`Equipamento ID ${id} excluído com sucesso`);
  } catch (error) {
    console.error(`Erro ao excluir equipamento ID ${id}:`, error);
    throw error;
  }
};

// Importar equipamentos em lote
export const importEquipments = async (equipments: Equipment[]): Promise<void> => {
  try {
    console.log(`Iniciando importação de ${equipments.length} equipamentos`);
    
    const { error } = await supabase
      .from('equipamentos')
      .insert(equipments);
      
    if (error) {
      console.error('Erro ao importar equipamentos:', error);
      throw error;
    }
    
    console.log(`${equipments.length} equipamentos importados com sucesso`);
  } catch (error) {
    console.error('Erro ao importar equipamentos:', error);
    throw error;
  }
};

// Buscar equipamentos por status (ativo/inativo)
export const getEquipmentsByStatus = async (active: boolean): Promise<Equipment[]> => {
  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .select('*')
      .eq('ativo', active)
      .order('nome');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Erro ao buscar equipamentos ${active ? 'ativos' : 'inativos'}:`, error);
    throw error;
  }
};
