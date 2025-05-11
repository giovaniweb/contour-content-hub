
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/use-permissions";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface ClientProfile {
  id: string;
  nome: string;
  email: string;
  role: string;
}

const ConsultantPanel: React.FC = () => {
  const { user } = useAuth();
  const { canViewConsultantPanel } = usePermissions();
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const fetchClients = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('id, nome, email, role')
        .eq('role', 'cliente');
      
      if (error) {
        toast({
          title: "Erro ao carregar clientes",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        setClients(data as ClientProfile[]);
      }
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (canViewConsultantPanel()) {
      fetchClients();
    } else {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar o painel de consultor.",
        variant: "destructive"
      });
    }
  }, [user]);
  
  return (
    <Layout title="Painel do Consultor">
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Clientes Ativos</CardTitle>
                  <CardDescription>Total de clientes gerenciados</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{clients.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Consultas Agendadas</CardTitle>
                  <CardDescription>Próximos 7 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">5</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho</CardTitle>
                  <CardDescription>Média de satisfação</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">4.8/5</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Últimas interações com clientes</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Carregando atividades...</p>
                ) : (
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">Análise de Performance</p>
                        <p className="text-sm text-muted-foreground">Cliente: Clínica Derma</p>
                      </div>
                      <Badge>Ontem</Badge>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">Estratégia de Conteúdo</p>
                        <p className="text-sm text-muted-foreground">Cliente: Dr. Ana Silva</p>
                      </div>
                      <Badge>3 dias atrás</Badge>
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Meus Clientes</CardTitle>
                <CardDescription>Gerenciar clientes atribuídos</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Carregando clientes...</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clients.map((client) => (
                      <Card key={client.id} className="overflow-hidden">
                        <CardHeader className="bg-primary/10 pb-2">
                          <CardTitle className="text-lg">{client.nome || 'Cliente sem nome'}</CardTitle>
                          <CardDescription>{client.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-sm">Última interação: 5 dias atrás</p>
                          <p className="text-sm">Equipamentos: 3</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">Ver perfil</Button>
                          <Button size="sm">Agendar</Button>
                        </CardFooter>
                      </Card>
                    ))}
                    
                    {clients.length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">Nenhum cliente encontrado</p>
                        <Button className="mt-4" variant="outline">
                          Solicitar atribuição de clientes
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Agenda de Consultorias</CardTitle>
                <CardDescription>Gerencie suas consultas agendadas</CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="grid md:grid-cols-7 gap-4">
                  <div className="md:col-span-5">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">
                          {selectedDate?.toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            day: 'numeric',
                            month: 'long'
                          })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="rounded-md bg-secondary p-2">
                            <p className="text-sm font-medium">09:00 - Clínica Derma</p>
                            <p className="text-xs text-muted-foreground">Revisão de estratégia</p>
                          </div>
                          <div className="rounded-md bg-secondary p-2">
                            <p className="text-sm font-medium">14:00 - Dr. Roberto</p>
                            <p className="text-xs text-muted-foreground">Aprovação de conteúdo</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between mt-4">
                <Button variant="outline">Consultoria remota</Button>
                <Button>Agendar nova consulta</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Performance</CardTitle>
                <CardDescription>Análise de desempenho dos conteúdos dos clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Os relatórios detalhados estarão disponíveis em breve.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ConsultantPanel;
