import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, HelpCircle, Sparkles, Target, Rocket, BookOpen, TrendingUp, Camera } from "lucide-react";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import AkinatorScriptMode from './modes/AkinatorScriptMode';
import ElementosUniversaisMode from './modes/ElementosUniversaisMode';
import FluidaScriptResults from './FluidaScriptResults';
import { useFluidaScript } from './hooks/useFluidaScript';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import QuickAccessMenu from "./components/QuickAccessMenu";
import ModeSelection from "./components/ModeSelection";
import FeaturesBanner from "./components/FeaturesBanner";
import AuroraHeaderSection from "./components/AuroraHeaderSection";

type FluidaMode = 'selection' | 'akinator' | 'elementos' | 'results';

interface FluidaRoteiristaProps {
  onScriptGenerated?: (script: any) => void;
}

const IS_DEV = import.meta.env?.MODE === 'development';

const FluidaRoteirista: React.FC<FluidaRoteiristaProps> = ({ onScriptGenerated }) => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<FluidaMode>('selection');
  const { 
    results, 
    isGenerating, 
    generateScript, 
    forceGenerate,
    applyDisneyMagic, 
    clearResults,
    validationResult,
    showValidation,
    dismissValidation
  } = useFluidaScript();
  const { 
    isGenerating: isGeneratingImage, 
    generatedImageUrl 
  } = useImageGeneration();

  // Monitorar mudanças nos resultados para mudar automaticamente para 'results'
  useEffect(() => {
    if (IS_DEV) {
      console.log('📊 [FluidaRoteirista] Results changed:', results.length, 'current mode:', currentMode);
    }
    if (results.length > 0 && currentMode !== 'results') {
      if (IS_DEV) console.log('🔄 [FluidaRoteirista] Mudando para modo results');
      setCurrentMode('results');
    }
  }, [results.length, currentMode]);

  const handleModeSelect = (mode: 'akinator' | 'elementos') => {
    if (IS_DEV) console.log('🎯 [FluidaRoteirista] Modo selecionado:', mode);
    setCurrentMode(mode);
  };

  const handleScriptGenerated = (script: any) => {
    if (IS_DEV) console.log('✅ [FluidaRoteirista] Script gerado recebido:', script);
    // Chamar callback opcional se fornecido
    if (onScriptGenerated) {
      onScriptGenerated(script);
    }
    // O useEffect já vai mudar para 'results' quando results.length > 0
  };

  const handleNewScript = () => {
    if (IS_DEV) console.log('🆕 [FluidaRoteirista] Novo script solicitado');
    clearResults();
    setCurrentMode('selection');
  };

  const handleGoBack = () => {
    if (IS_DEV) console.log('⬅️ [FluidaRoteirista] Voltando para seleção');
    setCurrentMode('selection');
  };

  const handleGenerateImage = async (script: any) => {
    if (IS_DEV) console.log('🖼️ [FluidaRoteirista] Função delegada para FluidaScriptResults');
    // Esta função agora é apenas um placeholder - a lógica real está no FluidaScriptResults
  };

  const handleGenerateAudio = async (script: any) => {
    if (IS_DEV) console.log('🎧 [FluidaRoteirista] Gerando áudio para script:', script.formato);
    toast.info('🎧 Geração de áudio', {
      description: 'Função de áudio será implementada em breve!'
    });
  };

  const handleNavigateToApprovedScripts = () => {
    navigate('/approved-scripts');
  };

  const handleNavigateToBeforeAfter = () => {
    navigate('/before-after');
  };

  // Remover logs de render, só mostrar em dev
  if (IS_DEV) {
    console.log('🎬 [FluidaRoteirista] Render - Mode:', currentMode, 'Results:', results.length, 'Generating:', isGenerating);
  }

  if (currentMode === 'results') {
    if (results.length === 0) {
      return (
        <div className="w-full flex flex-col items-center justify-center h-96 text-center gap-6 px-6">
          <div className="text-xl text-rose-400 font-bold">😢 Nenhum roteiro gerado</div>
          <div className="text-md text-slate-400 max-w-xl">
            Não foi possível criar um roteiro neste momento. Isso pode ter ocorrido por instabilidade do serviço ou dados insuficientes.
            <br />
            <span className="text-aurora-electric-purple">Tente novamente ou ajuste as informações.</span>
          </div>
          <Button variant="secondary" onClick={handleNewScript}>Tentar Novamente</Button>
        </div>
      );
    }

    if (IS_DEV) console.log('📱 [FluidaRoteirista] Renderizando resultados');
    return (
      <div className="p-4 sm:p-8 w-full max-w-3xl mx-auto space-y-6">
        <FluidaScriptResults
          results={results}
          onNewScript={handleNewScript}
          onGenerateImage={handleGenerateImage}
          onGenerateAudio={handleGenerateAudio}
          onApplyDisney={applyDisneyMagic}
          isProcessing={isGenerating}
          // No need to pass onApproveScript unless implemented
        />
      </div>
    );
  }

  if (currentMode === 'elementos') {
    if (IS_DEV) console.log('🎯 [FluidaRoteirista] Renderizando modo Rocket');
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto">
        <ElementosUniversaisMode
          onScriptGenerated={handleScriptGenerated}
          onGoBack={handleGoBack}
          generateScript={generateScript}
          isGenerating={isGenerating}
        />
      </div>
    );
  }

  if (currentMode === 'akinator') {
    if (IS_DEV) console.log('❓ [FluidaRoteirista] Renderizando modo Fluida');
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto">
        <AkinatorScriptMode
          onScriptGenerated={handleScriptGenerated}
          onGoBack={handleGoBack}
          generateScript={generateScript}
          forceGenerate={forceGenerate}
          isGenerating={isGenerating}
          validationResult={validationResult}
          showValidation={showValidation}
          dismissValidation={dismissValidation}
        />
      </div>
    );
  }

  if (IS_DEV) console.log('🏠 [FluidaRoteirista] Renderizando seleção de modo');
  return (
    <div className="container mx-auto py-10 sm:py-14 space-y-14 sm:space-y-16 px-4">
      {/* Header */}
      <AuroraHeaderSection />

      {/* Quick Access Menu */}
      <div className="py-2">
        <QuickAccessMenu onNavigateToApprovedScripts={handleNavigateToApprovedScripts} />
      </div>

      {/* Mode Selection */}
      <div>
        <ModeSelection onSelect={handleModeSelect} />
      </div>

      {/* Features Banner */}
      <div className="mt-2">
        <FeaturesBanner />
      </div>
    </div>
  );
};

export default FluidaRoteirista;
