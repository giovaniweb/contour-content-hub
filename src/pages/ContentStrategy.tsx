
import React from 'react';
import ContentLayout from '@/components/layout/ContentLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, BarChart3, ListTodo, AreaChart } from "lucide-react";

const ContentStrategy: React.FC = () => {
  return (
    <ContentLayout
      title="Estratégia de Conteúdo"
      subtitle="Planeje e organize sua estratégia de conteúdo de maneira eficiente"
      actions={
        <Button className="bg-gradient-to-r from-[#0094fb] to-[#f300fc] hover:opacity-90 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Estratégia
        </Button>
      }
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="planner">Planner</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Publicações Pendentes
                </CardTitle>
                <CardDescription>Conteúdos agendados para publicação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">12</div>
                <div className="text-sm text-muted-foreground mt-1">Próximos 30 dias</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                  Performance
                </CardTitle>
                <CardDescription>Média de engajamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">8.7%</div>
                <div className="text-sm text-muted-foreground mt-1">+2.3% que mês anterior</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ListTodo className="mr-2 h-5 w-5 text-primary" />
                  Tarefas
                </CardTitle>
                <CardDescription>Ações pendentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">5</div>
                <div className="text-sm text-muted-foreground mt-1">Criação de conteúdo</div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AreaChart className="mr-2 h-5 w-5 text-primary" />
                Análise de Tendências
              </CardTitle>
              <CardDescription>Visão geral dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Gráfico de tendências será exibido aqui</p>
                <Button variant="outline" className="mt-4">Gerar Relatório</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
            <CardHeader>
              <CardTitle>Calendário de Conteúdo</CardTitle>
              <CardDescription>Visualize e organize suas publicações</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[500px]">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Calendário interativo será implementado em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
            <CardHeader>
              <CardTitle>Analytics de Conteúdo</CardTitle>
              <CardDescription>Métricas e insights sobre sua estratégia</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[500px]">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Módulo de analytics será implementado em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="planner">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
            <CardHeader>
              <CardTitle>Planner de Conteúdo</CardTitle>
              <CardDescription>Organize e planeje suas estratégias</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[500px]">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Planner de conteúdo será implementado em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
};

export default ContentStrategy;
