
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KeywordsDisplayProps {
  extractedKeywords: string[];
  title?: string;
  className?: string;
  maxHeight?: string;
}

const KeywordsDisplay: React.FC<KeywordsDisplayProps> = ({ 
  extractedKeywords, 
  title = "Palavras-chave",
  className = "",
  maxHeight = "150px" 
}) => {
  if (extractedKeywords.length === 0) {
    return null;
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{title}</Label>
      <ScrollArea className="h-auto" style={{ maxHeight }}>
        <div className="p-3 border rounded-md">
          <div className="flex flex-wrap gap-2">
            {extractedKeywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default KeywordsDisplay;
