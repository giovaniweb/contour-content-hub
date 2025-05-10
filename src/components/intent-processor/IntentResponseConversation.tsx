
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IntentProcessorResult } from '@/hooks/useIntentProcessor';
import { ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface IntentResponseConversationProps {
  result: IntentProcessorResult;
  onAction: () => void;
}

const IntentResponseConversation: React.FC<IntentResponseConversationProps> = ({
  result,
  onAction
}) => {
  // Função para humanizar a explicação recebida da IA
  const humanizeExplanation = (explanation: string): string => {
    // Remover marcadores técnicos ou formatação que não seja amigável
    let humanized = explanation
      .replace(/^(Baseado|Com base|Considerando)/i, 'Percebi que')
      .replace(/recomendo|sugiro/i, 'podemos')
      .replace(/você deve|você poderia/i, 'que tal')
      .trim();
      
    // Adicionar elementos motivacionais dependendo do direcionamento estratégico
    if (result.direcionamento_estrategico === 'branding') {
      humanized += ' Isso vai fortalecer sua marca e criar uma conexão mais autêntica com seu público!';
    } else if (result.direcionamento_estrategico === 'venda') {
      humanized += ' Isso pode aumentar suas conversões e gerar mais resultados para seu negócio!';
    } else { // educacao
      humanized += ' Compartilhar esse conhecimento vai posicionar você como referência na sua área!';
    }
    
    return humanized;
  };

  // Função para obter resposta naturalizada com base no tipo de ação
  const getNaturalizedResponse = (action: string): string => {
    switch (action) {
      case 'script_generator':
        return "Vamos transformar sua ideia em um vídeo poderoso. Preparei um roteiro com o estilo que mais combina com você, pronto para ser ajustado e publicado.";
      case 'custom-gpt':
        return "Ótimo ponto! Aqui está um conteúdo feito sob medida para você usar em postagens, emails ou legendas. Simples, direto e com a sua cara.";
      case 'generate-plan':
      case 'content_explorer':
        return "Você quer clareza e direção? Acabei de montar um plano com ideias organizadas para sua clínica crescer com consistência. Bora colocar em prática?";
      case 'scientific_content':
        return "Encontrei um artigo que responde exatamente ao que você está procurando. Ele é confiável, recente e direto ao ponto. Vale a leitura.";
      case 'generate-content-description':
        return "Vamos atrair mais pacientes? Preparei uma ideia de criativo com foco em conversão rápida. Pode usar direto em campanhas ou adaptar pro seu estilo.";
      case 'validate-script':
        return "Analisei seu conteúdo com olhos de especialista. Aqui está o que ficou ótimo e o que pode ser ajustado pra gerar ainda mais resultado.";
      case 'improve-script':
        return "Seu conteúdo já é bom — agora ficou excelente. Ajustei o tom, o CTA e a fluidez pra deixar tudo no ponto certo.";
      case 'sales_script':
        return "Notei que você está explorando bastante conteúdos sobre este tema. Um equipamento como este pode turbinar ainda mais seus resultados. Quer ver mais sobre ele?";
      case 'marketing_consultant':
        return "Vamos melhorar sua estratégia de marketing? Preparei algumas dicas práticas baseadas na sua situação atual. Vamos implementar juntos?";
      default:
        return humanizeExplanation(result.explicacao);
    }
  };

  // Função para determinar o texto do botão baseado na ação recomendada
  const getButtonText = (action: string): string => {
    switch (action) {
      case 'script_generator':
        return 'Criar roteiro';
      case 'content_explorer':
        return 'Explorar conteúdos';
      case 'marketing_consultant':
        return 'Consultor de marketing';
      case 'scientific_content':
        return 'Ver pesquisas científicas';
      case 'sales_script':
        return 'Criar script de vendas';
      case 'custom-gpt':
        return 'Criar conteúdo';
      case 'generate-plan':
        return 'Ver plano estratégico';
      case 'generate-content-description':
        return 'Ver ideia de criativo';
      case 'validate-script':
        return 'Ver análise';
      case 'improve-script':
        return 'Ver conteúdo refinado';
      default:
        return 'Continuar';
    }
  };

  return (
    <Card className="shadow-sm border-0 bg-transparent">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-6">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" alt="Fluida AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="bg-muted p-4 rounded-lg rounded-tl-none max-w-[90%]">
            <p className="text-base">{getNaturalizedResponse(result.acao_recomendada)}</p>
            <p className="text-sm text-muted-foreground mt-2">{result.proximo_passo}</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={onAction} 
            className="gap-1 px-4"
          >
            {getButtonText(result.acao_recomendada)}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntentResponseConversation;
