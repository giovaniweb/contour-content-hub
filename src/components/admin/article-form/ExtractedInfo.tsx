
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExtractedInfoProps {
  extractedKeywords: string[];
  extractedResearchers: string[];
}

const ExtractedInfo: React.FC<ExtractedInfoProps> = ({ 
  extractedKeywords,
  extractedResearchers 
}) => {
  if (!extractedKeywords.length && !extractedResearchers.length) {
    return null;
  }

  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Lightbulb className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-700">Informações extraídas automaticamente</AlertTitle>
      <AlertDescription className="text-blue-600">
        <div className="space-y-3 mt-2">
          {extractedKeywords.length > 0 && (
            <div>
              <div className="flex items-center mb-1">
                <Tag className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-sm font-medium">Palavras-chave:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {extractedKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {extractedResearchers.length > 0 && (
            <div>
              <div className="flex items-center mb-1">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-sm font-medium">Pesquisadores:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {extractedResearchers.map((researcher, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                    {researcher}
                  </Badge>
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
