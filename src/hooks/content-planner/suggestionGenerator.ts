
import { ContentPlannerItem, ContentFormat } from '@/types/content-planner';
import { toast } from 'sonner';

export function useSuggestionGenerator(addItem: (item: Partial<ContentPlannerItem>) => Promise<ContentPlannerItem | null>) {
  // Generate AI suggestions based on objective and format
  const generateSuggestions = async (count: number, objective?: string, format?: string): Promise<void> => {
    try {
      // This would be replaced with an actual API call to an AI service
      // For now, we'll just create mock suggestions
      const suggestions: Partial<ContentPlannerItem>[] = [
        {
          title: 'Como a nova tecnologia do equipamento X revoluciona o mercado',
          description: 'Análise das principais inovações tecnológicas',
          tags: ['tecnologia', 'inovação'],
          format: 'vídeo' as ContentFormat,
          objective: objective || '🟡 Atrair Atenção',
          distribution: 'YouTube',
          equipmentId: 'eq1',
          equipmentName: 'Equipamento X',
          aiGenerated: true
        },
        {
          title: '5 resultados surpreendentes que o equipamento Y pode trazer',
          description: 'Lista de resultados comprovados por especialistas',
          tags: ['resultados', 'especialistas'],
          format: 'carrossel' as ContentFormat,
          objective: objective || '🟢 Criar Conexão',
          distribution: 'Instagram',
          equipmentId: 'eq2',
          equipmentName: 'Equipamento Y',
          aiGenerated: true
        },
        {
          title: 'Oferta relâmpago - Apenas hoje para o equipamento Z',
          description: 'Oferta exclusiva com desconto imperdível',
          tags: ['promoção', 'oferta'],
          format: 'reels' as ContentFormat,
          objective: objective || '🔴 Fazer Comprar',
          distribution: 'Instagram',
          equipmentId: 'eq3',
          equipmentName: 'Equipamento Z',
          aiGenerated: true
        }
      ];

      // Take suggestions based on the requested number
      const selectedSuggestions = suggestions.slice(0, count);

      // Add each suggestion
      for (const suggestion of selectedSuggestions) {
        await addItem(suggestion);
      }

      toast.success(`${selectedSuggestions.length} sugestões geradas com sucesso!`);
    } catch (error) {
      toast.error('Erro ao gerar sugestões');
      console.error('Error generating suggestions:', error);
    }
  };

  return { generateSuggestions };
}
