
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";

interface TitleValidatorProps {
  title: string;
  onChange: (title: string) => void;
  disabled?: boolean;
}

const TitleValidator: React.FC<TitleValidatorProps> = ({ 
  title, 
  onChange, 
  disabled = false 
}) => {
  const [quality, setQuality] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  // Analyze title quality whenever it changes
  useEffect(() => {
    if (!title) {
      setQuality(0);
      setFeedback('');
      return;
    }
    
    // Basic title quality analysis
    let score = 0;
    let feedbackMsg = '';
    
    // Check length
    if (title.length < 5) {
      feedbackMsg = 'Título muito curto';
    } else if (title.length > 60) {
      feedbackMsg = 'Título muito longo';
    } else if (title.length >= 5 && title.length <= 10) {
      score += 20;
    } else if (title.length > 10 && title.length <= 40) {
      score += 40;
    } else {
      score += 30;
    }
    
    // Check for power words
    const powerWords = ['incrível', 'surpreendente', 'novo', 'revolucionário', 'exclusivo', 'transformador', 'potente', 'avançado', 'inovador'];
    const hasPowerWord = powerWords.some(word => title.toLowerCase().includes(word));
    if (hasPowerWord) {
      score += 20;
    }
    
    // Check for specificity
    const hasNumbers = /\d/.test(title);
    if (hasNumbers) {
      score += 20;
    }
    
    // Check for question mark or exclamation
    const hasQuestion = title.includes('?');
    const hasExclamation = title.includes('!');
    if (hasQuestion || hasExclamation) {
      score += 20;
    }
    
    // Cap the score at 100
    score = Math.min(score, 100);
    
    // Set feedback based on score
    if (score < 30) {
      feedbackMsg = feedbackMsg || 'Título básico, tente melhorar';
    } else if (score < 60) {
      feedbackMsg = feedbackMsg || 'Título razoável';
    } else if (score < 80) {
      feedbackMsg = feedbackMsg || 'Bom título!';
    } else {
      feedbackMsg = feedbackMsg || 'Título excelente!';
    }
    
    setQuality(score);
    setFeedback(feedbackMsg);
  }, [title]);
  
  const getQualityColor = () => {
    if (quality < 30) return 'text-red-500';
    if (quality < 60) return 'text-amber-500';
    if (quality < 80) return 'text-blue-500';
    return 'text-green-500';
  };
  
  const getProgressColor = () => {
    if (quality < 30) return 'bg-red-500';
    if (quality < 60) return 'bg-amber-500';
    if (quality < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Título do roteiro"
          value={title}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="font-medium"
        />
        
        {title && (
          quality >= 60 ? (
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          )
        )}
      </div>
      
      {title && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Qualidade do título</span>
            <span className={`text-xs font-medium ${getQualityColor()}`}>{quality}%</span>
          </div>
          <Progress value={quality} className={`h-1 ${getProgressColor()}`} />
          
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">{feedback}</span>
            
            {quality >= 80 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                Potencial de engajamento alto
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleValidator;
