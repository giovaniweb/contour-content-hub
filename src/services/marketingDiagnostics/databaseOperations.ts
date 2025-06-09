
import { supabase } from '@/integrations/supabase/client';
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';
import { MarketingDiagnostic } from './types';

export const saveDiagnosticToDatabase = async (
  sessionId: string,
  state: MarketingConsultantState,
  isCompleted: boolean = false
): Promise<MarketingDiagnostic | null> => {
  try {
    // Verificar se já existe para evitar duplicação
    const { data: existing } = await supabase
      .from('marketing_diagnostics')
      .select('id')
      .eq('session_id', sessionId)
      .single();

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

    let data, error;

    if (existing) {
      // Atualizar registro existente
      ({ data, error } = await supabase
        .from('marketing_diagnostics')
        .update(diagnosticData)
        .eq('session_id', sessionId)
        .select()
        .single());
      
      console.log('🔄 Diagnóstico atualizado (sem duplicação):', sessionId);
    } else {
      // Criar novo registro
      ({ data, error } = await supabase
        .from('marketing_diagnostics')
        .insert(diagnosticData)
        .select()
        .single());
      
      console.log('✨ Novo diagnóstico criado:', sessionId);
    }

    if (error) {
      console.error('Erro ao salvar diagnóstico:', error);
      return null;
    }

    console.log('✅ Diagnóstico salvo no banco (protegido contra duplicação):', data);
    return {
      ...data,
      state_data: data.state_data as unknown as MarketingConsultantState
    } as MarketingDiagnostic;
  } catch (error) {
    console.error('❌ Erro ao salvar diagnóstico:', error);
    return null;
  }
};

export const loadDiagnosticsFromDatabase = async (): Promise<MarketingDiagnostic[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_diagnostics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar diagnósticos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Erro ao carregar diagnósticos:', error);
    return [];
  }
};

export const loadDiagnosticBySessionIdFromDatabase = async (sessionId: string): Promise<MarketingDiagnostic | null> => {
  try {
    const { data, error } = await supabase
      .from('marketing_diagnostics')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as MarketingDiagnostic;
  } catch (error) {
    console.error('❌ Erro ao carregar diagnóstico por session_id:', error);
    return null;
  }
};

export const deleteDiagnosticFromDatabase = async (sessionId: string): Promise<boolean> => {
  try {
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
      console.error('Erro ao deletar diagnóstico:', error);
      return false;
    }

    console.log('🗑️ Diagnóstico deletado (dados não pagos):', sessionId);
    return true;
  } catch (error) {
    console.error('❌ Erro ao deletar diagnóstico:', error);
    return false;
  }
};

export const clearDraftsFromDatabase = async (): Promise<boolean> => {
  try {
    // Deletar apenas rascunhos (diagnósticos incompletos)
    const { error } = await supabase
      .from('marketing_diagnostics')
      .delete()
      .eq('is_completed', false);

    if (error) {
      console.error('Erro ao limpar rascunhos:', error);
      return false;
    }

    console.log('🗑️ Rascunhos limpos com sucesso (dados pagos preservados)');
    return true;
  } catch (error) {
    console.error('❌ Erro ao limpar rascunhos:', error);
    return false;
  }
};
