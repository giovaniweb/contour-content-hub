
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, ArrowLeft, Mail, KeyRound } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um endereço de email válido.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
    } catch (error: any) {
      console.error("Erro ao enviar email de recuperação:", error);
      
      // Mensagem de erro mais amigável
      if (error.message?.includes("rate limit")) {
        setError("Muitas tentativas. Por favor, aguarde alguns minutos antes de tentar novamente.");
      } else {
        setError("Não foi possível enviar o email de recuperação. Verifique se o email está correto.");
      }
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar o email de recuperação.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 border-b bg-white">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold text-contourline-mediumBlue">ReelLine</h1>
          <Link to="/">
            <Button variant="outline">Voltar ao login</Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <div className="bg-blue-50 p-2 rounded-full">
                  <KeyRound className="h-6 w-6 text-contourline-mediumBlue" />
                </div>
              </div>
              <CardTitle className="text-2xl">Recuperar senha</CardTitle>
              <CardDescription>
                Digite seu email e enviaremos instruções para recuperar sua senha
              </CardDescription>
            </CardHeader>
            {isSubmitted ? (
              <CardContent className="space-y-4 pt-4">
                <div className="bg-green-50 p-4 rounded-md flex flex-col items-center space-y-4 text-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-green-800 text-lg">Email enviado</h3>
                  <p className="text-green-700">
                    Enviamos instruções de recuperação de senha para <strong>{email}</strong>. 
                    Verifique sua caixa de entrada e siga as instruções.
                  </p>
                  <div className="bg-white border border-green-100 rounded-md p-3 w-full text-left">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Não recebeu o email?</span>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Verifique sua pasta de spam</li>
                        <li>Aguarde alguns minutos</li>
                        <li>Certifique-se que o email digitado está correto</li>
                      </ul>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Tentar com outro email
                  </Button>
                  <Link to="/" className="w-full">
                    <Button variant="ghost" className="w-full text-gray-500">
                      Voltar para login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-contourline-mediumBlue hover:bg-contourline-darkBlue"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                        Enviando...
                      </span>
                    ) : "Enviar instruções"}
                  </Button>
                  <Link 
                    to="/" 
                    className="flex items-center justify-center text-sm text-gray-500 hover:text-contourline-mediumBlue"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para login
                  </Link>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </main>

      <footer className="py-6 border-t bg-white text-center text-sm text-gray-500">
        <div className="container">
          <p>© {new Date().getFullYear()} ReelLine | Seu estúdio criativo, em um clique.</p>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword;
