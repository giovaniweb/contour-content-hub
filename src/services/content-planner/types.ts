
import { ContentPlannerItem, ContentPlannerStatus, ContentPlannerFilter, ContentFormat, ContentDistribution } from '@/types/content-planner';

// Response type for fetch operation
export interface FetchContentPlannerItemsResponse {
  items: ContentPlannerItem[];
  error?: string;
}

// Response type for content suggestion operation
export interface GenerateContentSuggestionsResponse {
  items: ContentPlannerItem[];
  error?: string;
}
