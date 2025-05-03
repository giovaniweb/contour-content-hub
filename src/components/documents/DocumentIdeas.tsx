
import React, { useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Lightbulb, Loader2, AlertCircle, Video, Instagram, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DocumentIdeasProps {
  document: TechnicalDocument;
}

const DocumentIdeas: React.FC<DocumentIdeasProps> = ({ document }) => {
  const [contentType, setContentType] = useState<'video_script' | 'story' | 'big_idea'>('video_script');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
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

  const handleGenerateContent = async () => {
    if (!hasContent()) return;
    
    try {
      setIsGenerating(true);
      setGeneratedContent(null);
      
      // In a real implementation, we'd call an Edge Function here
      // Simulating API call delay
      await new Promise(r => setTimeout(r, 2000));
      
      let contentTypeLabel = '';
      let content = '';
      
      switch (contentType) {
        case 'video_script':
          contentTypeLabel = 'Roteiro para Vídeo';
          content = `# Roteiro para Vídeo: "${document.titulo}"

## Introdução (0:00 - 0:30)
"Olá pessoal! Hoje vamos falar sobre um tema muito interessante: ${document.titulo}."
"Este conteúdo foi baseado em um documento técnico, mas vamos explicar de forma simples."

## Desenvolvimento (0:30 - 2:00)
"Os principais pontos que precisamos entender são:"
- Ponto 1: Explicação básica do conceito
- Ponto 2: Aplicações práticas
- Ponto 3: Impactos e resultados

## Conclusão (2:00 - 2:30)
"Para finalizar, lembre-se que este tema é fundamental para..."
"Se você gostou deste conteúdo, deixe seu like e compartilhe!"`;
          break;
        case 'story':
          contentTypeLabel = 'Story para Instagram';
          content = `# Story para Instagram: "${document.titulo}"

## Slide 1
🔍 NOVO CONTEÚDO DISPONÍVEL!
Você já conhece sobre ${document.titulo}?

## Slide 2
🧠 Este material técnico explica como...
${document.descricao?.substring(0, 100) || 'Tópico especializado explicado de forma simples'}

## Slide 3
💡 BENEFÍCIOS:
- Entenda conceitos complexos facilmente
- Aplique técnicas avançadas
- Melhore seus resultados

## Slide 4
👉 ACESSE AGORA!
Link na bio`;
          break;
        case 'big_idea':
          contentTypeLabel = 'Big Idea';
          content = `# Big Idea: "${document.titulo}"

## Conceito Principal
A grande ideia por trás de "${document.titulo}" é transformar o entendimento sobre...

## Por que isso importa?
Este conceito revoluciona a maneira como enxergamos...

## Aplicação Prática
Você pode implementar estes conceitos através de...

## Próximos Passos
1. Entenda os fundamentos apresentados
2. Aplique em um projeto piloto
3. Mensure resultados e adapte

## Conclusão
Esta abordagem representa uma oportunidade única de...`;
          break;
      }
      
      setGeneratedContent(content);
      
      toast({
        title: "Conteúdo gerado",
        description: `${contentTypeLabel} foi gerado com sucesso.`
      });
      
    } catch (err: any) {
      console.error('Error generating content:', err);
      toast({
        variant: "destructive",
        title: "Erro ao gerar conteúdo",
        description: err.message || "Não foi possível gerar o conteúdo."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getContentTypeIcon = () => {
    switch (contentType) {
      case 'video_script': return <Video className="h-4 w-4 mr-2" />;
      case 'story': return <Instagram className="h-4 w-4 mr-2" />;
      case 'big_idea': return <Lightbulb className="h-4 w-4 mr-2" />;
    }
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'video_script': return 'Roteiro para Vídeo';
      case 'story': return 'Story para Instagram';
      case 'big_idea': return 'Big Idea';
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
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Gerar ideias de conteúdo</h3>
            </div>
            
            <Card className="flex-1">
              <CardContent className="flex flex-col sm:flex-row gap-4 py-4">
                <div className="flex-1">
                  <Select
                    value={contentType}
                    onValueChange={(value: 'video_script' | 'story' | 'big_idea') => setContentType(value)}
                    disabled={isGenerating}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tipo de conteúdo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video_script" className="flex items-center">
                        <Video className="h-4 w-4 mr-2" /> Roteiro para Vídeo
                      </SelectItem>
                      <SelectItem value="story" className="flex items-center">
                        <Instagram className="h-4 w-4 mr-2" /> Story para Instagram
                      </SelectItem>
                      <SelectItem value="big_idea" className="flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" /> Big Idea
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleGenerateContent} 
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      {getContentTypeIcon()}
                      Gerar {getContentTypeLabel()}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {generatedContent && (
            <div className="mt-6 border-t pt-6">
              <h3 className="font-medium mb-4">{getContentTypeLabel()}</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert bg-muted p-4 rounded-md">
                <pre className="whitespace-pre-wrap">{generatedContent}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </ScrollArea>
  );
};

export default DocumentIdeas;
