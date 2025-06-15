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

  if (currentMode === 'results' && results.length > 0) {
    if (IS_DEV) console.log('📱 [FluidaRoteirista] Renderizando resultados');
    return (
      <FluidaScriptResults
        results={results}
        onNewScript={handleNewScript}
        onGenerateImage={handleGenerateImage}
        onGenerateAudio={handleGenerateAudio}
        onApplyDisney={applyDisneyMagic}
        isProcessing={isGenerating}
      />
    );
  }

  if (currentMode === 'elementos') {
    if (IS_DEV) console.log('🎯 [FluidaRoteirista] Renderizando modo Rocket');
    return (
      <ElementosUniversaisMode
        onScriptGenerated={handleScriptGenerated}
        onGoBack={handleGoBack}
        generateScript={generateScript}
        isGenerating={isGenerating}
      />
    );
  }

  if (currentMode === 'akinator') {
    if (IS_DEV) console.log('❓ [FluidaRoteirista] Renderizando modo Fluida');
    return (
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
    );
  }

  if (IS_DEV) console.log('🏠 [FluidaRoteirista] Renderizando seleção de modo');
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Wand2 className="h-12 w-12 text-aurora-electric-purple" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-slate-50 bg-aurora-gradient-primary bg-clip-text text-transparent">
              FLUIDAROTEIRISTA 🎬
            </h1>
            <p className="text-slate-400 mt-2">
              Roteiros criativos, impactantes e prontos para redes sociais
            </p>
          </div>
        </motion.div>
      </div>

      {/* Quick Access Menu */}
      <QuickAccessMenu onNavigateToApprovedScripts={handleNavigateToApprovedScripts} />

      {/* Mode Selection */}
      <ModeSelection onSelect={handleModeSelect} />

      {/* Features Banner */}
      <FeaturesBanner />
    </div>
  );
};

export default FluidaRoteirista;
