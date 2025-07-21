
import React from 'react';
import { LayoutDashboard, Users, Settings, BarChart3, Database, Film, Brain, LinkIcon, Video, TestTube, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAdminStats } from '@/hooks/useAdminStats';

const AdminDashboard: React.FC = () => {
  const { stats, isLoading } = useAdminStats();

  const adminCards = [
    {
      title: "Usuários",
      description: "Gerencie usuários e permissões",
      icon: Users,
      count: isLoading ? "..." : stats.totalUsers.toString(),
      action: "Gerenciar Usuários",
      path: "/admin/users"
    },
    {
      title: "Equipamentos",
      description: "Configure equipamentos do sistema",
      icon: Settings,
      count: isLoading ? "..." : stats.totalEquipments.toString(),
      action: "Ver Equipamentos",
      path: "/admin/equipments"
    },
    {
      title: "Vídeos",
      description: "Gerencie biblioteca de vídeos",
      icon: Film,
      count: isLoading ? "..." : stats.totalVideos.toString(),
      action: "Ver Vídeos",
      path: "/admin/videos"
    },
    {
      title: "Artigos Científicos",
      description: "Gerencie biblioteca de artigos científicos",
      icon: BookOpen,
      count: isLoading ? "..." : stats.totalDocuments.toString(),
      action: "Gerenciar Artigos",
      path: "/admin/scientific-articles"
    },
    {
      title: "Gamificação",
      description: "Usuários engajados no sistema",
      icon: BarChart3,
      count: isLoading ? "..." : stats.totalGamificationUsers.toString(),
      action: "Ver Gamificação",
      path: "/admin/gamification"
    },
    {
      title: "Hot Leads",
      description: "Usuários com alta probabilidade de compra",
      icon: Database,
      count: isLoading ? "..." : stats.hotLeads.toString(),
      action: "Ver Leads",
      path: "/admin/leads"
    },
    {
      title: "IA do Sistema",
      description: "Configure módulos de inteligência artificial",
      icon: Brain,
      count: "5",
      action: "Configurar IA",
      path: "/admin/ai"
    },
    {
      title: "Ações dos Usuários",
      description: "Atividade dos últimos 30 dias",
      icon: TestTube,
      count: isLoading ? "..." : stats.totalActions.toString(),
      action: "Ver Atividade",
      path: "/admin/user-activity"
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

        {/* Real Stats Overview */}
        {!isLoading && stats.topEngagementUser && (
          <div className="mb-6 p-4 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">👑 Top Usuário Engajado</h3>
            <p><strong>{stats.topEngagementUser.name}</strong> - {stats.topEngagementUser.xp} XP</p>
            <p className="text-sm text-muted-foreground">XP médio da plataforma: {stats.averageXP} XP</p>
          </div>
        )}

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={card.path}>
                    {card.action}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/admin/users">
                <Users className="h-6 w-6" />
                <span>Adicionar Usuário</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/admin/scientific-articles">
                <BookOpen className="h-6 w-6" />
                <span>Novo Artigo Científico</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/admin/ai">
                <Brain className="h-6 w-6" />
                <span>Configurar IA</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/admin/diagnostics">
                <TestTube className="h-6 w-6" />
                <span>Executar Diagnóstico</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
