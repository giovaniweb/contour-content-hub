
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes";
import AnimationStyles from "@/components/home/AnimationStyles";

// Importando componentes refatorados
import Header from "@/components/home/HomePage/Header";
import HeroSection from "@/components/home/HomePage/HeroSection";
import FeaturesSection from "@/components/home/HomePage/FeaturesSection";
import TestimonialsSection from "@/components/home/HomePage/TestimonialsSection";
import CtaSection from "@/components/home/HomePage/CtaSection";
import Footer from "@/components/home/HomePage/Footer";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import NeonTextEffect from "@/components/home/HomePage/NeonTextEffect";

// Importando novos componentes
import FeaturedVideo from "@/components/home/FeaturedVideo";
import FeaturedGallery from "@/components/home/FeaturedGallery";
import FeaturedIcons from "@/components/home/FeaturedIcons";

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
      <NeonTextEffect />
      
      <Header />

      <main className="flex-grow">
        {/* Hero Section - Mantida como está */}
        <HeroSection />
        
        {/* Nova seção - Vídeo em destaque */}
        <section className="py-16 bg-gradient-to-b from-indigo-900 to-purple-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white neon-text">
              Vídeo em destaque
            </h2>
            <div className="max-w-4xl mx-auto">
              <FeaturedVideo />
            </div>
          </div>
        </section>
        
        {/* Recursos principais do sistema */}
        <FeaturesSection />
        
        {/* Nova seção - Fotos e artes em destaque */}
        <section className="py-16 bg-gradient-to-b from-purple-900 to-indigo-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white neon-text">
              Fotos e artes em destaque
            </h2>
            <FeaturedGallery />
          </div>
        </section>
        
        {/* Banner interativo */}
        <WelcomeBanner phrases={welcomePhrases} />
        
        {/* Nova seção - Painel de funcionalidades com ícones */}
        <section className="py-16 bg-gradient-to-b from-indigo-900 to-purple-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white neon-text">
              Acesso Rápido
            </h2>
            <FeaturedIcons />
          </div>
        </section>
        
        <TestimonialsSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
