import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type PrivacyTerms = Database['public']['Tables']['privacy_terms']['Row'];

export const usePrivacyTerms = () => {
  const [terms, setTerms] = useState<PrivacyTerms | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('privacy_terms')
        .select('*')
        .eq('id', 'privacy_policy')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setTerms(data);
    } catch (err) {
      console.error('Erro ao carregar termos:', err);
      setError('Erro ao carregar os termos de privacidade');
    } finally {
      setLoading(false);
    }
  };

  const updateTerms = async (title: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('privacy_terms')
        .update({
          title,
          content,
          updated_by: user.id,
        })
        .eq('id', 'privacy_policy')
        .select()
        .single();

      if (error) throw error;
      
      setTerms(data);
      return { success: true };
    } catch (err) {
      console.error('Erro ao atualizar termos:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao atualizar termos' 
      };
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return {
    terms,
    loading,
    error,
    fetchTerms,
    updateTerms,
  };
};