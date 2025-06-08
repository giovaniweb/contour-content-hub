
export interface MarketingStep {
  id: string;
  question: string;
  options: { value: string; label: string }[];
}

export interface MarketingConsultantState {
  clinicType?: string;
  businessTime?: string;
  teamSize?: string;
  currentRevenue?: string;
  revenueGoal?: string;
  mainChallenge?: string;
  marketingBudget?: string;
  socialMediaPresence?: string;
  targetAudience?: string;
  currentStep: number;
  isComplete: boolean;
  generatedDiagnostic?: string;
}
