import React from 'react';
import { cn } from '@/lib/utils';

interface TextProps {
  variant?: 'body' | 'muted' | 'small' | 'large' | 'lead';
  className?: string;
  children: React.ReactNode;
}

const Text: React.FC<TextProps> = ({
  variant = 'body',
  className,
  children
}) => {
  const variantClasses = {
    body: 'text-slate-300 aurora-body leading-relaxed',
    muted: 'text-slate-400 text-sm aurora-body',
    small: 'text-xs text-slate-400',
    large: 'text-lg text-slate-200 aurora-body',
    lead: 'text-xl text-slate-200 aurora-body-enhanced leading-relaxed'
  };

  return (
    <p className={cn(variantClasses[variant], className)}>
      {children}
    </p>
  );
};

export { Text };