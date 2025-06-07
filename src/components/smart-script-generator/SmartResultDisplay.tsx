
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Camera, Volume2, Wand2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScriptGenerationData, GeneratedContent } from './types';
import { generateDisneyScript } from '../akinator-script-generator/scriptGenerator';

interface SmartResultDisplayProps {
  generationData: ScriptGenerationData;
  generatedContent: GeneratedContent;
  onGenerateImage: () => void;
  onGenerateVoice: () => void;
  onNewScript: () => void;
}

const SmartResultDisplay: React.FC<SmartResultDisplayProps> = ({
  generationData,
  generatedContent,
  onGenerateImage,
  onGenerateVoice,
  onNewScript
}) => {
  const { toast } = useToast();
  const [currentContent, setCurrentContent] = useState(generatedContent.content);
  const [isDisneyApplied, setIsDisneyApplied] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(currentContent);
    toast({
      title: "Roteiro copiado!",
      description: "O roteiro foi copiado para a área de transferência.",
    });
  };

  const handleDisneyTransformation = () => {
    const disneyScript = generateDisneyScript(currentContent, generatedContent.type, generationData);
    setCurrentContent(disneyScript);
    setIsDisneyApplied(true);
    
    toast({
      title: "✨ Magia Disney 1928 Aplicada!",
      description: "Walt Disney transformou seu roteiro com narrativa encantadora e emocional.",
    });
  };

  const handleApproveScript = () => {
    setIsApproved(true);
    toast({
      title: "✅ Roteiro Aprovado!",
      description: "Agora você pode gerar conteúdo adicional.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Roteiro Gerado</h1>
            <p className="text-muted-foreground">
              {generationData.contentType} • {generationData.objective} • {generatedContent.mentor}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onNewScript}>
              <Wand2 className="h-4 w-4 mr-2" />
              Novo Roteiro
            </Button>
            <Button onClick={handleCopyScript}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Conteúdo Gerado</span>
              <div className="flex gap-2">
                <Badge variant="outline">{generatedContent.type}</Badge>
                {isDisneyApplied && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    🏰 Walt Disney 1928
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-sm bg-muted/50 p-6 rounded-lg mb-6">
              {currentContent}
            </div>
            
            {!isApproved && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {!isDisneyApplied && (
                  <Button 
                    onClick={handleDisneyTransformation}
                    variant="outline"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    🏰 Transformar com Magia Disney 1928
                  </Button>
                )}
                
                <Button 
                  onClick={handleApproveScript}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  ✅ Aprovar Roteiro
                </Button>
              </div>
            )}
            
            {isApproved && (
              <div className="space-y-4">
                <div className="text-center">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Roteiro Aprovado!
                  </Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {generatedContent.type !== 'video' ? (
                    <Button 
                      onClick={onGenerateImage}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      🖼️ Criar imagem com IA
                    </Button>
                  ) : (
                    <Button 
                      onClick={onGenerateVoice}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      🎧 Gerar áudio com voz IA
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {generatedContent.suggestions && (
          <Card>
            <CardHeader>
              <CardTitle>Sugestões Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedContent.suggestions.generateImage && (
                  <p className="text-sm text-muted-foreground">
                    💡 Para este tipo de conteúdo, recomendamos gerar uma imagem visual atrativa
                  </p>
                )}
                {generatedContent.suggestions.generateVoice && (
                  <p className="text-sm text-muted-foreground">
                    🎙️ Considere adicionar uma narração em áudio para maior engajamento
                  </p>
                )}
                {generatedContent.suggestions.relatedVideos && generatedContent.suggestions.relatedVideos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Vídeos relacionados sugeridos:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {generatedContent.suggestions.relatedVideos.map((video, index) => (
                        <li key={index}>• {video}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SmartResultDisplay;
