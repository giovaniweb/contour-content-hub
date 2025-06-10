
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Camera, Volume2, Calendar, Sparkles, CheckCircle, RotateCcw } from "lucide-react";
import { SmartGenerationResult } from '@/pages/ScriptGeneratorPage/useSmartScriptGeneration';
import { useToast } from "@/hooks/use-toast";
import FluiAEncantadorSection from '@/components/script-generator/FluiAEncantadorSection';

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

  console.log('🎭 SmartResultDisplay - Props:', {
    isApproved,
    isDisneyApplied,
    isProcessing,
    mentor: generationResult.mentor
  });

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

      {/* FluiA Encantador - SEMPRE aparece se aprovado e não aplicou Disney ainda */}
      {isApproved && !isDisneyApplied && (
        <FluiAEncantadorSection
          onActivate={onApplyDisney}
          isActive={false}
          isProcessing={isProcessing}
        />
      )}

      {/* Confirmação Disney ativado */}
      {isApproved && isDisneyApplied && (
        <FluiAEncantadorSection
          onActivate={() => {}}
          isActive={true}
          isProcessing={false}
        />
      )}

      {/* Ações pós-aprovação - SEMPRE mostrar se aprovado */}
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
    </div>
  );
};

export default SmartResultDisplay;
