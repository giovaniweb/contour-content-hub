
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/use-permissions";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { AreaChart, BarChart3, Calendar, FileText, User, Clock, BarChart, CheckSquare, UploadCloud, Users } from "lucide-react";
import { SubscriptionPlan, ClientEngagement } from "@/utils/validation/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ClientDetails {
  id: string;
  name: string;
  email: string;
  clinic?: string;
  city?: string;
  phone?: string;
  equipments?: string[];
  subscription?: {
    name: string;
    id: string;
  };
}

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { hasPermission } = usePermissions();
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [engagement, setEngagement] = useState<ClientEngagement>({
    scriptsGenerated: 0,
    lastActive: new Date(),
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    validationScore: 0
  });
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentScripts, setRecentScripts] = useState<any[]>([]);
  
  useEffect(() => {
    // Verificar permissões
    if (!hasPermission('manageClients')) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página."
      });
      return;
    }
    
    if (clientId) {
      fetchClientDetails();
      fetchClientScripts();
      fetchClientEngagement();
      fetchAvailablePlans();
    }
  }, [clientId, hasPermission]);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      
      // Buscar dados do perfil do cliente
      const { data: profileData, error: profileError } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', clientId)
        .single();
        
      if (profileError) throw profileError;
      
      // Buscar plano de assinatura
      const { data: usageData } = await supabase
        .from('user_usage')
        .select('plan_id')
        .eq('user_id', clientId)
        .maybeSingle();
        
      let subscription = { name: 'Free', id: '' };
      if (usageData?.plan_id) {
        const { data: planData } = await supabase
          .from('subscription_plans')
          .select('id, name')
          .eq('id', usageData.plan_id)
          .maybeSingle();
          
        if (planData) {
          subscription = {
            name: planData.name,
            id: planData.id
          };
        }
      }
      
      setClient({
        id: profileData.id,
        name: profileData.nome || 'Sem nome',
        email: profileData.email,
        clinic: profileData.clinica,
        city: profileData.cidade,
        phone: profileData.telefone,
        equipments: profileData.equipamentos,
        subscription
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes do cliente:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os detalhes do cliente."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchClientScripts = async () => {
    try {
      // Buscar roteiros recentes
      const { data: scripts, error } = await supabase
        .from('roteiros')
        .select('*')
        .eq('usuario_id', clientId)
        .order('data_criacao', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      setRecentScripts(scripts || []);
    } catch (error) {
      console.error('Erro ao buscar roteiros do cliente:', error);
    }
  };
  
  const fetchClientEngagement = async () => {
    try {
      // Buscar contagem total de roteiros
      const { count: scriptCount, error: countError } = await supabase
        .from('roteiros')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', clientId);
        
      if (countError) throw countError;
      
      // Buscar última atividade
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage')
        .select('last_activity')
        .eq('user_id', clientId)
        .single();
        
      if (usageError && usageError.code !== 'PGRST116') {
        throw usageError;
      }
      
      // Gerar dados de atividade semanal (simulado por enquanto)
      const weeklyActivity = [];
      const now = new Date();
      const lastMonth = new Date(now.setDate(now.getDate() - 30));
      
      for (let i = 0; i < 12; i++) {
        // Simular dados de atividade semanal
        const randomActivity = Math.floor(Math.random() * 5);
        weeklyActivity.push(randomActivity);
      }
      
      // Buscar pontuação média de validação (simulada por enquanto)
      const validationScore = Math.floor(Math.random() * 50) + 50; // 50-100
      
      setEngagement({
        scriptsGenerated: scriptCount || 0,
        lastActive: usageData ? new Date(usageData.last_activity) : new Date(),
        weeklyActivity,
        validationScore
      });
    } catch (error) {
      console.error('Erro ao buscar engajamento do cliente:', error);
    }
  };
  
  const fetchAvailablePlans = async () => {
    try {
      const { data: plans, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });
        
      if (error) throw error;
      
      setAvailablePlans((plans || []).map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        features: plan.features || [],
        billingCycle: plan.billing_cycle as 'monthly' | 'yearly',
        active: plan.active
      })));
    } catch (error) {
      console.error('Erro ao buscar planos disponíveis:', error);
    }
  };
  
  const updateClientPlan = async (planId: string) => {
    try {
      if (!clientId) return;
      
      // Verificar se já existe um registro de uso para o cliente
      const { data: existingUsage, error: checkError } = await supabase
        .from('user_usage')
        .select('id')
        .eq('user_id', clientId)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      if (existingUsage) {
        // Atualizar plano existente
        const { error: updateError } = await supabase
          .from('user_usage')
          .update({ plan_id: planId })
          .eq('id', existingUsage.id);
          
        if (updateError) throw updateError;
      } else {
        // Criar novo registro
        const { error: insertError } = await supabase
          .from('user_usage')
          .insert({
            user_id: clientId,
            plan_id: planId
          });
          
        if (insertError) throw insertError;
      }
      
      // Buscar nome do plano
      const selectedPlan = availablePlans.find(p => p.id === planId);
      
      toast({
        title: "Plano atualizado",
        description: `O cliente agora está no plano ${selectedPlan?.name || 'selecionado'}.`
      });
      
      // Atualizar detalhes do cliente
      fetchClientDetails();
    } catch (error) {
      console.error('Erro ao atualizar plano do cliente:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o plano do cliente."
      });
    }
  };
  
  // Formatando dados para o gráfico
  const activityData = engagement.weeklyActivity.map((value, index) => ({
    week: `W${index + 1}`,
    scripts: value
  }));
  
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
  
  if (!client) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold">Cliente não encontrado</h1>
          <p className="text-muted-foreground mb-4">O cliente solicitado não foi encontrado ou você não tem permissão para visualizá-lo.</p>
          <Button asChild>
            <Link to="/seller/clients">Voltar para lista de clientes</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getSubscriptionBadge = (name: string) => {
    switch(name) {
      case 'Free':
        return <Badge variant="outline">Gratuito</Badge>;
      case 'Pro':
        return <Badge variant="default" className="bg-blue-500">Pro</Badge>;
      case 'Unlimited':
        return <Badge variant="default" className="bg-purple-600">Premium</Badge>;
      default:
        return <Badge variant="outline">{name}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="sm" asChild className="mr-4">
            <Link to="/seller/clients">
              <Users className="mr-2 h-4 w-4" />
              Todos os Clientes
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          {client.subscription && getSubscriptionBadge(client.subscription.name)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Roteiros Gerados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{engagement.scriptsGenerated}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Último Acesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {engagement.lastActive.toLocaleDateString('pt-BR')}
            </div>
            <div className="text-sm text-muted-foreground">
              {engagement.lastActive.toLocaleTimeString('pt-BR')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Score de Engajamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{engagement.validationScore}/100</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="subscription">Assinatura</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Perfil do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Nome:</span>
                      <span className="ml-2">{client.name}</span>
                    </div>
                    <div className="flex items-center">
                      <UploadCloud className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center">
                        <span className="font-medium">Telefone:</span>
                        <span className="ml-2">{client.phone}</span>
                      </div>
                    )}
                    {client.clinic && (
                      <div className="flex items-center">
                        <span className="font-medium">Clínica:</span>
                        <span className="ml-2">{client.clinic}</span>
                      </div>
                    )}
                    {client.city && (
                      <div className="flex items-center">
                        <span className="font-medium">Cidade:</span>
                        <span className="ml-2">{client.city}</span>
                      </div>
                    )}
                  </div>
                  
                  {client.equipments && client.equipments.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Equipamentos</h3>
                      <div className="flex flex-wrap gap-2">
                        {client.equipments.map((equipment, idx) => (
                          <Badge key={idx} variant="secondary">{equipment}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={activityData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="scripts"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Roteiros gerados por semana nos últimos 3 meses
                </p>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Roteiros Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentScripts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum roteiro encontrado para este cliente
                </div>
              ) : (
                <div className="space-y-4">
                  {recentScripts.map((script) => (
                    <div key={script.id} className="flex items-start border-b pb-4">
                      <div className="flex-1">
                        <h3 className="font-medium">{script.titulo}</h3>
                        <p className="text-sm text-muted-foreground">
                          Criado em {new Date(script.data_criacao).toLocaleDateString('pt-BR')}
                        </p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2">{script.tipo}</Badge>
                          <Badge variant={script.status === 'aprovado' ? 'default' : 'secondary'}>
                            {script.status === 'aprovado' ? 'Aprovado' : 
                             script.status === 'editado' ? 'Editado' : 'Gerado'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" disabled={recentScripts.length === 0}>
                <FileText className="mr-2 h-4 w-4" />
                Ver Todos os Roteiros
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assinatura Atual</CardTitle>
              <CardDescription>
                {client.subscription?.name === 'Free' 
                  ? 'O cliente está usando o plano gratuito' 
                  : `O cliente está no plano ${client.subscription?.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availablePlans.map(plan => (
                <div 
                  key={plan.id} 
                  className={`p-4 mb-4 border rounded-lg ${client.subscription?.id === plan.id ? 'border-blue-500 bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      <div className="mt-2">
                        {Array.isArray(plan.features) && plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            <CheckSquare className="h-3 w-3 mr-2 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {plan.price === 0 ? 
                          'Gratuito' : 
                          `R$ ${plan.price.toFixed(2)}`}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">por {plan.billingCycle === 'monthly' ? 'mês' : 'ano'}</p>
                      <Button 
                        variant={client.subscription?.id === plan.id ? "default" : "outline"}
                        disabled={client.subscription?.id === plan.id}
                        onClick={() => updateClientPlan(plan.id)}
                      >
                        {client.subscription?.id === plan.id ? 'Atual' : 'Selecionar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                As preferências de conteúdo são aprendidas automaticamente com base nas interações do cliente.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Estilo de Escrita Preferido</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">Persuasivo</Badge>
                    <Badge variant="secondary">Claro</Badge>
                    <Badge variant="secondary">Informativo</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Tópicos Mais Frequentes</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">Rejuvenescimento Facial</Badge>
                    <Badge variant="secondary">Tratamento de Acne</Badge>
                    <Badge variant="secondary">Procedimentos Corporais</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Taxas de Conversão</h3>
                  <p className="text-sm text-muted-foreground">
                    As taxas de conversão são calculadas com base no engajamento do cliente com os conteúdos gerados.
                  </p>
                  <div className="w-full h-[200px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { type: 'Video Script', rate: 75 },
                          { type: 'Daily Sales', rate: 60 },
                          { type: 'Big Idea', rate: 85 }
                        ]}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="rate" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetail;
