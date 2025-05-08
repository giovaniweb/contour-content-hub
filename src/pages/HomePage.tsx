
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

const HomePage: React.FC = () => {
  const typingPhrases = [
    "Create a video script...",
    "Explore trends...",
    "Validate an idea..."
  ];

  return (
    <Layout title="Página Inicial">
      <div className="space-y-12">
        <WelcomeBanner 
          title="O que você deseja fazer hoje?" 
          phrases={typingPhrases} 
        />
        
        {/* Featured Banner - Step 1 */}
        <HighlightBanner 
          title="Crie conteúdo impactante"
          description="Utilize nossa plataforma para criar scripts, vídeos e estratégias de conteúdo que engajam seu público."
          ctaText="Começar agora"
          ctaLink="/custom-gpt"
          imageUrl="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png"
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
