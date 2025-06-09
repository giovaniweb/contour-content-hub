
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiagnosticOperations } from './diagnosticOperations';
import { loadCurrentSessionFromStorage } from './sessionStorage';

export type { DiagnosticSession } from './types';

export const useDiagnosticPersistence = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const {
    savedDiagnostics,
    currentSession,
    setCurrentSession,
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
      loadSavedDiagnostics();
      const session = loadCurrentSessionFromStorage();
      if (session) {
        setCurrentSession(session);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [user]);

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
