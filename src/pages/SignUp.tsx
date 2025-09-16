import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, User, MapPin, Briefcase, Settings, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Step Components
import { BasicInfoStep } from "@/components/signup/BasicInfoStep";
import { ProfessionalStep } from "@/components/signup/ProfessionalStep";
import { LocationStep } from "@/components/signup/LocationStep";
import { EquipmentStep } from "@/components/signup/EquipmentStep";
import { FinalStep } from "@/components/signup/FinalStep";

interface FormData {
  // Basic info
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Professional
  role: string;
  clinica?: string;
  especialidade?: string;
  experiencia?: string;
  
  // Location
  cidade?: string;
  estado?: string;
  telefone?: string;
  endereco_completo?: string;
  
  // Equipment & Interests
  equipamentos?: string[];
  observacoes_conteudo?: string;
  
  // Final settings
  idioma?: "PT" | "EN" | "ES";
  foto_url?: string;
  acceptTerms: boolean;
}

const steps = [
  {
    id: 1,
    title: "Informações Básicas",
    icon: User,
    description: "Nome, email e senha"
  },
  {
    id: 2,
    title: "Perfil Profissional",
    icon: Briefcase,
    description: "Tipo de perfil e especialidade"
  },
  {
    id: 3,
    title: "Localização",
    icon: MapPin,
    description: "Cidade, estado e contato"
  },
  {
    id: 4,
    title: "Equipamentos",
    icon: Camera,
    description: "Equipamentos e interesses"
  },
  {
    id: 5,
    title: "Finalização",
    icon: Settings,
    description: "Configurações e confirmação"
  }
];

const SignUp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'cliente',
    idioma: 'PT',
    acceptTerms: false,
    equipamentos: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('signupProgress');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error('Erro ao carregar progresso salvo:', error);
      }
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    const dataToSave = { ...formData };
    delete dataToSave.password;
    delete dataToSave.confirmPassword;
    localStorage.setItem('signupProgress', JSON.stringify(dataToSave));
  }, [formData]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.nome && formData.email && formData.password && 
                 formData.confirmPassword && formData.password === formData.confirmPassword);
      case 2:
        return !!(formData.role);
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Optional fields
      case 5:
        return formData.acceptTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error('Por favor, preencha os campos obrigatórios');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast.error('Por favor, aceite os termos de uso');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        nome: formData.nome
      });

      if (result?.error) {
        throw new Error(result.error.message);
      }

      // Clear saved progress
      localStorage.removeItem('signupProgress');
      
      toast.success('Conta criada com sucesso!', {
        description: 'Verifique seu email para confirmar sua conta. Você será redirecionado para o login.'
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      toast.error('Erro ao criar conta', {
        description: error.message || 'Não foi possível criar sua conta. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      onNext: nextStep,
      onPrev: prevStep,
      isLoading
    };

    switch (currentStep) {
      case 1:
        return <BasicInfoStep {...stepProps} />;
      case 2:
        return <ProfessionalStep {...stepProps} />;
      case 3:
        return <LocationStep {...stepProps} />;
      case 4:
        return <EquipmentStep {...stepProps} />;
      case 5:
        return <FinalStep {...stepProps} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
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
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-white">
                Criar sua conta
              </h1>
              <span className="text-sm text-slate-400">
                Passo {currentStep} de {steps.length}
              </span>
            </div>
            
            <Progress value={progress} className="h-2 mb-6" />
            
            {/* Step Indicator */}
            <div className="flex justify-between">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = completedSteps.includes(step.id);
                const Icon = step.icon;
                
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      isActive ? 'text-aurora-bright-cyan' : 
                      isCompleted ? 'text-aurora-neon-purple' : 'text-slate-500'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isActive ? 'bg-aurora-bright-cyan/20 border-2 border-aurora-bright-cyan' :
                        isCompleted ? 'bg-aurora-neon-purple/20 border-2 border-aurora-neon-purple' :
                        'bg-slate-800 border-2 border-slate-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-center hidden md:block">
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <Card className="bg-aurora-void-black/80 border-aurora-electric-purple/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-3">
                {React.createElement(steps[currentStep - 1].icon, { className: "w-6 h-6 text-aurora-bright-cyan" })}
                {steps[currentStep - 1].title}
              </CardTitle>
              <p className="text-slate-400">
                {steps[currentStep - 1].description}
              </p>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Pressione</span>
              <kbd className="px-2 py-1 bg-slate-800 rounded text-xs">Enter</kbd>
              <span>para continuar</span>
            </div>

            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="flex items-center gap-2"
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateStep(5) || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? 'Criando conta...' : 'Criar conta'}
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
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
  );
};

export default SignUp;