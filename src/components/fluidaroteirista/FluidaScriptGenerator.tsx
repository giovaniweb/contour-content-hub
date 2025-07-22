import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, Target, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFluidaScript } from './hooks/useFluidaScript';
import AkinatorScriptMode from './modes/AkinatorScriptMode';
import ElementosUniversaisMode from './modes/ElementosUniversaisMode';
import ScriptPreview from './components/ScriptPreview';
import SmartQuestionSystem from './components/SmartQuestionSystem';

interface FluidaScriptGeneratorProps {
  onScriptGenerated?: (script: any) => void;
}

const FluidaScriptGenerator: React.FC<FluidaScriptGeneratorProps> = ({ 
  onScriptGenerated 
}) => {
  const [selectedMode, setSelectedMode] = useState<'akinator' | 'elementos' | null>(null);
  const [approvedScript, setApprovedScript] = useState<any>(null);
  
  const {
    results,
    isGenerating,
    isGeneratingImage,
    generatedImageUrl,
    validationResult,
    showValidation,
    generateScript,
    forceGenerate,
    applyDisneyMagic,
    generateImage,
    generateAudio,
    clearResults,
    dismissValidation
  } = useFluidaScript();

  const handleScriptGenerated = (script: any) => {
    console.log('🎬 [FluidaScriptGenerator] Script gerado:', script);
    setApprovedScript(script);
    if (onScriptGenerated) {
      onScriptGenerated(script);
    }
  };

  const handleBackToModes = () => {
    setSelectedMode(null);
    setApprovedScript(null);
    clearResults();
  };

  const handleNewScript = () => {
    setApprovedScript(null);
    clearResults();
  };

  const handleApproveScript = () => {
    if (approvedScript && onScriptGenerated) {
      onScriptGenerated(approvedScript);
    }
  };

  // Se há script aprovado, mostrar preview
  if (approvedScript || results.length > 0) {
    const scriptToShow = approvedScript || results[0];
    return (
      <ScriptPreview
        script={scriptToShow}
        onApprove={handleApproveScript}
        onNewScript={handleNewScript}
        onGenerateImage={() => generateImage(scriptToShow)}
        onGenerateAudio={() => generateAudio(scriptToShow)}
        onApplyDisney={() => applyDisneyMagic(scriptToShow)}
        isProcessing={isGenerating || isGeneratingImage}
        generatedImageUrl={generatedImageUrl}
      />
    );
  }

  // Se um modo foi selecionado, mostrar o modo
  if (selectedMode === 'akinator') {
    return (
      <AkinatorScriptMode
        onScriptGenerated={handleScriptGenerated}
        onGoBack={handleBackToModes}
        generateScript={generateScript}
        forceGenerate={forceGenerate}
        isGenerating={isGenerating}
        validationResult={validationResult}
        showValidation={showValidation}
        dismissValidation={dismissValidation}
      />
    );
  }

  if (selectedMode === 'elementos') {
    return (
      <ElementosUniversaisMode
        onScriptGenerated={handleScriptGenerated}
        onGoBack={handleBackToModes}
        generateScript={generateScript}
        isGenerating={isGenerating}
      />
    );
  }

  // Mostrar seleção de modo
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Wand2 className="h-12 w-12 text-aurora-electric-purple" />
          <div>
            <h1 className="text-4xl font-bold text-aurora-text-primary aurora-heading-enhanced">Fluida Roteirista</h1>
            <p className="text-slate-400 text-lg">
              Sistema Anti-Genérico com IA Personalizada
            </p>
          </div>
        </div>
        
        {/* Badge de Qualidade */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-aurora-electric-purple/20 to-aurora-cosmic-teal/20 border border-aurora-electric-purple/30 rounded-full">
          <Sparkles className="h-4 w-4 text-aurora-electric-purple" />
          <span className="text-sm font-medium text-slate-300">
            100% Personalizado • Zero Conteúdo Genérico
          </span>
        </div>
      </motion.div>

      {/* Seleção de Modo */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Modo Akinator */}
          <Card className="group hover:border-aurora-electric-purple/50 transition-all duration-300 cursor-pointer bg-slate-900/50 border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-aurora-electric-purple/20 rounded-lg">
                  <Target className="h-6 w-6 text-aurora-electric-purple" />
                </div>
                Modo Akinator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Sistema de perguntas inteligentes que identifica sua intenção exata e gera roteiros ultra-personalizados.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Validação obrigatória de equipamentos
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Inferência automática de mentor
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Sistema anti-genérico ativo
                </div>
              </div>

              <Button 
                onClick={() => setSelectedMode('akinator')}
                className="w-full bg-aurora-electric-purple hover:bg-aurora-electric-purple/80"
              >
                Iniciar Modo Akinator
              </Button>
            </CardContent>
          </Card>

          {/* Modo 10 Elementos Universais */}
          <Card className="group hover:border-aurora-cosmic-teal/50 transition-all duration-300 cursor-pointer bg-slate-900/50 border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-aurora-cosmic-teal/20 rounded-lg">
                  <Users className="h-6 w-6 text-aurora-cosmic-teal" />
                </div>
                10 Elementos Universais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Metodologia avançada baseada nos 10 elementos fundamentais para roteiros de alta conversão.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2 h-2 bg-aurora-cosmic-teal rounded-full"></span>
                  Storytelling + Copywriting avançado
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2 h-2 bg-aurora-cosmic-teal rounded-full"></span>
                  Gatilhos mentais cientificamente validados
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2 h-2 bg-aurora-cosmic-teal rounded-full"></span>
                  Máxima personalização para seu público
                </div>
              </div>

              <Button 
                onClick={() => setSelectedMode('elementos')}
                className="w-full bg-aurora-cosmic-teal hover:bg-aurora-cosmic-teal/80 text-slate-900"
              >
                Iniciar 10 Elementos
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Garantias de Qualidade */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-center text-green-400">
              🛡️ Sistema Anti-Genérico Ativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl">🚫</div>
                <h4 className="font-semibold text-slate-300">Zero Genérico</h4>
                <p className="text-sm text-slate-400">
                  Bloqueio automático de conteúdo vago ou neutro
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🔧</div>
                <h4 className="font-semibold text-slate-300">Equipamento Obrigatório</h4>
                <p className="text-sm text-slate-400">
                  Seus equipamentos sempre aparecem no roteiro
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🎯</div>
                <h4 className="font-semibold text-slate-300">Alta Conversão</h4>
                <p className="text-sm text-slate-400">
                  Validação de qualidade antes da entrega
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FluidaScriptGenerator;
