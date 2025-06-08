
import { supabase } from '@/integrations/supabase/client';

export const generateAIDiagnostic = async (diagnosticData: any): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-marketing-diagnostic', {
      body: diagnosticData
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
