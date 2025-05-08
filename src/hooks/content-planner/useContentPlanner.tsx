
import { useState } from 'react';
import { ContentPlannerFilter } from '@/types/content-planner';
import { initialColumns } from './initialState';
import { useItemOperations } from './itemOperations';
import { useSuggestionGenerator } from './suggestionGenerator';
import { useDataLoader } from './dataLoader';
import { UseContentPlannerReturn } from './types';

export const useContentPlanner = (): UseContentPlannerReturn => {
  const [columns, setColumns] = useState(initialColumns);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ContentPlannerFilter>({});

  // Get item operations
  const { addItem, updateItem, removeItem, moveItem } = useItemOperations(columns, setColumns);

  // Get suggestion generator
  const { generateSuggestions } = useSuggestionGenerator(addItem);

  // Load mock data based on filters
  useDataLoader(columns, setColumns, filters, setLoading);

  return {
    columns,
    setColumns,
    loading,
    filters,
    setFilters,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    generateSuggestions
  };
};

export default useContentPlanner;
