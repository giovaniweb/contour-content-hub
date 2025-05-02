
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/use-permissions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { ArrowLeft, Mail, Phone, MapPin, Building, Clock, Star, FileText, Calendar } from "lucide-react";
import { Perfil } from "@/types/database";

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  // Verificar permissão
  useEffect(() => {
    if (!hasPermission("manageClients")) {
      navigate("/dashboard");
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
    }
  }, [hasPermission, navigate, toast]);

  // Buscar dados do cliente
  const { data: client, isLoading: isLoadingClient } = useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("perfis")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          title: "Erro ao buscar cliente",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      return data as Perfil;
    },
    enabled: !!id
  });

  // Buscar roteiros do cliente
  const { data: scripts = [], isLoading: isLoadingScripts } = useQuery({
    queryKey: ["client-scripts", id],
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
        .from("roteiros")
        .select("*")
        .eq("usuario_id", id)
        .order("data_criacao", { ascending: false });

      if (error) {
        toast({
          title: "Erro ao buscar roteiros",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
    enabled: !!id
  });

  // Buscar dados do calendário do cliente
  const { data: calendarItems = [], isLoading: isLoadingCalendar } = useQuery({
    queryKey: ["client-calendar", id],
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
        .from("agenda")
        .select("*")
        .eq("usuario_id", id)
        .order("data", { ascending: false });

      if (error) {
        toast({
          title: "Erro ao buscar agenda",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
    enabled: !!id
  });

  // Preparar dados para o gráfico
  const getLastSixMonths = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: format(month, "MMM", { locale: ptBR }),
        roteiros: 0,
        validacoes: 0
      });
    }
    
    // Preencher com dados reais
    scripts.forEach(script => {
      const scriptDate = new Date(script.data_criacao);
      const monthIndex = months.findIndex(m => 
        format(scriptDate, "MMM", { locale: ptBR }) === m.name
      );
      
      if (monthIndex >= 0) {
        months[monthIndex].roteiros += 1;
      }
    });
    
    return months;
  };

  const chartData = getLastSixMonths();

  if (isLoadingClient) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-96">
          <p>Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-lg text-muted-foreground">Cliente não encontrado</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate("/seller/clients")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para lista
          </Button>
        </div>
      </div>
    );
  }

  const initials = client.nome
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
 
  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/seller/clients")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para lista
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={client.foto_url || ""} alt={client.nome || ""} />
                <AvatarFallback className="bg-blue-500 text-white text-2xl">
                  {initials || "??"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-center">{client.nome}</CardTitle>
              <Badge variant="outline" className="mt-2">
                Cliente
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
              {client.telefone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{client.telefone}</span>
                </div>
              )}
              {client.cidade && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{client.cidade}</span>
                </div>
              )}
              {client.clinica && (
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{client.clinica}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Cliente desde {format(new Date(client.data_criacao), "dd/MM/yyyy")}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" className="w-full">
              <Mail className="h-4 w-4 mr-2" /> Enviar Mensagem
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="summary">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="summary">Resumo</TabsTrigger>
              <TabsTrigger value="scripts">Roteiros</TabsTrigger>
              <TabsTrigger value="calendar">Agenda</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Cliente</CardTitle>
                  <CardDescription>
                    Visão geral da atividade do cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <p className="text-muted-foreground text-sm">Total de Roteiros</p>
                      <h3 className="text-2xl font-bold">{scripts.length}</h3>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <p className="text-muted-foreground text-sm">Eventos Agendados</p>
                      <h3 className="text-2xl font-bold">{calendarItems.length}</h3>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                      <p className="text-muted-foreground text-sm">Roteiros Este Mês</p>
                      <h3 className="text-2xl font-bold">
                        {scripts.filter(s => {
                          const date = new Date(s.data_criacao);
                          const now = new Date();
                          return (
                            date.getMonth() === now.getMonth() && 
                            date.getFullYear() === now.getFullYear()
                          );
                        }).length}
                      </h3>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Atividade Recente</h3>
                    <div className="space-y-4">
                      {[...scripts, ...calendarItems]
                        .sort((a, b) => {
                          const dateA = new Date(a.data_criacao || a.data_criacao);
                          const dateB = new Date(b.data_criacao || b.data_criacao);
                          return dateB.getTime() - dateA.getTime();
                        })
                        .slice(0, 5)
                        .map((item, index) => (
                          <div key={index} className="flex items-start pb-3 border-b">
                            {'conteudo' in item ? (
                              <FileText className="h-5 w-5 mr-3 text-blue-500" />
                            ) : (
                              <Calendar className="h-5 w-5 mr-3 text-green-500" />
                            )}
                            <div>
                              <p className="font-medium">
                                {'conteudo' in item ? 'Roteiro criado: ' : 'Evento agendado: '}
                                {item.titulo}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(
                                  new Date('conteudo' in item ? item.data_criacao : item.data), 
                                  "dd MMM yyyy', às 'HH:mm", 
                                  { locale: ptBR }
                                )}
                              </p>
                            </div>
                          </div>
                        ))}

                      {[...scripts, ...calendarItems].length === 0 && (
                        <p className="text-muted-foreground">
                          Nenhuma atividade recente encontrada.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scripts">
              <Card>
                <CardHeader>
                  <CardTitle>Roteiros</CardTitle>
                  <CardDescription>
                    Roteiros criados pelo cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingScripts ? (
                    <p>Carregando roteiros...</p>
                  ) : scripts.length > 0 ? (
                    <div className="space-y-4">
                      {scripts.map((script) => (
                        <Card key={script.id}>
                          <CardHeader className="py-3">
                            <div className="flex justify-between">
                              <CardTitle className="text-lg">{script.titulo}</CardTitle>
                              <Badge>{script.tipo}</Badge>
                            </div>
                            <CardDescription>
                              Criado em: {format(new Date(script.data_criacao), "dd/MM/yyyy")}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p className="line-clamp-2 text-sm">
                              {script.conteudo?.substring(0, 150)}...
                            </p>
                          </CardContent>
                          <CardFooter className="py-2">
                            <Button variant="outline" size="sm">
                              Ver Roteiro
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40">
                      <p className="text-muted-foreground">
                        Este cliente ainda não criou nenhum roteiro
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle>Eventos Agendados</CardTitle>
                  <CardDescription>
                    Agenda do cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingCalendar ? (
                    <p>Carregando agenda...</p>
                  ) : calendarItems.length > 0 ? (
                    <div className="space-y-4">
                      {calendarItems.map((item) => (
                        <Card key={item.id}>
                          <CardHeader className="py-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{item.titulo}</CardTitle>
                                <CardDescription>
                                  {format(new Date(item.data), "dd/MM/yyyy")}
                                </CardDescription>
                              </div>
                              <Badge>{item.tipo}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            {item.descricao && (
                              <p className="text-sm mb-2">{item.descricao}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {item.equipamento && (
                                <Badge variant="outline">{item.equipamento}</Badge>
                              )}
                              {item.objetivo && (
                                <Badge variant="outline">{item.objetivo}</Badge>
                              )}
                              <Badge
                                variant={item.status === 'concluido' ? 'default' : 'secondary'}
                              >
                                {item.status === 'concluido' ? 'Concluído' : 'Pendente'}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40">
                      <p className="text-muted-foreground">
                        Este cliente não possui eventos agendados
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                  <CardDescription>
                    Análise de desempenho e atividade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] mb-6">
                    <h3 className="font-semibold mb-4">Atividade nos Últimos 6 Meses</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="roteiros" 
                          stroke="#8884d8" 
                          name="Roteiros Criados"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="validacoes" 
                          stroke="#82ca9d" 
                          name="Validações"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Equipamentos Usados</h3>
                    <div className="flex flex-wrap gap-2">
                      {client.equipamentos?.map((equip, i) => (
                        <Badge key={i} variant="outline">
                          {equip}
                        </Badge>
                      ))}
                      {!client.equipamentos?.length && (
                        <p className="text-muted-foreground">
                          Nenhum equipamento registrado
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
