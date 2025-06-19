
import React from 'react';
import AuroraParticles from '@/components/ui/AuroraParticles';

interface AuroraPageLayoutProps {
  children: React.ReactNode;
}

const AuroraPageLayout: React.FC<AuroraPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden aurora-dark-bg">
      {/* Aurora Background with enhanced gradients */}
      <div className="absolute inset-0 aurora-gradient-bg">
        <div className="absolute inset-0 bg-gradient-to-r from-aurora-electric-purple/20 via-aurora-neon-blue/20 to-aurora-emerald/20 animate-aurora-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aurora-electric-purple/10 rounded-full blur-3xl animate-aurora-float"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-aurora-neon-blue/10 rounded-full blur-3xl animate-aurora-pulse delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-aurora-emerald/10 rounded-full blur-3xl animate-aurora-wave delay-1000"></div>
        </div>
      </div>

      {/* Aurora Particles */}
      <AuroraParticles count={15} active={true} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuroraPageLayout;
