
import { supabase } from "@/integrations/supabase/client";
import { GptConfig } from "@/types/database";

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

// Dropbox
export type DropboxConfig = {
  id?: string;
  token: string;
  pasta_padrao: string;
  link_base?: string;
  data_configuracao?: string;
};

export const saveDropboxConfig = async (config: Omit<DropboxConfig, 'id' | 'data_configuracao'>) => {
  try {
    // First, let's create a custom integration row for Dropbox
    // Since we don't have a specific table for Dropbox configs,
    // we'll create a custom structure in our database
    
    // Check if an integration already exists
    const { data: existing } = await supabase
      .from('materiais')  // Using 'materiais' as a temporary store
      .select('*')
      .eq('tipo', 'dropbox_config')
      .limit(1);

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

      if (error) throw error;
      return { ...config, id: data[0].id };
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

      if (error) throw error;
      return { ...config, id: data[0].id };
    }
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
