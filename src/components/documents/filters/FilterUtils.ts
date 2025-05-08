
import { GetDocumentsParams } from "@/types/document";

/**
 * Check if any filter is currently active
 */
export const hasActiveFilters = (filters: GetDocumentsParams): boolean => {
  return Boolean(
    filters.type ||
    filters.equipmentId ||
    filters.language ||
    filters.search
  );
};
