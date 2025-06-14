
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Heart } from 'lucide-react';

interface ScriptMetricsProps {
  estimatedTime: number;
  isWithinTimeLimit: boolean;
  wordCount: number;
  emocao_central: string;
  formato: string;
  showTime?: boolean;
}

const ScriptMetrics: React.FC<ScriptMetricsProps> = ({
  estimatedTime,
  isWithinTimeLimit,
  wordCount,
  emocao_central,
  formato,
  showTime = true
}) => {
  const gridCols = showTime ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`grid gap-3 ${gridCols}`}
    >
      {/* Tempo de Leitura - Apenas para formatos com tempo */}
      {showTime && (
        <div className="aurora-glass border border-blue-500/20 p-3 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">Tempo</span>
          </div>
          <div className={`text-lg font-bold ${isWithinTimeLimit ? 'text-green-400' : 'text-red-400'}`}>
            {estimatedTime}s
          </div>
        </div>
      )}

      {/* Contagem de Palavras */}
      <div className="aurora-glass border border-purple-500/20 p-3 rounded-lg text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Target className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-medium text-purple-300">Palavras</span>
        </div>
        <div className="text-lg font-bold text-purple-400">{wordCount}</div>
      </div>

      {/* Emoção Central */}
      <div className="aurora-glass border border-green-500/20 p-3 rounded-lg text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Heart className="h-4 w-4 text-green-400" />
          <span className="text-xs font-medium text-green-300">Emoção</span>
        </div>
        <div className="text-sm font-bold text-green-400 capitalize">{emocao_central}</div>
      </div>

      {/* Formato */}
      <div className="aurora-glass border border-indigo-500/20 p-3 rounded-lg text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Target className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-medium text-indigo-300">Formato</span>
        </div>
        <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 text-xs">
          {formato === 'stories_10x' ? 'STORIES 10X' : 
           formato === 'post_estatico' ? 'POST ESTÁTICO' :
           formato.toUpperCase()}
        </Badge>
      </div>
    </motion.div>
  );
};

export default ScriptMetrics;
