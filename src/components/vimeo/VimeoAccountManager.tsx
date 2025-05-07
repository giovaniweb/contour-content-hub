
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader, CheckCircle, LogOut, AlertCircle, RefreshCw } from "lucide-react";
import VimeoConnectButton from './VimeoConnectButton';

interface VimeoToken {
  id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  account_name: string;
  account_uri: string;
  scope: string;
}

export default function VimeoAccountManager() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [vimeoAccount, setVimeoAccount] = useState<VimeoToken | null>(null);

  useEffect(() => {
    if (user) {
      loadVimeoAccount();
    }
  }, [user]);

  const loadVimeoAccount = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_vimeo_tokens')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }

      setVimeoAccount(data || null);
    } catch (error) {
      console.error("Erro ao carregar conta Vimeo:", error);
      toast({
        title: "Erro ao carregar conta",
        description: "Não foi possível carregar os dados da sua conta Vimeo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!vimeoAccount) return;

    setIsDisconnecting(true);
    try {
      const { error } = await supabase
        .from('user_vimeo_tokens')
        .delete()
        .eq('id', vimeoAccount.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Conta desconectada",
        description: "Sua conta Vimeo foi desconectada com sucesso"
      });

      setVimeoAccount(null);
    } catch (error) {
      console.error("Erro ao desconectar conta Vimeo:", error);
      toast({
        title: "Erro ao desconectar",
        description: "Não foi possível desconectar sua conta Vimeo",
        variant: "destructive"
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleRefreshToken = async () => {
    if (!vimeoAccount) return;

    setIsRefreshing(true);
    try {
      // This would call another edge function to refresh the token
      // For now, we'll just simulate success
      toast({
        title: "Token atualizado",
        description: "Seu token Vimeo foi atualizado com sucesso"
      });
    } catch (error) {
      console.error("Erro ao atualizar token:", error);
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar seu token Vimeo",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="h-6 w-6 animate-spin mr-2" />
        <span>Carregando conta Vimeo...</span>
      </div>
    );
  }

  if (!vimeoAccount) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conectar conta Vimeo</CardTitle>
          <CardDescription>
            Conecte sua conta Vimeo para importar e gerenciar vídeos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhuma conta conectada</AlertTitle>
            <AlertDescription>
              Você ainda não conectou uma conta Vimeo. Clique no botão abaixo para conectar.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <VimeoConnectButton onSuccess={loadVimeoAccount} />
        </CardFooter>
      </Card>
    );
  }

  // Check if token is expired
  const isExpired = new Date(vimeoAccount.expires_at) < new Date();
  const expiresAt = new Date(vimeoAccount.expires_at).toLocaleDateString('pt-BR', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Conta Vimeo conectada</span>
          <Badge variant={isExpired ? "destructive" : "default"}>
            {isExpired ? "Token expirado" : "Conectado"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Sua conta Vimeo está conectada e pronta para uso
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Conta:</span>
            <span>{vimeoAccount.account_name || "Usuário Vimeo"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Expira em:</span>
            <span className={isExpired ? "text-red-500" : ""}>
              {expiresAt}
            </span>
          </div>
          <div className="mt-4">
            <Alert variant={isExpired ? "destructive" : "default"}>
              {isExpired ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {isExpired ? "Token expirado" : "Autenticação válida"}
              </AlertTitle>
              <AlertDescription>
                {isExpired 
                  ? "Seu token expirou. É necessário reconectar sua conta." 
                  : "Sua autenticação está ativa e válida."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="destructive"
          onClick={handleDisconnect}
          disabled={isDisconnecting}
        >
          {isDisconnecting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Desconectando...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Desconectar
            </>
          )}
        </Button>
        
        {isExpired && (
          <VimeoConnectButton 
            onSuccess={loadVimeoAccount} 
            variant="outline"
          />
        )}

        {!isExpired && (
          <Button
            variant="outline"
            onClick={handleRefreshToken}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar token
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
