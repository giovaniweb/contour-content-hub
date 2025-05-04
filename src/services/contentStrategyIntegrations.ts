
import { supabase } from "@/integrations/supabase/client";
import { ContentStrategyItem } from "@/types/content-strategy";
import { toast } from "@/hooks/use-toast";

/**
 * Gera conteúdo usando IA com base nos dados do item
 */
export async function generateContentWithAI(item: Partial<ContentStrategyItem>): Promise<string | null> {
  try {
    // Chama a edge function para gerar conteúdo com IA
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

/**
 * Agenda conteúdo no calendário
 */
export async function scheduleContentInCalendar(item: ContentStrategyItem): Promise<boolean> {
  try {
    // Adiciona entrada à tabela de agenda
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
