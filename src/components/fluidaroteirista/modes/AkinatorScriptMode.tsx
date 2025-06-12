
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Wand2 } from "lucide-react";
import FluidaLoadingScreen from '../components/FluidaLoadingScreen';
import { SCRIPT_INTENTION_TREE } from '../constants/intentionTree';

interface AkinatorScriptModeProps {
  onScriptGenerated: (script: any) => void;
  onGoBack: () => void;
  generateScript: (data: any) => Promise<void>;
  isGenerating: boolean;
}

const AkinatorScriptMode: React.FC<AkinatorScriptModeProps> = ({
  onScriptGenerated,
  onGoBack,
  generateScript,
  isGenerating
}) => {
  const [currentStep, setCurrentStep] = useState('root');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [stepHistory, setStepHistory] = useState<string[]>(['root']);

  const currentQuestion = SCRIPT_INTENTION_TREE[currentStep];

  const handleAnswer = (value: string) => {
    const selectedOption = currentQuestion.options.find(opt => opt.value === value);
    
    // Salvar resposta
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);

    // Navegar para próximo passo
    if (selectedOption?.leads_to) {
      const nextStep = selectedOption.leads_to;
      setCurrentStep(nextStep);
      setStepHistory([...stepHistory, nextStep]);
    } else if (currentStep === 'tema') {
      // Última etapa - gerar roteiro
      handleGenerateScript(newAnswers);
    }
  };

  const handleGenerateScript = async (finalAnswers: Record<string, string>) => {
    try {
      await generateScript({
        tipo_conteudo: finalAnswers.root || 'carrossel',
        objetivo: finalAnswers.objetivo || 'atrair',
        canal: finalAnswers.canal || 'instagram',
        estilo: finalAnswers.estilo || 'criativo',
        equipamento: finalAnswers.equipamento || '',
        tema: finalAnswers.tema || ''
      });
      onScriptGenerated(true);
    } catch (error) {
      console.error('Erro ao gerar roteiro:', error);
    }
  };

  const handleGoBackStep = () => {
    if (stepHistory.length > 1) {
      const newHistory = stepHistory.slice(0, -1);
      const previousStep = newHistory[newHistory.length - 1];
      setStepHistory(newHistory);
      setCurrentStep(previousStep);
      
      // Remover resposta do step atual
      const newAnswers = { ...answers };
      delete newAnswers[currentStep];
      setAnswers(newAnswers);
    } else {
      onGoBack();
    }
  };

  if (isGenerating) {
    return <FluidaLoadingScreen mentor="criativo" />;
  }

  if (currentStep === 'tema') {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleGoBackStep} className="text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <CardTitle className="text-white text-center flex-1">
                🎯 Qual é o tema do seu roteiro?
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <textarea
                placeholder="Ex: Como eliminar melasma em 30 dias, Protocolo anti-idade revolucionário, Lifting sem cirurgia..."
                className="w-full h-32 p-4 rounded-lg bg-slate-800/50 border border-aurora-electric-purple/30 text-white placeholder-slate-400 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const value = (e.target as HTMLTextAreaElement).value.trim();
                    if (value) {
                      handleAnswer(value);
                    }
                  }
                }}
              />
              <Button 
                className="w-full bg-aurora-gradient-primary hover:opacity-90 text-white"
                onClick={() => {
                  const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                  const value = textarea?.value.trim();
                  if (value) {
                    handleAnswer(value);
                  }
                }}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Gerar Roteiro FLUIDA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card className="aurora-glass border-aurora-electric-purple/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleGoBackStep} className="text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {stepHistory.length > 1 ? 'Voltar' : 'Início'}
            </Button>
            <div className="text-center">
              <CardTitle className="text-white">
                {currentQuestion.question}
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                Passo {stepHistory.length} de 6
              </p>
            </div>
            <div className="w-20" /> {/* Spacer */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="aurora-glass border-aurora-electric-purple/20 hover:border-aurora-electric-purple/40 cursor-pointer transition-all h-full"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="text-3xl">{option.emoji}</div>
                      <h3 className="text-white font-medium">{option.label}</h3>
                      <p className="text-sm text-slate-400">{option.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AkinatorScriptMode;
