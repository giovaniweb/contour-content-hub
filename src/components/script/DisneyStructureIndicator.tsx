
import React from 'react';
import { Eye, AlertTriangle, ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisneyStructureIndicatorProps {
  hasDisneyStructure: boolean;
  compact?: boolean;
}

const DisneyStructureIndicator: React.FC<DisneyStructureIndicatorProps> = ({ 
  hasDisneyStructure,
  compact = false
}) => {
  if (!hasDisneyStructure) {
    return null;
  }
  
  return (
    <div className={cn(
      "mb-5 rounded-lg", 
      compact ? "p-2 bg-slate-50" : "p-4 bg-slate-50 border border-slate-100"
    )}>
      <div className={cn(
        "text-sm font-semibold mb-2 text-slate-600",
        compact && "text-xs"
      )}>
        Estrutura narrativa:
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
          <Eye className="h-4 w-4" />
          <span>Identificação</span>
        </div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Conflito</span>
        </div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
          <ArrowRight className="h-4 w-4" />
          <span>Virada</span>
        </div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">
          <Star className="h-4 w-4" />
          <span>Final</span>
        </div>
      </div>
    </div>
  );
};

export default DisneyStructureIndicator;
