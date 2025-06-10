import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Sparkles, Target, Users, TrendingUp, ArrowLeft, ArrowRight, RotateCcw, Loader2, AlertTriangle, Save, History, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import MarketingQuestion from './MarketingQuestion';
import MarketingResult from './MarketingResult';
import MarketingDashboard from './MarketingDashboard';
import LoadingMessages from './dashboard/LoadingMessages';
import { useAkinatorFlow } from './hooks/useAkinatorFlow';
import { useAIDiagnostic } from '@/hooks/useAIDiagnostic';
import { useDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence';
import { getNextValidQuestion, getPreviousValidQuestion, shouldShowQuestion, getCurrentQuestionNumber, getTotalValidQuestions } from './utils/questionNavigation';
import { MARKETING_STEPS } from './constants';
import { MarketingConsultantState } from './types';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AkinatorMarketingConsultantProps {
  forceNew?: boolean;
}

const AkinatorMarketingConsultant: React.FC<AkinatorMarketingConsultantProps> = ({ forceNew = false }) => {
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
  const { generateDiagnostic, isGenerating } = useAIDiagnostic();
  const { 
    currentSession, 
    saveCurrentSession, 
    clearCurrentSession, 
    loadCurrentSession,
    hasCurrentSession,
    isSessionCompleted,
    isLoading: isDiagnosticLoading
  } = useDiagnosticPersistence();

  const [mentor, setMentor] = useState<any>(null);
  const [aiSections, setAiSections] = useState<any>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [hasLoadedSavedData, setHasLoadedSavedData] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Carregar dados salvos ao inicializar (apenas se não forçar novo)
  useEffect(() => {
    if (!hasLoadedSavedData && !isDiagnosticLoading) {
      if (forceNew) {
        // Se forçar novo diagnóstico, limpar dados salvos e começar do zero
        console.log('🔄 Forçando novo diagnóstico - limpando dados salvos');
        clearCurrentSession();
        setHasLoadedSavedData(true);
        
        toast.success("🆕 Novo diagnóstico iniciado!", {
          description: "Vamos começar do zero"
        });
      } else {
        const saved = loadCurrentSession();
        if (saved && saved.isCompleted) {
          console.log('📂 Carregando diagnóstico salvo completo');
          setState(saved.state);
          setShowDashboard(true);
          
          toast.success("📂 Diagnóstico anterior carregado!", {
            description: `Diagnóstico de ${new Date(saved.timestamp).toLocaleString('pt-BR')}`
          });
        } else if (saved && !saved.isCompleted) {
          console.log('📂 Carregando sessão em progresso');
          setState(saved.state);
          
          // Encontrar a próxima pergunta válida baseada no estado salvo
          let nextStep = 0;
          for (let i = 0; i < MARKETING_STEPS.length; i++) {
            const question = MARKETING_STEPS[i];
            if (!saved.state[question.id as keyof MarketingConsultantState]) {
              nextStep = i;
              break;
            }
          }
          setCurrentStep(nextStep);
          
          toast.success("📂 Sessão anterior recuperada!", {
            description: "Continuando de onde você parou"
          });
        }
        setHasLoadedSavedData(true);
      }
    }
  }, [hasLoadedSavedData, isDiagnosticLoading, loadCurrentSession, setState, setCurrentStep, setShowDashboard, forceNew, clearCurrentSession]);

  // Atualizar o perfil do usuário quando o tipo de clínica for selecionado
  useEffect(() => {
    if (state.clinicType && state.clinicType !== profile?.clinic_type) {
      const clinicType = state.clinicType === 'clinica_medica' ? 'clinica_medica' : 'clinica_estetica';
      updateClinicType(clinicType);
    }
  }, [state.clinicType, profile?.clinic_type, updateClinicType]);

  // Salvar automaticamente o progresso a cada alteração no estado (apenas se não forçar novo)
  useEffect(() => {
    if (hasLoadedSavedData && !forceNew && Object.keys(state).some(key => state[key as keyof MarketingConsultantState])) {
      const syncData = async () => {
        setIsSyncing(true);
        try {
          await saveCurrentSession(state, showDashboard);
          console.log('💾 Progresso sincronizado com banco');
        } catch (error) {
          console.error('❌ Erro na sincronização:', error);
        } finally {
          setIsSyncing(false);
        }
      };
      
      syncData();
    }
  }, [state, showDashboard, hasLoadedSavedData, saveCurrentSession, forceNew]);

  const handleOptionSelect = async (value: string) => {
    const currentQuestion = MARKETING_STEPS[currentStep];
    
    console.log('🟢 INÍCIO handleOptionSelect');
    console.log('🔵 Resposta selecionada:', value);
    console.log('🔵 Step atual:', currentStep);
    console.log('🔵 Pergunta atual:', currentQuestion);
    console.log('🔵 Estado atual antes da atualização:', state);
    
    // Atualizar o estado com a resposta usando o ID da pergunta
    const newState = {
      ...state,
      [currentQuestion.id]: value
    };
    
    setState(newState);
    console.log('🟡 Estado atualizado:', newState);
    
    // Encontrar a próxima pergunta válida
    const nextStep = getNextValidQuestion(currentStep, newState);
    console.log('🟡 Próximo step calculado:', nextStep);
    console.log('🟡 Total steps disponíveis:', MARKETING_STEPS.length);
    
    if (nextStep >= MARKETING_STEPS.length) {
      // Chegou ao fim do questionário
      console.log('🔴 FIM DO QUESTIONÁRIO DETECTADO - iniciando processamento');
      setIsProcessing(true);
      setProcessingError(null);
      
      try {
        // Gerar diagnóstico usando IA via hook
        console.log('🟣 Chamando generateDiagnostic via hook com estado:', newState);
        
        const diagnostic = await generateDiagnostic(newState);
        console.log('🟣 Diagnóstico recebido:', diagnostic);
        
        if (diagnostic) {
          const finalState = {
            ...newState,
            generatedDiagnostic: diagnostic
          };
          
          setState(finalState);
          
          // Salvar diagnóstico completo no banco
          await saveCurrentSession(finalState, true);
          
          console.log('🟢 Processamento concluído - redirecionando para dashboard');
          
          // Garantir redirecionamento para dashboard
          setTimeout(() => {
            setShowDashboard(true);
            setIsProcessing(false);
          }, 1000);
          
          toast.success("✅ Diagnóstico concluído!", {
            description: "Redirecionando para o dashboard..."
          });
        } else {
          throw new Error('Diagnóstico não foi gerado');
        }
        
      } catch (error) {
        console.error('🔴 ERRO no processamento:', error);
        setProcessingError('Erro ao processar diagnóstico com IA');
        
        // Permitir continuar mesmo com erro na API
        const finalState = {
          ...newState,
          generatedDiagnostic: 'Diagnóstico temporariamente indisponível. Suas respostas foram salvas e você pode visualizar as recomendações básicas.'
        };
        
        setState(finalState);
        await saveCurrentSession(finalState, true);
        
        // Forçar redirecionamento para dashboard mesmo com erro
        console.log('🟡 Forçando redirecionamento para dashboard após erro');
        setTimeout(() => {
          setShowDashboard(true);
          setIsProcessing(false);
        }, 2000);
        
        toast.warning("Diagnóstico salvo!", {
          description: "Indo para o dashboard com suas respostas..."
        });
      }
    } else {
      console.log('🟢 Navegando para próxima pergunta:', nextStep, MARKETING_STEPS[nextStep]);
      setCurrentStep(nextStep);
      
      toast.success("Resposta salva!", {
        description: "Progresso sincronizado automaticamente"
      });
    }
    
    console.log('🟢 FIM handleOptionSelect');
  };

  const handleGoBack = () => {
    const previousStep = getPreviousValidQuestion(currentStep, state);
    console.log('⬅️ Voltando para step:', previousStep);
    setCurrentStep(previousStep);
    
    toast.info("Voltando à pergunta anterior", {
      description: "Você pode revisar sua resposta."
    });
  };

  const handleRestart = async () => {
    console.log('🔄 Reiniciando diagnóstico...');
    
    // Limpar dados salvos
    await clearCurrentSession();
    
    setState({
      clinicType: '',
      medicalSpecialty: '',
      medicalProcedures: '',
      medicalEquipments: '',
      medicalBestSeller: '',
      medicalTicket: '',
      medicalSalesModel: '',
      medicalObjective: '',
      medicalContentFrequency: '',
      medicalClinicStyle: '',
      aestheticFocus: '',
      aestheticEquipments: '',
      aestheticBestSeller: '',
      aestheticSalesModel: '',
      aestheticTicket: '',
      aestheticObjective: '',
      aestheticContentFrequency: '',
      aestheticClinicStyle: '',
      currentRevenue: '',
      revenueGoal: '',
      targetAudience: '',
      contentFrequency: '',
      communicationStyle: '',
      mainChallenges: '',
      generatedDiagnostic: ''
    });
    setCurrentStep(0);
    setShowResult(false);
    setShowDashboard(false);
    setMentor(null);
    setAiSections(null);
    setProcessingError(null);
    setHasLoadedSavedData(true);
    
    toast.success("Diagnóstico reiniciado!", {
      description: "Vamos começar um novo diagnóstico."
    });
  };

  const handleContinueWithoutAI = async () => {
    const finalState = {
      ...state,
      generatedDiagnostic: 'Modo básico: Suas respostas foram processadas localmente.'
    };
    
    setState(finalState);
    await saveCurrentSession(finalState, true);
    
    // Garantir redirecionamento
    setTimeout(() => {
      setShowDashboard(true);
      setIsProcessing(false);
    }, 500);
    
    toast.success("Continuando com diagnóstico básico", {
      description: "Redirecionando para dashboard..."
    });
  };

  const currentQuestion = MARKETING_STEPS[currentStep];
  const totalQuestions = getTotalValidQuestions(state);
  const currentQuestionNumber = getCurrentQuestionNumber(currentStep, state);
  const progress = (currentQuestionNumber / totalQuestions) * 100;

  // Debug logs detalhados
  console.log('🔍 RENDERIZAÇÃO PRINCIPAL:');
  console.log('🔹 currentStep:', currentStep);
  console.log('🔹 currentQuestion:', currentQuestion);
  console.log('🔹 shouldShow:', currentQuestion ? shouldShowQuestion(currentStep, state) : false);
  console.log('🔹 state:', state);
  console.log('🔹 showDashboard:', showDashboard);
  console.log('🔹 showResult:', showResult);
  console.log('🔹 isProcessing:', isProcessing);
  console.log('🔹 isGenerating:', isGenerating);
  console.log('🔹 hasCurrentSession:', hasCurrentSession());
  console.log('🔹 forceNew:', forceNew);

  if (showDashboard) {
    console.log('📊 Renderizando Dashboard');
    
    // Validação de segurança antes de renderizar o dashboard
    const safeState = {
      ...state,
      generatedDiagnostic: state.generatedDiagnostic || 'Diagnóstico em processamento...'
    };
    
    const safeMentor = mentor || null;
    const safeAiSections = aiSections || null;
    
    console.log('📊 Dashboard - dados seguros:', { safeState, safeMentor, safeAiSections });
    
    return (
      <MarketingDashboard 
        state={safeState}
        mentor={safeMentor}
        aiSections={safeAiSections}
        onRestart={handleRestart}
        onStateUpdate={setState}
      />
    );
  }

  if (showResult) {
    console.log('📋 Renderizando Result');
    return (
      <MarketingResult 
        onRestart={handleRestart}
        onContinue={() => setShowDashboard(true)}
      />
    );
  }

  if (isProcessing || isGenerating) {
    console.log('⏳ Renderizando Processing com LoadingMessages');
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <LoadingMessages isLoading={true} />
        
        {processingError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 max-w-md mx-auto mt-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-medium text-yellow-600">IA Temporariamente Indisponível</h3>
            </div>
            <p className="text-sm text-yellow-700 mb-4">
              Não foi possível processar seu diagnóstico com IA, mas você pode continuar e ver as recomendações básicas baseadas em suas respostas.
            </p>
            <Button 
              onClick={handleContinueWithoutAI}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Continuar com Diagnóstico Básico
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  // Verificar se a pergunta atual é válida
  if (!currentQuestion) {
    console.error('❌ Pergunta não encontrada para step:', currentStep);
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-400">Erro: Pergunta não encontrada</p>
        <Button onClick={handleRestart} className="mt-4">
          Reiniciar Diagnóstico
        </Button>
      </div>
    );
  }

  if (!shouldShowQuestion(currentStep, state)) {
    console.log('⏭️ Pergunta não deve ser mostrada, buscando próxima...');
    // Se a pergunta atual não deve ser mostrada, navegar automaticamente
    const nextValidStep = getNextValidQuestion(currentStep, state);
    console.log('⏭️ Próximo step válido encontrado:', nextValidStep);
    
    if (nextValidStep < MARKETING_STEPS.length && nextValidStep !== currentStep) {
      console.log('⏭️ Navegando automaticamente para:', nextValidStep);
      setTimeout(() => setCurrentStep(nextValidStep), 100);
    } else {
      console.log('🏁 Chegamos ao fim automaticamente');
    }
    
    return (
      <div className="text-center py-12">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando próxima pergunta...</span>
        </div>
      </div>
    );
  }

  console.log('✅ Renderizando pergunta normalmente');

  return (
    <div className="container mx-auto max-w-6xl py-6">
      {/* Indicador de progresso salvo e sincronização (apenas se não forçar novo) */}
      {!forceNew && hasCurrentSession() && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
              <Save className="h-3 w-3 mr-1" />
              Progresso salvo
            </Badge>
            {isSyncing ? (
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Sincronizando...
              </Badge>
            ) : (
              <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                <Wifi className="h-3 w-3 mr-1" />
                Sincronizado
              </Badge>
            )}
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <MarketingQuestion
            stepData={currentQuestion}
            currentStep={currentStep}
            onOptionSelect={handleOptionSelect}
            onGoBack={handleGoBack}
            canGoBack={currentStep > 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AkinatorMarketingConsultant;
