import React, { useState, useEffect } from "react";
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
import { BrainCircuit, FolderOpen, Save, RefreshCw, Check, AlertTriangle, X, Eye, EyeOff, Info, Video } from "lucide-react";
import { GptConfig, VimeoConfig, DropboxConfig, IntegrationStatus } from "@/types/database";
import { useToast } from "@/components/ui/use-toast";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate, Link } from "react-router-dom";
import { 
  saveGptConfig, 
  updateGptConfig, 
  getGptConfigs, 
  testGptConnection,
  saveDropboxConfig,
  getDropboxConfig,
  getVimeoConfig,
  testDropboxConnection,
  testVimeoConnection
} from "@/services/integrationService";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";

// GPT Model Schema
const gptSchema = z.object({
  nome_roteiro: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  nome_big_idea: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  nome_story: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  modelo: z.string().min(1, { message: "Selecione um modelo" }),
  chave_api: z.string().min(1, { message: "A chave API é necessária" }),
  ativo: z.boolean().default(true),
  prompt: z.string().optional()
});

// Dropbox Schema
const dropboxSchema = z.object({
  token: z.string().min(1, { message: "O token de acesso é necessário" }),
  pasta_padrao: z.string().min(1, { message: "A pasta padrão é necessária" }),
  link_base: z.string().optional(),
});

type IntegrationStatusInfo = {
  status: IntegrationStatus;
  message?: string;
  error?: string;
};

type IntegrationStatuses = {
  gpt_roteiro: IntegrationStatusInfo;
  gpt_big_idea: IntegrationStatusInfo;
  gpt_story: IntegrationStatusInfo;
  dropbox: IntegrationStatusInfo;
  vimeo: IntegrationStatusInfo;
};

const AdminIntegrations: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = usePermissions();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [showDropboxToken, setShowDropboxToken] = useState<boolean>(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);
  const [currentError, setCurrentError] = useState<string>("");
  const [statuses, setStatuses] = useState<IntegrationStatuses>({
    gpt_roteiro: { status: 'not_configured' },
    gpt_big_idea: { status: 'not_configured' },
    gpt_story: { status: 'not_configured' },
    dropbox: { status: 'not_configured' },
    vimeo: { status: 'not_configured' }
  });
  
  // Armazena as configurações existentes
  const [gptConfigs, setGptConfigs] = useState<GptConfig[]>([]);
  const [dropboxConfig, setDropboxConfig] = useState<DropboxConfig | null>(null);
  const [vimeoConfig, setVimeoConfig] = useState<VimeoConfig | null>(null);
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // GPT Form
  const gptForm = useForm<z.infer<typeof gptSchema>>({
    resolver: zodResolver(gptSchema),
    defaultValues: {
      nome_roteiro: "GPT_Roteiro_Reel",
      nome_big_idea: "GPT_BigIdea_Reel",
      nome_story: "GPT_StoriesV_Reel",
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

  // Carrega as configurações salvas
  useEffect(() => {
    const loadConfigs = async () => {
      setIsLoading(true);
      try {
        // Carregar configurações do GPT
        const gptData = await getGptConfigs();
        setGptConfigs(gptData);
        
        // Se existem configs do GPT, preencher o formulário
        if (gptData.length > 0) {
          // Encontrar configs por tipo
          const roteiroConfig = gptData.find(c => c.tipo === 'roteiro');
          const bigIdeaConfig = gptData.find(c => c.tipo === 'big_idea');
          const storyConfig = gptData.find(c => c.tipo === 'story');
          
          gptForm.setValue('nome_roteiro', roteiroConfig?.nome || "GPT_Roteiro_Reel");
          gptForm.setValue('nome_big_idea', bigIdeaConfig?.nome || "GPT_BigIdea_Reel");
          gptForm.setValue('nome_story', storyConfig?.nome || "GPT_StoriesV_Reel");
          gptForm.setValue('modelo', roteiroConfig?.modelo || "");
          // Now the chave_api field is available in the database
          gptForm.setValue('chave_api', roteiroConfig?.chave_api || "");
          gptForm.setValue('ativo', roteiroConfig?.ativo !== undefined ? roteiroConfig.ativo : true);
        }
        
        // Carregar configuração do Dropbox
        const dropboxData = await getDropboxConfig();
        setDropboxConfig(dropboxData);
        
        // Se existe config do Dropbox, preencher o formulário
        if (dropboxData) {
          dropboxForm.setValue('token', dropboxData.token);
          dropboxForm.setValue('pasta_padrao', dropboxData.pasta_padrao);
          dropboxForm.setValue('link_base', dropboxData.link_base || "");
        }

        // Carregar configuração do Vimeo
        const vimeoData = await getVimeoConfig();
        setVimeoConfig(vimeoData);
        
        // Testar conexões existentes
        await testAllConnections();
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações salvas",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfigs();
  }, []);

  const testAllConnections = async () => {
    setIsTesting(true);
    try {
      const newStatuses = { ...statuses };
      
      // Testar configurações GPT
      const apiKey = gptForm.getValues('chave_api');
      if (apiKey) {
        const result = await testGptConnection(apiKey);
        
        // Atualiza status de todas as integrações GPT com o mesmo resultado
        // já que todas usam a mesma chave API
        newStatuses.gpt_roteiro = {
          status: result.success ? 'integrated' : 'error',
          message: result.message,
          error: result.error
        };
        
        newStatuses.gpt_big_idea = { ...newStatuses.gpt_roteiro };
        newStatuses.gpt_story = { ...newStatuses.gpt_roteiro };
      }
      
      // Testar configuração Dropbox
      const dropboxToken = dropboxForm.getValues('token');
      if (dropboxToken) {
        const result = await testDropboxConnection(dropboxToken);
        
        newStatuses.dropbox = {
          status: result.success ? 'integrated' : 'error',
          message: result.message,
          error: result.error
        };
      }

      // Testar configuração Vimeo
      if (vimeoConfig?.access_token) {
        const result = await testVimeoConnection(vimeoConfig.access_token);
        
        newStatuses.vimeo = {
          status: result.success ? 'integrated' : 'error',
          message: result.message,
          error: result.error
        };
      }
      
      setStatuses(newStatuses);
    } catch (error) {
      console.error("Erro ao testar conexões:", error);
      toast({
        title: "Erro",
        description: "Não foi possível testar as conexões",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const onGptSubmit = async (values: z.infer<typeof gptSchema>) => {
    try {
      setIsLoading(true);
      
      // Criar configuração para Roteiro
      const configRoteiro: Omit<GptConfig, 'id' | 'data_configuracao'> = {
        nome: values.nome_roteiro,
        tipo: 'roteiro',
        modelo: values.modelo,
        chave_api: values.chave_api,
        ativo: values.ativo,
        prompt: '' // Campo obrigatório adicionado
      };

      // Criar configuração para Big Idea
      const configBigIdea: Omit<GptConfig, 'id' | 'data_configuracao'> = {
        nome: values.nome_big_idea,
        tipo: 'big_idea',
        modelo: values.modelo,
        chave_api: values.chave_api,
        ativo: values.ativo,
        prompt: '' // Campo obrigatório adicionado
      };

      // Criar configuração para Story
      const configStory: Omit<GptConfig, 'id' | 'data_configuracao'> = {
        nome: values.nome_story,
        tipo: 'story',
        modelo: values.modelo,
        chave_api: values.chave_api,
        ativo: values.ativo,
        prompt: '' // Campo obrigatório adicionado
      };

      // Verificar se já existem configurações para atualizar
      const roteiroConfig = gptConfigs.find(c => c.tipo === 'roteiro');
      const bigIdeaConfig = gptConfigs.find(c => c.tipo === 'big_idea');
      const storyConfig = gptConfigs.find(c => c.tipo === 'story');

      // Salvar as configurações
      if (roteiroConfig) {
        await updateGptConfig(roteiroConfig.id, configRoteiro);
      } else {
        await saveGptConfig(configRoteiro);
      }
      
      if (bigIdeaConfig) {
        await updateGptConfig(bigIdeaConfig.id, configBigIdea);
      } else {
        await saveGptConfig(configBigIdea);
      }
      
      if (storyConfig) {
        await updateGptConfig(storyConfig.id, configStory);
      } else {
        await saveGptConfig(configStory);
      }
      
      // Recarregar as configurações
      const updatedConfigs = await getGptConfigs();
      setGptConfigs(updatedConfigs);
      
      // Testar a conexão com a nova configuração
      await testAllConnections();
      
      toast({
        title: "Configurações GPT salvas",
        description: "Modelos de GPT configurados com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao salvar configuração GPT:", error);
      
      // Exibe o erro detalhado em um diálogo
      if (error?.message) {
        setCurrentError(JSON.stringify(error, null, 2));
        setErrorDialogOpen(true);
      }
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações. Verifique o log de erros.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDropboxSubmit = async (values: z.infer<typeof dropboxSchema>) => {
    try {
      setIsLoading(true);
      
      // Ensure token and pasta_padrao are provided (even though the schema already validates this)
      const configToSave: Omit<DropboxConfig, "id" | "data_configuracao"> = {
        token: values.token,
        pasta_padrao: values.pasta_padrao,
        link_base: values.link_base
      };
      
      // Salvar configuração do Dropbox
      await saveDropboxConfig(configToSave);
      
      // Recarregar a configuração
      const updatedConfig = await getDropboxConfig();
      setDropboxConfig(updatedConfig);
      
      // Testar a conexão
      await testAllConnections();
      
      toast({
        title: "Configuração Dropbox salva",
        description: "Integração com Dropbox configurada com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao salvar configuração Dropbox:", error);
      
      // Exibe o erro detalhado em um diálogo
      if (error?.message) {
        setCurrentError(JSON.stringify(error, null, 2));
        setErrorDialogOpen(true);
      }
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a configuração",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Ícones para cada status
  const getStatusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case 'integrated':
        return <Check className="h-4 w-4 text-emerald-600" />;
      case 'not_configured':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  // Badge para cada status
  const getStatusBadge = (statusInfo: IntegrationStatusInfo) => {
    switch (statusInfo.status) {
      case 'integrated':
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                <Check className="h-3 w-3 mr-1" /> Integrado
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{statusInfo.message || "Integração funcionando corretamente"}</p>
            </TooltipContent>
          </Tooltip>
        );
      case 'not_configured':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
            <AlertTriangle className="h-3 w-3 mr-1" /> Não configurado
          </Badge>
        );
      case 'error':
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                <X className="h-3 w-3 mr-1" /> Erro de autenticação
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{statusInfo.error || "Erro ao conectar com o serviço"}</p>
            </TooltipContent>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-contourline-darkBlue">Painel de Integrações</h1>
        
        {/* Alerta para integrações com erro */}
        {Object.values(statuses).some(s => s.status === 'error') && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <div>
              <p className="font-medium">Atenção: Há integrações com erro</p>
              <p className="text-sm">Verifique o status das integrações e corrija as configurações necessárias.</p>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="mb-6">
            <p className="text-sm text-contourline-mediumBlue mb-2">Carregando configurações...</p>
            <Progress value={30} className="h-2" />
          </div>
        )}
        
        <Tabs defaultValue="gpt" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="gpt" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              GPT (OpenAI)
            </TabsTrigger>
            <TabsTrigger value="dropbox" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Dropbox
            </TabsTrigger>
            <TabsTrigger value="vimeo" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Vimeo
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
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Nomes dos modelos por finalidade</h3>
                      
                      <FormField
                        control={gptForm.control}
                        name="nome_roteiro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do modelo para Roteiro</FormLabel>
                            <FormControl>
                              <Input placeholder="GPT_Roteiro_Reel" {...field} />
                            </FormControl>
                            <FormDescription>
                              Nome para o modelo de geração de roteiros
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={gptForm.control}
                        name="nome_big_idea"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do modelo para Big Idea</FormLabel>
                            <FormControl>
                              <Input placeholder="GPT_BigIdea_Reel" {...field} />
                            </FormControl>
                            <FormDescription>
                              Nome para o modelo de geração de Big Ideas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={gptForm.control}
                        name="nome_story"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do modelo para Stories</FormLabel>
                            <FormControl>
                              <Input placeholder="GPT_StoriesV_Reel" {...field} />
                            </FormControl>
                            <FormDescription>
                              Nome para o modelo de geração de Stories
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-lg font-medium">Configurações compartilhadas</h3>
                      
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
                              Modelo da OpenAI a ser utilizado para todas as finalidades
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
                            <FormLabel className="flex justify-between items-center">
                              <span>Chave da API</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="h-6 px-2 text-xs"
                              >
                                {showApiKey ? (
                                  <><EyeOff className="h-3 w-3 mr-1" /> Ocultar</>
                                ) : (
                                  <><Eye className="h-3 w-3 mr-1" /> Mostrar</>
                                )}
                              </Button>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type={showApiKey ? "text" : "password"} 
                                placeholder="sk-..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Chave secreta da API OpenAI compartilhada para todos os modelos
                              <a 
                                href="https://platform.openai.com/account/api-keys" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-contourline-mediumBlue ml-1 hover:underline"
                              >
                                Obter chave API
                              </a>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="flex items-center gap-2"
                        disabled={isLoading || isTesting}
                      >
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
                          <FormLabel className="flex justify-between items-center">
                            <span>Token de acesso</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setShowDropboxToken(!showDropboxToken)}
                              className="h-6 px-2 text-xs"
                            >
                              {showDropboxToken ? (
                                <><EyeOff className="h-3 w-3 mr-1" /> Ocultar</>
                              ) : (
                                <><Eye className="h-3 w-3 mr-1" /> Mostrar</>
                              )}
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type={showDropboxToken ? "text" : "password"} 
                              placeholder="Token de acesso do Dropbox" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Token de acesso da API do Dropbox
                            <a 
                              href="https://www.dropbox.com/developers/apps" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-contourline-mediumBlue ml-1 hover:underline"
                            >
                              Obter token
                            </a>
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
                      <Button 
                        type="submit" 
                        className="flex items-center gap-2"
                        disabled={isLoading || isTesting}
                      >
                        <Save className="h-4 w-4" />
                        Salvar Configuração Dropbox
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Vimeo Configuration Tab */}
          <TabsContent value="vimeo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-contourline-mediumBlue" />
                  Configuração Vimeo
                </CardTitle>
                <CardDescription>
                  Configure a integração com o Vimeo para importação de vídeos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  A integração com o Vimeo permite importar vídeos diretamente da sua conta para a plataforma.
                </p>
                <div className="flex justify-center">
                  <Button asChild>
                    <Link to="/admin/vimeo-settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurar Vimeo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Integration Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Status das Integrações</span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => testAllConnections()} 
                disabled={isLoading || isTesting}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${isTesting ? 'animate-spin' : ''}`} />
                Revalidar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-contourline-mediumBlue" />
                  <span>OpenAI (Roteiro)</span>
                </div>
                {getStatusBadge(statuses.gpt_roteiro)}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-contourline-mediumBlue" />
                  <span>OpenAI (Big Idea)</span>
                </div>
                {getStatusBadge(statuses.gpt_big_idea)}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-contourline-mediumBlue" />
                  <span>OpenAI (Stories)</span>
                </div>
                {getStatusBadge(statuses.gpt_story)}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-contourline-mediumBlue" />
                  <span>Dropbox</span>
                </div>
                {getStatusBadge(statuses.dropbox)}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-contourline-mediumBlue" />
                  <span>Vimeo</span>
                </div>
                {vimeoConfig?.access_token ? 
                  getStatusBadge(statuses.vimeo) : 
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Configurar
                  </Badge>
                }
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Error Dialog */}
        <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Detalhes do Erro
              </DialogTitle>
              <DialogDescription>
                Informações detalhadas sobre o erro encontrado
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gray-50 p-3 rounded-md overflow-auto max-h-80">
              <pre className="text-xs whitespace-pre-wrap break-words text-red-700">{currentError}</pre>
            </div>
            <div className="flex items-center justify-start text-sm text-gray-600">
              <Info className="h-4 w-4 mr-2" />
              <p>Este erro pode estar relacionado a permissões no banco de dados ou autenticação.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminIntegrations;
