
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
    console.log('🤖 useAIDiagnostic: Iniciando geração com IA');
    console.log('📊 Dados enviados:', diagnosticData);
    
    setIsGenerating(true);
    
    try {
      console.log('🚀 Chamando edge function generate-marketing-diagnostic...');
      
      const { data, error } = await supabase.functions.invoke('generate-marketing-diagnostic', {
        body: diagnosticData
      });

      console.log('📥 Resposta da edge function:', { data, error });

      if (error) {
        console.error('❌ Erro na edge function:', error);
        throw new Error(error.message);
      }

      if (!data) {
        console.error('❌ Dados vazios retornados da edge function');
        throw new Error('Dados vazios retornados');
      }

      if (!data.success) {
        console.error('❌ Edge function retornou sucesso = false:', data.error);
        throw new Error(data.error || 'Erro na geração do diagnóstico');
      }

      console.log('✅ Diagnóstico gerado com IA com sucesso!');
      console.log('📝 Tamanho do diagnóstico:', data.diagnostic?.length || 0, 'caracteres');

      toast({
        title: "🎯 Diagnóstico gerado com IA!",
        description: "Sua análise personalizada foi criada com sucesso."
      });

      return data.diagnostic;
    } catch (error) {
      console.error('💥 Erro completo ao gerar diagnóstico com IA:', error);
      
      toast({
        variant: "destructive",
        title: "⚠️ Usando versão offline",
        description: "IA indisponível. Gerando diagnóstico com sistema local."
      });
      
      // Retorna null para usar fallback
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
