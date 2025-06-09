
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
      console.log('🌐 Testando conectividade Supabase...');
      
      // Teste básico de conectividade
      const { data: testData, error: testError } = await supabase
        .from('perfis')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.error('❌ Erro conectividade Supabase:', testError);
        throw new Error('Problema de conectividade com Supabase');
      }
      
      console.log('✅ Supabase conectado, testando edge function...');
      
      // Limpar cache se necessário
      const headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };
      
      console.log('🚀 Chamando edge function generate-marketing-diagnostic...');
      console.log('📝 Headers:', headers);
      console.log('📦 Body size:', JSON.stringify(diagnosticData).length, 'bytes');
      
      // Timeout de 90 segundos
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout - IA demorou mais que 90 segundos')), 90000);
      });

      const supabasePromise = supabase.functions.invoke('generate-marketing-diagnostic', {
        body: diagnosticData,
        headers
      });

      const startTime = Date.now();
      const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any;
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('⏱️ Tempo de resposta:', duration, 'ms');
      console.log('📥 Resposta da edge function:');
      console.log('📄 Data:', data);
      console.log('❌ Error:', error);
      console.log('🔍 Error details:', error ? JSON.stringify(error, null, 2) : 'Nenhum erro');

      if (error) {
        console.error('❌ ERRO na edge function:', error);
        
        // Log detalhado do erro
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);
        console.error('Error context:', error.context);
        
        // Verificar tipos específicos de erro
        if (error.message?.includes('timeout') || error.message?.includes('FunctionsTimeout')) {
          throw new Error('⏰ OpenAI demorou para processar. Tente novamente em alguns minutos.');
        }
        
        if (error.message?.includes('OPENAI_API_KEY') || error.message?.includes('sk-')) {
          throw new Error('🔑 Chave da OpenAI inválida ou não configurada. Verifique os secrets do Supabase.');
        }
        
        if (error.message?.includes('network') || error.message?.includes('fetch')) {
          throw new Error('🌐 Problema de rede. Verifique sua conexão com a internet.');
        }
        
        if (error.message?.includes('unauthorized') || error.message?.includes('401')) {
          throw new Error('🚫 Não autorizado. Verifique se você está logado.');
        }
        
        if (error.message?.includes('forbidden') || error.message?.includes('403')) {
          throw new Error('🛡️ Acesso negado. Verifique permissões.');
        }
        
        if (error.message?.includes('rate limit')) {
          throw new Error('🚦 Limite de uso atingido. Aguarde alguns minutos.');
        }
        
        throw new Error(`🔧 Erro na IA: ${error.message || JSON.stringify(error)}`);
      }

      if (!data) {
        console.error('❌ Dados vazios da edge function');
        console.error('Raw response:', { data, error });
        throw new Error('📭 Resposta vazia da IA - possível problema interno');
      }

      // Verificar se a resposta indica falha
      if (data.success === false) {
        console.error('❌ IA retornou erro:', data.error);
        console.error('Error details:', data.details);
        
        if (data.error?.includes('OPENAI_API_KEY') || data.error?.includes('sk-')) {
          throw new Error('🔑 Chave da OpenAI inválida. Configure nos secrets do Supabase.');
        }
        
        if (data.error?.includes('Chave OpenAI inválida')) {
          throw new Error('🔑 Chave OpenAI inválida ou sem permissão. Verifique se está correta.');
        }
        
        if (data.error?.includes('rate limit')) {
          throw new Error('🚦 Limite da OpenAI atingido. Tente em alguns minutos.');
        }
        
        throw new Error(data.error || 'Erro desconhecido na IA');
      }

      if (!data.diagnostic || data.diagnostic.trim() === '') {
        console.error('❌ Diagnóstico vazio da IA');
        console.error('Response data:', data);
        throw new Error('📝 IA retornou diagnóstico vazio');
      }

      console.log('✅ SUCESSO! Diagnóstico IA gerado!');
      console.log('📝 Tamanho:', data.diagnostic.length, 'caracteres');
      console.log('⏱️ Tempo total:', duration, 'ms');

      toast({
        title: "🎯 Diagnóstico IA gerado!",
        description: `Análise personalizada criada em ${Math.round(duration/1000)}s.`
      });

      return data.diagnostic;
      
    } catch (error) {
      console.error('💥 ERRO COMPLETO ao gerar diagnóstico:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      let errorMessage = '🔧 IA temporariamente indisponível';
      
      if (error.message?.includes('Timeout') || error.message?.includes('timeout')) {
        errorMessage = '⏰ IA demorou para responder. Tente novamente em alguns minutos.';
      } else if (error.message?.includes('OPENAI_API_KEY') || error.message?.includes('sk-') || error.message?.includes('Chave OpenAI')) {
        errorMessage = '🔑 Chave da OpenAI não configurada ou inválida. Configure nos secrets do Supabase.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('conectividade')) {
        errorMessage = '🌐 Problema de conexão. Verifique sua internet e tente novamente.';
      } else if (error.message?.includes('rate limit')) {
        errorMessage = '🚦 Limite de uso atingido. Aguarde alguns minutos antes de tentar novamente.';
      } else if (error.message?.includes('unauthorized') || error.message?.includes('forbidden')) {
        errorMessage = '🚫 Problema de autorização. Faça login novamente.';
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
