
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Settings, 
  FileText, 
  RefreshCw, 
  ArrowRight, 
  Loader2,
  Terminal,
  FolderOpen,
  Video
} from "lucide-react";
import { GptConfig, DropboxConfig, VimeoConfig, IntegrationStatus } from '@/types/database';
import { getGptConfigs, testGptConnection, saveGptConfig, updateGptConfig } from '@/services/integrationService';
import { getDropboxConfig, saveDropboxConfig, testDropboxConnection } from '@/services/integrationService';
import { getVimeoConfig, testVimeoConnection, saveVimeoConfig } from '@/services/integrationService';
import { usePermissions } from '@/hooks/use-permissions';
import { Navigate } from 'react-router-dom';
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPABASE_BASE_URL } from '@/integrations/supabase/client';

const gptConfigSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  chave_api: z.string().min(1, "Chave API é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  prompt: z.string().optional(),
  tipo: z.string().default("openai"),
  ativo: z.boolean().default(true)
});

const dropboxConfigSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  pasta_padrao: z.string().min(1, "Pasta padrão é obrigatória")
});

const vimeoConfigSchema = z.object({
  folder_id: z.string().min(1, "ID da pasta é obrigatório")
});

// Tipo para status de integração
type IntegrationStatusData = {
  status: IntegrationStatus;
  message?: string;
  details?: any;
};

// Estado das integrações
type IntegrationStatuses = {
  gpt?: IntegrationStatusData;
  dropbox?: IntegrationStatusData;
  vimeo?: IntegrationStatusData;
};

const AdminIntegrations: React.FC = () => {
  const { isAdmin } = usePermissions();
  const { toast } = useToast();
  
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [gptConfigs, setGptConfigs] = useState<GptConfig[]>([]);
  const [dropboxConfig, setDropboxConfig] = useState<DropboxConfig | null>(null);
  const [vimeoConfig, setVimeoConfig] = useState<VimeoConfig | null>(null);
  
  const [currentGptConfig, setCurrentGptConfig] = useState<GptConfig | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [integrationStatuses, setIntegrationStatuses] = useState<IntegrationStatuses>({});
  
  // Forms
  const gptForm = useForm({
    resolver: zodResolver(gptConfigSchema),
    defaultValues: {
      nome: '',
      chave_api: '',
      modelo: 'gpt-3.5-turbo',
      prompt: '',
      tipo: 'openai',
      ativo: true
    }
  });
  
  const dropboxForm = useForm({
    resolver: zodResolver(dropboxConfigSchema),
    defaultValues: {
      token: '',
      pasta_padrao: '/Fluida'
    }
  });
  
  const vimeoForm = useForm({
    resolver: zodResolver(vimeoConfigSchema),
    defaultValues: {
      folder_id: ''
    }
  });
  
  // Carrega as configurações iniciais
  useEffect(() => {
    loadConfigurations();
  }, []);
  
  // Atualiza o formulário quando a configuração atual do GPT muda
  useEffect(() => {
    if (currentGptConfig) {
      gptForm.reset({
        nome: currentGptConfig.nome,
        chave_api: currentGptConfig.chave_api,
        modelo: currentGptConfig.modelo,
        prompt: currentGptConfig.prompt || '',
        tipo: currentGptConfig.tipo,
        ativo: currentGptConfig.ativo
      });
    } else if (isAdding) {
      gptForm.reset({
        nome: '',
        chave_api: '',
        modelo: 'gpt-3.5-turbo',
        prompt: '',
        tipo: 'openai',
        ativo: true
      });
    }
  }, [currentGptConfig, isAdding]);
  
  // Atualiza o formulário quando a configuração do Dropbox muda
  useEffect(() => {
    if (dropboxConfig) {
      dropboxForm.reset({
        token: dropboxConfig.token,
        pasta_padrao: dropboxConfig.pasta_padrao
      });
    }
  }, [dropboxConfig]);
  
  // Atualiza o formulário quando a configuração do Vimeo muda
  useEffect(() => {
    if (vimeoConfig) {
      vimeoForm.reset({
        folder_id: vimeoConfig.folder_id || ''
      });
    }
  }, [vimeoConfig]);
  
  // Função para carregar todas as configurações
  const loadConfigurations = async () => {
    setIsLoadingConfigs(true);
    
    try {
      // Carregar configurações do GPT
      const gptData = await getGptConfigs();
      setGptConfigs(gptData);
      
      // Definir configuração atual como o primeiro item
      if (gptData.length > 0) {
        setCurrentGptConfig(gptData[0]);
      }
      
      // Carregar configuração do Dropbox
      const dropboxData = await getDropboxConfig();
      setDropboxConfig(dropboxData);
      
      // Carregar configuração do Vimeo
      const vimeoData = await getVimeoConfig();
      setVimeoConfig(vimeoData);
      
      // Verificar status das integrações
      checkIntegrationStatus();
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações das integrações"
      });
    } finally {
      setIsLoadingConfigs(false);
    }
  };
  
  // Verifica o status das integrações
  const checkIntegrationStatus = async () => {
    try {
      const newStatuses: IntegrationStatuses = {};
      
      // Verificar GPT
      const gptConfig = gptConfigs.find(config => config.ativo);
      if (gptConfig) {
        const result = await testGptConnection(gptConfig.chave_api);
        
        newStatuses.gpt = {
          status: result.success ? 'integrated' : 'error',
          message: result.message || result.error
        };
      } else {
        newStatuses.gpt = {
          status: 'not_configured',
          message: "Nenhuma configuração ativa"
        };
      }
      
      // Verificar Dropbox
      if (dropboxConfig?.token) {
        const result = await testDropboxConnection(dropboxConfig.token);
        
        newStatuses.dropbox = {
          status: result.success ? 'integrated' : 'error',
          message: result.message || result.error
        };
      } else {
        newStatuses.dropbox = {
          status: 'not_configured',
          message: "Token não configurado"
        };
      }
      
      // Testar configuração Vimeo
      if (vimeoConfig?.folder_id) {
        const result = await testVimeoConnection(vimeoConfig.folder_id);
        
        newStatuses.vimeo = {
          status: result.success ? 'integrated' : 'error',
          message: result.message || result.error,
          details: result
        };
      } else {
        newStatuses.vimeo = {
          status: 'not_configured',
          message: "Configuração do Vimeo incompleta"
        };
      }
      
      setIntegrationStatuses(newStatuses);
    } catch (error) {
      console.error("Erro ao verificar status das integrações:", error);
      toast({
        variant: "destructive",
        title: "Erro ao verificar integrações",
        description: "Não foi possível verificar o status das integrações"
      });
    }
  };
  
  // Handler para mudar a configuração atual do GPT
  const handleGptConfigChange = (configId: string) => {
    const config = gptConfigs.find(c => c.id === configId);
    if (config) {
      setCurrentGptConfig(config);
      setIsAdding(false);
    }
  };
  
  // Handler para adicionar nova configuração do GPT
  const handleAddGptConfig = () => {
    setCurrentGptConfig(null);
    setIsAdding(true);
  };
  
  // Salvar configuração do GPT
  const handleSaveGptConfig = async (data: any) => {
    setIsSaving(true);
    
    try {
      if (isAdding) {
        // Adicionar nova configuração
        const newConfig = await saveGptConfig(data);
        setGptConfigs([...gptConfigs, newConfig]);
        setCurrentGptConfig(newConfig);
        setIsAdding(false);
        
        toast({
          title: "Configuração salva",
          description: "Nova configuração GPT foi adicionada com sucesso"
        });
      } else if (currentGptConfig) {
        // Atualizar configuração existente
        await updateGptConfig(currentGptConfig.id, data);
        
        // Atualizar lista de configurações
        const updatedConfigs = gptConfigs.map(config => 
          config.id === currentGptConfig.id ? { ...config, ...data } : config
        );
        
        setGptConfigs(updatedConfigs);
        setCurrentGptConfig({ ...currentGptConfig, ...data });
        
        toast({
          title: "Configuração atualizada",
          description: "Configuração GPT foi atualizada com sucesso"
        });
      }
      
      // Verificar status da integração
      setTimeout(checkIntegrationStatus, 1000);
    } catch (error) {
      console.error("Erro ao salvar configuração GPT:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração GPT"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Testar conexão com GPT
  const handleTestGptConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      const apiKey = gptForm.getValues('chave_api');
      
      if (!apiKey) {
        toast({
          variant: "destructive",
          title: "Chave API obrigatória",
          description: "Digite a chave API antes de testar a conexão"
        });
        return;
      }
      
      const result = await testGptConnection(apiKey);
      
      if (result.success) {
        toast({
          title: "Conexão bem-sucedida",
          description: "A conexão com a API OpenAI foi estabelecida com sucesso"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Falha na conexão",
          description: result.error || "Não foi possível conectar à API OpenAI"
        });
      }
    } catch (error) {
      console.error("Erro ao testar conexão GPT:", error);
      toast({
        variant: "destructive",
        title: "Erro ao testar conexão",
        description: "Ocorreu um erro ao testar a conexão com a API OpenAI"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };
  
  // Salvar configuração do Dropbox
  const handleSaveDropboxConfig = async (data: any) => {
    setIsSaving(true);
    
    try {
      await saveDropboxConfig(data);
      setDropboxConfig(data);
      
      toast({
        title: "Configuração salva",
        description: "Configuração do Dropbox foi salva com sucesso"
      });
      
      // Verificar status da integração
      setTimeout(checkIntegrationStatus, 1000);
    } catch (error) {
      console.error("Erro ao salvar configuração Dropbox:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração do Dropbox"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Testar conexão com Dropbox
  const handleTestDropboxConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      const token = dropboxForm.getValues('token');
      
      if (!token) {
        toast({
          variant: "destructive",
          title: "Token obrigatório",
          description: "Digite o token antes de testar a conexão"
        });
        return;
      }
      
      const result = await testDropboxConnection(token);
      
      if (result.success) {
        toast({
          title: "Conexão bem-sucedida",
          description: "A conexão com o Dropbox foi estabelecida com sucesso"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Falha na conexão",
          description: result.error || "Não foi possível conectar ao Dropbox"
        });
      }
    } catch (error) {
      console.error("Erro ao testar conexão Dropbox:", error);
      toast({
        variant: "destructive",
        title: "Erro ao testar conexão",
        description: "Ocorreu um erro ao testar a conexão com o Dropbox"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };
  
  // Salvar configuração do Vimeo
  const handleSaveVimeoConfig = async (data: any) => {
    setIsSaving(true);
    
    try {
      await saveVimeoConfig(data);
      setVimeoConfig(data);
      
      toast({
        title: "Configuração salva",
        description: "Configuração do Vimeo foi salva com sucesso"
      });
      
      // Verificar status da integração
      setTimeout(checkIntegrationStatus, 1000);
    } catch (error) {
      console.error("Erro ao salvar configuração Vimeo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração do Vimeo"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Se não for admin, redirecionar para o dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Renderiza o status da integração
  const renderIntegrationStatus = (status?: IntegrationStatusData) => {
    if (!status) {
      return (
        <div className="flex items-center">
          <AlertCircle className="mr-2 h-4 w-4 text-gray-400" />
          <span className="text-sm">Não verificado</span>
        </div>
      );
    }
    
    switch (status.status) {
      case 'integrated':
        return (
          <div className="flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600">Integrado</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center">
            <XCircle className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-sm text-red-600">Erro</span>
          </div>
        );
      case 'not_configured':
        return (
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
            <span className="text-sm text-amber-600">Não configurado</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-sm">Desconhecido</span>
          </div>
        );
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Configurações de Integração</h1>
          <p className="text-muted-foreground mt-1">
            Configure integrações com serviços externos
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card de Status da OpenAI */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Terminal className="mr-2 h-5 w-5" />
                  <CardTitle className="text-lg">OpenAI</CardTitle>
                </div>
                {renderIntegrationStatus(integrationStatuses.gpt)}
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-sm">
                {isLoadingConfigs ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Carregando configuração...</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground">
                      {gptConfigs.length === 0
                        ? "Nenhuma configuração encontrada"
                        : `${gptConfigs.length} ${gptConfigs.length === 1 ? 'configuração' : 'configurações'} definidas`}
                    </p>
                    <p className="mt-2">
                      {integrationStatuses.gpt?.status === 'integrated' 
                        ? "Pronto para uso nos roteiros" 
                        : integrationStatuses.gpt?.message || "Status desconhecido"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => document.getElementById('gpt-config')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurar
              </Button>
            </CardFooter>
          </Card>

          {/* Card de Status do Dropbox */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FolderOpen className="mr-2 h-5 w-5" />
                  <CardTitle className="text-lg">Dropbox</CardTitle>
                </div>
                {renderIntegrationStatus(integrationStatuses.dropbox)}
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-sm">
                {isLoadingConfigs ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Carregando configuração...</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground">
                      {dropboxConfig 
                        ? `Pasta configurada: ${dropboxConfig.pasta_padrao}` 
                        : "Nenhuma configuração encontrada"}
                    </p>
                    <p className="mt-2">
                      {integrationStatuses.dropbox?.status === 'integrated' 
                        ? "Pronto para uso com arquivos" 
                        : integrationStatuses.dropbox?.message || "Status desconhecido"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => document.getElementById('dropbox-config')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurar
              </Button>
            </CardFooter>
          </Card>

          {/* Card de Status do Vimeo */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Video className="mr-2 h-5 w-5" />
                  <CardTitle className="text-lg">Vimeo</CardTitle>
                </div>
                {renderIntegrationStatus(integrationStatuses.vimeo)}
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-sm">
                {isLoadingConfigs ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Carregando configuração...</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground">
                      {vimeoConfig?.folder_id
                        ? `Pasta configurada: ${vimeoConfig.folder_id}` 
                        : "Nenhuma pasta configurada"}
                    </p>
                    <p className="mt-2">
                      {integrationStatuses.vimeo?.status === 'integrated' 
                        ? "Pronto para importar vídeos" 
                        : integrationStatuses.vimeo?.message || "Status desconhecido"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => document.getElementById('vimeo-config')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurar
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Button 
          variant="outline" 
          onClick={checkIntegrationStatus} 
          className="mb-8"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isTestingConnection ? 'animate-spin' : ''}`} />
          Verificar status das integrações
        </Button>

        {/* Configuração do GPT */}
        <div id="gpt-config" className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Configuração OpenAI GPT</h2>
            <Button onClick={handleAddGptConfig} variant="outline" size="sm">
              Adicionar nova configuração
            </Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              {gptConfigs.length > 0 && !isAdding && (
                <div className="mb-4">
                  <Label>Selecione a configuração</Label>
                  <Select 
                    value={currentGptConfig?.id} 
                    onValueChange={handleGptConfigChange}
                  >
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder="Selecione uma configuração" />
                    </SelectTrigger>
                    <SelectContent>
                      {gptConfigs.map(config => (
                        <SelectItem key={config.id} value={config.id}>
                          {config.nome} {config.ativo ? '(Ativa)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <form onSubmit={gptForm.handleSubmit(handleSaveGptConfig)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gpt-nome">Nome da configuração</Label>
                    <Input 
                      id="gpt-nome"
                      {...gptForm.register('nome')}
                      placeholder="Ex: GPT-3.5 Turbo"
                      className="mt-1"
                    />
                    {gptForm.formState.errors.nome && (
                      <p className="text-sm text-red-500 mt-1">{gptForm.formState.errors.nome.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="gpt-chave-api">Chave API OpenAI</Label>
                    <Input 
                      id="gpt-chave-api"
                      {...gptForm.register('chave_api')}
                      placeholder="sk-..."
                      className="mt-1"
                      type="password"
                    />
                    {gptForm.formState.errors.chave_api && (
                      <p className="text-sm text-red-500 mt-1">{gptForm.formState.errors.chave_api.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="gpt-modelo">Modelo</Label>
                    <Select 
                      value={gptForm.watch('modelo')} 
                      onValueChange={val => gptForm.setValue('modelo', val)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                    {gptForm.formState.errors.modelo && (
                      <p className="text-sm text-red-500 mt-1">{gptForm.formState.errors.modelo.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="gpt-prompt">Prompt padrão (opcional)</Label>
                    <Textarea 
                      id="gpt-prompt"
                      {...gptForm.register('prompt')}
                      placeholder="Instruções padrão para o modelo"
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleTestGptConnection}
                      disabled={isTestingConnection || isSaving}
                    >
                      {isTestingConnection ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Testar conexão
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="submit"
                      disabled={isSaving || isTestingConnection}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>Salvar configuração</>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Configuração do Dropbox */}
        <div id="dropbox-config" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Configuração Dropbox</h2>
          
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={dropboxForm.handleSubmit(handleSaveDropboxConfig)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dropbox-token">Token de acesso</Label>
                    <Input 
                      id="dropbox-token"
                      {...dropboxForm.register('token')}
                      placeholder="sl...."
                      className="mt-1"
                      type="password"
                    />
                    {dropboxForm.formState.errors.token && (
                      <p className="text-sm text-red-500 mt-1">{dropboxForm.formState.errors.token.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="dropbox-pasta">Pasta padrão</Label>
                    <Input 
                      id="dropbox-pasta"
                      {...dropboxForm.register('pasta_padrao')}
                      placeholder="/Fluida"
                      className="mt-1"
                    />
                    {dropboxForm.formState.errors.pasta_padrao && (
                      <p className="text-sm text-red-500 mt-1">{dropboxForm.formState.errors.pasta_padrao.message}</p>
                    )}
                  </div>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Como obter o token do Dropbox</AlertTitle>
                    <AlertDescription>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Acesse a <a href="https://www.dropbox.com/developers/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">página de desenvolvedores do Dropbox</a></li>
                        <li>Clique em "Create app"</li>
                        <li>Escolha "Scoped access" e "Full Dropbox"</li>
                        <li>Dê um nome ao seu app e clique em "Create app"</li>
                        <li>Na aba "Permissions", adicione as permissões de arquivo necessárias</li>
                        <li>Na aba "Settings", em "OAuth 2", gere o token de acesso</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleTestDropboxConnection}
                      disabled={isTestingConnection || isSaving}
                    >
                      {isTestingConnection ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Testar conexão
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="submit"
                      disabled={isSaving || isTestingConnection}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>Salvar configuração</>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Configuração do Vimeo */}
        <div id="vimeo-config" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Configuração Vimeo</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Informação importante</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">Para conexão com o Vimeo, recomendamos usar a autenticação OAuth, que é mais segura e oferece mais recursos.</p>
                    <Button asChild variant="outline" size="sm">
                      <a href="/admin/vimeo-settings">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Ir para configuração OAuth do Vimeo
                      </a>
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            
              <form onSubmit={vimeoForm.handleSubmit(handleSaveVimeoConfig)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="vimeo-folder">ID da Pasta Vimeo (opcional)</Label>
                    <Input 
                      id="vimeo-folder"
                      {...vimeoForm.register('folder_id')}
                      placeholder="12345678"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      ID da pasta para importação de vídeos. Deixe em branco para listar todos os vídeos.
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>Salvar configuração</>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </Layout>
  );
};

export default AdminIntegrations;
