
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

export default function GlassContainer({ 
  children, 
  className, 
  onClick, 
  noPadding = false
}: GlassContainerProps) {
  return (
    <div 
      className={cn(
        "rounded-xl bg-white/90 backdrop-blur-md shadow-sm border border-gray-100",
        !noPadding && "p-4", // Apply padding only if noPadding is false
        onClick && "cursor-pointer hover:shadow-md transition-all",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
