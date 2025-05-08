
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface SlideNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
}

interface SlideNotificationContextValue {
  notifications: SlideNotification[];
  showNotification: (notification: Omit<SlideNotification, 'id'>) => void;
  dismissNotification: (id: string) => void;
}

const SlideNotificationContext = createContext<SlideNotificationContextValue | undefined>(undefined);

export const useSlideNotifications = () => {
  const context = useContext(SlideNotificationContext);
  if (!context) {
    throw new Error('useSlideNotifications must be used within a SlideNotificationProvider');
  }
  return context;
};

export const SlideNotificationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [notifications, setNotifications] = useState<SlideNotification[]>([]);

  const showNotification = useCallback((notification: Omit<SlideNotification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <SlideNotificationContext.Provider value={{ notifications, showNotification, dismissNotification }}>
      {children}
      <AnimatePresence>
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
          {notifications.map(notification => (
            <Notification 
              key={notification.id} 
              notification={notification} 
              onDismiss={() => dismissNotification(notification.id)} 
            />
          ))}
        </div>
      </AnimatePresence>
    </SlideNotificationContext.Provider>
  );
};

interface NotificationProps {
  notification: SlideNotification;
  onDismiss: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
  const { title, message, type } = notification;
  
  const icon = {
    success: <Check className="h-4 w-4 text-white" />,
    error: <AlertCircle className="h-4 w-4 text-white" />,
    warning: <AlertCircle className="h-4 w-4 text-white" />,
    info: <Info className="h-4 w-4 text-white" />,
  };
  
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-fluida-blue',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="rounded-lg shadow-lg overflow-hidden bg-white border border-gray-100"
    >
      <div className="flex items-start">
        <div className={cn("p-3 flex items-center justify-center", bgColor[type])}>
          {icon[type]}
        </div>
        <div className="p-3 flex-1">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        <button onClick={onDismiss} className="p-2 text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};
