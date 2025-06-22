
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
      {/* Global Aurora Particles - ONLY FLOATING PARTICLES */}
      <GlobalAuroraParticles
        count={30}
        active={true}
        intensity={particleIntensity}
        interactive={interactive}
      />

      {/* Content */}
      <div className="relative z-10 aurora-page-container">
        {children}
      </div>
    </div>
  );
};

export default AuroraPageLayout;
