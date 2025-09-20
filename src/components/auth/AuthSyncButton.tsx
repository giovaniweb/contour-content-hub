import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface AuthSyncButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
}

export const AuthSyncButton: React.FC<AuthSyncButtonProps> = ({
  variant = 'outline',
  size = 'sm', 
  showText = true
}) => {
  const { validateAuthState, refreshAuth } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      console.log('🔄 Iniciando sincronização de autenticação...');
      
      // First validate current state
      const isValid = await validateAuthState();
      
      if (!isValid) {
        console.log('⚠️ Estado inválido detectado, forçando refresh...');
        await refreshAuth();
        
        // Validate again after refresh
        const isValidAfterRefresh = await validateAuthState();
        
        if (isValidAfterRefresh) {
          toast.success('Autenticação sincronizada com sucesso!', {
            description: 'Seus privilégios foram atualizados.'
          });
        } else {
          toast.warning('Sincronização parcial', {
            description: 'Alguns dados podem ainda estar inconsistentes.'
          });
        }
      } else {
        toast.success('Autenticação já está sincronizada!');
      }
      
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      toast.error('Erro ao sincronizar autenticação', {
        description: 'Tente fazer logout e login novamente.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSync}
      disabled={isSyncing}
      className="flex items-center gap-2"
    >
      <RotateCcw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {showText && (isSyncing ? 'Sincronizando...' : 'Sincronizar Auth')}
    </Button>
  );
};

export default AuthSyncButton;