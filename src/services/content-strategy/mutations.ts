
import { supabase } from "@/integrations/supabase/client";
import { ContentStrategyItem } from "@/types/content-strategy";
import { ContentStrategyInsert, ContentStrategyUpdate } from "@/types/supabase/contentStrategy";
import { prepareContentStrategyData } from "@/utils/validation/contentStrategy";

// Raw database row type with relations
interface ContentStrategyRowWithRelations {
  id: string;
  categoria: string;
  conteudo: string;
  created_at: string;
  created_by: string;
  equipamento_id: string;
  formato: string;
  impedimento: string;
  linha: string;
  objetivo: string;
  previsao: string;
  prioridade: string;
  responsavel_id: string;
  status: string;
  updated_at: string;
  distribuicao?: string;
  equipamento?: { nome: string } | null;
  responsavel?: { nome: string } | null;
}

/**
 * Create content strategy item
 */
export const createContentStrategyItem = async (item: Partial<ContentStrategyItem>) => {
  try {
    // Get the prepared data with all required fields
    const preparedData = prepareContentStrategyData(item);
    
    // Explicitly cast to match database structure with required fields
    const insertData: ContentStrategyInsert = {
      categoria: preparedData.categoria,
      formato: preparedData.formato,
      objetivo: preparedData.objetivo,
      equipamento_id: preparedData.equipamento_id,
      responsavel_id: preparedData.responsavel_id,
      previsao: preparedData.previsao,
      conteudo: preparedData.conteudo,
      status: preparedData.status,
      distribuicao: preparedData.distribuicao
    };
    
    // Execute the query
    const response = await supabase
      .from('content_strategy_items')
      .insert([insertData])
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `)
      .single();
    
    if (response.error) {
      console.error("Error creating content strategy item:", response.error);
      return null;
    }

    // Safely transform the response data
    if (response.data) {
      const rawData = response.data as any;
      
      // Ensure we have the expected structure
      const transformedData: ContentStrategyRowWithRelations = {
        id: rawData.id,
        categoria: rawData.categoria,
        conteudo: rawData.conteudo,
        created_at: rawData.created_at,
        created_by: rawData.created_by,
        equipamento_id: rawData.equipamento_id,
        formato: rawData.formato,
        impedimento: rawData.impedimento || null,
        linha: rawData.linha || null,
        objetivo: rawData.objetivo,
        previsao: rawData.previsao,
        prioridade: rawData.prioridade || 'Média',
        responsavel_id: rawData.responsavel_id,
        status: rawData.status,
        updated_at: rawData.updated_at,
        distribuicao: rawData.distribuicao || 'Instagram',
        equipamento: rawData.equipamento && typeof rawData.equipamento === 'object' && 'nome' in rawData.equipamento 
          ? { nome: rawData.equipamento.nome } 
          : null,
        responsavel: rawData.responsavel && typeof rawData.responsavel === 'object' && 'nome' in rawData.responsavel 
          ? { nome: rawData.responsavel.nome } 
          : null,
      };

      return transformedData;
    }

    return null;
  } catch (error) {
    console.error("Error creating content strategy item:", error);
    return null;
  }
};

/**
 * Update content strategy item
 */
export const updateContentStrategyItem = async (id: string, updates: Partial<ContentStrategyItem>) => {
  try {
    const preparedData = prepareContentStrategyData(updates);
    
    // We need to provide the data in a format that matches the database table structure
    const updateData: ContentStrategyUpdate = {
      categoria: preparedData.categoria,
      formato: preparedData.formato,
      objetivo: preparedData.objetivo,
      equipamento_id: preparedData.equipamento_id,
      responsavel_id: preparedData.responsavel_id,
      previsao: preparedData.previsao,
      conteudo: preparedData.conteudo,
      status: preparedData.status,
      distribuicao: preparedData.distribuicao
    };
    
    const { error } = await supabase
      .from('content_strategy_items')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating content strategy item:", error);
    return false;
  }
};

/**
 * Delete content strategy item
 */
export const deleteContentStrategyItem = async (id: string) => {
  try {
    const { error } = await supabase
      .from('content_strategy_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting content strategy item:", error);
    return false;
  }
};
