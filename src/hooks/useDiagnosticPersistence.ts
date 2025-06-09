import { useState, useEffect } from 'react';
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';
import { marketingDiagnosticsService, DiagnosticSession } from '@/services/marketingDiagnosticsService';
import { useAuth } from '@/hooks/useAuth';

const CURRENT_SESSION_KEY = 'fluida_current_diagnostic';

export type { DiagnosticSession };

export const useDiagnosticPersistence = () => {
  const [savedDiagnostics, setSavedDiagnostics] = useState<DiagnosticSession[]>([]);
  const [currentSession, setCurrentSession] = useState<DiagnosticSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Carregar dados ao inicializar
  useEffect(() => {
    if (user) {
      loadSavedDiagnostics();
      loadCurrentSession();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadSavedDiagnostics = async () => {
    try {
      const diagnostics = await marketingDiagnosticsService.loadDiagnostics();
      setSavedDiagnostics(diagnostics);
    } catch (error) {
      console.error('Erro ao carregar diagnósticos salvos:', error);
      // Fallback para localStorage se houver erro
      const saved = localStorage.getItem('fluida_marketing_diagnostics');
      if (saved) {
        try {
          const localDiagnostics = JSON.parse(saved);
          setSavedDiagnostics(localDiagnostics);
        } catch (e) {
          console.error('Erro ao carregar do localStorage:', e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentSession = (): DiagnosticSession | null => {
    try {
      const current = localStorage.getItem(CURRENT_SESSION_KEY);
      if (current) {
        const session = JSON.parse(current);
        setCurrentSession(session);
        return session;
      }
    } catch (error) {
      console.error('Erro ao carregar sessão atual:', error);
    }
    return null;
  };

  const saveCurrentSession = async (state: MarketingConsultantState, isCompleted: boolean = false) => {
    try {
      const sessionId = currentSession?.id || generateSessionId();
      
      // Salvar no banco de dados
      const savedDiagnostic = await marketingDiagnosticsService.saveDiagnostic(
        sessionId,
        state,
        isCompleted
      );

      if (savedDiagnostic) {
        const session: DiagnosticSession = {
          id: sessionId,
          timestamp: savedDiagnostic.created_at,
          state,
          isCompleted,
          clinicTypeLabel: state.clinicType === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética',
          specialty: state.clinicType === 'clinica_medica' ? state.medicalSpecialty : state.aestheticFocus
        };

        // Manter cache local para melhor UX
        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
        setCurrentSession(session);

        // Recarregar lista se foi completado
        if (isCompleted) {
          await loadSavedDiagnostics();
        }

        console.log('✅ Sessão salva no banco:', session);
        return session;
      } else {
        // Fallback para localStorage se houver erro
        const session: DiagnosticSession = {
          id: sessionId,
          timestamp: new Date().toISOString(),
          state,
          isCompleted,
          clinicTypeLabel: state.clinicType === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética',
          specialty: state.clinicType === 'clinica_medica' ? state.medicalSpecialty : state.aestheticFocus
        };

        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
        setCurrentSession(session);
        
        console.log('⚠️ Sessão salva localmente (fallback):', session);
        return session;
      }
    } catch (error) {
      console.error('❌ Erro ao salvar sessão:', error);
      return null;
    }
  };

  const clearCurrentSession = () => {
    try {
      localStorage.removeItem(CURRENT_SESSION_KEY);
      setCurrentSession(null);
      console.log('🗑️ Sessão atual limpa');
    } catch (error) {
      console.error('❌ Erro ao limpar sessão:', error);
    }
  };

  const deleteDiagnostic = async (id: string) => {
    try {
      const success = await marketingDiagnosticsService.deleteDiagnostic(id);
      
      if (success) {
        // Atualizar estado local
        const filtered = savedDiagnostics.filter(d => d.id !== id);
        setSavedDiagnostics(filtered);
        
        // Se for a sessão atual, limpar também
        if (currentSession?.id === id) {
          clearCurrentSession();
        }
        
        console.log('🗑️ Diagnóstico deletado:', id);
      }
      
      return success;
    } catch (error) {
      console.error('❌ Erro ao deletar diagnóstico:', error);
      return false;
    }
  };

  const loadDiagnostic = async (id: string): Promise<DiagnosticSession | null> => {
    try {
      // Primeiro tentar carregar do banco
      const diagnostic = await marketingDiagnosticsService.loadDiagnosticBySessionId(id);
      
      if (diagnostic) {
        setCurrentSession(diagnostic);
        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(diagnostic));
        return diagnostic;
      }

      // Fallback para buscar na lista local
      const localDiagnostic = savedDiagnostics.find(d => d.id === id);
      if (localDiagnostic) {
        setCurrentSession(localDiagnostic);
        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(localDiagnostic));
        return localDiagnostic;
      }

      return null;
    } catch (error) {
      console.error('❌ Erro ao carregar diagnóstico:', error);
      return null;
    }
  };

  const clearAllData = async () => {
    try {
      const success = await marketingDiagnosticsService.clearAllDiagnostics();
      
      if (success) {
        // Limpar estado local também
        localStorage.removeItem('fluida_marketing_diagnostics');
        localStorage.removeItem(CURRENT_SESSION_KEY);
        setSavedDiagnostics([]);
        setCurrentSession(null);
        console.log('🗑️ Todos os dados limpos');
      }
      
      return success;
    } catch (error) {
      console.error('❌ Erro ao limpar dados:', error);
      return false;
    }
  };

  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const hasSavedData = (): boolean => {
    return currentSession !== null || savedDiagnostics.length > 0;
  };

  const hasCurrentSession = (): boolean => {
    return currentSession !== null;
  };

  const isSessionCompleted = (): boolean => {
    return currentSession?.isCompleted === true;
  };

  return {
    savedDiagnostics,
    currentSession,
    isLoading,
    saveCurrentSession,
    loadCurrentSession,
    clearCurrentSession,
    deleteDiagnostic,
    loadDiagnostic,
    clearAllData,
    hasSavedData,
    hasCurrentSession,
    isSessionCompleted,
    loadSavedDiagnostics
  };
};
