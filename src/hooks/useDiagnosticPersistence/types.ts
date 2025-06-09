
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';

export interface DiagnosticSession {
  id: string;
  timestamp: string;
  state: MarketingConsultantState;
  isCompleted: boolean;
  clinicTypeLabel: string;
  specialty: string;
  isPaidData?: boolean;
}
