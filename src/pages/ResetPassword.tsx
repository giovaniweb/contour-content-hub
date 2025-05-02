
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, ArrowLeft, Shield } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { Progress } from "@/components/ui/progress";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(3);
  
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

  // Countdown effect after successful password reset
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      navigate("/");
    }
  }, [isSuccess, countdown, navigate]);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains number
    if (/\d/.test(password)) strength += 25;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    
    // Contains uppercase or special char
    if (/[A-Z]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-destructive";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (passwordStrength < 50) {
      setError("Escolha uma senha mais forte combinando letras, números e caracteres especiais.");
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
              <div className="flex justify-center mb-2">
                <div className="bg-blue-50 p-2 rounded-full">
                  <Shield className="h-6 w-6 text-contourline-mediumBlue" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Criar nova senha</CardTitle>
              <CardDescription className="text-center">
                Digite e confirme sua nova senha
              </CardDescription>
            </CardHeader>
            {isSuccess ? (
              <CardContent className="space-y-4 pt-4">
                <div className="bg-green-50 p-6 rounded-md flex flex-col items-center space-y-4 text-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-green-800 text-lg">Senha atualizada com sucesso</h3>
                  <p className="text-green-700">
                    Sua senha foi atualizada. Redirecionando para a página de login em {countdown} segundos...
                  </p>
                  <Button 
                    onClick={() => navigate("/")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Ir para login agora
                  </Button>
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
                          className="border-2"
                          required
                        />
                        {password && (
                          <div className="space-y-1">
                            <Progress value={passwordStrength} className={`h-2 ${getStrengthColor()}`} />
                            <p className="text-xs text-muted-foreground">
                              {passwordStrength <= 25 && "Senha fraca"}
                              {passwordStrength > 25 && passwordStrength <= 50 && "Senha razoável"}
                              {passwordStrength > 50 && passwordStrength <= 75 && "Senha boa"}
                              {passwordStrength > 75 && "Senha forte"}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Use pelo menos 8 caracteres com letras, números e símbolos.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`border-2 ${
                            confirmPassword && password !== confirmPassword ? "border-red-500" : ""
                          }`}
                          required
                        />
                        {confirmPassword && password !== confirmPassword && (
                          <p className="text-xs text-red-500">
                            As senhas não coincidem
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-contourline-mediumBlue hover:bg-contourline-darkBlue"
                    disabled={isLoading || !hasToken || (password !== confirmPassword) || passwordStrength < 50}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                        Atualizando...
                      </span>
                    ) : "Atualizar senha"}
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

export default ResetPassword;
