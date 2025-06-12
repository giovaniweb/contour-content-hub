
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wand2 } from 'lucide-react';

interface FluidaLoadingScreenProps {
  mentor: string;
}

const MENTOR_PHRASES = {
  criativo: [
    "Mentor Criativo afiando o lápis do sucesso...",
    "Já já vem post com mais impacto que um lifting!",
    "O feed vai brilhar como laser de última geração!",
    "Criando roteiro que vende sem parecer que está vendendo...",
    "Você não posta só conteúdo... você posta autoridade.",
    "Transformando ideias em roteiros virais...",
    "Misturando criatividade com estratégia...",
  ],
  estrategico: [
    "Mentor Estratégico calculando cada palavra...",
    "Analisando dados para máximo engajamento...",
    "Estruturando roteiro com base em conversões...",
    "ROI do conteúdo sendo otimizado...",
  ],
  emocional: [
    "Mentor Emocional conectando corações...",
    "Criando narrativas que tocam a alma...",
    "Histórias que transformam vidas sendo escritas...",
    "Emoção e persuasão andando juntas...",
  ]
};

const FluidaLoadingScreen: React.FC<FluidaLoadingScreenProps> = ({ mentor }) => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = MENTOR_PHRASES[mentor as keyof typeof MENTOR_PHRASES] || MENTOR_PHRASES.criativo;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-aurora-background">
      <div className="text-center space-y-8 max-w-md">
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
            className="text-slate-300"
          >
            {phrases[currentPhrase]}
          </motion.div>
        </div>

        {/* Progress Animation */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-aurora-gradient-primary"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Spinning Loader */}
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Criando magia...</span>
        </div>
      </div>
    </div>
  );
};

export default FluidaLoadingScreen;
