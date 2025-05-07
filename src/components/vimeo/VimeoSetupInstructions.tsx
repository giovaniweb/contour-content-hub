
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from "lucide-react";

const VimeoSetupInstructions = () => {
  const [activeTab, setActiveTab] = useState<string>("automatic");
  
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
