
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedAkinatorQuestion from '../components/EnhancedAkinatorQuestion';
import ScriptPreview from '../components/ScriptPreview';
import FluidaLoadingScreen from '../components/FluidaLoadingScreen';
import ElementosProgressBar from '../components/ElementosProgressBar';
import { ELEMENTOS_UNIVERSAIS_TREE, ELEMENTOS_CONFIG } from '../constants/elementosUniversaisTree';

interface ElementosUniversaisModeProps {
  onScriptGenerated: (script: any) => void;
  onGoBack: () => void;
  generateScript: (data: any) => Promise<any>;
  isGenerating: boolean;
}

const ElementosUniversaisMode: React.FC<ElementosUniversaisModeProps> = ({
  onScriptGenerated,
  onGoBack,
  generateScript,
  isGenerating
}) => {
  const [currentStep, setCurrentStep] = useState('storytelling');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [stepHistory, setStepHistory] = useState<string[]>(['storytelling']);
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = ELEMENTOS_UNIVERSAIS_TREE[currentStep];
  const currentStepIndex = stepHistory.length - 1;
  const totalSteps = 11; // 10 elementos + tema

  const handleAnswer = async (value: string | string[]) => {
    console.log('🎯 [ElementosUniversaisMode] handleAnswer chamado com:', value, 'step:', currentStep);
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);

    // Se for o último elemento (analises_dados), avançar para tema
    if (currentStep === 'analises_dados') {
      const nextStep = 'tema';
      console.log('🎯 [ElementosUniversaisMode] Último elemento, indo para tema');
      setCurrentStep(nextStep);
      setStepHistory([...stepHistory, nextStep]);
      return;
    }

    // Lógica normal para outras etapas
    if (typeof value === 'string') {
      const selectedOption = currentQuestion.options?.find(opt => opt.value === value);
      
      if (selectedOption?.leads_to) {
        const nextStep = selectedOption.leads_to;
        console.log('🎯 [ElementosUniversaisMode] Indo para próxima etapa:', nextStep);
        setCurrentStep(nextStep);
        setStepHistory([...stepHistory, nextStep]);
      } else if (currentStep === 'tema') {
        // Última etapa - gerar roteiro
        console.log('🎯 [ElementosUniversaisMode] Última etapa atingida, gerando roteiro');
        await handleGenerateScript(newAnswers);
      }
    } else if (currentStep === 'tema') {
      // Se chegou no tema, gerar roteiro
      console.log('🎯 [ElementosUniversaisMode] Tema fornecido, gerando roteiro');
      await handleGenerateScript(newAnswers);
    }
  };

  const handleGenerateScript = async (finalAnswers: Record<string, string | string[]>) => {
    try {
      console.log('🎬 [ElementosUniversaisMode] Iniciando geração de roteiro');
      setError(null);
      
      const scriptData = {
        elementos_escolhidos: finalAnswers,
        storytelling: finalAnswers.storytelling,
        conhecimento_publico: finalAnswers.conhecimento_publico,
        headlines: finalAnswers.headlines,
        gatilhos_mentais: finalAnswers.gatilhos_mentais,
        logica_argumentativa: finalAnswers.logica_argumentativa,
        premissas_educativas: finalAnswers.premissas_educativas,
        mapas_empatia: finalAnswers.mapas_empatia,
        copywriting: finalAnswers.copywriting,
        ferramentas_especificas: finalAnswers.ferramentas_especificas,
        analises_dados: finalAnswers.analises_dados,
        tema: finalAnswers.tema || '',
        modo: '10_elementos_universais'
      };

      console.log('🎬 [ElementosUniversaisMode] Dados para geração:', scriptData);

      const result = await generateScript(scriptData);
      console.log('🎬 [ElementosUniversaisMode] Resultado recebido:', result);
      
      if (result && (result.roteiro || result.content)) {
        setGeneratedScript(result);
        setShowPreview(true);
        console.log('🎬 [ElementosUniversaisMode] Preview habilitado, script salvo');
      } else {
        console.error('🎬 [ElementosUniversaisMode] Resultado inválido recebido:', result);
        setError('Roteiro gerado está vazio ou inválido');
      }
    } catch (error) {
      console.error('🔥 [ElementosUniversaisMode] Erro ao gerar roteiro:', error);
      setError('Erro ao gerar roteiro. Tente novamente.');
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
    console.log('✅ [ElementosUniversaisMode] Script aprovado, chamando onScriptGenerated');
    onScriptGenerated(generatedScript);
  };

  const handleNewScript = () => {
    console.log('🔄 [ElementosUniversaisMode] Novo roteiro solicitado');
    setGeneratedScript(null);
    setShowPreview(false);
    setCurrentStep('storytelling');
    setAnswers({});
    setStepHistory(['storytelling']);
    setError(null);
  };

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <h3 className="text-red-400 font-semibold mb-2">Erro na Geração</h3>
          <p className="text-slate-300 mb-4">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    console.log('⏳ [ElementosUniversaisMode] Mostrando tela de loading');
    return <FluidaLoadingScreen mentor="10_elementos" />;
  }

  if (showPreview && generatedScript) {
    console.log('📱 [ElementosUniversaisMode] Mostrando preview do script');
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
        <button onClick={() => setCurrentStep('storytelling')} className="text-aurora-electric-purple">
          Reiniciar
        </button>
      </div>
    );
  }

  console.log('❓ [ElementosUniversaisMode] Mostrando pergunta:', currentStep);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Progress Bar Personalizada */}
      <ElementosProgressBar
        currentStep={currentStepIndex}
        totalSteps={totalSteps}
        currentElemento={currentStep}
        answers={answers}
      />

      <EnhancedAkinatorQuestion
        question={currentQuestion.question || currentQuestion.subtitulo}
        titulo={currentQuestion.titulo}
        subtitulo={currentQuestion.subtitulo}
        descricao={currentQuestion.descricao}
        options={currentQuestion.options || []}
        stepId={currentStep}
        onOptionSelect={handleAnswer}
        onGoBack={handleGoBackStep}
        canGoBack={stepHistory.length > 1}
        mentorStyle="elementos_universais"
        currentStep={stepHistory.length}
        totalSteps={totalSteps}
        isTextInput={currentQuestion.isTextInput}
        mentorPhrase={currentQuestion.mentorPhrase}
      />
    </motion.div>
  );
};

export default ElementosUniversaisMode;
