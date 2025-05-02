
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    // Verificar se há token na URL (Supabase adiciona como #access_token=...)
    setHasToken(hash && hash.includes('access_token='));
    
    if (!hash || !hash.includes('access_token=')) {
      setError("Link inválido ou expirado. Solicite um novo link de recuperação de senha.");
      toast({
        variant: "destructive",
        title: "Link inválido",
        description: "O link de recuperação é inválido ou expirou.",
      });
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });

      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      setError(error.message || "Não foi possível redefinir sua senha.");
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível redefinir sua senha.",
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
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Criar nova senha</CardTitle>
              <CardDescription>
                Digite e confirme sua nova senha
              </CardDescription>
            </CardHeader>
            {isSuccess ? (
              <CardContent className="space-y-4 pt-4">
                <div className="bg-green-50 p-6 rounded-md flex flex-col items-center space-y-2 text-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-green-800">Senha atualizada com sucesso</h3>
                  <p className="text-green-700 text-sm">
                    Sua senha foi atualizada. Você será redirecionado para a página de login.
                  </p>
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
                  {!hasToken ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Link inválido ou expirado. <Link to="/forgot-password" className="font-medium underline">Solicite um novo link</Link>.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="password">Nova senha</Label>
                        <Input 
                          id="password" 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-contourline-mediumBlue hover:bg-contourline-darkBlue"
                    disabled={isLoading || !hasToken}
                  >
                    {isLoading ? "Atualizando..." : "Atualizar senha"}
                  </Button>
                  <Link 
                    to="/" 
                    className="text-sm text-center text-gray-500 hover:text-contourline-mediumBlue"
                  >
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

export default ResetPassword;
