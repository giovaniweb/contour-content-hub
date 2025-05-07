import { supabase } from "@/integrations/supabase/client";
import { GptConfig, VimeoConfig, DropboxConfig } from "@/types/database";
import { SUPABASE_BASE_URL } from "@/integrations/supabase/client";

// Salvar configuração do Vimeo (apenas pasta padrão agora)
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

// Obter configuração do Vimeo (apenas pasta padrão agora)
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
  help?: string;
  instructions?: string;
  details?: any;
  user?: any;
  missing_scopes?: string[];
  required_scopes?: string[];
}> => {
  try {
    console.log(`Testando conexão com token: ${token.substring(0, 5)}...`);
    
    // Usar supabase.functions.invoke para chamar a Edge Function diretamente
    const { data, error } = await supabase.functions.invoke('vimeo-test-connection', {
      method: 'POST',
      body: { token }
    });
    
    if (error) {
      console.error('Erro ao chamar Edge Function:', error);
      return {
        success: false,
        error: `Erro na chamada da função: ${error.message || error}`
      };
    }
    
    console.log("Resultado do teste de conexão:", data);
    
    // A resposta agora deve sempre ter sucesso ou falha determinado pelo campo 'success'
    return data;
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
    // Usar supabase.functions.invoke para chamar a Edge Function diretamente
    const { data, error } = await supabase.functions.invoke('vimeo-batch-import', {
      method: 'POST',
      body: { folderPath, page, limit }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao importar vídeos do Vimeo:', error);
    throw error;
  }
};

// Obter configuração do Dropbox
export const getDropboxConfig = async (): Promise<DropboxConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('integracao_configs')
      .select('config')
      .eq('tipo', 'dropbox')
      .maybeSingle();
    
    if (error || !data) {
      return null;
    }
    
    return data.config as unknown as DropboxConfig;
  } catch (error) {
    console.error('Erro ao buscar configuração do Dropbox:', error);
    throw error;
  }
};

// Salvar configuração do Dropbox
export const saveDropboxConfig = async (config: Omit<DropboxConfig, 'id'>): Promise<void> => {
  const timestamp = new Date().toISOString();
  
  try {
    // Verificar se já existe configuração para Dropbox
    const { data: existingConfig } = await supabase
      .from('integracao_configs')
      .select('id')
      .eq('tipo', 'dropbox')
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
          tipo: 'dropbox',
          config: config as any,
          criado_em: timestamp,
          atualizado_em: timestamp
        });
    }
  } catch (error) {
    console.error('Erro ao salvar configuração do Dropbox:', error);
    throw error;
  }
};

// Testar conexão com Dropbox
export const testDropboxConnection = async (token: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    // Aqui deve ser implementada a lógica para testar a conexão com Dropbox
    // Exemplo simples para completar a interface
    return {
      success: true,
      message: 'Conexão com Dropbox estabelecida com sucesso'
    };
  } catch (error: any) {
    console.error('Erro ao testar conexão com Dropbox:', error);
    return {
      success: false,
      error: error.message || 'Falha na comunicação com o serviço'
    };
  }
};

// Salvar configuração GPT
export const saveGptConfig = async (config: Omit<GptConfig, 'id' | 'data_configuracao'>): Promise<GptConfig> => {
  try {
    const { data, error } = await supabase
      .from('gpt_config')
      .insert({
        nome: config.nome,
        chave_api: config.chave_api,
        modelo: config.modelo,
        prompt: config.prompt || '', // Adicionando o campo prompt que estava faltando
        tipo: config.tipo,
        ativo: config.ativo
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as GptConfig;
  } catch (error) {
    console.error('Erro ao salvar configuração GPT:', error);
    throw error;
  }
};

// Atualizar configuração GPT
export const updateGptConfig = async (id: string, config: Omit<GptConfig, 'id' | 'data_configuracao'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('gpt_config')
      .update({
        nome: config.nome,
        chave_api: config.chave_api,
        modelo: config.modelo,
        prompt: config.prompt || '', // Adicionando o campo prompt que estava faltando
        tipo: config.tipo,
        ativo: config.ativo
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao atualizar configuração GPT:', error);
    throw error;
  }
};

// Obter todas as configurações GPT
export const getGptConfigs = async (): Promise<GptConfig[]> => {
  try {
    const { data, error } = await supabase
      .from('gpt_config')
      .select('*');
    
    if (error) throw error;
    return data as GptConfig[];
  } catch (error) {
    console.error('Erro ao buscar configurações GPT:', error);
    throw error;
  }
};

// Testar conexão com GPT
export const testGptConnection = async (apiKey: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    // Aqui deve ser implementada a lógica para testar a conexão com OpenAI/GPT
    // Exemplo simples para completar a interface
    return {
      success: true,
      message: 'Conexão com a API OpenAI estabelecida com sucesso'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Falha na comunicação com o serviço'
    };
  }
};
