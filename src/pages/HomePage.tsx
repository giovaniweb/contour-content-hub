
import React from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import TrendingItems from '@/components/dashboard/TrendingItems';
import RecommendationBlock from '@/components/dashboard/RecommendationBlock';
import QuickAccessGrid from '@/components/home/QuickAccessGrid';
import InsightsSection from '@/components/home/InsightsSection';
import AnimationStyles from '@/components/home/AnimationStyles';
import WelcomeBanner from '@/components/home/WelcomeBanner';
import PopularContent from '@/components/dashboard/PopularContent';
import ParallaxSection from '@/components/ui/parallax/ParallaxSection';
import { mockItems } from '@/hooks/content-planner/initialState';
import { layouts } from '@/lib/design-system';

const HomePage: React.FC = () => {  
  const typingPhrases = [
    "O que você deseja criar hoje?",
    "Gere uma ideia de vídeo...",
    "Planeje seu conteúdo...",
    "Valide uma estratégia...",
    "Busque inspiração para tratamentos..."
  ];

  // Create featured content cards from real content
  const featuredCards = [
    {
      title: "Demonstração do Laser Adella",
      description: "Aprenda como utilizar o Laser Adella em tratamentos de rejuvenescimento",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      link: "/videos?id=adella-laser-demo"
    },
    {
      title: "Resultados do Ultralift",
      description: "Veja os resultados reais de pacientes após o tratamento com Ultralift",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      link: "/videos?id=ultralift-results"
    },
    {
      title: "Guia para iniciantes no Hipro",
      description: "Tutorial passo a passo para novos usuários do equipamento Hipro",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      link: "/videos?id=hipro-guide"
    }
  ];

  return (
    <Layout title="Página Inicial" fullWidth>
      <div className="space-y-12">
        {/* Welcome Banner with Interactive Prompt */}
        <WelcomeBanner phrases={typingPhrases} />
        
        {/* ParallaxSection - Content Highlight */}
        <div className={layouts.sectionPadding}>
          <ParallaxSection
            backgroundImage="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png"
            title="Conteúdo Premium para Especialistas em Estética"
            description="Explore nossa biblioteca exclusiva com vídeos educacionais, demonstrações de equipamentos e ferramentas para impulsionar sua presença online."
            cards={featuredCards}
            ctaText="Explorar Biblioteca"
            ctaLink="/media-library"
          />
        </div>
        
        {/* Quick access blocks */}
        <section className={layouts.sectionPadding}>
          <QuickAccessGrid />
        </section>
        
        {/* Trending Content */}
        <section className={layouts.sectionPadding}>
          <TrendingItems />
        </section>
        
        {/* Popular Content */}
        <section className={layouts.sectionPadding}>
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">Conteúdos Populares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PopularContent />
            </div>
          </div>
        </section>
        
        {/* Recommendations */}
        <section className={layouts.sectionPadding}>
          <RecommendationBlock />
        </section>
        
        {/* Insights section */}
        <section className={layouts.sectionPadding}>
          <InsightsSection />
        </section>
      </div>
      
      {/* Animation styles */}
      <AnimationStyles />
    </Layout>
  );
};

export default HomePage;
