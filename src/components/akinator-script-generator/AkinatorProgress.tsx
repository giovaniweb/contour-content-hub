
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { STEPS } from './constants';

interface AkinatorProgressProps {
  currentStep: number;
}

const AkinatorProgress: React.FC<AkinatorProgressProps> = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {STEPS.map((_, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            {index < currentStep ? '✓' : index + 1}
          </div>
        ))}
      </div>
      <div className="text-center">
        <Badge variant="outline">
          Etapa {currentStep + 1} de {STEPS.length}
        </Badge>
      </div>
    </div>
  );
};

export default AkinatorProgress;
