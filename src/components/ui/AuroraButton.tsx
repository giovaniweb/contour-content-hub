
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuroraButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  confetti?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const AuroraButton: React.FC<AuroraButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  confetti = false,
  className,
  onClick,
  disabled = false,
  type = 'button',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (confetti) {
      triggerConfetti();
    }
    onClick?.(e);
  };

  const triggerConfetti = () => {
    const colors = ['#C4B5FD', '#14B8A6', '#06B6D4', '#7C3AED', '#F472B6', '#3B82F6'];
    
    for (let i = 0; i < 30; i++) {
      const confettiPiece = document.createElement('div');
      confettiPiece.className = 'aurora-confetti';
      confettiPiece.style.left = Math.random() * window.innerWidth + 'px';
      confettiPiece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confettiPiece.style.animationDelay = Math.random() * 2 + 's';
      document.body.appendChild(confettiPiece);
      
      setTimeout(() => {
        confettiPiece.remove();
      }, 3000);
    }
  };

  const baseClasses = cn(
    "relative overflow-hidden rounded-full font-medium transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-aurora-lavender focus:ring-offset-2",
    "active:scale-95",
    {
      // Variants
      'aurora-button text-white': variant === 'primary',
      'bg-white/10 text-white border border-white/20 hover:bg-white/20': variant === 'secondary',
      'bg-transparent text-white hover:bg-white/10': variant === 'ghost',
      
      // Sizes
      'px-4 py-2 text-sm': size === 'sm',
      'px-6 py-3 text-base': size === 'md',
      'px-8 py-4 text-lg': size === 'lg',
    },
    className
  );

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Shimmer effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {children}
      </span>
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(196, 181, 253, 0.4) 0%, transparent 70%)',
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default AuroraButton;
