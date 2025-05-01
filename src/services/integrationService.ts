import { supabase } from "@/integrations/supabase/client";
import { GptConfig } from "@/types/database";
import { DropboxConfig } from "@/types/database";

/**
 * Serviço para gerenciar as integrações do sistema com APIs e serviços externos
 */

// GPT (OpenAI)
export const saveGptConfig = async (config: Omit<GptConfig, 'id' | 'data_configuracao'>) => {
  try {
    const { data, error } = await supabase
      .from('gpt_config')
      .insert([{
        ...config,
        data_configuracao: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Erro ao salvar configuração GPT:", error);
    throw error;
  }
};

export const updateGptConfig = async (id: string, config: Partial<GptConfig>) => {
  try {
    const { data, error } = await supabase
      .from('gpt_config')
      .update({
        ...config,
        data_configuracao: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Erro ao atualizar configuração GPT:", error);
    throw error;
  }
};

export const getGptConfigs = async () => {
  try {
    const { data, error } = await supabase
      .from('gpt_config')
      .select('*')
      .order('data_configuracao', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar configurações GPT:", error);
    throw error;
  }
};

// Testa a conexão com a API da OpenAI para verificar se a chave é válida
export const testGptConnection = async (apiKey: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    // Simplificada, chamada ao endpoint de modelos da OpenAI
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      return { success: true, message: 'Conexão com OpenAI estabelecida com sucesso' };
    } else {
      return { 
        success: false, 
        error: data.error?.message || 'Erro ao conectar com API da OpenAI' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido na conexão com OpenAI' 
    };
  }
};

// Dropbox
export const saveDropboxConfig = async (config: Omit<DropboxConfig, 'id' | 'data_configuracao'>) => {
  try {
    // Verificar se o usuário tem permissões de admin antes de tentar salvar
    const { data: profile, error: profileError } = await supabase
      .from('perfis')
      .select('role')
      .single();
      
    if (profileError) {
      throw new Error(`Erro ao verificar permissões: ${profileError.message}`);
    }
    
    if (profile.role !== 'admin') {
      throw new Error('Apenas administradores podem modificar configurações de integração');
    }
    
    // Check if an integration already exists
    const { data: existing, error: existingError } = await supabase
      .from('materiais')  // Using 'materiais' as a temporary store
      .select('*')
      .eq('tipo', 'dropbox_config')
      .limit(1);

    if (existingError) {
      throw new Error(`Erro ao verificar configuração existente: ${existingError.message}`);
    }

    let result;
    
    if (existing && existing.length > 0) {
      // Update existing config
      const { data, error } = await supabase
        .from('materiais')
        .update({
          nome: 'Dropbox Config',
          tipo: 'dropbox_config',
          arquivo_url: JSON.stringify(config),
          data_upload: new Date().toISOString()
        })
        .eq('id', existing[0].id)
        .select();

      if (error) {
        throw new Error(`Erro ao atualizar configuração: ${error.message} ${error.code ? `(Código: ${error.code})` : ''}`);
      }
      result = { ...config, id: data[0].id };
    } else {
      // Create new config
      const { data, error } = await supabase
        .from('materiais')
        .insert([{
          nome: 'Dropbox Config',
          tipo: 'dropbox_config',
          arquivo_url: JSON.stringify(config),
          data_upload: new Date().toISOString()
        }])
        .select();

      if (error) {
        throw new Error(`Erro ao salvar configuração: ${error.message} ${error.code ? `(Código: ${error.code})` : ''}`);
      }
      result = { ...config, id: data[0].id };
    }

    return result;
  } catch (error) {
    console.error("Erro ao salvar configuração Dropbox:", error);
    throw error;
  }
};

export const getDropboxConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('materiais')
      .select('*')
      .eq('tipo', 'dropbox_config')
      .limit(1);

    if (error) throw error;
    
    if (data && data.length > 0) {
      try {
        const config = JSON.parse(data[0].arquivo_url || '{}') as DropboxConfig;
        return { ...config, id: data[0].id };
      } catch (e) {
        console.error("Erro ao processar config do Dropbox:", e);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar configuração Dropbox:", error);
    throw error;
  }
};

// Testa a conexão com a API do Dropbox para verificar se o token é válido
export const testDropboxConnection = async (token: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    console.log("Testando conexão com Dropbox, token:", token.substring(0, 5) + '...');
    
    // Verificar se o token está vazio
    if (!token || token.trim() === '') {
      return { 
        success: false, 
        error: 'Token de acesso não fornecido' 
      };
    }
    
    // Chamada ao endpoint de usuário do Dropbox para verificar a autenticação
    // A correção principal está no formato do body e nos headers
    const response = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      // A API do Dropbox espera a string "null" e não um objeto JSON com valor null
      body: null
    });

    // Capturar o corpo da resposta para análise, independente do status
    const responseBody = await response.text();
    console.log("Resposta do Dropbox:", response.status, responseBody);
    
    // Tentar analisar a resposta como JSON
    let responseData;
    try {
      responseData = JSON.parse(responseBody);
    } catch (e) {
      console.log("Erro ao parsear resposta:", e);
      responseData = null;
    }

    if (response.status === 200) {
      const userName = responseData?.name?.display_name || 'usuário';
      return { 
        success: true, 
        message: `Conexão com Dropbox estabelecida como ${userName}` 
      };
    } else {
      // Identificar erros específicos do Dropbox API
      const errorMessage = responseData?.error_summary || responseData?.error?.message || 'Erro desconhecido';
      
      // Diagnóstico mais detalhado para erros comuns
      let detailedError = '';
      if (response.status === 401) {
        detailedError = 'Token de acesso inválido ou expirado. Gere um novo token no Console do Dropbox.';
      } else if (response.status === 400) {
        detailedError = 'Requisição inválida. Verifique o formato do token.';
      } else if (response.status === 429) {
        detailedError = 'Limite de requisições excedido. Tente novamente mais tarde.';
      } else {
        detailedError = `Erro na API do Dropbox (Código: ${response.status}): ${errorMessage}`;
      }
      
      return { 
        success: false, 
        error: detailedError
      };
    }
  } catch (error) {
    console.error("Erro ao testar conexão com Dropbox:", error);
    return { 
      success: false, 
      error: error instanceof Error ? 
             `Erro de conexão: ${error.message}` : 
             'Erro desconhecido ao tentar conectar com o Dropbox'
    };
  }
};
