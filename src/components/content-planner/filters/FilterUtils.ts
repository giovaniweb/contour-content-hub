
import { ContentPlannerFilter } from "@/types/content-planner";

/**
 * Check if any filter is currently active
 */
export const hasActiveFilters = (filters: ContentPlannerFilter): boolean => {
  return Boolean(
    filters.objective ||
    filters.format ||
    filters.distribution ||
    filters.equipmentId ||
    filters.dateRange?.from ||
    filters.dateRange?.to
  );
};
