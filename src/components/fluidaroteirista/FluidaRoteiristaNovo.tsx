import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, 
  Sparkles, 
  BookOpen, 
  Brain, 
  Target, 
  Zap, 
  FileText,
  ArrowRight,
  CheckCircle,
  Loader2,
  TrendingUp,
  Lightbulb,
  Users,
  Award
} from "lucide-react";
import { toast } from 'sonner';
import { useFluidaRoteiristaNovo } from './hooks/useFluidaRoteiristaNovo';
import ScriptFormNovo from './components/ScriptFormNovo';
import ScriptResultsNovo from './components/ScriptResultsNovo';
import RealScientificInsightsPanel from './components/RealScientificInsightsPanel';
import ProcessingSteps from './components/ProcessingSteps';

interface FluidaRoteiristANovoProps {
  onScriptGenerated?: (script: any) => void;
}

type FluidaStep = 'form' | 'processing' | 'results';

const FluidaRoteiristaNovo: React.FC<FluidaRoteiristANovoProps> = ({ 
  onScriptGenerated 
}) => {
  const [currentStep, setCurrentStep] = useState<FluidaStep>('form');
  const [showScientificInsights, setShowScientificInsights] = useState(false);
  
  const {
    generateScript,
    isGenerating,
    results,
    progress,
    scientificInsights,
    clearResults,
    error
  } = useFluidaRoteiristaNovo();

  // Auto-advance to results when generation completes
  useEffect(() => {
    if (results.length > 0 && currentStep !== 'results') {
      setCurrentStep('results');
    }
  }, [results.length, currentStep]);

  // Show processing step when generating
  useEffect(() => {
    if (isGenerating && currentStep === 'form') {
      setCurrentStep('processing');
    }
  }, [isGenerating, currentStep]);

  const handleScriptGeneration = useCallback(async (formData: any) => {
    try {
      await generateScript(formData);
      
      if (onScriptGenerated) {
        onScriptGenerated(formData);
      }
    } catch (error) {
      console.error('Erro na geração:', error);
      toast.error('Falha na geração do roteiro. Tente novamente.');
      setCurrentStep('form');
    }
  }, [generateScript, onScriptGenerated]);

  const handleNewScript = useCallback(() => {
    clearResults();
    setCurrentStep('form');
    setShowScientificInsights(false);
  }, [clearResults]);

  const handleGoBack = useCallback(() => {
    if (currentStep === 'results') {
      setCurrentStep('form');
    }
  }, [currentStep]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'form':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ScriptFormNovo
              onSubmit={handleScriptGeneration}
              isGenerating={isGenerating}
              onToggleInsights={() => setShowScientificInsights(!showScientificInsights)}
              showInsights={showScientificInsights}
            />
          </motion.div>
        );

      case 'processing':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ProcessingSteps
              progress={progress}
              isGenerating={isGenerating}
              currentStep="Analisando artigos científicos..."
            />
          </motion.div>
        );

      case 'results':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ScriptResultsNovo
              results={results}
              scientificInsights={scientificInsights}
              onNewScript={handleNewScript}
              onGoBack={handleGoBack}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-0">
      <div className="max-w-7xl mx-auto">
        {/* Header moderno */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Fluida Roteirista 2.0
            </h1>
          </div>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">
            IA Avançada com Base Científica para Roteiros Únicos e Eficazes
          </p>

          {/* Status badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Integração Científica
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              IA Avançada
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Award className="w-3 h-3 mr-1" />
              Pro Version
            </Badge>
          </div>
        </motion.div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            {[
              { key: 'form', label: 'Configuração', icon: FileText },
              { key: 'processing', label: 'Processamento', icon: Brain },
              { key: 'results', label: 'Resultados', icon: Sparkles }
            ].map((step, index) => {
              const isActive = currentStep === step.key;
              const isCompleted = ['form', 'processing'].indexOf(step.key) < ['form', 'processing', 'results'].indexOf(currentStep);
              
              return (
                <div key={step.key} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                    ${isActive ? 'border-purple-400 bg-purple-400 text-white' : 
                      isCompleted ? 'border-emerald-400 bg-emerald-400 text-white' : 
                      'border-slate-500 text-slate-500'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-purple-400' : 
                    isCompleted ? 'text-emerald-400' : 
                    'text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                  {index < 2 && (
                    <ArrowRight className="w-4 h-4 text-slate-500 mx-3" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Main content area */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="xl:col-span-3">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

          {/* Scientific insights sidebar */}
          <div className="xl:col-span-1">
            <AnimatePresence>
              {(showScientificInsights || currentStep === 'results') && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <RealScientificInsightsPanel
                    insights={scientificInsights}
                    isLoading={isGenerating}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error handling */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Card className="border-red-500/30 bg-red-500/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Zap className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-400">Erro na Geração</h3>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FluidaRoteiristaNovo;