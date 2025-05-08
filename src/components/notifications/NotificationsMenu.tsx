
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// Sample notifications data - in a real app this would come from an API
const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Novo comentário',
    message: 'João comentou em seu vídeo sobre Adella.',
    time: '5 min atrás',
    read: false,
    link: '/video-storage/123',
    type: 'info'
  },
  {
    id: '2',
    title: 'Vídeo processado',
    message: 'Seu vídeo "Tutorial Hipro" foi processado com sucesso.',
    time: '1 hora atrás',
    read: false,
    link: '/video-storage/456',
    type: 'success'
  },
  {
    id: '3',
    title: 'Lembrete de agendamento',
    message: 'Gravação agendada para amanhã às 14h.',
    time: '3 horas atrás',
    read: true,
    link: '/calendar',
    type: 'warning'
  },
  {
    id: '4',
    title: 'Roteiro atualizado',
    message: 'Sua equipe atualizou o roteiro "Benefícios da ultracavitação".',
    time: '1 dia atrás',
    read: true,
    link: '/custom-gpt/scripts/789',
    type: 'info'
  }
];

const NotificationsMenu: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };
  
  const getIconForType = (type: string) => {
    switch(type) {
      case 'success': return <div className="w-2 h-2 rounded-full bg-green-500"></div>;
      case 'warning': return <div className="w-2 h-2 rounded-full bg-amber-500"></div>;
      case 'error': return <div className="w-2 h-2 rounded-full bg-red-500"></div>;
      default: return <div className="w-2 h-2 rounded-full bg-blue-500"></div>;
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 dropdown-animation">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs font-normal"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          <div className="max-h-[300px] overflow-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={cn(
                  "p-0 focus:bg-transparent", 
                  notification.read ? "" : "bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                <div className="w-full">
                  <Link 
                    to={notification.link || '#'} 
                    className="p-2 flex items-start gap-3 hover:bg-accent rounded-md"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="pt-1">
                      {getIconForType(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm", 
                        notification.read ? "" : "font-medium"
                      )}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </Link>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="w-full flex justify-center text-sm text-contourline-mediumBlue">
            Ver todas as notificações
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;
