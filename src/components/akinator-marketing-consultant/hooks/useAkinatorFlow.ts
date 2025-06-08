import { useState } from 'react';
import { MARKETING_STEPS } from '../constants';
import { MarketingConsultantState } from '../types';
import { useEquipments } from '@/hooks/useEquipments';
import { useUserProfile } from '@/hooks/useUserProfile';

const initialState: MarketingConsultantState = {
  clinicType: '',
  medicalSpecialty: '',
  medicalProcedures: '',
  medicalEquipments: '',
  medicalProblems: '',
  medicalTicket: '',
  medicalSalesModel: '',
  medicalObjective: '',
  medicalVideoFrequency: '',
  medicalClinicStyle: '',
  aestheticFocus: '',
  aestheticEquipments: '',
  aestheticProblems: '',
  aestheticSalesModel: '',
  aestheticTicket: '',
  aestheticObjective: '',
  aestheticVideoFrequency: '',
  aestheticClinicStyle: '',
  currentRevenue: '',
  revenueGoal: '',
  targetAudience: '',
  contentFrequency: '',
  communicationStyle: '',
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
