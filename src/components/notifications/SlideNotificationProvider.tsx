
import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import SlideNotification, { SlideNotificationProps } from './SlideNotification';
import { v4 as uuidv4 } from 'uuid';

interface NotificationsContextValue {
  showNotification: (notification: Omit<SlideNotificationProps, 'id' | 'onClose'>) => string;
  hideNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export const useSlideNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useSlideNotifications must be used within a SlideNotificationProvider');
  }
  return context;
};

export const SlideNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<SlideNotificationProps[]>([]);

  const showNotification = useCallback((notification: Omit<SlideNotificationProps, 'id' | 'onClose'>) => {
    const id = uuidv4();
    setNotifications((prev) => [
      ...prev,
      { ...notification, id, onClose: () => hideNotification(id) },
    ]);
    return id;
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  return (
    <NotificationsContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed top-4 left-0 right-0 z-50 flex flex-col gap-2 pointer-events-none">
            <div className="flex flex-col items-center gap-2 px-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="pointer-events-auto">
                  <SlideNotification {...notification} />
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </NotificationsContext.Provider>
  );
};
