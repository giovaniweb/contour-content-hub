import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, LineChart, PieChart } from 'lucide-react';

const ReportsPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Relatórios e Analytics</h1>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-4">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="content">
              <LineChart className="h-4 w-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="audience">
              <PieChart className="h-4 w-4 mr-2" />
              Audiência
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Visualizações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,540</div>
                  <p className="text-xs text-muted-foreground">
                    +14% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Engajamento Médio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2 min</div>
                  <p className="text-xs text-muted-foreground">
                    +0.5 min em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">234</div>
                  <p className="text-xs text-muted-foreground">
                    +22% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Desempenho do Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">
                  Gráfico de desempenho do conteúdo será exibido aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Análise de Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">
                  Análise detalhada de conteúdo será exibida aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-4">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Dados de Audiência</CardTitle>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">
                  Dados demográficos e comportamentais da audiência serão exibidos aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
