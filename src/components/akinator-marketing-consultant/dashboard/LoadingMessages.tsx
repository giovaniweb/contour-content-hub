
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_MESSAGES = [
  "Respira fundo... O Mentor Estratégico está afinando a estratégia como uma sinfonia.",
  "Enquanto carrega, visualize sua clínica dominando o Instagram...",
  "A IA está analisando cada detalhe — tipo um peeling digital profundo!",
  "'O sucesso é um hábito... de quem posta com propósito.' — Mentor Expert",
  "Se fosse fácil, qualquer um faria. Mas você tem o Fluida.",
  "🎯 Calibrando os ganchos virais para sua especialidade...",
  "⚡ Mapeando o perfil da sua audiência ideal...",
  "🧠 Processando insights de marketing de alto impacto...",
  "💡 Conectando estratégias que convertem visualizações em consultas...",
  "🚀 Construindo seu plano de dominação digital..."
];

interface LoadingMessagesProps {
  isLoading: boolean;
}

const LoadingMessages: React.FC<LoadingMessagesProps> = ({ isLoading }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="text-center py-12">
      <div className="aurora-glass rounded-xl p-8 max-w-md mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <BrainCircuit className="h-16 w-16 text-aurora-electric-purple animate-pulse" />
            <Sparkles className="h-6 w-6 text-aurora-sage absolute -top-1 -right-1 animate-ping" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-4">
          🎯 Consultor Fluida Trabalhando
        </h3>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <p className="text-sm text-white leading-relaxed italic">
              {LOADING_MESSAGES[currentMessageIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center items-center space-x-1 mt-6">
          <div className="w-2 h-2 bg-aurora-electric-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-aurora-sage rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-aurora-deep-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="text-xs text-white mt-4">
          Pode levar até 60 segundos para análises complexas
        </p>
      </div>
    </div>
  );
};

export default LoadingMessages;
