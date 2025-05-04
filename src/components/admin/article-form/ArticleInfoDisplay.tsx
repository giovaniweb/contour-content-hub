
import React from "react";
import { AlertCircle, Lightbulb } from "lucide-react";
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
  // More strict conditions for showing content
  // All strings must not be empty, arrays must have length > 0
  const hasNoContent = 
    (!extractedKeywords || extractedKeywords.length === 0) && 
    (!extractedResearchers || extractedResearchers.length === 0) && 
    (!suggestedTitle || suggestedTitle.trim() === '') && 
    (!suggestedDescription || suggestedDescription.trim() === '');

  // If there's no content, don't render anything
  if (hasNoContent) {
    console.log("ArticleInfoDisplay: No content to display");
    return null;
  }

  // Generate a completely unique render ID for every render
  // This ensures we always see fresh data
  const renderID = `render-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  console.log(`ArticleInfoDisplay rendering with ID: ${renderID}`);

  return (
    <ScrollArea className="h-auto max-h-[400px]">
      <Alert className={processingFailed ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"}>
        <AlertTitle className="flex items-center text-blue-700">
          {processingFailed ? (
            <>
              <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
              Processamento parcial do documento
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4 mr-2 text-blue-600" />
              Informações extraídas automaticamente
            </>
          )}
        </AlertTitle>
        <AlertDescription className="text-blue-600">
          {processingFailed ? (
            <p className="text-sm text-muted-foreground mb-2">
              O processamento do documento foi parcial. Algumas informações podem estar incompletas.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mb-2">
              As informações abaixo foram extraídas automaticamente do documento.
            </p>
          )}
          
          <div className="space-y-3 mt-2">
            {/* Only show title if it exists and is not empty */}
            {suggestedTitle && suggestedTitle.trim() !== '' && (
              <div>
                <p className="text-sm font-medium text-blue-700">Título:</p>
                <p className="text-sm text-blue-700">{suggestedTitle}</p>
              </div>
            )}
            
            {/* Only show description if it exists and is not empty */}
            {suggestedDescription && suggestedDescription.trim() !== '' && (
              <div>
                <p className="text-sm font-medium text-blue-700">Conclusão:</p>
                <p className="text-sm text-blue-700">{suggestedDescription}</p>
              </div>
            )}
            
            {/* Only show keywords if they exist and array is not empty */}
            {extractedKeywords && extractedKeywords.length > 0 && (
              <div>
                <p className="text-sm font-medium text-blue-700">Palavras-chave:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {extractedKeywords.map((keyword, index) => (
                    <Badge key={`${renderID}-keyword-${index}`} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Only show researchers if they exist and array is not empty */}
            {extractedResearchers && extractedResearchers.length > 0 && (
              <div>
                <p className="text-sm font-medium text-blue-700">Pesquisadores:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {extractedResearchers.map((researcher, index) => (
                    <Badge key={`${renderID}-researcher-${index}`} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {researcher}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </ScrollArea>
  );
};

export default ArticleInfoDisplay;
