
import React from 'react';

interface AuroraLoadingSkeletonProps {
  lines?: number;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AuroraLoadingSkeleton: React.FC<AuroraLoadingSkeletonProps> = ({
  lines = 3,
  height = 'md',
  className = ''
}) => {
  const heightClasses = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8'
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`
            ${heightClasses[height]} 
            bg-gradient-to-r from-aurora-deep-purple/30 via-aurora-electric-purple/50 to-aurora-neon-blue/30
            rounded-lg aurora-shimmer animate-pulse
            ${index === lines - 1 ? 'w-3/4' : 'w-full'}
          `}
          style={{
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AuroraLoadingSkeleton;
