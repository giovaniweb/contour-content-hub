
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Handle initial load and authentication state
  useEffect(() => {
    console.log('Login: Auth state check - isAuthenticated:', isAuthenticated, 'authLoading:', authLoading);
    
    // Mark initial load as complete after a short delay or when auth loading finishes
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 1000);

    if (!authLoading) {
      setInitialLoadComplete(true);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [authLoading]);

  // Redirect if authenticated after initial load is complete
  useEffect(() => {
    if (initialLoadComplete && isAuthenticated && !authLoading) {
      console.log('Login: User is authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, initialLoadComplete, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login: Form submitted with email:', formData.email);
    
    if (!formData.email || !formData.password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Login: Attempting login...');
      await login(formData.email, formData.password);
      console.log('Login: Login successful');
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      console.error('Login: Login failed:', error);
      const errorMessage = error.message || 'Erro ao fazer login';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Show loading screen only during initial auth check
  if (!initialLoadComplete) {
    console.log('Login: Initial loading, showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, show a brief loading message
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Digite seu email"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Digite sua senha"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <Link to="/reset-password" className="text-sm text-primary hover:underline">
              Esqueceu sua senha?
            </Link>
            <div>
              <span className="text-sm text-muted-foreground">Não tem uma conta? </span>
              <Link to="/register" className="text-sm text-primary hover:underline">
                Registre-se
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
