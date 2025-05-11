
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePermissions } from '@/hooks/use-permissions';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/types/auth';

const CONSULTANT_MENUS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'clients', label: 'Clientes' },
  { id: 'content', label: 'Conteúdos' },
  { id: 'analytics', label: 'Análises' },
];

const ConsultantPanel: React.FC = () => {
  const { user } = useAuth();
  const { canViewConsultantPanel } = usePermissions();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canViewConsultantPanel()) {
      navigate('/dashboard');
    }

    // Simulate loading the consultant profile
    const timer = setTimeout(() => {
      if (user) {
        setProfile({
          id: user.id,
          nome: user.nome || 'Consultor',
          email: user.email,
          role: user.role,
          workspace_id: user.workspace_id,
        });
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [canViewConsultantPanel, navigate, user]);

  if (loading) {
    return (
      <Layout title="Painel do Consultor">
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Painel do Consultor">
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle>Consultor</CardTitle>
                <CardDescription>
                  {profile?.nome}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {CONSULTANT_MENUS.map((menu) => (
                    <Button
                      key={menu.id}
                      variant={activeTab === menu.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(menu.id)}
                    >
                      {menu.label}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                {CONSULTANT_MENUS.map((menu) => (
                  <TabsTrigger key={menu.id} value={menu.id}>
                    {menu.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="dashboard">
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard do Consultor</CardTitle>
                    <CardDescription>
                      Visão geral das atividades e métricas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Aqui você encontra os principais indicadores dos seus clientes.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Clientes Ativos</h3>
                        <p className="text-2xl font-bold">8</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Conteúdos Criados</h3>
                        <p className="text-2xl font-bold">27</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Agendamentos</h3>
                        <p className="text-2xl font-bold">12</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="clients">
                <Card>
                  <CardHeader>
                    <CardTitle>Gerenciamento de Clientes</CardTitle>
                    <CardDescription>
                      Visualize e gerencie seus clientes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Lista de clientes em breve...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle>Conteúdos</CardTitle>
                    <CardDescription>
                      Gerencie os conteúdos de seus clientes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Conteúdos em breve...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Análises</CardTitle>
                    <CardDescription>
                      Métricas e desempenho dos conteúdos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Análises em breve...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConsultantPanel;
