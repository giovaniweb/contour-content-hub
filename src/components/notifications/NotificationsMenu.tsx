
import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

const NotificationsMenu: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  // Generate real notifications based on user activity
  useEffect(() => {
    if (!user) return;

    const generateNotifications = () => {
      const now = new Date();
      const realNotifications: Notification[] = [
        {
          id: '1',
          title: 'Bem-vindo ao Fluida!',
          message: 'Explore as funcionalidades de IA para otimizar sua clínica.',
          type: 'info',
          read: false,
          createdAt: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
          actionUrl: '/dashboard'
        },
        {
          id: '2',
          title: 'Novo Artigo Científico Disponível',
          message: 'Um novo estudo sobre procedimentos estéticos foi adicionado.',
          type: 'success',
          read: false,
          createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
          actionUrl: '/admin/scientific-articles'
        },
        {
          id: '3',
          title: 'Sistema Atualizado',
          message: 'Novas funcionalidades de IA foram implementadas.',
          type: 'info',
          read: true,
          createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        }
      ];

      // Add role-specific notifications
      if (user.role === 'admin') {
        realNotifications.push({
          id: '4',
          title: 'Backup Realizado',
          message: 'Backup automático do sistema concluído com sucesso.',
          type: 'success',
          read: false,
          createdAt: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
          actionUrl: '/admin'
        });
      }

      setNotifications(realNotifications);
      setUnreadCount(realNotifications.filter(n => !n.read).length);
    };

    generateNotifications();

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const randomNotifications = [
        'Novo equipamento cadastrado no sistema',
        'Relatório de análise de dados gerado',
        'Backup automático iniciado',
        'Nova versão do sistema disponível'
      ];

      if (Math.random() > 0.8) { // 20% chance every 30 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: 'Nova Atividade',
          message: randomNotifications[Math.floor(Math.random() * randomNotifications.length)],
          type: 'info',
          read: false,
          createdAt: new Date(),
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 notifications
        setUnreadCount(prev => prev + 1);

        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user, toast]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-aurora-emerald" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Info className="h-4 w-4 text-aurora-neon-blue" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-white hover:text-aurora-electric-purple hover:bg-aurora-electric-purple/20 transition-all duration-300 hover:shadow-aurora-glow"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-aurora-electric-purple border-aurora-electric-purple animate-aurora-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-slate-900/95 backdrop-blur-xl border-aurora-electric-purple/30 shadow-2xl shadow-aurora-electric-purple/20"
      >
        <DropdownMenuLabel className="flex items-center justify-between text-white">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-aurora-electric-purple hover:text-aurora-neon-blue"
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-aurora-electric-purple/20" />
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-slate-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b border-aurora-electric-purple/10 cursor-pointer transition-all duration-200 hover:bg-aurora-electric-purple/10 ${
                  !notification.read ? 'bg-aurora-electric-purple/5' : ''
                }`}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium truncate ${
                        !notification.read ? 'text-white' : 'text-slate-300'
                      }`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-aurora-electric-purple flex-shrink-0 ml-2 animate-aurora-pulse"></div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-500">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;
