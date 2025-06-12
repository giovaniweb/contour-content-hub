
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Heart } from 'lucide-react';

interface DisneyTransformationProps {
  isActive: boolean;
  onComplete: () => void;
}

const DisneyTransformation: React.FC<DisneyTransformationProps> = ({ 
  isActive, 
  onComplete 
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (isActive) {
      // Criar partículas mágicas
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setParticles(newParticles);

      // Limpar após animação
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    >
      {/* Overlay mágico */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20"
      />

      {/* Partículas mágicas */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}vw`, 
              y: `${particle.y}vh`, 
              scale: 0, 
              opacity: 0 
            }}
            animate={{ 
              x: `${particle.x + (Math.random() - 0.5) * 20}vw`,
              y: `${particle.y - 20}vh`,
              scale: [0, 1, 0.5, 1, 0],
              opacity: [0, 1, 0.8, 0.6, 0],
              rotate: 360
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 3,
              ease: "easeOut",
              times: [0, 0.2, 0.5, 0.8, 1]
            }}
            className="absolute"
          >
            {particle.id % 3 === 0 ? (
              <Sparkles className="h-6 w-6 text-yellow-400" />
            ) : particle.id % 3 === 1 ? (
              <Star className="h-5 w-5 text-pink-400" />
            ) : (
              <Heart className="h-4 w-4 text-purple-400" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Texto mágico central */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              textShadow: [
                "0 0 10px #fbbf24",
                "0 0 20px #f59e0b", 
                "0 0 10px #fbbf24"
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-4xl font-bold text-yellow-400"
          >
            ✨ Disney Magic ✨
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-white mt-2"
          >
            Transformando seu roteiro em pura magia...
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DisneyTransformation;
