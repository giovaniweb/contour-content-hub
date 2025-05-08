
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
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
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    let animationFrame: number;
    
    // Progress bar animation
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progressValue = 100 - (elapsedTime / duration) * 100;
      
      if (progressValue <= 0) {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
        return;
      }
      
      setProgress(progressValue);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [duration, onClose, isVisible]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/20';
      default:
        return 'border-l-4 border-l-fluida-blue bg-fluida-blue/5 dark:bg-fluida-blue/10';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-fluida-blue" />;
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'w-full max-w-sm mx-auto rounded-lg shadow-lg overflow-hidden',
            'backdrop-blur-sm',
            getTypeStyles()
          )}
        >
          <div className="p-4 flex items-start gap-3">
            <div className="flex-shrink-0 pt-1">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-1">{title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{message}</p>
            </div>
            <button 
              onClick={handleClose}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors -mt-1 -mr-1 p-1"
              aria-label="Fechar notificação"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700">
            <div 
              className={cn(
                "h-full transition-all ease-linear",
                type === 'success' ? "bg-green-500" : 
                type === 'error' ? "bg-red-500" :
                type === 'warning' ? "bg-amber-500" : "bg-fluida-blue"
              )} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlideNotification;
