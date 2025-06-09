
import { useState, useCallback } from 'react';
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';
import { marketingDiagnosticsService } from '@/services/marketingDiagnostics';
import { DiagnosticSession } from './types';
import { generateUniqueSessionId, createSessionFromState } from './sessionUtils';
import { saveCurrentSessionToStorage, clearCurrentSessionFromStorage } from './sessionStorage';

// Map para controle de debounce das operações
const debouncedOperations = new Map<string, NodeJS.Timeout>();

export const useDiagnosticOperations = () => {
  const [savedDiagnostics, setSavedDiagnostics] = useState<DiagnosticSession[]>([]);
  const [currentSession, setCurrentSession] = useState<DiagnosticSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadSavedDiagnostics = useCallback(async () => {
    if (isLoading) return; // Evitar múltiplas chamadas simultâneas
    
    try {
      setIsLoading(true);
      console.log('📚 Carregando diagnósticos salvos...');
      
      const diagnostics = await marketingDiagnosticsService.loadDiagnostics();
      
      // Filtrar duplicações por session_id antes de definir no estado
      const uniqueDiagnostics = diagnostics.filter((diagnostic, index, self) => 
        index === self.findIndex(d => d.id === diagnostic.id)
      );
      
      setSavedDiagnostics(uniqueDiagnostics);
      console.log(`✅ ${uniqueDiagnostics.length} diagnósticos únicos carregados`);
    } catch (error) {
      console.error('❌ Erro ao carregar diagnósticos salvos:', error);
      // Fallback para localStorage se houver erro
      const saved = localStorage.getItem('fluida_marketing_diagnostics');
      if (saved) {
        try {
          const localDiagnostics = JSON.parse(saved);
          setSavedDiagnostics(localDiagnostics);
        } catch (e) {
          console.error('❌ Erro ao carregar do localStorage:', e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const saveCurrentSession = useCallback(async (
    state: MarketingConsultantState, 
    isCompleted: boolean = false
  ) => {
    const sessionId = currentSession?.id || generateUniqueSessionId();
    const operationKey = `save_${sessionId}`;

    // Cancelar operação anterior se existir
    if (debouncedOperations.has(operationKey)) {
      clearTimeout(debouncedOperations.get(operationKey)!);
      debouncedOperations.delete(operationKey);
    }

    // Debounce para evitar múltiplas chamadas rápidas
    const timeoutId = setTimeout(async () => {
      try {
        console.log('💾 Salvando sessão com debounce:', { sessionId, isCompleted });
        
        // Salvar no banco de dados
        const savedDiagnostic = await marketingDiagnosticsService.saveDiagnostic(
          sessionId,
          state,
          isCompleted
        );

        if (savedDiagnostic) {
          const session = createSessionFromState(sessionId, state, isCompleted, savedDiagnostic.created_at);

          // Marcar como dados pagos se for um diagnóstico completo
          if (isCompleted) {
            session.isPaidData = true;
          }

          // Manter cache local para melhor UX
          saveCurrentSessionToStorage(session);
          setCurrentSession(session);

          // Recarregar lista se foi completado (com debounce)
          if (isCompleted) {
            setTimeout(() => loadSavedDiagnostics(), 500);
          }

          console.log('✅ Sessão salva com sucesso (protegida):', session);
          return session;
        } else {
          // Fallback para localStorage se houver erro
          const session = createSessionFromState(sessionId, state, isCompleted);

          saveCurrentSessionToStorage(session);
          setCurrentSession(session);
          
          console.log('⚠️ Sessão salva localmente (fallback protegido):', session);
          return session;
        }
      } catch (error) {
        console.error('❌ Erro ao salvar sessão:', error);
        return null;
      } finally {
        debouncedOperations.delete(operationKey);
      }
    }, 300); // Debounce de 300ms

    debouncedOperations.set(operationKey, timeoutId);
  }, [currentSession?.id, loadSavedDiagnostics]);

  const clearCurrentSession = useCallback(() => {
    try {
      clearCurrentSessionFromStorage();
      setCurrentSession(null);
      console.log('🗑️ Sessão atual limpa');
    } catch (error) {
      console.error('❌ Erro ao limpar sessão:', error);
    }
  }, []);

  const deleteDiagnostic = useCallback(async (id: string) => {
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
        
        console.log('✅ Diagnóstico deletado:', id);
      }
      
      return success;
    } catch (error) {
      console.error('❌ Erro ao deletar diagnóstico:', error);
      return false;
    }
  }, [savedDiagnostics, currentSession?.id, currentSession?.isPaidData, clearCurrentSession]);

  const loadDiagnostic = useCallback(async (id: string): Promise<DiagnosticSession | null> => {
    try {
      // Primeiro tentar carregar do banco
      const diagnostic = await marketingDiagnosticsService.loadDiagnosticBySessionId(id);
      
      if (diagnostic) {
        // Marcar como dados pagos se for completo
        if (diagnostic.isCompleted) {
          diagnostic.isPaidData = true;
        }
        
        setCurrentSession(diagnostic);
        saveCurrentSessionToStorage(diagnostic);
        return diagnostic;
      }

      // Fallback para buscar na lista local
      const localDiagnostic = savedDiagnostics.find(d => d.id === id);
      if (localDiagnostic) {
        setCurrentSession(localDiagnostic);
        saveCurrentSessionToStorage(localDiagnostic);
        return localDiagnostic;
      }

      return null;
    } catch (error) {
      console.error('❌ Erro ao carregar diagnóstico:', error);
      return null;
    }
  }, [savedDiagnostics]);

  const clearAllData = useCallback(async () => {
    try {
      // Identificar rascunhos (diagnósticos incompletos)
      const drafts = savedDiagnostics.filter(d => !d.isPaidData && !d.isCompleted);
      
      if (drafts.length === 0) {
        console.log('📝 Nenhum rascunho encontrado para limpar');
        return true; // Sucesso, mas não havia nada para limpar
      }

      console.log(`🗑️ Limpando ${drafts.length} rascunhos...`);

      // Deletar apenas os rascunhos do banco de dados
      const success = await marketingDiagnosticsService.clearDraftsOnly();
      
      if (success) {
        // Limpar localStorage apenas se não for dados pagos
        if (!currentSession?.isPaidData && !currentSession?.isCompleted) {
          clearCurrentSessionFromStorage();
          setCurrentSession(null);
        }
        
        // Manter apenas diagnósticos completos/pagos
        const protectedDiagnostics = savedDiagnostics.filter(d => d.isPaidData || d.isCompleted);
        setSavedDiagnostics(protectedDiagnostics);
        
        console.log(`✅ ${drafts.length} rascunhos removidos. ${protectedDiagnostics.length} diagnósticos pagos preservados.`);
      }
      
      return success;
    } catch (error) {
      console.error('❌ Erro ao limpar rascunhos:', error);
      return false;
    }
  }, [savedDiagnostics, currentSession?.isPaidData, currentSession?.isCompleted]);

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
