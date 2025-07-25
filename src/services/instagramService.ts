import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface InstagramConfig {
  id?: string;
  user_id?: string;
  access_token: string;
  instagram_user_id: string;
  username: string;
  account_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InstagramAnalytics {
  id?: string;
  user_id?: string;
  instagram_user_id: string;
  followers_count: number;
  following_count?: number;
  media_count?: number;
  reach: number;
  impressions: number;
  engagement_rate: number;
  post_frequency: number;
  analysis_result?: string;
  data_snapshot?: any;
  created_at?: string;
}

export interface InstagramAnalysis {
  diagnostico: string;
  alertas: string[];
  recomendacoes: string[];
}

/**
 * Save Instagram configuration for the authenticated user
 */
export const saveInstagramConfig = async (config: Omit<InstagramConfig, 'id' | 'user_id'>): Promise<InstagramConfig | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    // Check if config already exists and update it, otherwise insert
    const { data: existingConfig } = await supabase
      .from('instagram_configs')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    let result;
    if (existingConfig) {
      const { data, error } = await supabase
        .from('instagram_configs')
        .update(config)
        .eq('user_id', user.user.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('instagram_configs')
        .insert({
          ...config,
          user_id: user.user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    toast.success("Configuração do Instagram salva com sucesso!");
    return result;
  } catch (error) {
    console.error('Error saving Instagram config:', error);
    toast.error("Erro ao salvar configuração do Instagram");
    return null;
  }
};

/**
 * Get Instagram configuration for the authenticated user
 */
export const getInstagramConfig = async (): Promise<InstagramConfig | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return null;
    }

    const { data, error } = await supabase
      .from('instagram_configs')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting Instagram config:', error);
    return null;
  }
};

/**
 * Delete Instagram configuration
 */
export const deleteInstagramConfig = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('instagram_configs')
      .delete()
      .eq('user_id', user.user.id);

    if (error) throw error;

    toast.success("Configuração do Instagram removida");
    return true;
  } catch (error) {
    console.error('Error deleting Instagram config:', error);
    toast.error("Erro ao remover configuração");
    return false;
  }
};

/**
 * Fetch fresh Instagram analytics data
 */
export const fetchInstagramAnalytics = async (): Promise<InstagramAnalytics | null> => {
  try {
    const config = await getInstagramConfig();
    if (!config) {
      throw new Error('Instagram não está configurado');
    }

    const { data, error } = await supabase.functions.invoke('instagram-analytics', {
      body: {
        action: 'fetch_analytics',
        instagram_config: config
      }
    });

    if (error) throw error;

    if (data.success) {
      toast.success("Dados do Instagram atualizados!");
      return data.analytics;
    } else {
      throw new Error(data.error || 'Erro desconhecido');
    }
  } catch (error) {
    console.error('Error fetching Instagram analytics:', error);
    toast.error("Erro ao buscar dados do Instagram: " + error.message);
    return null;
  }
};

/**
 * Get latest Instagram analytics from database
 */
export const getLatestInstagramAnalytics = async (): Promise<InstagramAnalytics | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return null;
    }

    const { data, error } = await supabase
      .from('instagram_analytics')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting latest Instagram analytics:', error);
    return null;
  }
};

/**
 * Analyze engagement with AI
 */
export const analyzeInstagramEngagement = async (): Promise<InstagramAnalysis | null> => {
  try {
    const config = await getInstagramConfig();
    if (!config) {
      throw new Error('Instagram não está configurado');
    }

    const { data, error } = await supabase.functions.invoke('instagram-analytics', {
      body: {
        action: 'analyze_engagement',
        instagram_config: config
      }
    });

    if (error) throw error;

    if (data.success) {
      toast.success("Análise de engajamento gerada!");
      return data.analysis;
    } else {
      throw new Error(data.error || 'Erro desconhecido');
    }
  } catch (error) {
    console.error('Error analyzing Instagram engagement:', error);
    toast.error("Erro ao analisar engajamento: " + error.message);
    return null;
  }
};

/**
 * Check if Instagram is connected for the current user
 */
export const isInstagramConnected = async (): Promise<boolean> => {
  const config = await getInstagramConfig();
  return config !== null;
};

/**
 * NOVO FLUXO: Buscar conta Instagram conectada do usuário
 */
export const getConnectedInstagramAccount = async (): Promise<{
  username: string,
  followers_count: number,
  engagement_rate: number,
  instagram_id: string,
  page_id: string,
  access_token: string,
} | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    // Busca registro real da tabela 'instagram_accounts'
    const { data, error } = await supabase
      .from('instagram_accounts')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    if (error || !data) return null;

    // Busca últimas métricas reais do Instagram
    const lastAnalytics = await getLatestInstagramAnalytics();
    return {
      username: data.username,
      instagram_id: data.instagram_id,
      page_id: data.page_id,
      access_token: data.access_token,
      followers_count: lastAnalytics?.followers_count || 0,
      engagement_rate: lastAnalytics?.engagement_rate || 0,
    };
  } catch (e) {
    return null;
  }
};

/**
 * Desconectar conta Instagram (revoga o token na Meta e remove no Supabase!)
 */
export const disconnectInstagramAccount = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    // Busca registro da conta
    const { data: instacc } = await supabase
      .from('instagram_accounts')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    if (!instacc) return true; // já está desconectado

    // Revoga o token via Meta/Facebook se possível
    if (instacc.access_token && instacc.page_id) {
      try {
        await fetch(`https://graph.facebook.com/v18.0/${instacc.page_id}/permissions?access_token=${instacc.access_token}`, {
          method: 'DELETE',
        });
      } catch {
        // Em caso de erro de revogação, siga assim mesmo!
      }
    }

    // Remove do Supabase
    await supabase
      .from('instagram_accounts')
      .delete()
      .eq('user_id', user.user.id);

    return true;
  } catch (error) {
    return false;
  }
};
