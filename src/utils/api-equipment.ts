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
 * Alias para fetchAllEquipments para compatibilidade com componentes existentes
 */
export const getEquipments = fetchAllEquipments;

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
  // Create a copy of the equipment object without the efeito field
  // as it doesn't exist in the database table yet
  const { efeito, ...equipmentToSave } = equipment;
  
  const equipmentWithDefaults = {
    ...equipmentToSave,
    ativo: equipmentToSave.ativo ?? true
  };
  
  console.log("Dados do equipamento a serem enviados:", equipmentWithDefaults);
  
  const { data, error } = await supabase
    .from("equipamentos")
    .insert([equipmentWithDefaults])
    .select("*")
    .single();
    
  if (error) {
    console.error("Erro ao criar equipamento:", error);
    throw error;
  }
  
  // Add the efeito property back to the returned object
  // so the frontend can still use it
  return { ...data, efeito } as Equipment;
}

/**
 * Atualiza um equipamento existente
 */
export async function updateEquipment(updates: EquipmentUpdateProps): Promise<Equipment> {
  console.log("Dados a serem atualizados:", updates);
  
  // Make sure to remove efeito as it's not a database column
  const { efeito, ...updateData } = updates;

  const { id, ...fieldsToUpdate } = updateData;
  
  const { data, error } = await supabase
    .from("equipamentos")
    .update(fieldsToUpdate)
    .eq("id", id)
    .select("*")
    .single();
    
  if (error) {
    console.error("Erro ao atualizar equipamento:", error);
    throw error;
  }
  
  // Add efeito back to the returned object if it was provided
  return { ...data, efeito } as Equipment;
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

/**
 * Exclui um equipamento
 */
export async function deleteEquipment(id: string): Promise<void> {
  const { error } = await supabase
    .from("equipamentos")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Erro ao excluir equipamento:", error);
    throw error;
  }
}

/**
 * Importa equipamentos a partir de um arquivo
 */
export async function importEquipments(file: File): Promise<{ imported: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        if (!event.target?.result) {
          reject(new Error("Falha ao ler o arquivo"));
          return;
        }
        
        let equipmentsData: EquipmentCreationProps[];
        
        // Parse file based on type
        if (file.type === "application/json") {
          equipmentsData = JSON.parse(event.target.result as string);
        } else if (file.type === "text/csv") {
          // Simple CSV parsing - might need improvement for production
          const lines = (event.target.result as string).split('\n');
          const headers = lines[0].split(',');
          equipmentsData = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',');
            const equipment: any = {};
            
            headers.forEach((header, index) => {
              equipment[header.trim()] = values[index]?.trim();
            });
            
            equipmentsData.push(equipment);
          }
        } else {
          reject(new Error("Formato de arquivo não suportado"));
          return;
        }
        
        // Insert equipments in batch
        const { error } = await supabase
          .from("equipamentos")
          .insert(equipmentsData);
          
        if (error) {
          reject(error);
          return;
        }
        
        resolve({ imported: equipmentsData.length });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo"));
    };
    
    if (file.type === "application/json" || file.type.includes("text/csv")) {
      reader.readAsText(file);
    } else {
      reject(new Error("Formato de arquivo não suportado"));
    }
  });
}

/**
 * Busca arquivos relacionados a um equipamento específico
 */
export async function fetchEquipmentFiles(equipmentName: string) {
  const { data, error } = await supabase
    .from("materiais")
    .select("*")
    .eq("categoria", equipmentName)
    .order("data_upload", { ascending: false });
    
  if (error) {
    console.error("Erro ao buscar arquivos do equipamento:", error);
    throw error;
  }
  
  return data;
}

/**
 * Busca vídeos relacionados a um equipamento específico
 */
export async function fetchEquipmentVideos(equipmentName: string) {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .contains("equipamentos", [equipmentName])
    .order("data_upload", { ascending: false });
    
  if (error) {
    console.error("Erro ao buscar vídeos do equipamento:", error);
    throw error;
  }
  
  return data;
}
