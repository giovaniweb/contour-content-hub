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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardHeader>
            <CardTitle className="text-white text-center flex items-center justify-center gap-2">
              <BookOpen className="h-5 w-5" />
              Menu Rápido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleNavigateToApprovedScripts}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white h-16 flex items-center gap-3 w-full"
              >
                <TrendingUp className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">📚 Roteiros Aprovados</div>
                  <div className="text-sm opacity-90">Gerencie e avalie performance</div>
                </div>
              </Button>
              
              {/* Botão "Análises (Em breve)" com Tooltip para explicar */}
              <div className="relative group">
                <Button
                  variant="outline"
                  className="border-aurora-electric-purple/50 text-aurora-electric-purple hover:bg-aurora-electric-purple/10 h-16 flex items-center gap-3 w-full"
                  disabled
                  aria-label="Análises (Em breve)"
                >
                  <Target className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">📊 Análises (Em breve)</div>
                    <div className="text-sm opacity-70">Métricas e insights</div>
                  </div>
                </Button>
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded bg-black text-xs text-white opacity-0 group-hover:opacity-100 transition opacity pointer-events-none z-50 whitespace-nowrap">
                  Este recurso estará disponível em breve!
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mode Selection */}
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-white text-center mb-6"
        >
          ✨ Escolha seu estilo de criação:
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Modo Rocket (10 Elementos Universais) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="aurora-glass border-aurora-electric-purple/50 hover:border-aurora-electric-purple/70 transition-all cursor-pointer h-full relative overflow-hidden"
                  onClick={() => handleModeSelect('elementos')}>
              <div className="absolute top-2 right-2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                  NOVO ✨
                </span>
              </div>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <motion.div
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.2, 1.2, 1.2, 1]
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <Rocket className="h-16 w-16 text-aurora-electric-purple" />
                  </motion.div>
                </div>
                <CardTitle className="text-white text-xl">
                  🚀 Roteiro Rocket
                </CardTitle>
                <p className="text-aurora-electric-purple font-medium">
                  10 Elementos Universais
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-center">
                  Para quem quer conquistar o universo
                </p>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>🎯 Storytelling + Público-alvo</p>
                  <p>📈 Headlines + Gatilhos mentais</p>
                  <p>🧠 Lógica + Educação + Empatia</p>
                  <p>📊 Copy + Ferramentas + Dados</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white">
                  Decolar com Rocket 🚀
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Modo Fluida (Akinator) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="aurora-glass border-aurora-electric-purple/30 hover:border-aurora-electric-purple/50 transition-all cursor-pointer h-full"
                  onClick={() => handleModeSelect('akinator')}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <motion.div
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1.1, 1.1, 1]
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <HelpCircle className="h-16 w-16 text-aurora-electric-purple" />
                  </motion.div>
                </div>
                <CardTitle className="text-white text-xl">
                  🎯 Roteiro Fluida
                </CardTitle>
                <p className="text-aurora-electric-purple font-medium">
                  Estilo Akinator
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-center">
                  Para quem quer um roteiro rápido e prático
                </p>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>✅ Ideal para usuários iniciantes</p>
                  <p>✅ Interface com perguntas visuais</p>
                  <p>✅ 6 passos estruturados</p>
                  <p>✅ Árvore de intenção inteligente</p>
                </div>
                <Button className="w-full bg-aurora-gradient-primary hover:opacity-90 text-white">
                  Começar com Fluida
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 aurora-glass border-aurora-electric-purple/20 rounded-lg"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-aurora-electric-purple" />
            <h3 className="text-lg font-semibold text-white">
              Recursos Disponíveis
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-aurora-electric-purple font-medium">✨ Disney Magic</div>
              <div>Transformação encantadora</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-aurora-electric-purple font-medium">🖼️ Geração de Imagem</div>
              <div>Arte com IA real</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-aurora-electric-purple font-medium">🎙️ Áudio Narrado</div>
              <div>Voz encantadora</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-aurora-electric-purple font-medium">📸 Antes & Depois</div>
              <div>Documente resultados</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FluidaRoteirista;
