
import { supabase } from '@/integrations/supabase/client';
import { getSelectedModelTier } from '@/types/ai';

export const generateAIDiagnostic = async (diagnosticData: any): Promise<string | null> => {
  try {
    const modelTier = getSelectedModelTier();
    const { data, error } = await supabase.functions.invoke('generate-marketing-diagnostic', {
      body: { ...diagnosticData, modelTier }
    });

    if (error) {
      console.error('Erro na função Supabase:', error);
      return null;
    }

    if (!data.success) {
      console.error('Erro retornado pela IA:', data.error);
      return null;
    }

    return data.diagnostic;
  } catch (error) {
    console.error('Erro na chamada da IA:', error);
    return null;
  }
};
