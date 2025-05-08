
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";

const AdminSystemDiagnostics: React.FC = () => {
  const { isAdmin } = usePermissions();
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout title="Diagnóstico do Sistema">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Diagnóstico do Sistema</h1>
        
        <Tabs defaultValue="logs" className="w-full">
          <TabsList>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="errors">Erros</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logs" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Logs do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted p-4 rounded-md overflow-auto">
                  <p className="font-mono text-sm">
                    [INFO] 2025-05-08 15:30:42 - Sistema iniciado com sucesso<br />
                    [INFO] 2025-05-08 15:31:15 - 3 usuários conectados<br />
                    [INFO] 2025-05-08 15:32:22 - Conexão com banco de dados estabelecida<br />
                    [INFO] 2025-05-08 15:34:10 - Backup automático realizado<br />
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Gráficos de performance do sistema em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="errors" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Erros do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Nenhum erro crítico reportado nas últimas 24 horas.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminSystemDiagnostics;
