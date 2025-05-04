
import { supabase } from "@/integrations/supabase/client";
import { ContentStrategyItem, ContentStrategyFilter } from "@/types/content-strategy";
import { toast } from "@/hooks/use-toast";
import { transformToContentStrategyItem, prepareContentStrategyData } from "@/utils/validation/contentStrategy";

/**
 * Busca itens de estratégia de conteúdo com filtros opcionais
 */
export async function fetchContentStrategyItems(filters: ContentStrategyFilter = {}): Promise<ContentStrategyItem[]> {
  try {
    let query = supabase
      .from('content_strategy_items')
      .select(`
        *,
        equipamento:equipamentos(nome),
        responsavel:perfis!responsavel_id(nome)
      `);

    // Aplicação dos filtros de forma simplificada
    if (filters.equipamento_id) {
      query = query.eq('equipamento_id', filters.equipamento_id);
    }
    
    if (filters.categoria) {
      query = query.eq('categoria', filters.categoria);
    }
    
    if (filters.formato) {
      query = query.eq('formato', filters.formato);
    }
    
    if (filters.responsavel_id) {
      query = query.eq('responsavel_id', filters.responsavel_id);
    }
    
    if (filters.objetivo) {
      query = query.eq('objetivo', filters.objetivo);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.distribuicao) {
      query = query.eq('distribuicao', filters.distribuicao);
    }
    
    // Tratamento especial para o dateRange
    if (filters.dateRange && filters.dateRange.from && filters.dateRange.to) {
      query = query
        .gte('previsao', filters.dateRange.from.toISOString())
        .lte('previsao', filters.dateRange.to.toISOString());
    }

    // Ordenação por data
    query = query.order('previsao', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    // Transformação dos dados com nossa função auxiliar
    return (data || []).map(item => transformToContentStrategyItem(item));
  } catch (error) {
    console.error("Error fetching content strategy items:", error);
    toast({
      variant: "destructive",
      title: "Erro ao carregar itens de estratégia",
      description: "Não foi possível carregar os itens de estratégia de conteúdo."
    });
    return [];
  }
}

/**
 * Cria um novo item de estratégia de conteúdo
 */
export async function createContentStrategyItem(item: Partial<ContentStrategyItem>): Promise<ContentStrategyItem | null> {
  try {
    // Preparamos os dados para inserção com os campos obrigatórios
    const dataToInsert = prepareContentStrategyData(item);
    
    // Adicionamos os campos obrigatórios se não estiverem presentes
    const requiredFields = {
      categoria: item.categoria || 'Não categorizado',
      formato: item.formato || 'Texto',
      objetivo: item.objetivo || 'Atrair Atenção'
    };
    
    // Adicionamos o usuário que criou
    const userData = await supabase.auth.getUser();
    const userId = userData.data.user?.id || null;
    
    // Combinamos os dados preparados com o usuário atual e campos obrigatórios
    const insertData = {
      ...dataToInsert,
      ...requiredFields,
      created_by: userId
    };
    
    const { data, error } = await supabase
      .from('content_strategy_items')
      .insert(insertData)
      .select(`
        *,
        equipamento:equipamentos(nome),
        responsavel:perfis!responsavel_id(nome)
      `)
      .single();

    if (error) throw error;

    toast({
      title: "Item adicionado",
      description: "Item de estratégia de conteúdo criado com sucesso."
    });

    // Transformação dos dados com nossa função auxiliar
    return data ? transformToContentStrategyItem(data) : null;
  } catch (error) {
    console.error("Error creating content strategy item:", error);
    toast({
      variant: "destructive",
      title: "Erro ao criar item",
      description: "Não foi possível criar o item de estratégia de conteúdo."
    });
    return null;
  }
}

/**
 * Atualiza um item de estratégia de conteúdo existente
 */
export async function updateContentStrategyItem(id: string, updates: Partial<ContentStrategyItem>): Promise<boolean> {
  try {
    // Remove campos derivados que não estão no banco de dados
    const { equipamento_nome, responsavel_nome, ...updateData } = updates as Record<string, any>;
    
    // Prepara os dados para atualização
    const dataToUpdate = prepareContentStrategyData(updateData);

    const { error } = await supabase
      .from('content_strategy_items')
      .update(dataToUpdate)
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "Item atualizado",
      description: "Item de estratégia de conteúdo atualizado com sucesso."
    });

    return true;
  } catch (error) {
    console.error("Error updating content strategy item:", error);
    toast({
      variant: "destructive",
      title: "Erro ao atualizar item",
      description: "Não foi possível atualizar o item de estratégia de conteúdo."
    });
    return false;
  }
}

/**
 * Remove um item de estratégia de conteúdo
 */
export async function deleteContentStrategyItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('content_strategy_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "Item removido",
      description: "Item de estratégia de conteúdo removido com sucesso."
    });

    return true;
  } catch (error) {
    console.error("Error deleting content strategy item:", error);
    toast({
      variant: "destructive",
      title: "Erro ao remover item",
      description: "Não foi possível remover o item de estratégia de conteúdo."
    });
    return false;
  }
}
