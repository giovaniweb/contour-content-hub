
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';
import { DiagnosticSession } from './types';

// Cache global para session_ids por contexto único de usuário
const sessionIdCache = new Map<string, string>();

// Gerar chave única baseada no contexto do usuário e tipo de diagnóstico
const generateCacheKey = (userId: string, clinicType: string, specialty: string): string => {
  return `${userId}_${clinicType}_${specialty}`;
};

// Gerar ou reutilizar session_id baseado no contexto do usuário
export const generateUniqueSessionId = (
  userId?: string, 
  clinicType?: string, 
  specialty?: string
): string => {
  if (userId && clinicType && specialty) {
    const cacheKey = generateCacheKey(userId, clinicType, specialty);
    
    // Verificar se já existe um session_id para este contexto
    if (sessionIdCache.has(cacheKey)) {
      console.log('🔄 Reutilizando session_id existente para:', cacheKey);
      return sessionIdCache.get(cacheKey)!;
    }
    
    // Criar novo session_id e armazenar no cache
    const newSessionId = `session_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionIdCache.set(cacheKey, newSessionId);
    console.log('✨ Novo session_id gerado para:', cacheKey, newSessionId);
    return newSessionId;
  }
  
  // Fallback para quando não temos informações suficientes
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Limpar cache de session_id quando necessário
export const clearSessionIdCache = (userId?: string, clinicType?: string, specialty?: string): void => {
  if (userId && clinicType && specialty) {
    const cacheKey = generateCacheKey(userId, clinicType, specialty);
    sessionIdCache.delete(cacheKey);
    console.log('🗑️ Cache de session_id limpo para:', cacheKey);
  } else {
    sessionIdCache.clear();
    console.log('🗑️ Todo cache de session_id limpo');
  }
};

// Verificar se uma sessão já existe para evitar duplicações
export const checkForExistingSession = (
  sessions: DiagnosticSession[], 
  userId: string, 
  clinicType: string, 
  specialty: string,
  isCompleted: boolean = false
): DiagnosticSession | null => {
  return sessions.find(session => {
    // Verificar se a sessão corresponde ao contexto buscado
    const sessionClinicType = session.state?.clinicType;
    const sessionSpecialty = session.state?.clinicType === 'clinica_medica' 
      ? session.state?.medicalSpecialty 
      : session.state?.aestheticFocus;
    
    return sessionClinicType === clinicType &&
           sessionSpecialty === specialty &&
           session.isCompleted === isCompleted;
  }) || null;
};

export const createSessionFromState = (
  sessionId: string,
  state: MarketingConsultantState,
  isCompleted: boolean = false,
  timestamp?: string
): DiagnosticSession => {
  const clinicTypeLabel = state.clinicType === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética';
  const specialty = state.clinicType === 'clinica_medica' 
    ? state.medicalSpecialty || '' 
    : state.aestheticFocus || '';

  return {
    id: sessionId,
    state,
    isCompleted,
    timestamp: timestamp || new Date().toISOString(),
    clinicTypeLabel,
    specialty,
    isPaidData: isCompleted
  };
};

// Detectar potenciais duplicações baseado em similaridade de conteúdo
export const detectContentDuplication = (
  sessions: DiagnosticSession[],
  newSession: DiagnosticSession
): DiagnosticSession[] => {
  const similarSessions = sessions.filter(session => {
    if (session.id === newSession.id) return false;
    
    // Verificar similaridade por conteúdo
    const sameClinicType = session.state?.clinicType === newSession.state?.clinicType;
    const sameSpecialty = (
      session.state?.medicalSpecialty === newSession.state?.medicalSpecialty ||
      session.state?.aestheticFocus === newSession.state?.aestheticFocus
    );
    const sameCompletion = session.isCompleted === newSession.isCompleted;
    
    // Verificar se têm respostas muito similares
    const sessionAnswers = Object.keys(session.state || {}).filter(key => 
      session.state?.[key] && key !== 'generatedDiagnostic'
    ).length;
    const newSessionAnswers = Object.keys(newSession.state || {}).filter(key => 
      newSession.state?.[key] && key !== 'generatedDiagnostic'
    ).length;
    
    const answerSimilarity = Math.abs(sessionAnswers - newSessionAnswers) <= 2;
    
    return sameClinicType && sameSpecialty && sameCompletion && answerSimilarity;
  });
  
  if (similarSessions.length > 0) {
    console.warn('🔍 Detectadas sessões similares:', similarSessions.length);
  }
  
  return similarSessions;
};
