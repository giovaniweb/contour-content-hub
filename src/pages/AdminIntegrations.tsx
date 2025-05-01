
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, FolderOpen, Save } from "lucide-react";
import { GptConfig } from "@/types/database";
import { useToast } from "@/components/ui/use-toast";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";

// GPT Model Schema
const gptSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  tipo: z.enum(["roteiro", "big_idea", "story"]),
  modelo: z.string().min(3, { message: "Selecione um modelo" }),
  chave_api: z.string().min(1, { message: "A chave API é necessária" }),
  ativo: z.boolean().default(true),
});

// Dropbox Schema
const dropboxSchema = z.object({
  token: z.string().min(1, { message: "O token de acesso é necessário" }),
  pasta_padrao: z.string().min(1, { message: "A pasta padrão é necessária" }),
  link_base: z.string().optional(),
});

const AdminIntegrations: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = usePermissions();
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // GPT Form
  const gptForm = useForm<z.infer<typeof gptSchema>>({
    resolver: zodResolver(gptSchema),
    defaultValues: {
      nome: "",
      tipo: "roteiro",
      modelo: "",
      chave_api: "",
      ativo: true,
    },
  });

  // Dropbox Form
  const dropboxForm = useForm<z.infer<typeof dropboxSchema>>({
    resolver: zodResolver(dropboxSchema),
    defaultValues: {
      token: "",
      pasta_padrao: "/videos",
      link_base: "",
    },
  });

  const onGptSubmit = async (values: z.infer<typeof gptSchema>) => {
    try {
      console.log("GPT config values:", values);
      // TODO: Save to database
      
      toast({
        title: "Configuração GPT salva",
        description: `Modelo ${values.nome} configurado com sucesso`,
      });
    } catch (error) {
      console.error("Erro ao salvar configuração GPT:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a configuração",
        variant: "destructive",
      });
    }
  };

  const onDropboxSubmit = async (values: z.infer<typeof dropboxSchema>) => {
    try {
      console.log("Dropbox config values:", values);
      // TODO: Save to database
      
      toast({
        title: "Configuração Dropbox salva",
        description: "Integração com Dropbox configurada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao salvar configuração Dropbox:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a configuração",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-contourline-darkBlue">Painel de Integrações</h1>
        
        <Tabs defaultValue="gpt" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="gpt" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              GPT (OpenAI)
            </TabsTrigger>
            <TabsTrigger value="dropbox" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Dropbox
            </TabsTrigger>
          </TabsList>
          
          {/* GPT Configuration Tab */}
          <TabsContent value="gpt">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-contourline-mediumBlue" />
                  Configuração GPT
                </CardTitle>
                <CardDescription>
                  Configure os modelos GPT para geração de conteúdo na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...gptForm}>
                  <form onSubmit={gptForm.handleSubmit(onGptSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={gptForm.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do modelo</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: GPT Vídeo, GPT Big Idea..." {...field} />
                            </FormControl>
                            <FormDescription>
                              Nome descritivo do modelo para identificação
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={gptForm.control}
                        name="tipo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="roteiro">Roteiro</SelectItem>
                                <SelectItem value="big_idea">Big Idea</SelectItem>
                                <SelectItem value="story">Story</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Tipo de conteúdo que este modelo irá gerar
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={gptForm.control}
                        name="modelo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modelo GPT</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o modelo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Modelo da OpenAI a ser utilizado
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={gptForm.control}
                        name="chave_api"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chave da API</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="sk-..." {...field} />
                            </FormControl>
                            <FormDescription>
                              Chave secreta da API OpenAI
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit" className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Salvar Configuração GPT
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Dropbox Configuration Tab */}
          <TabsContent value="dropbox">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-contourline-mediumBlue" />
                  Configuração Dropbox
                </CardTitle>
                <CardDescription>
                  Configure a integração com o Dropbox para acesso aos vídeos e arquivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...dropboxForm}>
                  <form onSubmit={dropboxForm.handleSubmit(onDropboxSubmit)} className="space-y-6">
                    <FormField
                      control={dropboxForm.control}
                      name="token"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Token de acesso</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Token de acesso do Dropbox" {...field} />
                          </FormControl>
                          <FormDescription>
                            Token de acesso da API do Dropbox
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={dropboxForm.control}
                      name="pasta_padrao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pasta padrão de leitura</FormLabel>
                          <FormControl>
                            <Input placeholder="/videos" {...field} />
                          </FormControl>
                          <FormDescription>
                            Caminho da pasta no Dropbox de onde os arquivos serão lidos
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={dropboxForm.control}
                      name="link_base"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link base para exibição (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://dropbox.com/s/" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL base para links de compartilhamento
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button type="submit" className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Salvar Configuração Dropbox
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Integration Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Status das Integrações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-contourline-mediumBlue" />
                  <span>OpenAI (GPT)</span>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                  Não configurado
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-contourline-mediumBlue" />
                  <span>Dropbox</span>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                  Não configurado
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminIntegrations;
