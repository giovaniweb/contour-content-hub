
import React from 'react';

interface GlobalAuroraParticlesProps {
  count?: number;
  active?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
}

const GlobalAuroraParticles: React.FC<GlobalAuroraParticlesProps> = ({ 
  count = 0, // Disabled by default
  active = false, // Disabled by default
  intensity = 'low',
  interactive = false
}) => {
  // Return null to completely disable particles
  if (!active || count === 0) {
    return null;
  }

  // If somehow enabled, render minimal static elements
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-20">
      {/* Just a few static decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-aurora-electric-purple/30 rounded-full"></div>
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-aurora-neon-blue/20 rounded-full"></div>
      <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-aurora-emerald/25 rounded-full"></div>
    </div>
  );
};

export default GlobalAuroraParticles;
