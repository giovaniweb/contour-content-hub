import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface MestreDaBelezaSession {
  id: string;
  session_id: string;
  profile_data: any;
  current_step: string;
  current_question_index: number;
  responses: any;
  diagnostic_result?: any;
  recommendations?: any;
  score_data?: any;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function useMestreDaBelezaSession() {
  const { user } = useAuth();
  const [session, setSession] = useState<MestreDaBelezaSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gerar ID de sessão único
  const generateSessionId = useCallback(() => {
    return `mdb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Carregar sessão existente ou criar nova
  const initializeSession = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      // Buscar sessão ativa mais recente
      const { data: existingSession, error: fetchError } = await supabase
        .from('mestre_da_beleza_sessions')
        .select('*')
        .eq('user_id', user.id)
        .is('completed_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingSession) {
        setSession(existingSession);
      } else {
        // Criar nova sessão
        await createNewSession();
      }
    } catch (err: any) {
      console.error('❌ Erro ao inicializar sessão:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Criar nova sessão
  const createNewSession = useCallback(async () => {
    if (!user?.id) return;

    const sessionData = {
      user_id: user.id,
      session_id: generateSessionId(),
      profile_data: {},
      current_step: 'profile',
      current_question_index: 0,
      responses: {}
    };

    const { data, error } = await supabase
      .from('mestre_da_beleza_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (error) throw error;

    setSession(data);
    return data;
  }, [user?.id, generateSessionId]);

  // Atualizar sessão
  const updateSession = useCallback(async (updates: Partial<MestreDaBelezaSession>) => {
    if (!session?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('mestre_da_beleza_sessions')
        .update(updates)
        .eq('id', session.id)
        .select()
        .single();

      if (error) throw error;

      setSession(data);
      return data;
    } catch (err: any) {
      console.error('❌ Erro ao atualizar sessão:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session?.id]);

  // Salvar resposta
  const saveResponse = useCallback(async (questionId: string, answer: any) => {
    if (!session) return;

    const updatedResponses = {
      ...session.responses,
      [questionId]: answer
    };

    await updateSession({
      responses: updatedResponses,
      current_question_index: session.current_question_index + 1
    });
  }, [session, updateSession]);

  // Avançar para próximo passo
  const nextStep = useCallback(async (step: string, additionalData?: any) => {
    if (!session) return;

    await updateSession({
      current_step: step,
      ...additionalData
    });
  }, [session, updateSession]);

  // Finalizar diagnóstico
  const completeSession = useCallback(async (result: any, recommendations: any[]) => {
    if (!session) return;

    await updateSession({
      diagnostic_result: result,
      recommendations,
      completed_at: new Date().toISOString(),
      current_step: 'completed'
    });
  }, [session, updateSession]);

  // Reset completo
  const resetSession = useCallback(async () => {
    setSession(null);
    await createNewSession();
  }, [createNewSession]);

  // Inicializar quando o usuário estiver disponível
  useEffect(() => {
    if (user?.id) {
      initializeSession();
    }
  }, [user?.id, initializeSession]);

  return {
    session,
    loading,
    error,
    createNewSession,
    updateSession,
    saveResponse,
    nextStep,
    completeSession,
    resetSession,
    initializeSession
  };
}