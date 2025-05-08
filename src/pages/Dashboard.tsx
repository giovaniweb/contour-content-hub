
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import HighlightBanner from "@/components/dashboard/HighlightBanner";
import TrendingItems from "@/components/dashboard/TrendingItems";
import RecommendationBlock from "@/components/dashboard/RecommendationBlock";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.name || 'usuário';
  
  console.log("Dashboard - Rendering with user:", userName);
  
  return (
    <Layout fullWidth>
      <div className="max-w-7xl mx-auto px-4 space-y-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo, {userName}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Esta é sua página de dashboard.</p>
          </CardContent>
        </Card>
        
        {/* Highlight Banner */}
        <div className="mt-8">
          <HighlightBanner 
            title="Crie conteúdo que engaja" 
            description="Utilize nossa plataforma inteligente para criar roteiros, validar ideias e planejar sua estratégia de conteúdo."
            ctaText="Começar agora"
            ctaLink="/custom-gpt"
          />
        </div>
        
        {/* Trending Items */}
        <div className="mt-8">
          <TrendingItems />
        </div>
        
        {/* Recommendation Block */}
        <div className="mt-8">
          <RecommendationBlock />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
