
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Sparkles, Target, TrendingUp, Users, Lightbulb, Heart, Clock } from 'lucide-react';

interface LoadingMessagesProps {
  isLoading: boolean;
}

const LoadingMessages: React.FC<LoadingMessagesProps> = ({
  isLoading
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0); // 0: normal, 1: mentors, 2: patience, 3: love
  
  // Mensagens por fase de tempo
  const messagePhases = [
    // 0-30s: Mensagens normais
    [{
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
    }],
    
    // 30-60s: Mensagens dos mentores
    [{
      text: "Nossos mentores estão se reunindo para te entregar dados precisos e estratégias únicas...",
      icon: <Users className="h-5 w-5" />
    }, {
      text: "O time de especialistas está calibrando sua análise com cuidado cirúrgico...",
      icon: <Target className="h-5 w-5" />
    }, {
      text: "Estamos consultando nossa base de conhecimento com +10.000 casos de sucesso...",
      icon: <Lightbulb className="h-5 w-5" />
    }],
    
    // 60-90s: Mensagens de paciência
    [{
      text: "Calma, não travou! Estamos analisando seus dados com a precisão de um procedimento estético...",
      icon: <Clock className="h-5 w-5" />
    }, {
      text: "Relaxa... Boas estratégias demoram para nascer, como um bom resultado de skincare!",
      icon: <Sparkles className="h-5 w-5" />
    }, {
      text: "Tudo funcionando perfeitamente! Só estamos sendo minuciosos como você é com seus pacientes.",
      icon: <BrainCircuit className="h-5 w-5" />
    }],
    
    // 90s+: Mensagens motivacionais
    [{
      text: "Estamos quase lá... Aproveita para mandar uma mensagem para alguém que você ama ❤️",
      icon: <Heart className="h-5 w-5" />
    }, {
      text: "Que tal respirar fundo e pensar no impacto que você causa na vida dos seus pacientes?",
      icon: <Heart className="h-5 w-5" />
    }, {
      text: "Tempo para um café? Ou uma água? Estamos nos últimos ajustes da sua estratégia!",
      icon: <Sparkles className="h-5 w-5" />
    }]
  ];

  // Timer para contar segundos e mudar fase
  useEffect(() => {
    if (!isLoading) return;
    
    const timer = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        
        // Determinar fase baseada no tempo
        if (newTime >= 90) {
          setCurrentPhase(3);
        } else if (newTime >= 60) {
          setCurrentPhase(2);
        } else if (newTime >= 30) {
          setCurrentPhase(1);
        } else {
          setCurrentPhase(0);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading]);

  // Rotacionar mensagens dentro da fase atual
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        const currentMessages = messagePhases[currentPhase];
        return (prev + 1) % currentMessages.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoading, currentPhase]);

  // Reset quando começa loading
  useEffect(() => {
    if (isLoading) {
      setElapsedTime(0);
      setCurrentPhase(0);
      setCurrentMessageIndex(0);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  const currentMessages = messagePhases[currentPhase];
  const currentMessage = currentMessages[currentMessageIndex];

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="text-center">
        {/* Esfera Místico Boreal */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Aura externa - Aurora Boreal */}
            <div className="absolute inset-0 rounded-full opacity-70 aurora-sphere-outer"></div>
            
            {/* Camada média - Gradiente rotativo */}
            <div className="absolute inset-2 rounded-full aurora-sphere-middle"></div>
            
            {/* Núcleo interno - Brilho central */}
            <div className="absolute inset-4 rounded-full aurora-sphere-core flex items-center justify-center">
              <div className="w-8 h-8 bg-white/80 rounded-full aurora-sphere-nucleus"></div>
            </div>
            
            {/* Partículas flutuantes */}
            <div className="absolute inset-0 aurora-particles">
              <div className="absolute top-2 right-4 w-1 h-1 bg-aurora-electric-purple rounded-full animate-ping"></div>
              <div className="absolute bottom-3 left-6 w-1 h-1 bg-aurora-sage rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-8 left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          🎯 Consultor Fluida Trabalhando
        </h2>

        <p className="text-aurora-sage mb-2 text-lg">
          Analisando seu perfil e gerando estratégias personalizadas...
        </p>
        
        {/* Contador de tempo discreto */}
        <p className="text-white/40 text-sm mb-6">
          {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
        </p>

        {/* Container das mensagens rotativas */}
        <div className="bg-aurora-electric-purple/10 rounded-2xl p-6 max-w-2xl mx-auto min-h-[120px] flex items-center justify-center border border-aurora-electric-purple/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentPhase}-${currentMessageIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="p-3 bg-aurora-sage/20 rounded-full text-aurora-sage">
                {currentMessage?.icon}
              </div>
              <p className="text-white text-lg font-medium italic">
                {currentMessage?.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Barra de progresso indeterminada com indicador de fase */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="h-2 bg-aurora-electric-purple/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-aurora-electric-purple to-aurora-sage rounded-full animate-pulse"></div>
          </div>
          <p className="text-aurora-sage text-sm mt-2">
            {currentPhase === 0 && "Iniciando análise..."}
            {currentPhase === 1 && "Consultando especialistas..."}
            {currentPhase === 2 && "Processamento aprofundado..."}
            {currentPhase === 3 && "Finalizando estratégia..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessages;
