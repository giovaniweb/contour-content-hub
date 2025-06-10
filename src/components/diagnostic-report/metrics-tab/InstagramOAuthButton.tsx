
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface InstagramOAuthButtonProps {
  onSuccess?: () => void;
}

export const InstagramOAuthButton: React.FC<InstagramOAuthButtonProps> = ({ onSuccess }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Get auth URL from our edge function
      const { data, error } = await supabase.functions.invoke('instagram-oauth', {
        body: { action: 'get_auth_url' }
      });

      if (error) throw error;

      if (data.success) {
        // Open Instagram auth in popup
        const popup = window.open(
          data.auth_url,
          'instagram-auth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        // Listen for the popup to close or send message
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setIsConnecting(false);
          }
        }, 1000);

        // Listen for auth success message
        const messageListener = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'INSTAGRAM_AUTH_SUCCESS') {
            clearInterval(checkClosed);
            popup?.close();
            window.removeEventListener('message', messageListener);
            
            toast.success("Instagram conectado com sucesso!");
            onSuccess?.();
            setIsConnecting(false);
          } else if (event.data.type === 'INSTAGRAM_AUTH_ERROR') {
            clearInterval(checkClosed);
            popup?.close();
            window.removeEventListener('message', messageListener);
            
            toast.error("Erro ao conectar Instagram: " + event.data.error);
            setIsConnecting(false);
          }
        };

        window.addEventListener('message', messageListener);
      }
    } catch (error) {
      console.error('Error starting Instagram OAuth:', error);
      toast.error("Erro ao iniciar conexão com Instagram");
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
    >
      <Instagram className="h-4 w-4 mr-2" />
      {isConnecting ? 'Conectando...' : 'Conectar com Instagram'}
      <ExternalLink className="h-4 w-4 ml-2" />
    </Button>
  );
};
