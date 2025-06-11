
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Camera, Volume2, Calendar, Sparkles, CheckCircle, RotateCcw } from "lucide-react";
import { SmartGenerationResult } from '@/pages/ScriptGeneratorPage/useSmartScriptGeneration';
import { useToast } from "@/hooks/use-toast";

interface SmartResultDisplayProps {
  generationResult: SmartGenerationResult;
  onGenerateImage: () => void;
  onGenerateVoice: () => void;
  onNewScript: () => void;
  onApplyDisney: () => void;
  onApproveScript: () => void;
  isDisneyApplied: boolean;
  isApproved: boolean;
  isProcessing: boolean;
}

const SmartResultDisplay: React.FC<SmartResultDisplayProps> = ({
  generationResult,
  onGenerateImage,
  onGenerateVoice,
  onNewScript,
  onApplyDisney,
  onApproveScript,
  isDisneyApplied,
  isApproved,
  isProcessing
}) => {
  const { toast } = useToast();

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generationResult.content);
    toast({
      title: "✅ Copiado!",
      description: "Roteiro copiado para área de transferência"
    });
  };

  const handleAddToPlanner = () => {
    toast({
      title: "📅 Adicionando ao Planejador...",
      description: "Seu roteiro será adicionado ao planejamento estratégico"
    });
    // Aqui seria implementada a lógica para adicionar ao planejador
  };

  const isVideoFormat = generationResult.intention.tipo_conteudo === 'video';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Header com informações do mentor e enigma */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Roteiro Criado por {generationResult.mentor}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {generationResult.enigma}
              </p>
            </div>
            <Badge variant="outline" className="bg-background">
              {generationResult.intention.tipo_conteudo}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Conteúdo do roteiro */}
      <Card>
        <CardHeader>
          <CardTitle>Seu Roteiro Personalizado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-line text-sm bg-muted/50 p-6 rounded-lg mb-6 leading-relaxed">
            {generationResult.content}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="secondary">
                {generationResult.intention.canal}
              </Badge>
              <Badge variant="outline">
                {generationResult.intention.estilo_comunicacao}
              </Badge>
            </div>
            <Button variant="outline" onClick={handleCopyScript}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ações de aprovação e transformação */}
      {!isApproved && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Aprove ou Transforme seu Roteiro</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={onApplyDisney}
                  variant="outline"
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  ✨ Encantar com Fluida
                </Button>
                
                <Button 
                  onClick={onApproveScript}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  ✅ Aprovar Roteiro
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações pós-aprovação */}
      {isApproved && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Roteiro Aprovado!
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold">Próximos Passos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {!isVideoFormat ? (
                  <Button 
                    onClick={onGenerateImage}
                    disabled={isProcessing}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Criar Imagem com IA
                  </Button>
                ) : (
                  <Button 
                    onClick={onGenerateVoice}
                    disabled={isProcessing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Gerar Áudio com IA
                  </Button>
                )}
                
                <Button 
                  onClick={handleAddToPlanner}
                  variant="outline"
                  disabled={isProcessing}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Adicionar ao Planejador
                </Button>
                
                <Button 
                  onClick={onNewScript}
                  variant="outline"
                  disabled={isProcessing}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Novo Roteiro
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações sobre transformação Disney */}
      {isDisneyApplied && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-700">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">
                ✨ Transformado com a Magia Disney 1928 - Walt Disney aplicou técnicas de storytelling encantador!
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartResultDisplay;
