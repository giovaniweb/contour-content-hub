
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const GlobalAuroraParticles: React.FC<{ count?: number; active?: boolean }> = ({ 
  count = 8, // Reduzido drasticamente
  active = true 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const colors = [
    '#C4B5FD', // lavender
    '#14B8A6', // teal
    '#06B6D4', // turquoise
    '#7C3AED', // deep violet
  ];

  useEffect(() => {
    if (!active) return;

    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 20,
          size: Math.random() * 2 + 1, // Tamanhos menores
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 10 + 15, // Mais lento
          delay: Math.random() * 5,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 15000); // Menos frequente

    return () => clearInterval(interval);
  }, [count, active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-30" // Opacidade reduzida
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: particle.x,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            willChange: 'transform, opacity',
          }}
          initial={{
            y: window.innerHeight + 20,
            opacity: 0,
          }}
          animate={{
            y: -50,
            opacity: [0, 0.6, 0.6, 0],
            x: particle.x + (Math.random() - 0.5) * 50, // Movimento reduzido
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 10,
          }}
        />
      ))}
    </div>
  );
};

export default GlobalAuroraParticles;
