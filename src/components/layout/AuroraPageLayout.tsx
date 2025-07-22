
import React from 'react';
import { cn } from '@/lib/utils';

interface AuroraPageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

const AuroraPageLayout: React.FC<AuroraPageLayoutProps> = ({ 
  children, 
  className,
  containerSize = 'xl',
  padding = 'md',
  fullHeight = false
}) => {
  const containerSizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-4',
    md: 'px-4 sm:px-6 lg:px-8 py-6',
    lg: 'px-6 sm:px-8 lg:px-12 py-8'
  };

  return (
    <div className={cn(
      "relative z-10 w-full",
      fullHeight && "min-h-screen",
      className
    )}>
      <div className={cn(
        "mx-auto",
        containerSizes[containerSize],
        paddingClasses[padding]
      )}>
        {children}
      </div>
    </div>
  );
};

export default AuroraPageLayout;
