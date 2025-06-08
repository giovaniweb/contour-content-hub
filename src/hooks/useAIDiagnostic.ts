
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface AIDiagnosticResult {
  diagnostic: string;
  success: boolean;
  error?: string;
}

export const useAIDiagnostic = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateDiagnostic = async (diagnosticData: any): Promise<string | null> => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-marketing-diagnostic', {
        body: diagnosticData
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Erro na geração do diagnóstico');
      }

      toast({
        title: "🎯 Diagnóstico gerado com IA!",
        description: "Sua análise personalizada foi criada com sucesso."
      });

      return data.diagnostic;
    } catch (error) {
      console.error('Erro ao gerar diagnóstico com IA:', error);
      
      toast({
        variant: "destructive",
        title: "Erro na geração",
        description: "Não foi possível gerar o diagnóstico. Usando versão padrão."
      });
      
      // Fallback para o sistema atual
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateDiagnostic,
    isGenerating
  };
};
