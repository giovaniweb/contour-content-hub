
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import { Loader, LogOut, Link, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VimeoConnectButtonProps {
  onSuccess?: () => void;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'action';
}

export default function VimeoConnectButton({ 
  onSuccess, 
  className, 
  variant = 'default' 
}: VimeoConnectButtonProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [statusChecked, setStatusChecked] = useState(false);
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null);
  const [isServerConfigured, setIsServerConfigured] = useState<boolean | null>(null);

  // Check Vimeo API and server configuration on component mount
  useEffect(() => {
    checkVimeoStatus();
  }, []);

  // Reset connection error when component remounts
  useEffect(() => {
    setConnectionError(null);
  }, []);

  const checkVimeoStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('vimeo-status-check');
      
      if (error) {
        console.error("Erro ao verificar status do Vimeo:", error);
        setIsApiAvailable(false);
        setIsServerConfigured(false);
      } else {
        setIsApiAvailable(data.api_available);
        setIsServerConfigured(data.config_complete);
      }
    } catch (error) {
      console.error("Erro ao verificar status do Vimeo:", error);
      setIsApiAvailable(false);
      setIsServerConfigured(false);
    } finally {
      setStatusChecked(true);
    }
  };

  const handleConnect = async () => {
    if (!user) {
      toast({
        title: "Usuário não autenticado",
        description: "Você precisa estar logado para conectar sua conta Vimeo.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setConnectionError(null);
    
    try {
      // Check Vimeo API status first
      const { data: statusData, error: statusError } = await supabase.functions.invoke('vimeo-status-check');
      
      if (statusError) {
        throw new Error("Não foi possível verificar o status do Vimeo");
      }
      
      if (!statusData.api_available) {
        throw new Error("A API do Vimeo está inacessível no momento. Tente novamente mais tarde.");
      }
      
      if (!statusData.config_complete) {
        throw new Error("A configuração do servidor Vimeo está incompleta. Entre em contato com o administrador do sistema.");
      }
      
      // If Vimeo API is available and server is configured, proceed with OAuth
      const { data, error } = await supabase.functions.invoke('vimeo-oauth-start', {
        body: { user_id: user.id }
      });

      if (error) {
        console.error("Erro na função Edge:", error);
        let errorMessage = "Falha ao iniciar processo de autenticação.";
        
        // Tentar identificar a causa do erro para mensagens mais específicas
        if (error.message?.includes("not found") || error.message?.includes("404")) {
          errorMessage = "Função não encontrada. Verifique se a função foi implantada corretamente.";
        } else if (error.message?.includes("não encontrado nas variáveis")) {
          errorMessage = "Configuração do Vimeo incompleta. API_KEY não configurada no servidor.";
        } else if (error.message?.includes("fetch failed") || error.message?.includes("ECONNREFUSED")) {
          errorMessage = "Não foi possível se conectar à API do Vimeo. Verifique sua conexão de internet ou se o serviço está disponível.";
        }
        
        setConnectionError(errorMessage);
        throw new Error(errorMessage);
      }

      if (!data || !data.auth_url) {
        const errorMessage = 'URL de autorização não retornada pelo servidor.';
        setConnectionError(errorMessage);
        throw new Error(errorMessage);
      }

      console.log("URL de autorização gerada:", data.auth_url);
      
      // Redirect to Vimeo for authorization
      window.location.href = data.auth_url;
    } catch (error) {
      console.error("Erro ao conectar com Vimeo:", error);
      toast({
        title: "Erro de conexão",
        description: error.message || "Não foi possível iniciar a conexão com o Vimeo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show different error states
  const getErrorMessage = () => {
    if (!statusChecked) return null;
    
    if (!isApiAvailable) {
      return "A API do Vimeo está inacessível no momento. Isso pode ser devido a problemas de rede ou restrições de firewall.";
    }
    
    if (!isServerConfigured) {
      return "As variáveis de ambiente do Vimeo não estão configuradas corretamente no servidor.";
    }
    
    return connectionError;
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="space-y-3">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
            <p className="text-xs mt-1">
              {!isServerConfigured 
                ? "Peça ao administrador para verificar as variáveis de ambiente no Supabase." 
                : "Verifique se o Vimeo está disponível ou se há algum problema de rede."}
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      <Button
        onClick={handleConnect}
        disabled={isLoading || (!isApiAvailable || !isServerConfigured)}
        variant={variant}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Conectando...
          </>
        ) : (
          <>
            <Link className="mr-2 h-4 w-4" />
            Conectar com Vimeo
          </>
        )}
      </Button>
    </div>
  );
}
