
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { calculateStrategicScore, getScoreExplanation } from '@/utils/calculateStrategicScore';

interface ScoreBreakdownTooltipProps {
  session: DiagnosticSession;
  children: React.ReactNode;
}

const ScoreBreakdownTooltip: React.FC<ScoreBreakdownTooltipProps> = ({ session, children }) => {
  const breakdown = calculateStrategicScore(session);
  const explanations = getScoreExplanation(breakdown);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            {children}
            <Info className="h-4 w-4 text-foreground/40 hover:text-foreground/70 transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Como o Score é Calculado:</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Situação Financeira:</span>
                <span className="font-medium">{breakdown.revenueScore}/25</span>
              </div>
              <div className="flex justify-between">
                <span>Clareza dos Objetivos:</span>
                <span className="font-medium">{breakdown.objectiveScore}/20</span>
              </div>
              <div className="flex justify-between">
                <span>Completude do Perfil:</span>
                <span className="font-medium">{breakdown.completenessScore}/20</span>
              </div>
              <div className="flex justify-between">
                <span>Identificação de Desafios:</span>
                <span className="font-medium">{breakdown.challengeScore}/15</span>
              </div>
              <div className="flex justify-between">
                <span>Estratégia de Comunicação:</span>
                <span className="font-medium">{breakdown.communicationScore}/20</span>
              </div>
            </div>
            
            <div className="border-t pt-3 space-y-1">
              <h5 className="font-medium text-xs">Principais Fatores:</h5>
              {explanations.map((explanation, index) => (
                <p key={index} className="text-xs text-foreground/80">
                  {explanation}
                </p>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ScoreBreakdownTooltip;
