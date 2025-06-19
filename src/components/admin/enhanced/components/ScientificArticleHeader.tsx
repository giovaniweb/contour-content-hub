
import React from 'react';
import { FileText, Flame, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ScientificArticleHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-3">
        <div className="relative">
          <FileText className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
          <div className="absolute inset-0 h-12 w-12 text-cyan-400 animate-pulse blur-sm"></div>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            Artigos Científicos
          </h1>
          <p className="text-slate-300">Gerencie e explore sua biblioteca de documentos científicos</p>
        </div>
      </div>

      {/* Status Tags */}
      <div className="flex items-center justify-center gap-4">
        <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30 rounded-xl">
          <Flame className="h-4 w-4 mr-1" />
          Populares
        </Badge>
        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 rounded-xl">
          <Sparkles className="h-4 w-4 mr-1" />
          Recentes
        </Badge>
      </div>
    </div>
  );
};

export default ScientificArticleHeader;
