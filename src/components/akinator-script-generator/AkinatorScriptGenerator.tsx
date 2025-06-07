
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

  const currentStepData = STEPS[state.currentStep];

  const handleOptionSelect = (value: string) => {
    const newState = { ...state, [currentStepData.id]: value };
    
    if (state.currentStep < STEPS.length - 1) {
      setState({ ...newState, currentStep: state.currentStep + 1 });
    } else {
      // Gerar roteiro
      const mentorKey = selectMentor(newState);
      const script = generateSpecificScript(newState, mentorKey);
      
      setState({
        ...newState,
        isComplete: true,
        generatedScript: script,
        selectedMentor: mentorKey
      });
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

  if (state.isComplete) {
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
      <AkinatorProgress currentStep={state.currentStep} />
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
