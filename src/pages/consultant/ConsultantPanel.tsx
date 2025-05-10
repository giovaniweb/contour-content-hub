
import React, { useState, useEffect } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  Search,
  Activity,
  TrendingUp,
  Check,
  Package,
  Send,
  Lightbulb,
  Calendar
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from "@/components/Layout";

interface Workspace {
  id: string;
  nome: string;
  plano: string;
  criado_em: string;
  admin_nome?: string;
  ultimo_acesso?: string;
}

interface WorkspaceDetail {
  id: string;
  nome: string;
  plano: string;
  admin_nome?: string;
  ultimo_acesso?: string;
  roteiros_recentes?: {
    id: string;
    titulo: string;
    data_criacao: string;
  }[];
  conteudos_validados?: {
    id: string;
    titulo: string;
    data_validacao: string;
  }[];
  artigos_acessados?: {
    id: string;
    titulo: string;
    data_acesso: string;
  }[];
  estilo_preferido?: string;
  tema_mais_frequente?: string;
  canal_mais_usado?: string;
  engajamento_estimado?: "alto" | "médio" | "baixo";
  perfil_sugerido?: string;
}

const ConsultantPanel: React.FC = () => {
  const { canViewConsultantPanel } = usePermissions();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  
  useEffect(() => {
    if (!canViewConsultantPanel()) {
      toast.error("Acesso não autorizado", {
        description: "Você não tem permissão para acessar esta página."
      });
      navigate("/");
      return;
    }
    
    fetchWorkspaces();
  }, [canViewConsultantPanel, navigate]);
  
  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      
      // Buscar todos os workspaces
      const { data: workspacesData, error: workspacesError } = await supabase
        .from('workspaces')
        .select('*');
      
      if (workspacesError) throw workspacesError;
      
      // Para cada workspace, buscar o admin
      const enrichedWorkspaces = await Promise.all((workspacesData || []).map(async (workspace) => {
        // Buscar o admin do workspace
        const { data: adminData } = await supabase
          .from('users')
          .select('nome, criado_em')
          .eq('workspace_id', workspace.id)
          .eq('role', 'admin')
          .single();
        
        // Buscar registro de último acesso
        const { data: usageData } = await supabase
          .from('user_usage')
          .select('last_activity')
          .eq('user_id', adminData?.id)
          .order('last_activity', { ascending: false })
          .limit(1)
          .single();
        
        return {
          ...workspace,
          admin_nome: adminData?.nome || 'Sem admin',
          ultimo_acesso: usageData?.last_activity || workspace.criado_em
        };
      }));
      
      setWorkspaces(enrichedWorkspaces);
    } catch (error) {
      console.error('Erro ao buscar workspaces:', error);
      toast.error("Erro", {
        description: "Não foi possível carregar a lista de workspaces."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchWorkspaceDetails = async (workspaceId: string) => {
    try {
      // Buscar dados básicos do workspace
      const { data: workspaceData } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();
      
      // Buscar o admin do workspace
      const { data: adminData } = await supabase
        .from('users')
        .select('nome, criado_em')
        .eq('workspace_id', workspaceId)
        .eq('role', 'admin')
        .single();
      
      // Mock de dados que viriam do backend real
      const workspaceDetail: WorkspaceDetail = {
        id: workspaceData.id,
        nome: workspaceData.nome,
        plano: workspaceData.plano,
        admin_nome: adminData?.nome || 'Sem admin',
        ultimo_acesso: adminData?.criado_em || workspaceData.criado_em,
        roteiros_recentes: [
          { id: '1', titulo: 'Divulgação de nova tecnologia', data_criacao: '2025-05-08' },
          { id: '2', titulo: 'Tratamento para rejuvenescimento', data_criacao: '2025-05-05' },
        ],
        conteudos_validados: [
          { id: '1', titulo: 'Tratamentos faciais modernos', data_validacao: '2025-05-07' },
          { id: '2', titulo: 'Equipamentos de radiofrequência', data_validacao: '2025-05-03' },
        ],
        artigos_acessados: [
          { id: '1', titulo: 'Novas tecnologias estéticas', data_acesso: '2025-05-06' },
          { id: '2', titulo: 'Comparativo de procedimentos', data_acesso: '2025-05-02' },
        ],
        estilo_preferido: 'emocional',
        tema_mais_frequente: 'rejuvenescimento',
        canal_mais_usado: 'Instagram',
        engajamento_estimado: 'médio',
        perfil_sugerido: 'potencial comprador',
      };
      
      setSelectedWorkspace(workspaceDetail);
      setSheetOpen(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do workspace:', error);
      toast.error("Erro", {
        description: "Não foi possível carregar os detalhes do workspace."
      });
    }
  };
  
  const handleMarkAsOpportunity = (workspaceId: string) => {
    toast.success("Oportunidade marcada", {
      description: "O cliente foi marcado como uma oportunidade comercial."
    });
  };
  
  const handleSuggestEquipment = (workspaceId: string) => {
    toast.success("Equipamento sugerido", {
      description: "Suas sugestões de equipamento foram enviadas."
    });
  };
  
  const handleSendInsight = (workspaceId: string) => {
    toast.success("Insight enviado", {
      description: "O insight estratégico foi enviado ao cliente."
    });
  };
  
  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.admin_nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.plano.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getEngagementBadge = (level?: string) => {
    switch (level) {
      case 'alto':
        return <Badge variant="default" className="bg-green-500">Alto</Badge>;
      case 'médio':
        return <Badge variant="default" className="bg-yellow-500">Médio</Badge>;
      case 'baixo':
        return <Badge variant="default" className="bg-red-500">Baixo</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Painel do Consultor</h1>
            <p className="text-muted-foreground">
              Visão estratégica dos clientes e seus comportamentos
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Total de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{workspaces.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Clientes Ativos
              </CardTitle>
              <CardDescription>Últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {workspaces.filter(workspace => 
                  workspace.ultimo_acesso && 
                  new Date(workspace.ultimo_acesso) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Oportunidades Identificadas
              </CardTitle>
              <CardDescription>Este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Seus Clientes</CardTitle>
            <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
              <Input 
                type="text"
                placeholder="Buscar clientes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Clínica</TableHead>
                      <TableHead>Dono</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Último acesso</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkspaces.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          Nenhum cliente encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWorkspaces.map(workspace => (
                        <TableRow key={workspace.id}>
                          <TableCell className="font-medium">{workspace.nome}</TableCell>
                          <TableCell>{workspace.admin_nome}</TableCell>
                          <TableCell>
                            <Badge variant={workspace.plano === 'free' ? 'outline' : 'default'}>
                              {workspace.plano.charAt(0).toUpperCase() + workspace.plano.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(workspace.ultimo_acesso || "").toLocaleString()}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => fetchWorkspaceDetails(workspace.id)}
                            >
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          {selectedWorkspace && (
            <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
              <SheetHeader className="pb-5">
                <SheetTitle className="text-2xl">{selectedWorkspace.nome}</SheetTitle>
                <SheetDescription>
                  <div className="flex items-center justify-between">
                    <Badge variant={selectedWorkspace.plano === 'free' ? 'outline' : 'default'}>
                      {selectedWorkspace.plano.charAt(0).toUpperCase() + selectedWorkspace.plano.slice(1)}
                    </Badge>
                    <span className="text-sm">Admin: {selectedWorkspace.admin_nome}</span>
                  </div>
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6">
                {/* Sessão: Atividades Recentes */}
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Atividades Recentes
                  </h2>
                  
                  {/* Roteiros recentes */}
                  <Card className="mb-3">
                    <CardHeader className="py-2 px-3">
                      <CardTitle className="text-sm">Roteiros Recentes</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-3">
                      <ul className="space-y-1 text-sm">
                        {selectedWorkspace.roteiros_recentes?.map(roteiro => (
                          <li key={roteiro.id} className="flex justify-between">
                            <span>{roteiro.titulo}</span>
                            <span className="text-muted-foreground">{new Date(roteiro.data_criacao).toLocaleDateString()}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  {/* Conteúdos validados */}
                  <Card className="mb-3">
                    <CardHeader className="py-2 px-3">
                      <CardTitle className="text-sm">Conteúdos Mais Validados</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-3">
                      <ul className="space-y-1 text-sm">
                        {selectedWorkspace.conteudos_validados?.map(conteudo => (
                          <li key={conteudo.id} className="flex justify-between">
                            <span>{conteudo.titulo}</span>
                            <span className="text-muted-foreground">{new Date(conteudo.data_validacao).toLocaleDateString()}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  {/* Artigos acessados */}
                  <Card>
                    <CardHeader className="py-2 px-3">
                      <CardTitle className="text-sm">Artigos Acessados Recentemente</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-3">
                      <ul className="space-y-1 text-sm">
                        {selectedWorkspace.artigos_acessados?.map(artigo => (
                          <li key={artigo.id} className="flex justify-between">
                            <span>{artigo.titulo}</span>
                            <span className="text-muted-foreground">{new Date(artigo.data_acesso).toLocaleDateString()}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Sessão: Padrões Detectados */}
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Padrões Detectados
                  </h2>
                  
                  <Card className="mb-4">
                    <CardContent className="py-3 px-4">
                      <dl className="grid grid-cols-1 gap-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium">Estilo preferido:</dt>
                          <dd className="text-sm">{selectedWorkspace.estilo_preferido}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium">Tema mais frequente:</dt>
                          <dd className="text-sm">{selectedWorkspace.tema_mais_frequente}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium">Canal mais usado:</dt>
                          <dd className="text-sm">{selectedWorkspace.canal_mais_usado}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium">Engajamento estimado:</dt>
                          <dd className="text-sm">{getEngagementBadge(selectedWorkspace.engajamento_estimado)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium">Perfil sugerido:</dt>
                          <dd className="text-sm">{selectedWorkspace.perfil_sugerido}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Ações do consultor */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold mb-2">Ações</h2>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Button className="w-full" onClick={() => handleMarkAsOpportunity(selectedWorkspace.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      Marcar como oportunidade
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => handleSuggestEquipment(selectedWorkspace.id)}>
                      <Package className="mr-2 h-4 w-4" />
                      Sugerir equipamento
                    </Button>
                    <Button className="w-full" variant="secondary" onClick={() => handleSendInsight(selectedWorkspace.id)}>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar insight estratégico
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          )}
        </Sheet>
      </div>
    </Layout>
  );
};

export default ConsultantPanel;
