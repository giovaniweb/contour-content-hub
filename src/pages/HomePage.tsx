
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

      <main className="flex-grow pt-16">
        <HeroSection />
        <FeaturesSection />
        
        {/* Banner interativo */}
        <WelcomeBanner 
          phrases={welcomePhrases}
        />
        
        <TestimonialsSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
