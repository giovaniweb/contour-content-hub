
import { supabase } from "@/integrations/supabase/client";
import { ContentStrategyFilter, ContentStrategyItem } from "@/types/content-strategy";
import { ContentStrategyRowWithRelations } from "@/types/supabase/contentStrategy";
import { transformToContentStrategyItem } from "@/utils/validation/contentStrategy";

/**
 * Fetch content strategy items with filters
 */
export const fetchContentStrategyItems = async (
  filters: ContentStrategyFilter = {}
): Promise<ContentStrategyItem[]> => {
  try {
    let query = supabase
      .from('content_strategy_items')
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `)
      .order('created_at', { ascending: false });
    
    // Apply filters - using simple comparison operations
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
    
    // Get query result without explicit type casting
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Convert the data to the proper type after the query
    return data ? data.map(item => transformToContentStrategyItem(item as unknown as ContentStrategyRowWithRelations)) : [];
  } catch (error) {
    console.error("Error fetching content strategy items:", error);
    return [];
  }
};

// Statistics and utility functions
export const calculateContentMetrics = (strategy: ContentStrategyItem) => {
  const metrics = {
    totalContent: 1,
    completedContent: strategy.status === 'Finalizado' ? 1 : 0,
    pendingReview: strategy.status === 'Em andamento' ? 1 : 0
  };
  return metrics;
};

export const getContentStrategyStats = (strategies: ContentStrategyItem[]) => {
  const stats = {
    totalStrategies: strategies.length,
    activeStrategies: strategies.filter(s => s.status === 'Em andamento').length,
    completedStrategies: strategies.filter(s => s.status === 'Finalizado').length
  };
  return stats;
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

export const processContentStrategy = (strategy: ContentStrategyItem): ContentStrategyItem => {
  return { ...strategy };
};
