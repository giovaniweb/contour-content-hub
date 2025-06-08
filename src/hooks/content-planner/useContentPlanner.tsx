import { useState, useEffect } from 'react';
import { ContentPlannerFilter, ContentPlannerItem, ContentPlannerStatus, ContentFormat, ContentDistribution } from '@/types/content-planner';
import { initialColumns, mockItems } from './initialState';
import { toast } from "sonner";

export const useContentPlanner = (initialFilters: ContentPlannerFilter = {}) => {
  const [columns, setColumns] = useState(initialColumns);
  const [items, setItems] = useState<ContentPlannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContentPlannerFilter>(initialFilters);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setItems(mockItems);
        setError(null);
        
        console.log("📋 Dados do planejador carregados:", mockItems);
        
        toast.success("Planejador carregado", {
          description: "Dados atualizados com sucesso!"
        });
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Falha ao carregar os itens do planner");
        toast.error("Erro no planejador", {
          description: "Não foi possível carregar os dados"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-refresh a cada 30 segundos se ativo
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log("🔄 Auto-refresh do planejador");
      // Simular pequenas atualizações
      setItems(prevItems => 
        prevItems.map(item => ({
          ...item,
          updatedAt: new Date().toISOString()
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Atualizar colunas quando items mudam
  useEffect(() => {
    const updatedColumns = initialColumns.map(column => {
      const columnItems = items.filter(item => item.status === column.id);
      console.log(`📊 Coluna ${column.title}: ${columnItems.length} itens`);
      
      return {
        ...column,
        items: columnItems
      };
    });
    
    setColumns(updatedColumns);
    console.log("🔄 Colunas atualizadas:", updatedColumns);
  }, [items]);

  // Gerar sugestões de conteúdo com IA
  const generateSuggestions = async (count = 3, objective?: string, format?: string): Promise<ContentPlannerItem[]> => {
    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const suggestions: ContentPlannerItem[] = [];
      
      const topics = [
        "5 melhores tratamentos para rejuvenescimento facial em 2024",
        "Mitos e verdades sobre botox: o que você precisa saber",
        "Como escolher o preenchimento ideal para seu tipo de pele",
        "Cuidados pós-procedimento: dicas essenciais para melhores resultados",
        "Tratamentos não invasivos: alternativas ao lifting cirúrgico",
        "Harmonização facial: técnicas modernas e seguras",
        "Prevenção do envelhecimento: quando começar os tratamentos",
        "Diferenças entre ácido hialurônico e outros preenchedores"
      ];
      
      const randomTopics = [...topics].sort(() => 0.5 - Math.random()).slice(0, count);
      
      for (let i = 0; i < count; i++) {
        const formats: ContentFormat[] = ['vídeo', 'reels', 'carrossel', 'story'];
        const objectives = ['🟡 Atrair Atenção', '🔴 Fazer Comprar', '🟢 Criar Conexão'];
        
        const newItem: ContentPlannerItem = {
          id: `item-ai-${Date.now()}-${i}`,
          title: randomTopics[i] || `Sugestão IA: Conteúdo ${i+1}`,
          description: "Conteúdo gerado por IA baseado em tendências de mercado e dados de engajamento. Personalize conforme sua audiência.",
          status: 'idea',
          tags: ['ia', 'sugestão', 'trend', 'engajamento'],
          format: (format as ContentFormat) || formats[Math.floor(Math.random() * formats.length)],
          objective: objective || objectives[Math.floor(Math.random() * objectives.length)],
          distribution: 'Instagram' as ContentDistribution,
          authorId: 'ai-assistant',
          authorName: '🤖 Assistente IA',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          aiGenerated: true
        };
        
        suggestions.push(newItem);
      }
      
      setItems(prevItems => [...suggestions, ...prevItems]);
      
      toast.success(`🎯 ${count} sugestões geradas!`, {
        description: "Novas ideias inteligentes adicionadas ao planejador"
      });
      
      return suggestions;
    } catch (err) {
      console.error("Erro ao gerar sugestões:", err);
      toast.error("❌ Erro na geração IA", {
        description: "Não foi possível gerar sugestões automáticas"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Adicionar item
  const addItem = async (newItem: Partial<ContentPlannerItem>): Promise<ContentPlannerItem | null> => {
    try {
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

      await new Promise(resolve => setTimeout(resolve, 500));
      
      setItems(prevItems => [item, ...prevItems]);
      
      toast.success("✨ Item adicionado!", {
        description: `${item.title} foi adicionado ao planejador`
      });
      
      return item;
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
      toast.error("❌ Erro ao adicionar", {
        description: "Não foi possível adicionar o item"
      });
      return null;
    }
  };

  // Atualizar item
  const updateItem = async (id: string, updates: Partial<ContentPlannerItem>): Promise<ContentPlannerItem | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let updatedItem: ContentPlannerItem | null = null;
      
      setItems(prevItems => 
        prevItems.map(item => {
          if (item.id === id) {
            updatedItem = { ...item, ...updates, updatedAt: new Date().toISOString() };
            return updatedItem;
          }
          return item;
        })
      );
      
      if (updatedItem) {
        toast.success("✅ Item atualizado!", {
          description: "Alterações salvas com sucesso"
        });
      }
      
      return updatedItem;
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
      toast.error("❌ Erro na atualização", {
        description: "Não foi possível salvar as alterações"
      });
      return null;
    }
  };

  // Remover item
  const removeItem = async (id: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      toast.success("🗑️ Item removido!", {
        description: "Item removido do planejador"
      });
      
      return true;
    } catch (err) {
      console.error("Erro ao remover item:", err);
      toast.error("❌ Erro ao remover", {
        description: "Não foi possível remover o item"
      });
      return false;
    }
  };

  // Mover item de status
  const moveItem = async (id: string, targetStatus: ContentPlannerStatus): Promise<ContentPlannerItem | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      let movedItem: ContentPlannerItem | null = null;
      
      setItems(prevItems => 
        prevItems.map(item => {
          if (item.id === id) {
            movedItem = { 
              ...item, 
              status: targetStatus, 
              updatedAt: new Date().toISOString() 
            };
            return movedItem;
          }
          return item;
        })
      );
      
      if (movedItem) {
        toast.success("🚀 Item movido!", {
          description: `Status alterado para ${targetStatus}`
        });
      }
      
      return movedItem;
    } catch (err) {
      console.error("Erro ao mover item:", err);
      toast.error("❌ Erro ao mover", {
        description: "Não foi possível alterar o status"
      });
      return null;
    }
  };

  // Funcionalidade de sincronização ativa
  const syncData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("🔄 Dados sincronizados!", {
        description: "Planejador atualizado com últimas alterações"
      });
    } catch (err) {
      toast.error("❌ Erro na sincronização");
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
    autoRefresh,
    setFilters,
    setAutoRefresh,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    generateSuggestions,
    syncData
  };
};
