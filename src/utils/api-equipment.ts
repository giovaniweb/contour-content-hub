
import { supabase } from "@/integrations/supabase/client";
import { Equipment, EquipmentCreationProps, EquipmentUpdateProps } from "@/types/equipment";

/**
 * Busca todos os equipamentos
 */
export async function fetchAllEquipments(): Promise<Equipment[]> {
  const { data, error } = await supabase
    .from("equipamentos")
    .select("*")
    .order("nome", { ascending: true });
    
  if (error) {
    console.error("Erro ao buscar equipamentos:", error);
    throw error;
  }
  
  return data as Equipment[];
}

/**
 * Busca um equipamento específico por ID
 */
export async function fetchEquipmentById(id: string): Promise<Equipment | null> {
  const { data, error } = await supabase
    .from("equipamentos")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) {
    if (error.code === "PGRST116") {
      // Código de erro para nenhum resultado encontrado
      return null;
    }
    console.error("Erro ao buscar equipamento:", error);
    throw error;
  }
  
  return data as Equipment;
}

/**
 * Busca equipamentos ativos
 */
export async function fetchActiveEquipments(): Promise<Equipment[]> {
  const { data, error } = await supabase
    .from("equipamentos")
    .select("*")
    .eq("ativo", true)
    .order("nome", { ascending: true });
    
  if (error) {
    console.error("Erro ao buscar equipamentos ativos:", error);
    throw error;
  }
  
  return data as Equipment[];
}

/**
 * Cria um novo equipamento
 */
export async function createEquipment(equipment: EquipmentCreationProps): Promise<Equipment> {
  const { data, error } = await supabase
    .from("equipamentos")
    .insert([equipment])
    .select("*")
    .single();
    
  if (error) {
    console.error("Erro ao criar equipamento:", error);
    throw error;
  }
  
  return data as Equipment;
}

/**
 * Atualiza um equipamento existente
 */
export async function updateEquipment(updates: EquipmentUpdateProps): Promise<Equipment> {
  const { id, ...updateData } = updates;
  const { data, error } = await supabase
    .from("equipamentos")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();
    
  if (error) {
    console.error("Erro ao atualizar equipamento:", error);
    throw error;
  }
  
  return data as Equipment;
}

/**
 * Ativa ou desativa um equipamento
 */
export async function toggleEquipmentStatus(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase
    .from("equipamentos")
    .update({ ativo })
    .eq("id", id);
    
  if (error) {
    console.error("Erro ao atualizar status do equipamento:", error);
    throw error;
  }
}

/**
 * Busca equipamentos por termo de pesquisa
 */
export async function searchEquipments(searchTerm: string): Promise<Equipment[]> {
  const { data, error } = await supabase
    .from("equipamentos")
    .select("*")
    .ilike("nome", `%${searchTerm}%`)
    .order("nome", { ascending: true });
    
  if (error) {
    console.error("Erro ao pesquisar equipamentos:", error);
    throw error;
  }
  
  return data as Equipment[];
}
