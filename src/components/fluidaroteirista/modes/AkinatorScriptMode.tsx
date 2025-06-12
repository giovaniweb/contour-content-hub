
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
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [stepHistory, setStepHistory] = useState<string[]>(['root']);
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = SCRIPT_INTENTION_TREE[currentStep];

  const handleAnswer = async (value: string | string[]) => {
    console.log('🎯 [AkinatorScriptMode] handleAnswer chamado com:', value, 'step:', currentStep);
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);

    // Se for equipamento e for array, avançar diretamente para tema
    if (currentStep === 'equipamento') {
      const nextStep = 'tema';
      console.log('🎯 [AkinatorScriptMode] Equipamentos selecionados, indo para tema');
      setCurrentStep(nextStep);
      setStepHistory([...stepHistory, nextStep]);
      return;
    }

    // Lógica normal para outras etapas
    if (typeof value === 'string') {
      const selectedOption = currentQuestion.options?.find(opt => opt.value === value);
      
      if (selectedOption?.leads_to) {
        const nextStep = selectedOption.leads_to;
        console.log('🎯 [AkinatorScriptMode] Indo para próxima etapa:', nextStep);
        setCurrentStep(nextStep);
        setStepHistory([...stepHistory, nextStep]);
      } else if (currentStep === 'tema') {
        // Última etapa - gerar roteiro
        console.log('🎯 [AkinatorScriptMode] Última etapa atingida, gerando roteiro');
        await handleGenerateScript(newAnswers);
      }
    } else if (currentStep === 'tema') {
      // Se chegou no tema (após equipamentos), gerar roteiro
      console.log('🎯 [AkinatorScriptMode] Tema fornecido, gerando roteiro');
      await handleGenerateScript(newAnswers);
    }
  };

  const handleGenerateScript = async (finalAnswers: Record<string, string | string[]>) => {
    try {
      console.log('🎬 [AkinatorScriptMode] Iniciando geração de roteiro');
      setError(null);
      
      // Processar equipamentos selecionados
      let equipamentosTexto = '';
      const equipamentos = finalAnswers.equipamento;
      
      if (Array.isArray(equipamentos)) {
        equipamentosTexto = equipamentos.join(', ');
        console.log('🎬 [AkinatorScriptMode] Equipamentos (array):', equipamentos);
      } else if (typeof equipamentos === 'string') {
        equipamentosTexto = equipamentos;
        console.log('🎬 [AkinatorScriptMode] Equipamentos (string):', equipamentos);
      }

      const scriptData = {
        tipo_conteudo: finalAnswers.root || 'carrossel',
        objetivo: finalAnswers.objetivo || 'atrair',
        canal: finalAnswers.canal || 'instagram',
        estilo: finalAnswers.estilo || 'criativo',
        equipamento: equipamentosTexto,
        tema: finalAnswers.tema || ''
      };

      console.log('🎬 [AkinatorScriptMode] Dados para geração:', scriptData);

      const result = await generateScript(scriptData);
      console.log('🎬 [AkinatorScriptMode] Resultado recebido:', result);
      
      if (result && (result.roteiro || result.content)) {
        setGeneratedScript(result);
        setShowPreview(true);
        console.log('🎬 [AkinatorScriptMode] Preview habilitado, script salvo');
      } else {
        console.error('🎬 [AkinatorScriptMode] Resultado inválido recebido:', result);
        setError('Roteiro gerado está vazio ou inválido');
      }
    } catch (error) {
      console.error('🔥 [AkinatorScriptMode] Erro ao gerar roteiro:', error);
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
    console.log('✅ [AkinatorScriptMode] Script aprovado, chamando onScriptGenerated');
    onScriptGenerated(generatedScript);
  };

  const handleNewScript = () => {
    console.log('🔄 [AkinatorScriptMode] Novo roteiro solicitado');
    setGeneratedScript(null);
    setShowPreview(false);
    setCurrentStep('root');
    setAnswers({});
    setStepHistory(['root']);
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
    console.log('⏳ [AkinatorScriptMode] Mostrando tela de loading');
    return <FluidaLoadingScreen mentor={Array.isArray(answers.estilo) ? 'criativo' : (answers.estilo as string) || 'criativo'} />;
  }

  if (showPreview && generatedScript) {
    console.log('📱 [AkinatorScriptMode] Mostrando preview do script');
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

  console.log('❓ [AkinatorScriptMode] Mostrando pergunta:', currentStep);
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
        mentorStyle={Array.isArray(answers.estilo) ? 'criativo' : (answers.estilo as string)}
        currentStep={stepHistory.length}
        totalSteps={6}
      />
    </motion.div>
  );
};

export default AkinatorScriptMode;
