
import React from "react";
import { motion } from "framer-motion";
import ContentLayout from "@/components/layout/ContentLayout";
import GlassContainer from "@/components/ui/GlassContainer";
import AuroraCard from "@/components/ui/AuroraCard";
import AuroraButton from "@/components/ui/AuroraButton";
import AuroraParticles from "@/components/ui/AuroraParticles";
import EmotionalRating from "@/components/ui/EmotionalRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Heart,
  Wand2,
  Palette,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";
import AuroraCommandPalette from "@/components/AuroraCommandPalette";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [emotionalRating, setEmotionalRating] = React.useState(8);
  
  // Quick action handlers
  const handleCreateScript = () => navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR);
  const handleViewVideos = () => navigate(ROUTES.VIDEOS.ROOT);
  const handleCreateStrategy = () => navigate(ROUTES.CONTENT.STRATEGY);
  const handleViewArticles = () => navigate(ROUTES.SCIENTIFIC_ARTICLES);

  const handleCommandSubmit = (command: string) => {
    console.log('Aurora command:', command);
    // Handle command logic here
  };

  return (
    <div className="min-h-screen aurora-gradient-bg relative overflow-hidden">
      {/* Aurora Particles */}
      <AuroraParticles count={25} active={true} />
      
      {/* Ambient light effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #C4B5FD 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen">
        <ContentLayout title="" noContainer>
          <div className="container mx-auto px-4">
            {/* Hero section with Aurora Command Palette */}
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
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="p-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                  style={{ boxShadow: '0 0 40px rgba(196, 181, 253, 0.4)' }}
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
              </div>
              
              <h1 className="aurora-heading text-4xl md:text-5xl text-center mb-4 text-white">
                Bem-vindo ao{' '}
                <span className="aurora-text-gradient font-semibold">Fluida</span>
              </h1>
              <p className="aurora-body text-center text-white/90 max-w-2xl mx-auto mb-8">
                Sua plataforma mágica para criação de conteúdo com inteligência emocional
              </p>

              {/* Aurora Command Palette */}
              <div className="max-w-2xl mx-auto mb-6">
                <AuroraCommandPalette
                  onSubmit={handleCommandSubmit}
                  suggestions={[
                    "Criar estratégia de conteúdo mágica",
                    "Gerar roteiro emocional para vídeo",
                    "Analisar sentimentos do público",
                    "Ideias criativas para Instagram",
                    "Planejar campanha inspiradora"
                  ]}
                  placeholder="Digite sua inspiração criativa..."
                />
              </div>

              {/* Emotional Rating */}
              <div className="max-w-md mx-auto">
                <p className="aurora-body text-white/80 mb-3">Como você está se sentindo hoje?</p>
                <EmotionalRating 
                  value={emotionalRating} 
                  onChange={setEmotionalRating} 
                />
              </div>
            </motion.div>
            
            {/* Quick actions with Aurora Cards */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="aurora-heading text-2xl font-medium mb-6 text-white/90 flex items-center gap-3">
                <Wand2 className="w-6 h-6 text-aurora-lavender" />
                Ações Mágicas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <AuroraCard 
                  floating
                  onClick={handleCreateScript}
                  className="text-center cursor-pointer"
                >
                  <div className="p-4">
                    <motion.div 
                      className="p-4 rounded-full bg-gradient-to-r from-aurora-lavender to-aurora-teal mx-auto mb-4 w-fit"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <FileText className="h-6 w-6 text-white" />
                    </motion.div>
                    <span className="aurora-body text-white font-medium">Criar Roteiro</span>
                  </div>
                </AuroraCard>
                
                <AuroraCard 
                  floating
                  onClick={handleViewVideos}
                  className="text-center cursor-pointer"
                >
                  <div className="p-4">
                    <motion.div 
                      className="p-4 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-turquoise mx-auto mb-4 w-fit"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Video className="h-6 w-6 text-white" />
                    </motion.div>
                    <span className="aurora-body text-white font-medium">Biblioteca Mágica</span>
                  </div>
                </AuroraCard>
                
                <AuroraCard 
                  floating
                  onClick={handleCreateStrategy}
                  className="text-center cursor-pointer"
                >
                  <div className="p-4">
                    <motion.div 
                      className="p-4 rounded-full bg-gradient-to-r from-aurora-deep-violet to-aurora-soft-pink mx-auto mb-4 w-fit"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <BarChart3 className="h-6 w-6 text-white" />
                    </motion.div>
                    <span className="aurora-body text-white font-medium">Estratégia</span>
                  </div>
                </AuroraCard>
                
                <AuroraCard 
                  floating
                  onClick={handleViewArticles}
                  className="text-center cursor-pointer"
                >
                  <div className="p-4">
                    <motion.div 
                      className="p-4 rounded-full bg-gradient-to-r from-aurora-soft-pink to-aurora-electric-blue mx-auto mb-4 w-fit"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <MessageSquare className="h-6 w-6 text-white" />
                    </motion.div>
                    <span className="aurora-body text-white font-medium">Artigos</span>
                  </div>
                </AuroraCard>
              </div>
            </motion.div>
            
            {/* Stats cards with Aurora design */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="aurora-heading text-2xl font-medium mb-6 text-white/90 flex items-center gap-3">
                <Palette className="w-6 h-6 text-aurora-teal" />
                Visão Criativa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AuroraCard glowing>
                  <div className="text-center">
                    <Video className="h-8 w-8 mx-auto mb-3 text-aurora-lavender" />
                    <div className="text-3xl font-light text-white mb-2">24</div>
                    <div className="aurora-body text-white/70">Vídeos Inspiradores</div>
                    <div className="text-xs text-aurora-teal mt-1">+3 este mês</div>
                  </div>
                </AuroraCard>
                
                <AuroraCard glowing>
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto mb-3 text-aurora-teal" />
                    <div className="text-3xl font-light text-white mb-2">4h 32m</div>
                    <div className="aurora-body text-white/70">Tempo Criativo</div>
                    <div className="text-xs text-aurora-soft-pink mt-1">+45min este mês</div>
                  </div>
                </AuroraCard>
                
                <AuroraCard glowing>
                  <div className="text-center">
                    <Heart className="h-8 w-8 mx-auto mb-3 text-aurora-soft-pink" />
                    <div className="text-3xl font-light text-white mb-2">8.7%</div>
                    <div className="aurora-body text-white/70">Conexão Emocional</div>
                    <div className="text-xs text-aurora-lavender mt-1">+1.2% engajamento</div>
                  </div>
                </AuroraCard>
                
                <AuroraCard glowing>
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-3 text-aurora-electric-blue" />
                    <div className="text-3xl font-light text-white mb-2">12%</div>
                    <div className="aurora-body text-white/70">Crescimento Mágico</div>
                    <div className="text-xs text-aurora-turquoise mt-1">Últimos 30 dias</div>
                  </div>
                </AuroraCard>
              </div>
            </motion.div>
            
            {/* Recent activity with Aurora theme */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="aurora-heading text-2xl font-medium mb-6 text-white/90 flex items-center gap-3">
                <Users className="w-6 h-6 text-aurora-electric-blue" />
                Atividades Recentes
              </h2>
              <GlassContainer aurora>
                <Tabs defaultValue="content">
                  <TabsList className="mb-6 bg-white/10 border-white/20 backdrop-blur-md">
                    <TabsTrigger value="content" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Criativo</TabsTrigger>
                    <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Insights</TabsTrigger>
                    <TabsTrigger value="calendar" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Agenda</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content">
                    <div className="space-y-4">
                      {[
                        { icon: FileText, title: "Roteiro inspirador criado", desc: "Como despertar emoções na maquiagem", time: "12h atrás", color: "aurora-lavender" },
                        { icon: Video, title: "Vídeo mágico publicado", desc: "Top 5 produtos para pele radiante", time: "1d atrás", color: "aurora-teal" },
                        { icon: Activity, title: "Estratégia emocional atualizada", desc: "Campanha de autoestima para Maio", time: "3d atrás", color: "aurora-soft-pink" }
                      ].map((activity, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-white/10 cursor-pointer"
                          whileHover={{ x: 10 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-${activity.color} to-aurora-turquoise flex items-center justify-center`}>
                            <activity.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="aurora-body font-medium text-white">{activity.title}</h3>
                            <p className="aurora-body text-white/70">{activity.desc}</p>
                          </div>
                          <div className="aurora-body text-white/60 text-sm">{activity.time}</div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <AuroraButton variant="secondary" size="sm">
                        Ver todas as atividades
                      </AuroraButton>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics">
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                          <BarChart3 className="h-16 w-16 text-aurora-lavender mx-auto mb-4" />
                        </motion.div>
                        <p className="aurora-body text-white/70 text-center">
                          Insights emocionais estão sendo preparados...
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="calendar">
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Clock className="h-16 w-16 text-aurora-teal mx-auto mb-4" />
                        </motion.div>
                        <p className="aurora-body text-white/70 text-center">
                          Agenda criativa em desenvolvimento...
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
