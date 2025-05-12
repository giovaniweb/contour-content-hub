
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/HeroSection";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import { useAuth } from "@/context/AuthContext";
import AnimationStyles from "@/components/home/AnimationStyles";
import IntelligentIntentProcessor from "@/components/home/IntelligentIntentProcessor";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirecionar para o dashboard se já estiver autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  // Frases para o banner de boas-vindas
  const welcomePhrases = [
    "Crie conteúdo de mídia digital com IA",
    "Transforme ideias em roteiros profissionais",
    "Estratégias e conteúdos para suas redes sociais",
    "Otimize seu tempo na criação de conteúdo",
    "Aumente seus resultados com conteúdo estratégico"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <AnimationStyles />
      
      <header className="py-4 border-b bg-white/80 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fluida
          </h1>
          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Entrar
                </Button>
                <Button 
                  onClick={() => navigate(ROUTES.REGISTER)}
                >
                  Criar conta
                </Button>
              </>
            )}
            {isAuthenticated && (
              <Button 
                onClick={() => navigate(ROUTES.DASHBOARD)}
              >
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section with intent processor */}
        <HeroSection />
        
        {/* Intent processor */}
        <section className="bg-white py-10">
          <div className="container mx-auto">
            <IntelligentIntentProcessor />
          </div>
        </section>
        
        {/* Seção de recursos */}
        <section className="bg-white py-20">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Recursos poderosos para criadores de conteúdo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Gerador de Roteiros",
                  description: "Crie roteiros profissionais para seus vídeos em minutos, com sugestões inteligentes baseadas no seu objetivo.",
                  icon: "✍️"
                },
                {
                  title: "Biblioteca de Vídeos",
                  description: "Organize e acesse facilmente todos os seus vídeos e materiais de referência em um só lugar.",
                  icon: "🎬"
                },
                {
                  title: "Estratégia de Conteúdo",
                  description: "Desenvolva estratégias completas de conteúdo com sugestões personalizadas para seu público.",
                  icon: "📊"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-sm hover:shadow-[0_0_15px_rgba(0,148,251,0.15)] transition-all hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Banner interativo */}
        <WelcomeBanner 
          phrases={welcomePhrases}
        />
        
        {/* Depoimentos */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">O que nossos usuários dizem</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Carolina Silva",
                  role: "Influenciadora Digital",
                  quote: "A plataforma revolucionou minha produção de conteúdo. Agora consigo criar roteiros completos em minutos!",
                  avatar: "/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png"
                },
                {
                  name: "Marcelo Santos",
                  role: "Produtor de Vídeo",
                  quote: "A biblioteca de vídeos e o sistema de gerenciamento de conteúdo simplificaram todo meu fluxo de trabalho.",
                  avatar: "/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png"
                },
                {
                  name: "Juliana Costa",
                  role: "Social Media Manager",
                  quote: "As sugestões inteligentes de conteúdo realmente entendem o que funciona para diferentes tipos de público.",
                  avatar: "/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png"
                },
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <p className="italic text-gray-700 mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para transformar sua produção de conteúdo?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de criadores que já estão economizando tempo e criando conteúdo de maior qualidade.
            </p>
            <Button 
              size="lg"
              variant="secondary" 
              onClick={() => navigate(ROUTES.REGISTER)}
              className="text-lg px-8 bg-white text-blue-600 hover:bg-blue-50"
            >
              Começar agora
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Fluida</h3>
              <p className="text-gray-400">
                Seu estúdio criativo em um clique.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">Gerador de Roteiros</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Biblioteca de Vídeos</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Estratégia de Conteúdo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">Sobre nós</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Contato</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">Termos de Uso</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Fluida | Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
