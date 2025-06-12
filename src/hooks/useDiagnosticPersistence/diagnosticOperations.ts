
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DiagnosticSession } from './types';
import { saveCurrentSessionToStorage, clearCurrentSessionFromStorage } from './sessionStorage';
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';

export const useDiagnosticOperations = () => {
  const [savedDiagnostics, setSavedDiagnostics] = useState<DiagnosticSession[]>([]);
  const [currentSession, setCurrentSession] = useState<DiagnosticSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Carregar diagnósticos do banco de dados - AGORA COM FILTRO POR USER_ID
  const loadSavedDiagnostics = useCallback(async () => {
    if (!user?.id) {
      console.log('❌ Usuário não autenticado para carregar diagnósticos');
      return;
    }

    try {
      setIsLoading(true);
      console.log('📊 Carregando diagnósticos do banco para user_id:', user.id);
      
      const { data, error } = await supabase
        .from('marketing_diagnostics')
        .select('*')
        .eq('user_id', user.id) // FILTRO CRÍTICO ADICIONADO
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao carregar diagnósticos:', error);
        return;
      }

      console.log('✅ Diagnósticos carregados do banco:', data?.length || 0);
      
      if (data && data.length > 0) {
        // Converter dados do banco para DiagnosticSession com tipos corretos
        const sessions: DiagnosticSession[] = data.map(item => ({
          id: item.session_id,
          timestamp: item.created_at,
          state: (item.state_data as MarketingConsultantState) || {},
          isCompleted: item.is_completed || false,
          clinicTypeLabel: item.clinic_type || 'Clínica',
          specialty: item.specialty || 'Geral',
          isPaidData: item.is_completed || false
        }));

        setSavedDiagnostics(sessions);
        console.log('✅ Sessions convertidas:', sessions.length);
      } else {
        setSavedDiagnostics([]);
        console.log('📊 Nenhum diagnóstico encontrado no banco para este usuário');
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao carregar diagnósticos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Salvar sessão atual - ajustado para receber parâmetros corretos
  const saveCurrentSession = useCallback(async (state: MarketingConsultantState, isCompleted: boolean = false) => {
    if (!user?.id) {
      console.log('❌ Usuário não autenticado para salvar sessão');
      return false;
    }

    try {
      console.log('💾 Salvando sessão no banco para user_id:', user.id);
      
      // Gerar ID determinístico baseado no estado
      const generateSessionId = () => {
        const content = `${state.clinicType || 'unknown'}_${state.clinicName || 'clinic'}_${Date.now()}`;
        return `diagnostic_${Buffer.from(content).toString('base64').substring(0, 16)}`;
      };

      const sessionId = generateSessionId();
      
      const { error } = await supabase
        .from('marketing_diagnostics')
        .upsert({
          session_id: sessionId,
          user_id: user.id, // GARANTIR QUE USA O USER_ID CORRETO
          state_data: state as any, // Cast para any para resolver problema de tipo Json
          is_completed: isCompleted,
          clinic_type: state.clinicType === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética',
          specialty: state.medicalSpecialty || state.aestheticFocus || 'Geral',
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('❌ Erro ao salvar no banco:', error);
        return false;
      }

      // Criar sessão para salvar no localStorage
      const session: DiagnosticSession = {
        id: sessionId,
        timestamp: new Date().toISOString(),
        state,
        isCompleted,
        clinicTypeLabel: state.clinicType === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética',
        specialty: state.medicalSpecialty || state.aestheticFocus || 'Geral',
        isPaidData: isCompleted
      };

      // Salvar também no localStorage para acesso rápido
      saveCurrentSessionToStorage(session);
      setCurrentSession(session);
      
      // Recarregar lista de diagnósticos
      await loadSavedDiagnostics();
      
      console.log('✅ Sessão salva com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro inesperado ao salvar sessão:', error);
      return false;
    }
  }, [user?.id, loadSavedDiagnostics]);

  // Deletar diagnóstico
  const deleteDiagnostic = useCallback(async (sessionId: string) => {
    if (!user?.id) {
      console.log('❌ Usuário não autenticado para deletar');
      return false;
    }

    try {
      const { error } = await supabase
        .from('marketing_diagnostics')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', user.id); // FILTRO DE SEGURANÇA

      if (error) {
        console.error('❌ Erro ao deletar:', error);
        return false;
      }

      // Atualizar estado local
      setSavedDiagnostics(prev => prev.filter(d => d.id !== sessionId));
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        clearCurrentSessionFromStorage();
      }

      console.log('🗑️ Diagnóstico deletado:', sessionId);
      return true;
    } catch (error) {
      console.error('❌ Erro inesperado ao deletar:', error);
      return false;
    }
  }, [user?.id, currentSession?.id]);

  // Carregar diagnóstico específico
  const loadDiagnostic = useCallback(async (sessionId: string) => {
    if (!user?.id) {
      console.log('❌ Usuário não autenticado para carregar diagnóstico');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('marketing_diagnostics')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id) // FILTRO DE SEGURANÇA
        .single();

      if (error) {
        console.error('❌ Erro ao carregar diagnóstico:', error);
        return null;
      }

      const session: DiagnosticSession = {
        id: data.session_id,
        timestamp: data.created_at,
        state: (data.state_data as MarketingConsultantState) || {},
        isCompleted: data.is_completed || false,
        clinicTypeLabel: data.clinic_type || 'Clínica',
        specialty: data.specialty || 'Geral',
        isPaidData: data.is_completed || false
      };

      setCurrentSession(session);
      saveCurrentSessionToStorage(session);
      
      console.log('📂 Diagnóstico carregado:', sessionId);
      return session;
    } catch (error) {
      console.error('❌ Erro inesperado ao carregar diagnóstico:', error);
      return null;
    }
  }, [user?.id]);

  // Limpar sessão atual
  const clearCurrentSession = useCallback(() => {
    setCurrentSession(null);
    clearCurrentSessionFromStorage();
    console.log('🧹 Sessão atual limpa');
  }, []);

  // Limpar todos os dados (apenas rascunhos)
  const clearAllData = useCallback(async () => {
    if (!user?.id) {
      console.log('❌ Usuário não autenticado para limpar dados');
      return false;
    }

    try {
      // Deletar apenas rascunhos (não diagnósticos completos)
      const { error } = await supabase
        .from('marketing_diagnostics')
        .delete()
        .eq('user_id', user.id) // FILTRO CRÍTICO
        .eq('is_completed', false);

      if (error) {
        console.error('❌ Erro ao limpar dados:', error);
        return false;
      }

      // Atualizar estado local
      setSavedDiagnostics(prev => prev.filter(d => d.isPaidData || d.isCompleted));
      
      // Limpar sessão atual se for rascunho
      if (currentSession && !currentSession.isPaidData && !currentSession.isCompleted) {
        setCurrentSession(null);
        clearCurrentSessionFromStorage();
      }

      console.log('🧹 Dados limpos com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro inesperado ao limpar dados:', error);
      return false;
    }
  }, [user?.id, currentSession]);

  return {
    savedDiagnostics,
    setSavedDiagnostics,
    currentSession,
    setCurrentSession,
    isLoading,
    loadSavedDiagnostics,
    saveCurrentSession,
    clearCurrentSession,
    deleteDiagnostic,
    loadDiagnostic,
    clearAllData
  };
};
