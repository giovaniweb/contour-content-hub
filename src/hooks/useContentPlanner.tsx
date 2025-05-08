
import { useState, useEffect } from 'react';
import { ContentPlannerColumn, ContentPlannerItem, ContentPlannerStatus, ContentPlannerFilter } from '@/types/content-planner';
import { toast } from 'sonner';

export const useContentPlanner = () => {
  const [columns, setColumns] = useState<ContentPlannerColumn[]>([
    {
      id: 'idea',
      title: 'Ideias',
      items: [],
      icon: '💡'
    },
    {
      id: 'script_generated',
      title: 'Roteiro Gerado',
      items: [],
      icon: '✍️'
    },
    {
      id: 'approved',
      title: 'Aprovado',
      items: [],
      icon: '✅'
    },
    {
      id: 'scheduled',
      title: 'Agendado',
      items: [],
      icon: '📅'
    },
    {
      id: 'published',
      title: 'Publicado',
      items: [],
      icon: '📢'
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ContentPlannerFilter>({});

  // Mock data for demonstration
  useEffect(() => {
    const mockData: ContentPlannerItem[] = [
      {
        id: '1',
        title: 'Como usar o equipamento X para melhorar seus resultados',
        description: 'Vídeo explicativo sobre as funcionalidades avançadas do equipamento',
        status: 'idea',
        tags: ['tutorial', 'iniciante'],
        format: 'vídeo',
        objective: '🟡 Atrair Atenção',
        distribution: 'YouTube',
        equipmentId: 'eq1',
        equipmentName: 'Equipamento X',
        authorId: 'user1',
        authorName: 'João Silva',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiGenerated: false
      },
      {
        id: '2',
        title: 'Principais benefícios do equipamento Y',
        description: 'Carrossel com infográficos dos benefícios',
        status: 'script_generated',
        tags: ['benefícios', 'comparativo'],
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
        aiGenerated: true
      },
      {
        id: '3',
        title: 'Promoção especial - Equipamento Z',
        description: 'Reels mostrando a promoção limitada',
        status: 'approved',
        tags: ['promoção', 'limitado'],
        scriptId: 'script2',
        format: 'reels',
        objective: '🔴 Fazer Comprar',
        distribution: 'Instagram',
        equipmentId: 'eq3',
        equipmentName: 'Equipamento Z',
        authorId: 'user2',
        authorName: 'Maria Souza',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiGenerated: false
      },
      {
        id: '4',
        title: 'Depoimentos de clientes satisfeitos',
        description: 'Vídeo com depoimentos de clientes',
        status: 'scheduled',
        tags: ['depoimentos', 'resultados'],
        scriptId: 'script3',
        format: 'vídeo',
        objective: '✅ Fechar Agora',
        distribution: 'YouTube',
        equipmentId: 'eq1',
        equipmentName: 'Equipamento X',
        scheduledDate: '2025-05-15',
        authorId: 'user2',
        authorName: 'Maria Souza',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiGenerated: false,
        calendarEventId: 'calendar1'
      }
    ];

    // Simulate an API call delay
    setTimeout(() => {
      const newColumns = columns.map(column => ({
        ...column,
        items: mockData.filter(item => {
          // Apply filters
          if (filters.objective && item.objective !== filters.objective) return false;
          if (filters.format && item.format !== filters.format) return false;
          if (filters.distribution && item.distribution !== filters.distribution) return false;
          if (filters.equipmentId && item.equipmentId !== filters.equipmentId) return false;
          
          // Date range filter
          if (filters.dateRange?.from || filters.dateRange?.to) {
            if (!item.scheduledDate) return false;
            
            const itemDate = new Date(item.scheduledDate);
            
            if (filters.dateRange.from && itemDate < filters.dateRange.from) return false;
            if (filters.dateRange.to && itemDate > filters.dateRange.to) return false;
          }
          
          return item.status === column.id;
        })
      }));
      
      setColumns(newColumns);
      setLoading(false);
    }, 500);
  }, [filters]);

  // Add item to a column
  const addItem = async (item: Partial<ContentPlannerItem>) => {
    try {
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
        authorId: 'currentUser', // Would be replaced with actual user ID
        authorName: 'Current User', // Would be replaced with actual user name
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiGenerated: item.aiGenerated || false
      };

      setColumns(prev => 
        prev.map(column => 
          column.id === newItem.status
            ? { ...column, items: [...column.items, newItem] }
            : column
        )
      );

      toast.success('Item adicionado com sucesso!');
      return newItem;
    } catch (error) {
      toast.error('Erro ao adicionar item');
      console.error('Error adding item:', error);
    }
  };

  // Update an item
  const updateItem = async (id: string, updates: Partial<ContentPlannerItem>) => {
    try {
      let updatedItem: ContentPlannerItem | null = null;

      setColumns(prev => 
        prev.map(column => ({
          ...column,
          items: column.items.map(item => {
            if (item.id === id) {
              updatedItem = { ...item, ...updates, updatedAt: new Date().toISOString() };
              return updatedItem;
            }
            return item;
          })
        }))
      );

      if (updatedItem) {
        toast.success('Item atualizado com sucesso!');
        return updatedItem;
      } else {
        throw new Error('Item não encontrado');
      }
    } catch (error) {
      toast.error('Erro ao atualizar item');
      console.error('Error updating item:', error);
    }
  };

  // Remove an item
  const removeItem = async (id: string) => {
    try {
      setColumns(prev => 
        prev.map(column => ({
          ...column,
          items: column.items.filter(item => item.id !== id)
        }))
      );

      toast.success('Item removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover item');
      console.error('Error removing item:', error);
    }
  };

  // Move an item between columns
  const moveItem = async (id: string, destinationStatus: ContentPlannerStatus) => {
    try {
      let itemToMove: ContentPlannerItem | null = null;
      let sourceColumnId: ContentPlannerStatus | null = null;

      // Find the item and its source column
      columns.forEach(column => {
        const found = column.items.find(item => item.id === id);
        if (found) {
          itemToMove = found;
          sourceColumnId = column.id;
        }
      });

      if (!itemToMove || !sourceColumnId) {
        throw new Error('Item não encontrado');
      }

      // Create updated item with new status
      const updatedItem = {
        ...itemToMove,
        status: destinationStatus,
        updatedAt: new Date().toISOString()
      };

      // Update columns state
      setColumns(prev => 
        prev.map(column => {
          if (column.id === sourceColumnId) {
            // Remove from source column
            return {
              ...column,
              items: column.items.filter(item => item.id !== id)
            };
          }
          if (column.id === destinationStatus) {
            // Add to destination column
            return {
              ...column,
              items: [...column.items, updatedItem]
            };
          }
          return column;
        })
      );

      toast.success('Item movido com sucesso!');
      return updatedItem;
    } catch (error) {
      toast.error('Erro ao mover item');
      console.error('Error moving item:', error);
    }
  };

  // Generate AI suggestions based on objective and format
  const generateSuggestions = async (count: number, objective?: string, format?: string) => {
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

  return {
    columns,
    setColumns,
    loading,
    filters,
    setFilters,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    generateSuggestions
  };
};
