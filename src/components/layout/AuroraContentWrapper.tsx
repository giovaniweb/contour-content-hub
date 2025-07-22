import React from 'react';
import { cn } from '@/lib/utils';

interface AuroraContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
  glass?: boolean;
}

const AuroraContentWrapper: React.FC<AuroraContentWrapperProps> = ({
  children,
  className,
  spacing = 'md',
  glass = false
}) => {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6', 
    lg: 'space-y-8'
  };

  return (
    <div className={cn(
      spacingClasses[spacing],
      glass && "aurora-glass rounded-2xl border border-aurora-neon-blue/30 p-6",
      className
    )}>
      {children}
    </div>
  );
};

export default AuroraContentWrapper;