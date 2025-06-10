
import { ContentPlannerItem, ContentPlannerFilter } from '@/types/content-planner';
import { supabase } from '@/integrations/supabase/client';
import { safeQueryResult } from '@/utils/validation/supabaseHelpers';

// Raw database row type for content_planner_items
interface ContentPlannerItemRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  tags: string[] | null;
  format: string;
  objective: string;
  distribution: string;
  equipment_id: string | null;
  equipment_name: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  calendar_event_id: string | null;
  author_id: string | null;
  author_name: string | null;
  responsible_id: string | null;
  responsible_name: string | null;
  ai_generated: boolean | null;
  script_id: string | null;
  created_at: string;
  updated_at: string;
}

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

    // Build the query using explicit type casting to avoid deep type inference
    let query = supabase
      .from('content_planner_items' as any)
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

    const response = await query;
    const data = safeQueryResult<ContentPlannerItemRow>(response);

    if (!data) {
      console.error('Error fetching content planner items');
      return [];
    }

    // Convert database format to ContentPlannerItem format
    const items: ContentPlannerItem[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      status: item.status as any,
      tags: item.tags || [],
      scriptId: item.script_id,
      format: item.format as any,
      objective: item.objective,
      distribution: item.distribution as any,
      equipmentId: item.equipment_id,
      equipmentName: item.equipment_name,
      scheduledDate: item.scheduled_date,
      scheduledTime: item.scheduled_time,
      calendarEventId: item.calendar_event_id,
      authorId: item.author_id,
      authorName: item.author_name,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      aiGenerated: item.ai_generated || false,
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
