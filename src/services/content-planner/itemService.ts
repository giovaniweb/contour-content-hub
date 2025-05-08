
import { toast } from 'sonner';
import { ContentPlannerItem, ContentPlannerStatus } from '@/types/content-planner';
import { getStatusLabel } from './utils';

// Create a new content planner item
export const createContentPlannerItem = async (
  item: Partial<ContentPlannerItem>
): Promise<ContentPlannerItem | null> => {
  try {
    // Mock implementation
    const newItem: ContentPlannerItem = {
      id: `item-${Date.now()}`,
      title: item.title || '',
      description: item.description || '',
      status: (item.status as ContentPlannerStatus) || 'idea' as ContentPlannerStatus,
      tags: item.tags || [],
      format: item.format || 'vídeo',
      objective: item.objective || '🟡 Atrair Atenção',
      distribution: item.distribution || 'Instagram',
      equipmentId: item.equipmentId,
      equipmentName: item.equipmentName,
      authorId: 'currentUser', // Would be set by auth context
      authorName: 'Current User', // Would be set by auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiGenerated: item.aiGenerated || false,
      responsibleId: item.responsibleId || 'currentUser',
      responsibleName: item.responsibleName || 'Current User'
    };
    
    toast.success("Item criado com sucesso");
    return newItem;
  } catch (error) {
    console.error('Error in createContentPlannerItem:', error);
    toast.error("Erro ao criar item");
    return null;
  }
};

// Update a content planner item
export const updateContentPlannerItem = async (
  id: string,
  item: Partial<ContentPlannerItem>
): Promise<ContentPlannerItem | null> => {
  try {
    // Mock implementation
    // In a real app, this would update the item in the database
    const updatedItem: ContentPlannerItem = {
      id,
      title: item.title || 'Untitled',
      description: item.description || '',
      status: (item.status as ContentPlannerStatus) || 'idea' as ContentPlannerStatus,
      tags: item.tags || [],
      scriptId: item.scriptId,
      format: item.format || 'vídeo',
      objective: item.objective || '🟡 Atrair Atenção',
      distribution: item.distribution || 'Instagram',
      equipmentId: item.equipmentId,
      equipmentName: item.equipmentName,
      scheduledDate: item.scheduledDate,
      scheduledTime: item.scheduledTime,
      calendarEventId: item.calendarEventId,
      authorId: 'currentUser', // Would be set by auth context
      authorName: 'Current User', // Would be set by auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiGenerated: item.aiGenerated || false,
      responsibleId: item.responsibleId || 'currentUser',
      responsibleName: item.responsibleName || 'Current User'
    };
    
    toast.success("Item atualizado com sucesso");
    return updatedItem;
  } catch (error) {
    console.error('Error in updateContentPlannerItem:', error);
    toast.error("Erro ao atualizar item");
    return null;
  }
};

// Delete a content planner item
export const deleteContentPlannerItem = async (id: string): Promise<boolean> => {
  try {
    // Mock implementation
    toast.success("Item removido com sucesso");
    return true;
  } catch (error) {
    console.error('Error in deleteContentPlannerItem:', error);
    toast.error("Erro ao remover item");
    return false;
  }
};
