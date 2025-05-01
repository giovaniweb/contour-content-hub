
import React from "react";
import Layout from "@/components/Layout";
import ContentFeed from "@/components/ContentFeed";
import CreativeAgendaPreview from "@/components/CreativeAgendaPreview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Calendar, Sparkles, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";

const Dashboard: React.FC = () => {
  const { isAdmin } = usePermissions();
  const userName = "Usuário";  // Idealmente, isso viria do contexto de autenticação
  
  return (
    <Layout fullWidth>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-contourline-darkBlue feed-header">
            Bem-vindo ao ReelLine, {userName}
          </h1>
          <p className="text-contourline-darkBlue/70 mt-2">
            Seu estúdio criativo de conteúdo, em um clique.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed principal - 2/3 da largura em desktops */}
          <div className="lg:col-span-2">
            <ContentFeed />
          </div>
          
          {/* Sidebar - 1/3 da largura em desktops */}
          <div className="space-y-6">
            {/* Ações rápidas */}
            <Card className="overflow-hidden border-contourline-lightBlue/10">
              <CardHeader className="bg-gradient-to-r from-contourline-lightBlue/5 to-contourline-lightBlue/10 pb-3">
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/script-generator">
                    <Button variant="outline" className="w-full flex flex-col h-auto py-4">
                      <FileText className="h-6 w-6 mb-2" />
                      <span>Gerar Roteiro</span>
                    </Button>
                  </Link>
                  <Link to="/media-library">
                    <Button variant="outline" className="w-full flex flex-col h-auto py-4">
                      <Video className="h-6 w-6 mb-2" />
                      <span>Biblioteca</span>
                    </Button>
                  </Link>
                  <Link to="/calendar">
                    <Button variant="outline" className="w-full flex flex-col h-auto py-4">
                      <Calendar className="h-6 w-6 mb-2" />
                      <span>Agenda</span>
                    </Button>
                  </Link>
                  <Link to="/script-generator?type=bigIdea">
                    <Button variant="outline" className="w-full flex flex-col h-auto py-4">
                      <Sparkles className="h-6 w-6 mb-2" />
                      <span>Big Idea</span>
                    </Button>
                  </Link>
                </div>
                
                {/* Link para o painel de integração - apenas para admin */}
                {isAdmin() && (
                  <div className="mt-4">
                    <Link to="/admin/integrations">
                      <Button variant="ghost" className="w-full justify-start text-contourline-mediumBlue">
                        <Settings className="h-4 w-4 mr-2" />
                        <span>Painel de Integração (Admin)</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Preview da agenda */}
            <CreativeAgendaPreview />
            
            {/* Status de uso */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Desempenho</CardTitle>
                <CardDescription>
                  Seu histórico de atividade este mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-contourline-lightGray/30 rounded-lg p-4">
                    <div className="text-3xl font-bold text-contourline-mediumBlue">12</div>
                    <div className="text-sm text-contourline-darkBlue/70">Roteiros Criados</div>
                  </div>
                  <div className="bg-contourline-lightGray/30 rounded-lg p-4">
                    <div className="text-3xl font-bold text-contourline-mediumBlue">8</div>
                    <div className="text-sm text-contourline-darkBlue/70">Vídeos Salvos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
