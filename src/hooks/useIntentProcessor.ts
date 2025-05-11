
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getUserProfileData, UserProfile } from '@/services/userProfileService';

// Tipos para o processador de intenções
export interface UserContext {
  mensagem_usuario?: string;
  procedimentos?: string[];
  estilo_preferido?: string;
  tipos_conteudo_validados?: string[];
  foco_comunicacao?: string;
  perfil_comportamental?: string[];
  insights_performance?: string[];
}

export interface IntentProcessorResult {
  intencao: string;
  categoria: 'marketing' | 'planejamento' | 'ciencia' | 'conteudo' | 'vendas' | 'outro';
  direcionamento_estrategico: 'venda' | 'branding' | 'educacao';
  acao_recomendada: string;
  prompt_personalizado: string;
  explicacao: string;
  proximo_passo: string;
}

export function useIntentProcessor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntentProcessorResult | null>(null);

  /**
   * Processa a intenção do usuário com base em seu contexto
   * @param context O contexto do usuário incluindo mensagem e dados comportamentais
   */
  const processIntent = async (context: UserContext): Promise<IntentProcessorResult> => {
    setLoading(true);
    
    try {
      // Obter a sessão atual
      const { data: { session } } = await supabase.auth.getSession();
      const user_id = session?.user?.id;
      
      // Tenta obter o perfil do usuário do banco de dados
      const userProfile = user_id ? await getUserProfileData(user_id) : null;
      
      // Combina o contexto fornecido com o perfil do usuário (se existir)
      const enrichedContext: UserContext = {
        ...context,
        estilo_preferido: context.estilo_preferido || userProfile?.estilo_preferido || undefined,
        tipos_conteudo_validados: context.tipos_conteudo_validados || userProfile?.tipos_conteudo_validados || undefined,
        foco_comunicacao: context.foco_comunicacao || userProfile?.foco_comunicacao || undefined,
        perfil_comportamental: context.perfil_comportamental || userProfile?.perfil_comportamental || undefined,
        insights_performance: context.insights_performance || userProfile?.insights_performance || undefined,
      };

      // Preparar dados para a requisição
      const requestData = {
        mensagem_usuario: enrichedContext.mensagem_usuario,
        user_id: user_id,
        dados_usuario: {
          procedimentos: enrichedContext.procedimentos,
          nivel_digital: "médio" // Valor padrão
        }
      };

      // Chamar a função edge intent-core
      const { data, error } = await supabase.functions.invoke("intent-core", {
        body: requestData,
      });

      if (error) {
        console.error("Erro ao chamar intent-core:", error);
        throw new Error(`Erro ao processar intenção: ${error.message}`);
      }

      // Processar e validar resposta
      const intentResult = data as IntentProcessorResult;
      setResult(intentResult);
      
      return intentResult;
      
    } catch (error) {
      console.error('Erro ao processar intenção:', error);
      toast({
        title: "Erro ao processar intenção",
        description: "Não foi possível analisar sua intenção. Por favor, tente novamente.",
        variant: "destructive"
      });
      
      // Retorna um resultado de erro
      const errorResult: IntentProcessorResult = {
        intencao: "Erro de processamento",
        categoria: "outro",
        direcionamento_estrategico: "educacao",
        acao_recomendada: "support",
        prompt_personalizado: "Desculpe, tivemos um problema ao processar sua solicitação.",
        explicacao: "Ocorreu um erro técnico durante a análise de intenção.",
        proximo_passo: "Oferecer suporte ou sugerir tentar novamente"
      };
      
      setResult(errorResult);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  return {
    processIntent,
    loading,
    result
  };
}

export default useIntentProcessor;
