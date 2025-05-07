
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

  // Reset connection error when component remounts
  useEffect(() => {
    setConnectionError(null);
  }, []);

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
      // Call our edge function to start the OAuth process
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

  return (
    <div className="space-y-3">
      {connectionError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {connectionError}
            <p className="text-xs mt-1">
              Verifique se o Vimeo está disponível ou se as credenciais de API foram configuradas corretamente.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      <Button
        onClick={handleConnect}
        disabled={isLoading}
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
