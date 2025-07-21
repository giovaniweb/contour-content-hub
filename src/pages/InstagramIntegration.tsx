import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Link2, Settings, CheckCircle } from 'lucide-react';

const InstagramIntegration = () => {
  const [isConnected, setIsConnected] = React.useState(false);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Integração Instagram</h1>
        <p className="text-muted-foreground">
          Conecte sua conta do Instagram para publicar conteúdo diretamente
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Instagram className="h-5 w-5" />
              <span>Status da Conexão</span>
            </CardTitle>
            <CardDescription>
              Status atual da integração com o Instagram
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Conectado</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Conta:</strong> @clinica_exemplo</p>
                  <p><strong>Conectado em:</strong> 15/01/2024</p>
                </div>
                <Button variant="destructive" size="sm">
                  Desconectar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Link2 className="h-5 w-5" />
                  <span>Não conectado</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Conecte sua conta do Instagram para começar a publicar conteúdo diretamente da plataforma.
                </p>
                <Button onClick={() => setIsConnected(true)}>
                  <Instagram className="h-4 w-4 mr-2" />
                  Conectar Instagram
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Configurações</span>
            </CardTitle>
            <CardDescription>
              Configure como o conteúdo será publicado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Publicação Automática</label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Publicar automaticamente quando aprovar conteúdo</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hashtags Padrão</label>
                <textarea 
                  className="w-full p-2 border rounded-md text-sm"
                  placeholder="#estetica #harmonizacao #skincare #beleza"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Horário Preferido</label>
                <select className="w-full p-2 border rounded-md text-sm">
                  <option>08:00 - Manhã</option>
                  <option>12:00 - Almoço</option>
                  <option>18:00 - Tarde</option>
                  <option>20:00 - Noite</option>
                </select>
              </div>
              <Button variant="outline" size="sm">
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {isConnected && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Últimas Publicações</CardTitle>
            <CardDescription>
              Suas publicações mais recentes no Instagram
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <p className="text-sm font-medium">Post sobre Harmonização Facial</p>
                  <p className="text-xs text-muted-foreground">Publicado há 2 dias</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstagramIntegration;