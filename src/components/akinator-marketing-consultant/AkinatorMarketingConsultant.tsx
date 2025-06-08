
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
        if (step.id === 'aestheticEquipments' || step.id === 'medicalEquipments') {
          return {
            ...step,
            options: [
              ...equipments.map(equipment => ({
                value: equipment.id,
                label: equipment.nome
              })),
              { value: 'sem_equipamentos', label: 'Não uso equipamentos tecnológicos' },
              { value: 'outros', label: 'Outros' }
            ]
          };
        }
        return step;
      });
      setSteps(updatedSteps);
    } else if (!equipmentsLoading) {
      setSteps(MARKETING_STEPS);
    }
  }, [equipments, equipmentsLoading]);

  const getCurrentStep = (): MarketingStep | null => {
    if (steps.length === 0) return null;
    
    const step = steps[state.currentStep];
    if (!step) return null;

    // Check conditions for conditional steps
    if (step.condition) {
      if (step.condition === 'clinica_medica' && state.clinicType !== 'clinica_medica') {
        return null; // Step should be skipped
      }
      if (step.condition === 'clinica_estetica' && state.clinicType !== 'clinica_estetica') {
        return null; // Step should be skipped
      }
    }

    return step;
  };

  const findNextValidStepIndex = (currentIndex: number, clinicType?: string): number => {
    let nextIndex = currentIndex + 1;
    
    // Use the clinic type from the current state or the passed parameter
    const currentClinicType = clinicType || state.clinicType;
    
    while (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      
      // If no condition, step is always valid
      if (!nextStep.condition) {
        return nextIndex;
      }
      
      // Check if step matches the clinic type
      if (nextStep.condition === 'clinica_medica' && currentClinicType === 'clinica_medica') {
        return nextIndex;
      }
      
      if (nextStep.condition === 'clinica_estetica' && currentClinicType === 'clinica_estetica') {
        return nextIndex;
      }
      
      nextIndex++;
    }
    
    return -1; // No more valid steps
  };

  const findPreviousValidStepIndex = (currentIndex: number): number => {
    let prevIndex = currentIndex - 1;
    
    while (prevIndex >= 0) {
      const prevStep = steps[prevIndex];
      
      // If no condition, step is always valid
      if (!prevStep.condition) {
        return prevIndex;
      }
      
      // Check if step matches the clinic type
      if (prevStep.condition === 'clinica_medica' && state.clinicType === 'clinica_medica') {
        return prevIndex;
      }
      
      if (prevStep.condition === 'clinica_estetica' && state.clinicType === 'clinica_estetica') {
        return prevIndex;
      }
      
      prevIndex--;
    }
    
    return 0; // Return to first step if no valid previous step
  };

  const currentStepData = getCurrentStep();
  const progress = steps.length > 0 ? ((state.currentStep + 1) / steps.length) * 100 : 0;

  const handleOptionSelect = (value: string) => {
    const stepId = currentStepData?.id;
    if (!stepId) return;

    console.log('Option selected:', { stepId, value, currentStep: state.currentStep });

    // Handle "outros" option for equipment questions
    if ((stepId === 'medicalEquipments' || stepId === 'aestheticEquipments') && value === 'outros') {
      // This will be handled by the MarketingQuestion component with an open field
      const customEquipment = prompt('Digite o nome do equipamento:');
      if (customEquipment && customEquipment.trim()) {
        value = customEquipment.trim();
      } else {
        return; // Don't proceed if user cancelled or entered empty value
      }
    }

    const newState = { ...state, [stepId]: value };

    // Special handling for clinic type selection
    let nextStepIndex: number;
    if (stepId === 'clinicType') {
      // When selecting clinic type, pass it to find the next valid step
      nextStepIndex = findNextValidStepIndex(state.currentStep, value);
    } else {
      // For other steps, use current state
      nextStepIndex = findNextValidStepIndex(state.currentStep);
    }
    
    if (nextStepIndex === -1) {
      // No more valid steps, complete the process
      console.log('No more steps, completing process');
      setState({ ...newState, isComplete: false });
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
      // Move to next step
      console.log('Moving to next step:', nextStepIndex);
      setState({ ...newState, currentStep: nextStepIndex });
    }
  };

  const handleGoBack = () => {
    if (state.currentStep > 0) {
      const prevIndex = findPreviousValidStepIndex(state.currentStep);
      setState(prev => ({ ...prev, currentStep: prevIndex }));
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
    return (
      <AnalysisProgressScreen 
        currentStep={state.currentStep} 
        totalSteps={steps.length}
        state={state}
      />
    );
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

  // Auto-advance if current step should be skipped
  if (!currentStepData) {
    const nextStepIndex = findNextValidStepIndex(state.currentStep);
    if (nextStepIndex !== -1) {
      // Auto-advance to next valid step
      setTimeout(() => {
        setState(prev => ({ ...prev, currentStep: nextStepIndex }));
      }, 0);
      return null; // Will re-render with new step
    } else {
      // No more steps, complete
      setTimeout(() => {
        setIsAnalyzing(true);
        setTimeout(() => {
          setState(prev => ({ ...prev, isComplete: true }));
          setIsAnalyzing(false);
          
          toast({
            title: "🎯 Diagnóstico completo!",
            description: "Seu plano estratégico está pronto!"
          });
        }, 1000);
      }, 0);
      return null;
    }
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
