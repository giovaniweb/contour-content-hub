
// Export all functionalities from specific files
import { fetchContentStrategyItems, fetchContentStrategyItemById } from './queries';
import { createContentStrategyItem, updateContentStrategyItem, deleteContentStrategyItem } from './mutations';
import { transformContentStrategyResults, transformContentStrategyResult } from './transformations';
import { 
  calculateContentMetrics,
  getContentStrategyStats,
  processContentStrategy,
  summarizeContentMetrics,
  filterStrategiesByStatus,
  sortStrategiesByDate
} from './utils';

// Export combined functionality
export async function fetchAndTransformContentStrategyItems(filters = {}) {
  const data = await fetchContentStrategyItems(filters);
  return transformContentStrategyResults(data);
}

export async function fetchAndTransformContentStrategyItem(id: string) {
  const data = await fetchContentStrategyItemById(id);
  return transformContentStrategyResult(data);
}

// Re-export all individual functions
export {
  fetchContentStrategyItems,
  fetchContentStrategyItemById,
  createContentStrategyItem,
  updateContentStrategyItem,
  deleteContentStrategyItem,
  transformContentStrategyResults,
  transformContentStrategyResult,
  calculateContentMetrics,
  getContentStrategyStats,
  processContentStrategy,
  summarizeContentMetrics,
  filterStrategiesByStatus,
  sortStrategiesByDate
};
