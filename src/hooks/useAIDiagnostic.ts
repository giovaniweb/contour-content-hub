
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
    console.log('📊 Dados enviados para IA:', JSON.stringify(diagnosticData, null, 2));
    
    setIsGenerating(true);
    
    try {
      console.log('🚀 Chamando edge function generate-marketing-diagnostic...');
      
      // Timeout de 75 segundos
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout - IA demorou mais que 75 segundos')), 75000);
      });

      const supabasePromise = supabase.functions.invoke('generate-marketing-diagnostic', {
        body: diagnosticData
      });

      const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any;

      console.log('📥 Resposta da edge function:');
      console.log('📄 Data:', data);
      console.log('❌ Error:', error);

      if (error) {
        console.error('❌ ERRO na edge function:', error);
        
        // Tratar diferentes tipos de erro
        if (error.message?.includes('timeout') || error.message?.includes('FunctionsTimeout')) {
          throw new Error('OpenAI demorou para processar. Tente novamente.');
        }
        
        if (error.message?.includes('OPENAI_API_KEY') || error.message?.includes('sk-')) {
          throw new Error('❌ Chave da OpenAI inválida ou não configurada. Verifique os secrets do Supabase.');
        }
        
        throw new Error(`Erro na IA: ${error.message || JSON.stringify(error)}`);
      }

      if (!data) {
        console.error('❌ Dados vazios da edge function');
        throw new Error('Resposta vazia da IA');
      }

      // Verificar se a resposta indica falha
      if (data.success === false) {
        console.error('❌ IA retornou erro:', data.error);
        
        if (data.error?.includes('OPENAI_API_KEY') || data.error?.includes('sk-')) {
          throw new Error('❌ Chave da OpenAI inválida. Configure nos secrets do Supabase.');
        }
        
        if (data.error?.includes('Chave OpenAI inválida')) {
          throw new Error('❌ Chave OpenAI inválida ou sem permissão. Verifique se está correta.');
        }
        
        throw new Error(data.error || 'Erro desconhecido na IA');
      }

      if (!data.diagnostic || data.diagnostic.trim() === '') {
        console.error('❌ Diagnóstico vazio da IA');
        throw new Error('IA retornou diagnóstico vazio');
      }

      console.log('✅ SUCESSO! Diagnóstico IA gerado!');
      console.log('📝 Tamanho:', data.diagnostic.length, 'caracteres');

      toast({
        title: "🎯 Diagnóstico IA gerado!",
        description: "Análise personalizada criada com sucesso."
      });

      return data.diagnostic;
      
    } catch (error) {
      console.error('💥 ERRO ao gerar diagnóstico:', error);
      
      let errorMessage = 'IA temporariamente indisponível';
      
      if (error.message?.includes('Timeout') || error.message?.includes('timeout')) {
        errorMessage = 'IA demorou para responder. Tente novamente em alguns minutos.';
      } else if (error.message?.includes('OPENAI_API_KEY') || error.message?.includes('sk-') || error.message?.includes('Chave OpenAI')) {
        errorMessage = '❌ Chave da OpenAI não configurada ou inválida. Configure nos secrets do Supabase.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Problema de conexão. Verifique sua internet.';
      }
      
      toast({
        variant: "destructive",
        title: "⚠️ Erro na IA",
        description: errorMessage
      });
      
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
