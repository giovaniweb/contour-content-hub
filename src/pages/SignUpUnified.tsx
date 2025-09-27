import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UserRegistrationForm } from "@/components/forms/UserRegistrationForm";
import { ErrorBoundarySignUp } from "@/components/ErrorBoundarySignUp";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { toast } from "sonner";

const SignUpUnified: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (formData: any) => {
    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        nome: formData.nome,
        role: formData.role,
        clinica: formData.clinica,
        cidade: formData.cidade,
        telefone: formData.telefone,
        especialidade: formData.especialidade,
        experiencia: formData.experiencia,
        estado: formData.estado,
        endereco_completo: formData.endereco_completo,
        equipamentos: formData.equipamentos,
        observacoes_conteudo: formData.observacoes_conteudo,
        idioma: formData.idioma,
        foto_url: formData.foto_url
      });

      if (result?.error) {
        throw new Error(result.error.message);
      }

      // Clear any saved progress
      localStorage.removeItem('signupProgress');
      
      toast.success('Conta criada com sucesso!', {
        description: 'Verifique seu email para confirmar sua conta.'
      });

      // Redirect to login after success
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      throw new Error(error.message || 'Não foi possível criar sua conta. Tente novamente.');
    }
  };

  return (
    <ErrorBoundarySignUp>
      <div className="min-h-screen bg-gradient-to-br from-aurora-space-black via-aurora-void-black to-aurora-space-black">
        {/* Header */}
        <header className="py-6 border-b border-aurora-electric-purple/20 bg-aurora-void-black/50 backdrop-blur-md">
          <div className="container flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-aurora-bright-cyan">
              Fluida
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">
                Já tem uma conta?
              </span>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Fazer login
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Criar sua conta
              </h1>
              <p className="text-slate-400">
                Preencha suas informações para começar a usar o Fluida
              </p>
            </div>

            {/* Form Card */}
            <Card className="bg-aurora-void-black/80 border-aurora-electric-purple/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-3">
                  <User className="w-6 h-6 text-aurora-bright-cyan" />
                  Informações da Conta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserRegistrationForm
                    mode="public"
                    onSubmit={handleSubmit}
                    showPasswordConfirmation={true}
                    showTermsAcceptance={true}
                    defaultValues={{
                      role: 'cliente',
                      idioma: 'PT'
                    }}
                  />
                </motion.div>
              </CardContent>
            </Card>

            {/* Help Text */}
            <div className="text-center mt-6">
              <p className="text-sm text-slate-400">
                Ao criar sua conta, você terá acesso completo aos recursos da plataforma.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-aurora-electric-purple/20 bg-aurora-void-black/50 backdrop-blur-md">
          <div className="container text-center">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Fluida | Seu estúdio criativo em um clique.
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundarySignUp>
  );
};

export default SignUpUnified;