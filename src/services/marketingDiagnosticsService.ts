
import { supabase } from '@/integrations/supabase/client';
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
  isPaidData?: boolean; // Nova flag para proteger dados pagos
}

export const marketingDiagnosticsService = {
  async saveDiagnostic(
    sessionId: string,
    state: MarketingConsultantState,
    isCompleted: boolean = false
  ): Promise<MarketingDiagnostic | null> {
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
  },

  async loadDiagnostics(): Promise<DiagnosticSession[]> {
    try {
      const { data, error } = await supabase
        .from('marketing_diagnostics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar diagnósticos:', error);
        return [];
      }

      return data.map(diagnostic => ({
        id: diagnostic.session_id,
        timestamp: diagnostic.created_at,
        state: diagnostic.state_data as unknown as MarketingConsultantState,
        isCompleted: diagnostic.is_completed,
        clinicTypeLabel: diagnostic.clinic_type === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética',
        specialty: diagnostic.specialty,
        isPaidData: diagnostic.is_completed // Marcar como dados pagos se completo
      }));
    } catch (error) {
      console.error('❌ Erro ao carregar diagnósticos:', error);
      return [];
    }
  },

  async loadDiagnosticBySessionId(sessionId: string): Promise<DiagnosticSession | null> {
    try {
      const { data, error } = await supabase
        .from('marketing_diagnostics')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.session_id,
        timestamp: data.created_at,
        state: data.state_data as unknown as MarketingConsultantState,
        isCompleted: data.is_completed,
        clinicTypeLabel: data.clinic_type === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética',
        specialty: data.specialty,
        isPaidData: data.is_completed // Marcar como dados pagos se completo
      };
    } catch (error) {
      console.error('❌ Erro ao carregar diagnóstico por session_id:', error);
      return null;
    }
  },

  async deleteDiagnostic(sessionId: string): Promise<boolean> {
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
  },

  async clearAllDiagnostics(): Promise<boolean> {
    try {
      // PROTEÇÃO: Deletar apenas diagnósticos incompletos (não pagos)
      const { error } = await supabase
        .from('marketing_diagnostics')
        .delete()
        .eq('is_completed', false);

      if (error) {
        console.error('Erro ao limpar diagnósticos:', error);
        return false;
      }

      console.log('🗑️ Diagnósticos não pagos limpos (dados pagos protegidos)');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar diagnósticos:', error);
      return false;
    }
  },

  async clearDraftsOnly(): Promise<boolean> {
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
  }
};
