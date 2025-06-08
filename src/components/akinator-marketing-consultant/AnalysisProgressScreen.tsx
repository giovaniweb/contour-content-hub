
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Brain, Users, Target, Lightbulb, Zap, CheckCircle, Sparkles, Clock } from "lucide-react";
import { MarketingConsultantState } from './types';
import { MARKETING_MENTORS } from './mentorInference';

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
      title: "Convocando especialistas",
      description: "Reunindo mentores estratégicos específicos para seu caso...",
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

  // Função para obter especialistas relevantes baseados no perfil
  const getRelevantSpecialists = (): Array<{name: string; specialty: string; reason: string; status: string}> => {
    if (!state) {
      return [
        { name: "Leandro Ladeira", specialty: "Conversão", reason: "para otimizar captação de leads", status: "analisando" },
        { name: "Ícaro de Carvalho", specialty: "Storytelling", reason: "para construir autoridade", status: "avaliando" },
        { name: "Paulo Cuenca", specialty: "Criatividade", reason: "para diferenciação visual", status: "estrategizando" },
        { name: "Camila Porto", specialty: "Digital", reason: "para estruturação inicial", status: "planejando" }
      ];
    }

    const specialists = [];
    
    // Especialista em conversão - sempre relevante para captação
    if (state.paidTraffic === 'nunca_usei' || state.clinicType === 'clinica_estetica') {
      specialists.push({
        name: "Leandro Ladeira",
        specialty: "Conversão e Tráfego Pago",
        reason: state.paidTraffic === 'nunca_usei' 
          ? "pois você precisa estruturar captação de leads"
          : "para otimizar suas campanhas de conversão",
        status: "analisando seu funil"
      });
    }

    // Especialista em storytelling - para autoridade
    if (state.personalBrand === 'nunca' || state.personalBrand === 'raramente' || state.clinicType === 'clinica_medica') {
      specialists.push({
        name: "Ícaro de Carvalho",
        specialty: "Storytelling e Autoridade",
        reason: state.personalBrand === 'nunca' 
          ? "pois você precisa construir sua marca pessoal"
          : "para fortalecer seu posicionamento como autoridade",
        status: "avaliando narrativa"
      });
    }

    // Especialista em criatividade - para diferenciação
    if (state.clinicPosition === 'moderna' || state.clinicType === 'clinica_estetica') {
      specialists.push({
        name: "Paulo Cuenca",
        specialty: "Criatividade Visual",
        reason: state.clinicPosition === 'moderna'
          ? "pois você precisa de diferenciação criativa moderna"
          : "para destacar transformações visuais",
        status: "estrategizando visual"
      });
    }

    // Especialista digital - para iniciantes
    if (state.contentFrequency === 'irregular' || state.personalBrand === 'nunca') {
      specialists.push({
        name: "Camila Porto",
        specialty: "Marketing Digital Estruturado",
        reason: "pois você precisa organizar sua presença digital",
        status: "planejando cronograma"
      });
    }

    // Garantir pelo menos 4 especialistas
    while (specialists.length < 4) {
      const remaining = [
        { name: "Hyeser Souza", specialty: "Engajamento Orgânico", reason: "para aumentar alcance natural", status: "idealizando trends" },
        { name: "Washington Olivetto", specialty: "Big Ideas", reason: "para conceitos memoráveis", status: "conceptualizando" },
        { name: "Pedro Sobral", specialty: "Performance ROI", reason: "para métricas estruturadas", status: "calculando ROI" }
      ];
      
      specialists.push(remaining[specialists.length - 1]);
    }

    return specialists.slice(0, 4);
  };

  const specialists = getRelevantSpecialists();

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

      {/* Specialists Working */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-5 w-5 text-purple-600" />
          <h4 className="font-medium text-purple-900">Especialistas Convocados Para Seu Caso</h4>
        </div>
        
        <div className="space-y-3">
          {specialists.map((specialist, index) => (
            <div key={specialist.name} className="bg-white/60 rounded-lg p-3 border border-purple-100">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-purple-900">{specialist.name}</span>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {specialist.specialty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>{specialist.reason}</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    Status: {specialist.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-purple-600 font-medium">
            ✨ Cada especialista foi selecionado baseado no seu perfil específico
          </p>
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
          🎯 Criando estratégias específicas com os melhores especialistas para seu caso
        </p>
      </div>
    </div>
  );
};

export default AnalysisProgressScreen;
