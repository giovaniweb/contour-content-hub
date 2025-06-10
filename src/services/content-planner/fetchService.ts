
import { ContentPlannerItem, ContentPlannerFilter } from '@/types/content-planner';
import { supabase } from '@/integrations/supabase/client';

// Fetch content planner items based on filter
export const fetchContentPlannerItems = async (
  filters: ContentPlannerFilter = {}
): Promise<ContentPlannerItem[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      console.log('User not authenticated');
      return [];
    }

    let query = supabase
      .from('content_planner_items')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.objective) {
      query = query.eq('objective', filters.objective);
    }
    
    if (filters.format) {
      query = query.eq('format', filters.format);
    }
    
    if (filters.distribution) {
      query = query.eq('distribution', filters.distribution);
    }
    
    if (filters.equipmentId) {
      query = query.eq('equipment_id', filters.equipmentId);
    }
    
    if (filters.responsibleId) {
      query = query.eq('responsible_id', filters.responsibleId);
    }

    if (filters.dateRange?.from) {
      query = query.gte('scheduled_date', filters.dateRange.from.toISOString().split('T')[0]);
    }
    
    if (filters.dateRange?.to) {
      query = query.lte('scheduled_date', filters.dateRange.to.toISOString().split('T')[0]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching content planner items:', error);
      return [];
    }

    // Convert database format to ContentPlannerItem format
    const items: ContentPlannerItem[] = (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      status: item.status,
      tags: item.tags || [],
      scriptId: item.script_id,
      format: item.format,
      objective: item.objective,
      distribution: item.distribution,
      equipmentId: item.equipment_id,
      equipmentName: item.equipment_name,
      scheduledDate: item.scheduled_date,
      scheduledTime: item.scheduled_time,
      calendarEventId: item.calendar_event_id,
      authorId: item.author_id,
      authorName: item.author_name,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      aiGenerated: item.ai_generated,
      createdById: item.user_id,
      responsibleId: item.responsible_id,
      responsibleName: item.responsible_name
    }));

    return items;
  } catch (error) {
    console.error('Error in fetchContentPlannerItems:', error);
    return [];
  }
};
