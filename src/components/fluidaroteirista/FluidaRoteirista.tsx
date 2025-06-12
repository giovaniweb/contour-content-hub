
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, MessageCircle, HelpCircle, Sparkles } from "lucide-react";
import AkinatorScriptMode from './modes/AkinatorScriptMode';
import ChatScriptMode from './modes/ChatScriptMode';
import FluidaScriptResults from './FluidaScriptResults';
import { useFluidaScript } from './hooks/useFluidaScript';

type FluidaMode = 'selection' | 'akinator' | 'chat' | 'results';

const FluidaRoteirista: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<FluidaMode>('selection');
  const { 
    results, 
    isGenerating, 
    generateScript, 
    applyDisneyMagic, 
    clearResults,
    generateImage,
    generateAudio 
  } = useFluidaScript();

  const handleModeSelect = (mode: 'akinator' | 'chat') => {
    setCurrentMode(mode);
  };

  const handleScriptGenerated = (script: any) => {
    setCurrentMode('results');
  };

  const handleNewScript = () => {
    clearResults();
    setCurrentMode('selection');
  };

  const handleGoBack = () => {
    setCurrentMode('selection');
  };

  if (currentMode === 'results' && results.length > 0) {
    return (
      <FluidaScriptResults
        results={results}
        onNewScript={handleNewScript}
        onGenerateImage={generateImage}
        onGenerateAudio={generateAudio}
        onApplyDisney={applyDisneyMagic}
        isProcessing={isGenerating}
      />
    );
  }

  if (currentMode === 'akinator') {
    return (
      <AkinatorScriptMode
        onScriptGenerated={handleScriptGenerated}
        onGoBack={handleGoBack}
        generateScript={generateScript}
        isGenerating={isGenerating}
      />
    );
  }

  if (currentMode === 'chat') {
    return (
      <ChatScriptMode
        onScriptGenerated={handleScriptGenerated}
        onGoBack={handleGoBack}
        generateScript={generateScript}
        isGenerating={isGenerating}
      />
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <Wand2 className="h-12 w-12 text-aurora-electric-purple" />
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

      {/* Mode Selection */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-white text-center mb-6">
          Escolha seu estilo de criação:
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Modo Akinator */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="aurora-glass border-aurora-electric-purple/30 hover:border-aurora-electric-purple/50 transition-all cursor-pointer h-full"
                  onClick={() => handleModeSelect('akinator')}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <HelpCircle className="h-16 w-16 text-aurora-electric-purple" />
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
                  Roteirista guiado com perguntas passo a passo
                </p>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>✅ Ideal para usuários iniciantes</p>
                  <p>✅ Interface com perguntas visuais</p>
                  <p>✅ Salva progresso automaticamente</p>
                  <p>✅ Árvore de intenção inteligente</p>
                </div>
                <Button className="w-full bg-aurora-gradient-primary hover:opacity-90 text-white">
                  Começar com Perguntas
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Modo Chat */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="aurora-glass border-aurora-electric-purple/30 hover:border-aurora-electric-purple/50 transition-all cursor-pointer h-full"
                  onClick={() => handleModeSelect('chat')}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <MessageCircle className="h-16 w-16 text-aurora-electric-purple" />
                </div>
                <CardTitle className="text-white text-xl">
                  🚀 Roteiro Pro
                </CardTitle>
                <p className="text-aurora-electric-purple font-medium">
                  Estilo Chat
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-center">
                  Roteirista livre com conversa estilo bate-papo
                </p>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>✅ Ideal para usuários avançados</p>
                  <p>✅ Entrada livre de texto</p>
                  <p>✅ Interação natural e rápida</p>
                  <p>✅ IA adapta automaticamente</p>
                </div>
                <Button className="w-full bg-aurora-gradient-primary hover:opacity-90 text-white">
                  Conversar Livremente
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
            <div className="text-center">
              <div className="text-aurora-electric-purple font-medium">✨ Disney Magic</div>
              <div>Transformação encantadora</div>
            </div>
            <div className="text-center">
              <div className="text-aurora-electric-purple font-medium">🖼️ Geração de Imagem</div>
              <div>Arte com IA real</div>
            </div>
            <div className="text-center">
              <div className="text-aurora-electric-purple font-medium">🎙️ Áudio Narrado</div>
              <div>Voz encantadora</div>
            </div>
            <div className="text-center">
              <div className="text-aurora-electric-purple font-medium">📱 Multi-formato</div>
              <div>Stories, carrossel, imagem</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FluidaRoteirista;
