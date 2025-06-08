
import React from 'react';
import { Brain, Users, Target, Lightbulb, Zap, CheckCircle } from "lucide-react";

interface PhaseTimelineProps {
  currentPhase: number;
}

const PhaseTimeline: React.FC<PhaseTimelineProps> = ({ currentPhase }) => {
  const phases = [
    {
      icon: Brain,
      title: "Analisando seu perfil clínico",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Users,
      title: "Convocando especialistas",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Target,
      title: "Identificando oportunidades",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: Lightbulb,
      title: "Criando estratégias personalizadas",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: Zap,
      title: "Finalizando diagnóstico",
      color: "text-green-600",
      bgColor: "bg-green-100",
    }
  ];

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-center">Etapas do Diagnóstico</h4>
      <div className="flex justify-between items-center">
        {phases.map((phase, index) => {
          const PhaseIcon = phase.icon;
          const isActive = index === currentPhase;
          const isCompleted = index < currentPhase;
          
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isActive 
                  ? `${phase.bgColor} ${phase.color} animate-pulse scale-110` 
                  : isCompleted 
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <PhaseIcon className="h-4 w-4" />
                )}
              </div>
              <div className="text-xs text-center max-w-16">
                {phase.title.split(' ')[0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseTimeline;
