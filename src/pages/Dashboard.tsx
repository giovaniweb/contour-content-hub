
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Componentes do Dashboard
import HeroSection from "@/components/dashboard/HeroSection";
import QuickActions from "@/components/dashboard/QuickActions";
import DashboardSection from "@/components/dashboard/DashboardSection";
import DashboardStats from "@/components/dashboard/DashboardStats";
import TrendingTopics from "@/components/dashboard/TrendingTopics";
import PopularContent from "@/components/dashboard/PopularContent";

// Importing PredictiveConsultant with lazy loading to avoid circular dependencies
const PredictiveConsultant = React.lazy(() => import("@/components/dashboard/PredictiveConsultant"));

// Dados das ações
import { getQuickActions, getAdditionalActions } from "@/components/dashboard/ActionCardsData";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.name || 'usuário';
  
  const quickActions = getQuickActions();
  const additionalActions = getAdditionalActions();
  
  return (
    <Layout fullWidth>
      <div className="max-w-7xl mx-auto px-4 space-y-8 py-6">
        {/* Hero Section com CTA principal */}
        <HeroSection userName={userName} />
        
        {/* Ações Rápidas */}
        <QuickActions 
          actions={quickActions} 
          title="Ações Rápidas" 
          cols={4}
        />
        
        {/* Additional Tools Section */}
        <QuickActions 
          actions={additionalActions} 
          title="Ferramentas Adicionais" 
          cols={3}
        />
        
        {/* Nova seção: Consultor Preditivo Inteligente */}
        <DashboardSection 
          title="Sugestões Personalizadas"
          icon={<Sparkles className="h-5 w-5 text-primary" />}
          actionLabel="Ver todas"
          actionPath="/marketing-consultant"
        >
          <React.Suspense fallback={<div className="p-4 text-center">Carregando sugestões...</div>}>
            <PredictiveConsultant />
          </React.Suspense>
        </DashboardSection>
        
        {/* Conteúdo em Alta */}
        <DashboardSection
          title="Tendências"
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
          actionLabel="Ver tudo"
          actionPath="/media-library"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PopularContent />
          </div>
        </DashboardSection>
        
        {/* Tendências de conteúdo */}
        <DashboardSection
          title="Roteiros em Alta"
          icon={<Sparkles className="h-5 w-5 text-amber-500" />}
        >
          <Card>
            <CardContent className="p-6">
              <TrendingTopics />
            </CardContent>
          </Card>
        </DashboardSection>
        
        {/* Estatísticas Resumidas */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardStats />
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
