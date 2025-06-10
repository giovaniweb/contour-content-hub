
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, Loader2 } from 'lucide-react';

interface FluidaLoadingMessagesProps {
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

const FluidaLoadingMessages: React.FC<FluidaLoadingMessagesProps> = ({ 
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Ícone animado */}
        <motion.div
          className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
        >
          <Wand2 className="h-10 w-10 text-white" />
        </motion.div>

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            FLUIDAROTEIRISTA
          </h2>
          <p className="text-gray-600">Criando seu roteiro perfeito...</p>
        </motion.div>

        {/* Frases rotativas dos mentores */}
        <motion.div
          key={currentPhrase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg"
        >
          <p className="text-lg text-gray-700 italic">
            "{phrases[currentPhrase]}"
          </p>
        </motion.div>

        {/* Barra de progresso animada */}
        <motion.div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </motion.div>

        {/* Loader spinner */}
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Processando com IA...</span>
        </div>
      </div>
    </div>
  );
};

export default FluidaLoadingMessages;
