
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/use-permissions";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Perfil } from "@/types/database";
import { ClientEngagement } from "@/utils/validation/types";
import { Search, Plus, ArrowUpRight, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createClientSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().optional(),
  clinica: z.string().optional(),
  cidade: z.string().optional(),
});

const ClientList: React.FC = () => {
  const { toast } = useToast();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof createClientSchema>>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      clinica: "",
      cidade: "",
    },
  });

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

  // Buscar clientes
  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ["clients"],
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

  // Função para criar novo cliente
  const handleCreateClient = async (data: z.infer<typeof createClientSchema>) => {
    try {
      const password = Math.random().toString(36).slice(-8);
      
      // Criar usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password,
        options: {
          data: {
            nome: data.nome,
          },
        },
      });
      
      if (authError) {
        toast({
          title: "Erro ao criar cliente",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }
      
      // Atualizar perfil
      if (authData.user) {
        const { error: updateError } = await supabase
          .from('perfis')
          .update({
            nome: data.nome,
            clinica: data.clinica || null,
            cidade: data.cidade || null,
            telefone: data.telefone || null,
            role: 'cliente'
          })
          .eq('id', authData.user.id);
          
        if (updateError) {
          toast({
            title: "Erro ao atualizar perfil",
            description: updateError.message,
            variant: "destructive",
          });
          return;
        }
      }
      
      toast({
        title: "Cliente criado com sucesso",
        description: `Senha temporária: ${password}`,
      });
      
      form.reset();
      setDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao criar cliente",
        description: error.message || "Algo deu errado",
        variant: "destructive",
      });
    }
  };

  // Filtrar clientes pelo termo de busca
  const filteredClients = clients.filter(client => 
    client.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.clinica?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus clientes e visualize seus dados
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtrar Clientes</CardTitle>
          <CardDescription>
            Busque por nome, email ou clínica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Mostrando {filteredClients.length} clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Carregando clientes...</p>
            </div>
          ) : filteredClients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Clínica</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => {
                  const initials = client.nome
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={client.foto_url || ""} alt={client.nome || ""} />
                            <AvatarFallback className="bg-blue-500 text-white">
                              {initials || "??"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{client.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.clinica || "-"}</TableCell>
                      <TableCell>{client.cidade || "-"}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/seller/client/${client.id}`)}
                        >
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">Nenhum cliente encontrado</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setDialogOpen(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Cliente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo cliente
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateClient)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clinica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clínica</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da clínica" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar Cliente</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientList;
