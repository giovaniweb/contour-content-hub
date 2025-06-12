import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import EnhancedAkinatorQuestion from '../components/EnhancedAkinatorQuestion';
import FluidaLoadingScreen from '../components/FluidaLoadingScreen';
import SmartQuestionSystem from '../components/SmartQuestionSystem';
import { useEquipments } from '@/hooks/useEquipments';
import { AKINATOR_TREE } from '../constants/intentionTree';
import { buildEnhancedScriptData } from '../utils/mentorInference';
import { validateAkinatorScript, isAkinatorFlowComplete } from '../utils/akinatorValidation';

interface AkinatorScriptModeProps {
  onScriptGenerated: (script: any) => void;
  onGoBack: () => void;
  generateScript: (data: any, forceGenerate?: boolean) => Promise<any>;
  isGenerating: boolean;
  validationResult: any;
  showValidation: boolean;
  dismissValidation: () => void;
  forceGenerate: (data: any) => Promise<any>;
}

const AkinatorScriptMode: React.FC<AkinatorScriptModeProps> = ({
  onScriptGenerated,
  onGoBack,
  generateScript,
  isGenerating,
  validationResult,
  showValidation,
  dismissValidation,
  forceGenerate
}) => {
  const [currentStep, setCurrentStep] = useState('tipo_conteudo');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [history, setHistory] = useState<string[]>(['tipo_conteudo']);
  const [pendingScriptData, setPendingScriptData] = useState<any>(null);
  const { equipments, loading: equipmentsLoading } = useEquipments();

  console.log('🎬 [AkinatorScriptMode] Current step:', currentStep, 'Answers:', answers);

  const getCurrentQuestion = () => {
    const question = AKINATOR_TREE[currentStep];
    
    // Se for a etapa de equipamento, injetar os equipamentos do banco
    if (currentStep === 'equipamento' && equipments.length > 0) {
      console.log('🔧 [AkinatorScriptMode] Injetando equipamentos na pergunta:', equipments.length, 'equipamentos');
      return {
        ...question,
        options: equipments.map(eq => ({
          value: eq.id,
          label: eq.nome,
          emoji: '🔧',
          description: eq.categoria || 'Equipamento para tratamentos'
        }))
      };
    }
    
    return question;
  };

  const handleOptionSelect = async (value: string | string[]) => {
    console.log('📝 [AkinatorScriptMode] Option selected:', value, 'for step:', currentStep);
    
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);

    const currentQuestion = getCurrentQuestion();
    
    // Se chegamos ao final do tema, gerar o roteiro
    if (currentStep === 'tema') {
      console.log('🎯 [AkinatorScriptMode] Final step reached, generating script...');
      
      try {
        // Mapear equipamentos selecionados
        const selectedEquipmentIds = Array.isArray(newAnswers.equipamento) 
          ? newAnswers.equipamento as string[]
          : newAnswers.equipamento 
            ? [newAnswers.equipamento as string]
            : [];

        const selectedEquipmentNames = selectedEquipmentIds
          .map(id => {
            const equipment = equipments.find(eq => eq.id === id);
            return equipment?.nome || id;
          })
          .filter(name => name);

        console.log('✅ [AkinatorScriptMode] Selected equipment names:', selectedEquipmentNames);

        // Criar dados básicos do Akinator
        const akinatorData = {
          tipo_conteudo: newAnswers.tipo_conteudo as string || 'carrossel',
          objetivo: newAnswers.objetivo as string || 'atrair',
          canal: newAnswers.canal as string || 'instagram',
          estilo: newAnswers.estilo as string || 'criativo',
          equipamentos: selectedEquipmentNames,
          tema: value as string,
          modo: 'akinator'
        };

        console.log('📋 [AkinatorScriptMode] Dados básicos do Akinator:', akinatorData);

        // Validar com validação específica do Akinator
        const validation = validateAkinatorScript(akinatorData);
        console.log('🔍 [AkinatorScriptMode] Validação Akinator:', validation);

        // Verificar se o fluxo está completo
        const isFlowComplete = isAkinatorFlowComplete(akinatorData);
        console.log('✅ [AkinatorScriptMode] Fluxo completo?', isFlowComplete);

        // Se o fluxo está completo, enriquecer dados e gerar
        if (isFlowComplete && (validation.isValid || validation.quality === 'medium')) {
          const enhancedData = buildEnhancedScriptData(akinatorData);
          console.log('🚀 [AkinatorScriptMode] Gerando com dados enriquecidos:', enhancedData);
          
          const result = await generateScript(enhancedData);
          console.log('✅ [AkinatorScriptMode] Script generated:', result);
          
          if (result && result.length > 0) {
            onScriptGenerated(result[0]);
          }
        } else {
          // Salvar para possível força de geração
          setPendingScriptData(buildEnhancedScriptData(akinatorData));
          console.log('⚠️ [AkinatorScriptMode] Validação falhou, aguardando decisão do usuário');
        }
      } catch (error) {
        console.error('❌ [AkinatorScriptMode] Error generating script:', error);
      }
      return;
    }

    // Determinar próximo passo
    let nextStep = currentQuestion?.next;
    
    if (typeof nextStep === 'object') {
      // Navegação condicional
      nextStep = nextStep[value as string] || Object.values(nextStep)[0];
    }

    if (nextStep && AKINATOR_TREE[nextStep]) {
      console.log('➡️ [AkinatorScriptMode] Moving to next step:', nextStep);
      setCurrentStep(nextStep);
      setHistory(prev => [...prev, nextStep]);
    } else {
      console.error('❌ [AkinatorScriptMode] Invalid next step:', nextStep);
    }
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current step
      const previousStep = newHistory[newHistory.length - 1];
      
      console.log('⬅️ [AkinatorScriptMode] Going back to:', previousStep);
      
      setCurrentStep(previousStep);
      setHistory(newHistory);
      
      // Remove the answer for the current step
      const newAnswers = { ...answers };
      delete newAnswers[currentStep];
      setAnswers(newAnswers);
    } else {
      onGoBack();
    }
  };

  const handleImproveInformation = () => {
    // Voltar para início para melhorar as informações
    setCurrentStep('tipo_conteudo');
    setAnswers({});
    setHistory(['tipo_conteudo']);
    dismissValidation();
  };

  const handleForceGenerate = async () => {
    if (pendingScriptData) {
      console.log('🚀 [AkinatorScriptMode] Forçando geração do roteiro...');
      const result = await forceGenerate(pendingScriptData);
      if (result && result.length > 0) {
        onScriptGenerated(result[0]);
      }
      dismissValidation();
    }
  };

  // Mostrar sistema de validação se houver problemas
  if (showValidation && validationResult) {
    return (
      <div className="container mx-auto py-6">
        <SmartQuestionSystem
          validation={validationResult}
          onDismiss={handleForceGenerate}
          onImprove={handleImproveInformation}
        />
      </div>
    );
  }

  // Mostrar loading durante geração
  if (isGenerating) {
    return <FluidaLoadingScreen mentor="akinator" />;
  }

  // Mostrar loading se estiver carregando equipamentos na etapa de equipamento
  if (currentStep === 'equipamento' && equipmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-12 w-12 text-aurora-electric-purple mx-auto" />
          </motion.div>
          <p className="text-white">Carregando equipamentos...</p>
        </div>
      </div>
    );
  }

  // Verificar se não há equipamentos na etapa de equipamentos
  if (currentStep === 'equipamento' && !equipmentsLoading && equipments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-yellow-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white">Nenhum equipamento encontrado</h3>
          <p className="text-slate-300 max-w-md">
            Não encontramos equipamentos cadastrados. Você pode pular esta etapa ou voltar para adicionar equipamentos.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleGoBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button 
              onClick={() => handleOptionSelect([])}
              className="bg-aurora-electric-purple hover:bg-aurora-electric-purple/80"
            >
              Pular Equipamentos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  
  if (!currentQuestion) {
    console.error('❌ [AkinatorScriptMode] No question found for step:', currentStep);
    return (
      <div className="text-center space-y-4">
        <p className="text-red-400">Erro: Pergunta não encontrada para o passo atual</p>
        <Button onClick={onGoBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <EnhancedAkinatorQuestion
        question={currentQuestion.pergunta}
        titulo={currentQuestion.titulo}
        subtitulo={currentQuestion.subtitulo}
        descricao={currentQuestion.descricao}
        options={currentQuestion.options}
        stepId={currentStep}
        onOptionSelect={handleOptionSelect}
        onGoBack={handleGoBack}
        canGoBack={history.length > 1}
        mentorStyle="conversacional"
        currentStep={history.length - 1}
        totalSteps={Object.keys(AKINATOR_TREE).length}
        isTextInput={currentStep === 'tema'}
        mentorPhrase={currentQuestion.mentorPhrase}
        isMultipleChoice={currentStep === 'equipamento'}
      />
    </div>
  );
};

export default AkinatorScriptMode;
