
import React, { useState } from "react";
import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, RefreshCw, Database, Server, Cpu } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import GlassContainer from "@/components/ui/GlassContainer";

const AdminSystemDiagnostics: React.FC = () => {
  const { isAdmin } = usePermissions();
  const [refreshing, setRefreshing] = useState(false);
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <ContentLayout 
      title="Diagnóstico do Sistema" 
      subtitle="Ferramentas de diagnóstico e monitoramento do sistema"
    >
      <div className="space-y-6">
        <div className="flex justify-between mb-6">
          <div className="flex-grow">
            {/* Titulo já é fornecido pelo ContentLayout */}
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm" 
            className="h-10 whitespace-nowrap"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <GlassContainer>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Server className="mr-2 h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Status do Servidor</h3>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Online</Badge>
            </div>
          </GlassContainer>
          
          <GlassContainer>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Banco de Dados</h3>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Conectado</Badge>
            </div>
          </GlassContainer>
          
          <GlassContainer>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Cpu className="mr-2 h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Uso da CPU</h3>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">37%</Badge>
            </div>
          </GlassContainer>
        </div>
        
        <GlassContainer className="p-0">
          <Tabs defaultValue="logs" className="w-full">
            <div className="px-6 pt-6">
              <TabsList>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="errors">Erros</TabsTrigger>
                <TabsTrigger value="health">Saúde do Sistema</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="logs" className="space-y-4 p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logs do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div>
                      <select className="px-3 py-1.5 border rounded-md text-sm">
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                        <option value="all">Todos</option>
                      </select>
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Filtrar logs..." 
                        className="px-3 py-1.5 border rounded-md text-sm w-full md:w-48"
                      />
                    </div>
                  </div>
                
                  <div className="h-64 bg-muted p-4 rounded-md overflow-auto font-mono text-sm">
                    <p className="text-green-600">[INFO] 2025-05-08 15:30:42 - Sistema iniciado com sucesso</p>
                    <p className="text-green-600">[INFO] 2025-05-08 15:31:15 - 3 usuários conectados</p>
                    <p className="text-green-600">[INFO] 2025-05-08 15:32:22 - Conexão com banco de dados estabelecida</p>
                    <p className="text-amber-600">[WARN] 2025-05-08 15:33:47 - Alta utilização de memória detectada</p>
                    <p className="text-green-600">[INFO] 2025-05-08 15:34:10 - Backup automático realizado</p>
                    <p className="text-amber-600">[WARN] 2025-05-08 15:36:05 - Tempo de resposta da API OpenAI acima do normal</p>
                    <p className="text-red-500">[ERROR] 2025-05-08 15:37:22 - Falha na requisição para serviço externo</p>
                    <p className="text-green-600">[INFO] 2025-05-08 15:38:14 - Serviço de cache reiniciado</p>
                    <p className="text-green-600">[INFO] 2025-05-08 15:40:30 - Rotina de limpeza de arquivos temporários concluída</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4 p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Memória</span>
                      <span className="text-sm text-muted-foreground">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CPU</span>
                      <span className="text-sm text-muted-foreground">37%</span>
                    </div>
                    <Progress value={37} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Disco</span>
                      <span className="text-sm text-muted-foreground">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rede</span>
                      <span className="text-sm text-muted-foreground">18%</span>
                    </div>
                    <Progress value={18} className="h-2" />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">Estatísticas do Sistema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Uptime</p>
                        <p className="font-medium">7 dias, 4 horas</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Req / minuto</p>
                        <p className="font-medium">124</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Tempo de resposta</p>
                        <p className="font-medium">238ms</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="errors" className="space-y-4 p-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Erros do Sistema</CardTitle>
                  <Badge variant={refreshing ? "outline" : "secondary"}>3 erros nas últimas 24h</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-100 rounded-md p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-red-900">Falha na requisição para serviço externo</h3>
                          <p className="text-sm text-red-700 mt-1">Request timeout após 30 segundos</p>
                          <div className="flex items-center mt-2 text-xs text-red-600">
                            <span>15:37:22</span>
                            <span className="mx-2">•</span>
                            <span>vimeo-import/index.ts:142</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-amber-900">Tempo de resposta da API OpenAI acima do normal</h3>
                          <p className="text-sm text-amber-700 mt-1">Tempo de resposta: 4.2s (limite: 3s)</p>
                          <div className="flex items-center mt-2 text-xs text-amber-600">
                            <span>15:36:05</span>
                            <span className="mx-2">•</span>
                            <span>validate-script/index.ts:87</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-amber-900">Alta utilização de memória detectada</h3>
                          <p className="text-sm text-amber-700 mt-1">Uso de memória: 87% (limite: 80%)</p>
                          <div className="flex items-center mt-2 text-xs text-amber-600">
                            <span>15:33:47</span>
                            <span className="mx-2">•</span>
                            <span>monitor/memory.ts:54</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="health" className="space-y-4 p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status dos Serviços</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span>Aplicação Principal</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Operacional</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span>Banco de Dados</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Operacional</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span>API Gateway</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Operacional</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                        <span>Integração Vimeo</span>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Degradado</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span>Serviço de AI</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Operacional</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span>Serviço de Email</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Operacional</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-muted/50 p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Última verificação de saúde</h3>
                    <p className="text-sm text-muted-foreground">08/05/2025 16:32:15 - Todos os sistemas principais operacionais</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </GlassContainer>
      </div>
    </ContentLayout>
  );
};

export default AdminSystemDiagnostics;
