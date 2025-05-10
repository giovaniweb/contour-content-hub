
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
            <p className="text-base">{humanizeExplanation(result.explicacao)}</p>
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
