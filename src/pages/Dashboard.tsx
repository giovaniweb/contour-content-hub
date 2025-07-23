import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  FileText, 
  Video, 
  Calendar, 
  Crown,
  BrainCircuit,
  PenTool,
  Image,
  Palette,
  BookOpen,
  Wrench,
  Trophy,
  Target,
  Flame,
  Star,
  ChevronRight,
  Play,
  Download,
  Users,
  TrendingUp,
  Heart,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados para dados reais
  const [gamificationData, setGamificationData] = useState({
    xp_total: 0,
    current_streak: 0,
    level: 'Iniciante',
    videos_watched: 0,
    diagnostics_completed: 0,
    articles_viewed: 0,
    photos_uploaded: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [contentStats, setContentStats] = useState({
    videos: 0,
    photos: 0,
    articles: 0,
    equipments: 0
  });
  const [loading, setLoading] = useState(true);

  // Buscar dados reais do usuário
  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados de gamificação
      const { data: gamification } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (gamification) {
        // Determinar nível baseado no XP
        const level = calculateLevel(gamification.xp_total);
        
        setGamificationData({
          xp_total: gamification.xp_total || 0,
          current_streak: 1, // Valor padrão por enquanto
          level: level,
          videos_watched: 0, // Calculado separadamente
          diagnostics_completed: 0, // Calculado separadamente  
          articles_viewed: 0, // Calculado separadamente
          photos_uploaded: 0 // Calculado separadamente
        });
      }

      // Buscar atividades recentes
      const { data: activities } = await supabase
        .from('user_actions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4);

      if (activities) {
        setRecentActivity(activities.map(activity => ({
          action: formatActivityAction(activity.action_type, activity.target_type),
          time: formatTimeAgo(activity.created_at),
          points: activity.xp_awarded || 0
        })));
      }

      // Buscar contadores específicos de atividades
      const { count: videoCount } = await supabase
        .from('user_actions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('action_type', 'video_watch');

      const { count: diagnosticCount } = await supabase
        .from('user_actions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('action_type', 'diagnostic_complete');

      // Atualizar gamification data com contadores reais
      setGamificationData(prev => ({
        ...prev,
        videos_watched: videoCount || 0,
        diagnostics_completed: diagnosticCount || 0
      }));

      // Buscar estatísticas de conteúdo
      const [videosRes, photosRes, articlesRes, equipmentsRes] = await Promise.all([
        supabase.from('videos').select('*', { count: 'exact', head: true }),
        supabase.from('equipment_photos').select('*', { count: 'exact', head: true }),
        supabase.from('documentos_tecnicos').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
        supabase.from('equipamentos').select('*', { count: 'exact', head: true }).eq('ativo', true)
      ]);

      setContentStats({
        videos: videosRes.count || 0,
        photos: photosRes.count || 0,
        articles: articlesRes.count || 0,
        equipments: equipmentsRes.count || 0
      });

    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      // Definir valores padrão em caso de erro
      setGamificationData({
        xp_total: 0,
        current_streak: 0,
        level: 'Iniciante',
        videos_watched: 0,
        diagnostics_completed: 0,
        articles_viewed: 0,
        photos_uploaded: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateLevel = (xp: number) => {
    if (xp >= 5000) return 'Especialista';
    if (xp >= 2000) return 'Avançado';
    if (xp >= 500) return 'Intermediário';
    return 'Iniciante';
  };

  const formatActivityAction = (actionType: string, targetType: string) => {
    const actions = {
      video_watch: 'Assistiu vídeo',
      video_download: 'Baixou vídeo',
      diagnostic_complete: 'Completou diagnóstico',
      article_view: 'Visualizou artigo',
      photo_upload: 'Enviou foto',
      equipment_view: 'Visualizou equipamento'
    };
    
    return actions[actionType] || 'Atividade no sistema';
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) return `${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    if (diffInHours > 0) return `${diffInHours}h atrás`;
    return 'Agora há pouco';
  };

  const aiTools = [
    {
      icon: Crown,
      title: "Mestre da Beleza",
      description: "IA especialista em estética e beleza",
      path: "/mestre-da-beleza",
      gradient: "from-yellow-500 to-orange-500",
      badge: "IA Premium",
      isPopular: true
    },
    {
      icon: BrainCircuit,
      title: "Consultor de Marketing",
      description: "Estratégias de marketing personalizadas",
      path: "/marketing-consultant",
      gradient: "from-purple-500 to-pink-500",
      badge: "Estratégia"
    },
    {
      icon: PenTool,
      title: "Fluida Roteirista",
      description: "Criação de roteiros e conteúdos",
      path: "/fluidaroteirista",
      gradient: "from-blue-500 to-cyan-500",
      badge: "Criativo"
    }
  ];

  const contentTools = [
    {
      icon: Video,
      title: "Biblioteca de Vídeos",
      description: "Vídeos profissionais para seu conteúdo",
      path: "/videos",
      count: `${contentStats.videos}+ vídeos`,
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: Image,
      title: "Galeria de Fotos",
      description: "Fotos de alta qualidade para seus posts",
      path: "/photos",
      count: `${contentStats.photos}+ fotos`,
      gradient: "from-green-500 to-blue-500"
    },
    {
      icon: Palette,
      title: "Artes Gráficas",
      description: "Designs e templates prontos",
      path: "/arts",
      count: "800+ artes",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: BookOpen,
      title: "Artigos Científicos",
      description: "Base científica para seus conteúdos",
      path: "/scientific-articles",
      count: `${contentStats.articles}+ artigos`,
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const quickActions = [
    {
      icon: Calendar,
      title: "Planejar Conteúdo",
      description: "Organize sua estratégia de conteúdo",
      path: "/content-planner",
      color: "text-cyan-400"
    },
    {
      icon: Wrench,
      title: "Equipamentos",
      description: "Catálogo completo de equipamentos",
      path: "/equipments",
      color: "text-green-400"
    },
    {
      icon: Download,
      title: "Meus Downloads",
      description: "Gerencie seus arquivos baixados",
      path: "/my-documents",
      color: "text-orange-400"
    }
  ];

  const achievements = [
    { icon: Flame, label: "Streak Atual", value: `${gamificationData.current_streak} dias`, color: "text-orange-400" },
    { icon: Star, label: "Pontos Totais", value: gamificationData.xp_total.toLocaleString(), color: "text-yellow-400" },
    { icon: Trophy, label: "Nível", value: gamificationData.level, color: "text-purple-400" },
    { icon: Target, label: "Vídeos Assistidos", value: gamificationData.videos_watched.toString(), color: "text-blue-400" }
  ];

  const recentActivityDisplay = recentActivity.length > 0 ? recentActivity : [
    { action: "Nenhuma atividade recente", time: "", points: 0 }
  ];

  if (loading) {
    return (
      <div className="relative z-10 p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/70">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-8"
      >
        <h1 className="text-3xl md:text-5xl font-light text-white mb-4">
          Bem-vindo de volta,{' '}
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-medium">
            {user?.nome || 'Usuário'}
          </span>
        </h1>
        
        <p className="text-white/80 text-lg max-w-2xl mx-auto mb-6">
          Seu hub completo para criar conteúdo profissional na área da estética
        </p>

        {/* Gamification Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
              </div>
              <div className="text-lg font-bold text-white">
                {achievement.value}
              </div>
              <div className="text-white/60 text-xs">
                {achievement.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Tools Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light text-white flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
            Ferramentas de IA
          </h2>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            Novidade
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiTools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer h-full hover:shadow-xl transition-all duration-300 aurora-glass-enhanced aurora-border-enhanced relative overflow-hidden group"
                onClick={() => navigate(tool.path)}
              >
                {tool.isPopular && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-yellow-500 text-yellow-900 text-xs">
                      Popular
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className={`w-16 h-16 mb-4 rounded-xl bg-gradient-to-r ${tool.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <Badge variant="outline" className="mb-3 text-xs">
                    {tool.badge}
                  </Badge>
                  
                  <h3 className="text-lg font-medium text-white mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center text-purple-400 text-sm group-hover:translate-x-1 transition-transform duration-300">
                    <Play className="w-4 h-4 mr-1" />
                    Usar agora
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Content Library Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-2xl font-light text-white mb-6 flex items-center">
          <Download className="w-6 h-6 mr-2 text-blue-400" />
          Biblioteca de Conteúdo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentTools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer h-full hover:shadow-lg transition-all duration-300 aurora-glass-enhanced aurora-border-enhanced group"
                onClick={() => navigate(tool.path)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-lg bg-gradient-to-r ${tool.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-base font-medium text-white mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-3">
                    {tool.description}
                  </p>
                  
                  <Badge variant="secondary" className="text-xs">
                    {tool.count}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="h-full aurora-glass-enhanced aurora-border-enhanced">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
                  onClick={() => navigate(action.path)}
                >
                  <action.icon className={`w-5 h-5 mr-3 ${action.color}`} />
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{action.title}</div>
                    <div className="text-white/60 text-xs">{action.description}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="h-full aurora-glass-enhanced aurora-border-enhanced">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivityDisplay.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <div className="flex-1">
                    <div className="text-white text-sm">{activity.action}</div>
                    {activity.time && <div className="text-white/60 text-xs">{activity.time}</div>}
                  </div>
                  {activity.points > 0 && (
                    <Badge variant="secondary" className="text-yellow-300 bg-yellow-500/20">
                      +{activity.points} pts
                    </Badge>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="text-center py-8"
      >
        <Card className="p-8 max-w-3xl mx-auto aurora-glass-enhanced aurora-border-enhanced">
          <CardContent className="p-0">
            <h2 className="text-2xl font-medium text-white mb-4">
              Continue sua jornada de{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">sucesso</span>
            </h2>
            <p className="text-white/70 mb-6">
              Explore todas as ferramentas disponíveis e leve seu conteúdo para o próximo nível
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate("/mestre-da-beleza")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0"
              >
                <Crown className="w-5 h-5 mr-2" />
                Usar Mestre da Beleza
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate("/content-planner")}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Planejar Conteúdo
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;