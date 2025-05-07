
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Terminal, Link as LinkIcon, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VimeoSetupInstructions: React.FC = () => {
  const { toast } = useToast();

  const handleCopyCommand = () => {
    navigator.clipboard.writeText("bash scripts/setup-vimeo.sh");
    toast({
      title: "Comando copiado",
      description: "Execute no seu terminal para configurar o Vimeo"
    });
  };

  return (
    <div className="space-y-6 mb-8">
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-800 font-semibold text-lg">Configuração da Conexão OAuth do Vimeo</AlertTitle>
        <AlertDescription className="text-blue-700">
          <p className="mb-2">
            A integração com o Vimeo requer que você configure uma aplicação OAuth para obter as credenciais necessárias.
          </p>
        </AlertDescription>
      </Alert>

      <div className="space-y-4 p-4 border rounded-md">
        <h3 className="font-medium text-lg">Passo a Passo para Configuração</h3>
        
        <ol className="space-y-4 pl-5 list-decimal">
          <li>
            <p>Acesse o <a href="https://developer.vimeo.com/apps/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
              Portal de Desenvolvedores do Vimeo
              <LinkIcon className="h-3 w-3 ml-1 inline" />
            </a> e faça login na sua conta</p>
          </li>
          
          <li>
            <p>Crie uma nova aplicação com as seguintes configurações:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>App Name:</strong> Fluida (ou nome da sua escolha)
              </li>
              <li>
                <strong>App Description:</strong> Integração para gerenciamento de vídeos
              </li>
              <li>
                <strong>App URL:</strong> URL do seu site
              </li>
              <li>
                <strong>App Callback URLs:</strong> https://fluida.online/auth/vimeo/callback
              </li>
            </ul>
          </li>
          
          <li>
            <p>Na seção <strong>Authentication</strong>, selecione os seguintes escopos (permissões):</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-gray-50 p-2 text-sm rounded">✓ <strong>Public</strong></div>
              <div className="bg-gray-50 p-2 text-sm rounded">✓ <strong>Private</strong></div>
              <div className="bg-gray-50 p-2 text-sm rounded">✓ <strong>Edit</strong></div>
              <div className="bg-gray-50 p-2 text-sm rounded">✓ <strong>Upload</strong></div>
              <div className="bg-gray-50 p-2 text-sm rounded">✓ <strong>Video Files</strong></div>
              <div className="bg-gray-50 p-2 text-sm rounded">✓ <strong>Interact</strong></div>
            </div>
          </li>
          
          <li>
            <p>Após criar a aplicação, você terá acesso às credenciais necessárias:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Client ID</strong> (identificador público)</li>
              <li><strong>Client Secret</strong> (mantenha seguro!)</li>
              <li><strong>Redirect URI</strong> (URL de callback configurada)</li>
            </ul>
          </li>
          
          <Separator className="my-4" />
          
          <li>
            <div>
              <p className="font-medium mb-2">Configure as credenciais no servidor usando nosso script automatizado:</p>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                <h3 className="font-medium mb-2 flex items-center text-blue-800">
                  <Terminal className="h-4 w-4 mr-2" />
                  Configuração via Script
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Execute o script de configuração automatizada em seu terminal para configurar rapidamente o Vimeo.
                </p>
                <Button 
                  variant="outline" 
                  className="bg-white border-blue-300 hover:bg-blue-50"
                  onClick={handleCopyCommand}
                >
                  <Terminal className="mr-2 h-4 w-4" />
                  Copiar comando: bash scripts/setup-vimeo.sh
                </Button>
              </div>
            </div>
          </li>
        </ol>
      </div>
      
      <Alert variant="default" className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800">Importante</AlertTitle>
        <AlertDescription className="text-amber-700">
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>O script solicitará as três informações: Client ID, Client Secret e Redirect URI</li>
            <li>As credenciais serão armazenadas com segurança nas Supabase Edge Functions</li>
            <li>Após a configuração, a integração será ativada automaticamente</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default VimeoSetupInstructions;
