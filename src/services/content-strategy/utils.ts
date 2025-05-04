
import { ContentStrategyItem } from "@/types/content-strategy";

/**
 * Calculate metrics for a single content strategy item
 */
export const calculateContentMetrics = (strategy: ContentStrategyItem) => {
  const metrics = {
    totalContent: 1,
    completedContent: strategy.status === 'Finalizado' ? 1 : 0,
    pendingReview: strategy.status === 'Em andamento' ? 1 : 0
  };
  return metrics;
};

/**
 * Get overall stats for a collection of content strategy items
 */
export const getContentStrategyStats = (strategies: ContentStrategyItem[]) => {
  const stats = {
    totalStrategies: strategies.length,
    activeStrategies: strategies.filter(s => s.status === 'Em andamento').length,
    completedStrategies: strategies.filter(s => s.status === 'Finalizado').length
  };
  return stats;
};

/**
 * Process a content strategy item, performing any necessary transformations
 */
export const processContentStrategy = (strategy: ContentStrategyItem): ContentStrategyItem => {
  return { ...strategy };
};

/**
 * Summarize metrics for content strategy items
 */
export const summarizeContentMetrics = (strategies: ContentStrategyItem[]) => {
  let totalContent = strategies.length;
  let completedContent = strategies.filter(s => s.status === 'Finalizado').length;
  
  return {
    totalContent,
    completedContent,
    completionRate: totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0
  };
};

/**
 * Filter strategies by status
 */
export const filterStrategiesByStatus = (strategies: ContentStrategyItem[], status: string) => {
  return strategies.filter(s => s.status === status);
};

/**
 * Sort strategies by date
 */
export const sortStrategiesByDate = (strategies: ContentStrategyItem[], order: 'asc' | 'desc' = 'desc') => {
  return [...strategies].sort((a, b) => {
    const dateA = new Date(a.created_at || '').getTime();
    const dateB = new Date(b.created_at || '').getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};
