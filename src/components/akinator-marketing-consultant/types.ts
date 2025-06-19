
export interface MarketingStep {
  id: string;
  question: string;
  options?: { value: string; label: string }[];
  isOpen?: boolean;
  condition?: (state: MarketingConsultantState) => boolean;
}

export interface MarketingConsultantState {
  clinicType: string;
  clinicName: string;
  medicalSpecialty: string;
  medicalProcedures: string;
  medicalEquipments: string;
  medicalBestSeller: string;
  medicalTicket: string;
  medicalSalesModel: string;
  medicalObjective: string;
  medicalContentFrequency: string;
  medicalClinicStyle: string;
  aestheticFocus: string;
  aestheticEquipments: string;
  aestheticBestSeller: string;
  aestheticSalesModel: string;
  aestheticTicket: string;
  aestheticObjective: string;
  aestheticContentFrequency: string;
  aestheticClinicStyle: string;
  currentRevenue: string;
  revenueGoal: string;
  targetAudience: string;
  contentFrequency: string;
  communicationStyle: string;
  mainChallenges: string;
  generatedDiagnostic: string;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface MarketingQuestionProps {
  question: {
    id: string;
    text: string;
    description?: string;
    type: string;
    options: Array<{
      id?: string;
      value: string;
      label?: string;
      text?: string;
      description?: string;
      subtitle?: string;
      emoji?: string;
      impact?: string;
    }>;
  };
  onAnswer: (answerId: string) => void;
  onBack?: () => void;
  canGoBack?: boolean;
  progress?: number;
  totalQuestions?: number;
}
