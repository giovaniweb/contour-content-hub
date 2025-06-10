
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MagicalParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface MagicalButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  isActive?: boolean;
}

const MagicalButton: React.FC<MagicalButtonProps> = ({
  onClick,
  disabled = false,
  children,
  isActive = false
}) => {
  const [particles, setParticles] = useState<MagicalParticle[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const magicColors = [
    '#FFD700', // dourado
    '#FF69B4', // rosa mágico
    '#9370DB', // roxo
    '#00CED1', // turquesa
    '#FFA500', // laranja dourado
    '#DA70D6'  // orquídea
  ];

  const generateParticles = () => {
    const newParticles: MagicalParticle[] = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * 300 - 150,
        y: Math.random() * 100 - 50,
        size: Math.random() * 6 + 2,
        color: magicColors[Math.floor(Math.random() * magicColors.length)],
        duration: Math.random() * 2 + 1.5,
        delay: Math.random() * 0.5,
      });
    }
    setParticles(newParticles);
    
    // Limpar partículas depois de um tempo
    setTimeout(() => setParticles([]), 3000);
  };

  const handleClick = () => {
    generateParticles();
    onClick();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    generateParticles();
  };

  return (
    <div className="relative inline-block">
      {/* Partículas mágicas */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              left: '50%',
              top: '50%',
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Botão principal */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Button
          onClick={handleClick}
          disabled={disabled}
          className={`
            relative overflow-hidden px-8 py-4 text-lg font-bold
            bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400
            hover:from-purple-700 hover:via-pink-600 hover:to-orange-500
            text-white border-0 rounded-full
            shadow-lg hover:shadow-2xl
            transition-all duration-300
            ${isActive ? 'ring-4 ring-purple-300 ring-opacity-50' : ''}
          `}
        >
          {/* Efeito shimmer de fundo */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
          />
          
          {/* Glow de fundo */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-orange-400/20 blur-xl" />
          
          {/* Conteúdo do botão */}
          <div className="relative z-10 flex items-center gap-3">
            <motion.div
              animate={isHovered ? { rotate: [0, 15, -15, 0] } : {}}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
            >
              <Wand2 className="h-6 w-6" />
            </motion.div>
            
            <span>{children}</span>
            
            <motion.div
              animate={{ 
                scale: isHovered ? [1, 1.2, 1] : 1,
                rotate: isHovered ? [0, 360] : 0 
              }}
              transition={{ 
                duration: 1, 
                repeat: isHovered ? Infinity : 0,
                ease: "easeInOut" 
              }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
          </div>
        </Button>
      </motion.div>
    </div>
  );
};

export default MagicalButton;
