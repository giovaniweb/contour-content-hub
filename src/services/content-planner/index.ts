
// Re-export all functionality from the content planner service

// Item operations
export { 
  createContentPlannerItem,
  updateContentPlannerItem,
  deleteContentPlannerItem 
} from './itemService';

// Status operations
export {
  moveItem,
  scheduleContentPlannerItem,
  canMoveToStatus
} from './statusService';

// Fetch operations
export { fetchContentPlannerItems } from './fetchService';

// Suggestion operations
export { generateContentSuggestions } from './suggestionService';

// Utils
export { getStatusLabel } from './utils';

// Export types
export * from './types';
