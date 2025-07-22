
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, Stars } from 'lucide-react';

interface AuroraLoadingScreenProps {
  isLoading: boolean;
  mentor?: string;
}

const MENTOR_PHRASES = {
  criativo: [
    "Mentor Criativo afiando o lápis do sucesso...",
    "Preparando uma receita secreta de engajamento...",
    "Já já vem post com mais impacto que um lifting!",
    "Criatividade em modo turbo ligado..."
  ],
  vendedor: [
    "Post bom é aquele que vende sem parecer que está vendendo.",
    "Preparando argumentos irresistíveis...",
    "CTA poderoso sendo forjado...",
    "Você não posta só conteúdo... você posta autoridade."
  ],
  educativo: [
    "O feed vai brilhar como laser de última geração!",
    "Conhecimento científico virando storytelling...",
    "Educação + vendas = fórmula perfeita!",
    "Transformando ciência em conexão..."
  ],
  default: [
    "Mentor Criativo afiando o lápis do sucesso...",
    "O feed vai brilhar como laser de última geração!",
    "Post bom é aquele que vende sem parecer que está vendendo.",
    "Você não posta só conteúdo... você posta autoridade."
  ]
};

const AuroraLoadingScreen: React.FC<AuroraLoadingScreenProps> = ({ 
  isLoading, 
  mentor = 'default' 
}) => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = MENTOR_PHRASES[mentor as keyof typeof MENTOR_PHRASES] || MENTOR_PHRASES.default;

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isLoading, phrases.length]);

  if (!isLoading) return null;

  return (
    <div className="min-h-screen aurora-gradient-bg aurora-particles flex items-center justify-center relative overflow-hidden">
      {/* Partículas Aurora */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="aurora-particle absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#3b82f6' : '#10b981',
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Conteúdo Principal */}
      <div className="text-center space-y-8 max-w-md mx-auto px-6 relative z-10">
        {/* Esfera Místico Boreal */}
        <div className="relative mx-auto w-32 h-32">
          <motion.div
            className="aurora-sphere-outer absolute inset-0 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="aurora-sphere-middle absolute inset-2 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="aurora-sphere-core absolute inset-4 rounded-full flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wand2 className="h-12 w-12 text-white aurora-float" />
          </motion.div>
          <motion.div
            className="aurora-sphere-nucleus absolute inset-6 rounded-full bg-white/30"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="aurora-heading text-3xl font-bold flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 aurora-pulse" />
            Fluida Roteirista
          </h2>
          <p className="aurora-body text-lg">
            Criando seu roteiro perfeito com magia aurora...
          </p>
        </motion.div>

        {/* Frases dos Mentores */}
        <motion.div
          key={currentPhrase}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          className="aurora-glass p-6 rounded-2xl backdrop-blur-xl"
        >
          <p className="aurora-body text-lg italic font-medium">
            "{phrases[currentPhrase]}"
          </p>
        </motion.div>

        {/* Barra de Progresso Aurora */}
        <div className="relative">
          <div className="w-full h-3 aurora-glass rounded-full overflow-hidden">
            <motion.div
              className="h-full aurora-gradient-primary rounded-full aurora-shimmer"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>
          <motion.div
            className="absolute -top-1 w-5 h-5 rounded-full bg-white aurora-glow"
            animate={{ x: [0, 300, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        {/* Indicador com Estrelas */}
        <motion.div 
          className="flex items-center justify-center gap-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Stars className="h-5 w-5 aurora-electric-purple" />
          <span className="aurora-accent text-sm font-medium">
            Processando com IA Aurora...
          </span>
          <Stars className="h-5 w-5 aurora-neon-blue" />
        </motion.div>
      </div>
    </div>
  );
};

export default AuroraLoadingScreen;
