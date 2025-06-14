
import React from 'react';
import { Video, Save, Key, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminVimeoSettings: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Video className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Configurações do Vimeo</h1>
            <p className="text-slate-400">Configure a integração com o Vimeo</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Configuração da API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="client-id">Client ID</Label>
              <Input id="client-id" placeholder="Seu Client ID do Vimeo" />
            </div>
            <div>
              <Label htmlFor="client-secret">Client Secret</Label>
              <Input id="client-secret" type="password" placeholder="Seu Client Secret" />
            </div>
            <div>
              <Label htmlFor="access-token">Access Token</Label>
              <Input id="access-token" type="password" placeholder="Seu Access Token" />
            </div>
          </CardContent>
        </Card>

        {/* Upload Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Configurações de Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="default-privacy">Privacidade Padrão</Label>
              <Input id="default-privacy" placeholder="anybody" />
            </div>
            <div>
              <Label htmlFor="upload-folder">Pasta de Upload</Label>
              <Input id="upload-folder" placeholder="/uploads" />
            </div>
            <div>
              <Label htmlFor="quality">Qualidade</Label>
              <Input id="quality" placeholder="hd" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminVimeoSettings;
