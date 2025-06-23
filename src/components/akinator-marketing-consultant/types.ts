
export interface MarketingStep {
  id: string;
  question: string;
  text?: string; // Add this for backwards compatibility
  type?: 'multiple_choice' | 'equipment_selection';
  options?: { value: string; label: string }[];
  answers?: Answer[]; // Add this for backwards compatibility
  phase?: string; // Add this for backwards compatibility
  isOpen?: boolean;
  condition?: (state: MarketingConsultantState) => boolean;
}

export interface Answer {
  id: string;
  text: string;
  points: number;
  next_question_id?: string;
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
