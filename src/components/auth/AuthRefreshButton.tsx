import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface AuthRefreshButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
}

export const AuthRefreshButton: React.FC<AuthRefreshButtonProps> = ({
  variant = 'outline',
  size = 'sm',
  showText = true
}) => {
  const { refreshAuth, validateAuthState, debugAuth } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Debug current state first
      debugAuth();
      
      // Validate current state
      const isValidBefore = await validateAuthState();
      console.log('🔍 Estado antes do refresh:', { isValid: isValidBefore });
      
      // Perform refresh
      await refreshAuth();
      
      // Validate after refresh
      const isValidAfter = await validateAuthState();
      console.log('🔍 Estado após refresh:', { isValid: isValidAfter });
      
      if (isValidAfter) {
        toast.success('Autenticação atualizada com sucesso!');
      } else {
        toast.warning('Refresh realizado, mas pode haver inconsistências de dados');
      }
      
    } catch (error) {
      console.error('❌ Erro no refresh da autenticação:', error);
      toast.error('Erro ao atualizar autenticação');
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
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {showText && (isRefreshing ? 'Atualizando...' : 'Atualizar Auth')}
    </Button>
  );
};

export default AuthRefreshButton;