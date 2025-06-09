
import { MarketingDiagnostic, DiagnosticSession } from './types';

export const transformToSessionFormat = (diagnostic: MarketingDiagnostic): DiagnosticSession => {
  return {
    id: diagnostic.session_id,
    timestamp: diagnostic.created_at,
    state: diagnostic.state_data,
    isCompleted: diagnostic.is_completed,
    clinicTypeLabel: diagnostic.clinic_type === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética',
    specialty: diagnostic.specialty,
    isPaidData: diagnostic.is_completed // Marcar como dados pagos se completo
  };
};

export const transformMultipleToSessionFormat = (diagnostics: MarketingDiagnostic[]): DiagnosticSession[] => {
  return diagnostics.map(transformToSessionFormat);
};
