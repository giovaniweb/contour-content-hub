
import React, { useState } from 'react';
import ContentLayout from '@/components/layout/ContentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GlassContainer from '@/components/ui/GlassContainer';
import { usePermissions } from '@/hooks/use-permissions';
import { Navigate } from 'react-router-dom';

const AdminVimeoSettings: React.FC = () => {
  const { isAdmin } = usePermissions();
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [autoSync, setAutoSync] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleConnect = () => {
    // Simulação de conexão
    if (clientId && clientSecret) {
      setIsConnected(true);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAccessToken('');
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    // Simulate sync process
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <ContentLayout 
      title="Configurações do Vimeo"
      subtitle="Configure a integração do sistema com sua conta do Vimeo para importar e gerenciar vídeos"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          {isConnected ? (
            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 px-3 py-1">
              <CheckCircle2 className="h-4 w-4" />
              Conectado
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200 px-3 py-1">
              <AlertCircle className="h-4 w-4" />
              Desconectado
            </Badge>
          )}
        </div>
        
        <GlassContainer>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID</Label>
                <Input 
                  id="client-id" 
                  placeholder="Insira seu Client ID" 
                  value={clientId} 
                  onChange={(e) => setClientId(e.target.value)}
                  disabled={isConnected}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client-secret">Client Secret</Label>
                <Input 
                  id="client-secret" 
                  type="password"
                  placeholder="Insira seu Client Secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  disabled={isConnected}
                />
              </div>
              
              {isConnected && (
                <div className="space-y-2">
                  <Label htmlFor="access-token">Access Token</Label>
                  <Input 
                    id="access-token" 
                    value="●●●●●●●●●●●●●●●●●●●●●●●●●●●"
                    disabled
                  />
                </div>
              )}
              
              <div className="flex justify-end">
                {isConnected ? (
                  <Button variant="destructive" onClick={handleDisconnect}>Desconectar</Button>
                ) : (
                  <Button onClick={handleConnect} disabled={!clientId || !clientSecret}>Conectar ao Vimeo</Button>
                )}
              </div>
            </div>
            
            {isConnected && (
              <div className="pt-4 border-t space-y-6">
                <h3 className="font-medium">Configurações avançadas</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-sync">Sincronização automática</Label>
                    <p className="text-sm text-muted-foreground">Sincronizar automaticamente novos vídeos do Vimeo</p>
                  </div>
                  <Switch 
                    id="auto-sync" 
                    checked={autoSync} 
                    onCheckedChange={setAutoSync} 
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleSyncNow} 
                    disabled={isSyncing}
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sincronizando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sincronizar agora
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </GlassContainer>
        
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassContainer>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Vídeos Sincronizados
                </h3>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  Última sincronização: há 2 dias
                </p>
              </div>
            </GlassContainer>
            
            <GlassContainer>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Espaço Utilizado
                </h3>
                <div className="text-2xl font-bold">17.8 GB</div>
                <p className="text-xs text-muted-foreground">
                  De 35 GB disponíveis
                </p>
              </div>
            </GlassContainer>
            
            <GlassContainer>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Status da Conta
                </h3>
                <div className="text-2xl font-bold">Pro</div>
                <p className="text-xs text-muted-foreground">
                  Válido até 15/12/2025
                </p>
              </div>
            </GlassContainer>
          </div>
        )}
      </div>
    </ContentLayout>
  );
};

export default AdminVimeoSettings;
