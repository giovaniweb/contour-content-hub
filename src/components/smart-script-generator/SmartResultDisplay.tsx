
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Sparkles, 
  Volume2, 
  Image, 
  RefreshCw,
  Wand2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScriptGenerationData, GeneratedContent } from './types';
import ScriptCard from '@/components/ScriptCard';
import StructuredScriptValidation from '@/components/script-generator/StructuredScriptValidation';
import { supabase } from '@/integrations/supabase/client';

interface SmartResultDisplayProps {
  generationData: ScriptGenerationData;
  generatedContent: GeneratedContent;
  onGenerateImage?: (prompt: string) => void;
  onGenerateVoice?: (text: string) => void;
  onNewScript: () => void;
}

const SmartResultDisplay: React.FC<SmartResultDisplayProps> = ({
  generationData,
  generatedContent,
  onGenerateImage,
  onGenerateVoice,
  onNewScript
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência."
    });
  };

  const handleGenerateImage = async () => {
    if (!generatedContent.content) {
      toast({
        title: "Erro",
        description: "Conteúdo não encontrado para gerar imagem",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingImage(true);

    try {
      // Parse the script content to extract narrative elements
      const scriptContent = generatedContent.content;
      const lines = scriptContent.split('\n').filter(line => line.trim());
      
      // Try to identify gancho, conflito, virada, and CTA from the content
      let gancho = '', conflito = '', virada = '', cta = '';
      
      // Simple parsing - looking for key indicators or just splitting content
      if (lines.length >= 4) {
        gancho = lines[0] || 'Conteúdo inicial atrativo';
        conflito = lines[1] || 'Apresentação do problema';
        virada = lines[2] || 'Solução oferecida';
        cta = lines[lines.length - 1] || 'Chamada para ação';
      } else {
        // Fallback for shorter content
        gancho = scriptContent.substring(0, 100) + '...';
        conflito = 'Identificação do problema do cliente';
        virada = 'Apresentação da solução com tecnologia avançada';
        cta = 'Agende sua consulta e transforme sua vida';
      }

      // Create the image prompt using the provided template
      const imagePrompt = `Gere uma imagem para Instagram com base no roteiro abaixo.

Tema: ${generationData.theme || 'Não especificado'}  
Objetivo: ${generationData.objective || 'Não especificado'}  
Estilo: ${generationData.style || 'Não especificado'}  
Canal: ${generationData.channel || 'Instagram Feed'}  
Mentor: ${generationData.selectedMentor || 'Não especificado'}

---

Roteiro:
🎬 Gancho: ${gancho}  
🎯 Conflito: ${conflito}  
🔁 Virada: ${virada}  
📣 CTA: ${cta}

---

Descreva a imagem ideal que represente esse roteiro:
- Qual deve ser o cenário?
- Quem aparece (ex: mulher, 40 anos, expressão pensativa)?
- Que texto aparece na imagem? (ex: Slide 1, headline)

Exemplo de descrição final esperada:

Imagem 1:
- Uma mulher de 40 anos com expressão de dúvida, tocando o rosto
- Fundo suave, luz natural
- Texto na imagem: "Flacidez não é só estética"

Imagem 2:
- Close no rosto dela, mostrando flacidez
- Texto: "Creme resolve? Só na embalagem"

Imagem 3:
- Dispositivo HIFU sendo usado
- Texto: "A tecnologia que ativa colágeno"

Imagem 4:
- Ela sorrindo confiante, com pele firme
- Texto: "Me chama no direct e descubra se é pra você"

---

Retorne apenas a descrição visual de cada imagem + texto.`;

      console.log('Gerando imagem com prompt:', imagePrompt);

      // Call the Supabase Edge Function to generate image
      const { data, error } = await supabase.functions.invoke('generate-image-description', {
        body: {
          prompt: imagePrompt
        }
      });

      if (error) {
        throw new Error(`Erro na geração: ${error.message}`);
      }

      console.log('Resposta da geração de imagem:', data);

      if (onGenerateImage) {
        onGenerateImage(imagePrompt);
      }

      toast({
        title: "Descrição da imagem gerada!",
        description: "Descrição visual criada com sucesso.",
      });

      // Store the generated description if needed
      if (data?.imageDescription) {
        console.log("Descrição da imagem:", data.imageDescription);
      }

    } catch (err) {
      console.error("Erro ao gerar descrição da imagem:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido na geração";
      
      toast({
        title: "Erro na Geração",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVoice = () => {
    if (onGenerateVoice) {
      onGenerateVoice(generatedContent.content);
    }
    
    toast({
      title: "Gerando áudio...",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  const isImageContent = generationData.contentType === 'image' || generationData.contentType === 'carousel';

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Generation Details Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Detalhes da Geração</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Objetivo:</p>
              <p className="font-medium">{generationData.objective}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Canal:</p>
              <p className="font-medium">{generationData.channel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estilo:</p>
              <p className="font-medium">{generationData.style}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tema:</p>
              <p className="font-medium">{generationData.theme}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Result Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Conteúdo Gerado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Texto da Arte</TabsTrigger>
              <TabsTrigger value="validation">Validação IA</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <div className="relative">
                <Textarea
                  value={generatedContent.content}
                  readOnly
                  className="min-h-[200px] resize-none"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="validation" className="space-y-4">
              <StructuredScriptValidation
                script={generatedContent.content}
                objective={generationData.objective}
                contentType={generationData.contentType}
                theme={generationData.theme}
                style={generationData.style}
                channel={generationData.channel}
                onGenerateImage={onGenerateImage}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isImageContent && (
          <Button 
            onClick={handleGenerateImage}
            disabled={isGeneratingImage}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGeneratingImage ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Gerando Arte...
              </>
            ) : (
              <>
                <Image className="h-4 w-4 mr-2" />
                Gerar Arte com IA
              </>
            )}
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={handleGenerateVoice}
          className="flex-1"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Gerar Áudio
        </Button>
        
        <Button 
          variant="outline"
          onClick={onNewScript}
          className="flex-1"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Novo Roteiro
        </Button>
      </div>

      {generatedImageUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Imagem Gerada</CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={generatedImageUrl} 
              alt="Imagem gerada pela IA" 
              className="w-full max-w-md mx-auto rounded-lg"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartResultDisplay;
