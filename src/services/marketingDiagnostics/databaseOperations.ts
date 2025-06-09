
import { supabase } from '@/integrations/supabase/client';
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';
import { MarketingDiagnostic } from './types';

// Map para controle de operações em andamento (previne duplicações)
const ongoingOperations = new Map<string, Promise<MarketingDiagnostic | null>>();

export const saveDiagnosticToDatabase = async (
  sessionId: string,
  state: MarketingConsultantState,
  isCompleted: boolean = false
): Promise<MarketingDiagnostic | null> => {
  // Verificar se já existe uma operação em andamento para este sessionId
  if (ongoingOperations.has(sessionId)) {
    console.log('🔄 Operação já em andamento para sessionId:', sessionId);
    return await ongoingOperations.get(sessionId)!;
  }

  const operation = performSaveDiagnostic(sessionId, state, isCompleted);
  ongoingOperations.set(sessionId, operation);

  try {
    const result = await operation;
    return result;
  } finally {
    ongoingOperations.delete(sessionId);
  }
};

const performSaveDiagnostic = async (
  sessionId: string,
  state: MarketingConsultantState,
  isCompleted: boolean = false
): Promise<MarketingDiagnostic | null> => {
  try {
    console.log('💾 Iniciando salvamento de diagnóstico:', { sessionId, isCompleted });

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
      user_id: (await supabase.auth.getUser()).data.user?.id
    };

    // Primeiro, verificar se já existe no banco
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
      
      // Atualizar registro existente
      ({ data, error } = await supabase
        .from('marketing_diagnostics')
        .update(diagnosticData)
        .eq('session_id', sessionId)
        .select()
        .single());
      
      console.log('✅ Diagnóstico atualizado (sem duplicação):', sessionId);
    } else {
      console.log('✨ Criando novo diagnóstico:', sessionId);
      
      // Criar novo registro
      ({ data, error } = await supabase
        .from('marketing_diagnostics')
        .insert(diagnosticData)
        .select()
        .single());
      
      console.log('✅ Novo diagnóstico criado:', sessionId);
    }

    if (error) {
      // Se for erro de violação de constraint única, tentar atualizar
      if (error.code === '23505') {
        console.log('🔄 Constraint violada, tentando atualizar:', sessionId);
        
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

    console.log('✅ Diagnóstico salvo com sucesso (protegido contra duplicação):', data);
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

    const diagnostics = (data || []).map(item => ({
      ...item,
      state_data: item.state_data as unknown as MarketingConsultantState
    })) as MarketingDiagnostic[];

    console.log(`📋 ${diagnostics.length} diagnósticos carregados`);
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
