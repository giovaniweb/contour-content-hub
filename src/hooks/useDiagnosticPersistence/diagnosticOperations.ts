import { useState, useCallback } from 'react';
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';
import { marketingDiagnosticsService } from '@/services/marketingDiagnostics';
import { DiagnosticSession } from './types';
import { 
  generateUniqueSessionId, 
  createSessionFromState, 
  clearSessionIdCache,
  checkForExistingSession,
  detectContentDuplication
} from './sessionUtils';
import { saveCurrentSessionToStorage, clearCurrentSessionFromStorage } from './sessionStorage';
import { useAuth } from '@/hooks/useAuth';

// Map para controle de debounce das operações
const debouncedOperations = new Map<string, NodeJS.Timeout>();

export const useDiagnosticOperations = () => {
  const [savedDiagnostics, setSavedDiagnostics] = useState<DiagnosticSession[]>([]);
  const [currentSession, setCurrentSession] = useState<DiagnosticSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const loadSavedDiagnostics = useCallback(async () => {
    if (isLoading) return; // Evitar múltiplas chamadas simultâneas
    
    try {
      setIsLoading(true);
      console.log('📚 Carregando diagnósticos salvos...');
      
      const diagnostics = await marketingDiagnosticsService.loadDiagnostics();
      
      // Aplicar filtro anti-duplicação adicional no frontend
      const uniqueDiagnostics = diagnostics.filter((diagnostic, index, self) => {
        // Primeiro filtro: por ID único
        const isUniqueById = index === self.findIndex(d => d.id === diagnostic.id);
        if (!isUniqueById) return false;
        
        // Segundo filtro: por contexto de conteúdo similar
        const hasSimilarContent = self.some((other, otherIndex) => {
          if (otherIndex >= index) return false; // Evitar comparar com si mesmo e duplicar trabalho
          
          return (
            other.state?.clinicType === diagnostic.state?.clinicType &&
            (other.state?.medicalSpecialty === diagnostic.state?.medicalSpecialty ||
             other.state?.aestheticFocus === diagnostic.state?.aestheticFocus) &&
            other.isCompleted === diagnostic.isCompleted &&
            Math.abs(new Date(other.timestamp).getTime() - new Date(diagnostic.timestamp).getTime()) < 10 * 60 * 1000 // 10 minutos
          );
        });
        
        return !hasSimilarContent;
      });
      
      setSavedDiagnostics(uniqueDiagnostics);
      console.log(`✅ ${uniqueDiagnostics.length} diagnósticos únicos carregados (filtro duplo aplicado)`);
      
      if (diagnostics.length !== uniqueDiagnostics.length) {
        console.warn(`⚠️ ${diagnostics.length - uniqueDiagnostics.length} duplicações detectadas e filtradas no frontend`);
      }
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
    if (!user?.id) {
      console.warn('⚠️ Usuário não autenticado, salvando apenas localmente');
      const sessionId = currentSession?.id || generateUniqueSessionId();
      const session = createSessionFromState(sessionId, state, isCompleted);
      saveCurrentSessionToStorage(session);
      setCurrentSession(session);
      return session;
    }

    const clinicType = state.clinicType || '';
    const specialty = state.clinicType === 'clinica_medica' 
      ? state.medicalSpecialty || '' 
      : state.aestheticFocus || '';

    // Verificar se já existe uma sessão similar nos dados salvos
    const existingSession = checkForExistingSession(savedDiagnostics, user.id, clinicType, specialty, isCompleted);
    
    let sessionId: string;
    
    if (existingSession && !isCompleted) {
      // Reutilizar session_id existente para rascunhos
      sessionId = existingSession.id;
      console.log('🔄 Reutilizando session_id existente para rascunho:', sessionId);
    } else if (currentSession?.id && !isCompleted) {
      // Manter session_id atual se for um rascunho
      sessionId = currentSession.id;
    } else {
      // Gerar novo session_id usando informações do contexto
      sessionId = generateUniqueSessionId(user.id, clinicType, specialty);
    }

    const operationKey = `save_${user.id}_${clinicType}_${specialty}_${isCompleted}`;

    // Cancelar operação anterior se existir
    if (debouncedOperations.has(operationKey)) {
      clearTimeout(debouncedOperations.get(operationKey)!);
      debouncedOperations.delete(operationKey);
    }

    // Debounce para evitar múltiplas chamadas rápidas
    const timeoutId = setTimeout(async () => {
      try {
        console.log('💾 Salvando sessão com proteção anti-duplicação:', { sessionId, isCompleted, operationKey });
        
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
            // Limpar cache para permitir novos diagnósticos
            clearSessionIdCache(user.id, clinicType, specialty);
          }

          // Manter cache local para melhor UX
          saveCurrentSessionToStorage(session);
          setCurrentSession(session);

          // Recarregar lista se foi completado (com debounce)
          if (isCompleted) {
            setTimeout(() => loadSavedDiagnostics(), 500);
          }

          console.log('✅ Sessão salva com sucesso (protegida contra duplicação):', session);
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
  }, [currentSession?.id, loadSavedDiagnostics, user?.id, savedDiagnostics]);

  const clearCurrentSession = useCallback(() => {
    try {
      clearCurrentSessionFromStorage();
      setCurrentSession(null);
      
      // Limpar também o cache de session_id
      if (user?.id && currentSession?.state) {
        const clinicType = currentSession.state.clinicType || '';
        const specialty = currentSession.state.clinicType === 'clinica_medica' 
          ? currentSession.state.medicalSpecialty || '' 
          : currentSession.state.aestheticFocus || '';
        clearSessionIdCache(user.id, clinicType, specialty);
      }
      
      console.log('🗑️ Sessão atual limpa (cache incluído)');
    } catch (error) {
      console.error('❌ Erro ao limpar sessão:', error);
    }
  }, [user?.id, currentSession?.state]);

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
          clearCurrentSession();
        }
        
        // Manter apenas diagnósticos completos/pagos
        const protectedDiagnostics = savedDiagnostics.filter(d => d.isPaidData || d.isCompleted);
        setSavedDiagnostics(protectedDiagnostics);
        
        // Limpar cache de session_ids para rascunhos
        if (user?.id) {
          clearSessionIdCache();
        }
        
        console.log(`✅ ${drafts.length} rascunhos removidos. ${protectedDiagnostics.length} diagnósticos pagos preservados.`);
      }
      
      return success;
    } catch (error) {
      console.error('❌ Erro ao limpar rascunhos:', error);
      return false;
    }
  }, [savedDiagnostics, currentSession?.isPaidData, currentSession?.isCompleted, clearCurrentSession, user?.id]);

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
