
import React from 'react';

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
      {/* Static Enhanced Aurora Background */}
      <div className="absolute inset-0 aurora-enhanced-gradient">
        {/* Base gradient layers - Static */}
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-space-black via-aurora-deep-purple/80 to-aurora-space-black"></div>
        
        {/* Secondary gradients - Static */}
        <div className="absolute inset-0 bg-gradient-to-tr from-aurora-electric-purple/20 via-transparent to-aurora-neon-blue/20"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-aurora-emerald/10 via-transparent to-aurora-electric-purple/15"></div>
        
        {/* Static floating aurora orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aurora-electric-purple/15 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-aurora-neon-blue/12 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-aurora-emerald/10 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-3/4 right-1/2 w-64 h-64 bg-aurora-electric-purple/8 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuroraPageLayout;
