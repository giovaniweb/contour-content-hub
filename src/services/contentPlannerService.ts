
import { supabase } from '@/integrations/supabase/client';
import { ContentPlannerItem, ContentPlannerStatus, ContentPlannerFilter } from '@/types/content-planner';
import { linkScriptToCalendar } from '@/utils/api-scripts';
import { scheduleContentInCalendar } from '@/services/contentStrategyService';
import { NewCalendarEvent } from '@/types/calendar';
import { usePermissions } from '@/hooks/use-permissions';

// Fetch content planner items
export const fetchContentPlannerItems = async (
  filters: ContentPlannerFilter = {}
): Promise<ContentPlannerItem[]> => {
  try {
    // Build the query
    let query = supabase
      .from('content_strategy_items')
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `);
    
    // Apply status filter
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query = query.in('status', filters.status);
      } else {
        query = query.eq('status', filters.status);
      }
    }
    
    // Apply other filters
    if (filters.objective) {
      query = query.eq('objetivo', filters.objective);
    }
    
    if (filters.distribution) {
      query = query.eq('distribuicao', filters.distribution);
    }
    
    if (filters.format) {
      query = query.eq('formato', filters.format);
    }
    
    if (filters.equipmentId) {
      query = query.eq('equipamento_id', filters.equipmentId);
    }
    
    if (filters.responsibleId) {
      query = query.eq('responsavel_id', filters.responsibleId);
    }
    
    if (filters.dateRange?.from) {
      query = query.gte('previsao', filters.dateRange.from.toISOString().split('T')[0]);
    }
    
    if (filters.dateRange?.to) {
      query = query.lte('previsao', filters.dateRange.to.toISOString().split('T')[0]);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching content planner items:', error);
      throw error;
    }
    
    // Transform data to the expected format
    return (data || []).map(item => ({
      id: item.id,
      title: item.titulo || item.conteudo || 'Untitled Content',
      description: item.descricao || '',
      status: mapStatusToPlannerStatus(item.status),
      tags: item.tags || [],
      scriptId: item.roteiro_id,
      format: item.formato,
      objective: item.objetivo,
      distribution: item.distribuicao,
      equipmentId: item.equipamento_id,
      equipmentName: item.equipamento?.nome,
      responsibleId: item.responsavel_id,
      responsibleName: item.responsavel?.nome,
      scheduledDate: item.previsao,
      calendarEventId: item.evento_agenda_id,
      aiGenerated: Boolean(item.ai_generated),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      createdById: item.created_by || ''
    }));
  } catch (error) {
    console.error('Error in fetchContentPlannerItems:', error);
    return [];
  }
};

// Create a new content planner item
export const createContentPlannerItem = async (
  item: Partial<ContentPlannerItem>
): Promise<ContentPlannerItem | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) throw new Error('User not authenticated');
    
    const newItem = {
      titulo: item.title,
      descricao: item.description,
      status: mapPlannerStatusToStatus(item.status || 'idea'),
      tags: item.tags,
      roteiro_id: item.scriptId,
      formato: item.format,
      objetivo: item.objective,
      distribuicao: item.distribution,
      equipamento_id: item.equipmentId,
      responsavel_id: item.responsibleId,
      previsao: item.scheduledDate,
      evento_agenda_id: item.calendarEventId,
      ai_generated: item.aiGenerated,
      created_by: userId
    };
    
    const { data, error } = await supabase
      .from('content_strategy_items')
      .insert(newItem)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating content planner item:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: data.titulo || 'Untitled Content',
      description: data.descricao || '',
      status: mapStatusToPlannerStatus(data.status),
      tags: data.tags || [],
      scriptId: data.roteiro_id,
      format: data.formato,
      objective: data.objetivo,
      distribution: data.distribuicao,
      equipmentId: data.equipamento_id,
      equipmentName: data.equipamento?.nome,
      responsibleId: data.responsavel_id,
      responsibleName: data.responsavel?.nome,
      scheduledDate: data.previsao,
      calendarEventId: data.evento_agenda_id,
      aiGenerated: Boolean(data.ai_generated),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdById: data.created_by || ''
    };
  } catch (error) {
    console.error('Error in createContentPlannerItem:', error);
    return null;
  }
};

// Update a content planner item
export const updateContentPlannerItem = async (
  id: string,
  item: Partial<ContentPlannerItem>
): Promise<ContentPlannerItem | null> => {
  try {
    const updateItem: any = {};
    
    if (item.title !== undefined) updateItem.titulo = item.title;
    if (item.description !== undefined) updateItem.descricao = item.description;
    if (item.status !== undefined) updateItem.status = mapPlannerStatusToStatus(item.status);
    if (item.tags !== undefined) updateItem.tags = item.tags;
    if (item.scriptId !== undefined) updateItem.roteiro_id = item.scriptId;
    if (item.format !== undefined) updateItem.formato = item.format;
    if (item.objective !== undefined) updateItem.objetivo = item.objective;
    if (item.distribution !== undefined) updateItem.distribuicao = item.distribution;
    if (item.equipmentId !== undefined) updateItem.equipamento_id = item.equipmentId;
    if (item.responsibleId !== undefined) updateItem.responsavel_id = item.responsibleId;
    if (item.scheduledDate !== undefined) updateItem.previsao = item.scheduledDate;
    if (item.calendarEventId !== undefined) updateItem.evento_agenda_id = item.calendarEventId;
    
    const { data, error } = await supabase
      .from('content_strategy_items')
      .update(updateItem)
      .eq('id', id)
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `)
      .single();
      
    if (error) {
      console.error('Error updating content planner item:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: data.titulo || 'Untitled Content',
      description: data.descricao || '',
      status: mapStatusToPlannerStatus(data.status),
      tags: data.tags || [],
      scriptId: data.roteiro_id,
      format: data.formato,
      objective: data.objetivo,
      distribution: data.distribuicao,
      equipmentId: data.equipamento_id,
      equipmentName: data.equipamento?.nome,
      responsibleId: data.responsavel_id,
      responsibleName: data.responsavel?.nome,
      scheduledDate: data.previsao,
      calendarEventId: data.evento_agenda_id,
      aiGenerated: Boolean(data.ai_generated),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdById: data.created_by || ''
    };
  } catch (error) {
    console.error('Error in updateContentPlannerItem:', error);
    return null;
  }
};

// Delete a content planner item
export const deleteContentPlannerItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('content_strategy_items')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting content planner item:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteContentPlannerItem:', error);
    return false;
  }
};

// Schedule an item to the calendar
export const scheduleContentPlannerItem = async (
  item: ContentPlannerItem,
  date: Date
): Promise<ContentPlannerItem | null> => {
  try {
    // Create calendar event
    const calendarEvent: NewCalendarEvent = {
      date: date.toISOString().split('T')[0],
      title: item.title,
      description: item.description || '',
      format: item.format as "video" | "story" | "image",
      completed: false,
      equipment: item.equipmentName || ''
    };
    
    // Schedule the content in calendar
    const calendarEventId = await scheduleContentInCalendar(calendarEvent);
    
    if (!calendarEventId) {
      throw new Error('Failed to schedule content in calendar');
    }
    
    // If there's an associated script, link it to the calendar
    if (item.scriptId) {
      await linkScriptToCalendar(item.scriptId, calendarEventId);
    }
    
    // Update the content planner item with the scheduled info
    return await updateContentPlannerItem(item.id, {
      status: 'scheduled',
      scheduledDate: calendarEvent.date,
      calendarEventId
    });
  } catch (error) {
    console.error('Error in scheduleContentPlannerItem:', error);
    return null;
  }
};

// Generate AI content suggestions based on strategy
export const generateContentSuggestions = async (
  count: number = 5,
  objective?: string,
  format?: string
): Promise<ContentPlannerItem[]> => {
  try {
    // This would typically call an AI service or edge function
    // For now we'll return placeholder data
    const suggestions: ContentPlannerItem[] = [];
    const now = new Date();
    
    const sampleTitles = [
      "5 mitos sobre tratamentos faciais desmistificados",
      "Como melhorar a retenção de clientes após procedimentos",
      "Guia completo: pós-operatório em procedimentos estéticos",
      "Transformações incríveis em 30 dias com nosso tratamento",
      "Por que a tecnologia faz diferença nos resultados estéticos"
    ];
    
    const sampleObjectives = [
      "🟡 Atrair Atenção",
      "🟢 Criar Conexão",
      "🔴 Fazer Comprar",
      "🔁 Reativar Interesse",
      "✅ Fechar Agora"
    ];
    
    const sampleFormats = ["vídeo", "story", "carrossel", "reels", "texto"];
    const sampleDistributions = ["Instagram", "YouTube", "TikTok", "Blog", "Múltiplos"];
    
    for (let i = 0; i < count; i++) {
      suggestions.push({
        id: `suggestion-${Date.now()}-${i}`,
        title: sampleTitles[i % sampleTitles.length],
        description: "Conteúdo gerado automaticamente pela IA com base nos objetivos estratégicos definidos.",
        status: "idea",
        tags: ["IA", "sugestão", format || sampleFormats[i % sampleFormats.length]],
        format: (format as any) || sampleFormats[i % sampleFormats.length],
        objective: (objective as any) || sampleObjectives[i % sampleObjectives.length],
        distribution: sampleDistributions[i % sampleDistributions.length],
        aiGenerated: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        createdById: "system-ai"
      });
    }
    
    return suggestions;
  } catch (error) {
    console.error('Error in generateContentSuggestions:', error);
    return [];
  }
};

// Helper functions
function mapStatusToPlannerStatus(status: string): ContentPlannerStatus {
  switch (status) {
    case 'Planejado':
      return 'idea';
    case 'Em andamento':
      return 'script_generated';
    case 'Finalizado':
      return 'approved';
    case 'Agendado':
      return 'scheduled';
    case 'Publicado':
      return 'published';
    default:
      return 'idea';
  }
}

function mapPlannerStatusToStatus(status: ContentPlannerStatus): string {
  switch (status) {
    case 'idea':
      return 'Planejado';
    case 'script_generated':
      return 'Em andamento';
    case 'approved':
      return 'Finalizado';
    case 'scheduled':
      return 'Agendado';
    case 'published':
      return 'Publicado';
    default:
      return 'Planejado';
  }
}

// Check if user has permission to move item to specific status
export const canMoveToStatus = (
  item: ContentPlannerItem,
  targetStatus: ContentPlannerStatus,
  userId: string
): boolean => {
  const { hasPermission } = usePermissions();
  const isOwner = item.createdById === userId || item.responsibleId === userId;
  const isAdmin = hasPermission('admin');
  const isOperator = hasPermission('operador');
  
  // Admins can do anything
  if (isAdmin) return true;
  
  // Check specific status transitions
  switch (targetStatus) {
    case 'approved':
      // Only admins and operators can approve content
      return isAdmin || isOperator;
    case 'published':
      // Only admins can mark as published
      return isAdmin;
    default:
      // For other statuses, owners can move their items
      return isOwner || isOperator;
  }
}
