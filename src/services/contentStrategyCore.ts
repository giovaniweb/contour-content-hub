
import { ContentStrategyItem, ContentStrategyFilter } from "@/types/content-strategy";
import { supabase } from "@/integrations/supabase/client";
import { prepareContentStrategyData, transformToContentStrategyItem } from "@/utils/validation/contentStrategy";

// Helper functions
const safeParseInt = (value: string | number | undefined): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = parseInt(value.toString(), 10);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Fetch content strategy items with filters
 */
export const fetchContentStrategyItems = async (filters: ContentStrategyFilter = {}): Promise<ContentStrategyItem[]> => {
  try {
    let query = supabase
      .from('content_strategy')
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `)
      .order('created_at', { ascending: false });
    
    // Apply filters
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
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(transformToContentStrategyItem);
  } catch (error) {
    console.error("Error fetching content strategy items:", error);
    return [];
  }
};

/**
 * Create content strategy item
 */
export const createContentStrategyItem = async (item: Partial<ContentStrategyItem>): Promise<ContentStrategyItem | null> => {
  try {
    const preparedData = prepareContentStrategyData(item);
    
    const { data, error } = await supabase
      .from('content_strategy')
      .insert(preparedData)
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

/**
 * Update content strategy item
 */
export const updateContentStrategyItem = async (id: string, updates: Partial<ContentStrategyItem>): Promise<boolean> => {
  try {
    const preparedData = prepareContentStrategyData(updates);
    
    const { error } = await supabase
      .from('content_strategy')
      .update(preparedData)
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
    const { error } = await supabase
      .from('content_strategy')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting content strategy item:", error);
    return false;
  }
};

// Type-safe functions to avoid excessive recursion
export const calculateContentMetrics = (strategy: ContentStrategyItem) => {
  // Simple implementation to avoid deep type recursion
  return {
    totalContent: 1, // Just a placeholder value
    completedContent: strategy.status === 'Finalizado' ? 1 : 0,
    pendingReview: strategy.status === 'Em andamento' ? 1 : 0
  };
};

export const getContentStrategyStats = (strategies: ContentStrategyItem[]) => {
  return {
    totalStrategies: strategies.length,
    activeStrategies: strategies.filter(s => s.status === 'Em andamento').length,
    completedStrategies: strategies.filter(s => s.status === 'Finalizado').length
  };
};

// Safe processing functions that won't cause infinite recursion
export const processContentStrategy = (strategy: ContentStrategyItem): ContentStrategyItem => {
  return {
    ...strategy,
  };
};

export const summarizeContentMetrics = (strategies: ContentStrategyItem[]) => {
  let totalContent = strategies.length;
  let completedContent = strategies.filter(s => s.status === 'Finalizado').length;
  
  return {
    totalContent,
    completedContent,
    completionRate: totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0
  };
};

// Export other required functions
export const filterStrategiesByStatus = (strategies: ContentStrategyItem[], status: string) => {
  return strategies.filter(s => s.status === status);
};

export const sortStrategiesByDate = (strategies: ContentStrategyItem[], order: 'asc' | 'desc' = 'desc') => {
  return [...strategies].sort((a, b) => {
    const dateA = new Date(a.created_at || '').getTime();
    const dateB = new Date(b.created_at || '').getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};
