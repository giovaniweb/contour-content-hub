
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";
import { Users, Server, FileText, Activity, FileCheck2, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard: React.FC = () => {
  const { isAdmin } = usePermissions();
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout title="Painel de Administração">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Painel de Administração</h1>
          <p className="text-muted-foreground">Gerencie o sistema e acesse as principais ferramentas administrativas.</p>
        </div>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">Online</div>
                <Server className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Todos os serviços operacionais</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">27</div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">↑ 8%</span> desde ontem
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Roteiros Gerados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">143</div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">↑ 12%</span> esta semana
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Uso de API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">68%</div>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Da cota mensal de tokens</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gerenciar Usuários</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Adicione, edite e gerencie permissões de usuários.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span>Administradores:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Operadores:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Usuários padrão:</span>
                  <span className="font-medium">78</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Gerenciar Usuários
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Equipamentos</CardTitle>
                <Server className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Gerencie o catálogo de equipamentos do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span>Total de equipamentos:</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span>Adicionados recentemente:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Pendentes de aprovação:</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/equipments">
                  Gerenciar Equipamentos
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conteúdo</CardTitle>
                <FileCheck2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Gerencie materiais e artigos da biblioteca.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span>Materiais:</span>
                  <span className="font-medium">127</span>
                </div>
                <div className="flex justify-between">
                  <span>Artigos científicos:</span>
                  <span className="font-medium">86</span>
                </div>
                <div className="flex justify-between">
                  <span>Vídeos:</span>
                  <span className="font-medium">213</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/content">
                  Gerenciar Conteúdo
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Integrações</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plug-2 text-muted-foreground"><path d="M9 2v6"/><path d="M15 2v6"/><path d="M12 17v5"/><path d="M5 8h14"/><path d="M6 11V8h12v3a6 6 0 1 1-12 0v0z"/></svg>
              </div>
              <CardDescription>Gerencie as integrações externas do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span>Integrações ativas:</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span>Disponíveis:</span>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex justify-between">
                  <span>Últimos erros:</span>
                  <span className="font-medium text-amber-600">1</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/integrations">
                  Gerenciar Integrações
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inteligência do Sistema</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit text-muted-foreground"><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z"/><path d="M16 8V5c0-1.1.9-2 2-2"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8a2 2 0 0 0 2-2V5"/><path d="M18.5 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/></svg>
              </div>
              <CardDescription>Configure os modelos de IA e parâmetros do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span>Modelo atual:</span>
                  <span className="font-medium">GPT-4</span>
                </div>
                <div className="flex justify-between">
                  <span>Tokens usados (mês):</span>
                  <span className="font-medium">1.2M</span>
                </div>
                <div className="flex justify-between">
                  <span>Prompts personalizados:</span>
                  <span className="font-medium">14</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/system-intelligence">
                  Configurar IA
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Diagnóstico do Sistema</CardTitle>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Monitore o desempenho e diagnostique problemas.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span>Estado do servidor:</span>
                  <span className="font-medium text-green-600">Saudável</span>
                </div>
                <div className="flex justify-between">
                  <span>Tempo de atividade:</span>
                  <span className="font-medium">7 dias</span>
                </div>
                <div className="flex justify-between">
                  <span>Alertas ativos:</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/system-diagnostics">
                  Ver Diagnóstico
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Atividades Recentes</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {[
                  { user: "Admin", action: "Adicionou novo equipamento", time: "Há 35 minutos", icon: <Server className="h-4 w-4" /> },
                  { user: "Sistema", action: "Backup automático concluído", time: "Há 2 horas", icon: <Clock className="h-4 w-4" /> },
                  { user: "Operador", action: "Atualizou 3 artigos", time: "Há 3 horas", icon: <FileText className="h-4 w-4" /> },
                  { user: "Admin", action: "Atualizou configurações de IA", time: "Há 5 horas", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit"><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z"/><path d="M16 8V5c0-1.1.9-2 2-2"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8a2 2 0 0 0 2-2V5"/><path d="M18.5 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/></svg> },
                  { user: "Sistema", action: "Conexão com Vimeo reiniciada", time: "Há 6 horas", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plug-2"><path d="M9 2v6"/><path d="M15 2v6"/><path d="M12 17v5"/><path d="M5 8h14"/><path d="M6 11V8h12v3a6 6 0 1 1-12 0v0z"/></svg> }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 px-6 py-4">
                    <div className="bg-muted/50 p-2 rounded-full">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">por {activity.user}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
