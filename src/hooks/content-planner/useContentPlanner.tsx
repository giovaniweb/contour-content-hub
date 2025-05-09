
import { useState, useEffect } from 'react';
import { ContentPlannerFilter, ContentPlannerItem, ContentPlannerStatus, ContentFormat, ContentDistribution } from '@/types/content-planner';
import { initialColumns } from './initialState';
import { toast } from "sonner";

// Exemplo de dados mocados para o Content Planner
const mockItems: ContentPlannerItem[] = [
  {
    id: 'item-1',
    title: 'Video tutorial sobre tratamento facial',
    description: 'Vídeo explicativo sobre os benefícios do tratamento facial com ácido hialurônico',
    status: 'idea',
    tags: ['facial', 'tutorial', 'ácido'],
    format: 'vídeo',
    objective: '🟡 Atrair Atenção',
    distribution: 'Instagram',
    authorId: 'user-1',
    authorName: 'Dr. Silva',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: false
  },
  {
    id: 'item-2',
    title: 'Benefícios do lifting facial',
    description: 'Conteúdo sobre os principais benefícios do lifting facial não cirúrgico',
    status: 'script_generated',
    tags: ['facial', 'lifting', 'rejuvenescimento'],
    scriptId: 'script-123',
    format: 'reels',
    objective: '🟡 Atrair Atenção',
    distribution: 'Instagram',
    authorId: 'user-1',
    authorName: 'Dr. Silva',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: true
  },
  {
    id: 'item-3',
    title: 'Como funciona o botox preventivo?',
    description: 'Explicação detalhada sobre o uso de botox para prevenção de rugas',
    status: 'approved',
    tags: ['botox', 'prevenção', 'rugas'],
    scriptId: 'script-456',
    format: 'vídeo',
    objective: '🔴 Fazer Comprar',
    distribution: 'YouTube',
    authorId: 'user-1',
    authorName: 'Dr. Silva',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: false
  },
  {
    id: 'item-4',
    title: 'Aplicação de preenchimento labial',
    description: 'Demonstração de aplicação de preenchimento labial com ácido hialurônico',
    status: 'scheduled',
    tags: ['preenchimento', 'labial', 'procedimento'],
    scriptId: 'script-789',
    format: 'reels',
    objective: '🟢 Criar Conexão',
    distribution: 'TikTok',
    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
    authorId: 'user-1',
    authorName: 'Dr. Silva',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: false
  },
  {
    id: 'item-5',
    title: 'Comparação entre procedimentos faciais',
    description: 'Infográfico comparando diferentes procedimentos para rejuvenescimento facial',
    status: 'published',
    tags: ['facial', 'comparação', 'rejuvenescimento'],
    format: 'carrossel',
    objective: '🟡 Atrair Atenção',
    distribution: 'Instagram',
    authorId: 'user-1',
    authorName: 'Dr. Silva',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: false
  }
];

export const useContentPlanner = (initialFilters: ContentPlannerFilter = {}) => {
  const [columns, setColumns] = useState(initialColumns);
  const [items, setItems] = useState<ContentPlannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContentPlannerFilter>(initialFilters);

  // Carregar dados iniciais (mock)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simular uma chamada API
        await new Promise(resolve => setTimeout(resolve, 800));
        setItems(mockItems);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Falha ao carregar os itens do planner");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Adicionar item
  const addItem = async (newItem: Partial<ContentPlannerItem>): Promise<ContentPlannerItem | null> => {
    try {
      // Criar um novo item com valores padrão
      const item: ContentPlannerItem = {
        id: `item-${Date.now()}`,
        title: newItem.title || 'Novo conteúdo',
        description: newItem.description || '',
        status: newItem.status || 'idea',
        tags: newItem.tags || [],
        format: (newItem.format || 'vídeo') as ContentFormat,
        objective: newItem.objective || '🟡 Atrair Atenção',
        distribution: (newItem.distribution || 'Instagram') as ContentDistribution,
        authorId: newItem.authorId || 'user-1',
        authorName: newItem.authorName || 'Usuário',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiGenerated: newItem.aiGenerated || false,
        ...(newItem.scriptId && { scriptId: newItem.scriptId }),
        ...(newItem.scheduledDate && { scheduledDate: newItem.scheduledDate })
      };

      // Simular uma chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Adicionar item ao estado
      setItems(prevItems => [...prevItems, item]);
      
      toast.success("Item adicionado com sucesso", {
        description: `${item.title} foi adicionado ao planner`
      });
      
      return item;
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
      toast.error("Erro ao adicionar item", {
        description: "Não foi possível adicionar o item ao planner"
      });
      return null;
    }
  };

  // Atualizar item
  const updateItem = async (id: string, updates: Partial<ContentPlannerItem>): Promise<ContentPlannerItem | null> => {
    try {
      // Simular uma chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Atualizar item no estado
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, ...updates, updatedAt: new Date().toISOString() } 
            : item
        )
      );
      
      const updatedItem = items.find(item => item.id === id);
      if (!updatedItem) return null;
      
      return { ...updatedItem, ...updates };
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
      toast.error("Erro ao atualizar item", {
        description: "Não foi possível atualizar o item"
      });
      return null;
    }
  };

  // Remover item
  const removeItem = async (id: string): Promise<boolean> => {
    try {
      // Simular uma chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remover item do estado
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      return true;
    } catch (err) {
      console.error("Erro ao remover item:", err);
      toast.error("Erro ao remover item", {
        description: "Não foi possível remover o item"
      });
      return false;
    }
  };

  // Mover item de status
  const moveItem = async (id: string, targetStatus: ContentPlannerStatus): Promise<ContentPlannerItem | null> => {
    try {
      // Simular uma chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Atualizar status do item
      let updatedItem: ContentPlannerItem | undefined;
      
      setItems(prevItems => 
        prevItems.map(item => {
          if (item.id === id) {
            updatedItem = { 
              ...item, 
              status: targetStatus, 
              updatedAt: new Date().toISOString() 
            };
            return updatedItem;
          }
          return item;
        })
      );
      
      if (!updatedItem) return null;
      
      return updatedItem;
    } catch (err) {
      console.error("Erro ao mover item:", err);
      toast.error("Erro ao mover item", {
        description: "Não foi possível mudar o status do item"
      });
      return null;
    }
  };

  // Gerar sugestões de conteúdo com IA
  const generateSuggestions = async (count = 3, objective?: string, format?: string): Promise<ContentPlannerItem[]> => {
    try {
      setLoading(true);
      
      // Simular uma chamada API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const suggestions: ContentPlannerItem[] = [];
      
      const topics = [
        "Os 5 melhores tratamentos para rejuvenescimento facial",
        "Mitos e verdades sobre o botox",
        "Como escolher o preenchimento ideal para sua pele",
        "Cuidados essenciais após procedimentos estéticos",
        "Tratamentos não invasivos para flacidez facial"
      ];
      
      const randomTopics = [...topics].sort(() => 0.5 - Math.random()).slice(0, count);
      
      for (let i = 0; i < count; i++) {
        const newItem: ContentPlannerItem = {
          id: `item-ai-${Date.now()}-${i}`,
          title: randomTopics[i] || `Sugestão de conteúdo ${i+1}`,
          description: "Conteúdo gerado por IA baseado nas suas preferências e dados históricos de engajamento.",
          status: 'idea',
          tags: ['ia', 'sugestão', 'automatizado'],
          format: (format || ['vídeo', 'reels', 'carrossel'][Math.floor(Math.random() * 3)]) as ContentFormat,
          objective: objective || '🟡 Atrair Atenção',
          distribution: 'Instagram' as ContentDistribution,
          authorId: 'ai-assistant',
          authorName: 'Assistente IA',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          aiGenerated: true
        };
        
        suggestions.push(newItem);
      }
      
      // Adicionar sugestões ao estado
      setItems(prevItems => [...prevItems, ...suggestions]);
      
      toast.success(`${count} sugestões geradas`, {
        description: "Novos itens de conteúdo foram adicionados"
      });
      
      return suggestions;
    } catch (err) {
      console.error("Erro ao gerar sugestões:", err);
      toast.error("Erro ao gerar sugestões", {
        description: "Não foi possível gerar novas sugestões de conteúdo"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    columns,
    items,
    loading,
    error,
    filters,
    setFilters,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    generateSuggestions
  };
};
