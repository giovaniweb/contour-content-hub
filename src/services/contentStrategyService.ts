
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
    if (filters.linha) {
      query = query.ilike('linha', `%${filters.linha}%`);
    }
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
    if (filters.dateRange?.from && filters.dateRange?.to) {
      query = query
        .gte('previsao', filters.dateRange.from.toISOString())
        .lte('previsao', filters.dateRange.to.toISOString());
    }

    // Order by priority and previsao
    query = query.order('prioridade', { ascending: false }).order('previsao', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    // Transform data to match our interface
    return (data || []).map(item => ({
      ...item,
      // Ensure our type conversion matches ContentStrategyItem
      categoria: item.categoria as ContentStrategyItem['categoria'],
      formato: item.formato as ContentStrategyItem['formato'],
      objetivo: item.objetivo as ContentStrategyItem['objetivo'],
      prioridade: item.prioridade as ContentStrategyItem['prioridade'],
      status: item.status as ContentStrategyItem['status'],
      equipamento_nome: item.equipamento?.nome || null,
      responsavel_nome: item.responsavel?.nome || null
    }));
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
        linha: item.linha || null,
        equipamento_id: equipamento_id,
        categoria: item.categoria,
        formato: item.formato,
        responsavel_id: responsavel_id,
        previsao: item.previsao || null,
        conteudo: item.conteudo || null,
        objetivo: item.objetivo,
        prioridade: item.prioridade || 'Média',
        status: item.status || 'Planejado',
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

    return {
      ...data,
      // Ensure our type conversion matches ContentStrategyItem
      categoria: data.categoria as ContentStrategyItem['categoria'],
      formato: data.formato as ContentStrategyItem['formato'],
      objetivo: data.objetivo as ContentStrategyItem['objetivo'],
      prioridade: data.prioridade as ContentStrategyItem['prioridade'],
      status: data.status as ContentStrategyItem['status'],
      equipamento_nome: data.equipamento?.nome || null,
      responsavel_nome: data.responsavel?.nome || null
    };
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
