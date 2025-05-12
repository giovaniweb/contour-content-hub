
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminVimeoSettings: React.FC = () => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [accessToken, setAccessToken] = React.useState('');
  const [clientId, setClientId] = React.useState('');
  const [clientSecret, setClientSecret] = React.useState('');
  const [autoSync, setAutoSync] = React.useState(false);

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

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Configurações do Vimeo</h1>
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
        
        <Card>
          <CardHeader>
            <CardTitle>Integração com Vimeo</CardTitle>
            <CardDescription>
              Configure a integração do sistema com sua conta do Vimeo para importar e gerenciar vídeos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  <Button variant="outline">Sincronizar agora</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {isConnected && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Vídeos Sincronizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  Última sincronização: há 2 dias
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Espaço Utilizado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">17.8 GB</div>
                <p className="text-xs text-muted-foreground">
                  De 35 GB disponíveis
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Status da Conta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Pro</div>
                <p className="text-xs text-muted-foreground">
                  Válido até 15/12/2025
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminVimeoSettings;
