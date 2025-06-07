
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
  aurora?: boolean;
  floating?: boolean;
  glowing?: boolean;
}

export default function GlassContainer({ 
  children, 
  className, 
  onClick, 
  noPadding = false,
  aurora = false,
  floating = false,
  glowing = false
}: GlassContainerProps) {
  const Component = onClick ? motion.div : motion.div;
  
  return (
    <Component
      className={cn(
        // Base glass effect
        "rounded-xl backdrop-blur-md shadow-sm border",
        
        // Aurora theme
        aurora ? "aurora-glass border-white/20" : "bg-white/90 border-gray-100 dark:bg-white/10 dark:border-white/20",
        
        // Padding
        !noPadding && "p-4 md:p-6",
        
        // Interactive states
        onClick && "cursor-pointer transition-all duration-300",
        onClick && aurora && "hover:border-aurora-lavender/40 hover:shadow-aurora-lavender/20",
        onClick && !aurora && "hover:shadow-md hover:bg-white/95 dark:hover:bg-white/20",
        
        // Special effects
        glowing && "shadow-lg shadow-aurora-lavender/20",
        
        className
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        ...(floating && {
          y: [0, -10, 0],
        })
      }}
      transition={{ 
        duration: 0.5,
        ...(floating && {
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        })
      }}
      whileHover={onClick ? { 
        y: -2, 
        scale: 1.02,
        boxShadow: aurora 
          ? "0 10px 40px rgba(196, 181, 253, 0.3)" 
          : "0 10px 25px rgba(0, 0, 0, 0.1)"
      } : undefined}
    >
      {aurora && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0"
          style={{
            background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.1), rgba(20, 184, 166, 0.1), rgba(6, 182, 212, 0.1))',
            backgroundSize: '400% 400%',
          }}
          whileHover={{ opacity: 1 }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" },
            opacity: { duration: 0.3 }
          }}
        />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  )
}
