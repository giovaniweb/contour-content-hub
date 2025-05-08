
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Star, MessageSquare } from "lucide-react";

interface IdeaEvaluationProps {
  result: {
    evaluation: 'good' | 'needs-work' | 'great';
    suggestions: string[];
    targetAudience: string;
    recommendedPlatforms: string[];
    suggestedFormats: string[];
  };
}

const IdeaEvaluation: React.FC<IdeaEvaluationProps> = ({ result }) => {
  const renderEvaluationIcon = () => {
    switch (result.evaluation) {
      case 'great':
        return <Star className="h-6 w-6 text-yellow-500" />;
      case 'good':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'needs-work':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      default:
        return null;
    }
  };

  const renderEvaluationText = () => {
    switch (result.evaluation) {
      case 'great':
        return "Ideia Excelente!";
      case 'good':
        return "Boa Ideia";
      case 'needs-work':
        return "Precisa de Ajustes";
      default:
        return "";
    }
  };

  const renderEvaluationDescription = () => {
    switch (result.evaluation) {
      case 'great':
        return "Esta ideia tem grande potencial para engajar seu público e gerar resultados.";
      case 'good':
        return "Esta é uma ideia sólida com bom potencial, com algumas melhorias pode ser excelente.";
      case 'needs-work':
        return "Esta ideia precisa de mais desenvolvimento antes de avançar, confira as sugestões abaixo.";
      default:
        return "";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-fluida-pink/10 p-3 rounded-full">
          <MessageSquare className="h-6 w-6 text-fluida-pink" />
        </div>
        <div className="flex-1">
          <div className="bg-fluida-pink/10 rounded-lg rounded-tl-none p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              {renderEvaluationIcon()}
              <h3 className="font-medium text-lg">{renderEvaluationText()}</h3>
            </div>
            <p className="text-muted-foreground">{renderEvaluationDescription()}</p>
          </div>
        </div>
      </div>

      <Card className="border border-fluida-blue/20 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-fluida-blue mb-3">Sugestões para Melhorar</h3>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="inline-block h-5 w-5 rounded-full bg-fluida-blue/10 flex-shrink-0 text-fluida-blue text-center text-xs leading-5">
                      {index + 1}
                    </span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-fluida-blue mb-2">Público-alvo</h3>
                <p className="text-sm">{result.targetAudience}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-fluida-blue mb-2">Plataformas Recomendadas</h3>
                <div className="flex flex-wrap gap-2">
                  {result.recommendedPlatforms.map((platform, index) => (
                    <Badge key={index} variant="outline" className="bg-fluida-blue/5">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-fluida-blue mb-2">Formatos Sugeridos</h3>
                <div className="flex flex-wrap gap-2">
                  {result.suggestedFormats.map((format, index) => (
                    <Badge key={index} variant="outline" className="bg-fluida-pink/5">
                      {format}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IdeaEvaluation;
