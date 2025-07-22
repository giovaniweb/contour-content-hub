import React from 'react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, LineChart, PieChart, Sparkles, TrendingUp } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const statusBadges = [
    {
      icon: TrendingUp,
      label: 'Analytics',
      variant: 'secondary' as const,
      color: 'bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30'
    },
    {
      icon: Sparkles,
      label: 'Insights',
      variant: 'secondary' as const,
      color: 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={BarChart3}
        title="Relatórios e Analytics"
        subtitle="Acompanhe o desempenho e obtenha insights valiosos"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6 py-8">
        
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
    </AuroraPageLayout>
  );
};

export default ReportsPage;
