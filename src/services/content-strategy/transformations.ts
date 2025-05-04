
import { ContentStrategyItem } from "@/types/content-strategy";
import { ContentStrategyRowWithRelations } from "@/types/supabase/contentStrategy";
import { transformToContentStrategyItem } from "@/utils/validation/contentStrategy";

/**
 * Transform database results to ContentStrategyItem objects
 */
export const transformContentStrategyResults = (data: ContentStrategyRowWithRelations[] | null): ContentStrategyItem[] => {
  if (!data) return [];
  return data.map(item => transformToContentStrategyItem(item));
};

/**
 * Transform a single database result to a ContentStrategyItem object
 */
export const transformContentStrategyResult = (data: ContentStrategyRowWithRelations | null): ContentStrategyItem | null => {
  if (!data) return null;
  return transformToContentStrategyItem(data);
};
