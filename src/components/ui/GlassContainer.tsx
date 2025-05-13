
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
}

export default function GlassContainer({ children, className }: GlassContainerProps) {
  return (
    <div className={cn(
      "rounded-2xl p-4 bg-gradient-to-b from-white/80 to-zinc-100/60 backdrop-blur-md shadow-sm border",
      className
    )}>
      {children}
    </div>
  )
}
