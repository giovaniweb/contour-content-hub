
import React from 'react';
import Layout from '@/components/Layout';
import { Lightbulb } from 'lucide-react';
import HighlightBanner from '@/components/dashboard/HighlightBanner';
import TrendingItems from '@/components/dashboard/TrendingItems';
import RecommendationBlock from '@/components/dashboard/RecommendationBlock';
import NotificationsDemo from '@/components/dashboard/NotificationsDemo';
import WelcomeBanner from '@/components/home/WelcomeBanner';
import QuickAccessGrid from '@/components/home/QuickAccessGrid';
import InsightsSection from '@/components/home/InsightsSection';
import AnimationStyles from '@/components/home/AnimationStyles';
import ParallaxSection from '@/components/ui/parallax/ParallaxSection';
import { mockItems } from '@/hooks/content-planner/initialState';

const HomePage: React.FC = () => {
  const typingPhrases = [
    "Create a video script...",
    "Explore trends...",
    "Validate an idea..."
  ];

  // Create featured content cards from the mock content planner items
  const featuredCards = mockItems.map(item => ({
    title: item.title,
    description: item.description || 'Conteúdo exclusivo para profissionais de estética',
    image: '/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png',
    link: `/content-planner?id=${item.id}`
  }));

  return (
    <Layout title="Página Inicial">
      <div className="space-y-12">
        <WelcomeBanner 
          title="O que você deseja fazer hoje?" 
          phrases={typingPhrases} 
        />
        
        {/* ParallaxSection - Video Highlight Banner */}
        <ParallaxSection
          backgroundImage="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png"
          title="Conteúdo Premium para Especialistas em Estética"
          description="Explore nossa biblioteca de conteúdo exclusivo, vídeos educacionais e ferramentas para impulsionar sua presença online."
          cards={featuredCards.slice(0, 3)}
          ctaText="Explorar Biblioteca"
          ctaLink="/media-library"
        />
        
        {/* Trending Content - Step 2 */}
        <TrendingItems />
        
        {/* Recommendations - Step 3 */}
        <RecommendationBlock />

        {/* Blocos de acesso rápido */}
        <QuickAccessGrid />
        
        {/* Seção de tendências e recomendações */}
        <InsightsSection />
      </div>
      
      {/* Notifications Demo for Step 5 - for development purposes */}
      <NotificationsDemo />
      
      {/* Animation styles */}
      <AnimationStyles />
    </Layout>
  );
};

export default HomePage;
