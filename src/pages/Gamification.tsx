import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  Star, 
  Trophy, 
  Target, 
  Zap, 
  Camera,
  Video,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  Crown,
  Medal
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/hooks/useGamification';
import GamificationDisplay from '@/components/gamification/GamificationDisplay';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  xp: number;
  category: 'content' | 'social' | 'learning' | 'expert';
  requirement: number;
  current: number;
  unlocked: boolean;
}

const Gamification = () => {
  const { user } = useAuth();
  const { userProgress, isLoading: gamificationLoading } = useGamification();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState({
    videosWatched: 0,
    photosUploaded: 0,
    articlesRead: 0,
    connectionsCount: 0,
    scriptsCreated: 0,
    monthlyRank: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserStats();
      generateAchievements();
    }
  }, [user, userProgress]);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      
      // Buscar estatísticas do usuário
      const [
        videosResult,
        photosResult,
        articlesResult,
        scriptsResult,
        rankingResult
      ] = await Promise.all([
        // Videos assistidos (se tivermos tabela de video_views)
        supabase.from('videos').select('id').limit(1),
        // Fotos before/after
        supabase.from('before_after_photos').select('id').eq('user_id', user.id),
        // Artigos lidos (se tivermos tabela de article_views)
        supabase.from('blog_posts').select('id').limit(1),
        // Scripts criados
        supabase.from('approved_scripts').select('id').eq('user_id', user.id),
        // Total de usuários para ranking
        supabase.from('user_gamification').select('id, xp_total').order('xp_total', { ascending: false })
      ]);

      const photosCount = photosResult.data?.length || 0;
      const scriptsCount = scriptsResult.data?.length || 0;
      const allUsers = rankingResult.data || [];
      const userRank = allUsers.findIndex(u => u.id === user.id) + 1;

      setUserStats({
        videosWatched: 0, // Implementar quando tivermos tracking de vídeos
        photosUploaded: photosCount,
        articlesRead: 0, // Implementar quando tivermos tracking de artigos
        connectionsCount: 0, // Implementar quando tivermos sistema de conexões
        scriptsCreated: scriptsCount,
        monthlyRank: userRank,
        totalUsers: allUsers.length
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  const generateAchievements = () => {
    if (!userProgress) return;

    const achievementsList: Achievement[] = [
      {
        id: 'first-video',
        title: 'Primeiro Vídeo',
        description: 'Assistiu seu primeiro vídeo educativo',
        icon: Video,
        xp: 50,
        category: 'learning',
        requirement: 1,
        current: userStats.videosWatched,
        unlocked: userStats.videosWatched >= 1
      },
      {
        id: 'video-enthusiast',
        title: 'Entusiasta de Vídeos',
        description: 'Assistiu 25 vídeos educativos',
        icon: Video,
        xp: 300,
        category: 'learning',
        requirement: 25,
        current: userStats.videosWatched,
        unlocked: userStats.videosWatched >= 25
      },
      {
        id: 'video-expert',
        title: 'Expert em Conteúdo',
        description: 'Assistiu 100 vídeos educativos',
        icon: Crown,
        xp: 1000,
        category: 'learning',
        requirement: 100,
        current: userStats.videosWatched,
        unlocked: userStats.videosWatched >= 100
      },
      {
        id: 'first-photo',
        title: 'Primeira Documentação',
        description: 'Enviou seu primeiro antes/depois',
        icon: Camera,
        xp: 100,
        category: 'content',
        requirement: 1,
        current: userStats.photosUploaded,
        unlocked: userStats.photosUploaded >= 1
      },
      {
        id: 'photographer',
        title: 'Fotógrafo Profissional',
        description: 'Documentou 10 casos antes/depois',
        icon: Camera,
        xp: 500,
        category: 'content',
        requirement: 10,
        current: userStats.photosUploaded,
        unlocked: userStats.photosUploaded >= 10
      },
      {
        id: 'case-master',
        title: 'Mestre dos Casos',
        description: 'Documentou 50 casos antes/depois',
        icon: Medal,
        xp: 2000,
        category: 'content',
        requirement: 50,
        current: userStats.photosUploaded,
        unlocked: userStats.photosUploaded >= 50
      },
      {
        id: 'first-script',
        title: 'Primeiro Roteiro',
        description: 'Criou seu primeiro roteiro aprovado',
        icon: FileText,
        xp: 150,
        category: 'content',
        requirement: 1,
        current: userStats.scriptsCreated,
        unlocked: userStats.scriptsCreated >= 1
      },
      {
        id: 'script-writer',
        title: 'Roteirista',
        description: 'Criou 5 roteiros aprovados',
        icon: FileText,
        xp: 400,
        category: 'content',
        requirement: 5,
        current: userStats.scriptsCreated,
        unlocked: userStats.scriptsCreated >= 5
      },
      {
        id: 'knowledge-seeker',
        title: 'Buscador de Conhecimento',
        description: 'Leu 15 artigos técnicos',
        icon: Star,
        xp: 250,
        category: 'learning',
        requirement: 15,
        current: userStats.articlesRead,
        unlocked: userStats.articlesRead >= 15
      },
      {
        id: 'xp-collector',
        title: 'Colecionador de XP',
        description: 'Acumulou 1000 pontos de experiência',
        icon: Zap,
        xp: 200,
        category: 'expert',
        requirement: 1000,
        current: userProgress.xp_total || 0,
        unlocked: (userProgress.xp_total || 0) >= 1000
      }
    ];

    setAchievements(achievementsList);
  };

  const getLevel = (xp: number) => {
    if (xp < 100) return 1;
    if (xp < 300) return 2;
    if (xp < 600) return 3;
    if (xp < 1000) return 4;
    if (xp < 1500) return 5;
    if (xp < 2500) return 6;
    if (xp < 4000) return 7;
    if (xp < 6000) return 8;
    if (xp < 10000) return 9;
    return 10;
  };

  const getNextLevelXP = (level: number) => {
    const thresholds = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000, 15000];
    return thresholds[level] || 15000;
  };

  const currentLevel = getLevel(userProgress?.xp_total || 0);
  const nextLevelXP = getNextLevelXP(currentLevel);
  const currentXP = userProgress?.xp_total || 0;
  const progressPercent = currentLevel === 10 ? 100 : (currentXP / nextLevelXP) * 100;

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  if (gamificationLoading || loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          🏆 Sistema de Gamificação
        </h1>
        <p className="text-gray-400 mt-2">
          Acompanhe seu progresso e conquiste novas conquistas na sua jornada profissional
        </p>
      </div>

      {/* Gamification Display */}
      {userProgress && (
        <GamificationDisplay progress={userProgress} />
      )}

      {/* Level and XP Section */}
      <Card className="aurora-glass border-aurora-electric-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-white">
            <Zap className="h-6 w-6 text-yellow-500" />
            <span>Nível {currentLevel}</span>
            {currentLevel === 10 && <Crown className="h-5 w-5 text-yellow-500" />}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {currentLevel === 10 ? 
              'Parabéns! Você atingiu o nível máximo!' :
              `${currentXP} / ${nextLevelXP} XP para o próximo nível`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-3" />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>{currentXP} XP</span>
            {currentLevel < 10 && <span>{nextLevelXP - currentXP} XP restantes</span>}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4 text-center">
            <Video className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{userStats.videosWatched}</div>
            <div className="text-xs text-gray-400">Vídeos Assistidos</div>
          </CardContent>
        </Card>
        
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4 text-center">
            <Camera className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{userStats.photosUploaded}</div>
            <div className="text-xs text-gray-400">Casos Documentados</div>
          </CardContent>
        </Card>
        
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{userStats.scriptsCreated}</div>
            <div className="text-xs text-gray-400">Roteiros Criados</div>
          </CardContent>
        </Card>
        
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">#{userStats.monthlyRank || 'N/A'}</div>
            <div className="text-xs text-gray-400">Ranking Mensal</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="aurora-glass border-aurora-electric-purple/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Award className="h-6 w-6 text-yellow-500" />
            🏅 Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unlocked" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger value="unlocked">
                Conquistadas ({unlockedAchievements.length})
              </TabsTrigger>
              <TabsTrigger value="locked">
                Em Progresso ({lockedAchievements.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unlocked" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {unlockedAchievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <Card key={achievement.id} className="border-green-500/50 bg-green-500/10">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-green-500/20">
                            <Icon className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{achievement.title}</h3>
                            <p className="text-sm text-gray-400">{achievement.description}</p>
                            <Badge variant="outline" className="mt-2 text-green-400 border-green-400">
                              +{achievement.xp} XP
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="locked" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {lockedAchievements.map((achievement) => {
                  const Icon = achievement.icon;
                  const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);
                  
                  return (
                    <Card key={achievement.id} className="aurora-glass border-aurora-electric-purple/30">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 rounded-full bg-gray-500/20">
                            <Icon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{achievement.title}</h3>
                            <p className="text-sm text-gray-400">{achievement.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>Progresso</span>
                            <span>{achievement.current}/{achievement.requirement}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="text-xs text-gray-400">
                            Recompensa: {achievement.xp} XP
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Ranking */}
      {userStats.monthlyRank > 0 && (
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-white">
              <Trophy className="h-6 w-6 text-yellow-500" />
              🏆 Ranking Mensal
            </CardTitle>
            <CardDescription className="text-gray-400">
              Sua posição no ranking deste mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-yellow-400 text-lg">#{userStats.monthlyRank}</span>
                  <span className="font-medium text-white">{user?.nome}</span>
                </div>
                <span className="text-sm text-gray-400">{currentXP} XP</span>
              </div>
              <div className="text-center text-sm text-gray-400">
                {userStats.monthlyRank <= Math.ceil(userStats.totalUsers * 0.1) 
                  ? 'Você está no top 10% dos usuários mais ativos! 🌟'
                  : `Posição ${userStats.monthlyRank} de ${userStats.totalUsers} usuários ativos`
                }
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default Gamification;