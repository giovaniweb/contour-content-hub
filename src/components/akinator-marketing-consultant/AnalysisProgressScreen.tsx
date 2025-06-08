
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Brain, Clock } from "lucide-react";
import { MarketingConsultantState } from './types';
import SpecialistSection from './components/SpecialistSection';
import CurrentPhaseDisplay from './components/CurrentPhaseDisplay';
import PhaseTimeline from './components/PhaseTimeline';

interface AnalysisProgressScreenProps {
  currentStep: number;
  totalSteps: number;
  state?: MarketingConsultantState;
}

const AnalysisProgressScreen: React.FC<AnalysisProgressScreenProps> = ({ 
  currentStep, 
  totalSteps, 
  state 
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const progress = Math.round((currentStep / totalSteps) * 100);

  const phaseDurations = [2000, 2500, 2000, 2500, 2000];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % 5);
    }, phaseDurations[currentPhase] || 2000);

    return () => clearInterval(interval);
  }, [currentPhase]);

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
          <Brain className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Consultor Fluida Analisando</h1>
        <p className="text-muted-foreground">
          Estamos processando seus dados para criar um diagnóstico personalizado
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Progresso da análise</span>
          <span>{currentStep} de {totalSteps} etapas</span>
        </div>
        <Progress value={progress} className="w-full h-3" />
        <div className="text-center text-sm font-medium text-primary">
          {progress}% concluído
        </div>
      </div>

      {/* Current Phase */}
      <CurrentPhaseDisplay currentPhase={currentPhase} />

      {/* Specialists Working */}
      <SpecialistSection state={state} />

      {/* Timeline */}
      <PhaseTimeline currentPhase={currentPhase} />

      {/* Estimated Time */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Tempo estimado: 30-45 segundos</span>
        </div>
        <p className="text-xs text-muted-foreground">
          🎯 Criando estratégias específicas com os melhores especialistas para seu caso
        </p>
      </div>
    </div>
  );
};

export default AnalysisProgressScreen;
