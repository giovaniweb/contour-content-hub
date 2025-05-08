
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface SlideNotificationProps {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  duration?: number;
  onClose?: () => void;
}

const SlideNotification: React.FC<SlideNotificationProps> = ({
  id,
  title,
  message,
  type = 'info',
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Allow animation to complete before removing
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 rounded-full bg-green-500"></div>;
      case 'error':
        return <div className="w-2 h-2 rounded-full bg-red-500"></div>;
      case 'warning':
        return <div className="w-2 h-2 rounded-full bg-amber-500"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-blue-500"></div>;
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300); // Allow animation to complete before removing
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            'w-full max-w-sm mx-auto rounded-lg shadow-lg border p-4 flex items-start gap-3',
            'backdrop-blur-sm',
            getTypeStyles()
          )}
        >
          <div className="pt-1">{getIcon()}</div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">{title}</h4>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <button 
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar notificação"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlideNotification;
