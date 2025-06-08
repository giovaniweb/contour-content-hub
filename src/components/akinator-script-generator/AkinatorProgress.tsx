
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Brain, Target, Lightbulb, Zap, CheckCircle, Sparkles } from "lucide-react";

interface AkinatorProgressProps {
  currentStep: number;
  totalSteps: number;
}

const AkinatorProgress: React.FC<AkinatorProgressProps> = ({ currentStep, totalSteps }) => {
  const progress = Math.round((currentStep / totalSteps) * 100);
  
  // Mensagens dinâmicas baseadas no progresso
  const getProgressMessage = () => {
    if (progress < 20) {
      return {
        icon: Brain,
        message: "Analisando o perfil da sua clínica...",
        color: "text-blue-600"
      };
    } else if (progress < 40) {
      return {
        icon: Target,
        message: "Identificando oportunidades de crescimento...",
        color: "text-purple-600"
      };
    } else if (progress < 60) {
      return {
        icon: Lightbulb,
        message: "Criando estratégias personalizadas...",
        color: "text-yellow-600"
      };
    } else if (progress < 80) {
      return {
        icon: Zap,
        message: "Gerando plano de ação específico...",
        color: "text-orange-600"
      };
    } else if (progress < 100) {
      return {
        icon: Sparkles,
        message: "Finalizando sua análise completa...",
        color: "text-pink-600"
      };
    } else {
      return {
        icon: CheckCircle,
        message: "Diagnóstico concluído com sucesso!",
        color: "text-green-600"
      };
    }
  };

  const progressInfo = getProgressMessage();
  const ProgressIcon = progressInfo.icon;

  return (
    <div className="w-full space-y-3 mb-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Progresso do diagnóstico</span>
        <span>{currentStep} de {totalSteps}</span>
      </div>
      
      <Progress value={progress} className="w-full h-2" />
      
      <div className={`flex items-center gap-2 text-sm font-medium ${progressInfo.color} animate-fade-in`}>
        <ProgressIcon className="h-4 w-4 animate-pulse" />
        <span>{progressInfo.message}</span>
      </div>
      
      <div className="text-xs text-muted-foreground text-center">
        {progress}% concluído
      </div>
    </div>
  );
};

export default AkinatorProgress;
