
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // Redirect if already authenticated and on login page
  React.useEffect(() => {
    if (isAuthenticated && location.pathname === '/login') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const getErrorMessage = (error: any) => {
    if (error?.message) {
      switch (error.message) {
        case 'Invalid login credentials':
          return 'Email ou senha incorretos. Verifique seus dados e tente novamente.';
        case 'Email not confirmed':
          return 'Email não confirmado. Verifique sua caixa de entrada e confirme seu email.';
        case 'Too many requests':
          return 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.';
        case 'User not found':
          return 'Usuário não encontrado. Verifique o email ou crie uma nova conta.';
        default:
          return `Erro ao fazer login: ${error.message}`;
      }
    }
    return 'Erro desconhecido ao fazer login. Tente novamente.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Login realizado com sucesso');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-light">Login</CardTitle>
          <CardDescription>Entre com sua conta para acessar o sistema</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" 
                required 
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">Senha</label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? "Autenticando..." : "Entrar"}
            </Button>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Registre-se
              </Link>
            </div>
            <div className="text-center text-xs text-gray-600 bg-yellow-50 p-2 rounded">
              💡 <strong>Dica:</strong> Se você não tem uma conta, clique em "Registre-se" para criar uma nova conta.
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
