
import React from 'react';
import AiIndicator from './AiIndicator';

interface AiBadgeProps {
  className?: string;
  tooltipText?: string;
}

const AiBadge: React.FC<AiBadgeProps> = ({ 
  className = '', 
  tooltipText = 'Gerado com Inteligência Artificial' 
}) => {
  return (
    <AiIndicator 
      position="inline"
      className={className}
      tooltipText={tooltipText}
    />
  );
};

export default AiBadge;
