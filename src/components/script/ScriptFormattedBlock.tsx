
import React, { useState } from 'react';
import ScriptBlockScore from './ScriptBlockScore';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getProgressBar } from './utils/toneAdaptationUtils';
import { Progress } from "@/components/ui/progress";

interface ScriptFormattedBlockProps {
  blockType: string;
  score: number;
  originalText: string;
  adaptedText?: string;
  toneNote?: string;
  showAdapted?: boolean;
  showComparison?: boolean;
}

const ScriptFormattedBlock: React.FC<ScriptFormattedBlockProps> = ({
  blockType,
  score,
  originalText,
  adaptedText,
  toneNote,
  showAdapted = false,
  showComparison = false
}) => {
  const [viewMode, setViewMode] = useState<'original' | 'adapted'>(showAdapted ? 'adapted' : 'original');
  
  const hasAdaptedText = !!adaptedText;
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score < 6) return "text-red-500";
    if (score < 7.5) return "text-amber-500";
    if (score < 9) return "text-green-500";
    return "text-blue-500";
  };

  // Generate progress bar
  const renderProgressBar = (score: number) => {
    const percent = (score / 10) * 100;
    return (
      <div className="w-full mb-2">
        <Progress 
          value={percent}
          className={cn(
            "h-2 w-full",
            score < 6 ? "bg-red-100" : 
            score < 7.5 ? "bg-amber-100" : 
            score < 9 ? "bg-green-100" : 
            "bg-blue-100"
          )}
        />
      </div>
    );
  };
  
  return (
    <div className="mb-6 border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 bg-slate-50 border-b">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-md">{blockType}</h3>
          <span className={`font-bold ${getScoreColor(score)}`}>{score.toFixed(1)}/10</span>
        </div>
        
        {/* Score Visualization */}
        {renderProgressBar(score)}
        
        <div className="mt-1 font-mono text-xs text-slate-500">
          {getProgressBar(score, 10)}
        </div>
      </div>
      
      <div className="p-4">
        {showComparison && hasAdaptedText && (
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <span className="text-sm font-medium">Comparar versões:</span>
            <div className="flex items-center gap-2">
              <Label htmlFor={`view-toggle-${blockType}`} className={cn(
                "text-sm",
                viewMode === 'original' ? "font-medium" : "text-muted-foreground"
              )}>
                Original
              </Label>
              <Switch 
                id={`view-toggle-${blockType}`}
                checked={viewMode === 'adapted'}
                onCheckedChange={(checked) => setViewMode(checked ? 'adapted' : 'original')}
              />
              <Label htmlFor={`view-toggle-${blockType}`} className={cn(
                "text-sm",
                viewMode === 'adapted' ? "font-medium" : "text-muted-foreground"
              )}>
                Adaptado
              </Label>
            </div>
          </div>
        )}
        
        {(!showComparison || viewMode === 'original') && (
          <div className={cn("mb-3", showComparison && viewMode === 'adapted' && "hidden")}>
            <div className="text-sm text-muted-foreground mb-1">
              Texto original:
            </div>
            <div className="p-3 bg-slate-50 rounded-md">
              {originalText}
            </div>
          </div>
        )}
        
        {hasAdaptedText && (!showComparison || viewMode === 'adapted') && (
          <div className={cn(showComparison && viewMode === 'original' && "hidden")}>
            <div className="text-sm text-muted-foreground mb-1">
              Texto adaptado:
            </div>
            <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-md font-medium">
              {adaptedText}
            </div>
            
            {toneNote && (
              <div className="mt-2 text-sm italic text-muted-foreground">
                {toneNote}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptFormattedBlock;
