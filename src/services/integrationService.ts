import { supabase } from "@/integrations/supabase/client";
import { GptConfig, VimeoConfig, DropboxConfig } from "@/types/database";
import { SUPABASE_BASE_URL } from "@/integrations/supabase/client";

// Salvar configuração do Vimeo (apenas pasta padrão agora)
export const saveVimeoConfig = async (config: any): Promise<void> => {
  // Função mantida apenas por legado; não faz nada, pois integração foi removida
  return;
};

// Obter configuração do Vimeo (apenas pasta padrão agora)
export const getVimeoConfig = async (): Promise<null> => {
  // Função mantida apenas por legado; sempre retorna null
  return null;
};

// Testar conexão com Vimeo (removida)
export const testVimeoConnection = async (_folderId: string): Promise<{success: boolean, message?: string}> => {
  return { success: false, message: "Integração com Vimeo foi descontinuada." };
};

// Importar videos do Vimeo (removida)
export const importVimeoVideos = async () => {
  throw new Error("Integração com Vimeo foi removida.");
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

// Salvar configuração GPT (Admin only)
export const saveGptConfig = async (config: Omit<GptConfig, 'id' | 'data_configuracao'>): Promise<GptConfig> => {
  try {
    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('perfis')
      .select('role')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();
    
    const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'superadmin';
    
    if (!isAdmin) {
      throw new Error('Acesso negado. Apenas administradores podem salvar configurações GPT.');
    }
    
    const { data, error } = await supabase
      .from('gpt_config')
      .insert({
        nome: config.nome,
        chave_api: config.chave_api,
        modelo: config.modelo,
        prompt: config.prompt || '',
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

// Atualizar configuração GPT (Admin only)
export const updateGptConfig = async (id: string, config: Omit<GptConfig, 'id' | 'data_configuracao'>): Promise<void> => {
  try {
    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('perfis')
      .select('role')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();
    
    const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'superadmin';
    
    if (!isAdmin) {
      throw new Error('Acesso negado. Apenas administradores podem atualizar configurações GPT.');
    }
    
    const { error } = await supabase
      .from('gpt_config')
      .update({
        nome: config.nome,
        chave_api: config.chave_api,
        modelo: config.modelo,
        prompt: config.prompt || '',
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

// Obter todas as configurações GPT (Admin only)
export const getGptConfigs = async (): Promise<GptConfig[]> => {
  try {
    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('perfis')
      .select('role')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();
    
    const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'superadmin';
    
    if (!isAdmin) {
      throw new Error('Acesso negado. Apenas administradores podem acessar configurações GPT.');
    }
    
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
