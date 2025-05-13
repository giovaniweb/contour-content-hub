
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassContainer({ children, className, onClick }: GlassContainerProps) {
  return (
    <div 
      className={cn(
        "rounded-2xl p-4 bg-white/90 backdrop-blur-md shadow-sm border border-gray-100",
        onClick && "cursor-pointer hover:shadow-md transition-all",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
