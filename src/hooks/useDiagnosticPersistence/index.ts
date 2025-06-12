
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiagnosticOperations } from './diagnosticOperations';
import { loadCurrentSessionFromStorage } from './sessionStorage';
import { debugDiagnosticPersistence, syncLocalStorageWithState } from './debugUtils';

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

  // Debug: Carregar dados ao inicializar
  useEffect(() => {
    if (user) {
      const initializeData = async () => {
        try {
          console.log('🚀 Inicializando useDiagnosticPersistence...');
          debugDiagnosticPersistence();
          
          // Carregar sessão atual do localStorage primeiro para UX rápida
          const session = loadCurrentSessionFromStorage();
          console.log('📱 Sessão carregada do localStorage:', session);
          if (session) {
            setCurrentSession(session);
          }
          
          // Carregar dados do banco em paralelo
          console.log('📊 Carregando diagnósticos salvos do banco...');
          await loadSavedDiagnostics();
          
          // Verificar sincronização após carregamento
          setTimeout(() => {
            const syncResult = syncLocalStorageWithState(savedDiagnostics, currentSession);
            if (syncResult) {
              console.log('🔄 Aplicando sincronização automática');
              setCurrentSession(syncResult);
            }
          }, 500);
          
        } catch (error) {
          console.error('❌ Erro ao inicializar dados:', error);
        } finally {
          setIsInitializing(false);
        }
      };

      initializeData();
    } else {
      console.log('👤 Usuário não autenticado');
      setIsInitializing(false);
    }
  }, [user, loadSavedDiagnostics, setCurrentSession]);

  // Debug: Log mudanças no estado
  useEffect(() => {
    console.log('📊 Estado atualizado - savedDiagnostics:', savedDiagnostics.length, 'itens');
    console.log('📱 Estado atualizado - currentSession:', currentSession ? 'existe' : 'null');
  }, [savedDiagnostics, currentSession]);

  const hasSavedData = (): boolean => {
    const result = currentSession !== null || savedDiagnostics.length > 0;
    console.log('🔍 hasSavedData:', result, { 
      currentSession: !!currentSession, 
      savedCount: savedDiagnostics.length 
    });
    return result;
  };

  const hasCurrentSession = (): boolean => {
    const result = currentSession !== null;
    console.log('🔍 hasCurrentSession:', result);
    return result;
  };

  const isSessionCompleted = (): boolean => {
    const result = currentSession?.isCompleted === true;
    console.log('🔍 isSessionCompleted:', result);
    return result;
  };

  const isPaidData = (): boolean => {
    const result = currentSession?.isPaidData === true || currentSession?.isCompleted === true;
    console.log('🔍 isPaidData:', result);
    return result;
  };

  return {
    savedDiagnostics,
    currentSession,
    isLoading: isLoading || isInitializing,
    saveCurrentSession,
    loadCurrentSession: () => {
      const session = loadCurrentSessionFromStorage();
      console.log('📱 loadCurrentSession chamado, retornando:', session);
      return session;
    },
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
