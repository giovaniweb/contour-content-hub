
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const InstagramCallback: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        // Send error to parent window
        window.opener?.postMessage({
          type: 'INSTAGRAM_AUTH_ERROR',
          error: error
        }, window.location.origin);
        window.close();
        return;
      }

      if (code) {
        try {
          // Exchange code for token
          const { data, error } = await supabase.functions.invoke('instagram-oauth', {
            body: { 
              action: 'exchange_code',
              code: code 
            }
          });

          if (error) throw error;

          if (data.success) {
            // Send success to parent window
            window.opener?.postMessage({
              type: 'INSTAGRAM_AUTH_SUCCESS',
              user: data.user
            }, window.location.origin);
          } else {
            throw new Error(data.error || 'Failed to complete authentication');
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          window.opener?.postMessage({
            type: 'INSTAGRAM_AUTH_ERROR',
            error: error.message
          }, window.location.origin);
        }
      }

      window.close();
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <LoadingSpinner />
      <p className="mt-4 text-foreground/60">Finalizando conexão com Instagram...</p>
    </div>
  );
};

export default InstagramCallback;
