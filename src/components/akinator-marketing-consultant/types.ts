
export interface MarketingConsultantState {
  clinicType: string;
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
  aestheticFocus: string;
  aestheticEquipments: string;
  aestheticProblems: string;
  aestheticBestSeller: string;
  aestheticSalesModel: string;
  aestheticTicket: string;
  aestheticObjective: string;
  aestheticVideoFrequency: string;
  aestheticClinicStyle: string;
  currentRevenue: string;
  revenueGoal: string;
  targetAudience: string;
  contentFrequency: string;
  communicationStyle: string;
  generatedDiagnostic: string;
}

export interface MarketingStepOption {
  value: string;
  label: string;
}

export interface MarketingStep {
  id: string;
  question: string;
  options: MarketingStepOption[];
  isOpen?: boolean;
  condition?: (state: MarketingConsultantState) => boolean;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  icon: string;
}
