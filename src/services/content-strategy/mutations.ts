
import { supabase } from "@/integrations/supabase/client";
import { ContentStrategyItem } from "@/types/content-strategy";
import { ContentStrategyInsert, ContentStrategyRowWithRelations, ContentStrategyUpdate } from "@/types/supabase/contentStrategy";
import { prepareContentStrategyData } from "@/utils/validation/contentStrategy";
import { safeSingleResult } from "@/utils/validation/supabaseHelpers";

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
    
    // Return the raw data response for processing elsewhere
    return safeSingleResult<ContentStrategyRowWithRelations>(response);
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
