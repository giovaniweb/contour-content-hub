
import React from "react";
import { Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarketingObjectiveType } from "@/types/script";
import ScriptObjectiveBadge from "./ScriptObjectiveBadge";

interface ScriptHeaderProps {
  title: string;
  contentType: string;
  objective: MarketingObjectiveType | string;
  hasDisneyStructure: boolean;
}

const ScriptHeader: React.FC<ScriptHeaderProps> = ({ 
  title, 
  contentType, 
  objective, 
  hasDisneyStructure 
}) => {
  return (
    <div className="mb-6">
      {/* Content type and objective badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className={cn(
          "px-2.5 py-1 rounded-md text-sm font-medium flex items-center gap-1.5",
          contentType?.includes("Vídeo") ? "bg-blue-100 text-blue-800" : 
          contentType?.includes("Stories") ? "bg-amber-100 text-amber-800" : 
          "bg-purple-100 text-purple-800"
        )}>
          <Video className="h-4 w-4" />
          {contentType || "Roteiro para Vídeo"}
        </div>
        
        {objective && (
          <ScriptObjectiveBadge objective={objective} />
        )}
      </div>
      
      {/* Script title */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
    </div>
  );
};

export default ScriptHeader;
