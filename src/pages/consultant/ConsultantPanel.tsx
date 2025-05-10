
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Workspace } from '@/types/auth';

interface WorkspaceWithAdmin {
  id: string;
  nome: string;
  plano: string;
  criado_em: string;
  admin: {
    nome: string | null;
    email: string;
  } | null;
}

interface RecentActivity {
  id: string;
  title: string;
  type: string;
  date: string;
}

interface ClientProfile {
  stylePreference?: string;
  frequentTheme?: string;
  preferredChannel?: string;
  estimatedEngagement?: string;
  suggestedProfile?: string;
}

const ConsultantPanel: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workspaces, setWorkspaces] = useState<WorkspaceWithAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceWithAdmin | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [clientProfile, setClientProfile] = useState<ClientProfile>({});

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      
      // Fetch all workspaces available to the consultant
      const { data: workspacesData, error: workspacesError } = await supabase
        .from('workspaces')
        .select('*');
      
      if (workspacesError) throw workspacesError;
      
      // For each workspace, find the admin user
      const workspacesWithAdmins: WorkspaceWithAdmin[] = [];
      
      for (const workspace of workspacesData || []) {
        const { data: adminData, error: adminError } = await supabase
          .from('users')
          .select('nome, email')
          .eq('workspace_id', workspace.id)
          .eq('role', 'admin')
          .single();
          
        if (adminError && adminError.code !== 'PGRST116') {
          console.error('Error fetching admin for workspace', workspace.id, adminError);
        }
        
        workspacesWithAdmins.push({
          ...workspace,
          admin: adminData || null
        });
      }
      
      setWorkspaces(workspacesWithAdmins);
    } catch (error) {
      console.error('Error loading workspaces:', error);
      toast({
        title: 'Erro ao carregar clínicas',
        description: 'Não foi possível carregar a lista de clínicas.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (workspace: WorkspaceWithAdmin) => {
    setSelectedWorkspace(workspace);
    fetchClientData(workspace.id);
    setIsSheetOpen(true);
  };

  const fetchClientData = async (workspaceId: string) => {
    try {
      // Fetch recent activities
      // This is a mock - you would replace with actual queries to your tables
      setRecentActivities([
        { id: '1', title: 'Roteiro: Rejuvenescimento facial', type: 'script', date: '2025-04-25' },
        { id: '2', title: 'Validação: Corporal redução', type: 'validation', date: '2025-04-24' },
        { id: '3', title: 'Artigo: Novas técnicas de lifting', type: 'article', date: '2025-04-22' }
      ]);
      
      // Fetch user profile data
      const { data: adminUser } = await supabase
        .from('users')
        .select('id')
        .eq('workspace_id', workspaceId)
        .eq('role', 'admin')
        .single();
      
      if (adminUser) {
        const { data: profileData } = await supabase
          .from('user_profile')
          .select('*')
          .eq('user_id', adminUser.id)
          .single();
          
        if (profileData) {
          setClientProfile({
            stylePreference: profileData.estilo_preferido || 'emocional',
            frequentTheme: 'rejuvenescimento',
            preferredChannel: 'Instagram',
            estimatedEngagement: 'médio',
            suggestedProfile: 'foco em autoridade'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };

  const handleMarkOpportunity = () => {
    toast({
      title: 'Marcado como oportunidade',
      description: 'O cliente foi marcado como oportunidade de negócio.'
    });
  };

  const handleSuggestEquipment = () => {
    toast({
      title: 'Sugestão enviada',
      description: 'A sugestão de equipamento foi enviada para a equipe comercial.'
    });
  };

  const handleSendInsight = () => {
    toast({
      title: 'Insight enviado',
      description: 'O insight estratégico foi enviado para o cliente.'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Painel do Consultor</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Clínicas Atendidas</CardTitle>
            <CardDescription>
              Gerencie as clínicas sob sua consultoria e acompanhe seu desempenho
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10">Carregando clínicas...</div>
            ) : workspaces.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Nenhuma clínica encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Nome da Clínica</th>
                      <th className="text-left py-3 px-4">Dono</th>
                      <th className="text-left py-3 px-4">Plano Ativo</th>
                      <th className="text-left py-3 px-4">Criado em</th>
                      <th className="text-right py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workspaces.map((workspace) => (
                      <tr key={workspace.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{workspace.nome}</td>
                        <td className="py-3 px-4">
                          {workspace.admin ? workspace.admin.nome || workspace.admin.email : 'N/A'}
                        </td>
                        <td className="py-3 px-4 capitalize">{workspace.plano}</td>
                        <td className="py-3 px-4">
                          {new Date(workspace.criado_em).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button onClick={() => handleViewDetails(workspace)}>
                            Ver Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Painel lateral de detalhes */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedWorkspace?.nome || 'Detalhes da Clínica'}
            </SheetTitle>
            <SheetDescription>
              Analisando comportamento e padrões de uso
            </SheetDescription>
          </SheetHeader>
          
          <Tabs defaultValue="activities" className="mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="activities" className="flex-1">Atividades Recentes</TabsTrigger>
              <TabsTrigger value="patterns" className="flex-1">Padrões Detectados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activities" className="mt-4 space-y-4">
              <h3 className="font-medium text-lg">Últimas Atividades</h3>
              
              <div className="space-y-2">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="p-3 border rounded-md">
                    <div className="flex justify-between">
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-muted-foreground">{activity.date}</div>
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">{activity.type}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="patterns" className="mt-4">
              <h3 className="font-medium text-lg mb-4">Padrões Detectados</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded-md">
                    <div className="text-sm font-medium text-muted-foreground">Estilo preferido</div>
                    <div className="font-medium mt-1 capitalize">{clientProfile.stylePreference || 'N/A'}</div>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <div className="text-sm font-medium text-muted-foreground">Tema mais frequente</div>
                    <div className="font-medium mt-1 capitalize">{clientProfile.frequentTheme || 'N/A'}</div>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <div className="text-sm font-medium text-muted-foreground">Canal mais usado</div>
                    <div className="font-medium mt-1">{clientProfile.preferredChannel || 'N/A'}</div>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <div className="text-sm font-medium text-muted-foreground">Engajamento estimado</div>
                    <div className="font-medium mt-1 capitalize">{clientProfile.estimatedEngagement || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-muted/50">
                  <div className="text-sm font-medium mb-2">Perfil IA sugerido:</div>
                  <div className="font-medium">{clientProfile.suggestedProfile || 'Dados insuficientes'}</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 space-y-3">
            <h3 className="font-medium text-lg">Ações Disponíveis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button onClick={handleMarkOpportunity} variant="outline" className="w-full">
                Marcar como oportunidade
              </Button>
              <Button onClick={handleSuggestEquipment} variant="outline" className="w-full">
                Sugerir equipamento
              </Button>
              <Button onClick={handleSendInsight} variant="outline" className="w-full">
                Enviar insight
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default ConsultantPanel;
