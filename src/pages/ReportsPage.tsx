
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Download, FileText, BarChart3, PieChart, BrainCircuit, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import ContentPerformanceChart from "@/components/reports/ContentPerformanceChart";
import ChannelDistributionChart from "@/components/reports/ChannelDistributionChart";
import ActivityHeatmap from "@/components/reports/ActivityHeatmap";
import SummaryCard from "@/components/reports/SummaryCard";

// Mock data para diagnósticos do consultor de marketing
const mockMarketingConsultantData = {
  diagnosticos: [
    {
      id: 1,
      data: "2025-06-07",
      tipoClinica: "Estética Facial Especializada",
      faturamentoAtual: "R$ 15k-30k",
      metaFaturamento: "Dobrar Faturamento",
      principalDesafio: "Dificuldade em Atrair Novos Clientes",
      investimentoMarketing: "Investimento Básico (até R$ 1.000)",
      presencaDigital: "Básica",
      publicoAlvo: "Adultos (30-45 anos)",
      pontuacaoGeral: 65,
      proximosPassos: [
        "Criar presença digital básica (Instagram e Facebook)",
        "Definir orçamento mínimo para marketing (3-5% do faturamento)",
        "Implementar sistema de acompanhamento de métricas e ROI"
      ]
    },
    {
      id: 2,
      data: "2025-06-01",
      tipoClinica: "Clínica Completa (Facial + Corporal)",
      faturamentoAtual: "R$ 30k-50k",
      metaFaturamento: "Crescer 50%",
      principalDesafio: "Baixa Conversão de Leads em Vendas",
      investimentoMarketing: "Investimento Intermediário (R$ 1.000-3.000)",
      presencaDigital: "Ativa",
      publicoAlvo: "Público Diverso",
      pontuacaoGeral: 78,
      proximosPassos: [
        "Otimizar processo de conversão de leads",
        "Criar cronograma de conteúdo e campanhas",
        "Implementar sistema de acompanhamento de métricas e ROI"
      ]
    }
  ],
  estatisticas: {
    totalDiagnosticos: 2,
    pontuacaoMedia: 71.5,
    melhoriaUltimoMes: 13,
    principaisDesafios: {
      "Atrair Clientes": 40,
      "Converter Leads": 35,
      "Fidelizar": 15,
      "Aumentar Ticket": 10
    }
  }
};

// Mock data for other tools (will be populated as user uses them)
const mockOtherToolsData = {
  scriptGenerator: {
    totalGerados: 0,
    ultimaUso: null
  },
  contentPlanner: {
    totalPlanejados: 0,
    ultimaUso: null
  },
  ideaValidator: {
    totalValidadas: 0,
    ultimaUso: null
  }
};

const months = [
  { value: "2025-06", label: "Junho 2025" },
  { value: "2025-05", label: "Maio 2025" },
  { value: "2025-04", label: "Abril 2025" },
];

const ReportsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("2025-06");
  const { theme = 'light' } = useTheme();
  const { toast } = useToast();

  const handleExport = (format: "pdf" | "csv") => {
    toast({
      title: `Exportando relatório como ${format.toUpperCase()}`,
      description: "O arquivo será baixado em instantes.",
    });

    setTimeout(() => {
      toast({
        title: "Relatório exportado com sucesso!",
        description: `Relatorio_Marketing_${selectedMonth}.${format}`,
      });
    }, 2000);
  };

  const getStatusColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Bom</Badge>;
    return <Badge className="bg-red-100 text-red-800">Precisa Melhorar</Badge>;
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fluida-blue to-fluida-pink">
              Relatórios de Performance
            </h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe seu progresso e análises das ferramentas utilizadas
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
          </div>
        </div>
        
        <Tabs defaultValue="marketing-consultant" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="marketing-consultant">
              <BrainCircuit className="h-4 w-4 mr-2" />
              Consultor Marketing
            </TabsTrigger>
            <TabsTrigger value="content-tools" disabled>
              <FileText className="h-4 w-4 mr-2" />
              Ferramentas Conteúdo
            </TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="performance" disabled>
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="marketing-consultant" className="space-y-6">
            {/* Estatísticas Gerais do Consultor */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Diagnósticos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockMarketingConsultantData.estatisticas.totalDiagnosticos}</div>
                  <p className="text-xs text-muted-foreground">
                    Análises realizadas
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pontuação Média
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getStatusColor(mockMarketingConsultantData.estatisticas.pontuacaoMedia)}`}>
                    {mockMarketingConsultantData.estatisticas.pontuacaoMedia}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Score geral dos diagnósticos
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Melhoria no Período
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    +{mockMarketingConsultantData.estatisticas.melhoriaUltimoMes}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pontos de evolução
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Status Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getStatusBadge(mockMarketingConsultantData.estatisticas.pontuacaoMedia)}
                  <p className="text-xs text-muted-foreground mt-2">
                    Classificação geral
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Distribuição de Desafios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Principais Desafios Identificados
                </CardTitle>
                <CardDescription>
                  Distribuição dos desafios mais comuns nos diagnósticos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(mockMarketingConsultantData.estatisticas.principaisDesafios).map(([desafio, percentual]) => (
                    <div key={desafio} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{desafio}</span>
                        <span className="text-sm text-muted-foreground">{percentual}%</span>
                      </div>
                      <Progress value={percentual} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Diagnósticos */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Diagnósticos</CardTitle>
                <CardDescription>
                  Análises realizadas pelo Consultor de Marketing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMarketingConsultantData.diagnosticos.map((diagnostico) => (
                    <div key={diagnostico.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{diagnostico.tipoClinica}</h3>
                          {getStatusBadge(diagnostico.pontuacaoGeral)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(diagnostico.data), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Faturamento Atual:</span>
                          <p className="text-muted-foreground">{diagnostico.faturamentoAtual}</p>
                        </div>
                        <div>
                          <span className="font-medium">Meta:</span>
                          <p className="text-muted-foreground">{diagnostico.metaFaturamento}</p>
                        </div>
                        <div>
                          <span className="font-medium">Principal Desafio:</span>
                          <p className="text-muted-foreground">{diagnostico.principalDesafio}</p>
                        </div>
                        <div>
                          <span className="font-medium">Público-Alvo:</span>
                          <p className="text-muted-foreground">{diagnostico.publicoAlvo}</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-sm">Próximos Passos Recomendados:</span>
                        <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                          {diagnostico.proximosPassos.map((passo, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              {passo}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Pontuação:</span>
                        <div className="flex-1 max-w-xs">
                          <Progress value={diagnostico.pontuacaoGeral} className="h-2" />
                        </div>
                        <span className={`text-sm font-semibold ${getStatusColor(diagnostico.pontuacaoGeral)}`}>
                          {diagnostico.pontuacaoGeral}/100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content-tools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ferramentas de Conteúdo</CardTitle>
                <CardDescription>
                  Dados serão exibidos conforme você usar as ferramentas
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Use o Gerador de Roteiros, Planejador de Conteúdo ou Validador de Ideias para ver os dados aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Avançado</CardTitle>
                <CardDescription>
                  Análises detalhadas serão exibidas conforme você gerar mais conteúdo
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Continue usando as ferramentas para gerar dados de analytics
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
                <CardDescription>
                  Acompanhamento de resultados dos conteúdos publicados
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Conecte suas redes sociais para acompanhar a performance dos conteúdos
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Relatório</CardTitle>
                <CardDescription>
                  Escolha o formato para exportar seus dados de marketing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center p-3 rounded-md border">
                    <FileText className="h-5 w-5 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium">Diagnósticos em PDF</div>
                      <div className="text-sm text-muted-foreground">
                        Relatório completo dos diagnósticos de marketing
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
                  Os dados exportados são referentes ao período de {format(new Date(selectedMonth), "MMMM yyyy", { locale: ptBR })}.
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
