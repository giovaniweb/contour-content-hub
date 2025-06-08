
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, Target, Wand2, Brain } from "lucide-react";

const GeneratingStep: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    {
      icon: Brain,
      title: "Analisando sua intenção...",
      subtitle: "🧠 Compreendendo o objetivo do seu conteúdo",
      tip: "💡 Dica: Roteiros com propósito claro geram 3x mais engajamento!"
    },
    {
      icon: Target,
      title: "Identificando o mentor ideal...",
      subtitle: "🎯 Selecionando o estilo de comunicação perfeito",
      tip: "✨ Cada mentor tem técnicas únicas para conectar com seu público!"
    },
    {
      icon: Lightbulb,
      title: "Criando estrutura narrativa...",
      subtitle: "📝 Desenvolvendo gancho, desenvolvimento e CTA",
      tip: "🚀 Roteiros estruturados convertem até 5x mais que textos soltos!"
    },
    {
      icon: Wand2,
      title: "Aplicando técnicas avançadas...",
      subtitle: "⚡ Otimizando para o formato e plataforma escolhidos",
      tip: "🎬 Cada formato tem segredos para maximizar resultados!"
    },
    {
      icon: Sparkles,
      title: "Finalizando seu roteiro...",
      subtitle: "✨ Últimos ajustes para perfeição",
      tip: "🎉 Quase pronto! Seu roteiro personalizado está sendo finalizado!"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 12 + 3;
        
        // Atualizar fase baseado no progresso
        if (newProgress > 80 && currentPhase < 4) setCurrentPhase(4);
        else if (newProgress > 60 && currentPhase < 3) setCurrentPhase(3);
        else if (newProgress > 40 && currentPhase < 2) setCurrentPhase(2);
        else if (newProgress > 20 && currentPhase < 1) setCurrentPhase(1);
        
        return Math.min(newProgress, 95);
      });
    }, 800);

    return () => clearInterval(interval);
  }, [currentPhase]);

  const currentPhaseData = phases[currentPhase];
  const CurrentIcon = currentPhaseData.icon;

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Animated Icon */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-lg"
            >
              <CurrentIcon className="h-10 w-10 text-white" />
            </motion.div>

            {/* Current Phase */}
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-xl font-bold text-foreground">
                {currentPhaseData.title}
              </h3>
              <p className="text-muted-foreground">
                {currentPhaseData.subtitle}
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <Progress value={progress} className="h-3 bg-secondary" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {Math.round(progress)}% concluído
                </span>
                <motion.span 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-primary font-medium"
                >
                  Fase {currentPhase + 1} de {phases.length}
                </motion.span>
              </div>
            </div>

            {/* Tip Card */}
            <motion.div
              key={`tip-${currentPhase}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20"
            >
              <p className="text-primary font-medium">
                {currentPhaseData.tip}
              </p>
            </motion.div>

            {/* Phase Indicators */}
            <div className="flex justify-center space-x-2 pt-4">
              {phases.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentPhase 
                      ? 'bg-primary shadow-md' 
                      : 'bg-muted'
                  }`}
                  animate={index === currentPhase ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              ))}
            </div>

            {/* Footer Message */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                🤖 IA Fluida trabalhando para criar seu roteiro perfeito...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratingStep;
