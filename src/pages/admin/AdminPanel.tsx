
import React from 'react';
import { BarChart3, Users, Settings, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPanel: React.FC = () => {
  return (
    <div className="p-6">
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 aurora-glass rounded-2xl flex items-center justify-center">
              <Settings className="h-8 w-8 text-aurora-electric-purple aurora-floating" />
            </div>
            <div>
              <h1 className="text-4xl font-light aurora-text-gradient">
                Painel Administrativo
              </h1>
              <p className="text-slate-400 aurora-body">
                Gerencie todos os aspectos do sistema
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="aurora-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20.1% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card className="aurora-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipamentos</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">
                +5 novos este mês
              </p>
            </CardContent>
          </Card>

          <Card className="aurora-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artigos Científicos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +12 este mês
              </p>
            </CardContent>
          </Card>

          <Card className="aurora-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atividade</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">
                Uptime do sistema
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="aurora-card p-8">
          <h2 className="text-2xl font-medium aurora-heading mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="aurora-card hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-aurora-electric-purple mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Gerenciar Usuários</h3>
                <p className="text-sm text-slate-400">Adicionar, editar ou remover usuários</p>
              </CardContent>
            </Card>

            <Card className="aurora-card hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Settings className="h-8 w-8 text-aurora-neon-blue mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Configurações</h3>
                <p className="text-sm text-slate-400">Ajustar configurações do sistema</p>
              </CardContent>
            </Card>

            <Card className="aurora-card hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-aurora-emerald mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Relatórios</h3>
                <p className="text-sm text-slate-400">Visualizar dados e estatísticas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
