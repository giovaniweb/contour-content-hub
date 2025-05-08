
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Download, FileText, BarChart3, PieChart } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import ContentPerformanceChart from "@/components/reports/ContentPerformanceChart";
import ChannelDistributionChart from "@/components/reports/ChannelDistributionChart";
import ActivityHeatmap from "@/components/reports/ActivityHeatmap";
import SummaryCard from "@/components/reports/SummaryCard";

// Mock data for reports
const months = [
  { value: "2025-05", label: "Maio 2025" },
  { value: "2025-04", label: "Abril 2025" },
  { value: "2025-03", label: "Março 2025" },
];

const clients = [
  { value: "all", label: "Todos os Clientes" },
  { value: "client1", label: "Clínica Estética Bela" },
  { value: "client2", label: "Dr. Fernando Estética" },
  { value: "client3", label: "Instituto Beleza Natural" },
];

// Mock performance data
const mockPerformanceData = {
  planned: 32,
  published: 27,
  channels: {
    Instagram: 18,
    TikTok: 7,
    YouTube: 2,
  },
  activityByDay: {
    Monday: 4,
    Tuesday: 7,
    Wednesday: 3,
    Thursday: 8,
    Friday: 5,
    Saturday: 0,
    Sunday: 0,
  },
  activityByTime: {
    morning: 8,
    afternoon: 12, 
    evening: 7,
  },
  moduleUsage: {
    "AI Script Generator": 22,
    "Content Planner": 32,
    "Scientific Articles": 5,
    "Video Distribution": 14,
  },
  topPerformingContent: [
    {
      title: "Os benefícios do tratamento facial",
      platform: "Instagram",
      engagement: 87,
    },
    {
      title: "Tutorial de uso do equipamento X",
      platform: "YouTube",
      engagement: 72,
    },
    {
      title: "Resultados antes e depois",
      platform: "TikTok",
      engagement: 65,
    },
  ],
  summary: "Este mês, sua estratégia focou em conteúdo educacional sobre tratamentos faciais, com ênfase na plataforma Instagram. Houve um aumento de 23% no engajamento comparado ao mês anterior. Recomendamos ampliar a presença no TikTok, que mostrou um crescimento de engajamento acima da média.",
};

const ReportsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("2025-05");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const { theme = 'light' } = useTheme();
  const { toast } = useToast();

  // Calculate completion percentage
  const completionPercentage = Math.round((mockPerformanceData.published / mockPerformanceData.planned) * 100);

  const handleExport = (format: "pdf" | "csv") => {
    // Simulate export processing
    toast({
      title: `Exportando relatório como ${format.toUpperCase()}`,
      description: "O arquivo será baixado em instantes.",
    });

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Relatório exportado com sucesso!",
        description: `Relatório_${selectedClient}_${selectedMonth}.${format}`,
      });
    }, 2000);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fluida-blue to-fluida-pink">
              Relatórios de Desempenho
            </h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe a execução e o engajamento do conteúdo publicado
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <Select 
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedClient}
              onValueChange={setSelectedClient}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.value} value={client.value}>
                    {client.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Conteúdo Planejado vs. Publicado</CardTitle>
              <CardDescription>Taxa de execução do planejamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completionPercentage}%</div>
              <Progress value={completionPercentage} className="mt-2" />
              <div className="mt-2 text-sm text-muted-foreground">
                {mockPerformanceData.published} de {mockPerformanceData.planned} conteúdos publicados
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Canais Utilizados</CardTitle>
              <CardDescription>Distribuição por plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  {Object.entries(mockPerformanceData.channels).map(([channel, count]) => (
                    <div key={channel} className="flex items-center">
                      <span className="text-sm">{channel}</span>
                      <span className="ml-auto text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Módulos mais utilizados</CardTitle>
              <CardDescription>Distribuição de uso das ferramentas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(mockPerformanceData.moduleUsage).map(([module, count]) => (
                  <div key={module} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{module}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                    <Progress 
                      value={(count / 32) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="summary">Resumo AI</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Performance de Conteúdo
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px]">
                    <ContentPerformanceChart />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Distribuição por Canais
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px]">
                    <ChannelDistributionChart data={mockPerformanceData.channels} />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Atividade Semanal</CardTitle>
                <CardDescription>
                  Distribuição de publicações por dia e horário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ActivityHeatmap data={mockPerformanceData.activityByDay} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo com Melhor Performance</CardTitle>
                <CardDescription>
                  Os conteúdos que obtiveram maior engajamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPerformanceData.topPerformingContent.map((content, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-md bg-accent/20">
                      <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{content.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{content.platform}</span>
                          <div className="mx-2 h-1 w-1 rounded-full bg-muted-foreground"></div>
                          <span>{content.engagement}% engajamento</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="summary">
            <SummaryCard summary={mockPerformanceData.summary} />
          </TabsContent>
          
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Relatório</CardTitle>
                <CardDescription>
                  Escolha o formato para exportar o relatório completo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center p-3 rounded-md border">
                    <FileText className="h-5 w-5 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium">Relatório em PDF</div>
                      <div className="text-sm text-muted-foreground">
                        Documento completo com gráficos e análises
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExport("pdf")}
                      className="ml-auto"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-md border">
                    <BarChart3 className="h-5 w-5 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium">Dados em CSV</div>
                      <div className="text-sm text-muted-foreground">
                        Dados brutos para análise em planilhas
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExport("csv")}
                      className="ml-auto"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Os dados exportados são referentes a {selectedClient === "all" ? "todos os clientes" : "cliente selecionado"} no período de {format(new Date(selectedMonth), "MMMM yyyy", { locale: ptBR })}.
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ReportsPage;
