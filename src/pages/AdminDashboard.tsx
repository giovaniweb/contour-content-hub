import React from 'react';
import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart,
} from "recharts";
import { Eye, FileText, Clock, User, FileCheck, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Interface para dados de estatísticas
interface DashboardStats {
  roteirosTotal: number;
  visualizacoesTotal: number;
  equipamentosMaisUsados: {
    nome: string;
    count: number;
  }[];
  tiposRoteiros: {
    tipo: string;
    count: number;
  }[];
  objetivosMarketing: {
    objetivo: string;
    count: number;
  }[];
  roteirosRecentes: {
    id: string;
    titulo: string;
    tipo: string;
    data: string;
    status: string;
  }[];
  historicoGeracao: {
    data: string;
    quantidade: number;
  }[];
}

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();

  // Mock data - Em uma implementação real, você buscaria do backend
  const stats: DashboardStats = {
    roteirosTotal: 124,
    visualizacoesTotal: 3456,
    equipamentosMaisUsados: [
      { nome: "Hipro", count: 32 },
      { nome: "Adélla Laser", count: 28 },
      { nome: "X-Tonus", count: 22 },
      { nome: "Focuskin", count: 18 },
      { nome: "Enygma X-Orbital", count: 12 }
    ],
    tiposRoteiros: [
      { tipo: "Vídeo", count: 65 },
      { tipo: "Campanha", count: 42 },
      { tipo: "Vendas", count: 17 }
    ],
    objetivosMarketing: [
      { objetivo: "Atrair Atenção", count: 48 },
      { objetivo: "Criar Conexão", count: 35 },
      { objetivo: "Fazer Comprar", count: 23 },
      { objetivo: "Reativar Interesse", count: 15 },
      { objetivo: "Fechar Agora", count: 3 }
    ],
    roteirosRecentes: [
      { id: "1", titulo: "Hipro para flacidez facial", tipo: "videoScript", data: "2025-05-01", status: "aprovado" },
      { id: "2", titulo: "Campanha Enygma para clientes VIP", tipo: "bigIdea", data: "2025-04-28", status: "editado" },
      { id: "3", titulo: "Promoção relâmpago X-Tonus", tipo: "dailySales", data: "2025-04-25", status: "aprovado" },
      { id: "4", titulo: "Antes e depois Hipro", tipo: "videoScript", data: "2025-04-23", status: "gerado" }
    ],
    historicoGeracao: [
      { data: "Jan", quantidade: 10 },
      { data: "Fev", quantidade: 15 },
      { data: "Mar", quantidade: 25 },
      { data: "Abr", quantidade: 30 },
      { data: "Mai", quantidade: 44 }
    ]
  };

  // Cores para os gráficos
  const colors = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#f43f5e", // rose
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#ec4899", // pink
    "#14b8a6", // teal
    "#f97316"  // orange
  ];

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card: Total de Roteiros */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Roteiros</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.roteirosTotal}</div>
            <p className="text-xs text-muted-foreground">
              +12% do mês anterior
            </p>
          </CardContent>
        </Card>
        
        {/* Card: Visualizações */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visualizacoesTotal}</div>
            <p className="text-xs text-muted-foreground">
              +18% do mês anterior
            </p>
          </CardContent>
        </Card>
        
        {/* Card: Taxa de Aprovação */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              +5% do mês anterior
            </p>
          </CardContent>
        </Card>
        
        {/* Card: Tempo Médio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Geração</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2s</div>
            <p className="text-xs text-muted-foreground">
              -0.8s do mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Gráfico: Roteiros Gerados por Mês */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Roteiros Gerados por Mês</CardTitle>
            <CardDescription>
              Evolução na geração de roteiros
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.historicoGeracao}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="quantidade"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Roteiros"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Gráfico: Distribuição por Tipo de Roteiro */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribuição por Tipo de Roteiro</CardTitle>
            <CardDescription>
              Proporção entre os diferentes tipos de conteúdo
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.tiposRoteiros}
                    nameKey="tipo"
                    dataKey="count"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {stats.tiposRoteiros.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card: Equipamentos Mais Usados */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Equipamentos Mais Usados</CardTitle>
            <CardDescription>
              Top 5 equipamentos em roteiros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.equipamentosMaisUsados}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="nome" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" name="Quantidade" fill="#8b5cf6">
                    {stats.equipamentosMaisUsados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Card: Objetivos de Marketing */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Objetivos de Marketing</CardTitle>
            <CardDescription>
              Distribuição por objetivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.objetivosMarketing}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="objetivo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Quantidade" fill="#10b981">
                    {stats.objetivosMarketing.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Card: Roteiros Recentes */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Roteiros Recentes</CardTitle>
            <CardDescription>
              Últimos roteiros gerados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.roteirosRecentes.map((roteiro) => (
                <div key={roteiro.id} className="flex items-center">
                  <div className="mr-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {roteiro.tipo === "videoScript" ? (
                        <FileText className="h-5 w-5 text-primary" />
                      ) : roteiro.tipo === "bigIdea" ? (
                        <Star className="h-5 w-5 text-amber-500" />
                      ) : (
                        <User className="h-5 w-5 text-violet-500" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {roteiro.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(roteiro.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
