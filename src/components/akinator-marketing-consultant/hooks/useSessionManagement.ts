
import { useState, useEffect } from 'react';
import { MarketingConsultantState } from '../types';
import { useDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

interface UseSessionManagementProps {
  forceNew: boolean;
  state: MarketingConsultantState;
  setState: React.Dispatch<React.SetStateAction<MarketingConsultantState>>;
  setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export const useSessionManagement = ({
  forceNew,
  state,
  setState,
  setShowDashboard,
  setCurrentStep
}: UseSessionManagementProps) => {
  const [hasLoadedSavedData, setHasLoadedSavedData] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const { profile } = useUserProfile();
  const { 
    currentSession, 
    saveCurrentSession, 
    clearCurrentSession, 
    loadCurrentSession,
    hasCurrentSession,
    isLoading: isDiagnosticLoading
  } = useDiagnosticPersistence();

  // Load saved data on initialization
  useEffect(() => {
    if (!hasLoadedSavedData && !isDiagnosticLoading) {
      if (forceNew) {
        console.log('🔄 Forçando novo diagnóstico - limpando dados salvos');
        clearCurrentSession();
        setHasLoadedSavedData(true);
        
        toast.success("🆕 Novo diagnóstico iniciado!", {
          description: "Vamos começar do zero"
        });
      } else {
        const saved = loadCurrentSession();
        if (saved && saved.isCompleted) {
          console.log('📂 Carregando diagnóstico salvo completo');
          setState(saved.state);
          setShowDashboard(true);
          
          toast.success("📂 Diagnóstico anterior carregado!", {
            description: `Diagnóstico de ${new Date(saved.timestamp).toLocaleString('pt-BR')}`
          });
        } else if (saved && !saved.isCompleted) {
          console.log('📂 Carregando sessão em progresso');
          setState(saved.state);
          
          // Find next valid question based on saved state
          let nextStep = 0;
          // This logic would need to be imported from the main component
          setCurrentStep(nextStep);
          
          toast.success("📂 Sessão anterior recuperada!", {
            description: "Continuando de onde você parou"
          });
        }
        setHasLoadedSavedData(true);
      }
    }
  }, [hasLoadedSavedData, isDiagnosticLoading, forceNew, loadCurrentSession, setState, setShowDashboard, setCurrentStep, clearCurrentSession]);

  // Auto-save progress
  useEffect(() => {
    if (hasLoadedSavedData && !forceNew && Object.keys(state).some(key => state[key as keyof MarketingConsultantState])) {
      const syncData = async () => {
        setIsSyncing(true);
        try {
          await saveCurrentSession(state, false);
          console.log('💾 Progresso sincronizado com banco');
        } catch (error) {
          console.error('❌ Erro na sincronização:', error);
        } finally {
          setIsSyncing(false);
        }
      };
      
      syncData();
    }
  }, [state, hasLoadedSavedData, saveCurrentSession, forceNew]);

  return {
    hasLoadedSavedData,
    isSyncing,
    hasCurrentSession,
    currentSession,
    saveCurrentSession,
    clearCurrentSession
  };
};
