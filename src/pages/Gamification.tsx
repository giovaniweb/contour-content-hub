import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Star, Trophy, Target, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Gamification = () => {
  const { user } = useAuth();
  
  const currentLevel = 5;
  const currentXP = 2480;
  const nextLevelXP = 3000;
  const progressPercent = (currentXP / nextLevelXP) * 100;

  const achievements = [
    {
      id: 1,
      title: "Primeiro Roteiro",
      description: "Criou seu primeiro roteiro",
      icon: Star,
      completed: true,
      xp: 100
    },
    {
      id: 2,
      title: "Especialista em Vídeos",
      description: "Assistiu 50 vídeos",
      icon: Trophy,
      completed: true,
      xp: 500
    },
    {
      id: 3,
      title: "Fotógrafo",
      description: "Enviou 10 fotos antes/depois",
      icon: Award,
      completed: false,
      xp: 250,
      progress: 8,
      total: 10
    },
    {
      id: 4,
      title: "Networking",
      description: "Conectou com 5 colegas",
      icon: Target,
      completed: false,
      xp: 200,
      progress: 2,
      total: 5
    }
  ];

  const weeklyChallenge = {
    title: "Desafio da Semana",
    description: "Complete 3 roteiros esta semana",
    progress: 1,
    total: 3,
    xp: 300
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gamificação</h1>
        <p className="text-muted-foreground">
          Acompanhe seu progresso e conquiste novas conquistas
        </p>
      </div>

      {/* Seção de Nível e XP */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Nível {currentLevel}</span>
          </CardTitle>
          <CardDescription>
            {currentXP} / {nextLevelXP} XP para o próximo nível
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{currentXP} XP</span>
            <span>{nextLevelXP - currentXP} XP restantes</span>
          </div>
        </CardContent>
      </Card>

      {/* Desafio da Semana */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span>{weeklyChallenge.title}</span>
          </CardTitle>
          <CardDescription>
            {weeklyChallenge.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{weeklyChallenge.progress}/{weeklyChallenge.total}</span>
            </div>
            <Progress value={(weeklyChallenge.progress / weeklyChallenge.total) * 100} />
            <p className="text-sm text-muted-foreground">
              Recompensa: {weeklyChallenge.xp} XP
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Conquistas */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Conquistas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <Card key={achievement.id} className={achievement.completed ? 'border-green-200 bg-green-50' : ''}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${achievement.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Icon className={`h-5 w-5 ${achievement.completed ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </div>
                    {achievement.completed && (
                      <div className="ml-auto">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Conquistado
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {achievement.completed ? (
                    <p className="text-sm text-green-600 font-medium">
                      +{achievement.xp} XP conquistados
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {achievement.progress !== undefined && achievement.total !== undefined && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>Progresso</span>
                            <span>{achievement.progress}/{achievement.total}</span>
                          </div>
                          <Progress value={(achievement.progress / achievement.total) * 100} />
                        </>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Recompensa: {achievement.xp} XP
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Ranking Mensal</span>
          </CardTitle>
          <CardDescription>
            Sua posição no ranking deste mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-yellow-600">#3</span>
                <span className="font-medium">{user?.nome}</span>
              </div>
              <span className="text-sm text-muted-foreground">{currentXP} XP</span>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Você está no top 10% dos usuários mais ativos!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Gamification;