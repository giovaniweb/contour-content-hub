
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor, digite seu email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, digite um email válido");
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔄 Iniciando recuperação de senha para:', email);
      
      // Use custom edge function for better email delivery
      const { data, error } = await supabase.functions.invoke('send-password-recovery', {
        body: { 
          email,
          redirectTo: 'https://fluida.online/reset-password'
        }
      });

      console.log('📧 Resposta do envio:', { data, error });

      if (error) {
        console.error('❌ Password recovery error:', error);
        
        // Check for specific error types
        if (error.message?.includes('User not found')) {
          toast.error("Email não encontrado. Verifique se está correto ou registre-se primeiro.");
        } else if (error.message?.includes('SMTP') || error.message?.includes('Email sending failed')) {
          toast.error("Erro temporário no envio de email. Tente novamente em alguns minutos.");
        } else {
          toast.error("Erro ao enviar email de recuperação. Tente novamente.");
        }
      } else {
        console.log('✅ Email de recuperação enviado com sucesso');
        setIsSubmitted(true);
        toast.success(data?.message || "Email de recuperação enviado! Verifique sua caixa de entrada.");
      }
    } catch (error: any) {
      console.error('❌ Critical password recovery error:', error);
      toast.error("Erro inesperado. Tente novamente em alguns minutos.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Email Enviado!</CardTitle>
            <CardDescription>
              Se o email existir em nossa base de dados, você receberá instruções para redefinir sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Não esqueça de verificar sua pasta de spam. O email pode demorar alguns minutos para chegar.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsSubmitted(false)}
                className="w-full"
              >
                Tentar outro email
              </Button>
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  Voltar para o Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Esqueci Minha Senha</CardTitle>
          <CardDescription>
            Digite seu email para receber um link de recuperação de senha
            <br />
            <span className="text-sm text-muted-foreground mt-2 block">
              ⚠️ Certifique-se de usar exatamente o mesmo email do seu cadastro
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              Lembrou sua senha? Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
