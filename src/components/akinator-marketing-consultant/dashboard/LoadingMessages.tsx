import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Sparkles, Target, TrendingUp, Users, Lightbulb } from 'lucide-react';
interface LoadingMessagesProps {
  isLoading: boolean;
}
const LoadingMessages: React.FC<LoadingMessagesProps> = ({
  isLoading
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const mentorMessages = [{
    text: "Respira fundo... O Consultor Fluida está afinando a estratégia como uma sinfonia.",
    icon: <BrainCircuit className="h-5 w-5" />
  }, {
    text: "Enquanto carrega, visualize sua clínica dominando o Instagram...",
    icon: <Target className="h-5 w-5" />
  }, {
    text: "A IA está analisando cada detalhe — tipo um peeling digital profundo!",
    icon: <Sparkles className="h-5 w-5" />
  }, {
    text: "'O sucesso é um hábito... de quem posta com propósito.' — Mentor Expert",
    icon: <TrendingUp className="h-5 w-5" />
  }, {
    text: "Se fosse fácil, qualquer um faria. Mas você tem o Fluida.",
    icon: <Users className="h-5 w-5" />
  }, {
    text: "Criando insights que vão fazer sua concorrência se perguntar: 'Como eles fazem isso?'",
    icon: <Lightbulb className="h-5 w-5" />
  }, {
    text: "Processando dados como um mentor experiente analisa o mercado...",
    icon: <BrainCircuit className="h-5 w-5" />
  }, {
    text: "Sua estratégia está sendo moldada com precisão cirúrgica.",
    icon: <Target className="h-5 w-5" />
  }];
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % mentorMessages.length);
    }, 3000); // Rotaciona a cada 3 segundos

    return () => clearInterval(interval);
  }, [isLoading, mentorMessages.length]);
  if (!isLoading) return null;
  return <div className="container mx-auto max-w-4xl py-12">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Círculo pulsante principal */}
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-aurora-electric-purple to-aurora-sage rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-aurora-deep-purple to-aurora-electric-purple rounded-full animate-ping mx-[10px] my-[10px]"></div>
            <div className="absolute inset-4 bg-aurora-dark rounded-full flex items-center justify-center">
              <BrainCircuit className="h-12 w-12 text-aurora-sage animate-spin" />
            </div>
          </div>

          {/* 6 pontinhos em onda abaixo do círculo */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 flex space-x-3">
            {[...Array(6)].map((_, i) => <div key={i} className="w-3 h-3 bg-aurora-sage rounded-full wave-dot" />)}
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          🎯 Consultor Fluida Trabalhando
        </h2>

        <p className="text-aurora-sage mb-8 text-lg">
          Analisando seu perfil e gerando estratégias personalizadas...
        </p>

        {/* Container das mensagens rotativas */}
        <div className="bg-aurora-electric-purple/10 rounded-2xl p-6 max-w-2xl mx-auto min-h-[120px] flex items-center justify-center border border-aurora-electric-purple/20">
          <AnimatePresence mode="wait">
            <motion.div key={currentMessageIndex} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} transition={{
            duration: 0.5
          }} className="flex items-center gap-4">
              <div className="p-3 bg-aurora-sage/20 rounded-full text-aurora-sage">
                {mentorMessages[currentMessageIndex]?.icon}
              </div>
              <p className="text-white text-lg font-medium italic">
                {mentorMessages[currentMessageIndex]?.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Barra de progresso indeterminada */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="h-2 bg-aurora-electric-purple/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-aurora-electric-purple to-aurora-sage rounded-full animate-pulse"></div>
          </div>
          <p className="text-aurora-sage text-sm mt-2">
            Pode levar até 60 segundos...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes waveAnimation {
          0%, 60%, 100% { 
            transform: scale(1);
            opacity: 0.7;
          }
          30% { 
            transform: scale(1.4);
            opacity: 1;
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
          }
        }
        
        .wave-dot {
          animation: waveAnimation 1.8s ease-in-out infinite;
        }
        
        .wave-dot:nth-child(1) { animation-delay: 0s; }
        .wave-dot:nth-child(2) { animation-delay: 0.3s; }
        .wave-dot:nth-child(3) { animation-delay: 0.6s; }
        .wave-dot:nth-child(4) { animation-delay: 0.9s; }
        .wave-dot:nth-child(5) { animation-delay: 1.2s; }
        .wave-dot:nth-child(6) { animation-delay: 1.5s; }
      `}</style>
    </div>;
};
export default LoadingMessages;