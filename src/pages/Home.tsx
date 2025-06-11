
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, 
  FileText, 
  Video, 
  Calendar, 
  Lightbulb, 
  BarChart3,
  Wrench
} from 'lucide-react';
import { ROUTES } from '@/routes';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Roteiros Inteligentes",
      description: "Crie roteiros emocionais com IA",
      path: ROUTES.CONTENT.SCRIPTS.GENERATOR,
    },
    {
      icon: Video,
      title: "Gestão de Vídeos",
      description: "Organize e gerencie seus vídeos",
      path: ROUTES.VIDEOS.ROOT,
    },
    {
      icon: Calendar,
      title: "Planejamento",
      description: "Planeje seu conteúdo estrategicamente",
      path: ROUTES.CONTENT.PLANNER,
    },
    {
      icon: Wrench,
      title: "Equipamentos",
      description: "Gerencie seus equipamentos",
      path: ROUTES.EQUIPMENTS.LIST,
    },
    {
      icon: BarChart3,
      title: "Consultoria Marketing",
      description: "Análise e estratégias personalizadas",
      path: ROUTES.MARKETING.CONSULTANT,
    },
    {
      icon: Lightbulb,
      title: "Validador de Ideias",
      description: "Valide suas ideias de conteúdo",
      path: ROUTES.CONTENT.IDEAS,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light text-white mb-6">
            Bem-vindo à{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-medium">
              Fluida
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-8">
            Plataforma completa para criação e gestão de conteúdo digital
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Fazer Login
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate(ROUTES.REGISTER)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Criar Conta
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="cursor-pointer text-center p-6 hover:shadow-lg transition-all duration-300 bg-white/10 backdrop-blur-sm border-white/10 hover:border-white/20"
              onClick={() => navigate(feature.path)}
            >
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-medium text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-white/70 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
