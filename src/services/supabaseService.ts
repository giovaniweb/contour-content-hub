
import { supabase } from '@/integrations/supabase/client';

export interface ScriptRequest {
  type: string;
  topic?: string;
  equipment?: string;
  bodyArea?: string;
  purpose?: string;
  additionalInfo?: string;
  tone?: string;
  language?: string;
  marketingObjective?: string;
  systemPrompt?: string;
  userPrompt?: string;
  // Novos campos para SmartScriptGenerator
  contentType?: string;
  objective?: string;
  channel?: string;
  style?: string;
  mentor?: string;
}

export interface ScriptResponse {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  suggestedVideos: any[];
  captionTips: string[];
  equipment?: string;
  objective?: string;
  marketingObjective?: string;
  type?: string;
}

export const generateScript = async (request: ScriptRequest): Promise<ScriptResponse> => {
  console.log('generateScript chamado com request:', request);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-script', {
      body: { request }
    });

    if (error) {
      console.error('Erro na edge function:', error);
      throw new Error(`Erro na API: ${error.message}`);
    }

    if (!data) {
      console.error('Resposta vazia da edge function');
      throw new Error('Resposta vazia da API');
    }

    console.log('Resposta da edge function recebida:', data);
    
    return {
      id: data.id || `script-${Date.now()}`,
      title: data.title || 'Roteiro Gerado',
      content: data.content || '',
      createdAt: data.createdAt || new Date().toISOString(),
      suggestedVideos: data.suggestedVideos || [],
      captionTips: data.captionTips || [],
      equipment: request.equipment,
      objective: request.marketingObjective,
      marketingObjective: request.marketingObjective,
      type: request.type
    };
  } catch (error) {
    console.error('Erro em generateScript:', error);
    
    // Melhor tratamento de erros
    if (error.message?.includes('rate_limit_exceeded')) {
      throw new Error('Limite de requisições OpenAI atingido. Tente novamente em alguns instantes.');
    }
    
    if (error.message?.includes('insufficient_quota')) {
      throw new Error('Cota OpenAI insuficiente. Verifique sua conta OpenAI.');
    }
    
    if (error.message?.includes('invalid_api_key')) {
      throw new Error('Chave OpenAI inválida. Verifique a configuração.');
    }
    
    throw error;
  }
};

// Função para testar a conexão com OpenAI
export const testOpenAIConnection = async (): Promise<boolean> => {
  try {
    const testRequest: ScriptRequest = {
      type: 'test',
      topic: 'Teste de conexão',
      tone: 'profissional'
    };
    
    await generateScript(testRequest);
    return true;
  } catch (error) {
    console.error('Teste de conexão OpenAI falhou:', error);
    return false;
  }
};

// Função para validar equipamentos do usuário
export const getUserEquipments = async () => {
  try {
    const { data, error } = await supabase
      .from('equipamentos')
      .select('*')
      .eq('ativo', true);

    if (error) {
      console.error('Erro ao buscar equipamentos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
    return [];
  }
};
