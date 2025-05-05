
import React from "react";
import { Eye, AlertTriangle, ArrowRight, Star } from "lucide-react";

interface DisneyStructureIndicatorProps {
  hasDisneyStructure: boolean;
}

const DisneyStructureIndicator: React.FC<DisneyStructureIndicatorProps> = ({ 
  hasDisneyStructure 
}) => {
  if (!hasDisneyStructure) return null;
  
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-2">
      <span className="font-medium">Estrutura:</span>
      <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs">
        <Eye className="h-3 w-3" /> Identificação
      </div>
      <span className="text-gray-400">→</span>
      <div className="flex items-center gap-1 bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-xs">
        <AlertTriangle className="h-3 w-3" /> Conflito
      </div>
      <span className="text-gray-400">→</span>
      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-xs">
        <ArrowRight className="h-3 w-3" /> Virada
      </div>
      <span className="text-gray-400">→</span>
      <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-xs">
        <Star className="h-3 w-3" /> Final
      </div>
    </div>
  );
};

export default DisneyStructureIndicator;
