
import { supabase } from "@/integrations/supabase/client";
import { GptConfig } from "@/types/database";

/**
 * Serviço para gerenciar as integrações do sistema com APIs e serviços externos
 */

// GPT (OpenAI)
export const saveGptConfig = async (config: Omit<GptConfig, 'id' | 'data_configuracao'>) => {
  try {
    const { data, error } = await supabase
      .from('gpt_configs')
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
      .from('gpt_configs')
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
      .from('gpt_configs')
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
    // Primeiro, verificamos se já existe uma configuração (só permitimos uma)
    const { data: existing } = await supabase
      .from('integracoes')
      .select('*')
      .eq('tipo', 'dropbox')
      .limit(1);

    if (existing && existing.length > 0) {
      // Atualiza a configuração existente
      const { data, error } = await supabase
        .from('integracoes')
        .update({
          config: config,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', existing[0].id)
        .select();

      if (error) throw error;
      return data[0];
    } else {
      // Cria uma nova configuração
      const { data, error } = await supabase
        .from('integracoes')
        .insert([{
          tipo: 'dropbox',
          config: config,
          atualizado_em: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data[0];
    }
  } catch (error) {
    console.error("Erro ao salvar configuração Dropbox:", error);
    throw error;
  }
};

export const getDropboxConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('integracoes')
      .select('*')
      .eq('tipo', 'dropbox')
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0].config as DropboxConfig : null;
  } catch (error) {
    console.error("Erro ao buscar configuração Dropbox:", error);
    throw error;
  }
};
