
import React from "react";
import { Eye, AlertTriangle, ArrowRight, Star } from "lucide-react";

const DisneyStructureOverview: React.FC = () => {
  return (
    <div className="mb-5 p-4 bg-slate-50 rounded-lg border border-slate-100">
      <div className="text-sm font-semibold mb-2 text-slate-600">Estrutura narrativa:</div>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
          <Eye className="h-4 w-4" />
          Identificação
        </div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm">
          <AlertTriangle className="h-4 w-4" />
          Conflito
        </div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
          <ArrowRight className="h-4 w-4" />
          Virada
        </div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">
          <Star className="h-4 w-4" />
          Final
        </div>
      </div>
    </div>
  );
};

export default DisneyStructureOverview;
