
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Award, Check } from "lucide-react";
import { ScriptResponse } from '@/utils/api';

interface ScriptHeaderProps {
  script: ScriptResponse;
  validationScore: number | null;
  isScriptApproved: boolean;
  formatDate: (dateString: string) => string;
}

const ScriptHeader: React.FC<ScriptHeaderProps> = ({
  script,
  validationScore,
  isScriptApproved,
  formatDate
}) => {
  // Get badge color based on script type
  const getBadgeVariant = () => {
    switch (script.type) {
      case "videoScript":
        return "default";
      case "bigIdea":
        return "outline";
      case "dailySales":
        return "secondary";
      default:
        return "default";
    }
  };

  // Get script type label
  const getScriptTypeLabel = () => {
    switch (script.type) {
      case "videoScript":
        return "Roteiro para Seu Vídeo";
      case "bigIdea":
        return "Agenda Criativa";
      case "dailySales":
        return "Ideia para seu Stories";
      default:
        return "Roteiro";
    }
  };

  // Get validation badge color
  const getValidationBadgeColor = (score: number | null) => {
    if (score === null) return "bg-gray-200 text-gray-700";
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-lg md:text-xl font-bold">{script.title}</h2>
        <p className="text-sm text-muted-foreground">
          Criado em {formatDate(script.createdAt)}
        </p>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <Badge variant={getBadgeVariant()}>{getScriptTypeLabel()}</Badge>
        
        {validationScore !== null && (
          <div className={`text-xs px-2 py-1 rounded-md flex items-center ${getValidationBadgeColor(validationScore)}`}>
            <Award className="h-3 w-3 mr-1" />
            Nota IA: {validationScore.toFixed(1)}/10
          </div>
        )}
        
        {isScriptApproved && (
          <Badge variant="success" className="bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Aprovado
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ScriptHeader;
