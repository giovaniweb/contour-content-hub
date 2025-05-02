
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AiBadgeProps {
  className?: string;
  tooltipText?: string;
}

const AiBadge: React.FC<AiBadgeProps> = ({ 
  className = '', 
  tooltipText = 'Gerado com Inteligência Artificial' 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center justify-center rounded-full bg-contourline-mediumBlue/10 p-1 ${className}`}>
            <Sparkles className="h-3.5 w-3.5 text-contourline-mediumBlue" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AiBadge;
