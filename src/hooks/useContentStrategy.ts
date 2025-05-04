
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  fetchContentStrategyItems, 
  createContentStrategyItem,
  updateContentStrategyItem,
  deleteContentStrategyItem,
  generateContentWithAI,
  scheduleContentInCalendar 
} from "@/services/contentStrategyService";
import { ContentStrategyFilter, ContentStrategyItem } from "@/types/content-strategy";

export const useContentStrategy = () => {
  const [items, setItems] = useState<ContentStrategyItem[]>([]);
  const [filters, setFilters] = useState<ContentStrategyFilter>({});
  const [equipments, setEquipments] = useState<{ id: string; nome: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; nome: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data with filters
  const fetchData = useCallback(async (currentFilters: ContentStrategyFilter = filters) => {
    setIsLoading(true);
    try {
      const data = await fetchContentStrategyItems(currentFilters);
      setItems(data);
    } catch (error) {
      console.error("Error fetching content strategy items:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch equipments from Supabase
  const fetchEquipments = async () => {
    try {
      const { data, error } = await supabase
        .from("equipamentos")
        .select("id, nome")
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (error) throw error;
      setEquipments(data || []);
    } catch (error) {
      console.error("Error fetching equipments:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar equipamentos",
        description: "Não foi possível obter a lista de equipamentos.",
      });
    }
  };

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("perfis")
        .select("id, nome")
        .order("nome", { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
        description: "Não foi possível obter a lista de usuários.",
      });
    }
  };

  // Set filters and refresh data
  const handleFilterChange = (newFilters: ContentStrategyFilter) => {
    setFilters(newFilters);
  };

  // Create new content strategy item
  const handleCreateItem = async (item: Partial<ContentStrategyItem>) => {
    setIsSubmitting(true);
    try {
      const newItem = await createContentStrategyItem(item);
      if (newItem) {
        // Ensure newItem is properly typed as ContentStrategyItem
        const typedItem: ContentStrategyItem = newItem as ContentStrategyItem;
        setItems(prev => [typedItem, ...prev]);
      }
    } catch (error) {
      console.error("Error creating item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update content strategy item
  const handleUpdateItem = async (id: string, updates: Partial<ContentStrategyItem>) => {
    try {
      const success = await updateContentStrategyItem(id, updates);
      if (success) {
        setItems(prev =>
          prev.map(item => (item.id === id ? { ...item, ...updates } as ContentStrategyItem : item))
        );
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating item:", error);
      return Promise.reject(error);
    }
  };

  // Delete content strategy item
  const handleDeleteItem = async (id: string) => {
    try {
      const success = await deleteContentStrategyItem(id);
      if (success) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting item:", error);
      return Promise.reject(error);
    }
  };

  // Generate content with AI
  const handleGenerateContent = async (item: ContentStrategyItem) => {
    try {
      const content = await generateContentWithAI(item);
      if (content) {
        await handleUpdateItem(item.id, { conteudo: content });
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Error generating content:", error);
      return Promise.reject(error);
    }
  };

  // Schedule content in calendar
  const handleScheduleContent = async (item: ContentStrategyItem) => {
    try {
      await scheduleContentInCalendar(item);
      return Promise.resolve();
    } catch (error) {
      console.error("Error scheduling content:", error);
      return Promise.reject(error);
    }
  };

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchEquipments();
    fetchUsers();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    fetchData(filters);
  }, [filters, fetchData]);

  return {
    items,
    filters,
    equipments,
    users,
    isLoading,
    isSubmitting,
    fetchData,
    handleFilterChange,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,
    handleGenerateContent,
    handleScheduleContent
  };
};
