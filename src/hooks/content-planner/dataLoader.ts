
import { useEffect } from 'react';
import { ContentPlannerColumn, ContentPlannerFilter, ContentPlannerItem } from '@/types/content-planner';
import { mockItems } from './initialState';

export function useDataLoader(
  columns: ContentPlannerColumn[],
  setColumns: React.Dispatch<React.SetStateAction<ContentPlannerColumn[]>>,
  filters: ContentPlannerFilter,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    // Simulate an API call delay
    setLoading(true);
    
    const timer = setTimeout(() => {
      const newColumns = columns.map(column => ({
        ...column,
        items: mockItems.filter(item => {
          // Apply filters
          if (filters.objective && item.objective !== filters.objective) return false;
          if (filters.format && item.format !== filters.format) return false;
          if (filters.distribution && item.distribution !== filters.distribution) return false;
          if (filters.equipmentId && item.equipmentId !== filters.equipmentId) return false;
          if (filters.responsibleId && item.responsibleId !== filters.responsibleId) return false;
          
          // Date range filter
          if (filters.dateRange?.from || filters.dateRange?.to) {
            if (!item.scheduledDate) return false;
            
            const itemDate = new Date(item.scheduledDate);
            
            if (filters.dateRange.from && itemDate < filters.dateRange.from) return false;
            if (filters.dateRange.to && itemDate > filters.dateRange.to) return false;
          }
          
          return item.status === column.id;
        })
      }));
      
      setColumns(newColumns);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters, setLoading, setColumns, columns]);
}
