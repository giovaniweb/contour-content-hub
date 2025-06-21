
import React from 'react';
import GlobalAuroraParticles from '@/components/ui/GlobalAuroraParticles';

interface AuroraPageLayoutProps {
  children: React.ReactNode;
  particleIntensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
}

const AuroraPageLayout: React.FC<AuroraPageLayoutProps> = ({ 
  children, 
  particleIntensity = 'medium',
  interactive = true 
}) => {
  return (
    <div className="min-h-screen relative overflow-hidden aurora-enhanced-bg">
      {/* Enhanced Aurora Background with noise texture */}
      <div className="absolute inset-0 aurora-enhanced-gradient">
        {/* Base gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-space-black via-aurora-deep-purple/80 to-aurora-space-black animate-aurora-flow"></div>
        
        {/* Secondary moving gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-aurora-electric-purple/20 via-transparent to-aurora-neon-blue/20 animate-aurora-wave"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-aurora-emerald/10 via-transparent to-aurora-electric-purple/15 animate-aurora-pulse"></div>
        
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay'
          }}
        ></div>

        {/* Floating aurora orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aurora-electric-purple/15 rounded-full blur-3xl animate-aurora-float"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-aurora-neon-blue/12 rounded-full blur-3xl animate-aurora-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-aurora-emerald/10 rounded-full blur-3xl animate-aurora-wave delay-1000"></div>
        <div className="absolute top-3/4 right-1/2 w-64 h-64 bg-aurora-electric-purple/8 rounded-full blur-3xl animate-aurora-float delay-500"></div>
      </div>

      {/* Global Aurora Particles */}
      <GlobalAuroraParticles
        count={30}
        active={true}
        intensity={particleIntensity}
        interactive={interactive}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuroraPageLayout;
