
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";
import { BrainCircuit, LineChart, Settings, MessageSquare, ChevronRight, Bell, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const AdminSystemIntelligence: React.FC = () => {
  const { isAdmin } = usePermissions();
  const [activeTab, setActiveTab] = useState("config");
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="mb-10 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="bg-violet-100 p-3 rounded-full">
              <BrainCircuit className="h-8 w-8 text-violet-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Inteligência Artificial do Sistema
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Configure e monitore os modelos de IA integrados ao Fluida
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-white/80 border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requisições hoje</p>
                  <p className="text-2xl font-bold">287</p>
                </div>
                <LineChart className="h-10 w-10 text-blue-500 opacity-80" />
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground">Uso da API</p>
                <Progress value={68} className="h-2 mt-2" />
                <p className="text-xs text-right mt-1">68% do limite mensal</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="flex items-center mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="font-medium">Todos serviços operacionais</span>
                  </p>
                </div>
                <Terminal className="h-10 w-10 text-green-500 opacity-80" />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-between items-center">
            <TabsList className="bg-slate-100 p-1">
              <TabsTrigger value="config" className="rounded-md">Configurações</TabsTrigger>
              <TabsTrigger value="training" className="rounded-md">Treinamento</TabsTrigger>
              <TabsTrigger value="monitoring" className="rounded-md">Monitoramento</TabsTrigger>
            </TabsList>
            
            <Button size="sm" variant="outline" className="gap-1 text-xs">
              <Bell className="h-3.5 w-3.5" />
              Notificações
            </Button>
          </div>
          
          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">OpenAI GPT-4</CardTitle>
                    <CardDescription>API e configurações</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">Ativo</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Modelo</span>
                      <span className="font-medium">gpt-4-turbo</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Temperatura</span>
                      <span className="font-medium">0.7</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tokens máx.</span>
                      <span className="font-medium">4000</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-between">
                    <span>Configurar</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">Prompts Personalizados</CardTitle>
                    <CardDescription>Gerenciador de prompts</CardDescription>
                  </div>
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-medium">12 prompts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Última atualização</span>
                      <span className="font-medium">2 dias atrás</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Otimização</span>
                      <span className="font-medium text-amber-600">Recomendada</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-between">
                    <span>Gerenciar</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">Configurações Avançadas</CardTitle>
                    <CardDescription>Parâmetros e ajustes</CardDescription>
                  </div>
                  <Settings className="h-5 w-5 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cache</span>
                      <span className="font-medium">Ativado</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fallback</span>
                      <span className="font-medium">GPT-3.5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Log nível</span>
                      <span className="font-medium">Informativo</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-between">
                    <span>Configurar</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados de Treinamento</CardTitle>
                <CardDescription>Fine-tuning e personalização dos modelos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4 mb-6">
                  <h3 className="text-sm font-medium mb-2">Conjuntos de dados disponíveis</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded bg-slate-50 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium">Roteiros Médicos</span>
                      </div>
                      <span className="text-muted-foreground">489 exemplos</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-slate-50 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="font-medium">Perguntas Frequentes</span>
                      </div>
                      <span className="text-muted-foreground">112 exemplos</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-slate-50 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                        <span className="font-medium">Descrições de Produtos</span>
                      </div>
                      <span className="text-muted-foreground">275 exemplos</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline">Importar Dados</Button>
                  <Button>Iniciar Treinamento</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Métricas de Uso</CardTitle>
                  <CardDescription>Monitoramento e performance da IA</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  <LineChart className="h-4 w-4" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Uso diário</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Chamadas API hoje:</span>
                          <span className="font-bold">287</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Tokens consumidos:</span>
                          <span className="font-bold">543,892</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Chamadas com erro:</span>
                          <span className="font-bold text-red-500">7</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Performance</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Tempo médio de resposta:</span>
                          <span className="font-bold">1.3s</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Taxa de sucesso:</span>
                          <span className="font-bold text-green-500">97.6%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Cache hits:</span>
                          <span className="font-bold">42%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Uso por módulos</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Gerador de Roteiros</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Validador de Conteúdo</span>
                          <span>28%</span>
                        </div>
                        <Progress value={28} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Consultor Estratégico</span>
                          <span>18%</span>
                        </div>
                        <Progress value={18} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Outros</span>
                          <span>9%</span>
                        </div>
                        <Progress value={9} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSystemIntelligence;
