
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';

export interface MarketingDiagnostic {
  id: string;
  user_id: string;
  session_id: string;
  clinic_type: string;
  specialty: string;
  state_data: MarketingConsultantState;
  generated_diagnostic?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiagnosticSession {
  id: string;
  timestamp: string;
  state: MarketingConsultantState;
  isCompleted: boolean;
  clinicTypeLabel: string;
  specialty: string;
  isPaidData?: boolean;
}
