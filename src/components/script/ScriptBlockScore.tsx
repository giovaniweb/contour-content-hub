
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { getProgressBar, getToneRangeByScore, getBlockImprovement } from './utils/toneAdaptationUtils';
import { Lightbulb, AlertTriangle, ArrowRight, Star, SpeechIcon } from 'lucide-react';

interface ScriptBlockScoreProps {
  blockType: string;
  score: number;
  maxScore?: number;
  showImprovementTips?: boolean;
}

const ScriptBlockScore: React.FC<ScriptBlockScoreProps> = ({
  blockType,
  score,
  maxScore = 10,
  showImprovementTips = true
}) => {
  const toneRange = getToneRangeByScore(score);
  const progressPercent = (score / maxScore) * 100;
  const improvementFocus = getBlockImprovement(blockType);
  
  const getBlockIcon = () => {
    const normalizedType = blockType.toLowerCase();
    
    if (normalizedType.includes('gancho')) return <Lightbulb className="h-5 w-5 text-amber-500" />;
    if (normalizedType.includes('conflito')) return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    if (normalizedType.includes('virada')) return <ArrowRight className="h-5 w-5 text-green-500" />;
    if (normalizedType.includes('final') || normalizedType.includes('cta')) 
      return <Star className="h-5 w-5 text-purple-500" />;
      
    return <SpeechIcon className="h-5 w-5 text-blue-500" />;
  };
  
  const getScoreColor = () => {
    if (score < 6) return "text-red-500";
    if (score < 7.5) return "text-amber-500";
    if (score < 9) return "text-green-500";
    return "text-blue-500";
  };
  
  const getProgressColor = () => {
    if (score < 6) return "bg-red-500";
    if (score < 7.5) return "bg-amber-500";
    if (score < 9) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <div className="bg-slate-50 p-3 rounded-md mb-4">
      <div className="flex items-center gap-2 mb-2">
        {getBlockIcon()}
        <h4 className="font-medium">{blockType}</h4>
        <span className={`ml-auto font-bold ${getScoreColor()}`}>{score.toFixed(1)}/{maxScore}</span>
      </div>
      
      <Progress value={progressPercent} className={`h-2.5 ${getProgressColor()}`} />
      
      {showImprovementTips && (
        <div className="mt-2 text-sm text-muted-foreground">
          <p className="font-medium">Tom sugerido: {toneRange.tone}</p>
          <p>{toneRange.action}</p>
          <p className="mt-1 italic">{improvementFocus}</p>
        </div>
      )}
      
      <div className="mt-2 font-mono text-xs text-slate-500">
        {getProgressBar(score, maxScore)}
      </div>
    </div>
  );
};

export default ScriptBlockScore;
