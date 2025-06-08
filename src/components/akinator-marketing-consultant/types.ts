
export interface MarketingStep {
  id: string;
  question: string;
  options: Array<{ value: string; label: string }>;
  condition?: string;
  isOpen?: boolean;
}

export interface MarketingConsultantState {
  // Identificação do tipo
  clinicType: string;
  
  // Dados para clínica médica
  medicalSpecialty: string;
  medicalProcedures: string;
  medicalEquipments: string;
  medicalProblems: string;
  medicalMostSought: string;
  medicalTicket: string;
  medicalSalesModel: string;
  medicalObjective: string;
  medicalVideoFrequency: string;
  medicalClinicStyle: string;
  
  // Dados para clínica estética
  aestheticFocus: string;
  aestheticEquipments: string;
  aestheticProblems: string;
  aestheticBestSeller: string;
  aestheticSalesModel: string;
  aestheticTicket: string;
  aestheticObjective: string;
  aestheticVideoFrequency: string;
  aestheticClinicStyle: string;
  
  // Briefing comum
  currentRevenue: string;
  revenueGoal: string;
  targetAudience: string;
  contentFrequency: string;
  communicationStyle: string;
  
  // Dados gerados
  generatedDiagnostic: string;
}
