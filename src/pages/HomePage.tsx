
import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, FileText, Film, Settings, ListTodo, Video, Lightbulb, Rocket } from 'lucide-react';

const HomePage: React.FC = () => {
  const [typingText, setTypingText] = React.useState("Create a video script...");
  
  React.useEffect(() => {
    const phrases = [
      "Create a video script...",
      "Explore trends...",
      "Validate an idea..."
    ];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % phrases.length;
      setTypingText(phrases[currentIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout title="Página Inicial">
      <div className="space-y-12">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-6">O que você deseja fazer hoje?</h1>
          <div className="h-12 flex items-center justify-center">
            <p className="text-2xl text-primary font-medium typing-animation">
              {typingText}
            </p>
          </div>
        </div>
        
        {/* Banner destacado */}
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-violet-500 to-purple-700 h-64">
          <div className="absolute inset-0 flex items-center p-8">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Crie conteúdo que engaja</h2>
              <p className="text-white/90 mb-6">Utilize nossa plataforma inteligente para criar roteiros, validar ideias e planejar sua estratégia de conteúdo.</p>
              <Button asChild variant="secondary" className="font-medium">
                <Link to="/custom-gpt">Começar agora</Link>
              </Button>
            </div>
          </div>
          <div className="absolute right-8 bottom-0">
            <Rocket className="h-32 w-32 text-white/20" />
          </div>
        </div>

        {/* Blocos de acesso rápido */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-amber-500" />
            Acesso rápido
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border border-border/50 hover:shadow-md transition-shadow duration-300 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  Roteiros
                </CardTitle>
                <CardDescription>Crie e gerencie roteiros personalizados para seus vídeos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/custom-gpt">Acessar Roteiros</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border/50 hover:shadow-md transition-shadow duration-300 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="mr-2 h-5 w-5 text-purple-500" />
                  Biblioteca de Vídeos
                </CardTitle>
                <CardDescription>Acesse sua coleção de vídeos e gerencie seu conteúdo</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/video-storage">Acessar Vídeos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border/50 hover:shadow-md transition-shadow duration-300 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ListTodo className="mr-2 h-5 w-5 text-green-500" />
                  Estratégia de Conteúdo
                </CardTitle>
                <CardDescription>Planeje e organize suas estratégias de marketing</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/content-strategy">Acessar Estratégias</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border/50 hover:shadow-md transition-shadow duration-300 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-amber-500" />
                  Equipamentos
                </CardTitle>
                <CardDescription>Gerencie seus equipamentos e tecnologias</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/equipments">Gerenciar Equipamentos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border/50 hover:shadow-md transition-shadow duration-300 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5 text-red-500" />
                  Agenda
                </CardTitle>
                <CardDescription>Gerencie seu calendário e agendamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/calendar">Acessar Agenda</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-border/50 hover:shadow-md transition-shadow duration-300 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Film className="mr-2 h-5 w-5 text-indigo-500" />
                  Mídia
                </CardTitle>
                <CardDescription>Gerencie sua biblioteca de mídia e arquivos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/media">Acessar Mídia</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Seção de tendências e recomendações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Tendências</CardTitle>
              <CardDescription>Tópicos populares e tendências atuais</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between items-center">
                  <span>Vídeos curtos para redes sociais</span>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">Em alta</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Conteúdo educativo sobre saúde</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Estável</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Tutoriais de procedimentos</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Crescendo</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Recomendações</CardTitle>
              <CardDescription>Sugeridas com base na sua atividade</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Criar roteiro para demonstração de equipamento</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Atualizar estratégia de conteúdo mensal</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Revisar estatísticas de engajamento</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Fix: Using style tag properly without the 'jsx' property */}
      <style>
        {`
        .typing-animation {
          border-right: 2px solid currentColor;
          padding-right: 5px;
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          from, to { border-color: transparent }
          50% { border-color: currentColor; }
        }
        `}
      </style>
    </Layout>
  );
};

export default HomePage;
