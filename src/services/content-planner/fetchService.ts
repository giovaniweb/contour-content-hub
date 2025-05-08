
import { toast } from 'sonner';
import { ContentPlannerItem, ContentPlannerFilter } from '@/types/content-planner';
import { mockContentItems } from './mockData';
import { applyFilters } from './utils';
import { FetchContentPlannerItemsResponse } from './types';

// Fetch content planner items based on filter
export const fetchContentPlannerItems = async (
  filters: ContentPlannerFilter = {}
): Promise<ContentPlannerItem[]> => {
  try {
    // This is a mock implementation
    // In a real app, this would query an API or database
    
    // Filter the mock items
    return mockContentItems.filter(item => applyFilters(item, filters));
  } catch (error) {
    console.error('Error in fetchContentPlannerItems:', error);
    return [];
  }
};
