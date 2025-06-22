
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

interface GlobalAuroraParticlesProps {
  count?: number;
  active?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
}

const GlobalAuroraParticles: React.FC<GlobalAuroraParticlesProps> = ({ 
  count = 20, 
  active = true,
  intensity = 'medium',
  interactive = true
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const colors = [
    '#C4B5FD', // lavender
    '#14B8A6', // teal
    '#06B6D4', // turquoise
    '#7C3AED', // deep violet
    '#F472B6', // soft pink
    '#3B82F6', // electric blue
    '#10B981', // emerald
    '#84CC16', // lime
  ];

  const getIntensitySettings = () => {
    switch (intensity) {
      case 'low':
        return { particles: Math.floor(count * 0.5), duration: 20, delay: 8 };
      case 'high':
        return { particles: Math.floor(count * 1.5), duration: 10, delay: 3 };
      default:
        return { particles: count, duration: 15, delay: 5 };
    }
  };

  useEffect(() => {
    if (!active) return;

    const settings = getIntensitySettings();

    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < settings.particles; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 20,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 10 + settings.duration,
          delay: Math.random() * settings.delay,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, settings.delay * 1000);

    return () => clearInterval(interval);
  }, [count, active, intensity]);

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
          }}
          animate={{
            y: -100,
            opacity: [0, 1, 1, 0],
            x: particle.x + (Math.random() - 0.5) * 100, // Reduced movement
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

export default GlobalAuroraParticles;
