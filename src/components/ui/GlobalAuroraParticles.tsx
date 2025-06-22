
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
  count = 15, 
  active = true 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const colors = [
    '#C4B5FD', // lavender
    '#14B8A6', // teal
    '#06B6D4', // turquoise
    '#7C3AED', // deep violet
    '#F472B6', // soft pink
    '#3B82F6', // electric blue
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
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 8 + 12,
          delay: Math.random() * 3,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 10000);

    return () => clearInterval(interval);
  }, [count, active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-50"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: particle.x,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
          }}
          initial={{
            y: window.innerHeight + 20,
            opacity: 0,
          }}
          animate={{
            y: -50,
            opacity: [0, 0.8, 0.8, 0],
            x: particle.x + (Math.random() - 0.5) * 100,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 8,
          }}
        />
      ))}
    </div>
  );
};

export default GlobalAuroraParticles;
