
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
    <div className="relative z-10 aurora-page-container">
      {children}
    </div>
  );
};

export default AuroraPageLayout;
