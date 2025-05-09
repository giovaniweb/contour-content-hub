
import React from 'react';
import Layout from '@/components/Layout';
import { Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import HighlightBanner from '@/components/dashboard/HighlightBanner';
import TrendingItems from '@/components/dashboard/TrendingItems';
import RecommendationBlock from '@/components/dashboard/RecommendationBlock';
import NotificationsDemo from '@/components/dashboard/NotificationsDemo';
import QuickAccessGrid from '@/components/home/QuickAccessGrid';
import InsightsSection from '@/components/home/InsightsSection';
import AnimationStyles from '@/components/home/AnimationStyles';
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

  // Handle interactive prompt submission
  const handlePromptSubmit = (promptText: string) => {
    toast({
      title: "Recebemos sua solicitação",
      description: `"${promptText}" está sendo processado pelo sistema.`,
      duration: 5000,
    });
    
    // Here we would normally process the prompt with AI, but for now just show a toast
    setTimeout(() => {
      toast({
        title: "Sugestão de Ação",
        description: "Com base na sua solicitação, recomendamos acessar o Gerador de Scripts.",
        action: (
          <a href="/script-generator" className="px-3 py-2 bg-fluida-blue text-white rounded-md text-xs">
            Acessar
          </a>
        ),
        duration: 8000,
      });
    }, 2000);
  };

  return (
    <Layout title="Página Inicial">
      <div className="space-y-12">
        {/* Interactive Hero Section with Parallax */}
        <ParallaxSection
          backgroundImage="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png"
          title=""
          description=""
          cards={[]}
          interactive={true}
          typingPhrases={typingPhrases}
          onPromptSubmit={handlePromptSubmit}
          darkOverlay={true}
          className="bg-gradient-to-r from-purple-900 to-indigo-800"
        />
        
        {/* ParallaxSection - Content Highlight */}
        <ParallaxSection
          backgroundImage="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png"
          title="Conteúdo Premium para Especialistas em Estética"
          description="Explore nossa biblioteca de conteúdo exclusivo, vídeos educacionais e ferramentas para impulsionar sua presença online."
          cards={featuredCards.slice(0, 3)}
          ctaText="Explorar Biblioteca"
          ctaLink="/media-library"
        />
        
        {/* Trending Content */}
        <TrendingItems />
        
        {/* Recommendations */}
        <RecommendationBlock />

        {/* Quick access blocks */}
        <QuickAccessGrid />
        
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
