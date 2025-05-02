
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
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
      setError(error.message || "Não foi possível enviar o email de recuperação.");
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
              <CardTitle className="text-2xl">Recuperar senha</CardTitle>
              <CardDescription>
                Digite seu email e enviaremos instruções para recuperar sua senha
              </CardDescription>
            </CardHeader>
            {isSubmitted ? (
              <CardContent className="space-y-4 pt-4">
                <div className="bg-green-50 p-4 rounded-md flex flex-col items-center space-y-2 text-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-green-800">Email enviado</h3>
                  <p className="text-green-700 text-sm">
                    Verifique sua caixa de entrada e siga as instruções para recuperar sua senha.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsSubmitted(false)}
                >
                  Tentar com outro email
                </Button>
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
                    {isLoading ? "Enviando..." : "Enviar instruções"}
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
