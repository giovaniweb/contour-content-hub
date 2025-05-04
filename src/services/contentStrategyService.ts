
import { supabase } from "@/integrations/supabase/client";
import { ContentStrategyItem, ContentStrategyFilter } from "@/types/content-strategy";
import { toast } from "@/hooks/use-toast";

export async function fetchContentStrategyItems(filters: ContentStrategyFilter = {}): Promise<ContentStrategyItem[]> {
  try {
    let query = supabase
      .from('content_strategy_items')
      .select(`
        *,
        equipamento:equipamentos(nome),
        responsavel:perfis!responsavel_id(nome)
      `);

    // Apply filters
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
    // Add filter for distribution
    if (filters.distribuicao) {
      query = query.eq('distribuicao', filters.distribuicao);
    }
    if (filters.dateRange?.from && filters.dateRange?.to) {
      query = query
        .gte('previsao', filters.dateRange.from.toISOString())
        .lte('previsao', filters.dateRange.to.toISOString());
    }

    // Order by priority and previsao
    query = query.order('prioridade', { ascending: false }).order('previsao', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    // Transform data to match our interface with type assertions
    return (data || []).map(item => {
      // Create the base object
      const strategyItem: ContentStrategyItem = {
        id: item.id,
        linha: item.linha,
        equipamento_id: item.equipamento_id,
        equipamento_nome: item.equipamento?.nome || null,
        categoria: item.categoria,
        formato: item.formato,
        responsavel_id: item.responsavel_id,
        responsavel_nome: item.responsavel?.nome || null,
        previsao: item.previsao,
        conteudo: item.conteudo,
        objetivo: item.objetivo,
        prioridade: item.prioridade,
        status: item.status,
        distribuicao: 'Instagram', // Default value
        impedimento: item.impedimento,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by
      };

      // If the distribuicao field exists in the response, use it
      if ('distribuicao' in item && item.distribuicao) {
        strategyItem.distribuicao = item.distribuicao;
      }

      return strategyItem;
    });
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

export async function createContentStrategyItem(item: Partial<ContentStrategyItem>): Promise<ContentStrategyItem | null> {
  try {
    // Process equipamento_id - convert empty string to null
    const equipamento_id = item.equipamento_id === '_none' || !item.equipamento_id ? null : item.equipamento_id;
    
    // Process responsavel_id - convert empty string to null
    const responsavel_id = item.responsavel_id === '_none' || !item.responsavel_id ? null : item.responsavel_id;
    
    const { data, error } = await supabase
      .from('content_strategy_items')
      .insert({
        equipamento_id: equipamento_id,
        categoria: item.categoria,
        formato: item.formato,
        responsavel_id: responsavel_id,
        previsao: item.previsao || null,
        conteudo: item.conteudo || null,
        objetivo: item.objetivo,
        prioridade: item.prioridade || 'Média',
        status: item.status || 'Planejado',
        distribuicao: item.distribuicao || 'Instagram',
        impedimento: item.impedimento || null,
        created_by: (await supabase.auth.getUser()).data.user?.id || null
      })
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

    // Create the response object with proper types
    const strategyItem: ContentStrategyItem = {
      id: data.id,
      linha: data.linha,
      equipamento_id: data.equipamento_id,
      equipamento_nome: data.equipamento?.nome || null,
      categoria: data.categoria,
      formato: data.formato,
      responsavel_id: data.responsavel_id,
      responsavel_nome: data.responsavel?.nome || null,
      previsao: data.previsao,
      conteudo: data.conteudo,
      objetivo: data.objetivo,
      prioridade: data.prioridade,
      status: data.status,
      distribuicao: 'Instagram', // Default value
      impedimento: data.impedimento,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by
    };

    // If the distribuicao field exists in the response, use it
    if ('distribuicao' in data && data.distribuicao) {
      strategyItem.distribuicao = data.distribuicao;
    }

    return strategyItem;
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

export async function updateContentStrategyItem(id: string, updates: Partial<ContentStrategyItem>): Promise<boolean> {
  try {
    // Remove derived fields that are not in the database
    const { equipamento_nome, responsavel_nome, ...updateData } = updates;

    // Process equipamento_id - convert empty string to null
    if (updateData.equipamento_id === '_none' || updateData.equipamento_id === '') {
      updateData.equipamento_id = null;
    }
    
    // Process responsavel_id - convert empty string to null
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

export async function generateContentWithAI(item: Partial<ContentStrategyItem>): Promise<string | null> {
  try {
    // Call the edge function to generate content with AI
    const { data, error } = await supabase.functions.invoke('generate-content-description', {
      body: JSON.stringify({
        linha: item.linha,
        equipamento: item.equipamento_nome,
        categoria: item.categoria,
        formato: item.formato,
        objetivo: item.objetivo,
        impedimento: item.impedimento,
        prioridade: item.prioridade
      })
    });

    if (error) throw error;

    return data.content || null;
  } catch (error) {
    console.error("Error generating content with AI:", error);
    toast({
      variant: "destructive",
      title: "Erro ao gerar conteúdo",
      description: "Não foi possível gerar conteúdo com IA."
    });
    return null;
  }
}

export async function scheduleContentInCalendar(item: ContentStrategyItem): Promise<boolean> {
  try {
    // Add entry to agenda table
    const { error } = await supabase
      .from('agenda')
      .insert({
        titulo: `Content: ${item.linha || item.categoria}`,
        data: item.previsao,
        tipo: "content_strategy",
        usuario_id: (await supabase.auth.getUser()).data.user?.id,
        descricao: item.conteudo,
        equipamento: item.equipamento_nome,
        objetivo: item.objetivo,
        formato: item.formato.toLowerCase(),
        status: "pendente"
      });

    if (error) throw error;

    toast({
      title: "Conteúdo agendado",
      description: "Conteúdo adicionado à agenda com sucesso."
    });

    return true;
  } catch (error) {
    console.error("Error scheduling content in calendar:", error);
    toast({
      variant: "destructive",
      title: "Erro ao agendar conteúdo",
      description: "Não foi possível adicionar o conteúdo à agenda."
    });
    return false;
  }
}
