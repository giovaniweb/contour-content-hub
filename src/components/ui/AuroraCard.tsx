
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuroraCardProps {
  children: React.ReactNode;
  className?: string;
  floating?: boolean;
  glowing?: boolean;
  onClick?: () => void;
  hover?: boolean;
}

const AuroraCard: React.FC<AuroraCardProps> = ({
  children,
  className,
  floating = false,
  glowing = false,
  onClick,
  hover = true
}) => {
  return (
    <motion.div
      className={cn(
        "aurora-card",
        "p-6 relative",
        onClick && "cursor-pointer",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      onClick={onClick}
      style={{
        animation: floating ? 'aurora-float 6s ease-in-out infinite' : undefined,
        boxShadow: glowing ? '0 0 30px rgba(196, 181, 253, 0.3)' : undefined,
      }}
    >
      {/* Aurora border gradient */}
      <motion.div
        className="absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, #C4B5FD, #14B8A6, #06B6D4, #7C3AED)',
          backgroundSize: '400% 400%',
        }}
        whileHover={{ opacity: 0.2 }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default AuroraCard;
