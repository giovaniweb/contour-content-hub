
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSlideNotifications } from '@/components/notifications/SlideNotificationProvider';

const NotificationsDemo: React.FC = () => {
  const { showNotification } = useSlideNotifications();
  
  const handleShowInfoNotification = () => {
    showNotification({
      title: 'Informação',
      message: 'Esta é uma notificação informativa para demonstração.',
      type: 'info',
    });
  };
  
  const handleShowSuccessNotification = () => {
    showNotification({
      title: 'Sucesso!',
      message: 'Operação concluída com sucesso.',
      type: 'success',
    });
  };
  
  const handleShowWarningNotification = () => {
    showNotification({
      title: 'Atenção',
      message: 'Esta operação pode afetar seus dados existentes.',
      type: 'warning',
    });
  };
  
  const handleShowErrorNotification = () => {
    showNotification({
      title: 'Erro',
      message: 'Ocorreu um erro ao processar sua solicitação.',
      type: 'error',
    });
  };
  
  return (
    <div className="fixed bottom-4 right-4 space-y-2 flex flex-col">
      <Button size="sm" variant="outline" onClick={handleShowInfoNotification}>
        Mostrar Info
      </Button>
      <Button size="sm" variant="outline" onClick={handleShowSuccessNotification}>
        Mostrar Sucesso
      </Button>
      <Button size="sm" variant="outline" onClick={handleShowWarningNotification}>
        Mostrar Aviso
      </Button>
      <Button size="sm" variant="outline" onClick={handleShowErrorNotification}>
        Mostrar Erro
      </Button>
    </div>
  );
};

export default NotificationsDemo;
