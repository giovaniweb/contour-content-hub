
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
    console.log('🎯 CONSULTOR FLUIDA: Iniciando geração do diagnóstico');
    console.log('📊 Dados enviados:', JSON.stringify(diagnosticData, null, 2));
    
    setIsGenerating(true);
    
    try {
      console.log('🌐 Verificando conectividade com Supabase...');
      
      // Teste básico de conectividade
      const { data: testData, error: testError } = await supabase
        .from('perfis')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.error('❌ Erro de conectividade:', testError);
        throw new Error('Problema de conectividade com Supabase');
      }
      
      console.log('✅ Supabase conectado, chamando Consultor Fluida...');
      
      // Headers para evitar cache
      const headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };
      
      console.log('🎯 Chamando edge function generate-marketing-diagnostic...');
      
      const startTime = Date.now();
      
      // Timeout de 70 segundos (um pouco menos que os 75s do backend)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout - Consultor Fluida demorou mais que 70 segundos')), 70000);
      });

      const supabasePromise = supabase.functions.invoke('generate-marketing-diagnostic', {
        body: diagnosticData,
        headers
      });

      const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any;
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('⏱️ Tempo de resposta:', Math.round(duration/1000), 'segundos');
      console.log('📥 Resposta da edge function:');
      console.log('📄 Data:', data);
      console.log('❌ Error:', error);

      if (error) {
        console.error('❌ ERRO na edge function:', error);
        
        // Tratamento específico de erros conforme o prompt
        if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
          throw new Error('⏰ Consultor Fluida demorou para processar. Tente novamente em alguns minutos.');
        }
        
        if (error.message?.includes('OPENAI_API_KEY') || error.message?.includes('sk-')) {
          throw new Error('🔑 Chave da OpenAI não configurada. Configure nos secrets do Supabase.');
        }
        
        if (error.message?.includes('network') || error.message?.includes('conectividade')) {
          throw new Error('🌐 Problema de rede. Verifique sua conexão com a internet.');
        }
        
        if (error.message?.includes('rate limit')) {
          throw new Error('🚦 Limite de uso atingido. Aguarde alguns minutos.');
        }
        
        throw new Error(`🔧 Erro no Consultor Fluida: ${error.message || JSON.stringify(error)}`);
      }

      if (!data) {
        console.error('❌ Dados vazios da edge function');
        throw new Error('📭 Resposta vazia do Consultor Fluida');
      }

      // Verificar se a resposta indica falha
      if (data.success === false) {
        console.error('❌ Consultor Fluida retornou erro:', data.error);
        
        if (data.error?.includes('OPENAI_API_KEY')) {
          throw new Error('🔑 Chave OpenAI inválida. Configure nos secrets do Supabase.');
        }
        
        if (data.error?.includes('rate limit')) {
          throw new Error('🚦 Limite da OpenAI atingido. Tente em alguns minutos.');
        }
        
        throw new Error(data.error || 'Erro desconhecido no Consultor Fluida');
      }

      if (!data.diagnostic || data.diagnostic.trim() === '') {
        console.error('❌ Diagnóstico vazio');
        throw new Error('📝 Consultor Fluida retornou diagnóstico vazio');
      }

      console.log('✅ SUCESSO! Diagnóstico Fluida gerado!');
      console.log('📝 Tamanho:', data.diagnostic.length, 'caracteres');
      console.log('⏱️ Tempo total:', Math.round(duration/1000), 'segundos');

      toast({
        title: "🎯 Diagnóstico Fluida gerado!",
        description: `Análise estratégica criada em ${Math.round(duration/1000)}s pelo Consultor Fluida.`
      });

      return data.diagnostic;
      
    } catch (error) {
      console.error('💥 ERRO COMPLETO no Consultor Fluida:', error);
      
      let errorMessage = '🔧 Consultor Fluida temporariamente indisponível';
      
      if (error.message?.includes('Timeout') || error.message?.includes('timeout')) {
        errorMessage = '⏰ Consultor Fluida demorou para responder. Suas respostas foram salvas. Tente novamente em alguns minutos.';
      } else if (error.message?.includes('OPENAI_API_KEY') || error.message?.includes('Chave OpenAI')) {
        errorMessage = '🔑 Chave da OpenAI não configurada. Configure nos secrets do Supabase para ativar o Consultor Fluida.';
      } else if (error.message?.includes('network') || error.message?.includes('conectividade')) {
        errorMessage = '🌐 Problema de conexão. Verifique sua internet e tente novamente.';
      } else if (error.message?.includes('rate limit')) {
        errorMessage = '🚦 Limite de uso atingido. Aguarde alguns minutos antes de tentar novamente.';
      }
      
      toast({
        variant: "destructive",
        title: "⚠️ Erro no Consultor Fluida",
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
