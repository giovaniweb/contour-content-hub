
import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Edit, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type AnnotationType = 'positive' | 'negative' | 'suggestion' | 'gancho' | 'conflito' | 'virada' | 'cta';

export interface TextAnnotation {
  type: AnnotationType;
  text: string;
  suggestion?: string;
  action?: string;
  score?: number;
  blockType?: 'gancho' | 'conflito' | 'virada' | 'cta';
  replace?: boolean;
}

interface AnnotatedTextProps {
  content: string;
  annotations: TextAnnotation[];
  onApplySuggestion?: (originalText: string, newText: string) => void;
  onEditText?: (originalText: string) => void;
  onIgnoreSuggestion?: (originalText: string) => void;
}

const AnnotatedText: React.FC<AnnotatedTextProps> = ({ 
  content, 
  annotations, 
  onApplySuggestion, 
  onEditText, 
  onIgnoreSuggestion 
}) => {
  const [activePopover, setActivePopover] = useState<string | null>(null);
  
  if (!annotations || annotations.length === 0) {
    return <div className="whitespace-pre-line">{content}</div>;
  }

  // Sort annotations by their position in the text to process them in order
  const sortedAnnotations = [...annotations].sort((a, b) => {
    const posA = content.indexOf(a.text);
    const posB = content.indexOf(b.text);
    return posA - posB;
  }).filter(ann => content.includes(ann.text));

  // If no valid annotations are found, return plain text
  if (sortedAnnotations.length === 0) {
    return <div className="whitespace-pre-line">{content}</div>;
  }

  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedAnnotations.forEach((annotation, index) => {
    const { text, type, suggestion, action, score, blockType } = annotation;
    const startIndex = content.indexOf(text, lastIndex);
    
    if (startIndex === -1) return;
    
    // Add text between last annotation and this one
    if (startIndex > lastIndex) {
      result.push(
        <span key={`text-${index}`}>
          {content.substring(lastIndex, startIndex)}
        </span>
      );
    }
    
    // Add the annotated text
    const backgroundColor = 
      type === 'positive' ? 'bg-green-100' : 
      type === 'negative' ? 'bg-amber-100' : 
      type === 'gancho' ? 'bg-blue-100' : 
      type === 'conflito' ? 'bg-purple-100' : 
      type === 'virada' ? 'bg-teal-100' : 
      type === 'cta' ? 'bg-orange-100' : 
      'bg-blue-100';
    
    const borderColor = 
      type === 'positive' ? 'border-green-300' : 
      type === 'negative' ? 'border-amber-300' : 
      type === 'gancho' ? 'border-blue-300' : 
      type === 'conflito' ? 'border-purple-300' : 
      type === 'virada' ? 'border-teal-300' : 
      type === 'cta' ? 'border-orange-300' : 
      'border-blue-300';
    
    const icon = 
      type === 'positive' ? '✓' : 
      type === 'negative' ? '!' : 
      type === 'gancho' ? '🎣' : 
      type === 'conflito' ? '⚡' : 
      type === 'virada' ? '🔄' : 
      type === 'cta' ? '👆' : 
      '💡';

    // Badge class based on score
    const getBadgeClass = (score?: number) => {
      if (!score) return "bg-gray-100 text-gray-700";
      if (score >= 8) return "bg-green-100 text-green-700";
      if (score >= 6) return "bg-yellow-100 text-yellow-700";
      return "bg-red-100 text-red-700";
    };
    
    // If interactive controls are needed and provided
    if (suggestion && (onApplySuggestion || onEditText || onIgnoreSuggestion)) {
      const popoverId = `popover-${index}`;
      
      result.push(
        <Popover 
          key={`annotation-${index}`}
          open={activePopover === popoverId}
          onOpenChange={(open) => setActivePopover(open ? popoverId : null)}
        >
          <PopoverTrigger asChild>
            <span 
              className={`${backgroundColor} px-0.5 border-b border-dashed ${borderColor} cursor-pointer`}
            >
              {text}
              {score !== undefined && (
                <Badge className={`ml-1 text-xs py-0.5 ${getBadgeClass(score)}`}>
                  {score.toFixed(1)}
                </Badge>
              )}
            </span>
          </PopoverTrigger>
          <PopoverContent side="top" className="max-w-xs p-2">
            <div className="space-y-3">
              {blockType && (
                <div className="text-xs font-medium flex items-center">
                  <span className="mr-1">{icon}</span>
                  {blockType.charAt(0).toUpperCase() + blockType.slice(1)}
                </div>
              )}
              
              {score !== undefined && (
                <div className="text-xs font-medium">
                  Nota: {score.toFixed(1)}/10
                </div>
              )}
              
              {suggestion && (
                <div className="text-sm border-l-2 border-blue-300 pl-2 py-1">
                  {suggestion}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 pt-1">
                {onApplySuggestion && suggestion && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs flex items-center bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    onClick={() => {
                      onApplySuggestion(text, suggestion);
                      setActivePopover(null);
                    }}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Aplicar Sugestão
                  </Button>
                )}
                
                {onEditText && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs flex items-center"
                    onClick={() => {
                      onEditText(text);
                      setActivePopover(null);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar Manualmente
                  </Button>
                )}
                
                {onIgnoreSuggestion && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs flex items-center"
                    onClick={() => {
                      onIgnoreSuggestion(text);
                      setActivePopover(null);
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Ignorar
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    } else {
      // Simple tooltip without interactive controls
      result.push(
        <TooltipProvider key={`annotation-${index}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span 
                className={`${backgroundColor} px-0.5 border-b border-dashed ${borderColor} cursor-help relative`}
              >
                {text}
                {score !== undefined && (
                  <Badge className={`ml-1 text-xs py-0.5 ${getBadgeClass(score)}`}>
                    {score.toFixed(1)}
                  </Badge>
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1">
                {blockType && (
                  <div className="text-xs font-medium flex items-center">
                    <span className="mr-1">{icon}</span>
                    {blockType.charAt(0).toUpperCase() + blockType.slice(1)}
                  </div>
                )}
                
                {score !== undefined && (
                  <div className="text-xs font-medium">
                    Nota: {score.toFixed(1)}/10
                  </div>
                )}
                
                {suggestion && (
                  <div className="text-sm">
                    <span className="mr-1">{icon}</span>
                    {suggestion}
                  </div>
                )}
                
                {action && (
                  <div className="text-xs text-muted-foreground">
                    {action}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    lastIndex = startIndex + text.length;
  });
  
  // Add any remaining text
  if (lastIndex < content.length) {
    result.push(
      <span key="text-end">
        {content.substring(lastIndex)}
      </span>
    );
  }

  return <div className="whitespace-pre-line">{result}</div>;
};

export default AnnotatedText;
