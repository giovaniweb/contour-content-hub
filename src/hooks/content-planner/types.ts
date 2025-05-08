
import { ContentPlannerItem, ContentPlannerStatus, ContentPlannerFilter, ContentPlannerColumn } from '@/types/content-planner';

export interface ContentPlannerState {
  columns: ContentPlannerColumn[];
  loading: boolean;
  filters: ContentPlannerFilter;
}

export interface UseContentPlannerReturn {
  columns: ContentPlannerColumn[];
  setColumns: React.Dispatch<React.SetStateAction<ContentPlannerColumn[]>>;
  loading: boolean;
  filters: ContentPlannerFilter;
  setFilters: React.Dispatch<React.SetStateAction<ContentPlannerFilter>>;
  addItem: (item: Partial<ContentPlannerItem>) => Promise<ContentPlannerItem | null>;
  updateItem: (id: string, updates: Partial<ContentPlannerItem>) => Promise<ContentPlannerItem | null>;
  removeItem: (id: string) => Promise<void>;
  moveItem: (id: string, destinationStatus: ContentPlannerStatus) => Promise<ContentPlannerItem | null>;
  generateSuggestions: (count: number, objective?: string, format?: string) => Promise<void>;
}
