
import { toast } from 'sonner';
import { ContentPlannerItem, ContentPlannerStatus } from '@/types/content-planner';
import { supabase } from '@/integrations/supabase/client';

// Create a new content planner item
export const createContentPlannerItem = async (
  item: Partial<ContentPlannerItem>
): Promise<ContentPlannerItem | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast.error("Você precisa estar logado para criar itens");
      return null;
    }

    const itemData = {
      user_id: user.user.id,
      title: item.title || 'Sem título',
      description: item.description || '',
      status: item.status || 'idea',
      tags: item.tags || [],
      format: item.format || 'vídeo',
      objective: item.objective || '🟡 Atrair Atenção',
      distribution: item.distribution || 'Instagram',
      equipment_id: item.equipmentId,
      equipment_name: item.equipmentName,
      scheduled_date: item.scheduledDate ? new Date(item.scheduledDate).toISOString().split('T')[0] : null,
      scheduled_time: item.scheduledTime,
      calendar_event_id: item.calendarEventId,
      author_id: item.authorId || user.user.id,
      author_name: item.authorName || user.user.email,
      responsible_id: item.responsibleId || user.user.id,
      responsible_name: item.responsibleName || user.user.email,
      ai_generated: item.aiGenerated || false,
      script_id: item.scriptId
    };

    const { data, error } = await supabase
      .from('content_planner_items')
      .insert(itemData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar item:', error);
      toast.error("Erro ao criar item: " + error.message);
      return null;
    }

    // Convert database format to ContentPlannerItem format
    const newItem: ContentPlannerItem = {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status as ContentPlannerStatus,
      tags: data.tags || [],
      scriptId: data.script_id,
      format: data.format as any,
      objective: data.objective,
      distribution: data.distribution as any,
      equipmentId: data.equipment_id,
      equipmentName: data.equipment_name,
      scheduledDate: data.scheduled_date,
      scheduledTime: data.scheduled_time,
      calendarEventId: data.calendar_event_id,
      authorId: data.author_id,
      authorName: data.author_name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      aiGenerated: data.ai_generated,
      createdById: data.user_id,
      responsibleId: data.responsible_id,
      responsibleName: data.responsible_name
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
    const updateData: any = {};
    
    if (item.title !== undefined) updateData.title = item.title;
    if (item.description !== undefined) updateData.description = item.description;
    if (item.status !== undefined) updateData.status = item.status;
    if (item.tags !== undefined) updateData.tags = item.tags;
    if (item.format !== undefined) updateData.format = item.format;
    if (item.objective !== undefined) updateData.objective = item.objective;
    if (item.distribution !== undefined) updateData.distribution = item.distribution;
    if (item.equipmentId !== undefined) updateData.equipment_id = item.equipmentId;
    if (item.equipmentName !== undefined) updateData.equipment_name = item.equipmentName;
    if (item.scheduledDate !== undefined) {
      updateData.scheduled_date = item.scheduledDate ? new Date(item.scheduledDate).toISOString().split('T')[0] : null;
    }
    if (item.scheduledTime !== undefined) updateData.scheduled_time = item.scheduledTime;
    if (item.responsibleId !== undefined) updateData.responsible_id = item.responsibleId;
    if (item.responsibleName !== undefined) updateData.responsible_name = item.responsibleName;

    const { data, error } = await supabase
      .from('content_planner_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar item:', error);
      toast.error("Erro ao atualizar item: " + error.message);
      return null;
    }

    // Convert database format to ContentPlannerItem format
    const updatedItem: ContentPlannerItem = {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status as ContentPlannerStatus,
      tags: data.tags || [],
      scriptId: data.script_id,
      format: data.format as any,
      objective: data.objective,
      distribution: data.distribution as any,
      equipmentId: data.equipment_id,
      equipmentName: data.equipment_name,
      scheduledDate: data.scheduled_date,
      scheduledTime: data.scheduled_time,
      calendarEventId: data.calendar_event_id,
      authorId: data.author_id,
      authorName: data.author_name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      aiGenerated: data.ai_generated,
      createdById: data.user_id,
      responsibleId: data.responsible_id,
      responsibleName: data.responsible_name
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
    const { error } = await supabase
      .from('content_planner_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar item:', error);
      toast.error("Erro ao remover item: " + error.message);
      return false;
    }
    
    toast.success("Item removido com sucesso");
    return true;
  } catch (error) {
    console.error('Error in deleteContentPlannerItem:', error);
    toast.error("Erro ao remover item");
    return false;
  }
};
