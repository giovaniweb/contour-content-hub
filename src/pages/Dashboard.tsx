
import React from "react";
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
  Settings, 
  MessageSquare,
  LayoutDashboard
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
  
  return (
    <Layout fullWidth>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section with Greeting */}
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-800">
            Bem-vindo ao ReelLine, {userName}
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Seu estúdio criativo de conteúdo, em um clique. O que vamos postar hoje?
          </p>
        </div>
        
        {/* Painel de Estatísticas de IA - apenas para Administradores */}
        {showAiStats && (
          <AiUsageStats className="mb-8" />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed principal - 2/3 da largura em desktops */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sugestão Destacada - IA */}
            <Card className="modern-card overflow-hidden border-l-4 border-l-contourline-mediumBlue">
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
                  <Link to="/script-generator?type=dailySales">
                    <Button variant="outline" className="text-contourline-mediumBlue">
                      <FileText className="h-4 w-4 mr-2" /> {t('createNow')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Feed de Conteúdo */}
            <ContentFeed />
          </div>
          
          {/* Sidebar - 1/3 da largura em desktops */}
          <div className="space-y-6">
            {/* Ações rápidas */}
            <Card className="modern-card overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-contourline-lightBlue/5 to-contourline-lightBlue/10 pb-3">
                <CardTitle className="text-lg font-medium">{t('actions')}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/script-generator">
                    <Button variant="outline" className="w-full flex flex-col h-auto py-4 hover:bg-contourline-lightBlue/5">
                      <FileText className="h-6 w-6 mb-2 text-contourline-mediumBlue" />
                      <span>{t('generateScript')}</span>
                    </Button>
                  </Link>
                  <Link to="/media-library">
                    <Button variant="outline" className="w-full flex flex-col h-auto py-4 hover:bg-contourline-lightBlue/5">
                      <Video className="h-6 w-6 mb-2 text-contourline-mediumBlue" />
                      <span>{t('library')}</span>
                    </Button>
                  </Link>
                  <Link to="/calendar">
                    <Button variant="outline" className="w-full flex flex-col h-auto py-4 hover:bg-contourline-lightBlue/5">
                      <Calendar className="h-6 w-6 mb-2 text-contourline-mediumBlue" />
                      <span>{t('agenda')}</span>
                    </Button>
                  </Link>
                  <Link to="/script-generator?type=bigIdea">
                    <Button variant="outline" className="w-full flex flex-col h-auto py-4 hover:bg-contourline-lightBlue/5">
                      <Sparkles className="h-6 w-6 mb-2 text-contourline-mediumBlue" />
                      <span>{t('bigIdea')}</span>
                    </Button>
                  </Link>
                </div>
                
                {/* Link para o painel de integração e gerenciamento de conteúdo - para admin e operador */}
                {(isAdmin() || isOperator()) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <Link to="/admin/integrations">
                      <Button variant="ghost" className="w-full justify-start text-contourline-mediumBlue">
                        <Settings className="h-4 w-4 mr-2" />
                        <span>{t('adminPanel')}</span>
                      </Button>
                    </Link>
                    <Link to="/admin/content" onClick={handleAdminAccess}>
                      <Button variant="ghost" className="w-full justify-start text-contourline-mediumBlue">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        <span>Cadastrar Conteúdo</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Preview da agenda */}
            <CreativeAgendaPreview />
            
            {/* Status de uso */}
            <Card className="modern-card">
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
                  <div className="bg-contourline-lightGray/20 rounded-lg p-4">
                    <div className="text-3xl font-bold text-contourline-mediumBlue">12</div>
                    <div className="text-sm text-contourline-darkBlue/70">{t('scriptsCreated')}</div>
                  </div>
                  <div className="bg-contourline-lightGray/20 rounded-lg p-4">
                    <div className="text-3xl font-bold text-contourline-mediumBlue">8</div>
                    <div className="text-sm text-contourline-darkBlue/70">{t('videosSaved')}</div>
                  </div>
                </div>
                <Link to="/profile" className="mt-4 w-full">
                  <Button variant="outline" className="w-full mt-4 text-contourline-mediumBlue">
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
