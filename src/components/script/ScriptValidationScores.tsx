
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Star, MessageCircle, Wand2, HeartHandshake, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ValidationScores {
  hookScore?: number;
  clarityScore?: number;
  ctaScore?: number;
  emotionalScore?: number;
  totalScore?: number;
}

interface ScriptMetricProps {
  label: string;
  value: number;
  maxValue?: number;
  icon: React.ReactNode;
  colorClass?: string;
}

const ScriptMetric: React.FC<ScriptMetricProps> = ({ 
  label, 
  value, 
  maxValue = 10, 
  icon, 
  colorClass = "bg-blue-500" 
}) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="font-medium">{value.toFixed(1)}</span>
      </div>
      <Progress value={percentage} className={`h-2.5 ${colorClass}`} />
    </div>
  );
};

interface ScriptValidationScoresProps {
  scores: ValidationScores;
  suggestions?: string[];
}

const ScriptValidationScores: React.FC<ScriptValidationScoresProps> = ({ 
  scores,
  suggestions = []
}) => {
  const hookScore = scores.hookScore || 7.5;
  const clarityScore = scores.clarityScore || 8.2;
  const ctaScore = scores.ctaScore || 6.8;
  const emotionalScore = scores.emotionalScore || 7.3;
  const totalScore = scores.totalScore || 
    ((hookScore + clarityScore + ctaScore + emotionalScore) / 4);

  // Get color class based on score
  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 7) return "bg-blue-500"; 
    if (score >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get text color based on score
  const getTextColor = (score: number) => {
    if (score >= 8) return "text-green-700";
    if (score >= 7) return "text-blue-700";
    if (score >= 6) return "text-yellow-700";
    return "text-red-700";
  };

  // Get badge text based on score
  const getScoreBadge = (score: number) => {
    if (score >= 8.5) return "Excelente";
    if (score >= 7.5) return "Muito Bom";
    if (score >= 6.5) return "Bom";
    if (score >= 5.5) return "Regular";
    return "Insuficiente";
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-md">
      <div className="flex flex-col items-start space-y-1 mb-4">
        <h3 className="text-base font-semibold flex items-center">
          <Lightbulb className="h-4 w-4 mr-1 text-blue-500" />
          Validação Inteligente do Roteiro
        </h3>
        <p className="text-sm text-muted-foreground">
          Análise automática da qualidade do roteiro por IA
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Esclareça a Mensagem</div>
          <Progress value={(clarityScore / 10) * 100} className="h-4 bg-yellow-100" />
          <div className="flex justify-between text-sm">
            <span className={getTextColor(clarityScore)}>{clarityScore.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Elovenc da Mensagem</div>
          <Progress value={(hookScore / 10) * 100} className="h-4 bg-green-100" />
          <div className="flex justify-between text-sm">
            <span className={getTextColor(hookScore)}>{hookScore.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Elevenção de CTA</div>
          <Progress value={(ctaScore / 10) * 100} className="h-4 bg-yellow-100" />
          <div className="flex justify-between text-sm">
            <span className={getTextColor(ctaScore)}>{ctaScore.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Criação Conexional</div>
          <Progress value={(emotionalScore / 10) * 100} className="h-4 bg-blue-100" />
          <div className="flex justify-between text-sm">
            <span className={getTextColor(emotionalScore)}>{emotionalScore.toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Pontuação Total</h4>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">
              {totalScore.toFixed(1)}/10
            </span>
            <span className="px-2 py-0.5 bg-yellow-50 text-yellow-800 rounded font-medium text-sm">
              {getScoreBadge(totalScore)}
            </span>
          </div>
        </div>
        <Progress 
          value={(totalScore / 10) * 100} 
          className={`h-3 ${getScoreColor(totalScore)}`} 
        />
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3 flex items-center">
            <Lightbulb className="h-4 w-4 mr-1 text-green-500" />
            Sugestões de Melhoria
          </h4>
          <ul className="space-y-3 text-sm">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="relative pl-5">
                <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex gap-2 mt-4">
            <Button className="bg-green-500 hover:bg-green-600">
              Aprovar e Aplicar Melhorias
            </Button>
            <Button variant="outline">
              Analisar novamente com avançada
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptValidationScores;
