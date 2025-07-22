import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'primary' | 'secondary' | 'accent' | 'muted';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  children: React.ReactNode;
}

const Heading: React.FC<HeadingProps> = ({
  level = 1,
  variant = 'primary',
  size,
  className,
  children
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  // Size classes based on heading level if not explicitly set
  const defaultSizes = {
    1: 'text-3xl',
    2: 'text-2xl', 
    3: 'text-xl',
    4: 'text-lg',
    5: 'text-base',
    6: 'text-sm'
  };

  const sizeClasses = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    xxl: 'text-3xl'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent aurora-heading-enhanced',
    secondary: 'text-slate-200 aurora-heading',
    accent: 'text-purple-400 aurora-heading',
    muted: 'text-slate-400 aurora-body'
  };

  return (
    <Tag
      className={cn(
        'font-semibold tracking-wide',
        size ? sizeClasses[size] : defaultSizes[level],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Tag>
  );
};

export { Heading };