
import { supabase } from "@/integrations/supabase/client";
import { ContentStrategyItem } from "@/types/content-strategy";
import { ContentStrategyInsert, ContentStrategyRowWithRelations } from "@/types/supabase/contentStrategy";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { prepareContentStrategyData, transformToContentStrategyItem } from "@/utils/validation/contentStrategy";

/**
 * Create content strategy item
 */
export const createContentStrategyItem = async (
  item: Partial<ContentStrategyItem>
): Promise<ContentStrategyItem | null> => {
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
    
    const { data, error }: PostgrestSingleResponse<ContentStrategyRowWithRelations> = await supabase
      .from('content_strategy_items')
      .insert([insertData])
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `)
      .single();
    
    if (error) throw error;
    
    return data ? transformToContentStrategyItem(data) : null;
  } catch (error) {
    console.error("Error creating content strategy item:", error);
    return null;
  }
};
