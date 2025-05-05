
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Star, MessageCircle, Wand2, HeartHandshake, Lightbulb } from "lucide-react";

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
        <span className="font-medium">{value.toFixed(1)}/{maxValue}</span>
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <ScriptMetric 
          label="Gancho Inicial" 
          value={hookScore} 
          icon={<Lightbulb className="h-4 w-4 text-amber-500" />}
          colorClass="bg-amber-500"
        />
        
        <ScriptMetric 
          label="Clareza da Mensagem" 
          value={clarityScore} 
          icon={<MessageCircle className="h-4 w-4 text-green-500" />}
          colorClass="bg-green-500"
        />
        
        <ScriptMetric 
          label="Eficácia do CTA" 
          value={ctaScore} 
          icon={<Wand2 className="h-4 w-4 text-blue-500" />}
          colorClass="bg-blue-500"
        />
        
        <ScriptMetric 
          label="Conexão Emocional" 
          value={emotionalScore} 
          icon={<HeartHandshake className="h-4 w-4 text-red-500" />}
          colorClass="bg-red-500"
        />
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Pontuação Total</h3>
          <div className="flex items-center">
            <span className="text-lg font-bold mr-1">{totalScore.toFixed(1)}</span>
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          </div>
        </div>
        
        <Progress 
          value={(totalScore / 10) * 100} 
          className="h-3 bg-gray-100" 
        />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Precisa melhorar</span>
          <span>Bom</span>
          <span>Excelente</span>
        </div>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="font-medium mb-3">Sugestões de melhoria</h3>
          <ul className="space-y-2 text-sm">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex gap-2">
                <span className="font-medium text-primary">{index + 1}.</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScriptValidationScores;
