import { supabase } from "@/integrations/supabase/client";
import { SUPABASE_BASE_URL } from "@/integrations/supabase/client";

export interface VimeoToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  account_name?: string;
  account_uri?: string;
  scope?: string;
}

/**
 * Inicia o fluxo OAuth do Vimeo
 */
export const startVimeoOAuth = async (userId?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('vimeo-oauth-start', {
      body: userId ? { user_id: userId } : {}
    });
    
    if (error) {
      throw new Error(error.message || 'Erro ao iniciar fluxo OAuth');
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao iniciar OAuth Vimeo:', error);
    throw error;
  }
};

/**
 * Processa o callback do OAuth do Vimeo
 */
export const processVimeoOAuthCallback = async (code: string, state?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('vimeo-oauth-callback', {
      body: { code, state }
    });
    
    if (error) {
      throw new Error(error.message || 'Erro ao processar callback OAuth');
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao processar callback OAuth Vimeo:', error);
    throw error;
  }
};

/**
 * Obtém o token Vimeo do usuário atual
 */
export const getUserVimeoToken = async (): Promise<VimeoToken | null> => {
  try {
    const { data, error } = await supabase
      .from('user_vimeo_tokens')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw error;
    }
    
    return data as VimeoToken;
  } catch (error) {
    console.error('Erro ao buscar token Vimeo:', error);
    return null;
  }
};

/**
 * Exclui o token Vimeo do usuário
 */
export const deleteVimeoToken = async (tokenId: string) => {
  try {
    const { error } = await supabase
      .from('user_vimeo_tokens')
      .delete()
      .eq('id', tokenId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir token Vimeo:', error);
    throw error;
  }
};

/**
 * Verifica se o token está expirado
 */
export const isTokenExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt) < new Date();
};
