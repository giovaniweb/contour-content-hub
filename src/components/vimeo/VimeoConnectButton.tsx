
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import { Loader, LogOut, Link } from "lucide-react";

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
    try {
      // Call our edge function to start the OAuth process
      const { data, error } = await supabase.functions.invoke('vimeo-oauth-start', {
        body: { user_id: user.id }
      });

      if (error) {
        throw new Error(error.message || 'Falha ao iniciar processo de autenticação.');
      }

      if (!data.auth_url) {
        throw new Error('URL de autorização não retornada pelo servidor.');
      }

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
  );
}
