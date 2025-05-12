
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

// Importando componentes
import FeaturedVideo from "@/components/home/FeaturedVideo";
import FeaturedGallery from "@/components/home/FeaturedGallery";
import FeaturedIcons from "@/components/home/FeaturedIcons";
import ConsultantBanner from "@/components/home/ConsultantBanner";

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
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <AnimationStyles />
      <NeonTextEffect />
      
      <Header />

      <main className="flex-grow">
        {/* Hero Section com layout refinado */}
        <HeroSection />
        
        {/* Recursos principais do sistema */}
        <FeaturesSection />
        
        {/* Consultor de Marketing Banner */}
        <ConsultantBanner />
        
        {/* Seção - Vídeo em destaque */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16 tracking-wide text-gray-800">
              Vídeo em destaque
            </h2>
            <div className="max-w-4xl mx-auto">
              <FeaturedVideo />
            </div>
          </div>
        </section>
        
        {/* Banner interativo */}
        <WelcomeBanner phrases={welcomePhrases} />
        
        {/* Seção - Fotos e artes em destaque */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16 tracking-wide text-gray-800">
              Fotos e artes em destaque
            </h2>
            <FeaturedGallery />
          </div>
        </section>
        
        {/* Seção - Painel de funcionalidades com ícones */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16 tracking-wide text-gray-800">
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
