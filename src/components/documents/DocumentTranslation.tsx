
import React, { useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Languages, Globe, Loader2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DocumentTranslationProps {
  document: TechnicalDocument;
}

const DocumentTranslation: React.FC<DocumentTranslationProps> = ({ document }) => {
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<string | null>(null);
  const { toast } = useToast();

  const hasContent = (): boolean => {
    if (!document.conteudo_extraido) {
      toast({
        variant: "destructive",
        title: "Sem conteúdo",
        description: "Este documento ainda não tem conteúdo extraído. Por favor, extraia o conteúdo primeiro."
      });
      return false;
    }
    return true;
  };

  const getLanguageLabel = (code: string) => {
    switch(code) {
      case 'pt': return 'Português';
      case 'en': return 'Inglês';
      case 'es': return 'Espanhol';
      default: return code;
    }
  };

  const handleTranslate = async () => {
    if (!hasContent()) return;
    
    if (document.idiomas_traduzidos?.includes(targetLanguage)) {
      toast({
        description: `Este documento já foi traduzido para ${getLanguageLabel(targetLanguage)}.`,
      });
      return;
    }
    
    try {
      setIsTranslating(true);
      setTranslationResult(null);
      
      // Chamar a função de borda para tradução
      const { data, error } = await supabase.functions.invoke('translate-document', {
        body: { 
          documentId: document.id,
          targetLanguage: targetLanguage 
        }
      });
      
      if (error) {
        console.error('Error translating document:', error);
        throw new Error(error.message || "Falha ao traduzir documento");
      }
      
      console.log('Translation result:', data);
      
      toast({
        title: "Sucesso",
        description: `Documento traduzido para ${getLanguageLabel(targetLanguage)}.`,
      });
      
      // Simular resultado para demonstração
      setTranslationResult(`# ${document.titulo} (Traduzido para ${getLanguageLabel(targetLanguage)})

## Resumo
${document.descricao || 'Sem descrição disponível'}

## Conteúdo Traduzido
Este é um exemplo de como ficaria o conteúdo traduzido para ${getLanguageLabel(targetLanguage)}.
O documento original está em ${getLanguageLabel(document.idioma_original)}.

${document.conteudo_extraido?.substring(0, 200)}...

Para ver o documento traduzido completo, acesse a seção de documentos técnicos.`);
      
    } catch (err: any) {
      console.error('Error translating document:', err);
      toast({
        variant: "destructive",
        title: "Erro na tradução",
        description: err.message || "Não foi possível traduzir o documento."
      });
    } finally {
      setIsTranslating(false);
    }
  };
  
  return (
    <ScrollArea className="h-[calc(100vh-350px)] min-h-[400px] w-full rounded-md border">
      {!document.conteudo_extraido ? (
        <Alert variant="destructive" className="mx-6 my-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Conteúdo não extraído</AlertTitle>
          <AlertDescription>
            Este documento não tem conteúdo extraído. Por favor, extraia o conteúdo primeiro.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Traduzir documento</h3>
            </div>
            
            <Card className="flex-1">
              <CardContent className="flex flex-col sm:flex-row gap-4 py-4">
                <div className="flex-1">
                  <Select
                    value={targetLanguage}
                    onValueChange={setTargetLanguage}
                    disabled={isTranslating}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt" className="flex items-center gap-2">
                        <span>🇧🇷</span> Português
                      </SelectItem>
                      <SelectItem value="en" className="flex items-center gap-2">
                        <span>🇺🇸</span> Inglês
                      </SelectItem>
                      <SelectItem value="es" className="flex items-center gap-2">
                        <span>🇪🇸</span> Espanhol
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleTranslate} 
                  disabled={isTranslating || document.idioma_original === targetLanguage}
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traduzindo...
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      Traduzir
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {document.idiomas_traduzidos?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Traduções disponíveis:</h4>
              <div className="flex flex-wrap gap-2">
                {document.idiomas_traduzidos.map(lang => (
                  <div key={lang} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>{getLanguageLabel(lang)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {translationResult && (
            <div className="mt-6 border-t pt-6">
              <h3 className="font-medium mb-4">Prévia da tradução</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert bg-muted p-4 rounded-md">
                <pre className="whitespace-pre-wrap">{translationResult}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </ScrollArea>
  );
};

export default DocumentTranslation;
