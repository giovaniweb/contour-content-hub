
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedAkinatorQuestion from '../components/EnhancedAkinatorQuestion';
import ScriptPreview from '../components/ScriptPreview';
import FluidaLoadingScreen from '../components/FluidaLoadingScreen';
import { SCRIPT_INTENTION_TREE } from '../constants/intentionTree';

interface AkinatorScriptModeProps {
  onScriptGenerated: (script: any) => void;
  onGoBack: () => void;
  generateScript: (data: any) => Promise<any>;
  isGenerating: boolean;
}

const AkinatorScriptMode: React.FC<AkinatorScriptModeProps> = ({
  onScriptGenerated,
  onGoBack,
  generateScript,
  isGenerating
}) => {
  const [currentStep, setCurrentStep] = useState('root');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [stepHistory, setStepHistory] = useState<string[]>(['root']);
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const currentQuestion = SCRIPT_INTENTION_TREE[currentStep];

  const handleAnswer = async (value: string) => {
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);

    const selectedOption = currentQuestion.options?.find(opt => opt.value === value);
    
    if (selectedOption?.leads_to) {
      const nextStep = selectedOption.leads_to;
      setCurrentStep(nextStep);
      setStepHistory([...stepHistory, nextStep]);
    } else if (currentStep === 'tema') {
      // Última etapa - gerar roteiro
      await handleGenerateScript(newAnswers);
    }
  };

  const handleGenerateScript = async (finalAnswers: Record<string, string>) => {
    try {
      const scriptData = {
        tipo_conteudo: finalAnswers.root || 'carrossel',
        objetivo: finalAnswers.objetivo || 'atrair',
        canal: finalAnswers.canal || 'instagram',
        estilo: finalAnswers.estilo || 'criativo',
        equipamento: finalAnswers.equipamento || '',
        tema: finalAnswers.tema || ''
      };

      const result = await generateScript(scriptData);
      setGeneratedScript(result);
      setShowPreview(true);
    } catch (error) {
      console.error('Erro ao gerar roteiro:', error);
    }
  };

  const handleGoBackStep = () => {
    if (stepHistory.length > 1) {
      const newHistory = stepHistory.slice(0, -1);
      const previousStep = newHistory[newHistory.length - 1];
      setStepHistory(newHistory);
      setCurrentStep(previousStep);
      
      const newAnswers = { ...answers };
      delete newAnswers[currentStep];
      setAnswers(newAnswers);
    } else {
      onGoBack();
    }
  };

  const handleApproveScript = () => {
    onScriptGenerated(generatedScript);
  };

  const handleNewScript = () => {
    setGeneratedScript(null);
    setShowPreview(false);
    setCurrentStep('root');
    setAnswers({});
    setStepHistory(['root']);
  };

  if (isGenerating) {
    return <FluidaLoadingScreen mentor={answers.estilo || 'criativo'} />;
  }

  if (showPreview && generatedScript) {
    return (
      <ScriptPreview
        script={generatedScript}
        onApprove={handleApproveScript}
        onNewScript={handleNewScript}
        isProcessing={false}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-white">Erro: Etapa não encontrada</p>
        <button onClick={() => setCurrentStep('root')} className="text-aurora-electric-purple">
          Reiniciar
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <EnhancedAkinatorQuestion
        question={currentQuestion.question}
        options={currentQuestion.options || []}
        stepId={currentStep}
        onOptionSelect={handleAnswer}
        onGoBack={handleGoBackStep}
        canGoBack={stepHistory.length > 1}
        mentorStyle={answers.estilo}
        currentStep={stepHistory.length}
        totalSteps={6}
      />
    </motion.div>
  );
};

export default AkinatorScriptMode;
