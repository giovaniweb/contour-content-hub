
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CornerDownLeft, Link, RefreshCw, AlertCircle, CheckCircle2, Video, Loader2 } from "lucide-react";
import { getVimeoConfig, saveVimeoConfig, testVimeoConnection } from '@/services/integrationService';

const VimeoSettings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [folderId, setFolderId] = useState<string>('');
  
  const [vimeoApiAvailable, setVimeoApiAvailable] = useState<boolean | null>(null);
  const [serverStatus, setServerStatus] = useState<'complete' | 'incomplete' | 'unknown'>('unknown');

  // Carregar configuração existente
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const config = await getVimeoConfig();
        if (config && config.folder_id) {
          setFolderId(config.folder_id);
        }
      } catch (error) {
        console.error('Erro ao carregar configuração do Vimeo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      if (!folderId) {
        toast({
          variant: "destructive",
          title: "ID de pasta necessário",
          description: "Por favor, insira o ID da pasta para testar a conexão."
        });
        return;
      }

      const result = await testVimeoConnection(folderId);
      
      console.log("Resultado do teste:", result);

      if (result.success) {
        setVimeoApiAvailable(true);
        setServerStatus('complete');
        
        toast({
          title: "Conexão bem-sucedida!",
          description: "A conexão com o Vimeo foi estabelecida com sucesso."
        });
      } else {
        // Analisar o tipo de erro
        if (result.error?.includes("API do Vimeo está inacessível")) {
          setVimeoApiAvailable(false);
          toast({
            variant: "destructive",
            title: "API do Vimeo inacessível",
            description: result.error
          });
        } else if (result.error?.includes("configuração do servidor")) {
          setServerStatus('incomplete');
          toast({
            variant: "destructive",
            title: "Configuração incompleta",
            description: result.error
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro na conexão",
            description: result.error || "Falha ao testar a conexão com o Vimeo."
          });
        }
      }
    } catch (error) {
      console.error("Erro no teste de conexão:", error);
      toast({
        variant: "destructive",
        title: "Erro na conexão",
        description: "Ocorreu um erro ao testar a conexão com o Vimeo."
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      await saveVimeoConfig({ folder_id: folderId });
      
      toast({
        title: "Configuração salva",
        description: "As configurações do Vimeo foram salvas com sucesso."
      });
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações do Vimeo."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isConfigured = serverStatus === 'complete' && vimeoApiAvailable;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Configuração do Vimeo</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5" />
              <CardTitle>Configuração Manual do Vimeo</CardTitle>
            </div>
            <CardDescription>
              Configure a pasta do Vimeo para importação de vídeos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Informação importante</AlertTitle>
              <AlertDescription>
                <p>Para integração completa com o Vimeo, é recomendável utilizar a autenticação OAuth disponível na aba "Conta Conectada".</p>
                <p className="text-sm mt-2">Esta configuração manual permite apenas especificar a pasta para importação de vídeos.</p>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="folder-id">ID da Pasta no Vimeo</Label>
                <Input
                  id="folder-id"
                  placeholder="Ex: 12345678"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  ID da pasta para importação de vídeos. Deixe em branco para listar todos os vídeos.
                </p>
              </div>
              
              {isConfigured === true && (
                <Alert variant="success" className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Configuração válida</AlertTitle>
                  <AlertDescription className="text-green-700">
                    A configuração do Vimeo está completa e a API está acessível.
                  </AlertDescription>
                </Alert>
              )}
              
              {vimeoApiAvailable === false && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>API do Vimeo inacessível</AlertTitle>
                  <AlertDescription>
                    Não foi possível acessar a API do Vimeo. Isso pode ser devido a problemas de rede ou restrições de firewall.
                  </AlertDescription>
                </Alert>
              )}
              
              {serverStatus === 'incomplete' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Configuração incompleta</AlertTitle>
                  <AlertDescription>
                    As variáveis de ambiente do servidor não estão configuradas corretamente para o Vimeo.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isTesting}
            >
              {isTesting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testando...</>
              ) : (
                <><RefreshCw className="mr-2 h-4 w-4" /> Testar Conexão</>
              )}
            </Button>
            
            <Button 
              onClick={handleSaveConfig}
              disabled={isSaving}
            >
              {isSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
              ) : (
                <>Salvar Configuração</>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="bg-muted p-4 rounded">
          <h3 className="font-medium mb-2">Como encontrar o ID da pasta no Vimeo</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Acesse sua conta do Vimeo e navegue até as pastas</li>
            <li>Selecione a pasta desejada</li>
            <li>Na URL do navegador, o número após "/folders/" é o ID da pasta</li>
            <li>Exemplo: <code className="bg-muted-foreground/20 px-1 py-0.5 rounded text-xs">https://vimeo.com/manage/folders/12345678</code> - o ID é 12345678</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default VimeoSettings;
