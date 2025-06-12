import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiagnosticOperations } from './diagnosticOperations';
import { loadCurrentSessionFromStorage } from './sessionStorage';
import { debugDiagnosticPersistence, syncLocalStorageWithState } from './debugUtils';
import { DiagnosticSession } from './types';

export type { DiagnosticSession } from './types';

// Função para gerar ID determinístico baseado no conteúdo fixo dos dados
const generateDeterministicId = (data: any): string => {
  // Usar dados fixos do diagnóstico para gerar um ID consistente
  const clinicName = data.clinicName || data.clinic_name || data.state?.clinicName || 'unknown';
  const yearsInBusiness = data.yearsInBusiness || data.years_in_business || data.state?.yearsInBusiness || '1';
  const teamSize = data.teamSize || data.team_size || data.state?.teamSize || '1';
  const mainServices = data.mainServices || data.main_services || data.state?.mainServices || 'geral';
  const revenue = data.currentRevenue || data.revenue || data.state?.currentRevenue || '0';
  const clinicType = data.clinicType || data.clinic_type || data.state?.clinicType || 'geral';
  
  // Criar uma string única baseada nos dados fixos do diagnóstico
  const content = `${clinicName}_${yearsInBusiness}_${teamSize}_${mainServices}_${revenue}_${clinicType}`;
  
  // Gerar hash simples baseado no conteúdo
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Usar timestamp fixo baseado no hash para manter consistência
  const fixedTimestamp = Math.abs(hash) * 1000000; // Timestamp fixo baseado no conteúdo
  
  return `diagnostic_${Math.abs(hash)}_${fixedTimestamp}`;
};

// Função para converter dados do formato antigo para DiagnosticSession
const convertLegacyDataToSession = (legacyData: any): DiagnosticSession | null => {
  try {
    if (!legacyData) return null;
    
    console.log('🔍 Convertendo dados legados:', legacyData);
    
    // Verificar se é formato novo (com .state) ou antigo (dados diretos)
    let state = legacyData.state || legacyData;
    
    // Se não tem propriedades básicas, não é um diagnóstico válido
    if (!state || typeof state !== 'object') {
      console.warn('⚠️ Dados inválidos para conversão:', legacyData);
      return null;
    }
    
    // Gerar ID determinístico baseado no conteúdo dos dados
    const sessionId = generateDeterministicId(state);
    
    // Usar timestamp fixo baseado no ID para garantir consistência
    const timestamp = legacyData.timestamp || new Date('2024-01-01').toISOString();
    
    // Determinar clinicTypeLabel e specialty
    let clinicTypeLabel = 'Clínica';
    let specialty = 'Geral';
    
    if (state.clinicType === 'clinica_medica' || state.clinic_type === 'clinica_medica') {
      clinicTypeLabel = 'Clínica Médica';
      specialty = state.medicalSpecialty || state.medical_specialty || 'Geral';
    } else if (state.clinicType === 'clinica_estetica' || state.clinic_type === 'clinica_estetica') {
      clinicTypeLabel = 'Clínica Estética';
      specialty = state.aestheticFocus || state.aesthetic_focus || 'Geral';
    }
    
    const session: DiagnosticSession = {
      id: sessionId,
      timestamp: timestamp,
      state: state,
      isCompleted: legacyData.isCompleted || true, // Dados legados são considerados completos
      clinicTypeLabel,
      specialty,
      isPaidData: legacyData.isPaidData || legacyData.isCompleted || true
    };
    
    console.log('✨ Dados legados convertidos para DiagnosticSession:', session);
    console.log('🆔 ID gerado determinístico:', sessionId);
    return session;
  } catch (error) {
    console.error('❌ Erro ao converter dados legados:', error);
    return null;
  }
};

// Função para migrar dados do localStorage para o novo formato
const migrateLegacyData = (): DiagnosticSession[] => {
  const migratedSessions: DiagnosticSession[] = [];
  
  try {
    // Verificar dados no formato 'marketing_diagnostic_data'
    const legacyData = localStorage.getItem('marketing_diagnostic_data');
    if (legacyData) {
      console.log('🔍 Encontrados dados legados em marketing_diagnostic_data:', legacyData);
      const parsed = JSON.parse(legacyData);
      const converted = convertLegacyDataToSession(parsed);
      if (converted) {
        migratedSessions.push(converted);
        
        // Salvar no novo formato com o ID determinístico
        localStorage.setItem('fluida_current_diagnostic', JSON.stringify(converted));
        console.log('✅ Dados migrados para o novo formato com ID:', converted.id);
      }
    }
    
    // Verificar outras chaves que possam conter dados de diagnóstico
    const allKeys = Object.keys(localStorage);
    const diagnosticKeys = allKeys.filter(key => 
      key.includes('diagnostic') && 
      !key.includes('fluida_current_diagnostic') &&
      !key.includes('marketing_diagnostic_data')
    );
    
    diagnosticKeys.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          const converted = convertLegacyDataToSession(parsed);
          if (converted && !migratedSessions.find(s => s.id === converted.id)) {
            migratedSessions.push(converted);
          }
        }
      } catch (e) {
        console.warn(`⚠️ Erro ao processar chave ${key}:`, e);
      }
    });
    
  } catch (error) {
    console.error('❌ Erro na migração de dados legados:', error);
  }
  
  return migratedSessions;
};

export const useDiagnosticPersistence = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { user } = useAuth();
  
  const {
    savedDiagnostics,
    setSavedDiagnostics,
    currentSession,
    setCurrentSession,
    isLoading,
    loadSavedDiagnostics,
    saveCurrentSession,
    clearCurrentSession,
    deleteDiagnostic,
    loadDiagnostic,
    clearAllData
  } = useDiagnosticOperations();

  // Debug: Carregar dados ao inicializar
  useEffect(() => {
    if (user) {
      const initializeData = async () => {
        try {
          console.log('🚀 Inicializando useDiagnosticPersistence...');
          debugDiagnosticPersistence();
          
          // 1. Migrar dados legados primeiro
          const migratedSessions = migrateLegacyData();
          if (migratedSessions.length > 0) {
            console.log(`🔄 ${migratedSessions.length} sessões migradas dos dados legados`);
            setSavedDiagnostics(prev => [...prev, ...migratedSessions]);
          }
          
          // 2. Carregar sessão atual do localStorage para UX rápida
          const session = loadCurrentSessionFromStorage();
          console.log('📱 Sessão carregada do localStorage:', session);
          if (session) {
            setCurrentSession(session);
          }
          
          // 3. Carregar dados do banco em paralelo
          console.log('📊 Carregando diagnósticos salvos do banco...');
          await loadSavedDiagnostics();
          
          // 4. Verificar sincronização após carregamento
          setTimeout(() => {
            const syncResult = syncLocalStorageWithState(savedDiagnostics, currentSession);
            if (syncResult) {
              console.log('🔄 Aplicando sincronização automática');
              setCurrentSession(syncResult);
            }
          }, 500);
          
        } catch (error) {
          console.error('❌ Erro ao inicializar dados:', error);
        } finally {
          setIsInitializing(false);
        }
      };

      initializeData();
    } else {
      console.log('👤 Usuário não autenticado');
      setIsInitializing(false);
    }
  }, [user, loadSavedDiagnostics, setCurrentSession, setSavedDiagnostics]);

  // Debug: Log mudanças no estado
  useEffect(() => {
    console.log('📊 Estado atualizado - savedDiagnostics:', savedDiagnostics.length, 'itens');
    console.log('📱 Estado atualizado - currentSession:', currentSession ? 'existe' : 'null');
  }, [savedDiagnostics, currentSession]);

  const hasSavedData = (): boolean => {
    const result = currentSession !== null || savedDiagnostics.length > 0;
    console.log('🔍 hasSavedData:', result, { 
      currentSession: !!currentSession, 
      savedCount: savedDiagnostics.length 
    });
    return result;
  };

  const hasCurrentSession = (): boolean => {
    const result = currentSession !== null;
    console.log('🔍 hasCurrentSession:', result);
    return result;
  };

  const isSessionCompleted = (): boolean => {
    const result = currentSession?.isCompleted === true;
    console.log('🔍 isSessionCompleted:', result);
    return result;
  };

  const isPaidData = (): boolean => {
    const result = currentSession?.isPaidData === true || currentSession?.isCompleted === true;
    console.log('🔍 isPaidData:', result);
    return result;
  };

  // Função melhorada para buscar sessão por ID
  const findSessionById = (sessionId: string): DiagnosticSession | null => {
    console.log('🔍 Buscando sessão por ID:', sessionId);
    
    // 1. Buscar na sessão atual
    if (currentSession?.id === sessionId) {
      console.log('✅ Sessão encontrada na currentSession');
      return currentSession;
    }
    
    // 2. Buscar nos diagnósticos salvos
    const foundInSaved = savedDiagnostics.find(d => d.id === sessionId);
    if (foundInSaved) {
      console.log('✅ Sessão encontrada nos savedDiagnostics');
      return foundInSaved;
    }
    
    // 3. Buscar diretamente no localStorage
    try {
      const currentSessionData = localStorage.getItem('fluida_current_diagnostic');
      if (currentSessionData) {
        const parsed = JSON.parse(currentSessionData);
        if (parsed.id === sessionId) {
          console.log('✅ Sessão encontrada no localStorage (fluida_current_diagnostic)');
          return parsed;
        }
      }
      
      // 4. Buscar e converter dados legados usando ID determinístico
      const legacyData = localStorage.getItem('marketing_diagnostic_data');
      if (legacyData) {
        const parsed = JSON.parse(legacyData);
        const converted = convertLegacyDataToSession(parsed);
        if (converted && converted.id === sessionId) {
          console.log('✅ Sessão encontrada nos dados legados com ID determinístico');
          return converted;
        }
      }
    } catch (error) {
      console.error('❌ Erro ao buscar no localStorage:', error);
    }
    
    console.log('❌ Sessão não encontrada:', sessionId);
    return null;
  };

  return {
    savedDiagnostics,
    currentSession,
    isLoading: isLoading || isInitializing,
    saveCurrentSession,
    loadCurrentSession: () => {
      const session = loadCurrentSessionFromStorage();
      console.log('📱 loadCurrentSession chamado, retornando:', session);
      return session;
    },
    clearCurrentSession,
    deleteDiagnostic,
    loadDiagnostic,
    clearAllData,
    hasSavedData,
    hasCurrentSession,
    isSessionCompleted,
    isPaidData,
    loadSavedDiagnostics,
    findSessionById
  };
};
