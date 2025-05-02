
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo(a) de volta ao ReelLine",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro de login:", error);
      const errorMessage = error.message || "Falha ao realizar login. Verifique suas credenciais.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: errorMessage,
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
          <Link to="/register">
            <Button variant="outline">Criar conta</Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-2">
                <div className="h-12 w-12 rounded-full bg-contourline-lightBlue/20 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-contourline-mediumBlue/50"></div>
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Bem-vindo ao ReelLine</CardTitle>
              <CardDescription className="text-center">
                Faça login para acessar seu estúdio criativo
              </CardDescription>
            </CardHeader>
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link to="/forgot-password" className="text-sm text-contourline-mediumBlue hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
                <p className="text-center text-sm text-gray-500">
                  Não tem uma conta?{" "}
                  <Link to="/register" className="text-contourline-mediumBlue font-medium hover:underline">
                    Registre-se
                  </Link>
                </p>
              </CardFooter>
            </form>
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

export default Login;
