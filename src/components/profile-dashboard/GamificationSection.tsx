import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Award, Zap } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

const GamificationSection: React.FC = () => {
  const { userProgress, isLoading } = useGamification();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Bronze': return <Trophy className="h-5 w-5 text-amber-600" />;
      case 'Prata': return <Star className="h-5 w-5 text-gray-400" />;
      case 'Ouro': return <Award className="h-5 w-5 text-yellow-400" />;
      case 'Diamante': return <Zap className="h-5 w-5 text-blue-400" />;
      default: return <Trophy className="h-5 w-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Prata': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Ouro': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Diamante': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = () => {
    const { xp_total } = userProgress;
    if (xp_total < 100) return (xp_total / 100) * 100;
    if (xp_total < 250) return ((xp_total - 100) / 150) * 100;
    if (xp_total < 500) return ((xp_total - 250) / 250) * 100;
    return 100;
  };

  const getNextLevelXP = () => {
    const { xp_total } = userProgress;
    if (xp_total < 100) return 100;
    if (xp_total < 250) return 250;
    if (xp_total < 500) return 500;
    return 500;
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {getLevelIcon(userProgress.nivel)}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Meu Progresso
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nível e XP */}
        <div className="flex items-center justify-between">
          <div>
            <Badge className={`${getLevelColor(userProgress.nivel)} px-3 py-1 text-sm font-semibold border`}>
              {userProgress.nivel}
            </Badge>
            <p className="text-2xl font-bold mt-1">{userProgress.xp_total} XP</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Próximo nível</p>
            <p className="font-semibold">{getNextLevelXP()} XP</p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso para o próximo nível</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress 
            value={getProgressPercentage()} 
            className="h-3 bg-purple-100"
          />
        </div>

        {/* Badges */}
        {userProgress.badges.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Award className="h-4 w-4" />
              Minhas Conquistas
            </h4>
            <div className="flex flex-wrap gap-2">
              {userProgress.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100">
                  🏆 {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Dicas para Ganhar XP */}
        <div className="bg-white/50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Como Ganhar XP
          </h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• Assistir vídeos: +10 XP</p>
            <p>• Fazer downloads: +5 XP</p>
            <p>• Upload de fotos: +25 XP</p>
            <p>• Completar diagnóstico: +50 XP</p>
            <p>• Visualizar artigos: +15 XP</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationSection;