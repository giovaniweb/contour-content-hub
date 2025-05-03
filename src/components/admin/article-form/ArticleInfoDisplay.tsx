
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
  // Se nenhuma informação foi extraída ou tudo está vazio, não mostrar o componente
  const hasNoContent = 
    (!extractedKeywords || extractedKeywords.length === 0) && 
    (!extractedResearchers || extractedResearchers.length === 0) && 
    !suggestedTitle && 
    !suggestedDescription;

  if (hasNoContent) {
    return null;
  }

  // Verifica se os valores são os simulados para desenvolvimento
  const isSimulatedData = 
    suggestedTitle === "Título simulado do artigo científico" &&
    suggestedDescription === "Esta é uma conclusão simulada para testes de desenvolvimento.";
    
  // Se estamos em produção e só temos dados simulados, não mostrar
  if (process.env.NODE_ENV === 'production' && isSimulatedData) {
    return null;
  }

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
            {/* Display extracted title if available */}
            {suggestedTitle && (
              <div>
                <p className="text-sm font-medium text-blue-700">Título:</p>
                <p className="text-sm text-blue-700">{suggestedTitle}</p>
              </div>
            )}
            
            {/* Display conclusion if available */}
            {suggestedDescription && (
              <div>
                <p className="text-sm font-medium text-blue-700">Conclusão:</p>
                <p className="text-sm text-blue-700">{suggestedDescription}</p>
              </div>
            )}
            
            {/* Display keywords */}
            {extractedKeywords && extractedKeywords.length > 0 && (
              <div>
                <p className="text-sm font-medium text-blue-700">Palavras-chave:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {extractedKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Display researchers */}
            {extractedResearchers && extractedResearchers.length > 0 && (
              <div>
                <p className="text-sm font-medium text-blue-700">Pesquisadores:</p>
                <div className="flex flex-wrap gap-1 mt-1">
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
    </ScrollArea>
  );
};

export default ArticleInfoDisplay;
