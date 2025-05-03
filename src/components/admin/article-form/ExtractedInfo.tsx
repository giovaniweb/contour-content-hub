
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExtractedInfoProps {
  extractedKeywords: string[];
  extractedResearchers: string[];
}

const ExtractedInfo: React.FC<ExtractedInfoProps> = ({
  extractedKeywords,
  extractedResearchers
}) => {
  if (extractedKeywords.length === 0 && extractedResearchers.length === 0) {
    return null;
  }

  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Informações extraídas</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          {extractedKeywords.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-1">Palavras-chave:</p>
              <div className="flex flex-wrap gap-1">
                {extractedKeywords.map((keyword, i) => (
                  <Badge key={i} variant="secondary">{keyword}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {extractedResearchers.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-1">Pesquisadores:</p>
              <div className="flex flex-wrap gap-1">
                {extractedResearchers.map((researcher, i) => (
                  <Badge key={i} variant="outline">{researcher}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ExtractedInfo;
