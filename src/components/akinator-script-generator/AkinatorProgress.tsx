
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface AkinatorProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const AkinatorProgress: React.FC<AkinatorProgressProps> = ({ 
  currentStep, 
  totalSteps = 9 // Valor padrão para compatibilidade
}) => {
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Progresso do Diagnóstico</span>
        <span className="text-sm text-muted-foreground">
          {currentStep + 1} de {totalSteps}
        </span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
};

export default AkinatorProgress;
