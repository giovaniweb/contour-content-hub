
import React from 'react';

interface AuroraProgressBarProps {
  progress: number;
  label?: string;
  className?: string;
}

const AuroraProgressBar: React.FC<AuroraProgressBarProps> = ({
  progress,
  label,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-300 aurora-body">{label}</span>
          <span className="text-sm text-aurora-electric-purple font-medium">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      <div className="relative h-3 bg-aurora-deep-purple/50 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-aurora-deep-purple/20 to-aurora-electric-purple/20 rounded-full" />
        <div
          className="h-full bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue rounded-full transition-all duration-300 ease-out aurora-glow"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default AuroraProgressBar;
