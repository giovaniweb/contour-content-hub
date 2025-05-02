import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/use-permissions";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Users, Search, Plus, Calendar, FileText, BarChart, UserPlus, User as UserIcon } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  clinic?: string;
  city?: string;
  phone?: string;
  lastActive?: string;
  scriptCount?: number;
  subscription?: string;
}

const ClientList = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
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
    
    fetchClients();
  }, [hasPermission]);
  
  const fetchClients = async () => {
    try {
      setLoading(true);
      
      // Buscar todos os clientes (role = 'cliente')
      const { data: clientProfiles, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('role', 'cliente');
        
      if (error) throw error;
      
      // Para cada cliente, buscar estatísticas adicionais
      const enrichedClients = await Promise.all((clientProfiles || []).map(async (profile) => {
        // Contar roteiros
        const { count: scriptCount } = await supabase
          .from('roteiros')
          .select('*', { count: 'exact', head: true })
          .eq('usuario_id', profile.id);
          
        // Buscar plano de assinatura do usuário
        const { data: usageData } = await supabase
          .from('user_usage')
          .select('plan_id, last_activity')
          .eq('user_id', profile.id)
          .maybeSingle();
        
        let subscriptionName = 'Free';
        if (usageData?.plan_id) {
          const { data: planData } = await supabase
            .from('subscription_plans')
            .select('name')
            .eq('id', usageData.plan_id)
            .maybeSingle();
            
          if (planData) {
            subscriptionName = planData.name;
          }
        }
        
        return {
          id: profile.id,
          name: profile.nome || 'Sem nome',
          email: profile.email,
          clinic: profile.clinica,
          city: profile.cidade,
          phone: profile.telefone,
          lastActive: usageData?.last_activity,
          scriptCount: scriptCount || 0,
          subscription: subscriptionName
        };
      }));
      
      setClients(enrichedClients);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a lista de clientes."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.clinic && client.clinic.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.city && client.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const getSubscriptionBadge = (subscription: string) => {
    switch(subscription) {
      case 'Free':
        return <Badge variant="outline">Gratuito</Badge>;
      case 'Pro':
        return <Badge variant="default" className="bg-blue-500">Pro</Badge>;
      case 'Unlimited':
        return <Badge variant="default" className="bg-purple-600">Premium</Badge>;
      default:
        return <Badge variant="outline">{subscription}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie seus clientes
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Clientes Ativos</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {clients.filter(client => 
                client.lastActive && 
                new Date(client.lastActive) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Roteiros Gerados</CardTitle>
            <CardDescription>Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {clients.reduce((sum, client) => sum + (client.scriptCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Seus Clientes</CardTitle>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
            <Input 
              type="text"
              placeholder="Buscar clientes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Clínica</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead className="text-right">Roteiros</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        Nenhum cliente encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map(client => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            <div>
                              <div>{client.name}</div>
                              <div className="text-xs text-muted-foreground">{client.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{client.clinic || "-"}</TableCell>
                        <TableCell>{client.city || "-"}</TableCell>
                        <TableCell>{getSubscriptionBadge(client.subscription || 'Free')}</TableCell>
                        <TableCell className="text-right">{client.scriptCount}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/seller/clients/${client.id}`}>
                                <BarChart className="mr-1 h-4 w-4" />
                                Detalhes
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientList;
