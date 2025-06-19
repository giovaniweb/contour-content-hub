
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
  type: 'snowflake' | 'star' | 'light' | 'sparkle';
}

interface GlobalAuroraParticlesProps {
  count?: number;
  active?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
}

const GlobalAuroraParticles: React.FC<GlobalAuroraParticlesProps> = ({ 
  count = 25, 
  active = true,
  intensity = 'medium',
  interactive = true
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const colors = [
    '#C4B5FD', // aurora lavender
    '#14B8A6', // aurora teal
    '#06B6D4', // aurora turquoise
    '#7C3AED', // aurora deep violet
    '#F472B6', // aurora soft pink
    '#3B82F6', // aurora electric blue
    '#10B981', // aurora emerald
    '#84CC16', // aurora lime
    '#8B5CF6', // aurora electric purple
    '#FFFFFF', // pure white for snowflakes
  ];

  const particleTypes = ['snowflake', 'star', 'light', 'sparkle'] as const;

  const getIntensityMultiplier = () => {
    switch (intensity) {
      case 'low': return 0.5;
      case 'high': return 1.5;
      default: return 1;
    }
  };

  useEffect(() => {
    if (!active) return;

    const adjustedCount = Math.floor(count * getIntensityMultiplier());

    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < adjustedCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 20,
          size: Math.random() * 6 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 15 + 10,
          delay: Math.random() * 8,
          type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 12000);

    return () => clearInterval(interval);
  }, [count, active, intensity]);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  const getParticleShape = (type: Particle['type'], size: number) => {
    switch (type) {
      case 'snowflake':
        return (
          <div className="relative">
            <div 
              className="absolute inset-0 rounded-full" 
              style={{ 
                background: `radial-gradient(circle, currentColor 0%, transparent 70%)`,
                width: size,
                height: size,
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
              style={{
                width: size * 0.8,
                height: 1,
                background: 'currentColor',
                boxShadow: `0 0 ${size}px currentColor`,
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45" 
              style={{
                width: size * 0.6,
                height: 1,
                background: 'currentColor',
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45" 
              style={{
                width: size * 0.6,
                height: 1,
                background: 'currentColor',
              }}
            />
          </div>
        );
      case 'star':
        return (
          <div 
            className="relative"
            style={{
              width: size,
              height: size,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              background: 'currentColor',
              boxShadow: `0 0 ${size * 2}px currentColor`,
            }}
          />
        );
      case 'sparkle':
        return (
          <div className="relative">
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                width: size,
                height: 2,
                background: 'currentColor',
                boxShadow: `0 0 ${size}px currentColor`,
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 2,
                height: size,
                background: 'currentColor',
                boxShadow: `0 0 ${size}px currentColor`,
              }}
            />
          </div>
        );
      default: // light
        return (
          <div 
            className="rounded-full"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle, currentColor 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
              boxShadow: `0 0 ${size * 3}px currentColor`,
            }}
          />
        );
    }
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((particle) => {
        const distanceFromMouse = interactive ? Math.sqrt(
          Math.pow(particle.x - mousePosition.x, 2) + 
          Math.pow(particle.y - mousePosition.y, 2)
        ) : 1000;
        
        const mouseInfluence = interactive ? Math.max(0, 100 - distanceFromMouse) / 100 : 0;
        const magneticEffect = mouseInfluence * 20;

        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: particle.x,
              color: particle.color,
              filter: `brightness(${1 + mouseInfluence * 0.5})`,
            }}
            initial={{
              y: window.innerHeight + 20,
              opacity: 0,
              rotate: 0,
              scale: 0.5,
            }}
            animate={{
              y: -100,
              opacity: [0, 1, 1, 0],
              rotate: 360,
              scale: [0.5, 1, 1, 0.5],
              x: particle.x + (Math.random() - 0.5) * 300 + magneticEffect,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 8,
            }}
          >
            {getParticleShape(particle.type, particle.size)}
          </motion.div>
        );
      })}
    </div>
  );
};

export default GlobalAuroraParticles;
