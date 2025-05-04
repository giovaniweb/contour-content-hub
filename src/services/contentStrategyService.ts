
// Re-export all functionalities from specific files
// to maintain compatibility with existing code

import {
  fetchContentStrategyItems,
  createContentStrategyItem,
  updateContentStrategyItem,
  deleteContentStrategyItem,
  calculateContentMetrics,
  getContentStrategyStats,
  processContentStrategy,
  summarizeContentMetrics,
  filterStrategiesByStatus,
  sortStrategiesByDate
} from './contentStrategyCore';

import {
  generateContentWithAI,
  scheduleContentInCalendar
} from './contentStrategyIntegrations';

export {
  fetchContentStrategyItems,
  createContentStrategyItem,
  updateContentStrategyItem,
  deleteContentStrategyItem,
  calculateContentMetrics,
  getContentStrategyStats,
  processContentStrategy,
  summarizeContentMetrics,
  filterStrategiesByStatus,
  sortStrategiesByDate,
  generateContentWithAI,
  scheduleContentInCalendar
};
