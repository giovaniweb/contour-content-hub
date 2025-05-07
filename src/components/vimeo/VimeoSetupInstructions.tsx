import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, AlertCircle, Terminal, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const VimeoSetupInstructions = () => {
  const [activeTab, setActiveTab] = useState<string>("automatic");
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugResult, setDebugResult] = useState<any>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  const runEnvDiagnostic = async () => {
    try {
      setIsDebugging(true);
      setDebugResult(null);
      
      // Executar a função de diagnóstico de ambiente
      const { data, error } = await supabase.functions.invoke('vimeo-env-debug');
      
      if (error) {
        throw error;
      }
      
      setDebugResult(data);
      setShowDebugInfo(true);
    } catch (error) {
      setDebugResult({
        erro: error.message,
        status: "falha"
      });
      setShowDebugInfo(true);
    } finally {
      setIsDebugging(false);
    }
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg">Configuração do Vimeo</CardTitle>
        <CardDescription>
          Instruções para configurar a integração com o Vimeo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="automatic">Configuração Automática</TabsTrigger>
            <TabsTrigger value="manual">Configuração Manual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="automatic" className="space-y-4">
            <Alert>
              <Code className="h-4 w-4" />
              <AlertTitle>Script de Configuração</AlertTitle>
              <AlertDescription>
                Use nosso script para configurar as credenciais do Vimeo de forma segura e rápida.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="bg-slate-100 p-4 rounded-md">
                <h3 className="text-sm font-bold mb-2">1. Crie o arquivo setup-vimeo.sh</h3>
                <div className="bg-slate-900 text-slate-50 p-3 rounded text-xs overflow-auto">
                  <pre>nano scripts/setup-vimeo.sh</pre>
                </div>
              </div>
              
              <div className="bg-slate-100 p-4 rounded-md">
                <h3 className="text-sm font-bold mb-2">2. Torne o script executável</h3>
                <div className="bg-slate-900 text-slate-50 p-3 rounded text-xs overflow-auto">
                  <pre>chmod +x scripts/setup-vimeo.sh</pre>
                </div>
              </div>
              
              <div className="bg-slate-100 p-4 rounded-md">
                <h3 className="text-sm font-bold mb-2">3. Execute o script</h3>
                <div className="bg-slate-900 text-slate-50 p-3 rounded text-xs overflow-auto">
                  <pre>./scripts/setup-vimeo.sh</pre>
                </div>
                <p className="text-xs mt-2 text-slate-600">
                  O script solicitará seu Client ID, Client Secret e URI de redirecionamento de forma segura.
                </p>
              </div>
              
              <div className="bg-slate-100 p-4 rounded-md">
                <h3 className="text-sm font-bold mb-2">4. Volte ao painel</h3>
                <p className="text-xs text-slate-600">
                  Após a execução do script, clique em "Verificar novamente" no painel para confirmar a configuração.
                </p>
              </div>
            </div>

            {/* Seção de Diagnóstico de Ambiente */}
            <div className="border rounded-md p-4 mt-6">
              <h3 className="text-md font-bold mb-2 flex items-center">
                <Terminal className="h-4 w-4 mr-2" />
                Ferramenta de Diagnóstico
              </h3>
              
              <p className="text-sm text-slate-600 mb-3">
                Se você já executou o script, mas ainda enfrenta problemas, use esta ferramenta para diagnosticar o estado das variáveis de ambiente.
              </p>
              
              <Button 
                onClick={runEnvDiagnostic} 
                disabled={isDebugging} 
                variant="outline" 
                className="mb-3"
              >
                {isDebugging ? "Executando diagnóstico..." : "Executar diagnóstico"}
              </Button>
              
              {showDebugInfo && debugResult && (
                <div className="mt-3">
                  {debugResult.status === "completo" ? (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-700">Configuração correta</AlertTitle>
                      <AlertDescription className="text-green-600">
                        Todas as variáveis de ambiente do Vimeo estão configuradas corretamente.
                        {debugResult.recomendacao && (
                          <p className="mt-1 text-xs">{debugResult.recomendacao}</p>
                        )}
                      </AlertDescription>
                    </Alert>
                  ) : debugResult.erro ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro ao executar diagnóstico</AlertTitle>
                      <AlertDescription>
                        {debugResult.erro}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Configuração incompleta</AlertTitle>
                      <AlertDescription className="space-y-2">
                        <p>As seguintes variáveis não estão configuradas corretamente:</p>
                        <ul className="list-disc list-inside text-sm">
                          {!debugResult.variaveis_vimeo?.VIMEO_CLIENT_ID?.configurado && (
                            <li>VIMEO_CLIENT_ID</li>
                          )}
                          {!debugResult.variaveis_vimeo?.VIMEO_CLIENT_SECRET?.configurado && (
                            <li>VIMEO_CLIENT_SECRET</li>
                          )}
                          {!debugResult.variaveis_vimeo?.VIMEO_REDIRECT_URI?.configurado && (
                            <li>VIMEO_REDIRECT_URI</li>
                          )}
                        </ul>
                        
                        {debugResult.recomendacao && (
                          <div className="mt-2 p-2 bg-red-50 rounded text-xs">
                            <p className="font-semibold">Recomendação:</p>
                            <p>{debugResult.recomendacao}</p>
                          </div>
                        )}
                        
                        <div className="mt-3 p-3 bg-slate-100 rounded-md text-xs">
                          <p className="font-semibold">Configuração manual alternativa:</p>
                          <div className="mt-1 bg-slate-900 text-slate-50 p-2 rounded">
                            <pre className="whitespace-pre-wrap">
                              {`supabase functions secrets set VIMEO_CLIENT_ID=seu_client_id
supabase functions secrets set VIMEO_CLIENT_SECRET=seu_client_secret
supabase functions secrets set VIMEO_REDIRECT_URI=https://fluida.online/auth/vimeo/callback

# Depois redeploy das funções
supabase functions deploy vimeo-oauth-start
supabase functions deploy vimeo-oauth-callback
supabase functions deploy vimeo-status-check
supabase functions deploy vimeo-direct-test
supabase functions deploy vimeo-test-connection`}
                            </pre>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Detalhes técnicos colapsáveis */}
                  <div className="mt-3">
                    <Button 
                      variant="ghost" 
                      className="text-xs" 
                      onClick={() => setShowDebugInfo(!showDebugInfo)}
                    >
                      {showDebugInfo ? "Ocultar detalhes técnicos" : "Mostrar detalhes técnicos"}
                    </Button>
                    
                    {showDebugInfo && (
                      <div className="mt-2 bg-slate-100 p-3 rounded-md text-xs overflow-auto max-h-60">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(debugResult, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <Alert>
              <Code className="h-4 w-4" />
              <AlertTitle>Configuração Manual</AlertTitle>
              <AlertDescription>
                Execute os comandos abaixo para configurar manualmente a integração.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="bg-slate-100 p-4 rounded-md">
                <h3 className="text-sm font-bold mb-2">1. Configure os secrets</h3>
                <div className="bg-slate-900 text-slate-50 p-3 rounded text-xs overflow-auto">
                  <pre>{`supabase functions secrets set VIMEO_CLIENT_ID=seu_client_id
supabase functions secrets set VIMEO_CLIENT_SECRET=seu_client_secret
supabase functions secrets set VIMEO_REDIRECT_URI=https://fluida.online/auth/vimeo/callback`}</pre>
                </div>
              </div>
              
              <div className="bg-slate-100 p-4 rounded-md">
                <h3 className="text-sm font-bold mb-2">2. Deploy das funções</h3>
                <div className="bg-slate-900 text-slate-50 p-3 rounded text-xs overflow-auto">
                  <pre>{`supabase functions deploy vimeo-oauth-start
supabase functions deploy vimeo-oauth-callback
supabase functions deploy vimeo-status-check
supabase functions deploy vimeo-direct-test
supabase functions deploy vimeo-test-connection`}</pre>
                </div>
              </div>
              
              <div className="bg-slate-100 p-4 rounded-md">
                <h3 className="text-sm font-bold mb-2">3. Verificação</h3>
                <p className="text-xs text-slate-600">
                  Após executar os comandos, clique em "Verificar novamente" no painel.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Voltar
        </Button>
        <a href="https://developer.vimeo.com/apps" target="_blank" rel="noopener noreferrer">
          <Button variant="outline">
            Portal de Desenvolvedores Vimeo
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

export default VimeoSetupInstructions;
