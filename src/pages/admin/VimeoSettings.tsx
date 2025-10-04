import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video, Save, Key, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

const VimeoSettings: React.FC = () => {
  const [apiToken, setApiToken] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual save logic with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações do Vimeo salvas com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Video className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Configurações do Vimeo</h1>
            <p className="text-slate-400">Configure a integração com a API do Vimeo</p>
          </div>
        </div>

        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Credenciais da API
            </CardTitle>
            <CardDescription>
              Configure suas credenciais de API do Vimeo para habilitar upload e gerenciamento de vídeos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-token">Token de Acesso</Label>
              <Input
                id="api-token"
                type="password"
                placeholder="Digite seu token de acesso do Vimeo"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-id">Client ID</Label>
              <Input
                id="client-id"
                placeholder="Digite seu Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-secret">Client Secret</Label>
              <Input
                id="client-secret"
                type="password"
                placeholder="Digite seu Client Secret"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <a
                href="https://developer.vimeo.com/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <LinkIcon className="h-4 w-4" />
                Obter credenciais no Vimeo Developer
              </a>
              
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Como configurar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ol className="list-decimal list-inside space-y-2">
              <li>Acesse o <a href="https://developer.vimeo.com/apps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vimeo Developer Portal</a></li>
              <li>Crie um novo aplicativo ou selecione um existente</li>
              <li>Copie o Client ID e Client Secret</li>
              <li>Gere um Access Token com as permissões necessárias (upload, edit, delete)</li>
              <li>Cole as credenciais nos campos acima e salve</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default VimeoSettings;
