
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Award } from "lucide-react";
import { UserProgress } from '@/hooks/useGamification';

interface GamificationDisplayProps {
  progress: UserProgress;
  compact?: boolean;
}

const GamificationDisplay: React.FC<GamificationDisplayProps> = ({ 
  progress, 
  compact = false 
}) => {
  const getLevelIcon = (nivel: string) => {
    switch (nivel) {
      case 'Diamante': return <Trophy className="h-5 w-5 text-blue-400" />;
      case 'Ouro': return <Award className="h-5 w-5 text-yellow-500" />;
      case 'Prata': return <Star className="h-5 w-5 text-gray-400" />;
      default: return <Trophy className="h-5 w-5 text-amber-600" />;
    }
  };

  const getLevelColor = (nivel: string) => {
    switch (nivel) {
      case 'Diamante': return 'from-blue-600 to-cyan-600';
      case 'Ouro': return 'from-yellow-600 to-amber-600';
      case 'Prata': return 'from-gray-500 to-slate-600';
      default: return 'from-amber-700 to-orange-700';
    }
  };

  const getProgressPercentage = () => {
    if (progress.xp_total < 100) return (progress.xp_total / 100) * 100;
    if (progress.xp_total < 250) return ((progress.xp_total - 100) / 150) * 100;
    if (progress.xp_total < 500) return ((progress.xp_total - 250) / 250) * 100;
    return 100;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {getLevelIcon(progress.nivel)}
          <span className="text-sm font-medium text-white">{progress.nivel}</span>
        </div>
        <div className="text-sm text-aurora-electric-purple font-medium">
          {progress.xp_total} XP
        </div>
        {progress.badges.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            🏆 {progress.badges.length}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="aurora-glass border-aurora-electric-purple/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-gradient-to-r ${getLevelColor(progress.nivel)}`}>
                {getLevelIcon(progress.nivel)}
              </div>
              <div>
                <h3 className="text-white font-semibold">Nível {progress.nivel}</h3>
                <p className="text-sm text-gray-400">{progress.xp_total} XP total</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progresso</span>
              <span className="text-aurora-electric-purple">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <Progress 
              value={getProgressPercentage()} 
              className="h-2 bg-slate-800"
            />
          </div>

          {progress.badges.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white mb-2">
                🏆 Conquistas ({progress.badges.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {progress.badges.map((badge, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="text-xs bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-aurora-electric-purple/50"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GamificationDisplay;
