
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Brain, Users, Target, Lightbulb, Zap, CheckCircle, Sparkles, Clock } from "lucide-react";

interface AnalysisProgressScreenProps {
  currentStep: number;
  totalSteps: number;
}

const AnalysisProgressScreen: React.FC<AnalysisProgressScreenProps> = ({ currentStep, totalSteps }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const progress = Math.round((currentStep / totalSteps) * 100);

  const phases = [
    {
      icon: Brain,
      title: "Analisando seu perfil clínico",
      description: "A IA Fluida está processando suas respostas...",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      duration: 2000
    },
    {
      icon: Users,
      title: "Mentores em reunião estratégica",
      description: "Especialistas estão avaliando seu caso específico...",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      duration: 2500
    },
    {
      icon: Target,
      title: "Identificando oportunidades",
      description: "Mapeando pontos de crescimento para sua clínica...",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      duration: 2000
    },
    {
      icon: Lightbulb,
      title: "Criando estratégias personalizadas",
      description: "Desenvolvendo plano específico para seus objetivos...",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      duration: 2500
    },
    {
      icon: Zap,
      title: "Finalizando diagnóstico",
      description: "Preparando seu relatório completo...",
      color: "text-green-600",
      bgColor: "bg-green-100",
      duration: 2000
    }
  ];

  const currentPhaseData = phases[currentPhase] || phases[0];
  const PhaseIcon = currentPhaseData.icon;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % phases.length);
    }, currentPhaseData.duration);

    return () => clearInterval(interval);
  }, [currentPhase, currentPhaseData.duration]);

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

      {/* Mentors Working */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-5 w-5 text-purple-600" />
          <h4 className="font-medium text-purple-900">Mentores Estratégicos Ativos</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "Leandro Ladeira", specialty: "Conversão", status: "analisando" },
            { name: "Ícaro de Carvalho", specialty: "Storytelling", status: "avaliando" },
            { name: "Paulo Cuenca", specialty: "Criatividade", status: "estrategizando" },
            { name: "Camila Porto", specialty: "Digital", status: "planejando" }
          ].map((mentor, index) => (
            <div key={mentor.name} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{mentor.name}</span>
              <span className="text-muted-foreground">• {mentor.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
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

      {/* Estimated Time */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Tempo estimado: 30-45 segundos</span>
        </div>
        <p className="text-xs text-muted-foreground">
          ✨ Criando uma análise única baseada no seu perfil específico
        </p>
      </div>
    </div>
  );
};

export default AnalysisProgressScreen;
