
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import AuroraCommandPalette from "@/components/AuroraCommandPalette";

const Index: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated and on index page
  React.useEffect(() => {
    if (isAuthenticated && location.pathname === '/index') {
      navigate("/dashboard");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Login realizado com sucesso');
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast.error('Erro ao fazer login: ' + (error.message || 'Verifique suas credenciais'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommandSubmit = (command: string) => {
    navigate("/dashboard", { state: { query: command } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 border-b bg-white">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold text-reelline-primary">Fluida</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/register")}>
              Criar conta
            </Button>
            <Button onClick={() => navigate("/login")}>
              Entrar
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full max-w-3xl mb-8">
          <AuroraCommandPalette
            onSubmit={handleCommandSubmit}
            placeholder="Experimente nossa IA assistente..."
            suggestions={[
              "O que posso fazer aqui?",
              "Como criar um roteiro para video?",
              "Ideias para conteúdo de Instagram",
              "Estratégias para mídias sociais",
              "Sugestões de conteúdo para clínica estética"
            ]}
          />
        </div>
        
        <div className="container max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Entrar</CardTitle>
              <CardDescription>
                Entre com seu email e senha para acessar sua conta
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link to="/forgot-password" className="text-sm text-reelline-primary hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  className="w-full" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Não tem uma conta?{" "}
                  <Link to="/register" className="text-reelline-primary hover:underline">
                    Criar conta
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>

      <footer className="py-6 border-t bg-white text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© {new Date().getFullYear()} Fluida | Seu estúdio criativo em um clique.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
