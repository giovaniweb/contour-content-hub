
import { toast } from 'sonner';
import { ContentPlannerItem, ContentPlannerStatus } from '@/types/content-planner';
import { getStatusLabel } from './utils';

// Move an item to a different status
export const moveItem = async (item: ContentPlannerItem, targetStatus: ContentPlannerStatus): Promise<ContentPlannerItem | null> => {
  try {
    // Mock implementation
    const updatedItem = {
      ...item,
      status: targetStatus,
      updatedAt: new Date().toISOString()
    };
    
    toast.success(`Item movido para ${getStatusLabel(targetStatus)}`);
    return updatedItem;
  } catch (error) {
    console.error('Error in moveItem:', error);
    toast.error("Erro ao mover item");
    return null;
  }
};

// Schedule an item in the calendar
export const scheduleContentPlannerItem = async (
  item: ContentPlannerItem,
  date: Date
): Promise<ContentPlannerItem | null> => {
  try {
    // Mock implementation
    const updatedItem = {
      ...item,
      status: 'scheduled' as ContentPlannerStatus,
      scheduledDate: date.toISOString().split('T')[0],
      calendarEventId: `cal-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    
    toast.success("Conteúdo agendado com sucesso");
    return updatedItem;
  } catch (error) {
    console.error('Error in scheduleContentPlannerItem:', error);
    toast.error("Erro ao agendar conteúdo");
    return null;
  }
};

// Check if user can move item to target status
export const canMoveToStatus = (
  item: ContentPlannerItem,
  targetStatus: ContentPlannerStatus,
  userId: string
): boolean => {
  // Mock implementation
  // In a real app, this would check user permissions
  return true;
};
