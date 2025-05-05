
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScriptResponse } from "@/types/script";

interface ScriptCardHeaderProps {
  script: ScriptResponse;
}

const ScriptCardHeader: React.FC<ScriptCardHeaderProps> = ({ script }) => {
  const getScriptTypeLabel = () => {
    switch (script.type) {
      case "videoScript":
        return "Roteiro para Vídeo";
      case "bigIdea":
        return "Big Idea";
      case "dailySales":
        return "Stories";
      case "reelsScript":
        return "Reels";
      default:
        return "Roteiro";
    }
  };
  
  const getScriptTypeColor = () => {
    switch (script.type) {
      case "videoScript":
        return "bg-blue-500";
      case "bigIdea":
        return "bg-purple-500";
      case "dailySales":
        return "bg-amber-500";
      case "reelsScript":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className={cn("px-2", getScriptTypeColor())}>
              {getScriptTypeLabel()}
            </Badge>
            {script.marketingObjective && (
              <Badge variant="outline">{script.marketingObjective}</Badge>
            )}
          </div>
          <CardTitle className="text-xl">{script.title}</CardTitle>
        </div>
      </div>
    </CardHeader>
  );
};

export default ScriptCardHeader;
