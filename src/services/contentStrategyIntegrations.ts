
import { supabase } from "@/integrations/supabase/client";
import { ContentStrategyItem } from "@/types/content-strategy";
import { toast } from "@/hooks/use-toast";

/**
 * Gera conteúdo para um item de estratégia usando IA
 */
export async function generateContentWithAI(item: Partial<ContentStrategyItem>): Promise<string | null> {
  try {
    // Preparamos os dados para envio à função Edge
    const requestData = {
      equipamento: item.equipamento_nome,
      categoria: item.categoria,
      formato: item.formato,
      objetivo: item.objetivo
    };

    // Chama a função Edge Function para gerar conteúdo
    const { data, error } = await supabase.functions.invoke('generate-content-description', {
      body: { item: requestData }
    });

    if (error) throw error;

    return data?.content || null;
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
 * Agenda um conteúdo no calendário
 */
export async function scheduleContentInCalendar(item: ContentStrategyItem): Promise<boolean> {
  try {
    // Verifica se temos uma data de previsão
    if (!item.previsao) {
      toast({
        variant: "destructive",
        title: "Erro ao agendar",
        description: "É necessário definir uma data de previsão para agendar o conteúdo."
      });
      return false;
    }

    // Cria um evento na agenda
    const { data, error } = await supabase
      .from('agenda')
      .insert({
        titulo: `Conteúdo: ${item.categoria} - ${item.formato}`,
        descricao: item.conteudo || 'Conteúdo a ser definido',
        data: item.previsao,
        tipo: 'conteudo',
        equipamento: item.equipamento_nome,
        objetivo: item.objetivo,
        formato: item.formato,
        status: 'pendente'
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Conteúdo agendado",
      description: "O conteúdo foi agendado com sucesso no calendário."
    });

    return true;
  } catch (error) {
    console.error("Error scheduling content in calendar:", error);
    toast({
      variant: "destructive",
      title: "Erro ao agendar",
      description: "Não foi possível agendar o conteúdo no calendário."
    });
    return false;
  }
}
