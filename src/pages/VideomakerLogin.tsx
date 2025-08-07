import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Video, Mail, Lock, UserCheck } from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';

const VideomakerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        toast.error('Por favor, preencha todos os campos');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos');
        } else {
          toast.error('Erro ao fazer login: ' + error.message);
        }
        return;
      }

      if (data.user) {
        // Verificar se o usuário tem perfil de videomaker
        const { data: videomaker, error: videomakeError } = await supabase
          .from('videomakers')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (videomakeError) {
          toast.error('Perfil de videomaker não encontrado');
          await supabase.auth.signOut();
          return;
        }

        toast.success('Login realizado com sucesso!');
        navigate('/videomaker/dashboard');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro inesperado ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const statusBadges = [
    {
      icon: UserCheck,
      label: 'Login',
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Video}
        title="Login Videomaker"
        subtitle="Acesse sua conta para gerenciar seu perfil profissional"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6 py-8">
        <Card className="aurora-glass border-aurora-electric-purple/30 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="aurora-heading text-center">Acesse sua Conta</CardTitle>
            <CardDescription className="aurora-body text-center">
              Entre com suas credenciais para gerenciar seu perfil
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full aurora-button-enhanced"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
              
              <div className="text-center pt-4 space-y-2">
                <p className="aurora-body text-sm text-muted-foreground">
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/videomaker/cadastro')}
                    className="text-aurora-electric-purple hover:underline font-medium"
                  >
                    Cadastre-se aqui
                  </button>
                </p>
                
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Voltar ao início
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuroraPageLayout>
  );
};

export default VideomakerLogin;