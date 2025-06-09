
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';
import { DiagnosticSession } from './types';

export const generateUniqueSessionId = (): string => {
  // Usar crypto.randomUUID se disponível para maior unicidade
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `session_${crypto.randomUUID()}`;
  }
  
  // Fallback com timestamp mais preciso e mais entropia
  const timestamp = Date.now();
  const random1 = Math.random().toString(36).substr(2, 12);
  const random2 = Math.random().toString(36).substr(2, 8);
  return `session_${timestamp}_${random1}_${random2}`;
};

export const createSessionFromState = (
  sessionId: string,
  state: MarketingConsultantState,
  isCompleted: boolean = false,
  timestamp?: string
): DiagnosticSession => {
  return {
    id: sessionId,
    timestamp: timestamp || new Date().toISOString(),
    state,
    isCompleted,
    clinicTypeLabel: state.clinicType === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética',
    specialty: state.clinicType === 'clinica_medica' ? state.medicalSpecialty : state.aestheticFocus,
    isPaidData: isCompleted
  };
};
