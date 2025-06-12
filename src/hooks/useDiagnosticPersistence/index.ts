
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiagnosticOperations } from './diagnosticOperations';
import { loadCurrentSessionFromStorage } from './sessionStorage';
import { debugDiagnosticPersistence, syncLocalStorageWithState } from './debugUtils';
import { DiagnosticSession } from './types';

export type { DiagnosticSession } from './types';

// Função para validar se os dados são reais/válidos
const isValidDiagnosticSession = (session: DiagnosticSession): boolean => {
  // Verificar se a data não é muito antiga (anterior a 2024)
  const sessionDate = new Date(session.timestamp);
  const minimumValidDate = new Date('2024-01-01');
  
  if (sessionDate < minimumValidDate) {
    console.log('🚫 Sessão rejeitada - data muito antiga:', session.timestamp);
    return false;
  }
  
  // Verificar se tem dados básicos válidos
  if (!session.state || !session.state.clinicType) {
    console.log('🚫 Sessão rejeitada - dados incompletos');
    return false;
  }
  
  // Verificar se não é um ID determinístico falso baseado em conteúdo fixo
  if (session.id.includes('unknown') || session.id.includes('clinic_1_1_geral')) {
    console.log('🚫 Sessão rejeitada - ID determinístico falso:', session.id);
    return false;
  }
  
  return true;
};

// Função para gerar ID único real baseado em timestamp
const generateRealSessionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `diagnostic_${timestamp}_${random}`;
};

export const useDiagnosticPersistence = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { user } = useAuth();
  
  const {
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
  } = useDiagnosticOperations();

  // Filtrar apenas diagnósticos válidos
  const validSavedDiagnostics = savedDiagnostics.filter(isValidDiagnosticSession);

  // Debug: Carregar dados ao inicializar
  useEffect(() => {
    if (user) {
      const initializeData = async () => {
        try {
          console.log('🚀 Inicializando useDiagnosticPersistence...');
          debugDiagnosticPersistence();
          
          // 1. Carregar sessão atual do localStorage para UX rápida
          const session = loadCurrentSessionFromStorage();
          console.log('📱 Sessão carregada do localStorage:', session);
          if (session && isValidDiagnosticSession(session)) {
            setCurrentSession(session);
          } else if (session) {
            console.log('🚫 Sessão atual inválida, removendo do localStorage');
            localStorage.removeItem('fluida_current_diagnostic');
          }
          
          // 2. Carregar dados do banco
          console.log('📊 Carregando diagnósticos salvos do banco...');
          await loadSavedDiagnostics();
          
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

  // Função para forçar exclusão (incluindo dados completos)
  const forceDeleteDiagnostic = async (sessionId: string): Promise<boolean> => {
    console.log('🗑️ Forçando exclusão de diagnóstico:', sessionId);
    
    try {
      // Deletar do banco
      const success = await deleteDiagnostic(sessionId);
      
      if (success) {
        // Remover também do estado local
        setSavedDiagnostics(prev => prev.filter(d => d.id !== sessionId));
        
        if (currentSession?.id === sessionId) {
          setCurrentSession(null);
          localStorage.removeItem('fluida_current_diagnostic');
        }
        
        console.log('✅ Diagnóstico forçado a ser deletado:', sessionId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Erro ao forçar exclusão:', error);
      return false;
    }
  };

  // Função para limpar dados legados/falsos
  const clearLegacyData = async (): Promise<boolean> => {
    console.log('🧹 Limpando dados legados/falsos...');
    
    try {
      // Filtrar dados inválidos
      const invalidSessions = savedDiagnostics.filter(session => !isValidDiagnosticSession(session));
      
      console.log(`🗑️ Encontrados ${invalidSessions.length} diagnósticos inválidos para remoção`);
      
      // Deletar cada sessão inválida
      for (const session of invalidSessions) {
        await forceDeleteDiagnostic(session.id);
      }
      
      // Limpar também dados do localStorage
      const legacyKeys = ['marketing_diagnostic_data'];
      legacyKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`🧹 Removido do localStorage: ${key}`);
        }
      });
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar dados legados:', error);
      return false;
    }
  };

  const hasSavedData = (): boolean => {
    const result = currentSession !== null || validSavedDiagnostics.length > 0;
    console.log('🔍 hasSavedData:', result, { 
      currentSession: !!currentSession, 
      savedCount: validSavedDiagnostics.length 
    });
    return result;
  };

  const hasCurrentSession = (): boolean => {
    const result = currentSession !== null && isValidDiagnosticSession(currentSession);
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

  // Função melhorada para buscar sessão por ID
  const findSessionById = (sessionId: string): DiagnosticSession | null => {
    console.log('🔍 Buscando sessão por ID:', sessionId);
    
    // 1. Buscar na sessão atual
    if (currentSession?.id === sessionId && isValidDiagnosticSession(currentSession)) {
      console.log('✅ Sessão encontrada na currentSession');
      return currentSession;
    }
    
    // 2. Buscar nos diagnósticos salvos válidos
    const foundInSaved = validSavedDiagnostics.find(d => d.id === sessionId);
    if (foundInSaved) {
      console.log('✅ Sessão encontrada nos savedDiagnostics');
      return foundInSaved;
    }
    
    console.log('❌ Sessão não encontrada ou inválida:', sessionId);
    return null;
  };

  return {
    savedDiagnostics: validSavedDiagnostics, // Retornar apenas diagnósticos válidos
    currentSession: currentSession && isValidDiagnosticSession(currentSession) ? currentSession : null,
    isLoading: isLoading || isInitializing,
    saveCurrentSession,
    loadCurrentSession: () => {
      const session = loadCurrentSessionFromStorage();
      console.log('📱 loadCurrentSession chamado, retornando:', session);
      return session && isValidDiagnosticSession(session) ? session : null;
    },
    clearCurrentSession,
    deleteDiagnostic,
    forceDeleteDiagnostic, // Nova função para forçar exclusão
    loadDiagnostic,
    clearAllData,
    clearLegacyData, // Nova função para limpar dados legados
    hasSavedData,
    hasCurrentSession,
    isSessionCompleted,
    isPaidData,
    loadSavedDiagnostics,
    findSessionById
  };
};
