
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserEquipments } from "@/hooks/useUserEquipments";
import MarketingQuestion from './MarketingQuestion';
import MarketingResult from './MarketingResult';
import AnalysisProgressScreen from './AnalysisProgressScreen';
import { MARKETING_STEPS } from './constants';
import { MarketingConsultantState, MarketingStep } from './types';

const AkinatorMarketingConsultant: React.FC = () => {
  const { toast } = useToast();
  const { equipments, loading: equipmentsLoading } = useUserEquipments();
  
  const [state, setState] = useState<MarketingConsultantState>({
    currentStep: 0,
    isComplete: false
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [steps, setSteps] = useState<MarketingStep[]>([]);

  // Initialize steps with real equipment data
  useEffect(() => {
    if (!equipmentsLoading && equipments.length > 0) {
      const updatedSteps = MARKETING_STEPS.map(step => {
        if (step.id === 'aestheticEquipments') {
          return {
            ...step,
            options: equipments.map(equipment => ({
              value: equipment.id,
              label: equipment.nome
            }))
          };
        }
        return step;
      });
      setSteps(updatedSteps);
    } else if (!equipmentsLoading) {
      setSteps(MARKETING_STEPS);
    }
  }, [equipments, equipmentsLoading]);

  const currentStepData = getCurrentStep();
  const progress = ((state.currentStep + 1) / steps.length) * 100;

  function getCurrentStep(): MarketingStep | null {
    if (steps.length === 0) return null;
    
    const step = steps[state.currentStep];
    if (!step) return null;

    // Check conditions for conditional steps
    if (step.condition) {
      if (step.condition === 'clinica_medica' && state.clinicType !== 'clinica_medica') {
        return getNextValidStep();
      }
      if (step.condition === 'clinica_estetica' && state.clinicType !== 'clinica_estetica') {
        return getNextValidStep();
      }
    }

    return step;
  }

  function getNextValidStep(): MarketingStep | null {
    let nextIndex = state.currentStep + 1;
    
    while (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      
      if (!nextStep.condition) {
        setState(prev => ({ ...prev, currentStep: nextIndex }));
        return nextStep;
      }
      
      if (nextStep.condition === 'clinica_medica' && state.clinicType === 'clinica_medica') {
        setState(prev => ({ ...prev, currentStep: nextIndex }));
        return nextStep;
      }
      
      if (nextStep.condition === 'clinica_estetica' && state.clinicType === 'clinica_estetica') {
        setState(prev => ({ ...prev, currentStep: nextIndex }));
        return nextStep;
      }
      
      nextIndex++;
    }
    
    return null;
  }

  const handleOptionSelect = (value: string) => {
    const stepId = currentStepData?.id;
    if (!stepId) return;

    const newState = { ...state, [stepId]: value };
    setState(newState);

    // Check if this is the last question
    if (state.currentStep >= steps.length - 1) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setState(prev => ({ ...prev, isComplete: true }));
        setIsAnalyzing(false);
        
        toast({
          title: "🎯 Diagnóstico completo!",
          description: "Seu plano estratégico está pronto!"
        });
      }, 3000);
    } else {
      const nextStep = getNextValidStep();
      if (!nextStep) {
        // No more valid steps, complete the process
        setIsAnalyzing(true);
        setTimeout(() => {
          setState(prev => ({ ...prev, isComplete: true }));
          setIsAnalyzing(false);
          
          toast({
            title: "🎯 Diagnóstico completo!",
            description: "Seu plano estratégico está pronto!"
          });
        }, 3000);
      }
    }
  };

  const handleGoBack = () => {
    if (state.currentStep > 0) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const handleRestart = () => {
    setState({
      currentStep: 0,
      isComplete: false
    });
    setIsAnalyzing(false);
  };

  if (equipmentsLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-5 w-5 animate-spin text-primary" />
            <span>Carregando equipamentos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (steps.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Nenhum equipamento encontrado. Configure seus equipamentos primeiro.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return <AnalysisProgressScreen />;
  }

  if (state.isComplete) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <Sparkles className="h-3 w-3 mr-1" />
            Diagnóstico Completo
          </Badge>
          <Button onClick={handleRestart} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Novo Diagnóstico
          </Button>
        </div>
        <MarketingResult consultantData={state} equipments={equipments} />
      </div>
    );
  }

  if (!currentStepData) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Erro ao carregar pergunta. Tente reiniciar.</p>
            <Button onClick={handleRestart} className="mt-4">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Consultor Fluida</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Pergunta {state.currentStep + 1} de {steps.length}
              </p>
            </div>
            <Badge variant="outline">
              {Math.round(progress)}% completo
            </Badge>
          </div>
          <Progress value={progress} className="mt-3" />
        </CardHeader>
      </Card>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <MarketingQuestion
            stepData={currentStepData}
            currentStep={state.currentStep}
            onOptionSelect={handleOptionSelect}
            onGoBack={handleGoBack}
            canGoBack={state.currentStep > 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AkinatorMarketingConsultant;
