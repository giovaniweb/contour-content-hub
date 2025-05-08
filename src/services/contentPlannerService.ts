
import { ContentPlannerItem, ContentPlannerStatus, ContentPlannerFilter } from '@/types/content-planner';
import { toast } from 'sonner';

// Fetch content planner items based on filter
export const fetchContentPlannerItems = async (
  filters: ContentPlannerFilter = {}
): Promise<ContentPlannerItem[]> => {
  try {
    // This is a mock implementation
    // In a real app, this would query an API or database
    const mockItems: ContentPlannerItem[] = [
      {
        id: '1',
        title: 'Como usar equipamento para melhores resultados',
        description: 'Vídeo tutorial sobre o equipamento',
        status: 'idea',
        tags: ['tutorial', 'equipamento'],
        format: 'vídeo',
        objective: '🟡 Atrair Atenção',
        distribution: 'YouTube',
        equipmentId: 'eq1',
        equipmentName: 'Equipamento X',
        authorId: 'user1',
        authorName: 'João Silva',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiGenerated: false,
        responsibleId: 'user1',
        responsibleName: 'João Silva'
      },
      {
        id: '2',
        title: 'Benefícios do equipamento Y',
        description: 'Carrossel com infográficos dos benefícios',
        status: 'script_generated',
        tags: ['benefícios', 'infográfico'],
        scriptId: 'script1',
        format: 'carrossel',
        objective: '🟢 Criar Conexão',
        distribution: 'Instagram',
        equipmentId: 'eq2',
        equipmentName: 'Equipamento Y',
        authorId: 'user1',
        authorName: 'João Silva',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiGenerated: true,
        responsibleId: 'user2',
        responsibleName: 'Maria Souza'
      }
    ];
    
    // Filter the mock items
    return mockItems.filter(item => {
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
    });
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
    // Mock implementation
    const newItem: ContentPlannerItem = {
      id: `item-${Date.now()}`,
      title: item.title || '',
      description: item.description || '',
      status: item.status || 'idea',
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
      status: item.status || 'idea',
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
      status: 'scheduled',
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

// Generate AI content suggestions
export const generateContentSuggestions = async (
  count: number = 3,
  objective?: string,
  format?: string
): Promise<ContentPlannerItem[]> => {
  try {
    // Mock implementation
    const suggestions: ContentPlannerItem[] = [];
    
    for (let i = 0; i < count; i++) {
      suggestions.push({
        id: `ai-${Date.now()}-${i}`,
        title: `Sugestão de conteúdo ${i + 1}`,
        description: 'Conteúdo gerado por IA',
        status: 'idea',
        tags: ['IA', 'sugestão'],
        format: (format as any) || 'vídeo',
        objective: objective || '🟡 Atrair Atenção',
        distribution: 'Instagram',
        authorId: 'ai',
        authorName: 'AI Generator',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiGenerated: true,
        responsibleId: 'currentUser',
        responsibleName: 'Current User'
      });
    }
    
    toast.success(`${suggestions.length} sugestões geradas`);
    return suggestions;
  } catch (error) {
    console.error('Error in generateContentSuggestions:', error);
    toast.error("Erro ao gerar sugestões");
    return [];
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

// Helper to get a readable label for a status
const getStatusLabel = (status: ContentPlannerStatus): string => {
  switch (status) {
    case 'idea': return 'Ideia';
    case 'script_generated': return 'Roteiro Gerado';
    case 'approved': return 'Aprovado';
    case 'scheduled': return 'Agendado';
    case 'published': return 'Publicado';
    default: return 'Desconhecido';
  }
};
