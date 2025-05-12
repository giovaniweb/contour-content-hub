
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/routes';

const VimeoCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      toast({
        title: 'Erro de autenticação',
        description: 'Ocorreu um erro ao autenticar com o Vimeo.',
        variant: 'destructive'
      });
      setProcessing(false);
      navigate(ROUTES.ADMIN.ROOT);
      return;
    }

    // Handle successful authorization
    if (code && state) {
      // In a real app, you'd process the authorization code
      // and exchange it for access tokens
      
      // Simulate API call
      setTimeout(() => {
        toast({
          title: 'Autenticação realizada',
          description: 'Conta do Vimeo conectada com sucesso.'
        });
        setProcessing(false);
        navigate(ROUTES.ADMIN.VIMEO.SETTINGS);
      }, 1500);
    } else {
      toast({
        title: 'Parâmetros inválidos',
        description: 'Parâmetros de autenticação inválidos ou ausentes.',
        variant: 'destructive'
      });
      setProcessing(false);
      navigate(ROUTES.ADMIN.ROOT);
    }
  }, [searchParams, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <h2 className="text-xl font-semibold mt-4">Processando autenticação do Vimeo</h2>
            <p className="text-muted-foreground mt-2">Por favor aguarde...</p>
          </>
        ) : (
          <div>
            <h2 className="text-xl font-semibold">Redirecionando...</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default VimeoCallback;
