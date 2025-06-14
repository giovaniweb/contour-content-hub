
import React from 'react';
import { Settings, Save, User, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const WorkspaceSettings: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Configurações do Workspace</h1>
            <p className="text-slate-400">Gerencie as configurações da sua organização</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="workspace-name">Nome do Workspace</Label>
              <Input id="workspace-name" placeholder="Nome da organização" />
            </div>
            <div>
              <Label htmlFor="workspace-domain">Domínio</Label>
              <Input id="workspace-domain" placeholder="exemplo.com" />
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Gerenciamento de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="max-users">Máximo de Usuários</Label>
              <Input id="max-users" type="number" placeholder="10" />
            </div>
            <div>
              <Label htmlFor="default-role">Função Padrão</Label>
              <Input id="default-role" placeholder="Usuário" />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configurações de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
                <Input id="session-timeout" type="number" placeholder="60" />
              </div>
              <div>
                <Label htmlFor="password-policy">Política de Senha</Label>
                <Input id="password-policy" placeholder="Mínimo 8 caracteres" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
