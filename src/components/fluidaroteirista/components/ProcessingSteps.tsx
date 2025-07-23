import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Brain, 
  Wand2, 
  CheckCircle, 
  Loader2,
  BookOpen,
  Sparkles,
  Target
} from "lucide-react";

interface ProcessingStepsProps {
  progress: number;
  isGenerating: boolean;
  currentStep: string;
}

const ProcessingSteps: React.FC<ProcessingStepsProps> = ({
  progress,
  isGenerating,
  currentStep
}) => {
  const steps = [
    {
      id: 'search',
      label: 'Buscando artigos científicos',
      icon: Search,
      threshold: 20,
      description: 'Encontrando evidências científicas relevantes'
    },
    {
      id: 'analyze',
      label: 'Analisando base científica',
      icon: BookOpen,
      threshold: 40,
      description: 'Processando insights dos artigos encontrados'
    },
    {
      id: 'generate',
      label: 'Gerando roteiro com IA',
      icon: Brain,
      threshold: 70,
      description: 'Criando conteúdo fundamentado cientificamente'
    },
    {
      id: 'optimize',
      label: 'Otimizando resultado',
      icon: Wand2,
      threshold: 90,
      description: 'Refinando e validando o roteiro gerado'
    },
    {
      id: 'complete',
      label: 'Finalizando',
      icon: Sparkles,
      threshold: 100,
      description: 'Preparando resultado final'
    }
  ];

  const getStepStatus = (stepThreshold: number) => {
    if (progress >= stepThreshold) return 'completed';
    if (progress >= stepThreshold - 20) return 'active';
    return 'pending';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <motion.div
            animate={{ rotate: isGenerating ? 360 : 0 }}
            transition={{ 
              duration: 2, 
              repeat: isGenerating ? Infinity : 0, 
              ease: "linear" 
            }}
            className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          
          <CardTitle className="text-2xl text-white mb-2">
            Processando com IA Avançada
          </CardTitle>
          
          <p className="text-slate-400">
            Criando seu roteiro com base científica sólida
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar Global */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Progresso Geral</span>
              <span className="text-sm text-purple-400 font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2" 
            />
          </div>

          {/* Current Step Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              </div>
              <div>
                <h4 className="text-white font-medium">{currentStep}</h4>
                <p className="text-slate-400 text-sm">Processando...</p>
              </div>
            </div>
          </motion.div>

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const status = getStepStatus(step.threshold);
              const StepIcon = step.icon;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    status === 'completed' 
                      ? 'bg-emerald-500/10 border border-emerald-500/20' 
                      : status === 'active'
                      ? 'bg-purple-500/10 border border-purple-500/20'
                      : 'bg-slate-700/30 border border-slate-600'
                  }`}
                >
                  {/* Step Icon */}
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-emerald-500/20'
                      : status === 'active'
                      ? 'bg-purple-500/20'
                      : 'bg-slate-600/20'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : status === 'active' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <StepIcon className="w-5 h-5 text-purple-400" />
                      </motion.div>
                    ) : (
                      <StepIcon className="w-5 h-5 text-slate-500" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h4 className={`font-medium transition-colors duration-300 ${
                      status === 'completed'
                        ? 'text-emerald-400'
                        : status === 'active'
                        ? 'text-purple-400'
                        : 'text-slate-400'
                    }`}>
                      {step.label}
                    </h4>
                    <p className="text-slate-500 text-sm">
                      {step.description}
                    </p>
                  </div>

                  {/* Step Progress */}
                  <div className="text-right">
                    {status === 'completed' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-emerald-400 font-medium text-sm"
                      >
                        ✓ Concluído
                      </motion.div>
                    )}
                    {status === 'active' && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-purple-400 font-medium text-sm"
                      >
                        Em andamento...
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium text-sm">VOCÊ SABIA?</span>
            </div>
            <p className="text-slate-300 text-sm">
              Roteiros baseados em evidências científicas têm <strong>75% mais credibilidade</strong> e 
              geram <strong>40% mais engajamento</strong> que conteúdos sem fundamentação.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProcessingSteps;