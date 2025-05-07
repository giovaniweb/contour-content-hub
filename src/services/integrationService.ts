
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface VimeoConfig {
  access_token: string;
  folder_id?: string;
}

export interface IntegrationConfig {
  id?: string;
  tipo: string;
  config: any;
  criado_em?: string;
  atualizado_em?: string;
}

export interface GptConfig {
  id: string;
  nome: string;
  chave_api: string;
  modelo: string;
  prompt: string;
  tipo: string;
  ativo: boolean;
  data_configuracao: string;
}

// Salvar configuração do Vimeo
export const saveVimeoConfig = async (config: VimeoConfig): Promise<void> => {
  const timestamp = new Date().toISOString();
  
  try {
    // Verificar se já existe configuração para Vimeo
    const { data: existingConfig } = await supabase
      .from('integracao_configs')
      .select('id')
      .eq('tipo', 'vimeo')
      .maybeSingle();
    
    if (existingConfig) {
      // Se já existe, atualizar
      await supabase
        .from('integracao_configs')
        .update({
          config: config as any,
          atualizado_em: timestamp
        })
        .eq('id', existingConfig.id);
    } else {
      // Se não existe, criar
      await supabase
        .from('integracao_configs')
        .insert({
          tipo: 'vimeo',
          config: config as any,
          criado_em: timestamp,
          atualizado_em: timestamp
        });
    }
  } catch (error) {
    console.error('Erro ao salvar configuração do Vimeo:', error);
    throw error;
  }
};

// Obter configuração do Vimeo
export const getVimeoConfig = async (): Promise<VimeoConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('integracao_configs')
      .select('config')
      .eq('tipo', 'vimeo')
      .maybeSingle();
    
    if (error || !data) {
      return null;
    }
    
    return data.config as unknown as VimeoConfig;
  } catch (error) {
    console.error('Erro ao buscar configuração do Vimeo:', error);
    throw error;
  }
};

// Testar conexão com Vimeo
export const testVimeoConnection = async (token: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    const response = await fetch(`${window.location.origin}/functions/v1/vimeo-test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao testar conexão com Vimeo:', error);
    return {
      success: false,
      error: error.message || 'Falha na comunicação com o serviço'
    };
  }
};

// Importar videos do Vimeo
export const importVimeoVideos = async (folderPath?: string, page = 1, limit = 20) => {
  try {
    const response = await fetch(`${window.location.origin}/functions/v1/vimeo-batch-import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folderPath, page, limit })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao importar vídeos do Vimeo:', error);
    throw error;
  }
};
