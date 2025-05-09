
import React from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import TrendingItems from '@/components/dashboard/TrendingItems';
import RecommendationBlock from '@/components/dashboard/RecommendationBlock';
import QuickAccessGrid from '@/components/home/QuickAccessGrid';
import InsightsSection from '@/components/home/InsightsSection';
import AnimationStyles from '@/components/home/AnimationStyles';
import NotificationsDemo from '@/components/dashboard/NotificationsDemo';
import WelcomeBanner from '@/components/home/WelcomeBanner';
import PopularContent from '@/components/dashboard/PopularContent';
import ParallaxSection from '@/components/ui/parallax/ParallaxSection';
import { mockItems } from '@/hooks/content-planner/initialState';

const HomePage: React.FC = () => {
  const { toast } = useToast();
  
  const typingPhrases = [
    "What would you like to do today?",
    "Generate a video idea...",
    "Plan your content...",
    "Validate a strategy..."
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
        {/* Welcome Banner with Interactive Prompt */}
        <WelcomeBanner phrases={typingPhrases} />
        
        {/* ParallaxSection - Content Highlight */}
        <ParallaxSection
          backgroundImage="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png"
          title="Conteúdo Premium para Especialistas em Estética"
          description="Explore nossa biblioteca de conteúdo exclusivo, vídeos educacionais e ferramentas para impulsionar sua presença online."
          cards={featuredCards.slice(0, 3)}
          ctaText="Explorar Biblioteca"
          ctaLink="/media-library"
        />
        
        {/* Quick access blocks */}
        <QuickAccessGrid />
        
        {/* Trending Content */}
        <TrendingItems />
        
        {/* Popular Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PopularContent />
        </div>
        
        {/* Recommendations */}
        <RecommendationBlock />
        
        {/* Insights section */}
        <InsightsSection />
      </div>
      
      {/* Notifications Demo for development purposes */}
      <NotificationsDemo />
      
      {/* Animation styles */}
      <AnimationStyles />
    </Layout>
  );
};

export default HomePage;
