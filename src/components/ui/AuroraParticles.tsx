
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

const AuroraParticles: React.FC<{ count?: number; active?: boolean }> = ({ 
  count = 20, 
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
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 10 + 15,
          delay: Math.random() * 5,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 8000);

    return () => clearInterval(interval);
  }, [count, active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-60"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: particle.x,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          initial={{
            y: window.innerHeight + 20,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            y: -100,
            opacity: [0, 1, 1, 0],
            rotate: 360,
            x: particle.x + (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 5,
          }}
        />
      ))}
    </div>
  );
};

export default AuroraParticles;
