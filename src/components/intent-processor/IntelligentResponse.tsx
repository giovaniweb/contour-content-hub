
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface IntelligentResponseProps {
  data: {
    intencao: string;
    categoria: string;
    direcionamento_estrategico: string;
    acao_recomendada: string;
    prompt_personalizado: string;
    explicacao: string;
    proximo_passo: string;
  };
}

const IntelligentResponse: React.FC<IntelligentResponseProps> = ({ data }) => {
  const navigate = useNavigate();

  // Function to determine the text for the button based on action
  const getButtonText = (action: string): string => {
    switch (action) {
      case 'script_generator':
        return 'Ver Roteiro';
      case 'content_explorer':
        return 'Explorar Conteúdos';
      case 'marketing_consultant':
        return 'Ver Consultoria';
      case 'scientific_content':
        return 'Ver Artigos Científicos';
      case 'sales_script':
        return 'Ver Script de Vendas';
      case 'custom-gpt':
        return 'Abrir Criativo';
      case 'generate-plan':
        return 'Ver Planejamento';
      case 'generate-content-description':
        return 'Ver Descrição de Conteúdo';
      default:
        return 'Continuar';
    }
  };

  // Function to humanize explanation
  const humanizeExplanation = (explanation: string): string => {
    // Remove technical markers or formatting
    let humanized = explanation
      .replace(/^(Baseado|Com base|Considerando)/i, 'Percebi que')
      .replace(/recomendo|sugiro/i, 'podemos')
      .replace(/você deve|você poderia/i, 'que tal')
      .trim();
      
    // Add motivational elements based on strategic direction
    if (data.direcionamento_estrategico === 'branding') {
      humanized += ' Isso vai fortalecer sua marca e criar uma conexão mais autêntica com seu público!';
    } else if (data.direcionamento_estrategico === 'venda') {
      humanized += ' Isso pode aumentar suas conversões e gerar mais resultados para seu negócio!';
    } else { // educacao
      humanized += ' Compartilhar esse conhecimento vai posicionar você como referência na sua área!';
    }
    
    return humanized;
  };

  // Handle the action click
  const handleActionClick = () => {
    // Navigate to the appropriate page based on the recommended action
    switch (data.acao_recomendada) {
      case 'script_generator':
        navigate('/script-generator', { 
          state: { 
            promptPersonalizado: data.prompt_personalizado
          } 
        });
        break;
      case 'marketing_consultant':
        navigate('/marketing-consultant', {
          state: {
            promptPersonalizado: data.prompt_personalizado
          }
        });
        break;
      case 'content_explorer':
      case 'scientific_content':
        navigate('/content-planner', {
          state: {
            promptPersonalizado: data.prompt_personalizado
          }
        });
        break;
      case 'sales_script':
        navigate('/script-generator', { 
          state: { 
            objective: 'sales',
            promptPersonalizado: data.prompt_personalizado
          } 
        });
        break;
      case 'custom-gpt':
        navigate('/custom-gpt', {
          state: {
            promptPersonalizado: data.prompt_personalizado
          }
        });
        break;
      default:
        navigate('/dashboard', {
          state: {
            promptPersonalizado: data.prompt_personalizado
          }
        });
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
            <p className="text-base">{humanizeExplanation(data.explicacao)}</p>
            <p className="text-sm text-muted-foreground mt-2">{data.proximo_passo}</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleActionClick} 
            className="gap-1 px-4"
          >
            {getButtonText(data.acao_recomendada)}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntelligentResponse;
