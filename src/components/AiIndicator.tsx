
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AiIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  tooltipText?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
}

/**
 * Componente que indica conteúdo gerado por IA
 */
const AiIndicator: React.FC<AiIndicatorProps> = ({ 
  className = '',
  size = 'md',
  tooltipText = 'Gerado com Inteligência Artificial',
  position = 'top-right'
}) => {
  // Configuração dos tamanhos
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  // Configuração das posições
  const positionClasses = {
    'top-right': 'absolute -top-1 -right-1',
    'top-left': 'absolute -top-1 -left-1',
    'bottom-right': 'absolute -bottom-1 -right-1',
    'bottom-left': 'absolute -bottom-1 -left-1',
    'inline': 'inline-flex'
  };
  
  const containerClasses = cn(
    'flex items-center justify-center rounded-full p-1',
    position !== 'inline' ? 'bg-contourline-mediumBlue text-white' : 'bg-contourline-mediumBlue/10',
    position !== 'inline' && positionClasses[position],
    className
  );
  
  const iconClasses = cn(
    sizeClasses[size],
    position === 'inline' ? 'text-contourline-mediumBlue' : 'text-white'
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={containerClasses}>
            <Sparkles className={iconClasses} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AiIndicator;
