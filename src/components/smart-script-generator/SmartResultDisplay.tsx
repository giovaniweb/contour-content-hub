
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Camera, Volume2, Wand2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SmartGenerationResult } from '@/pages/ScriptGeneratorPage/useSmartScriptGeneration';
import { useEquipments } from '@/hooks/useEquipments';

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
  const { equipments } = useEquipments();

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generationResult.content);
    toast({
      title: "Roteiro copiado!",
      description: "O roteiro foi copiado para a área de transferência.",
    });
  };

  const getContentTypeLabel = () => {
    const labels = {
      'bigIdea': 'Big Idea',
      'stories': 'Stories',
      'carousel': 'Carrossel',
      'image': 'Imagem',
      'video': 'Vídeo'
    };
    return labels[generationResult.intention.tipo_conteudo] || 'Conteúdo';
  };

  const getObjectiveLabel = () => {
    const labels = {
      'leads': 'Gerar Leads',
      'vendas': 'Vendas',
      'autoridade': 'Autoridade',
      'engajamento': 'Engajamento',
      'ensinar': 'Educação',
      'emocional': 'Conexão Emocional'
    };
    return labels[generationResult.intention.objetivo] || 'Objetivo';
  };

  const getEquipmentLabel = () => {
    if (generationResult.intention.equipamento === 'sem_equipamento') {
      return 'Protocolo da Clínica';
    }
    
    // Buscar o equipamento na lista de equipamentos
    const equipment = equipments.find(eq => eq.id === generationResult.intention.equipamento);
    if (equipment) {
      return equipment.nome;
    }
    
    // Fallback caso não encontre
    return generationResult.intention.equipamento || 'Não específico';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Roteiro Gerado</h1>
            <p className="text-muted-foreground">
              {getContentTypeLabel()} • {getObjectiveLabel()} • {generationResult.mentor}
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
                <Badge variant="outline">{getContentTypeLabel()}</Badge>
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
              {generationResult.content}
            </div>
            
            {!isApproved && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {!isDisneyApplied && (
                  <Button 
                    onClick={onApplyDisney}
                    variant="outline"
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    🏰 Transformar com Magia Disney 1928
                  </Button>
                )}
                
                <Button 
                  onClick={onApproveScript}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isProcessing}
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
                  {generationResult.intention.tipo_conteudo !== 'video' ? (
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

        {/* Enigma do Mentor */}
        <Card>
          <CardHeader>
            <CardTitle>Assinatura do Mentor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <p className="text-purple-400 italic">"{generationResult.enigma}"</p>
              <p className="text-sm text-gray-400 mt-2">— {generationResult.mentor}</p>
            </div>
          </CardContent>
        </Card>

        {/* Dados da Intenção */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Intenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Tipo:</strong> {getContentTypeLabel()}
              </div>
              <div>
                <strong>Objetivo:</strong> {getObjectiveLabel()}
              </div>
              <div>
                <strong>Canal:</strong> {generationResult.intention.canal}
              </div>
              <div>
                <strong>Estilo:</strong> {generationResult.intention.estilo_comunicacao}
              </div>
              <div>
                <strong>Equipamento:</strong> {getEquipmentLabel()}
              </div>
              <div>
                <strong>Tema:</strong> {generationResult.intention.tema}
              </div>
              <div className="col-span-2">
                <strong>Mentor:</strong> {generationResult.mentor}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartResultDisplay;
