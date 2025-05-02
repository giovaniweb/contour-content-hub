
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type AnnotationType = 'positive' | 'negative' | 'suggestion';

export interface TextAnnotation {
  type: AnnotationType;
  text: string;
  suggestion?: string;
  action?: string;
  score?: number;
}

interface AnnotatedTextProps {
  content: string;
  annotations: TextAnnotation[];
}

const AnnotatedText: React.FC<AnnotatedTextProps> = ({ content, annotations }) => {
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
    const { text, type, suggestion, action, score } = annotation;
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
    const backgroundColor = type === 'positive' 
      ? 'bg-green-100' 
      : type === 'negative' 
        ? 'bg-amber-100' 
        : 'bg-blue-100';
    
    const borderColor = type === 'positive'
      ? 'border-green-300'
      : type === 'negative'
        ? 'border-amber-300'
        : 'border-blue-300';
    
    const icon = type === 'positive'
      ? '✓'
      : type === 'negative'
        ? '!'
        : '💡';
        
    result.push(
      <TooltipProvider key={`annotation-${index}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span 
              className={`${backgroundColor} px-0.5 border-b border-dashed ${borderColor} cursor-help`}
            >
              {text}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
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
