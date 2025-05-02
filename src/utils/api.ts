import { supabase } from '@/integrations/supabase/client';

export type ScriptType = 'videoScript' | 'bigIdea' | 'dailySales';

export interface ScriptResponse {
  id: string;
  title: string;
  content: string;
  type: ScriptType;
  equipment?: string;
  createdAt: string;
  updatedAt?: string;
  marketingObjective?: string;
  suggestedVideos?: {
    title: string;
    thumbnailUrl?: string;
    duration: string;
  }[];
  captionTips?: string[];
  pdf_url?: string;
}

export const generateScript = async (
  tipo: ScriptType,
  equipamento: string,
  quantidade?: number,
  tom?: string,
  estrategiaConteudo?: string,
  topico?: string,
  areaCorpo?: string,
  finalidades?: string[],
  informacoesAdicionais?: string,
  objetivoMarketing?: string
): Promise<ScriptResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-script', {
      body: {
        tipo,
        equipamento,
        quantidade,
        tom,
        estrategiaConteudo,
        topico,
        areaCorpo,
        finalidades,
        informacoesAdicionais,
        objetivoMarketing
      }
    });

    if (error) {
      console.error('Erro ao gerar script:', error);
      throw error;
    }

    return data as ScriptResponse;
  } catch (error) {
    console.error('Erro ao chamar a função generate-script:', error);
    throw error;
  }
};

// Gerar PDF do roteiro
export const generatePDF = async (scriptId: string): Promise<string> => {
  try {
    // Obter dados do roteiro para enviar para a função de geração do PDF
    const scriptData = await getScriptById(scriptId);
    
    if (!scriptData) {
      throw new Error('Roteiro não encontrado');
    }
    
    console.log(`Enviando solicitação para gerar PDF do roteiro ${scriptId}`);
    
    // Chamar edge function para gerar o PDF
    const { data, error } = await supabase.functions.invoke('generate-pdf', {
      body: {
        scriptId,
        content: scriptData.content,
        title: scriptData.title,
        type: scriptData.type
      }
    });
    
    if (error) {
      console.error('Erro na chamada da função generate-pdf:', error);
      throw error;
    }
    
    if (!data || !data.pdfUrl) {
      throw new Error('URL do PDF não retornada');
    }
    
    console.log('PDF gerado com sucesso:', data.pdfUrl);
    
    // Aqui normalmente atualizaríamos o banco de dados com a URL do PDF
    // Por simplicidade, vamos apenas retornar a URL
    return data.pdfUrl;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};

export const submitFeedback = async (scriptId: string, feedback: string, approved: boolean): Promise<void> => {
  try {
    console.log(`Submitting feedback for script ${scriptId}: ${feedback} - Approved: ${approved}`);
    // Aqui você pode adicionar a lógica para enviar o feedback para o seu backend
    // ou armazená-lo em um banco de dados.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula uma chamada de API
    console.log('Feedback enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    throw error;
  }
};

export const rejectScript = async (scriptId: string): Promise<void> => {
  try {
    console.log(`Rejecting script with ID: ${scriptId}`);
    // Aqui você pode adicionar a lógica para rejeitar o script e solicitar uma nova geração
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula uma chamada de API
    console.log('Script rejeitado com sucesso!');
  } catch (error) {
    console.error('Erro ao rejeitar script:', error);
    throw error;
  }
};

export const getScriptById = async (scriptId: string): Promise<ScriptResponse> => {
  // Aqui normalmente buscaríamos o roteiro do banco de dados
  // Por simplicidade, vamos retornar um objeto simulado
  return {
    id: scriptId,
    title: "Roteiro de exemplo",
    content: "Conteúdo do roteiro...",
    type: "videoScript",
    createdAt: new Date().toISOString(),
    marketingObjective: "atrair_atencao",
    equipment: "Unyque PRO"
  };
};

// Vincular roteiro ao evento da agenda
export const linkScriptToCalendar = async (scriptId: string, eventId: string): Promise<boolean> => {
  try {
    console.log(`Vinculando roteiro ${scriptId} ao evento ${eventId}`);
    // Aqui simularemos uma atualização bem-sucedida
    // Em um caso real, faríamos uma chamada à API para atualizar o banco de dados
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulando uma chamada de rede
    
    return true;
  } catch (error) {
    console.error('Erro ao vincular roteiro à agenda:', error);
    return false;
  }
};
