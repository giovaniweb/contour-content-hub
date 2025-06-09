
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mensagens consolidadas dos mentores conforme prompt
const MENTOR_LOADING_MESSAGES = [
  "Respira fundo... O Mentor Estratégico está afinando a estratégia como uma sinfonia.",
  "Enquanto carrega, visualize sua clínica dominando o Instagram...",
  "A IA está analisando cada detalhe — tipo um peeling digital profundo!",
  "'O sucesso é um hábito... de quem posta com propósito.' — Mentor Expert",
  "Se fosse fácil, qualquer um faria. Mas você tem o Fluida.",
  "🎯 Calibrando os ganchos virais para sua especialidade...",
  "⚡ Mapeando o perfil da sua audiência ideal...",
  "🧠 Processando insights de marketing de alto impacto...",
  "💡 Conectando estratégias que convertem visualizações em consultas...",
  "🚀 Construindo seu plano de dominação digital...",
  "📊 Analisando dados com precisão de mentor estratégico...",
  "🎭 Decodificando o DNA da sua clínica...",
  "💎 Lapidando estratégias exclusivas para você...",
  "🔮 Prevendo tendências do seu mercado...",
  "⭐ Acessando inteligência de marketing premium...",
  "🎪 'Transformação não é mágica, é método' — Mentor Misterioso",
  "🎯 'Quem não aparece, não vende. Quem aparece mal, vende menos' — Estrategista",
  "🌟 'Autoridade se constrói compartilhando conhecimento' — Consultor Expert",
  "💼 'A consistência vence a perfeição em marketing digital' — Mentor Digital",
  "🎨 'Humanizar é mais importante que vender' — Especialista em Conexão"
];

interface LoadingMessagesProps {
  isLoading: boolean;
}

const LoadingMessages: React.FC<LoadingMessagesProps> = ({ isLoading }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setTimeElapsed(0);
      return;
    }

    // Contador de tempo mais preciso
    const timeInterval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Mudança de mensagens a cada 3 segundos conforme especificado
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % MENTOR_LOADING_MESSAGES.length);
    }, 3000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

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
            <p className="text-sm text-white leading-relaxed italic min-h-[3rem] flex items-center justify-center">
              {MENTOR_LOADING_MESSAGES[currentMessageIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center items-center space-x-1 mt-6">
          <div className="w-2 h-2 bg-aurora-electric-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-aurora-sage rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-aurora-deep-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <div className="mt-4 space-y-2">
          <p className="text-xs text-white">
            Tempo: {formatTime(timeElapsed)} / 60s máximo
          </p>
          <div className="w-full bg-aurora-deep-purple/30 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-aurora-electric-purple to-aurora-sage h-1 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((timeElapsed / 60) * 100, 100)}%` }}
            />
          </div>
          
          <p className="text-xs text-white opacity-70 mt-2">
            {timeElapsed < 30 ? '📊 Analisando perfil da clínica...' : 
             timeElapsed < 45 ? '🎯 Criando estratégias personalizadas...' : 
             '✨ Finalizando diagnóstico...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessages;
