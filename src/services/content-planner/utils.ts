
import { ContentPlannerStatus } from '@/types/content-planner';

// Helper to get a readable label for a status
export const getStatusLabel = (status: ContentPlannerStatus): string => {
  switch (status) {
    case 'idea': return 'Ideia';
    case 'script_generated': return 'Roteiro Gerado';
    case 'approved': return 'Aprovado';
    case 'scheduled': return 'Agendado';
    case 'published': return 'Publicado';
    default: return 'Desconhecido';
  }
};

// Helper function to apply filters to an item
export const applyFilters = (item: any, filters: any) => {
  // Apply filters
  if (filters.objective && item.objective !== filters.objective) return false;
  if (filters.format && item.format !== filters.format) return false;
  if (filters.distribution && item.distribution !== filters.distribution) return false;
  if (filters.equipmentId && item.equipmentId !== filters.equipmentId) return false;
  if (filters.responsibleId && item.responsibleId !== filters.responsibleId) return false;
  if (filters.status && item.status !== filters.status) return false;
  
  // Date range filter
  if (filters.dateRange?.from || filters.dateRange?.to) {
    if (!item.scheduledDate) return false;
    
    const itemDate = new Date(item.scheduledDate);
    
    if (filters.dateRange.from && itemDate < filters.dateRange.from) return false;
    if (filters.dateRange.to && itemDate > filters.dateRange.to) return false;
  }
  
  return true;
};
