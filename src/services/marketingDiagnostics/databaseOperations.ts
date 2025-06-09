import { supabase } from '@/integrations/supabase/client';
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';
import { MarketingDiagnostic } from './types';

// Map para controle de operações em andamento (previne duplicações)
const ongoingOperations = new Map<string, Promise<MarketingDiagnostic | null>>();

// Map para rastrear tentativas de salvamento por contexto único
const saveAttempts = new Map<string, number>();

// Gerar chave única para operações baseada no contexto do usuário
const generateOperationKey = (userId: string, clinicType: string, specialty: string, isCompleted: boolean): string => {
  return `${userId}_${clinicType}_${specialty}_${isCompleted}`;
};

export const saveDiagnosticToDatabase = async (
  sessionId: string,
  state: MarketingConsultantState,
  isCompleted: boolean = false
): Promise<MarketingDiagnostic | null> => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  
  if (!userId) {
    console.error('❌ Usuário não autenticado');
    return null;
  }

  const clinicType = state.clinicType || '';
  const specialty = state.clinicType === 'clinica_medica' 
    ? state.medicalSpecialty || '' 
    : state.aestheticFocus || '';

  const operationKey = generateOperationKey(userId, clinicType, specialty, isCompleted);

  // Verificar se já existe uma operação em andamento para este contexto específico
  if (ongoingOperations.has(operationKey)) {
    console.log('🔄 Operação já em andamento para contexto:', operationKey);
    return await ongoingOperations.get(operationKey)!;
  }

  // Contar tentativas para este contexto
  const attempts = saveAttempts.get(operationKey) || 0;
  saveAttempts.set(operationKey, attempts + 1);

  if (attempts > 3) {
    console.warn('⚠️ Muitas tentativas para contexto:', operationKey, 'Ignorando salvamento');
    return null;
  }

  const operation = performSaveDiagnostic(sessionId, state, isCompleted, userId, operationKey);
  ongoingOperations.set(operationKey, operation);

  try {
    const result = await operation;
    // Resetar contador em caso de sucesso
    saveAttempts.delete(operationKey);
    return result;
  } catch (error) {
    console.error('❌ Erro na operação:', error);
    return null;
  } finally {
    ongoingOperations.delete(operationKey);
  }
};

const performSaveDiagnostic = async (
  sessionId: string,
  state: MarketingConsultantState,
  isCompleted: boolean = false,
  userId: string,
  operationKey: string
): Promise<MarketingDiagnostic | null> => {
  try {
    console.log('💾 Iniciando salvamento protegido:', { sessionId, operationKey, isCompleted });

    const clinicType = state.clinicType || '';
    const specialty = state.clinicType === 'clinica_medica' 
      ? state.medicalSpecialty || '' 
      : state.aestheticFocus || '';

    const diagnosticData = {
      session_id: sessionId,
      clinic_type: clinicType,
      specialty: specialty,
      state_data: state as any,
      generated_diagnostic: state.generatedDiagnostic,
      is_completed: isCompleted,
      user_id: userId
    };

    // Verificar duplicações por contexto antes de salvar
    const { data: existingByContext, error: contextError } = await supabase
      .from('marketing_diagnostics')
      .select('id, session_id, created_at')
      .eq('user_id', userId)
      .eq('clinic_type', clinicType)
      .eq('specialty', specialty)
      .eq('is_completed', isCompleted)
      .order('created_at', { ascending: false })
      .limit(1);

    if (contextError && contextError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar contexto:', contextError);
      return null;
    }

    // Se encontrou registro similar muito recente (menos de 5 minutos), não criar novo
    if (existingByContext && existingByContext.length > 0) {
      const existingRecord = existingByContext[0];
      const timeDiff = Date.now() - new Date(existingRecord.created_at).getTime();
      
      if (timeDiff < 5 * 60 * 1000) { // 5 minutos
        console.log('⚠️ Registro similar muito recente encontrado, atualizando existente:', existingRecord.session_id);
        
        const { data, error } = await supabase
          .from('marketing_diagnostics')
          .update(diagnosticData)
          .eq('id', existingRecord.id)
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao atualizar registro existente:', error);
          return null;
        }

        console.log('✅ Registro existente atualizado (anti-duplicação):', data?.session_id);
        return {
          ...data,
          state_data: data.state_data as unknown as MarketingConsultantState
        } as MarketingDiagnostic;
      }
    }

    // Primeiro, verificar se já existe pelo session_id
    const { data: existing, error: checkError } = await supabase
      .from('marketing_diagnostics')
      .select('id, is_completed, created_at')
      .eq('session_id', sessionId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar diagnóstico existente:', checkError);
      return null;
    }

    let data, error;

    if (existing) {
      console.log('🔄 Atualizando diagnóstico existente:', sessionId);
      
      ({ data, error } = await supabase
        .from('marketing_diagnostics')
        .update(diagnosticData)
        .eq('session_id', sessionId)
        .select()
        .single());
      
      console.log('✅ Diagnóstico atualizado (protegido contra duplicação):', sessionId);
    } else {
      console.log('✨ Criando novo diagnóstico protegido:', sessionId);
      
      ({ data, error } = await supabase
        .from('marketing_diagnostics')
        .insert(diagnosticData)
        .select()
        .single());
      
      console.log('✅ Novo diagnóstico criado (protegido):', sessionId);
    }

    if (error) {
      // Se for erro de violação de constraint única, tentar atualizar
      if (error.code === '23505') {
        console.log('🔄 Violação de constraint detectada, tentando atualizar:', sessionId);
        
        ({ data, error } = await supabase
          .from('marketing_diagnostics')
          .update(diagnosticData)
          .eq('session_id', sessionId)
          .select()
          .single());
        
        if (error) {
          console.error('❌ Erro ao atualizar após violação de constraint:', error);
          return null;
        }
      } else {
        console.error('❌ Erro ao salvar diagnóstico:', error);
        return null;
      }
    }

    console.log('✅ Diagnóstico salvo com sucesso (anti-duplicação ativa):', data?.session_id);
    return {
      ...data,
      state_data: data.state_data as unknown as MarketingConsultantState
    } as MarketingDiagnostic;
  } catch (error) {
    console.error('❌ Erro geral ao salvar diagnóstico:', error);
    return null;
  }
};

export const loadDiagnosticsFromDatabase = async (): Promise<MarketingDiagnostic[]> => {
  try {
    console.log('📚 Carregando diagnósticos do banco...');
    
    const { data, error } = await supabase
      .from('marketing_diagnostics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao carregar diagnósticos:', error);
      return [];
    }

    // Filtrar duplicações no lado do cliente como camada extra de proteção
    const uniqueDiagnostics = new Map<string, any>();
    
    (data || []).forEach(item => {
      const contextKey = `${item.user_id}_${item.clinic_type}_${item.specialty}_${item.is_completed}`;
      
      // Manter apenas o mais recente por contexto
      if (!uniqueDiagnostics.has(contextKey) || 
          new Date(item.created_at) > new Date(uniqueDiagnostics.get(contextKey).created_at)) {
        uniqueDiagnostics.set(contextKey, item);
      }
    });

    const diagnostics = Array.from(uniqueDiagnostics.values()).map(item => ({
      ...item,
      state_data: item.state_data as unknown as MarketingConsultantState
    })) as MarketingDiagnostic[];

    console.log(`📋 ${diagnostics.length} diagnósticos únicos carregados (filtro anti-duplicação aplicado)`);
    return diagnostics;
  } catch (error) {
    console.error('❌ Erro ao carregar diagnósticos:', error);
    return [];
  }
};

export const loadDiagnosticBySessionIdFromDatabase = async (sessionId: string): Promise<MarketingDiagnostic | null> => {
  try {
    console.log('🔍 Carregando diagnóstico por sessionId:', sessionId);
    
    const { data, error } = await supabase
      .from('marketing_diagnostics')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error || !data) {
      console.log('📭 Nenhum diagnóstico encontrado para sessionId:', sessionId);
      return null;
    }

    console.log('✅ Diagnóstico encontrado:', sessionId);
    return {
      ...data,
      state_data: data.state_data as unknown as MarketingConsultantState
    } as MarketingDiagnostic;
  } catch (error) {
    console.error('❌ Erro ao carregar diagnóstico por session_id:', error);
    return null;
  }
};

export const deleteDiagnosticFromDatabase = async (sessionId: string): Promise<boolean> => {
  try {
    console.log('🗑️ Tentando deletar diagnóstico:', sessionId);
    
    // Verificar se é um diagnóstico completo (dados pagos) antes de deletar
    const { data: diagnostic } = await supabase
      .from('marketing_diagnostics')
      .select('is_completed')
      .eq('session_id', sessionId)
      .single();

    if (diagnostic?.is_completed) {
      console.warn('🛡️ Tentativa de deletar dados pagos bloqueada:', sessionId);
      return false; // Bloquear deletar dados pagos
    }

    const { error } = await supabase
      .from('marketing_diagnostics')
      .delete()
      .eq('session_id', sessionId);

    if (error) {
      console.error('❌ Erro ao deletar diagnóstico:', error);
      return false;
    }

    console.log('✅ Diagnóstico deletado com sucesso:', sessionId);
    return true;
  } catch (error) {
    console.error('❌ Erro ao deletar diagnóstico:', error);
    return false;
  }
};

export const clearDraftsFromDatabase = async (): Promise<boolean> => {
  try {
    console.log('🧹 Limpando rascunhos do banco...');
    
    // Deletar apenas rascunhos (diagnósticos incompletos)
    const { error } = await supabase
      .from('marketing_diagnostics')
      .delete()
      .eq('is_completed', false);

    if (error) {
      console.error('❌ Erro ao limpar rascunhos:', error);
      return false;
    }

    console.log('✅ Rascunhos limpos com sucesso (dados pagos preservados)');
    return true;
  } catch (error) {
    console.error('❌ Erro ao limpar rascunhos:', error);
    return false;
  }
};
