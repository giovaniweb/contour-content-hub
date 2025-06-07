
import React from "react";
import { motion } from "framer-motion";
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
  Activity,
  Sparkles,
  Plus
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen">
        <ContentLayout title="" noContainer>
          <div className="container mx-auto px-4">
            {/* Hero section */}
            <motion.div 
              className="py-10 mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6 flex justify-center">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="p-4 rounded-full bg-white/10 backdrop-blur-sm"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-light text-center mb-3 tracking-wide text-white">
                Bem-vindo ao seu Dashboard
              </h1>
              <p className="text-center text-white/90 max-w-2xl mx-auto">
                Acesse recursos, crie conteúdo e organize sua estratégia digital em um só lugar
              </p>
            </motion.div>
            
            {/* Quick actions */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-xl font-medium mb-4 text-white/90">Ações Rápidas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GlassContainer 
                    className="cursor-pointer hover:bg-white/20 transition-all border-white/20"
                    onClick={handleCreateScript}
                  >
                    <div className="flex flex-col items-center p-4">
                      <div className="p-3 rounded-full bg-white/10 mb-3">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white">Criar Roteiro</span>
                    </div>
                  </GlassContainer>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GlassContainer 
                    className="cursor-pointer hover:bg-white/20 transition-all border-white/20"
                    onClick={handleViewVideos}
                  >
                    <div className="flex flex-col items-center p-4">
                      <div className="p-3 rounded-full bg-white/10 mb-3">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white">Biblioteca de Vídeos</span>
                    </div>
                  </GlassContainer>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GlassContainer 
                    className="cursor-pointer hover:bg-white/20 transition-all border-white/20"
                    onClick={handleCreateStrategy}
                  >
                    <div className="flex flex-col items-center p-4">
                      <div className="p-3 rounded-full bg-white/10 mb-3">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white">Estratégia</span>
                    </div>
                  </GlassContainer>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GlassContainer 
                    className="cursor-pointer hover:bg-white/20 transition-all border-white/20"
                    onClick={handleViewArticles}
                  >
                    <div className="flex flex-col items-center p-4">
                      <div className="p-3 rounded-full bg-white/10 mb-3">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white">Artigos</span>
                    </div>
                  </GlassContainer>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Stats cards */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-xl font-medium mb-4 text-white/90">Visão Geral</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center text-white/90">
                      <Video className="h-4 w-4 mr-2 text-white" />
                      Vídeos Publicados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-white">24</div>
                    <div className="text-xs text-white/70 mt-1">+3 este mês</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center text-white/90">
                      <Clock className="h-4 w-4 mr-2 text-white" />
                      Tempo Total de Conteúdo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-white">4h 32m</div>
                    <div className="text-xs text-white/70 mt-1">+45min este mês</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center text-white/90">
                      <Zap className="h-4 w-4 mr-2 text-white" />
                      Taxa de Engajamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-white">8.7%</div>
                    <div className="text-xs text-white/70 mt-1">+1.2% que mês anterior</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center text-white/90">
                      <TrendingUp className="h-4 w-4 mr-2 text-white" />
                      Crescimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-white">12%</div>
                    <div className="text-xs text-white/70 mt-1">Nos últimos 30 dias</div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            
            {/* Recent activity */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="text-xl font-medium mb-4 text-white/90">Atividades Recentes</h2>
              <GlassContainer className="bg-white/10 border-white/20">
                <Tabs defaultValue="content">
                  <TabsList className="mb-4 bg-white/10 border-white/20">
                    <TabsTrigger value="content" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Conteúdo</TabsTrigger>
                    <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Analytics</TabsTrigger>
                    <TabsTrigger value="calendar" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Calendário</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">Novo roteiro criado</h3>
                          <p className="text-sm text-white/70">Você criou "Como preparar a pele antes da maquiagem"</p>
                        </div>
                        <div className="text-xs text-white/70">12h atrás</div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <Video className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">Vídeo publicado</h3>
                          <p className="text-sm text-white/70">Você publicou "Top 5 produtos para pele oleosa"</p>
                        </div>
                        <div className="text-xs text-white/70">1d atrás</div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">Estratégia atualizada</h3>
                          <p className="text-sm text-white/70">Você atualizou sua estratégia de conteúdo para Maio</p>
                        </div>
                        <div className="text-xs text-white/70">3d atrás</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        Ver todas as atividades
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics">
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-white/50 mx-auto mb-4" />
                        <p className="text-white/70 text-center">
                          O resumo analítico estará disponível em breve.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="calendar">
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <Clock className="h-12 w-12 text-white/50 mx-auto mb-4" />
                        <p className="text-white/70 text-center">
                          A visualização de calendário estará disponível em breve.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </GlassContainer>
            </motion.div>
          </div>
        </ContentLayout>
      </div>
    </div>
  );
};

export default Dashboard;
