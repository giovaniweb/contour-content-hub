
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
import { Eye, EyeOff, Save, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { saveVimeoConfig, getVimeoConfig, testVimeoConnection } from "@/services/integrationService";
import { VimeoConfig } from "@/types/database";

// Define schema para o formulário
const vimeoSchema = z.object({
  access_token: z.string().min(5, "Token de acesso é obrigatório"),
  folder_id: z.string().optional(),
});

type VimeoFormValues = z.infer<typeof vimeoSchema>;

const VimeoSettings: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = usePermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showToken, setShowToken] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");

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

  // Testar conexão
  const testConnection = async (values: VimeoFormValues) => {
    try {
      setIsTesting(true);
      setConnectionStatus('idle');
      setConnectionMessage("");

      console.log("Testando conexão com token:", values.access_token.substring(0, 5) + "...");
      
      const result = await testVimeoConnection(values.access_token);
      console.log("Resultado do teste de conexão:", result);

      if (result.success) {
        setConnectionStatus('success');
        setConnectionMessage(result.message || "Conexão estabelecida com sucesso!");
      } else {
        setConnectionStatus('error');
        setConnectionMessage(result.error || "Erro ao conectar com Vimeo");
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

  return (
    <Layout title="Configurações do Vimeo">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Configurações do Vimeo</h1>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Integração com Vimeo</CardTitle>
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
                        <span>Token de Acesso</span>
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
                        <Input
                          type={showToken ? "text" : "password"}
                          placeholder="Token de acesso do Vimeo"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Token de acesso à API do Vimeo. 
                        <a 
                          href="https://developer.vimeo.com/apps" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 ml-1 hover:underline"
                        >
                          Obter token
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
                    <AlertTitle className="text-red-800">Erro de conexão</AlertTitle>
                    <AlertDescription className="text-red-700">
                      {connectionMessage}
                    </AlertDescription>
                  </Alert>
                )}
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
      </div>
    </Layout>
  );
};

export default VimeoSettings;
