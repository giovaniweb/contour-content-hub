
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import HighlightBanner from "@/components/dashboard/HighlightBanner";
import TrendingItems from "@/components/dashboard/TrendingItems";
import RecommendationBlock from "@/components/dashboard/RecommendationBlock";
import NotificationsDemo from "@/components/dashboard/NotificationsDemo";
import { Kanban, ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerChildren, itemVariants } from "@/lib/animations";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.name || 'usuário';
  
  console.log("Dashboard - Rendering with user:", userName);
  
  return (
    <Layout fullWidth>
      <div className="max-w-7xl mx-auto px-4 space-y-8 py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren(0.1)}
          className="space-y-6"
        >
          {/* Welcome Card */}
          <motion.div variants={itemVariants}>
            <Card className="border-none overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-fluida-blue to-fluida-pink text-white p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-2xl mb-0">Bem-vindo, {userName}!</CardTitle>
                  <Button asChild variant="glass" size="sm" className="mt-4 sm:mt-0">
                    <Link to="/content-planner" className="flex items-center gap-2">
                      <Kanban className="h-4 w-4" />
                      <span>Acessar Planner</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <DashboardCard
                    title="Planner de Conteúdo"
                    description="Organize suas ideias e crie planejamentos eficientes"
                    icon="Kanban"
                    to="/content-planner"
                  />
                  <DashboardCard
                    title="Validador de Ideias"
                    description="Analise e refine suas ideias antes de produzir"
                    icon="Lightbulb"
                    to="/content-ideas"
                    highlight
                  />
                  <DashboardCard
                    title="Gerar Roteiro"
                    description="Crie roteiros personalizados para seus vídeos"
                    icon="FileText"
                    to="/scripts"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Highlight Banner */}
          <motion.div variants={itemVariants}>
            <HighlightBanner 
              title="Crie conteúdo que engaja" 
              description="Utilize nossa plataforma inteligente para criar roteiros, validar ideias e planejar sua estratégia de conteúdo."
              ctaText="Começar agora"
              ctaLink="/content-planner"
            />
          </motion.div>
          
          {/* Trending Items */}
          <motion.div variants={itemVariants}>
            <TrendingItems />
          </motion.div>
          
          {/* Recommendation Block */}
          <motion.div variants={itemVariants}>
            <RecommendationBlock />
          </motion.div>
        </motion.div>
        
        {/* Floating action button for mobile */}
        <div className="fixed right-6 bottom-20 md:hidden z-40">
          <Button 
            size="circle" 
            variant="gradient" 
            className="h-14 w-14 shadow-lg"
            asChild
          >
            <Link to="/content-planner">
              <Plus className="h-6 w-6" />
              <span className="sr-only">New Content</span>
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  to: string;
  highlight?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  description, 
  icon, 
  to,
  highlight = false 
}) => {
  // Dynamic icon import based on name
  const IconComponent = React.useMemo(() => {
    const icons = {
      Kanban,
      Lightbulb: () => <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14C9 13.4477 9.44772 13 10 13H14C14.5523 13 15 13.4477 15 14Z" fill="#F59E0B"/>
          <path d="M15 18C15 18.5523 14.5523 19 14 19H10C9.44772 19 9 18.5523 9 18C9 17.4477 9.44772 17 10 17H14C14.5523 17 15 17.4477 15 18Z" fill="#F59E0B"/>
          <path d="M12 2C7.28595 2 4 5.13168 4 9.5C4 11.7636 5.02335 13.0731 6.09753 14.0435C7.11142 14.9585 8 15.9887 8 17V18C8 19.1046 8.89543 20 10 20H14C15.1046 20 16 19.1046 16 18V17C16 15.9887 16.8886 14.9585 17.9025 14.0435C18.9767 13.0731 20 11.7636 20 9.5C20 5.13168 16.714 2 12 2Z" fill="#FBBF24"/>
          <path opacity="0.4" d="M13.73 22C13.5542 22.3031 13.3018 22.5547 12.9982 22.7295C12.6946 22.9044 12.3504 22.9965 12 22.9965C11.6496 22.9965 11.3054 22.9044 11.0018 22.7295C10.6982 22.5547 10.4458 22.3031 10.27 22H13.73Z" fill="#F59E0B"/>
        </svg>
      </div>,
      FileText: () => <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 8.5V20.5C20 21.0523 19.5523 21.5 19 21.5H5C4.44772 21.5 4 21.0523 4 20.5V3.5C4 2.94772 4.44772 2.5 5 2.5H14L20 8.5Z" fill="#93C5FD"/>
          <path d="M14 2.5V7.5C14 8.05228 14.4477 8.5 15 8.5H20L14 2.5Z" fill="#3B82F6"/>
          <path d="M8 12.5H16M8 16.5H16" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    };
    return icons[icon as keyof typeof icons] || Kanban;
  }, [icon]);

  return (
    <Link to={to}>
      <Card 
        className={`hover-lift ${highlight ? 'border-fluida-blue/40 bg-fluida-blue/5' : ''}`} 
        elevation="flat"
        interactive
      >
        <CardContent className="p-4 flex gap-4">
          <div className="flex-shrink-0">
            {React.isValidElement(IconComponent) ? 
              IconComponent : 
              <IconComponent className="h-10 w-10 text-fluida-blue" />
            }
          </div>
          <div>
            <h3 className="font-medium text-base mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Dashboard;
