
import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";

export default function VimeoCallback() {
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Parse the URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || 'Autorização negada ou cancelada');
        }

        if (!code) {
          throw new Error('Código de autorização não encontrado na URL');
        }

        console.log("Processando callback com código:", code);

        // Call our edge function to exchange the code for tokens
        const { data, error: functionError } = await supabase.functions.invoke('vimeo-oauth-callback', {
          body: { code, state }
        });

        if (functionError) {
          throw new Error(functionError.message || 'Erro ao processar autenticação');
        }

        if (!data.success) {
          throw new Error(data.error || 'Falha na autenticação com Vimeo');
        }

        setSuccess(true);
        toast({
          title: "Conta Vimeo conectada",
          description: "Sua conta Vimeo foi conectada com sucesso!"
        });

        // Start countdown for auto-redirect
        let count = 5;
        const interval = setInterval(() => {
          count -= 1;
          setCountdown(count);
          if (count <= 0) {
            clearInterval(interval);
          }
        }, 1000);

      } catch (err) {
        console.error("Erro no processamento do callback Vimeo:", err);
        setError(err.message || 'Erro desconhecido no processamento da autenticação');
        toast({
          title: "Erro na conexão",
          description: err.message || "Não foi possível conectar sua conta Vimeo",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    if (location.search) {
      processCallback();
    } else {
      setError('Nenhum parâmetro de autorização encontrado na URL');
      setIsProcessing(false);
    }
  }, [location.search]);

  // Auto-redirect after successful authentication
  if (success && countdown <= 0) {
    return <Navigate to="/admin/vimeo-settings" replace />;
  }

  return (
    <Layout title="Autenticação Vimeo">
      <div className="container max-w-md py-10">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-center">
              {isProcessing ? "Processando Autenticação" : 
               success ? "Autenticação Concluída" : "Falha na Autenticação"}
            </CardTitle>
            <CardDescription className="text-center">
              {isProcessing ? "Aguarde enquanto processamos sua autenticação com o Vimeo..." : 
               success ? "Sua conta Vimeo foi conectada com sucesso" : "Ocorreu um erro ao conectar sua conta Vimeo"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center">
                <Loader className="h-16 w-16 animate-spin text-blue-500 mb-4" />
                <p className="text-center text-muted-foreground">
                  Por favor, aguarde enquanto verificamos suas credenciais...
                </p>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <p className="mb-2 font-medium">Conexão estabelecida!</p>
                <p className="text-muted-foreground mb-4">
                  Sua conta Vimeo foi conectada com sucesso ao sistema.
                </p>
                <p className="text-sm">
                  Redirecionando em <span className="font-bold">{countdown}</span> segundos...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <p className="mb-2 font-medium">Erro na autenticação</p>
                <p className="text-muted-foreground">
                  {error || "Não foi possível conectar sua conta Vimeo."}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => window.location.href = '/admin/vimeo-settings'}
              variant="outline"
              disabled={isProcessing}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para configurações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
