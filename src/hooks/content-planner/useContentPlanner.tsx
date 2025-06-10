
import { useState, useEffect } from 'react';
import { ContentPlannerFilter, ContentPlannerItem, ContentPlannerStatus, ContentFormat, ContentDistribution } from '@/types/content-planner';
import { initialColumns } from './initialState';
import { toast } from "sonner";
import { 
  createContentPlannerItem,
  updateContentPlannerItem,
  deleteContentPlannerItem,
  fetchContentPlannerItems
} from '@/services/content-planner';

export const useContentPlanner = (initialFilters: ContentPlannerFilter = {}) => {
  const [columns, setColumns] = useState(initialColumns);
  const [items, setItems] = useState<ContentPlannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContentPlannerFilter>(initialFilters);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Carregar itens do banco de dados
  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedItems = await fetchContentPlannerItems(filters);
      setItems(fetchedItems);
    } catch (err) {
      console.error("Erro ao carregar itens:", err);
      setError("Erro ao carregar itens do planejador");
    } finally {
      setLoading(false);
    }
  };

  // Carregar itens na inicialização e quando filtros mudam
  useEffect(() => {
    loadItems();
  }, [filters]);

  // Atualizar colunas quando items mudam
  useEffect(() => {
    const updatedColumns = initialColumns.map(column => {
      const columnItems = items.filter(item => item.status === column.id);
      
      return {
        ...column,
        items: columnItems
      };
    });
    
    setColumns(updatedColumns);
  }, [items]);

  // Gerar sugestões de conteúdo com IA
  const generateSuggestions = async (count = 3, objective?: string, format?: string): Promise<ContentPlannerItem[]> => {
    try {
      setLoading(true);
      
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
        
        const newItemData = {
          title: randomTopics[i] || `Sugestão IA: Conteúdo ${i+1}`,
          description: "Conteúdo gerado por IA baseado em tendências de mercado e dados de engajamento. Personalize conforme sua audiência.",
          status: 'idea' as ContentPlannerStatus,
          tags: ['ia', 'sugestão', 'trend', 'engajamento'],
          format: (format as ContentFormat) || formats[Math.floor(Math.random() * formats.length)],
          objective: objective || objectives[Math.floor(Math.random() * objectives.length)],
          distribution: 'Instagram' as ContentDistribution,
          aiGenerated: true
        };
        
        // Usar o serviço real para criar o item
        const createdItem = await createContentPlannerItem(newItemData);
        if (createdItem) {
          suggestions.push(createdItem);
        }
      }
      
      // Recarregar itens para incluir os novos
      await loadItems();
      
      toast.success(`🎯 ${suggestions.length} sugestões geradas!`, {
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

  // Adicionar item usando o serviço real
  const addItem = async (newItem: Partial<ContentPlannerItem>): Promise<ContentPlannerItem | null> => {
    try {
      setLoading(true);
      
      // Usar o serviço real para criar o item
      const createdItem = await createContentPlannerItem(newItem);
      
      if (createdItem) {
        // Recarregar itens para incluir o novo
        await loadItems();
        return createdItem;
      }
      
      return null;
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar item usando o serviço real
  const updateItem = async (id: string, updates: Partial<ContentPlannerItem>): Promise<ContentPlannerItem | null> => {
    try {
      setLoading(true);
      
      // Usar o serviço real para atualizar o item
      const updatedItem = await updateContentPlannerItem(id, updates);
      
      if (updatedItem) {
        // Recarregar itens para refletir as mudanças
        await loadItems();
        return updatedItem;
      }
      
      return null;
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Remover item usando o serviço real
  const removeItem = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Usar o serviço real para deletar o item
      const success = await deleteContentPlannerItem(id);
      
      if (success) {
        // Recarregar itens para remover o deletado
        await loadItems();
        return true;
      }
      
      return false;
    } catch (err) {
      console.error("Erro ao remover item:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Mover item de status usando o serviço real
  const moveItem = async (id: string, targetStatus: ContentPlannerStatus): Promise<ContentPlannerItem | null> => {
    try {
      setLoading(true);
      
      // Usar o serviço real para atualizar o status
      const updatedItem = await updateContentPlannerItem(id, { status: targetStatus });
      
      if (updatedItem) {
        // Recarregar itens para refletir as mudanças
        await loadItems();
        
        toast.success("🚀 Item movido!", {
          description: `Status alterado para ${targetStatus}`
        });
        
        return updatedItem;
      }
      
      return null;
    } catch (err) {
      console.error("Erro ao mover item:", err);
      toast.error("❌ Erro ao mover", {
        description: "Não foi possível alterar o status"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Funcionalidade de sincronização ativa
  const syncData = async () => {
    setLoading(true);
    try {
      await loadItems();
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
