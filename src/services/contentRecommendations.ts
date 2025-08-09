
import { supabase } from '@/integrations/supabase/client';

export interface ContentRecommendationsResponse {
  success: boolean;
  format: string;
  equipmentName?: string | null;
  recommendations?: {
    videos: string[];
    photoPrompts: string[];
  };
  error?: string;
}

export const getContentRecommendations = async (format: 'reels' | 'long' | 'artigo' | 'carrossel', equipmentName?: string) => {
  console.log('📺 [contentRecommendations] Solicitando recomendações:', { format, equipmentName });
  const { data, error } = await supabase.functions.invoke<ContentRecommendationsResponse>('recommend-content', {
    body: { format, equipmentName }
  });

  if (error) {
    console.error('❌ [contentRecommendations] Erro na edge function:', error);
    return { success: false, error: error.message } as ContentRecommendationsResponse;
  }

  return data as ContentRecommendationsResponse;
};
