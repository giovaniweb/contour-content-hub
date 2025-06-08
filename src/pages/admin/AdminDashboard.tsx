
import React from 'react';
import { LayoutDashboard, Users, Settings, BarChart3, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminDashboard: React.FC = () => {
  const adminCards = [
    {
      title: "Usuários",
      description: "Gerencie usuários e permissões",
      icon: Users,
      count: "24",
      action: "Gerenciar Usuários"
    },
    {
      title: "Equipamentos",
      description: "Configure equipamentos do sistema",
      icon: Settings,
      count: "12",
      action: "Ver Equipamentos"
    },
    {
      title: "Conteúdos",
      description: "Administre conteúdos da plataforma",
      icon: Database,
      count: "156",
      action: "Gerenciar Conteúdo"
    },
    {
      title: "Relatórios",
      description: "Visualize métricas e relatórios",
      icon: BarChart3,
      count: "8",
      action: "Ver Relatórios"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie e configure todos os aspectos da plataforma Fluida
          </p>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminCards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{card.count}</div>
                <CardDescription className="mb-4">
                  {card.description}
                </CardDescription>
                <Button variant="outline" size="sm" className="w-full">
                  {card.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Adicionar Usuário</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Settings className="h-6 w-6" />
              <span>Configurações do Sistema</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Gerar Relatório</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
