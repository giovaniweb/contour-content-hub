
import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  successMessage?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  position?: 'absolute' | 'relative';
}

const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  successMessage,
  className,
  size = 'sm',
  variant = 'ghost',
  position = 'absolute'
}) => {
  const { copyToClipboard, isCopying } = useCopyToClipboard();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(text, successMessage);
  };

  const sizeClasses = {
    sm: 'h-8 w-8 p-0',
    md: 'h-10 w-10 p-0',
    lg: 'h-12 w-12 p-0'
  };

  const positionClasses = position === 'absolute' 
    ? 'absolute top-2 right-2 z-10' 
    : '';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(positionClasses, className)}
    >
      <Button
        variant={variant}
        size="sm"
        className={cn(
          sizeClasses[size],
          "aurora-glass border border-white/20 hover:border-aurora-electric-purple/50",
          "hover:bg-aurora-electric-purple/10 transition-all duration-300",
          "backdrop-blur-sm shadow-lg hover:shadow-aurora-electric-purple/20"
        )}
        onClick={handleCopy}
        disabled={isCopying}
        title="Copiar texto"
      >
        <motion.div
          initial={false}
          animate={{ scale: isCopying ? 0 : 1, opacity: isCopying ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Copy className="h-4 w-4 text-aurora-electric-purple" />
        </motion.div>
        <motion.div
          className="absolute"
          initial={false}
          animate={{ scale: isCopying ? 1 : 0, opacity: isCopying ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Check className="h-4 w-4 text-green-400" />
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default CopyButton;
