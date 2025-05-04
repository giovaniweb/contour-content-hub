
import { ContentStrategyItem, ContentStrategyFilter } from "@/types/content-strategy";
import { supabase } from "@/integrations/supabase/client";
import { prepareContentStrategyData, transformToContentStrategyItem } from "@/utils/validation/contentStrategy";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { ContentStrategyRow, ContentStrategyRowWithRelations, ContentStrategyInsert, ContentStrategyUpdate } from "@/types/supabase/contentStrategy";

/**
 * Fetch content strategy items with filters
 */
export const fetchContentStrategyItems = async (filters: ContentStrategyFilter = {}): Promise<ContentStrategyItem[]> => {
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
    
    return data ? data.map(item => transformToContentStrategyItem(item as ContentStrategyRowWithRelations)) : [];
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
    
    const { data, error } = await supabase
      .from('content_strategy_items')
      .insert([insertData])
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `)
      .single();
    
    if (error) throw error;
    
    return data ? transformToContentStrategyItem(data as ContentStrategyRowWithRelations) : null;
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
export const deleteContentStrategyItem = async (id: string): Promise<boolean> => {
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

// Simplified versions of these functions to avoid TypeScript excessive depth errors
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

export const processContentStrategy = (strategy: ContentStrategyItem): ContentStrategyItem => {
  return { ...strategy };
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
