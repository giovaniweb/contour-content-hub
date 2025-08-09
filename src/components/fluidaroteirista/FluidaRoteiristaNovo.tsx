import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Sparkles, Brain, FileText, ArrowRight, CheckCircle, Zap } from "lucide-react";
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

  const isSidebarVisible = (showScientificInsights || currentStep === 'results');

  return (
    <div className="p-0">
      <div className="max-w-7xl mx-auto">
        {/* Header removido: agora é renderizado no cabeçalho da página */}


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
                    ${isActive ? 'border-aurora-electric-purple bg-aurora-electric-purple text-white' : 
                      isCompleted ? 'border-aurora-emerald bg-aurora-emerald text-white' : 
                      'border-white/20 text-white/60'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-aurora-electric-purple' : 
                    isCompleted ? 'text-aurora-emerald' : 
                    'text-white/60'
                  }`}>
                    {step.label}
                  </span>
                  {index < 2 && (
                    <ArrowRight className="w-4 h-4 text-white/40 mx-3" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Main content area */}
        <div className={`grid gap-6 ${isSidebarVisible ? 'grid-cols-1 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {/* Main content */}
          <div className={`${isSidebarVisible ? 'xl:col-span-3' : ''} max-w-4xl mx-auto w-full`}>
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

          {/* Scientific insights sidebar */}
          {isSidebarVisible && (
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
          )}
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