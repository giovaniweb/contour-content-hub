
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ExternalLink,
  HelpCircle,
  Copy,
  Link as LinkIcon
} from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { saveVimeoConfig, getVimeoConfig, testVimeoConnection } from "@/services/integrationService";
import { VimeoConfig } from "@/types/database";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VimeoAccountManager from "@/components/vimeo/VimeoAccountManager";
import VimeoConnectButton from "@/components/vimeo/VimeoConnectButton";

// Define schema para o formulário com validação mais rigorosa para o token
const vimeoSchema = z.object({
  access_token: z.string()
    .min(20, "Token de acesso deve ter pelo menos 20 caracteres")
    .refine(val => val.length >= 20, {
      message: "Token parece incompleto. Tokens do Vimeo são geralmente longos."
    }),
  folder_id: z.string().optional(),
});

type VimeoFormValues = z.infer<typeof vimeoSchema>;

const VIMEO_DEVELOPER_URL = "https://developer.vimeo.com/apps";
const VIMEO_TOKEN_URL = "https://developer.vimeo.com/apps/new";
const VIMEO_SCOPES = ["public", "private", "upload", "edit", "interact", "video_files"];

// Token de exemplo para mostrar o formato correto
const EXAMPLE_TOKEN = "f04df04c4f0a9a0b3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z";

const VimeoSettings: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = usePermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showToken, setShowToken] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [helpMessage, setHelpMessage] = useState<string | null>(null);
  const [missingScopes, setMissingScopes] = useState<string[] | null>(null);
  const [requiredScopes, setRequiredScopes] = useState<string[] | null>(null);
  const [scopesDialogOpen, setScopesDialogOpen] = useState(false);
  const [exampleDialogOpen, setExampleDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("oauth");
  
  // Formulário
  const form = useForm<VimeoFormValues>({
    resolver: zodResolver(vimeoSchema),
    defaultValues: {
      access_token: "",
      folder_id: "",
    },
  });

  // Se não for admin, redirecionar para o dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Carregar configurações existentes
  useEffect(() => {
    const loadVimeoSettings = async () => {
      try {
        setIsLoading(true);
        const config = await getVimeoConfig();

        if (config) {
          form.setValue('access_token', config.access_token || "");
          form.setValue('folder_id', config.folder_id || "");
        }
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVimeoSettings();
  }, [form]);

  // Mostrar o exemplo de token
  const showTokenExample = () => {
    setExampleDialogOpen(true);
  };

  // Copiar texto para a área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Erro ao copiar: ', err);
      });
  };

  // Validar token localmente
  const validateTokenLocally = (token: string): boolean => {
    if (!token || token.length < 20) {
      toast({
        variant: "destructive",
        title: "Token inválido",
        description: "O token parece incompleto ou inválido. Verifique se você copiou o token inteiro do Vimeo."
      });
      return false;
    }
    
    // Verificação adicional para detectar tokens truncados
    if (token.length < 30) {
      toast({
        title: "Token pode estar incompleto",
        description: "O token parece curto demais. Tokens do Vimeo geralmente são mais longos. Verifique se você copiou o token inteiro.",
        variant: "destructive"
      });
    }
    
    return true;
  };

  // Abrir o painel de desenvolvedor do Vimeo em uma nova aba
  const openVimeoDeveloperPanel = () => {
    window.open(VIMEO_DEVELOPER_URL, "_blank", "noopener,noreferrer");
  };
  
  // Abrir a página de criação de token do Vimeo
  const openVimeoTokenPage = () => {
    window.open(VIMEO_TOKEN_URL, "_blank", "noopener,noreferrer");
  };

  // Testar conexão
  const testConnection = async (values: VimeoFormValues) => {
    // Validar token localmente antes de fazer a chamada
    if (!validateTokenLocally(values.access_token)) {
      return;
    }

    try {
      setIsTesting(true);
      setConnectionStatus('idle');
      setConnectionMessage("");
      setErrorDetails(null);
      setHelpMessage(null);
      setMissingScopes(null);
      setRequiredScopes(null);

      console.log("Testando conexão com token:", values.access_token.substring(0, 5) + "..." + values.access_token.substring(values.access_token.length - 5));
      
      const result = await testVimeoConnection(values.access_token);
      console.log("Resultado do teste de conexão:", result);

      if (result.success) {
        setConnectionStatus('success');
        setConnectionMessage(result.message || "Conexão estabelecida com sucesso!");
      } else {
        setConnectionStatus('error');
        setConnectionMessage(result.error || "Erro ao conectar com Vimeo");
        
        // Verificar se temos uma mensagem de ajuda específica
        if (result.help) {
          setHelpMessage(result.help);
        }
        
        // Verificar se temos informações sobre escopos
        if (result.missing_scopes && Array.isArray(result.missing_scopes)) {
          setMissingScopes(result.missing_scopes);
        }
        
        if (result.required_scopes && Array.isArray(result.required_scopes)) {
          setRequiredScopes(result.required_scopes);
        }
        
        if (result.instructions) {
          setHelpMessage((prev) => prev ? `${prev}\n\n${result.instructions}` : result.instructions);
        }
        
        if (result.details) {
          setErrorDetails(result.details);
        }
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      setConnectionStatus('error');
      setConnectionMessage("Falha na solicitação de teste");
    } finally {
      setIsTesting(false);
    }
  };

  // Salvar configurações
  const onSubmit = async (values: VimeoFormValues) => {
    // Validar token localmente antes de salvar
    if (!validateTokenLocally(values.access_token)) {
      return;
    }

    try {
      setIsLoading(true);

      const config: VimeoConfig = {
        access_token: values.access_token,
        folder_id: values.folder_id || undefined
      };

      await saveVimeoConfig(config);

      toast({
        title: "Configurações salvas",
        description: "Configurações do Vimeo foram salvas com sucesso"
      });

      // Testar conexão após salvar
      await testConnection(values);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações do Vimeo"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showErrorDetails = () => {
    setErrorDialogOpen(true);
  };

  return (
    <Layout title="Configurações do Vimeo">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Configurações do Vimeo</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="oauth">Autenticação OAuth</TabsTrigger>
            <TabsTrigger value="token">Token de Acesso Manual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="oauth" className="pt-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Conexão OAuth com Vimeo</CardTitle>
                <CardDescription>
                  Conecte uma ou mais contas Vimeo usando o fluxo de autenticação OAuth2
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Autenticação recomendada</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <p>A autenticação OAuth2 é mais segura e permite:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Conexão de múltiplas contas Vimeo</li>
                      <li>Tokens que se renovam automaticamente</li>
                      <li>Maior segurança (sem armazenar tokens manualmente)</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <VimeoAccountManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="token" className="pt-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Token de Acesso Manual</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openVimeoTokenPage}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Criar Token
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openVimeoDeveloperPanel}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Painel Vimeo
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Configure as credenciais para acesso à API do Vimeo
                </CardDescription>
              </CardHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="access_token"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span>Token de Acesso</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0" type="button" onClick={() => setScopesDialogOpen(true)}>
                                      <HelpCircle className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Saiba mais sobre escopos do Vimeo</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowToken(!showToken)}
                              className="h-6 px-2 text-xs"
                            >
                              {showToken ? (
                                <><EyeOff className="h-3 w-3 mr-1" /> Ocultar</>
                              ) : (
                                <><Eye className="h-3 w-3 mr-1" /> Mostrar</>
                              )}
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showToken ? "text" : "password"}
                                placeholder="Token de acesso do Vimeo"
                                {...field}
                                disabled={isLoading}
                                className="pr-24"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-2 text-xs text-blue-600"
                                onClick={showTokenExample}
                              >
                                Ver exemplo
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription className="flex items-center justify-between">
                            <span>
                              Token de acesso à API do Vimeo com os escopos necessários.
                            </span>
                            <a 
                              href={VIMEO_TOKEN_URL}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 ml-1 hover:underline flex items-center gap-1"
                            >
                              <span>Obter token</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="folder_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID da Pasta (opcional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ID da pasta no Vimeo"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription>
                            ID da pasta específica para importar vídeos. Deixe em branco para buscar todos os vídeos.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {connectionStatus === 'success' && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Conexão estabelecida</AlertTitle>
                        <AlertDescription className="text-green-700">
                          {connectionMessage}
                        </AlertDescription>
                      </Alert>
                    )}

                    {connectionStatus === 'error' && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-800 flex justify-between items-center">
                          <span>Erro de conexão</span>
                          {errorDetails && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={showErrorDetails}
                              className="text-xs flex items-center text-red-700 h-6"
                            >
                              <Info className="h-3 w-3 mr-1" /> Detalhes
                            </Button>
                          )}
                        </AlertTitle>
                        <AlertDescription className="text-red-700">
                          {connectionMessage}
                          
                          {helpMessage && (
                            <div className="mt-2 p-2 bg-red-100 rounded-md">
                              <p className="font-medium">Dica:</p>
                              <p className="whitespace-pre-line">{helpMessage}</p>
                              
                              {missingScopes && missingScopes.length > 0 && (
                                <div className="mt-2">
                                  <p className="font-medium">Escopos necessários ausentes:</p>
                                  <ul className="list-disc list-inside">
                                    {missingScopes.map(scope => (
                                      <li key={scope}>{scope}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {requiredScopes && requiredScopes.length > 0 && (
                                <div className="mt-2">
                                  <p className="font-medium">Todos os escopos necessários:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {requiredScopes.map(scope => (
                                      <Badge key={scope} className="bg-blue-100 text-blue-800 border-blue-300">
                                        {scope}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="mt-3 flex justify-between items-center">
                                <p className="text-xs">
                                  Verifique se você gerou o token com todos os escopos necessários
                                </p>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  onClick={openVimeoTokenPage}
                                  className="text-xs h-7"
                                >
                                  Criar novo token
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800">Verificação de token</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        <p>Certifique-se que seu token:</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Foi copiado <strong>integralmente</strong> (tokens são longos)</li>
                          <li>Foi gerado com <strong>todos os escopos</strong> necessários</li>
                          <li>Está ativo e não expirou</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => testConnection(form.getValues())}
                      disabled={isLoading || isTesting || !form.getValues().access_token}
                    >
                      {isTesting ? (
                        <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Testando conexão</>
                      ) : (
                        <><RefreshCw className="h-4 w-4 mr-2" /> Testar conexão</>
                      )}
                    </Button>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Salvando...</>
                      ) : (
                        <><Save className="h-4 w-4 mr-2" /> Salvar</>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de detalhes do erro */}
        <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Detalhes do erro Vimeo
              </DialogTitle>
              <DialogDescription>
                Informações técnicas sobre o erro de conexão com o Vimeo
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-80">
              <pre className="text-xs whitespace-pre-wrap">
                {errorDetails ? JSON.stringify(errorDetails, null, 2) : 'Nenhum detalhe disponível'}
              </pre>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Info className="h-4 w-4 mr-2 text-blue-500" />
              <p>Verifique se o token tem as permissões corretas e está válido.</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal explicativo sobre escopos */}
        <Dialog open={scopesDialogOpen} onOpenChange={setScopesDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Escopos do Token Vimeo</DialogTitle>
              <DialogDescription>
                Escopos são permissões que o seu token precisa ter para acessar recursos do Vimeo
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Por que os escopos são importantes?</AlertTitle>
                <AlertDescription>
                  Para que a integração funcione corretamente, seu token precisa ter todas as permissões necessárias.
                </AlertDescription>
              </Alert>
              
              <div>
                <h3 className="font-medium mb-2">Escopos necessários:</h3>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  {VIMEO_SCOPES.map(scope => (
                    <li key={scope} className="flex items-start">
                      <Badge className="mr-2 bg-blue-100 text-blue-800">{scope}</Badge>
                      <span>
                        {scope === 'public' && 'Acesso para listar vídeos públicos'}
                        {scope === 'private' && 'Acesso a vídeos privados'}
                        {scope === 'upload' && 'Permissão para upload de vídeos'}
                        {scope === 'edit' && 'Edição de metadados dos vídeos'}
                        {scope === 'interact' && 'Interação com recursos da conta'}
                        {scope === 'video_files' && 'Acesso aos arquivos de vídeo'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Como configurar os escopos:</h3>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li>Acesse <a href={VIMEO_DEVELOPER_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">developer.vimeo.com/apps</a></li>
                  <li>Selecione seu aplicativo ou crie um novo</li>
                  <li>Na seção 'Authentication', marque todos os escopos listados acima</li>
                  <li>Gere um novo token de acesso pessoal</li>
                  <li>Copie o token <strong>completo</strong> e cole no formulário</li>
                </ol>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={openVimeoTokenPage} className="mr-auto">
                <ExternalLink className="h-4 w-4 mr-2" />
                Criar novo token
              </Button>
              <Button onClick={() => setScopesDialogOpen(false)}>
                Entendi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de exemplo de token */}
        <Dialog open={exampleDialogOpen} onOpenChange={setExampleDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Exemplo de Token Vimeo
              </DialogTitle>
              <DialogDescription>
                Veja como é um token válido do Vimeo (formato apenas ilustrativo)
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Os tokens do Vimeo são longos e começam com letras e números. O exemplo abaixo mostra o formato típico.
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-50 p-3 rounded-md relative">
                <div className="font-mono text-sm break-all">{EXAMPLE_TOKEN}</div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute right-2 top-2"
                  onClick={() => copyToClipboard(EXAMPLE_TOKEN)}
                >
                  {copySuccess ? 'Copiado!' : <><Copy className="h-3.5 w-3.5 mr-1" /> Copiar</>}
                </Button>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Token truncado detectado
                </h3>
                <p className="text-sm text-yellow-700">
                  O token que você inseriu parece curto demais (<strong>{"675137e20291b4fb0358ddac658b5b3d".length}</strong> caracteres). 
                  Os tokens do Vimeo geralmente têm <strong>64</strong> caracteres ou mais.
                </p>
                <p className="text-sm mt-2 text-yellow-700">
                  Certifique-se de copiar o token <strong>inteiro</strong> do painel do Vimeo.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={openVimeoTokenPage} className="mr-auto">
                <ExternalLink className="h-4 w-4 mr-2" />
                Gerar novo token
              </Button>
              <Button onClick={() => setExampleDialogOpen(false)}>
                Entendi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default VimeoSettings;
