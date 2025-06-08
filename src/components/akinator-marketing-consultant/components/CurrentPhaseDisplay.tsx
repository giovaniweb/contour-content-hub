
import React from 'react';
import { Brain, Users, Target, Lightbulb, Zap } from "lucide-react";

interface CurrentPhaseDisplayProps {
  currentPhase: number;
}

const CurrentPhaseDisplay: React.FC<CurrentPhaseDisplayProps> = ({ currentPhase }) => {
  const phases = [
    {
      icon: Brain,
      title: "Analisando seu perfil clínico",
      description: "A IA Fluida está processando suas respostas...",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Users,
      title: "Convocando especialistas",
      description: "Reunindo mentores estratégicos específicos para seu caso...",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Target,
      title: "Identificando oportunidades",
      description: "Mapeando pontos de crescimento para sua clínica...",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: Lightbulb,
      title: "Criando estratégias personalizadas",
      description: "Desenvolvendo plano específico para seus objetivos...",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: Zap,
      title: "Finalizando diagnóstico",
      description: "Preparando seu relatório completo...",
      color: "text-green-600",
      bgColor: "bg-green-100",
    }
  ];

  const currentPhaseData = phases[currentPhase] || phases[0];
  const PhaseIcon = currentPhaseData.icon;

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${currentPhaseData.bgColor} rounded-full flex items-center justify-center animate-pulse`}>
          <PhaseIcon className={`h-6 w-6 ${currentPhaseData.color}`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${currentPhaseData.color}`}>
            {currentPhaseData.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {currentPhaseData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentPhaseDisplay;
