
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
      console.log('🔑 Verificando se OPENAI_API_KEY está configurada...');
      
      // Aumentar timeout para 45 segundos para dar tempo para a IA processar
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout na chamada da IA - Tente novamente')), 45000);
      });

      const supabasePromise = supabase.functions.invoke('generate-marketing-diagnostic', {
        body: diagnosticData
      });

      const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any;

      console.log('📥 Resposta COMPLETA da edge function:');
      console.log('📄 Data:', JSON.stringify(data, null, 2));
      console.log('❌ Error:', JSON.stringify(error, null, 2));

      if (error) {
        console.error('❌ ERRO na edge function:', error);
        
        // Verificar se é erro de timeout específico
        if (error.message?.includes('timeout') || error.message?.includes('FunctionsTimeout')) {
          throw new Error('A IA está demorando mais que o esperado. Tente novamente em alguns segundos.');
        }
        
        throw new Error(`Edge function error: ${JSON.stringify(error)}`);
      }

      if (!data) {
        console.error('❌ DADOS VAZIOS retornados da edge function');
        throw new Error('Dados vazios retornados da edge function');
      }

      // Verificar se é uma resposta de sucesso da IA
      if (data.success === false) {
        console.error('❌ Edge function retornou sucesso = false');
        console.error('❌ Erro específico:', data.error);
        console.error('❌ Detalhes:', data.details);
        
        // Tratar erros específicos da OpenAI
        if (data.error?.includes('OPENAI_API_KEY')) {
          throw new Error('Chave da OpenAI não configurada. Entre em contato com o suporte.');
        }
        
        throw new Error(data.error || 'Erro na geração do diagnóstico via IA');
      }

      if (!data.diagnostic || data.diagnostic.trim() === '') {
        console.error('❌ Diagnóstico vazio ou inválido retornado pela IA');
        throw new Error('Diagnóstico vazio retornado pela IA');
      }

      console.log('✅ SUCESSO! Diagnóstico IA gerado!');
      console.log('📝 Tamanho do diagnóstico:', data.diagnostic?.length || 0, 'caracteres');
      console.log('🎯 Primeiros 200 chars:', data.diagnostic?.substring(0, 200) + '...');

      toast({
        title: "🎯 Diagnóstico IA gerado!",
        description: "Sua análise personalizada foi criada com sucesso usando OpenAI."
      });

      return data.diagnostic;
    } catch (error) {
      console.error('💥 ERRO COMPLETO ao gerar diagnóstico com IA:');
      console.error('💥 Error object:', error);
      console.error('💥 Error message:', error.message);
      console.error('💥 Error stack:', error.stack);
      
      // Mensagens de erro mais específicas
      let errorMessage = 'OpenAI indisponível. Gerando com sistema local.';
      
      if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
        errorMessage = 'IA demorou para responder. Tente novamente.';
      } else if (error.message?.includes('OPENAI_API_KEY')) {
        errorMessage = 'Configuração da OpenAI pendente.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Problema de conexão. Tente novamente.';
      }
      
      toast({
        variant: "destructive",
        title: "⚠️ IA temporariamente indisponível",
        description: errorMessage
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
