
import { supabase } from "@/integrations/supabase/client";
import { ContentStrategyItem } from "@/types/content-strategy";
import { ContentStrategyUpdate } from "@/types/supabase/contentStrategy";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { prepareContentStrategyData } from "@/utils/validation/contentStrategy";

/**
 * Update content strategy item
 */
export const updateContentStrategyItem = async (
  id: string, 
  updates: Partial<ContentStrategyItem>
): Promise<boolean> => {
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
    
    const { error }: PostgrestSingleResponse<null> = await supabase
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
export const deleteContentStrategyItem = async (id: string): Promise<boolean> => {
  try {
    const { error }: PostgrestSingleResponse<null> = await supabase
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
