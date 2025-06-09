
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
      const sessionId = currentSession?.id || generateUniqueSessionId();
      
      // Verificar se já existe para evitar duplicação
      const existingDiagnostic = await marketingDiagnosticsService.loadDiagnosticBySessionId(sessionId);
      
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

        // Marcar como dados pagos se for um diagnóstico completo
        if (isCompleted) {
          session.isPaidData = true;
        }

        // Manter cache local para melhor UX
        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
        setCurrentSession(session);

        // Recarregar lista se foi completado
        if (isCompleted) {
          await loadSavedDiagnostics();
        }

        console.log('✅ Sessão salva no banco (protegida):', session);
        return session;
      } else {
        // Fallback para localStorage se houver erro
        const session: DiagnosticSession = {
          id: sessionId,
          timestamp: new Date().toISOString(),
          state,
          isCompleted,
          clinicTypeLabel: state.clinicType === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética',
          specialty: state.clinicType === 'clinica_medica' ? state.medicalSpecialty : state.aestheticFocus,
          isPaidData: isCompleted // Marcar como dados pagos se completo
        };

        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
        setCurrentSession(session);
        
        console.log('⚠️ Sessão salva localmente (fallback protegido):', session);
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
      // Verificar se é um diagnóstico pago antes de deletar
      const diagnosticToDelete = savedDiagnostics.find(d => d.id === id);
      
      if (diagnosticToDelete?.isPaidData || diagnosticToDelete?.isCompleted) {
        console.warn('⚠️ Tentativa de deletar dados pagos/completos bloqueada:', id);
        return false; // Bloquear deletar dados pagos
      }

      const success = await marketingDiagnosticsService.deleteDiagnostic(id);
      
      if (success) {
        // Atualizar estado local
        const filtered = savedDiagnostics.filter(d => d.id !== id);
        setSavedDiagnostics(filtered);
        
        // Se for a sessão atual, limpar também (apenas se não for dados pagos)
        if (currentSession?.id === id && !currentSession?.isPaidData) {
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
        // Marcar como dados pagos se for completo
        if (diagnostic.isCompleted) {
          diagnostic.isPaidData = true;
        }
        
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
      // PROTEÇÃO: Não limpar dados pagos/completos
      const paidDiagnostics = savedDiagnostics.filter(d => d.isPaidData || d.isCompleted);
      
      if (paidDiagnostics.length > 0) {
        console.warn('🛡️ Dados pagos detectados - limpeza bloqueada para proteção');
        return false;
      }

      const success = await marketingDiagnosticsService.clearAllDiagnostics();
      
      if (success) {
        // Limpar apenas dados não pagos
        localStorage.removeItem('fluida_marketing_diagnostics');
        if (!currentSession?.isPaidData) {
          localStorage.removeItem(CURRENT_SESSION_KEY);
          setCurrentSession(null);
        }
        
        // Manter apenas diagnósticos pagos
        const protectedDiagnostics = savedDiagnostics.filter(d => d.isPaidData || d.isCompleted);
        setSavedDiagnostics(protectedDiagnostics);
        
        console.log('🗑️ Dados não pagos limpos (dados pagos protegidos)');
      }
      
      return success;
    } catch (error) {
      console.error('❌ Erro ao limpar dados:', error);
      return false;
    }
  };

  const generateUniqueSessionId = (): string => {
    // Usar crypto.randomUUID se disponível para maior unicidade
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `session_${crypto.randomUUID()}`;
    }
    
    // Fallback com timestamp mais preciso e mais entropia
    const timestamp = Date.now();
    const random1 = Math.random().toString(36).substr(2, 12);
    const random2 = Math.random().toString(36).substr(2, 8);
    return `session_${timestamp}_${random1}_${random2}`;
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

  const isPaidData = (): boolean => {
    return currentSession?.isPaidData === true || currentSession?.isCompleted === true;
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
    isPaidData,
    loadSavedDiagnostics
  };
};
