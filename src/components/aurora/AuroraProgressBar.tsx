
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
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">{label}</span>
          <span className="text-cyan-400">{Math.round(progress)}%</span>
        </div>
      )}
      
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div 
          className="h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default AuroraProgressBar;
