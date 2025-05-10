
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
      // Em uma implementação real, isso enviaria os dados para uma API ou função edge
      // Por enquanto, vamos simular o processamento baseado em regras simples
      
      const userMessage = context.mensagem_usuario?.toLowerCase() || '';
      let result: IntentProcessorResult;
      
      // Análise baseada em palavras-chave para determinar intenção
      if (userMessage.includes('roteiro') || userMessage.includes('vídeo') || userMessage.includes('gravar')) {
        result = {
          intencao: "Criar roteiro para vídeo",
          categoria: "conteudo",
          direcionamento_estrategico: userMessage.includes('venda') ? 'venda' : 'educacao',
          acao_recomendada: "script_generator",
          prompt_personalizado: `Gere um roteiro para vídeo sobre ${userMessage}, focando em ${context.foco_comunicacao || 'benefícios'} para ${context.procedimentos?.join(', ') || 'tratamentos estéticos'}.`,
          explicacao: "O usuário demonstrou interesse em criar conteúdo em vídeo, que é um dos formatos mais eficientes para comunicação em saúde estética.",
          proximo_passo: "Redirecionar para o gerador de roteiros com o prompt pré-preenchido"
        };
      }
      else if (userMessage.includes('estratégia') || userMessage.includes('plano') || userMessage.includes('marketing')) {
        result = {
          intencao: "Desenvolver estratégia de marketing",
          categoria: "marketing",
          direcionamento_estrategico: "branding",
          acao_recomendada: "marketing_consultant",
          prompt_personalizado: `Desenvolva uma estratégia de marketing para ${context.procedimentos?.join(', ') || 'uma clínica de estética'} focada em ${context.foco_comunicacao || 'diferenciação'}.`,
          explicacao: "O usuário está buscando orientações estratégicas para melhorar seu posicionamento e crescer no mercado.",
          proximo_passo: "Iniciar consultor de marketing com foco em estratégia"
        };
      }
      else if (userMessage.includes('vendas') || userMessage.includes('converter') || userMessage.includes('cliente')) {
        result = {
          intencao: "Aumentar conversão de vendas",
          categoria: "vendas",
          direcionamento_estrategico: "venda",
          acao_recomendada: "sales_script_generator",
          prompt_personalizado: `Crie um script de vendas persuasivo para ${context.procedimentos?.join(', ') || 'tratamentos estéticos'} considerando o perfil ${context.perfil_comportamental?.join(', ') || 'do cliente'}.`,
          explicacao: "O foco do usuário está em converter leads em clientes pagantes, indicando necessidade de material com foco em vendas.",
          proximo_passo: "Apresentar gerador de scripts de vendas com argumentos personalizados"
        };
      }
      else if (userMessage.includes('ciência') || userMessage.includes('estudo') || userMessage.includes('pesquisa')) {
        result = {
          intencao: "Obter embasamento científico",
          categoria: "ciencia",
          direcionamento_estrategico: "educacao",
          acao_recomendada: "scientific_content",
          prompt_personalizado: `Busque estudos científicos relevantes sobre ${context.procedimentos?.join(', ') || 'tratamentos estéticos'} e prepare um resumo com pontos-chave.`,
          explicacao: "O usuário busca fundamentação científica para seus procedimentos, demonstrando interesse em comunicação baseada em evidências.",
          proximo_passo: "Mostrar pesquisas científicas relacionadas aos procedimentos"
        };
      }
      else {
        // Caso padrão quando não conseguimos identificar claramente a intenção
        result = {
          intencao: "Explorar conteúdo",
          categoria: "conteudo",
          direcionamento_estrategico: "educacao",
          acao_recomendada: "content_explorer",
          prompt_personalizado: `Sugira ideias de conteúdo sobre ${context.procedimentos?.join(', ') || 'estética'} no formato ${context.estilo_preferido || 'mais engajante'} para educação do público.`,
          explicacao: "Baseado no histórico do usuário, conteúdo educativo tem sido sua abordagem mais bem-sucedida.",
          proximo_passo: "Apresentar explorador de conteúdo com sugestões personalizadas"
        };
      }
      
      setResult(result);
      return result;
      
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
