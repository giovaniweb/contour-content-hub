
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KeywordsDisplayProps {
  extractedKeywords: string[];
}

const KeywordsDisplay: React.FC<KeywordsDisplayProps> = ({ extractedKeywords }) => {
  if (extractedKeywords.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <Label>Palavras-chave</Label>
      <ScrollArea className="h-auto max-h-[150px]">
        <div className="p-3 border rounded-md">
          <div className="flex flex-wrap gap-2">
            {extractedKeywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">
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
