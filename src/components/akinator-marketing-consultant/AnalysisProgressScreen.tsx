
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import { Sparkles, Target, Lightbulb, TrendingUp } from "lucide-react";
import { MarketingConsultantState } from './types';

interface AnalysisProgressScreenProps {
  currentStep: number;
  totalSteps: number;
  state: MarketingConsultantState;
}

const AnalysisProgressScreen: React.FC<AnalysisProgressScreenProps> = ({
  currentStep,
  totalSteps,
  state
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  const analysisSteps = [
    { icon: Target, label: 'Analisando perfil da clínica', delay: 0 },
    { icon: Lightbulb, label: 'Identificando oportunidades', delay: 0.2 },
    { icon: TrendingUp, label: 'Criando estratégias personalizadas', delay: 0.4 },
    { icon: Sparkles, label: 'Finalizando diagnóstico', delay: 0.6 }
  ];

  const getClinicInfo = () => {
    const clinicType = state.clinicType === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética';
    const specialty = state.medicalSpecialty || state.aestheticFocus || '';
    return { clinicType, specialty };
  };

  const { clinicType, specialty } = getClinicInfo();

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Main Loading Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center"
            >
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Analisando seu perfil...
              </h2>
              <p className="text-muted-foreground">
                Criando estratégias personalizadas para sua {clinicType}
                {specialty && ` de ${specialty}`}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {Math.round(progress)}% concluído
              </p>
            </div>

            {/* Analysis Steps */}
            <div className="space-y-4 mt-8">
              {analysisSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.delay }}
                  className="flex items-center space-x-3 text-left"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{step.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Bottom Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="pt-4 border-t"
            >
              <p className="text-xs text-muted-foreground">
                🤖 Nossa IA está analisando suas respostas para criar um plano estratégico exclusivo
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisProgressScreen;
