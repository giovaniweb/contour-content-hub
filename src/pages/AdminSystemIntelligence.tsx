
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";
import { BrainCircuit, LineChart, Settings, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSystemIntelligence: React.FC = () => {
  const { isAdmin } = usePermissions();
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout title="Inteligência Artificial do Sistema">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">IA do Sistema</h1>
          <p className="text-muted-foreground">Configure e monitore os modelos de inteligência artificial utilizados no sistema.</p>
        </div>
        
        <Tabs defaultValue="config" className="space-y-6">
          <TabsList>
            <TabsTrigger value="config">Configurações</TabsTrigger>
            <TabsTrigger value="training">Treinamento</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Modelos OpenAI</CardTitle>
                  <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Configure as chaves de API e modelos do OpenAI.</p>
                  <Button variant="outline" size="sm">Configurar</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Prompts Personalizados</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Gerencie os prompts utilizados pelos modelos de IA.</p>
                  <Button variant="outline" size="sm">Gerenciar</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Configurações Avançadas</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Ajustes avançados de temperatura e parâmetros de modelos.</p>
                  <Button variant="outline" size="sm">Ajustar</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="training" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dados de Treinamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Gerencie os dados de treinamento utilizados para fine-tuning dos modelos de IA.</p>
                <div className="space-x-2">
                  <Button variant="outline">Importar Dados</Button>
                  <Button>Iniciar Treinamento</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Métricas de Uso</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">Monitoramento de uso e performance dos modelos de IA.</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Chamadas API hoje:</span>
                    <span className="font-bold">287</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tokens consumidos:</span>
                    <span className="font-bold">543,892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chamadas com erro:</span>
                    <span className="font-bold text-red-500">7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tempo médio de resposta:</span>
                    <span className="font-bold">1.3s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminSystemIntelligence;
