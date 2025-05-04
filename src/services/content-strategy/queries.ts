
import { supabase } from "@/integrations/supabase/client";
import { ContentStrategyFilter } from "@/types/content-strategy";
import { ContentStrategyRowWithRelations } from "@/types/supabase/contentStrategy";
import { safeQueryResult, safeSingleResult } from "@/utils/validation/supabaseHelpers";

/**
 * Fetch content strategy items with filters
 */
export const fetchContentStrategyItems = async (filters: ContentStrategyFilter = {}) => {
  try {
    // Build the query
    const query = supabase
      .from('content_strategy_items')
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `)
      .order('created_at', { ascending: false });
    
    // Apply filters - using simple comparison operations
    if (filters.equipamento_id) {
      query.eq('equipamento_id', filters.equipamento_id);
    }
    
    if (filters.categoria) {
      query.eq('categoria', filters.categoria);
    }
    
    if (filters.formato) {
      query.eq('formato', filters.formato);
    }
    
    if (filters.responsavel_id) {
      query.eq('responsavel_id', filters.responsavel_id);
    }
    
    if (filters.objetivo) {
      query.eq('objetivo', filters.objetivo);
    }
    
    if (filters.status) {
      query.eq('status', filters.status);
    }
    
    if (filters.distribuicao) {
      query.eq('distribuicao', filters.distribuicao);
    }
    
    if (filters.dateRange?.from) {
      query.gte('previsao', filters.dateRange.from.toISOString().split('T')[0]);
    }
    
    if (filters.dateRange?.to) {
      query.lte('previsao', filters.dateRange.to.toISOString().split('T')[0]);
    }
    
    // Execute the query
    const response = await query;
    
    // Use type assertion to safely convert the response data
    return safeQueryResult<ContentStrategyRowWithRelations>(response);
  } catch (error) {
    console.error("Error fetching content strategy items:", error);
    return null;
  }
};

/**
 * Fetch a single content strategy item by ID
 */
export const fetchContentStrategyItemById = async (id: string) => {
  try {
    const response = await supabase
      .from('content_strategy_items')
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `)
      .eq('id', id)
      .single();
    
    return safeSingleResult<ContentStrategyRowWithRelations>(response);
  } catch (error) {
    console.error("Error fetching content strategy item:", error);
    return null;
  }
};
