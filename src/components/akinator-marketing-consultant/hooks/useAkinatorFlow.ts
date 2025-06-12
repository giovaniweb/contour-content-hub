
import { useState, useEffect } from 'react';
import { MARKETING_STEPS } from '../constants';
import { MarketingConsultantState } from '../types';
import { useEquipments } from '@/hooks/useEquipments';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence';

const initialState: MarketingConsultantState = {
  clinicType: '',
  clinicName: '',
  medicalSpecialty: '',
  medicalProcedures: '',
  medicalEquipments: '',
  medicalBestSeller: '',
  medicalTicket: '',
  medicalSalesModel: '',
  medicalObjective: '',
  medicalContentFrequency: '',
  medicalClinicStyle: '',
  aestheticFocus: '',
  aestheticEquipments: '',
  aestheticBestSeller: '',
  aestheticSalesModel: '',
  aestheticTicket: '',
  aestheticObjective: '',
  aestheticContentFrequency: '',
  aestheticClinicStyle: '',
  currentRevenue: '',
  revenueGoal: '',
  targetAudience: '',
  contentFrequency: '',
  communicationStyle: '',
  mainChallenges: '',
  generatedDiagnostic: ''
};

export const useAkinatorFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<MarketingConsultantState>(initialState);
  const [showResult, setShowResult] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { equipments } = useEquipments();
  const { updateClinicType } = useUserProfile();
  const { currentSession, hasCurrentSession, isSessionCompleted } = useDiagnosticPersistence();

  // Carregar estado salvo se existir e for válido
  useEffect(() => {
    if (currentSession && hasCurrentSession()) {
      // Verificar se é uma sessão válida (não muito antiga)
      const sessionDate = new Date(currentSession.timestamp);
      const minimumValidDate = new Date('2024-01-01');
      
      if (sessionDate >= minimumValidDate) {
        console.log('🔄 Restaurando estado do diagnóstico válido');
        setState(currentSession.state);
        
        if (isSessionCompleted()) {
          setShowDashboard(true);
        }
      } else {
        console.log('🚫 Sessão muito antiga detectada, não restaurando estado');
        // Não restaurar estado de sessões muito antigas
      }
    }
  }, [currentSession, hasCurrentSession, isSessionCompleted]);

  return {
    currentStep,
    setCurrentStep,
    state,
    setState,
    showResult,
    setShowResult,
    showDashboard,
    setShowDashboard,
    isProcessing,
    setIsProcessing,
    equipments,
    updateClinicType
  };
};
