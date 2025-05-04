
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Cog,
  Settings,
  Activity,
  ListChecks,
  RefreshCw,
  Clock,
  Wrench,
  Terminal,
  Brain,
  Shield,
  Gauge
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

// Interfaces para o sistema de diagnóstico
interface SystemIssue {
  id: string;
  component: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'resolved';
  created_at: string;
  resolved_at?: string;
  category: 'bug' | 'improvement' | 'feature';
  assignedTo?: string;
  priority: number;
}

interface SystemMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  category: 'performance' | 'usage' | 'quality';
}

const SystemDiagnostics: React.FC = () => {
  const { toast } = useToast();
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState<string>("issues");
  const [systemIssues, setSystemIssues] = useState<SystemIssue[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRunningCheck, setIsRunningCheck] = useState<boolean>(false);

  // Mock de dados para demonstração
  const mockIssues: SystemIssue[] = [
    {
      id: "1",
      component: "Importação de Vídeos",
      description: "Erro na importação de vídeos do Vimeo - API retorna erro 400",
      severity: "high",
      status: "in-progress",
      created_at: "2025-05-03T12:00:00",
      category: "bug",
      priority: 1
    },
    {
      id: "2",
      component: "Dashboard",
      description: "Widgets de estatísticas não carregam dados reais",
      severity: "medium",
      status: "pending",
      created_at: "2025-05-02T09:30:00",
      category: "bug",
      priority: 3
    },
    {
      id: "3",
      component: "Calendário",
      description: "Implementar funcionalidade de drag-and-drop para eventos",
      severity: "low",
      status: "pending",
      created_at: "2025-05-01T15:20:00",
      category: "improvement",
      priority: 4
    },
    {
      id: "4",
      component: "Visualização de PDFs",
      description: "Adicionar suporte para anotações nos documentos PDF",
      severity: "medium",
      status: "pending",
      created_at: "2025-04-30T11:45:00",
      category: "feature",
      priority: 5
    },
    {
      id: "5",
      component: "Layout Mobile",
      description: "Sidebar não se adapta corretamente em dispositivos móveis",
      severity: "high",
      status: "pending",
      created_at: "2025-04-29T16:15:00",
      category: "bug",
      priority: 2
    },
    {
      id: "6",
      component: "Artigos Científicos",
      description: "Melhorar algoritmo de extração de metadados de PDFs",
      severity: "medium",
      status: "in-progress",
      created_at: "2025-04-28T10:20:00",
      category: "improvement",
      priority: 6
    }
  ];

  const mockMetrics: SystemMetric[] = [
    {
      name: "Tempo de Carregamento",
      value: 2.5,
      target: 2.0,
      unit: "segundos",
      status: "warning",
      category: "performance"
    },
    {
      name: "Disponibilidade API",
      value: 99.8,
      target: 99.9,
      unit: "%",
      status: "good",
      category: "performance"
    },
    {
      name: "Taxa de Erro",
      value: 1.2,
      target: 1.0,
      unit: "%",
      status: "warning",
      category: "quality"
    },
    {
      name: "Uso de Memória",
      value: 65,
      target: 80,
      unit: "%",
      status: "good",
      category: "usage"
    },
    {
      name: "Satisfação do Usuário",
      value: 4.2,
      target: 4.5,
      unit: "pontos",
      status: "warning",
      category: "quality"
    }
  ];

  // Carregar dados iniciais
  useEffect(() => {
    loadSystemData();
  }, []);

  // Verificar permissões - apenas admins podem acessar
  if (!hasPermission("editAllContent")) {
    toast({
      variant: "destructive",
      title: "Acesso Negado",
      description: "Você não possui permissões para acessar esta página",
    });
    return <Navigate to="/dashboard" replace />;
  }

  const loadSystemData = async () => {
    setIsLoading(true);
    try {
      // Em uma implementação real, buscar do banco de dados
      // Aqui usamos dados mock para demonstração
      setSystemIssues(mockIssues);
      setSystemMetrics(mockMetrics);
    } catch (error) {
      console.error("Erro ao carregar dados do sistema:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do sistema"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runSystemCheck = async () => {
    setIsRunningCheck(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulação de processamento
      
      toast({
        title: "Verificação Concluída",
        description: "O sistema foi verificado com sucesso",
      });
      
      // Atualiza a lista com novos problemas encontrados
      const newIssue: SystemIssue = {
        id: `new-${Date.now()}`,
        component: "Suporte a Dispositivos",
        description: "Melhorar responsividade para tablets em modo paisagem",
        severity: "medium",
        status: "pending",
        created_at: new Date().toISOString(),
        category: "improvement",
        priority: systemIssues.length + 1
      };
      
      setSystemIssues([...systemIssues, newIssue]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na Verificação",
        description: "Não foi possível concluir a verificação do sistema",
      });
    } finally {
      setIsRunningCheck(false);
    }
  };

  const updateIssueStatus = (id: string, status: 'pending' | 'in-progress' | 'resolved') => {
    setSystemIssues(issues => 
      issues.map(issue => 
        issue.id === id 
          ? { ...issue, status, resolved_at: status === 'resolved' ? new Date().toISOString() : undefined } 
          : issue
      )
    );
    
    toast({
      title: "Status Atualizado",
      description: `O status do problema foi atualizado para ${
        status === 'pending' ? 'pendente' : 
        status === 'in-progress' ? 'em andamento' : 
        'resolvido'
      }`,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'bug':
        return <Badge variant="destructive">Bug</Badge>;
      case 'improvement':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Melhoria</Badge>;
      case 'feature':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">Funcionalidade</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  const getMetricStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (value > target) {
      return "bg-red-500";
    } else if (percentage > 90) {
      return "bg-yellow-500";
    } else {
      return "bg-green-500";
    }
  };

  return (
    <Layout title="Diagnóstico do Sistema" fullWidth>
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-primary" /> 
                  Diagnóstico do Sistema
                </CardTitle>
                <CardDescription>
                  Monitoramento de saúde, problemas e melhorias do sistema
                </CardDescription>
              </div>
              <Button 
                onClick={runSystemCheck} 
                disabled={isRunningCheck}
                size="sm"
              >
                {isRunningCheck ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2 h-4 w-4" />
                    Verificar Sistema
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          <Tabs defaultValue="issues" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="issues" className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  <span>Problemas</span>
                </TabsTrigger>
                <TabsTrigger value="metrics" className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  <span>Métricas</span>
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>Logs</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent>
              <TabsContent value="issues" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {systemIssues
                    .sort((a, b) => a.priority - b.priority)
                    .map((issue) => (
                      <Card key={issue.id} className="flex flex-col h-full overflow-hidden">
                        <CardHeader className="pb-2 relative">
                          <div className={`absolute left-0 top-0 w-1.5 h-full ${getSeverityColor(issue.severity)}`} />
                          <div className="pl-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-sm">{issue.component}</h3>
                                {getCategoryBadge(issue.category)}
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                                {issue.status === 'pending' ? 'Pendente' : 
                                 issue.status === 'in-progress' ? 'Em Andamento' : 
                                 'Resolvido'}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 pl-5">
                          <p className="text-sm">{issue.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Criado em: {new Date(issue.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-2 mt-auto pl-5 flex gap-2">
                          {issue.status !== 'resolved' && (
                            <>
                              {issue.status === 'pending' ? (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => updateIssueStatus(issue.id, 'in-progress')}
                                >
                                  <Clock className="h-4 w-4 mr-1" />
                                  Iniciar
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => updateIssueStatus(issue.id, 'pending')}
                                >
                                  <Clock className="h-4 w-4 mr-1" />
                                  Pausar
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="default" 
                                onClick={() => updateIssueStatus(issue.id, 'resolved')}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Resolver
                              </Button>
                            </>
                          )}
                          {issue.status === 'resolved' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateIssueStatus(issue.id, 'pending')}
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Reabrir
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="mt-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {systemMetrics.map((metric, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center">
                              {getMetricStatusIcon(metric.status)}
                              <span className="ml-2">{metric.name}</span>
                            </CardTitle>
                            <Badge variant={metric.status === 'good' ? 'outline' : 'secondary'}>
                              {metric.category === 'performance' ? 'Performance' : 
                               metric.category === 'usage' ? 'Uso' : 'Qualidade'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-semibold">
                                {metric.value} {metric.unit}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Meta: {metric.target} {metric.unit}
                              </span>
                            </div>
                            <Progress 
                              value={(metric.value / metric.target) * 100} 
                              className="h-2" 
                              indicatorClassName={
                                metric.status === 'good' ? 'bg-green-500' :
                                metric.status === 'warning' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="logs" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Logs do Sistema</CardTitle>
                    <CardDescription>Últimas atividades e erros registrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-xs h-80 overflow-auto">
                      <p className="text-gray-400">[2025-05-04 01:33:12] INFO: Sistema inicializado com sucesso</p>
                      <p className="text-yellow-400">[2025-05-04 01:34:22] WARN: Tempo de carregamento acima do esperado em /admin/content</p>
                      <p className="text-red-400">[2025-05-04 01:35:45] ERROR: Erro na importação do Vimeo: vimeo-import function returned 400</p>
                      <p className="text-gray-400">[2025-05-04 01:36:10] INFO: Usuário admin@example.com fez login</p>
                      <p className="text-gray-400">[2025-05-04 01:37:22] INFO: Novo artigo científico carregado (ID: 1245)</p>
                      <p className="text-yellow-400">[2025-05-04 01:38:45] WARN: Uso de memória elevado: 82%</p>
                      <p className="text-gray-400">[2025-05-04 01:40:12] INFO: Backup automático concluído</p>
                      <p className="text-red-400">[2025-05-04 01:41:36] ERROR: Falha ao enviar email de notificação</p>
                      <p className="text-gray-400">[2025-05-04 01:42:05] INFO: Validação de roteiro concluída (ID: 5632)</p>
                      <p className="text-gray-400">[2025-05-04 01:43:22] INFO: Calendário atualizado para o usuário ID 123</p>
                      <p className="text-gray-400">[2025-05-04 01:44:15] INFO: Dispositivo móvel detectado - iPhone 14</p>
                      <p className="text-gray-400">[2025-05-04 01:45:33] INFO: Visualização de documento PDF (ID: 234)</p>
                      <p className="text-yellow-400">[2025-05-04 01:46:52] WARN: Lentidão na API detectada</p>
                      <p className="text-gray-400">[2025-05-04 01:48:05] INFO: Usuário user@example.com fez logout</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estado Atual do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-700">Sistema Online</span>
                </div>
                <p className="mt-1 text-sm text-green-600">Todos os serviços funcionando normalmente</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-700">Performance</span>
                </div>
                <p className="mt-1 text-sm text-blue-600">Tempo de resposta: 350ms (Bom)</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-700">Manutenção</span>
                </div>
                <p className="mt-1 text-sm text-orange-600">2 melhorias em andamento</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2">
                  <Gauge className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-700">Saúde</span>
                </div>
                <p className="mt-1 text-sm text-purple-600">92% de saúde geral do sistema</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Verificações Automatizadas</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox id="check1" checked />
                  <label htmlFor="check1" className="ml-2 text-sm">
                    Verificação de segurança (Última: há 2 horas)
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="check2" checked />
                  <label htmlFor="check2" className="ml-2 text-sm">
                    Backup de dados (Último: há 1 dia)
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="check3" checked />
                  <label htmlFor="check3" className="ml-2 text-sm">
                    Teste de APIs (Último: há 1 hora)
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="check4" />
                  <label htmlFor="check4" className="ml-2 text-sm">
                    Auditoria de permissões (Pendente)
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SystemDiagnostics;
