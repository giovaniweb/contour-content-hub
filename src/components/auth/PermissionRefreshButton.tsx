import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface PermissionRefreshButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
  className?: string;
}

export const PermissionRefreshButton: React.FC<PermissionRefreshButtonProps> = ({
  variant = 'ghost',
  size = 'sm',
  showText = false,
  className = ''
}) => {
  const { refreshAuth } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      toast.loading('Atualizando permissões...', { duration: 1000 });
      await refreshAuth();
      toast.success('Permissões atualizadas!');
    } catch (error) {
      toast.error('Erro ao atualizar permissões');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`flex items-center gap-2 ${className}`}
      title="Atualizar Permissões"
    >
      <Shield className={`h-4 w-4 ${isRefreshing ? 'animate-pulse' : ''}`} />
      <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
      {showText && (isRefreshing ? 'Atualizando...' : 'Permissões')}
    </Button>
  );
};

export default PermissionRefreshButton;