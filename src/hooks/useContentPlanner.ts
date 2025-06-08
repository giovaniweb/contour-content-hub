
import { useState, useEffect, useMemo } from 'react';
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { 
  ContentPlannerItem, 
  ContentPlannerStatus, 
  ContentPlannerColumn, 
  ContentPlannerFilter 
} from '@/types/content-planner';
import { 
  fetchContentPlannerItems,
  createContentPlannerItem,
  updateContentPlannerItem,
  deleteContentPlannerItem,
  scheduleContentPlannerItem,
  generateContentSuggestions,
  canMoveToStatus
} from '@/services/contentPlannerService';

export function useContentPlanner(initialFilters: ContentPlannerFilter = {}) {
  const { user } = useAuth();
  const [items, setItems] = useState<ContentPlannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContentPlannerFilter>(initialFilters);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  
  // Define columns
  const columns = useMemo<ContentPlannerColumn[]>(() => [
    {
      id: 'idea',
      title: '💡 Ideias',
      icon: '💡',
      items: items.filter(item => item.status === 'idea')
    },
    {
      id: 'approved',
      title: '⚡ Executar',
      icon: '⚡',
      items: items.filter(item => item.status === 'approved')
    },
    {
      id: 'published',
      title: '📢 Publicar',
      icon: '📢',
      items: items.filter(item => item.status === 'published')
    }
  ], [items]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log("🔄 Auto-refresh do planejador");
      // Simulate data refresh
      setItems(prevItems => 
        prevItems.map(item => ({
          ...item,
          updatedAt: new Date().toISOString()
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);
  
  // Fetch items when filters change
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchContentPlannerItems(filters);
        setItems(data);
      } catch (err: any) {
        setError(err.message || 'Error loading content planner items');
        toast.error("Erro ao carregar itens de planejamento", {
          description: "Não foi possível carregar os itens. Tente novamente."
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadItems();
  }, [filters]);
  
  // Add a new item
  const addItem = async (item: Partial<ContentPlannerItem>): Promise<ContentPlannerItem | null> => {
    try {
      const newItem = await createContentPlannerItem(item);
      if (newItem) {
        setItems(prev => [...prev, newItem]);
        toast.success("Item criado com sucesso", {
          description: "O item foi adicionado ao planejamento."
        });
        return newItem;
      }
      return null;
    } catch (err: any) {
      toast.error("Erro ao criar item", {
        description: err.message || "Não foi possível criar o item."
      });
      return null;
    }
  };
  
  // Update an item
  const updateItem = async (id: string, data: Partial<ContentPlannerItem>): Promise<ContentPlannerItem | null> => {
    try {
      const updatedItem = await updateContentPlannerItem(id, data);
      if (updatedItem) {
        setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
        return updatedItem;
      }
      return null;
    } catch (err: any) {
      toast.error("Erro ao atualizar item", {
        description: err.message || "Não foi possível atualizar o item."
      });
      return null;
    }
  };
  
  // Delete an item
  const removeItem = async (id: string): Promise<boolean> => {
    try {
      const success = await deleteContentPlannerItem(id);
      if (success) {
        setItems(prev => prev.filter(item => item.id !== id));
        toast.success("Item removido com sucesso", {
          description: "O item foi removido do planejamento."
        });
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error("Erro ao remover item", {
        description: err.message || "Não foi possível remover o item."
      });
      return false;
    }
  };
  
  // Move an item to a different status
  const moveItem = async (itemId: string, targetStatus: ContentPlannerStatus): Promise<boolean> => {
    try {
      // Find the item
      const item = items.find(i => i.id === itemId);
      if (!item) return false;
      
      // Check permissions
      if (!user || !canMoveToStatus(item, targetStatus, user.id)) {
        toast.error("Permissão negada", {
          description: "Você não tem permissão para mover este item para este status."
        });
        return false;
      }
      
      // Update the item status
      const updatedItem = await updateContentPlannerItem(itemId, { status: targetStatus });
      if (updatedItem) {
        setItems(prev => prev.map(i => i.id === itemId ? updatedItem : i));
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error("Erro ao mover item", {
        description: err.message || "Não foi possível mover o item."
      });
      return false;
    }
  };
  
  // Generate AI suggestions
  const generateSuggestions = async (count?: number, objective?: string, format?: string): Promise<ContentPlannerItem[]> => {
    try {
      setLoading(true);
      const suggestions = await generateContentSuggestions(count, objective, format);
      
      // Add generated suggestions to the state
      const newItems = [...items];
      for (const suggestion of suggestions) {
        const newItem = await createContentPlannerItem(suggestion);
        if (newItem) {
          newItems.push(newItem);
        }
      }
      
      setItems(newItems);
      toast.success(`${suggestions.length} sugestões geradas`, {
        description: "Novas ideias de conteúdo foram adicionadas ao planejamento."
      });
      
      return suggestions;
    } catch (err: any) {
      toast.error("Erro ao gerar sugestões", {
        description: err.message || "Não foi possível gerar sugestões de conteúdo."
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Sync data functionality
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
    items,
    columns,
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
}
