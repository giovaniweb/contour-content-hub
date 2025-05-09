
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface ThinkingAnimationProps {
  messages?: string[];
}

const defaultMessages = [
  "Analisando sua ideia...",
  "Consultando nossa inteligência estratégica...",
  "Avaliando potencial de engajamento...",
  "Calculando viabilidade...",
  "Finalizando a análise..."
];

const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({ 
  messages = defaultMessages 
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  
  // Rotate through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mb-6">
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-r from-fluida-blue to-fluida-pink opacity-20"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.2, 0.3, 0.2] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3 
          }}
        />
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{ 
            rotate: [0, 360] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "linear"
          }}
        >
          <Brain className="h-8 w-8 text-fluida-blue" />
        </motion.div>
      </div>
      
      <motion.div
        key={currentMessage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h3 className="text-xl font-medium mb-2 text-white">{messages[currentMessage]}</h3>
        <div className="flex gap-2 justify-center mt-3">
          <motion.div 
            className="h-2 w-2 rounded-full bg-fluida-blue"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              delay: 0
            }}
          />
          <motion.div 
            className="h-2 w-2 rounded-full bg-fluida-pink"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              delay: 0.5
            }}
          />
          <motion.div 
            className="h-2 w-2 rounded-full bg-fluida-blue"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              delay: 1.0
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThinkingAnimation;
