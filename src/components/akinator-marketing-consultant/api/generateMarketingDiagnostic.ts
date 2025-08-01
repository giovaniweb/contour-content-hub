
import { MarketingConsultantState } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const generateMarketingDiagnostic = async (state: MarketingConsultantState): Promise<string> => {
  try {
    console.log('🎯 Iniciando diagnóstico de marketing para usuário');
    console.log('📊 Parâmetros:', { 
      questionsAnswered: Object.keys(state).length,
      stateKeys: Object.keys(state)
    });

    const { data, error } = await supabase.functions.invoke('generate-marketing-diagnostic', {
      body: state
    });

    console.log('📡 Resposta da edge function:', { data, error });

    if (error) {
      console.error('❌ Erro na edge function:', error);
      throw new Error(`Erro na edge function: ${error.message}`);
    }

    if (!data.success) {
      console.error('❌ Edge function retornou erro:', data.error);
      if (data.fallback) {
        console.log('🔄 Usando fallback devido a:', data.error);
        return data.diagnostic;
      }
      throw new Error(data.error || 'Falha na geração do diagnóstico');
    }

    console.log('✅ Diagnóstico gerado com sucesso');
    return data.diagnostic;
  } catch (error) {
    console.error('💥 Erro na geração do diagnóstico:', error);
    throw error;
  }
};
