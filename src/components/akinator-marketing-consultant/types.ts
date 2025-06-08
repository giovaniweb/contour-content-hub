
export interface MarketingStep {
  id: string;
  question: string;
  options: { value: string; label: string }[];
  condition?: string; // Para perguntas condicionais
  isOpen?: boolean; // Para campos de texto livre
}

export interface MarketingConsultantState {
  // Tipo de clínica
  clinicType?: string;
  
  // Específico para clínicas médicas
  medicalSpecialty?: string;
  medicalProcedures?: string;
  medicalTicket?: string;
  medicalModel?: string;
  medicalObjective?: string;
  
  // Específico para clínicas estéticas
  aestheticFocus?: string;
  aestheticEquipments?: string;
  aestheticBestSeller?: string;
  aestheticSalesModel?: string;
  aestheticObjective?: string;
  
  // Perguntas comuns
  currentRevenue?: string;
  revenueGoal?: string;
  mainService?: string;
  personalBrand?: string;
  contentFrequency?: string;
  paidTraffic?: string;
  targetAudience?: string;
  clinicPosition?: string;
  
  // Controle do fluxo
  currentStep: number;
  isComplete: boolean;
  generatedDiagnostic?: string;
}
