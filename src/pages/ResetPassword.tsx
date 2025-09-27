import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  // Get token from URL parameters
  const token = searchParams.get('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setIsCheckingToken(false);
        return;
      }

      try {
        console.log('🔍 Validating recovery token...');
        
        // Validate token using edge function
        const { data, error } = await supabase.functions.invoke('process-password-reset', {
          body: { token, validateOnly: true }
        });

        if (error || !data?.valid) {
          console.error('❌ Token validation failed:', error || 'Invalid token');
          setIsValidToken(false);
          setIsCheckingToken(false);
          return;
        }

        // Token is valid
        console.log('✅ Token is valid');
        setUserEmail(data.email);
        setIsValidToken(true);
        setIsCheckingToken(false);
      } catch (error) {
        console.error('❌ Error validating token:', error);
        setIsValidToken(false);
        setIsCheckingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔄 Processing password reset...');

      // Call custom edge function to handle password reset
      const { data, error } = await supabase.functions.invoke('process-password-reset', {
        body: {
          token: token,
          newPassword: password
        }
      });

      if (error) {
        console.error('❌ Password reset error:', error);
        if (error.message?.includes('Token expired')) {
          toast.error('Link expirado. Solicite um novo link de recuperação.');
          navigate('/forgot-password');
        } else if (error.message?.includes('Token already used')) {
          toast.error('Link já utilizado. Solicite um novo link se necessário.');
          navigate('/login');
        } else {
          toast.error('Erro ao redefinir senha. Tente novamente.');
        }
        return;
      }

      if (data?.success) {
        console.log('✅ Password reset successful');
        toast.success('Senha redefinida com sucesso! Você será redirecionado para o login.');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(data?.error || 'Erro ao redefinir senha');
      }
    } catch (error: any) {
      console.error('❌ Error resetting password:', error);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking token
  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Link Inválido</CardTitle>
            <CardDescription>
              O link de recuperação é inválido ou expirou.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <Button 
                onClick={() => navigate('/forgot-password')}
                className="w-full"
              >
                Solicitar Novo Link
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
          <CardDescription>
            Digite sua nova senha para a conta: <strong>{userEmail}</strong>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" 
              disabled={isLoading}
            >
              {isLoading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </CardContent>
        </form>
        
        <div className="text-center p-6 text-sm text-muted-foreground">
          <p>Após alterar sua senha, você será redirecionado para o login.</p>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;