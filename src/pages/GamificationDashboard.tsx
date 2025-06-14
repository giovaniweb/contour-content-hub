
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Award, 
  Star,
  Calendar,
  Users,
  Zap,
  BarChart3,
  Camera
} from "lucide-react";
import { useGamification } from '@/hooks/useGamification';
import GamificationDisplay from '@/components/gamification/GamificationDisplay';

const GamificationDashboard: React.FC = () => {
  const { userProgress, isLoading } = useGamification();

  const getNextLevelXP = () => {
    if (userProgress.xp_total < 100) return 100;
    if (userProgress.xp_total < 250) return 250;
    if (userProgress.xp_total < 500) return 500;
    return 1000; // Próximo marco
  };

  const getProgressPercentage = () => {
    const nextLevel = getNextLevelXP();
    const currentLevelMin = userProgress.xp_total < 100 ? 0 : 
                           userProgress.xp_total < 250 ? 100 : 
                           userProgress.xp_total < 500 ? 250 : 500;
    
    return ((userProgress.xp_total - currentLevelMin) / (nextLevel - currentLevelMin)) * 100;
  };

  const achievements = [
    {
      id: 'documentador',
      name: 'Documentador de Resultados',
      description: 'Upload sua primeira foto antes/depois',
      icon: Camera,
      earned: userProgress.badges.includes('Documentador de Resultados'),
      xp: 25,
      rarity: 'common'
    },
    {
      id: 'mestre',
      name: 'Mestre da Transformação',
      description: 'Upload 5 fotos antes/depois',
      icon: Trophy,
      earned: userProgress.badges.includes('Mestre da Transformação'),
      xp: 100,
      rarity: 'rare'
    },
    {
      id: 'consistente',
      name: 'Consistente',
      description: 'Upload fotos por 7 dias seguidos',
      icon: Calendar,
      earned: false,
      xp: 150,
      rarity: 'epic'
    },
    {
      id: 'inspirador',
      name: 'Inspirador',
      description: 'Tenha 10 fotos públicas',
      icon: Users,
      earned: false,
      xp: 200,
      rarity: 'legendary'
    }
  ];

  const getAchievementColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const weeklyProgress = [
    { day: 'Seg', xp: 25, uploads: 1 },
    { day: 'Ter', xp: 0, uploads: 0 },
    { day: 'Qua', xp: 50, uploads: 2 },
    { day: 'Qui', xp: 25, uploads: 1 },
    { day: 'Sex', xp: 0, uploads: 0 },
    { day: 'Sáb', xp: 75, uploads: 3 },
    { day: 'Dom', xp: userProgress.xp_total >= 25 ? 25 : 0, uploads: userProgress.xp_total >= 25 ? 1 : 0 }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-aurora-electric-purple border-t-transparent rounded-full mx-auto" />
          <p className="mt-2 text-white">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            🎯 Dashboard Gamificação
          </h1>
          <p className="text-gray-400 mt-2">
            Acompanhe seu progresso e conquistas na plataforma
          </p>
        </div>
      </div>

      {/* Progresso Principal */}
      <GamificationDisplay progress={userProgress} />

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-yellow-500/20">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">XP Total</p>
                <p className="text-2xl font-bold text-white">{userProgress.xp_total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/20">
                <Award className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Badges</p>
                <p className="text-2xl font-bold text-white">{userProgress.badges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/20">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Nível</p>
                <p className="text-2xl font-bold text-white">{userProgress.nivel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Para Próximo</p>
                <p className="text-2xl font-bold text-white">{getNextLevelXP() - userProgress.xp_total}</p>
                <p className="text-xs text-gray-500">XP restante</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com conteúdo detalhado */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Conquistas
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Progresso
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Atividades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="mt-6">
          <Card className="aurora-glass border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5" />
                Todas as Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border ${
                      achievement.earned 
                        ? 'bg-gradient-to-r ' + getAchievementColor(achievement.rarity) + ' border-white/20' 
                        : 'bg-slate-800/50 border-gray-600/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        achievement.earned ? 'bg-white/20' : 'bg-gray-600/20'
                      }`}>
                        <achievement.icon className={`h-5 w-5 ${
                          achievement.earned ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${
                            achievement.earned ? 'text-white' : 'text-gray-300'
                          }`}>
                            {achievement.name}
                          </h3>
                          {achievement.earned && (
                            <Badge variant="secondary" className="text-xs">
                              +{achievement.xp} XP
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${
                          achievement.earned ? 'text-white/80' : 'text-gray-400'
                        }`}>
                          {achievement.description}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`mt-2 text-xs ${
                            achievement.rarity === 'legendary' ? 'border-yellow-400 text-yellow-400' :
                            achievement.rarity === 'epic' ? 'border-purple-400 text-purple-400' :
                            achievement.rarity === 'rare' ? 'border-blue-400 text-blue-400' :
                            'border-gray-400 text-gray-400'
                          }`}
                        >
                          {achievement.rarity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="aurora-glass border-aurora-electric-purple/30">
              <CardHeader>
                <CardTitle className="text-white">Progresso do Nível</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Nível Atual: {userProgress.nivel}</span>
                    <span className="text-aurora-electric-purple">
                      {userProgress.xp_total}/{getNextLevelXP()} XP
                    </span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-3" />
                  <p className="text-xs text-gray-400">
                    Faltam {getNextLevelXP() - userProgress.xp_total} XP para o próximo nível
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="aurora-glass border-aurora-electric-purple/30">
              <CardHeader>
                <CardTitle className="text-white">Atividade Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end gap-2 h-32">
                  {weeklyProgress.map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div 
                        className="w-full bg-aurora-electric-purple rounded-t"
                        style={{ 
                          height: `${Math.max((day.xp / 75) * 80, 4)}px`,
                          opacity: day.xp > 0 ? 1 : 0.3
                        }}
                      />
                      <span className="text-xs text-gray-400">{day.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <Card className="aurora-glass border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="text-white">Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProgress.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                    <div className="p-2 rounded-full bg-yellow-500/20">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Badge Conquistada: {badge}</p>
                      <p className="text-sm text-gray-400">Você ganhou uma nova conquista!</p>
                    </div>
                    <Badge className="bg-aurora-electric-purple text-white">+25 XP</Badge>
                  </div>
                ))}
                
                {userProgress.badges.length === 0 && (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhuma atividade ainda</p>
                    <p className="text-sm text-gray-500">
                      Faça upload de fotos antes/depois para começar!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default GamificationDashboard;
