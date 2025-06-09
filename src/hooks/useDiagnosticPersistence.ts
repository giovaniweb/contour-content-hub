
import { useState, useEffect } from 'react';
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';

export interface DiagnosticSession {
  id: string;
  timestamp: string;
  state: MarketingConsultantState;
  isCompleted: boolean;
  clinicTypeLabel: string;
  specialty: string;
}

const STORAGE_KEY = 'fluida_marketing_diagnostics';
const CURRENT_SESSION_KEY = 'fluida_current_diagnostic';

export const useDiagnosticPersistence = () => {
  const [savedDiagnostics, setSavedDiagnostics] = useState<DiagnosticSession[]>([]);
  const [currentSession, setCurrentSession] = useState<DiagnosticSession | null>(null);

  // Carregar dados salvos ao inicializar
  useEffect(() => {
    loadSavedDiagnostics();
    loadCurrentSession();
  }, []);

  const loadSavedDiagnostics = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const diagnostics = JSON.parse(saved);
        setSavedDiagnostics(diagnostics);
      }
    } catch (error) {
      console.error('Erro ao carregar diagnósticos salvos:', error);
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

  const saveCurrentSession = (state: MarketingConsultantState, isCompleted: boolean = false) => {
    try {
      const session: DiagnosticSession = {
        id: currentSession?.id || generateSessionId(),
        timestamp: new Date().toISOString(),
        state,
        isCompleted,
        clinicTypeLabel: state.clinicType === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética',
        specialty: state.clinicType === 'clinica_medica' ? state.medicalSpecialty : state.aestheticFocus
      };

      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
      setCurrentSession(session);

      // Se o diagnóstico está completo, salvar no histórico
      if (isCompleted) {
        saveToHistory(session);
      }

      console.log('✅ Sessão salva:', session);
      return session;
    } catch (error) {
      console.error('❌ Erro ao salvar sessão:', error);
      return null;
    }
  };

  const saveToHistory = (session: DiagnosticSession) => {
    try {
      const existing = [...savedDiagnostics];
      
      // Remover sessão anterior com mesmo ID se existir
      const filteredExisting = existing.filter(d => d.id !== session.id);
      
      // Adicionar nova sessão no início
      const updated = [session, ...filteredExisting];
      
      // Manter apenas os últimos 10 diagnósticos
      const limited = updated.slice(0, 10);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
      setSavedDiagnostics(limited);

      console.log('📚 Diagnóstico salvo no histórico');
    } catch (error) {
      console.error('❌ Erro ao salvar no histórico:', error);
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

  const deleteDiagnostic = (id: string) => {
    try {
      const filtered = savedDiagnostics.filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setSavedDiagnostics(filtered);
      
      // Se for a sessão atual, limpar também
      if (currentSession?.id === id) {
        clearCurrentSession();
      }
      
      console.log('🗑️ Diagnóstico deletado:', id);
    } catch (error) {
      console.error('❌ Erro ao deletar diagnóstico:', error);
    }
  };

  const loadDiagnostic = (id: string): DiagnosticSession | null => {
    const diagnostic = savedDiagnostics.find(d => d.id === id);
    if (diagnostic) {
      setCurrentSession(diagnostic);
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(diagnostic));
      return diagnostic;
    }
    return null;
  };

  const clearAllData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CURRENT_SESSION_KEY);
      setSavedDiagnostics([]);
      setCurrentSession(null);
      console.log('🗑️ Todos os dados limpos');
    } catch (error) {
      console.error('❌ Erro ao limpar dados:', error);
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
