
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiagnosticOperations } from './diagnosticOperations';
import { loadCurrentSessionFromStorage } from './sessionStorage';

export type { DiagnosticSession } from './types';

export const useDiagnosticPersistence = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { user } = useAuth();
  
  const {
    savedDiagnostics,
    currentSession,
    setCurrentSession,
    isLoading,
    loadSavedDiagnostics,
    saveCurrentSession,
    clearCurrentSession,
    deleteDiagnostic,
    loadDiagnostic,
    clearAllData
  } = useDiagnosticOperations();

  // Carregar dados ao inicializar
  useEffect(() => {
    if (user) {
      const initializeData = async () => {
        try {
          // Carregar sessão atual do localStorage primeiro para UX rápida
          const session = loadCurrentSessionFromStorage();
          if (session) {
            setCurrentSession(session);
          }
          
          // Carregar dados do banco em paralelo
          await loadSavedDiagnostics();
        } catch (error) {
          console.error('❌ Erro ao inicializar dados:', error);
        } finally {
          setIsInitializing(false);
        }
      };

      initializeData();
    } else {
      setIsInitializing(false);
    }
  }, [user, loadSavedDiagnostics, setCurrentSession]);

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
    isLoading: isLoading || isInitializing,
    saveCurrentSession,
    loadCurrentSession: () => loadCurrentSessionFromStorage(),
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
