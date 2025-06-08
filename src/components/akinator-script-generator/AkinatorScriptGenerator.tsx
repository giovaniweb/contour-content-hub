
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AkinatorState } from './types';
import { STEPS } from './constants';
import { selectMentor, generateSpecificScript, generateDisneyScript, getRandomEnigma } from './scriptGenerator';
import AkinatorProgress from './AkinatorProgress';
import AkinatorQuestion from './AkinatorQuestion';
import AkinatorResult from './AkinatorResult';

const AkinatorScriptGenerator: React.FC = () => {
  const { toast } = useToast();
  const [state, setState] = useState<AkinatorState>({
    currentStep: 0,
    isComplete: false
  });

  console.log('AkinatorScriptGenerator - Estado atual:', state);

  const currentStepData = STEPS[state.currentStep];

  const handleOptionSelect = (value: string) => {
    const newState = { ...state, [currentStepData.id]: value };
    
    console.log('handleOptionSelect - newState:', newState);
    console.log('handleOptionSelect - currentStep:', state.currentStep, 'STEPS.length:', STEPS.length);
    
    if (state.currentStep < STEPS.length - 1) {
      console.log('Avançando para próximo step');
      setState({ ...newState, currentStep: state.currentStep + 1 });
    } else {
      console.log('Gerando roteiro - última etapa');
      // Gerar roteiro
      const mentorKey = selectMentor(newState);
      const script = generateSpecificScript(newState, mentorKey);
      
      const finalState = {
        ...newState,
        isComplete: true,
        generatedScript: script,
        selectedMentor: mentorKey
      };
      
      console.log('Estado final sendo definido:', finalState);
      setState(finalState);
    }
  };

  const handleDisneyMagic = () => {
    if (!state.generatedScript) return;
    
    const disneyScript = generateDisneyScript(state.generatedScript, state.contentType);
    
    setState({
      ...state,
      generatedScript: disneyScript,
      showDisneyOption: false
    });
    
    toast({
      title: "✨ Magia Disney 1928 Aplicada!",
      description: "Seu roteiro foi transformado por Walt Disney em seu estúdio criativo."
    });
  };

  const handleApproveScript = () => {
    setState({ ...state, isApproved: true });
    toast({
      title: "✅ Roteiro Aprovado!",
      description: "Agora você pode gerar conteúdo adicional."
    });
  };

  const handleGenerateImage = () => {
    toast({
      title: "🖼️ Gerando imagem...",
      description: "Sua arte está sendo criada pela IA!"
    });
  };

  const handleGenerateAudio = () => {
    toast({
      title: "🎧 Gerando áudio...",
      description: "Sua narração está sendo criada!"
    });
  };

  const resetGenerator = () => {
    console.log('resetGenerator chamado');
    setState({
      currentStep: 0,
      isComplete: false,
      showDisneyOption: false,
      isApproved: false
    });
  };

  const handleGoBack = () => {
    setState({ ...state, currentStep: state.currentStep - 1 });
  };

  console.log('Renderizando - isComplete:', state.isComplete);

  if (state.isComplete) {
    console.log('Renderizando AkinatorResult com state:', state);
    return (
      <AkinatorResult
        state={state}
        onDisneyMagic={handleDisneyMagic}
        onApproveScript={handleApproveScript}
        onGenerateImage={handleGenerateImage}
        onGenerateAudio={handleGenerateAudio}
        onReset={resetGenerator}
      />
    );
  }

  return (
    <div>
      <AkinatorProgress currentStep={state.currentStep} totalSteps={STEPS.length} />
      <AkinatorQuestion
        stepData={currentStepData}
        currentStep={state.currentStep}
        onOptionSelect={handleOptionSelect}
        onGoBack={handleGoBack}
        canGoBack={state.currentStep > 0}
      />
    </div>
  );
};

export default AkinatorScriptGenerator;
