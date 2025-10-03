import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Mail, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";

const UpgradePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      name: "Mestre da Beleza",
      description: "Assistente especializado em procedimentos estéticos",
      icon: "✨"
    },
    {
      name: "Consultor de Marketing",
      description: "Estratégias e planejamento de marketing personalizado",
      icon: "📊"
    },
    {
      name: "Fluida Roteirista",
      description: "Criação de roteiros profissionais para conteúdo",
      icon: "📝"
    },
    {
      name: "Artigos Científicos",
      description: "Acesso completo à biblioteca de artigos científicos",
      icon: "🔬"
    },
    {
      name: "Academia Fluida",
      description: "Cursos e treinamentos profissionais completos",
      icon: "🎓"
    },
    {
      name: "Equipamentos Premium",
      description: "Biblioteca completa de equipamentos e protocolos",
      icon: "🔧"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="text-center mb-12">
          <Crown className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">
            Desbloqueie Todo o Potencial da Fluida
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Acesse recursos premium e leve sua clínica para o próximo nível
          </p>
        </div>

        <Card className="mb-8 border-primary shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Plano Premium</CardTitle>
            <CardDescription className="text-lg">
              Acesso completo a todos os recursos da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Suporte prioritário</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Atualizações e novos recursos primeiro</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Sem limites de uso</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => window.open('mailto:contato@fluida.com.br?subject=Interesse em Plano Premium', '_blank')}
              >
                <Mail className="mr-2 h-5 w-5" />
                Entre em Contato
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Nossa equipe entrará em contato para personalizar o melhor plano para você
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-muted-foreground">
          <p className="mb-2">Dúvidas sobre os planos?</p>
          <Button variant="link" onClick={() => window.open('mailto:suporte@fluida.com.br', '_blank')}>
            Fale com nosso suporte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
