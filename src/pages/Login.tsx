import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    
    // Verificar se existe email salvo no localStorage
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [isAuthenticated, navigate]);

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

    // Armazenar email no localStorage se "lembrar-me" estiver marcado
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    try {
      await login(email, password);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo(a) de volta ao Fluida",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro de login:", error);
      
      // Mensagens de erro mais amigáveis
      if (error.message?.includes("Invalid login")) {
        setError("Email ou senha incorretos. Verifique suas credenciais.");
      } else if (error.message?.includes("rate limit")) {
        setError("Muitas tentativas de login. Por favor, aguarde alguns minutos antes de tentar novamente.");
      } else {
        setError(error.message || "Falha ao realizar login. Verifique suas credenciais.");
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 border-b bg-white">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold text-contourline-mediumBlue">Fluida</h1>
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
              <CardTitle className="text-2xl text-center">Bem-vindo ao Fluida</CardTitle>
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
                    autoComplete="email"
                    className="border-gray-300"
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
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="border-gray-300 pr-10"
                      required
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-gray-300 text-contourline-mediumBlue focus:ring-contourline-mediumBlue h-4 w-4"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Lembrar meu email
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-contourline-mediumBlue hover:bg-contourline-darkBlue gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                      Entrando...
                    </span>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Entrar
                    </>
                  )}
                </Button>
                
                <div className="w-full flex items-center gap-3">
                  <Separator className="flex-grow" />
                  <span className="text-xs text-gray-500">ou</span>
                  <Separator className="flex-grow" />
                </div>

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

      <footer className="py-6 border-t bg-white text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© {new Date().getFullYear()} Fluida | Seu estúdio criativo, em um clique.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
