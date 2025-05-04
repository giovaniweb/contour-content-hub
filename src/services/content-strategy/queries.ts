
import { supabase } from "@/integrations/supabase/client";
import { ContentStrategyFilter } from "@/types/content-strategy";
import { ContentStrategyRowWithRelations } from "@/types/supabase/contentStrategy";
import { logQuery, logQueryResult } from "@/utils/validation/loggingUtils";

/**
 * Fetch content strategy items with filters
 */
export const fetchContentStrategyItems = async (
  filters: ContentStrategyFilter = {}
): Promise<ContentStrategyRowWithRelations[] | null> => {
  try {
    logQuery('select', 'content_strategy_items', filters);
    
    // Step 1: Build the base query - explicitly cast as any to break inference chain
    const baseQuery = supabase
      .from('content_strategy_items')
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `) as any;
    
    // Step 2: Create a new query with filters - keeping as any type
    let query = baseQuery;
    
    // Apply filters - using simple comparison operations with explicit any typing
    if (filters.equipamento_id) {
      query = query.eq('equipamento_id', filters.equipamento_id);
    }
    
    if (filters.categoria) {
      query = query.eq('categoria', filters.categoria);
    }
    
    if (filters.formato) {
      query = query.eq('formato', filters.formato);
    }
    
    if (filters.responsavel_id) {
      query = query.eq('responsavel_id', filters.responsavel_id);
    }
    
    if (filters.objetivo) {
      query = query.eq('objetivo', filters.objetivo);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.distribuicao) {
      query = query.eq('distribuicao', filters.distribuicao);
    }
    
    if (filters.dateRange?.from) {
      query = query.gte('previsao', filters.dateRange.from.toISOString().split('T')[0]);
    }
    
    if (filters.dateRange?.to) {
      query = query.lte('previsao', filters.dateRange.to.toISOString().split('T')[0]);
    }
    
    // Step 3: Order and execute the query
    const response = await query.order('created_at', { ascending: false });
    
    // Step 4: Check for errors
    if (response.error) {
      logQueryResult('select', 'content_strategy_items', false, null, response.error);
      throw response.error;
    }
    
    // Step 5: Break type inference chain with explicit unknown cast
    const rawData = response.data as unknown;
    
    // Step 6: Explicitly cast to expected type
    const typedData = rawData as ContentStrategyRowWithRelations[] | null;
    
    logQueryResult('select', 'content_strategy_items', true, 
      typedData ? `${typedData.length} items` : 'No items');
    
    return typedData;
  } catch (error) {
    console.error("Error fetching content strategy items:", error);
    return null;
  }
};

/**
 * Fetch a single content strategy item by ID
 */
export const fetchContentStrategyItemById = async (
  id: string
): Promise<ContentStrategyRowWithRelations | null> => {
  try {
    logQuery('select', 'content_strategy_items', { id });
    
    // Step 1: Create the query - cast as any to break inference
    const query = supabase
      .from('content_strategy_items')
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `) as any;
    
    // Step 2: Execute the query
    const response = await query.eq('id', id).single();
    
    // Step 3: Check for errors
    if (response.error) {
      logQueryResult('select', 'content_strategy_items', false, null, response.error);
      
      // Handle "No rows returned" error differently than other errors
      if (response.error.code === 'PGRST116') {
        return null;
      }
      
      throw response.error;
    }
    
    // Step 3: Break type inference with explicit unknown cast
    const rawData = response.data as unknown;
    
    // Step 4: Cast to expected type
    const typedData = rawData as ContentStrategyRowWithRelations | null;
    
    logQueryResult('select', 'content_strategy_items', true, typedData ? '1 item' : 'No item');
    
    return typedData;
  } catch (error) {
    console.error("Error fetching content strategy item:", error);
    return null;
  }
};
