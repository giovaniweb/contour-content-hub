
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';
import { MarketingDiagnostic, DiagnosticSession } from './types';
import {
  saveDiagnosticToDatabase,
  loadDiagnosticsFromDatabase,
  loadDiagnosticBySessionIdFromDatabase,
  deleteDiagnosticFromDatabase,
  clearDraftsFromDatabase
} from './databaseOperations';
import {
  transformToSessionFormat,
  transformMultipleToSessionFormat
} from './dataTransformers';
import { supabase } from '@/integrations/supabase/client';

export type { MarketingDiagnostic, DiagnosticSession } from './types';

export const marketingDiagnosticsService = {
  async saveDiagnostic(
    sessionId: string,
    state: MarketingConsultantState,
    isCompleted: boolean = false
  ): Promise<MarketingDiagnostic | null> {
    return await saveDiagnosticToDatabase(sessionId, state, isCompleted);
  },

  async loadDiagnostics(): Promise<DiagnosticSession[]> {
    const diagnostics = await loadDiagnosticsFromDatabase();
    return transformMultipleToSessionFormat(diagnostics);
  },

  async loadDiagnosticBySessionId(sessionId: string): Promise<DiagnosticSession | null> {
    const diagnostic = await loadDiagnosticBySessionIdFromDatabase(sessionId);
    
    if (!diagnostic) {
      return null;
    }

    return transformToSessionFormat(diagnostic);
  },

  async deleteDiagnostic(sessionId: string): Promise<boolean> {
    return await deleteDiagnosticFromDatabase(sessionId);
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
    return await clearDraftsFromDatabase();
  }
};
