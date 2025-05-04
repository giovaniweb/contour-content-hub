
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

    // Aplicação dos filtros
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
    if (filters.prioridade) {
      query = query.eq('prioridade', filters.prioridade);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.distribuicao) {
      query = query.eq('distribuicao', filters.distribuicao);
    }
    if (filters.dateRange?.from && filters.dateRange?.to) {
      query = query
        .gte('previsao', filters.dateRange.from.toISOString())
        .lte('previsao', filters.dateRange.to.toISOString());
    }

    // Ordenação
    query = query.order('prioridade', { ascending: false }).order('previsao', { ascending: true });

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
    const dataToInsert = {
      ...prepareContentStrategyData(item),
      created_by: (await supabase.auth.getUser()).data.user?.id || null
    };
    
    const { data, error } = await supabase
      .from('content_strategy_items')
      .insert(dataToInsert)
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
    return transformToContentStrategyItem(data);
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
    const { equipamento_nome, responsavel_nome, ...updateData } = updates;

    // Processa equipamento_id - converte string vazia para null
    if (updateData.equipamento_id === '_none' || updateData.equipamento_id === '') {
      updateData.equipamento_id = null;
    }
    
    // Processa responsavel_id - converte string vazia para null
    if (updateData.responsavel_id === '_none' || updateData.responsavel_id === '') {
      updateData.responsavel_id = null;
    }

    const { error } = await supabase
      .from('content_strategy_items')
      .update(updateData)
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
