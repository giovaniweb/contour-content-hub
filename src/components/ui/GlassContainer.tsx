
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;  // Added onClick prop support
}

export default function GlassContainer({ children, className, onClick }: GlassContainerProps) {
  return (
    <div 
      className={cn(
        "rounded-2xl p-4 bg-gradient-to-b from-white/80 to-zinc-100/60 backdrop-blur-md shadow-sm border border-white/20",
        onClick && "cursor-pointer hover:shadow-md transition-all",  // Add cursor pointer and hover effect when clickable
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
