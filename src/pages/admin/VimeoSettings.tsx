
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LinkIcon, RefreshCcw, Shield, Unlock } from 'lucide-react';

const AdminVimeoSettings: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Configurações do Vimeo</h1>
        <p className="text-muted-foreground">
          Configure a integração com o Vimeo para upload e gerenciamento de vídeos.
        </p>

        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="connection">Conexão</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Status da Conexão</CardTitle>
                <CardDescription>
                  Verifique e gerencie sua conexão com a API do Vimeo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Para configurar a integração com o Vimeo, você precisa criar uma aplicação no painel de desenvolvedores do Vimeo.
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="client_id">Client ID</Label>
                    <Input id="client_id" placeholder="Digite o Client ID da sua aplicação Vimeo" />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="client_secret">Client Secret</Label>
                    <Input id="client_secret" type="password" placeholder="Digite o Client Secret da sua aplicação Vimeo" />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="access_token">Access Token</Label>
                    <div className="flex gap-2">
                      <Input id="access_token" placeholder="Token será gerado após autorização" readOnly />
                      <Button variant="outline" size="icon">
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Conectar com Vimeo
                  </Button>
                  
                  <Button variant="outline" className="flex items-center gap-2">
                    <Unlock className="h-4 w-4" />
                    Desconectar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Vídeo</CardTitle>
                <CardDescription>
                  Defina as configurações padrão para novos vídeos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configure as opções padrão para os vídeos enviados para o Vimeo através do sistema Fluida.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Opções avançadas para a integração com Vimeo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configure opções avançadas para a integração com a API do Vimeo.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminVimeoSettings;
