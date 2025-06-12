
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wand2, Clock, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FluidaLoadingScreenProps {
  mentor: string;
  onCancel?: () => void;
}

const MENTOR_PHRASES = {
  akinator: [
    "🤖 Analisando suas respostas...",
    "🎯 Definindo estratégia personalizada...",
    "✨ Criando roteiro sob medida...",
    "🚀 Aplicando elementos universais...",
    "📝 Finalizando seu roteiro perfeito..."
  ],
  "10_elementos": [
    "🚀 Ativando modo ROCKET...",
    "⚡ Integrando 10 elementos universais...",
    "🎯 Aplicando storytelling avançado...",
    "💡 Otimizando copywriting...",
    "🎬 Gerando roteiro de alta conversão..."
  ],
  criativo: [
    "🎨 Mentor Criativo afiando o lápis do sucesso...",
    "✨ Preparando uma receita secreta de engajamento...",
    "🎭 Já já vem post com mais impacto que um lifting!",
    "🚀 Criatividade em modo turbo ligado...",
    "🎬 Finalizando roteiro mágico..."
  ],
  default: [
    "🎬 FLUIDAROTEIRISTA iniciando...",
    "🤖 IA processando suas informações...",
    "✨ Criando roteiro personalizado...",
    "🎯 Aplicando estratégias de conversão...",
    "📝 Finalizando seu conteúdo..."
  ]
};

const FluidaLoadingScreen: React.FC<FluidaLoadingScreenProps> = ({ 
  mentor, 
  onCancel 
}) => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const phrases = MENTOR_PHRASES[mentor as keyof typeof MENTOR_PHRASES] || MENTOR_PHRASES.default;

  useEffect(() => {
    // Atualizar frase a cada 3 segundos
    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);

    // Simular progresso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // Parar em 95% até a resposta real
        return prev + Math.random() * 3; // Incremento aleatório
      });
    }, 1000);

    // Contador de tempo
    const timeInterval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [phrases.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEstimatedTime = () => {
    if (timeElapsed < 15) return "Estimativa: 30-45 segundos";
    if (timeElapsed < 30) return "Quase pronto...";
    if (timeElapsed < 45) return "Processamento complexo em andamento...";
    return "Aguarde mais um pouco...";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aurora-background">
      <div className="text-center space-y-8 max-w-md px-6">
        {/* Aurora Animation */}
        <motion.div
          className="relative mx-auto w-32 h-32"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute inset-0 bg-aurora-gradient-primary rounded-full opacity-20 blur-xl"></div>
          <div className="absolute inset-4 bg-aurora-gradient-secondary rounded-full opacity-30 blur-lg"></div>
          <div className="absolute inset-8 bg-white rounded-full opacity-40 blur-md"></div>
          <div className="absolute inset-12 flex items-center justify-center">
            <Wand2 className="h-8 w-8 text-white" />
          </div>
        </motion.div>

        {/* Loading Text */}
        <div className="space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
          >
            FLUIDAROTEIRISTA 🎬
          </motion.h2>
          
          <motion.div
            key={currentPhrase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-slate-300 font-medium"
          >
            {phrases[currentPhrase]}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-aurora-gradient-primary rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-slate-400">
            <span>{Math.round(progress)}%</span>
            <span>{getEstimatedTime()}</span>
          </div>
        </div>

        {/* Time Indicator */}
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{formatTime(timeElapsed)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-aurora-electric-purple" />
            <span className="text-sm">IA Processando</span>
          </div>
        </div>

        {/* Spinning Loader */}
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Criando magia...</span>
        </div>

        {/* Cancel Button (appears after 30 seconds) */}
        {timeElapsed > 30 && onCancel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4"
          >
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500/10"
            >
              Cancelar Geração
            </Button>
            <p className="text-xs text-slate-500 mt-2">
              A geração está demorando mais que o esperado
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FluidaLoadingScreen;
