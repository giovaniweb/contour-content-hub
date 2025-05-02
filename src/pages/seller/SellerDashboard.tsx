
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/use-permissions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { Users, FileText, Calendar, UserPlus, ArrowUpRight } from "lucide-react";
import { Perfil } from "@/types/database";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const SellerDashboard: React.FC = () => {
  const { toast } = useToast();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  // Verificar permissão
  useEffect(() => {
    if (!hasPermission("viewSales")) {
      navigate("/dashboard");
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
    }
  }, [hasPermission, navigate, toast]);

  // Buscar clientes
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["seller-dashboard-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("perfis")
        .select("*")
        .eq("role", "cliente");

      if (error) {
        toast({
          title: "Erro ao buscar clientes",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data as Perfil[];
    }
  });

  // Buscar roteiros
  const { data: scripts = [], isLoading: isLoadingScripts } = useQuery({
    queryKey: ["seller-dashboard-scripts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roteiros")
        .select("*");

      if (error) {
        toast({
          title: "Erro ao buscar roteiros",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    }
  });

  // Buscar eventos de agenda
  const { data: calendarItems = [], isLoading: isLoadingCalendar } = useQuery({
    queryKey: ["seller-dashboard-calendar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agenda")
        .select("*");

      if (error) {
        toast({
          title: "Erro ao buscar eventos",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    }
  });

  // Preparar dados para os gráficos
  const getMonthlyData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: format(month, "MMM", { locale: ptBR }),
        clientes: 0,
        roteiros: 0
      });
    }
    
    // Preencher com dados de clientes
    clients.forEach(client => {
      const clientDate = new Date(client.data_criacao);
      const monthIndex = months.findIndex(m => {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - monthIndex), 1);
        return (
          clientDate.getMonth() === monthDate.getMonth() && 
          clientDate.getFullYear() === monthDate.getFullYear()
        );
      });
      
      if (monthIndex >= 0) {
        months[monthIndex].clientes += 1;
      }
    });
    
    // Preencher com dados de roteiros
    scripts.forEach(script => {
      const scriptDate = new Date(script.data_criacao);
      const monthIndex = months.findIndex(m => {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - monthIndex), 1);
        return (
          scriptDate.getMonth() === monthDate.getMonth() && 
          scriptDate.getFullYear() === monthDate.getFullYear()
        );
      });
      
      if (monthIndex >= 0) {
        months[monthIndex].roteiros += 1;
      }
    });
    
    return months;
  };

  const getCityDistribution = () => {
    const cities: {[key: string]: number} = {};
    
    clients.forEach(client => {
      if (client.cidade) {
        cities[client.cidade] = (cities[client.cidade] || 0) + 1;
      }
    });
    
    return Object.entries(cities)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const getEquipmentUsage = () => {
    const equipments: {[key: string]: number} = {};
    
    // Contar equipamentos de todos os clientes
    clients.forEach(client => {
      if (client.equipamentos) {
        client.equipamentos.forEach(equip => {
          equipments[equip] = (equipments[equip] || 0) + 1;
        });
      }
    });
    
    return Object.entries(equipments)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const monthlyData = getMonthlyData();
  const cityDistribution = getCityDistribution();
  const equipmentUsage = getEquipmentUsage();

  const isLoading = isLoadingClients || isLoadingScripts || isLoadingCalendar;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-96">
          <p>Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  // Calcular novos clientes este mês
  const now = new Date();
  const newClientsThisMonth = clients.filter(client => {
    const date = new Date(client.data_criacao);
    return (
      date.getMonth() === now.getMonth() && 
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  // Calcular roteiros este mês
  const scriptsThisMonth = scripts.filter(script => {
    const date = new Date(script.data_criacao);
    return (
      date.getMonth() === now.getMonth() && 
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Vendas</h1>
          <p className="text-muted-foreground mt-1">
            Visualize o desempenho e estatísticas de seus clientes
          </p>
        </div>
        <Button onClick={() => navigate("/seller/clients")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Gerenciar Clientes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Clientes</CardTitle>
            <CardDescription>Clientes ativos na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <p className="text-3xl font-bold">{clients.length}</p>
                <p className="text-xs text-muted-foreground">
                  {newClientsThisMonth} novos este mês
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Roteiros</CardTitle>
            <CardDescription>Roteiros criados pelos clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-10 w-10 text-green-500 mr-4" />
              <div>
                <p className="text-3xl font-bold">{scripts.length}</p>
                <p className="text-xs text-muted-foreground">
                  {scriptsThisMonth} criados este mês
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Média por Cliente</CardTitle>
            <CardDescription>Roteiros por cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-10 w-10 text-purple-500 mr-4" />
              <div>
                <p className="text-3xl font-bold">
                  {clients.length ? (scripts.length / clients.length).toFixed(1) : '0'}
                </p>
                <p className="text-xs text-muted-foreground">
                  roteiros / cliente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Eventos Agendados</CardTitle>
            <CardDescription>Total de eventos na agenda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-10 w-10 text-orange-500 mr-4" />
              <div>
                <p className="text-3xl font-bold">{calendarItems.length}</p>
                <p className="text-xs text-muted-foreground">
                  {calendarItems.filter(item => {
                    const today = new Date();
                    const itemDate = new Date(item.data);
                    return itemDate > today;
                  }).length} eventos futuros
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Crescimento Mensal</CardTitle>
            <CardDescription>Novos clientes e roteiros nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="clientes" name="Novos Clientes" stroke="#8884d8" />
                <Line type="monotone" dataKey="roteiros" name="Roteiros Criados" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribuição por Cidade</CardTitle>
            <CardDescription>Onde estão seus clientes</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {cityDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  Sem dados suficientes para gerar o gráfico
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Uso de Equipamentos</CardTitle>
            <CardDescription>Equipamentos mais utilizados pelos clientes</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {equipmentUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={equipmentUsage}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Clientes">
                    {equipmentUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  Sem dados suficientes para gerar o gráfico
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Clientes Recentes</CardTitle>
            <CardDescription>Últimos clientes adicionados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients
                .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
                .slice(0, 5)
                .map((client) => (
                  <div key={client.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                        {client.nome?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{client.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.cidade || client.clinica || client.email}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate(`/seller/client/${client.id}`)}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

              {clients.length === 0 && (
                <p className="text-muted-foreground">
                  Nenhum cliente cadastrado ainda
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/seller/clients")}
            >
              Ver Todos os Clientes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
