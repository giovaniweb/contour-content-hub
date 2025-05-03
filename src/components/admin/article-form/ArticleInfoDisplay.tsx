
import React from "react";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArticleInfoDisplayProps {
  extractedKeywords: string[];
  extractedResearchers: string[];
  suggestedTitle: string;
  suggestedDescription: string;
  processingFailed: boolean;
}

const ArticleInfoDisplay: React.FC<ArticleInfoDisplayProps> = ({
  extractedKeywords,
  extractedResearchers,
  suggestedTitle,
  suggestedDescription,
  processingFailed,
}) => {
  // If no information was extracted, don't show the component
  if (!extractedKeywords.length && !extractedResearchers.length && !suggestedTitle && !suggestedDescription) {
    return null;
  }

  return (
    <ScrollArea className="h-auto max-h-[300px]">
      <Alert className={processingFailed ? "bg-yellow-50 border-yellow-200" : "bg-muted"}>
        <AlertTitle className="flex items-center">
          {processingFailed ? (
            <>
              <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
              Processamento parcial do documento
            </>
          ) : (
            "Informações extraídas do documento"
          )}
        </AlertTitle>
        <AlertDescription>
          {processingFailed ? (
            <p className="text-sm text-muted-foreground mb-2">
              O processamento do documento foi parcial. Algumas informações podem estar incompletas.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mb-2">
              As informações abaixo foram extraídas automaticamente do documento.
            </p>
          )}
          
          {/* Display extracted title if available */}
          {suggestedTitle && (
            <div className="mt-2">
              <p className="text-sm font-medium">Título:</p>
              <p className="text-sm">{suggestedTitle}</p>
            </div>
          )}
          
          {/* Display conclusion if available */}
          {suggestedDescription && (
            <div className="mt-2">
              <p className="text-sm font-medium">Conclusão:</p>
              <p className="text-sm">{suggestedDescription}</p>
            </div>
          )}
          
          {/* Display keywords */}
          {extractedKeywords.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Palavras-chave:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {extractedKeywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Display researchers */}
          {extractedResearchers.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Pesquisadores:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {extractedResearchers.map((researcher, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {researcher}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </ScrollArea>
  );
};

export default ArticleInfoDisplay;
