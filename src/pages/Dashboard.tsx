
import React from "react";
import ContentLayout from "@/components/layout/ContentLayout";
import GlassContainer from "@/components/ui/GlassContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  FileText, 
  Video, 
  BarChart3, 
  MessageSquare, 
  Clock, 
  Zap, 
  TrendingUp, 
  Activity 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Quick action handlers
  const handleCreateScript = () => navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR);
  const handleViewVideos = () => navigate(ROUTES.VIDEOS.ROOT);
  const handleCreateStrategy = () => navigate(ROUTES.CONTENT.STRATEGY);
  const handleViewArticles = () => navigate(ROUTES.SCIENTIFIC_ARTICLES);
  
  return (
    <ContentLayout title="" noContainer>
      <div className="container mx-auto px-4">
        {/* Hero section */}
        <div className="py-10 mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-center mb-3 tracking-wide text-gray-800">
            Bem-vindo ao seu Dashboard
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Acesse recursos, crie conteúdo e organize sua estratégia digital em um só lugar
          </p>
        </div>
        
        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassContainer 
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={handleCreateScript}
            >
              <div className="flex flex-col items-center p-4">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Criar Roteiro</span>
              </div>
            </GlassContainer>
            
            <GlassContainer 
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={handleViewVideos}
            >
              <div className="flex flex-col items-center p-4">
                <Video className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Biblioteca de Vídeos</span>
              </div>
            </GlassContainer>
            
            <GlassContainer 
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={handleCreateStrategy}
            >
              <div className="flex flex-col items-center p-4">
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Estratégia</span>
              </div>
            </GlassContainer>
            
            <GlassContainer 
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={handleViewArticles}
            >
              <div className="flex flex-col items-center p-4">
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Artigos</span>
              </div>
            </GlassContainer>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Visão Geral</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Video className="h-4 w-4 mr-2 text-primary" />
                  Vídeos Publicados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">24</div>
                <div className="text-xs text-muted-foreground mt-1">+3 este mês</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  Tempo Total de Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">4h 32m</div>
                <div className="text-xs text-muted-foreground mt-1">+45min este mês</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-primary" />
                  Taxa de Engajamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">8.7%</div>
                <div className="text-xs text-muted-foreground mt-1">+1.2% que mês anterior</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                  Crescimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">12%</div>
                <div className="text-xs text-muted-foreground mt-1">Nos últimos 30 dias</div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Recent activity */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Atividades Recentes</h2>
          <GlassContainer>
            <Tabs defaultValue="content">
              <TabsList className="mb-4">
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="calendar">Calendário</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Novo roteiro criado</h3>
                      <p className="text-sm text-muted-foreground">Você criou "Como preparar a pele antes da maquiagem"</p>
                    </div>
                    <div className="text-xs text-muted-foreground ml-auto">12h atrás</div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Vídeo publicado</h3>
                      <p className="text-sm text-muted-foreground">Você publicou "Top 5 produtos para pele oleosa"</p>
                    </div>
                    <div className="text-xs text-muted-foreground ml-auto">1d atrás</div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Estratégia atualizada</h3>
                      <p className="text-sm text-muted-foreground">Você atualizou sua estratégia de conteúdo para Maio</p>
                    </div>
                    <div className="text-xs text-muted-foreground ml-auto">3d atrás</div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    Ver todas as atividades
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics">
                <div className="flex items-center justify-center h-48">
                  <p className="text-muted-foreground text-center">
                    O resumo analítico estará disponível em breve.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="calendar">
                <div className="flex items-center justify-center h-48">
                  <p className="text-muted-foreground text-center">
                    A visualização de calendário estará disponível em breve.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </GlassContainer>
        </div>
      </div>
    </ContentLayout>
  );
};

export default Dashboard;
