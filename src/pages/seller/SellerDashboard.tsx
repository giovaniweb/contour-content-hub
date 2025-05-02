
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/use-permissions";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Users, FileText, BarChart, LineChart, PieChart, Calendar, Activity } from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SellerDashboard = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [clientCount, setClientCount] = useState(0);
  const [activeClientCount, setActiveClientCount] = useState(0);
  const [totalScriptsGenerated, setTotalScriptsGenerated] = useState(0);
  const [monthlyScripts, setMonthlyScripts] = useState<any[]>([]);
  const [planDistribution, setPlanDistribution] = useState<any[]>([]);
  const [topClients, setTopClients] = useState<any[]>([]);
  
  useEffect(() => {
    // Verificar permissões
    if (!hasPermission('viewSales')) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página."
      });
      return;
    }
    
    fetchDashboardData();
  }, [hasPermission]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar contagem total de clientes (role = 'cliente')
      const { count: clientCountTotal, error: clientCountError } = await supabase
        .from('perfis')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'cliente');
        
      if (clientCountError) throw clientCountError;
      setClientCount(clientCountTotal || 0);
      
      // Buscar contagem de clientes ativos no último mês
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const { count: activeClientCountTotal, error: activeClientCountError } = await supabase
        .from('user_usage')
        .select('*', { count: 'exact', head: true })
        .gte('last_activity', oneMonthAgo.toISOString());
        
      if (activeClientCountError && activeClientCountError.code !== 'PGRST116') throw activeClientCountError;
      setActiveClientCount(activeClientCountTotal || 0);
      
      // Buscar total de roteiros gerados
      const { count: scriptCountTotal, error: scriptCountError } = await supabase
        .from('roteiros')
        .select('*', { count: 'exact', head: true });
        
      if (scriptCountError) throw scriptCountError;
      setTotalScriptsGenerated(scriptCountTotal || 0);
      
      // Para dados simulados de geração mensal de roteiros
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const currentMonth = new Date().getMonth();
      
      const scriptData = months.map((month, index) => {
        // Gerar dados mais realistas, crescente ao longo do tempo
        let baseValue = 20 + index * 5; 
        // Último mês tem um pouco menos pois ainda está em andamento
        const value = index === currentMonth ? baseValue * 0.7 : baseValue;
        return {
          month,
          count: Math.floor(value + Math.random() * 15),
          isCurrentMonth: index === currentMonth
        };
      });
      
      setMonthlyScripts(scriptData);
      
      // Distribuição simulada de planos
      setPlanDistribution([
        { name: 'Free', value: 65, color: '#94a3b8' },
        { name: 'Pro', value: 25, color: '#3b82f6' },
        { name: 'Unlimited', value: 10, color: '#8b5cf6' }
      ]);
      
      // Clientes mais ativos (simulado)
      const simulatedTopClients = [
        { id: '1', name: 'Clínica Estética Bela Vida', scripts: 42, engagement: 98 },
        { id: '2', name: 'Studio Renove', scripts: 38, engagement: 92 },
        { id: '3', name: 'Centro de Estética Bella Donna', scripts: 31, engagement: 87 },
        { id: '4', name: 'Dr. Carlos Mendes', scripts: 29, engagement: 85 },
        { id: '5', name: 'Instituto de Beleza Renovar', scripts: 25, engagement: 80 }
      ];
      
      setTopClients(simulatedTopClients);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard."
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="space-y-2">
            <div className="h-8 w-[300px] bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-[250px] bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Vendas</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho dos seus clientes e das vendas
          </p>
        </div>
        <Button asChild>
          <Link to="/seller/clients">
            <Users className="mr-2 h-4 w-4" />
            Gerenciar Clientes
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clientCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Clientes Ativos</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeClientCount}</div>
            {clientCount > 0 && (
              <div className="text-sm text-muted-foreground">
                {Math.round((activeClientCount / clientCount) * 100)}% do total
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Roteiros Gerados</CardTitle>
            <CardDescription>Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalScriptsGenerated}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Roteiros Gerados por Mês</CardTitle>
            <CardDescription>Evolução da geração de roteiros ao longo do ano</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={monthlyScripts}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name="Roteiros" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Planos</CardTitle>
            <CardDescription>Assinaturas ativas por tipo de plano</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Clientes Mais Ativos</CardTitle>
            <CardDescription>Baseado em geração de conteúdo e engajamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium">Cliente</th>
                    <th className="py-3 px-4 text-left font-medium">Roteiros</th>
                    <th className="py-3 px-4 text-left font-medium">Engajamento</th>
                    <th className="py-3 px-4 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {topClients.map((client, index) => (
                    <tr key={client.id} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <span className="font-medium">{client.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{client.scripts}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{width: `${client.engagement}%`}}
                            ></div>
                          </div>
                          <span>{client.engagement}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/seller/clients/${client.id}`}>
                            <Activity className="h-4 w-4 mr-1" />
                            Detalhes
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild className="ml-auto">
              <Link to="/seller/clients">Ver Todos os Clientes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
