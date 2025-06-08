
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Sparkles, Target, Users, TrendingUp, ArrowLeft, ArrowRight, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import MarketingQuestion from './MarketingQuestion';
import MarketingResult from './MarketingResult';
import MarketingDashboard from './MarketingDashboard';
import MarketingConsultantChat from './chat/MarketingConsultantChat';
import { useAkinatorFlow } from './hooks/useAkinatorFlow';
import { getNextValidQuestion, getPreviousValidQuestion, shouldShowQuestion, getCurrentQuestionNumber, getTotalValidQuestions } from './utils/questionNavigation';
import { MARKETING_STEPS } from './constants';
import { MarketingConsultantState } from './types';
import { generateMarketingDiagnostic } from './api/generateMarketingDiagnostic';
import { generateAIMarketingSections } from './api/generateAIMarketingSections';
import { useUserProfile } from '@/hooks/useUserProfile';

const AkinatorMarketingConsultant: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    state,
    setState,
    showResult,
    setShowResult,
    showDashboard,
    setShowDashboard,
    isProcessing,
    setIsProcessing,
    equipments,
    updateClinicType
  } = useAkinatorFlow();

  const { profile } = useUserProfile();
  const [mentor, setMentor] = useState<any>(null);
  const [aiSections, setAiSections] = useState<any>(null);

  // Atualizar o perfil do usuário quando o tipo de clínica for selecionado
  useEffect(() => {
    if (state.clinicType && state.clinicType !== profile?.clinic_type) {
      const clinicType = state.clinicType === 'clinica_medica' ? 'clinica_medica' : 'clinica_estetica';
      updateClinicType(clinicType);
    }
  }, [state.clinicType, profile?.clinic_type, updateClinicType]);

  const handleOptionSelect = async (value: string) => {
    const currentQuestion = MARKETING_STEPS[currentStep];
    
    console.log('Resposta selecionada:', value, 'Step atual:', currentStep);
    
    // Atualizar o estado com a resposta
    const newState = {
      ...state,
      [currentQuestion.key]: value
    };
    
    setState(newState);
    console.log('Estado atualizado:', newState);
    
    // Encontrar a próxima pergunta válida
    const nextStep = getNextValidQuestion(currentStep, newState);
    
    if (nextStep >= MARKETING_STEPS.length) {
      // Chegou ao fim do questionário
      setIsProcessing(true);
      
      try {
        // Gerar diagnóstico usando IA
        toast.loading("Processando seu diagnóstico...", { id: "processing" });
        
        const diagnostic = await generateMarketingDiagnostic(newState);
        const sections = await generateAIMarketingSections(newState);
        
        const finalState = {
          ...newState,
          generatedDiagnostic: diagnostic
        };
        
        setState(finalState);
        setAiSections(sections);
        
        toast.success("Diagnóstico concluído!", { id: "processing" });
        setShowDashboard(true);
      } catch (error) {
        console.error('Erro ao gerar diagnóstico:', error);
        toast.error("Erro ao processar diagnóstico", { id: "processing" });
      } finally {
        setIsProcessing(false);
      }
    } else {
      console.log('Próxima pergunta válida encontrada:', nextStep, MARKETING_STEPS[nextStep]);
      setCurrentStep(nextStep);
      
      toast.success("Resposta salva!", {
        description: "Continuando para a próxima pergunta..."
      });
    }
    
    console.log('Próxima pergunta:', nextStep, MARKETING_STEPS[nextStep]);
  };

  const handleGoBack = () => {
    const previousStep = getPreviousValidQuestion(currentStep, state);
    setCurrentStep(previousStep);
    
    toast.info("Voltando à pergunta anterior", {
      description: "Você pode revisar sua resposta."
    });
  };

  const handleRestart = () => {
    setState({
      clinicType: '',
      medicalSpecialty: '',
      medicalProcedures: '',
      medicalEquipments: '',
      medicalProblems: '',
      medicalTicket: '',
      medicalSalesModel: '',
      medicalObjective: '',
      medicalVideoFrequency: '',
      medicalClinicStyle: '',
      aestheticFocus: '',
      aestheticEquipments: '',
      aestheticProblems: '',
      aestheticSalesModel: '',
      aestheticTicket: '',
      aestheticObjective: '',
      aestheticVideoFrequency: '',
      aestheticClinicStyle: '',
      currentRevenue: '',
      revenueGoal: '',
      targetAudience: '',
      contentFrequency: '',
      communicationStyle: '',
      generatedDiagnostic: ''
    });
    setCurrentStep(0);
    setShowResult(false);
    setShowDashboard(false);
    setMentor(null);
    setAiSections(null);
    
    toast.success("Diagnóstico reiniciado!", {
      description: "Vamos começar um novo diagnóstico."
    });
  };

  const currentQuestion = MARKETING_STEPS[currentStep];
  const totalQuestions = getTotalValidQuestions(state);
  const currentQuestionNumber = getCurrentQuestionNumber(currentStep, state);
  const progress = (currentQuestionNumber / totalQuestions) * 100;

  if (showDashboard) {
    return (
      <MarketingDashboard 
        state={state}
        mentor={mentor}
        aiSections={aiSections}
        onRestart={handleRestart}
      />
    );
  }

  if (showResult) {
    return (
      <MarketingResult 
        state={state}
        onRestart={handleRestart}
        onContinue={() => setShowDashboard(true)}
      />
    );
  }

  if (isProcessing) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-aurora-electric-purple/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-aurora-electric-purple rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="h-8 w-8 text-aurora-electric-purple" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold aurora-heading">
              🧠 Analisando seu perfil...
            </h2>
            <p className="text-xl aurora-body opacity-80">
              O Consultor Fluida está processando suas respostas
            </p>
            <div className="flex justify-center items-center gap-2 text-aurora-electric-purple">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Gerando diagnóstico personalizado</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {currentQuestion && shouldShowQuestion(currentStep, state) ? (
            <MarketingQuestion
              stepData={currentQuestion}
              currentStep={currentStep}
              onOptionSelect={handleOptionSelect}
              onGoBack={handleGoBack}
              canGoBack={currentStep > 0}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-400">Pergunta não disponível</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AkinatorMarketingConsultant;
