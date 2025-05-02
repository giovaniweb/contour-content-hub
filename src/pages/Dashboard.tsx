
import React, { useState } from "react";
import Layout from "@/components/Layout";
import ContentFeed from "@/components/ContentFeed";
import CreativeAgendaPreview from "@/components/CreativeAgendaPreview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Video, 
  Calendar, 
  Sparkles, 
  MessageSquare,
  FileSearch,
  LayoutDashboard,
  Settings,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import AiUsageStats from "@/components/admin/AiUsageStats";

const Dashboard: React.FC = () => {
  const { isAdmin, isOperator, hasPermission } = usePermissions();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const userName = user?.name || t('user');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  const handleAdminAccess = () => {
    if (!hasPermission("editAllContent")) {
      toast({
        variant: "destructive",
        title: t('accessDenied'),
        description: t('noPermission'),
      });
    }
  };
  
  // Verifica se o usuário é admin para mostrar o painel de estatísticas de IA
  const showAiStats = isAdmin();

  const toggleExpand = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };
  
  return (
    <Layout fullWidth>
      <div className="max-w-7xl mx-auto px-4 space-y-8 py-6">
        {/* Header Section with Greeting */}
        <section className="bg-gradient-to-r from-contourline-lightBlue/20 to-contourline-lightBlue/5 rounded-2xl p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 animate-fade-in">
                Bem-vindo ao Fluida, {userName}
              </h1>
              <p className="text-gray-600 max-w-2xl">
                Seu estúdio criativo de conteúdo, em um clique. O que vamos criar hoje?
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-2 flex-wrap">
              <Link to="/equipment-details">
                <Button variant="outline" size="sm" className="flex items-center bg-white/80 hover:bg-white">
                  <FileSearch className="h-4 w-4 mr-2 text-contourline-mediumBlue" />
                  Equipamentos
                </Button>
              </Link>
              <Link to="/custom-gpt">
                <Button variant="default" size="sm" className="flex items-center bg-contourline-mediumBlue hover:bg-contourline-darkBlue">
                  <FileText className="h-4 w-4 mr-2" />
                  Criar Roteiro
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Painel de Estatísticas de IA - apenas para Administradores */}
        {showAiStats && (
          <AiUsageStats className="animate-fade-in" />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed principal - 2/3 da largura em desktops */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sugestão Destacada - IA */}
            <Card className="overflow-hidden border-l-4 border-l-contourline-mediumBlue transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2 bg-contourline-lightBlue/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-contourline-mediumBlue" />
                  {t('todaySuggestion')}
                </CardTitle>
                <CardDescription>
                  Sugestão baseada nos seus conteúdos mais engajados
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <p className="font-medium text-contourline-darkBlue">
                  Crie um story sobre flacidez abdominal hoje usando o equipamento Ultralift.
                </p>
                <div className="mt-4">
                  <Link to="/custom-gpt?type=dailySales">
                    <Button variant="outline" className="text-contourline-mediumBlue">
                      <FileText className="h-4 w-4 mr-2" /> {t('createNow')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Feed de Conteúdo com Título */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-800">Conteúdo Recente</h2>
                <Button variant="ghost" size="sm" className="text-contourline-mediumBlue flex items-center">
                  Ver tudo <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <ContentFeed />
            </div>
          </div>
          
          {/* Sidebar - 1/3 da largura em desktops */}
          <div className="space-y-6">
            {/* Ações rápidas */}
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="bg-gradient-to-r from-contourline-lightBlue/5 to-contourline-lightBlue/10 pb-3">
                <CardTitle className="text-lg font-medium">{t('actions')}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/custom-gpt">
                    <Button variant="outline" className="w-full flex flex-col h-auto py-4 hover:bg-contourline-lightBlue/5 transition-all">
                      <FileText className="h-6 w-6 mb-2 text-contourline-mediumBlue" />
                      <span>{t('generateScript')}</span>
                    </Button>
                  </Link>
                  <Link to="/media-library">
                    <Button variant="outline" className="w-full flex flex-col h-auto py-4 hover:bg-contourline-lightBlue/5 transition-all">
                      <Video className="h-6 w-6 mb-2 text-contourline-mediumBlue" />
                      <span>{t('library')}</span>
                    </Button>
                  </Link>
                  <Link to="/calendar">
                    <Button variant="outline" className="w-full flex flex-col h-auto py-4 hover:bg-contourline-lightBlue/5 transition-all">
                      <Calendar className="h-6 w-6 mb-2 text-contourline-mediumBlue" />
                      <span>{t('agenda')}</span>
                    </Button>
                  </Link>
                  <Link to="/custom-gpt?type=bigIdea">
                    <Button variant="outline" className="w-full flex flex-col h-auto py-4 hover:bg-contourline-lightBlue/5 transition-all">
                      <Sparkles className="h-6 w-6 mb-2 text-contourline-mediumBlue" />
                      <span>{t('bigIdea')}</span>
                    </Button>
                  </Link>
                </div>
                
                {/* Links administrativos - somente para admin e operador */}
                {(isAdmin() || isOperator()) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-2">Administrativo</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Link to="/admin/integrations">
                        <Button variant="ghost" className="w-full justify-start text-contourline-mediumBlue hover:bg-contourline-lightBlue/5">
                          <Settings className="h-4 w-4 mr-2" />
                          <span>{t('adminPanel')}</span>
                        </Button>
                      </Link>
                      <Link to="/admin/content" onClick={handleAdminAccess}>
                        <Button variant="ghost" className="w-full justify-start text-contourline-mediumBlue hover:bg-contourline-lightBlue/5">
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          <span>Cadastrar Conteúdo</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Preview da agenda */}
            <CreativeAgendaPreview />
            
            {/* Status de uso */}
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-contourline-mediumBlue" />
                  {t('performance')}
                </CardTitle>
                <CardDescription>
                  {t('activityHistory')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-contourline-lightGray/20 rounded-lg p-4 hover:bg-contourline-lightGray/30 transition-colors">
                    <div className="text-3xl font-bold text-contourline-mediumBlue">12</div>
                    <div className="text-sm text-contourline-darkBlue/70">{t('scriptsCreated')}</div>
                  </div>
                  <div className="bg-contourline-lightGray/20 rounded-lg p-4 hover:bg-contourline-lightGray/30 transition-colors">
                    <div className="text-3xl font-bold text-contourline-mediumBlue">8</div>
                    <div className="text-sm text-contourline-darkBlue/70">{t('videosSaved')}</div>
                  </div>
                </div>
                <Link to="/profile" className="mt-4 w-full">
                  <Button variant="outline" className="w-full mt-4 text-contourline-mediumBlue hover:bg-contourline-lightBlue/5">
                    <MessageSquare className="h-4 w-4 mr-2" /> Ver histórico completo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
