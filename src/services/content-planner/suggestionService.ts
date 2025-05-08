
import { toast } from 'sonner';
import { ContentPlannerItem, ContentPlannerStatus } from '@/types/content-planner';
import { GenerateContentSuggestionsResponse } from './types';

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
        status: 'idea' as ContentPlannerStatus,
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
