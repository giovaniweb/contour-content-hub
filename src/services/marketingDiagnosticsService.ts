
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
}

export const marketingDiagnosticsService = {
  async saveDiagnostic(
    sessionId: string,
    state: MarketingConsultantState,
    isCompleted: boolean = false
  ): Promise<MarketingDiagnostic | null> {
    try {
      const clinicType = state.clinicType || '';
      const specialty = state.clinicType === 'clinica_medica' 
        ? state.medicalSpecialty || '' 
        : state.aestheticFocus || '';

      const diagnosticData = {
        session_id: sessionId,
        clinic_type: clinicType,
        specialty: specialty,
        state_data: state as any, // Type assertion for JSON compatibility
        generated_diagnostic: state.generatedDiagnostic,
        is_completed: isCompleted,
        user_id: (await supabase.auth.getUser()).data.user?.id
      };

      const { data, error } = await supabase
        .from('marketing_diagnostics')
        .upsert(diagnosticData, { 
          onConflict: 'session_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar diagnóstico:', error);
        return null;
      }

      console.log('✅ Diagnóstico salvo no banco:', data);
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
        specialty: diagnostic.specialty
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
        specialty: data.specialty
      };
    } catch (error) {
      console.error('❌ Erro ao carregar diagnóstico por session_id:', error);
      return null;
    }
  },

  async deleteDiagnostic(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('marketing_diagnostics')
        .delete()
        .eq('session_id', sessionId);

      if (error) {
        console.error('Erro ao deletar diagnóstico:', error);
        return false;
      }

      console.log('🗑️ Diagnóstico deletado:', sessionId);
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar diagnóstico:', error);
      return false;
    }
  },

  async clearAllDiagnostics(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('marketing_diagnostics')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todos os registros do usuário

      if (error) {
        console.error('Erro ao limpar diagnósticos:', error);
        return false;
      }

      console.log('🗑️ Todos os diagnósticos limpos');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar diagnósticos:', error);
      return false;
    }
  }
};
