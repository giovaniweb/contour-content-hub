
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wand2, Sparkles, Camera, Volume2 } from "lucide-react";
import { AkinatorState } from './types';

interface AkinatorResultProps {
  state: AkinatorState;
  onDisneyMagic: () => void;
  onApproveScript: () => void;
  onGenerateImage: () => void;
  onGenerateAudio: () => void;
  onReset: () => void;
}

const AkinatorResult: React.FC<AkinatorResultProps> = ({
  state,
  onDisneyMagic,
  onApproveScript,
  onGenerateImage,
  onGenerateAudio,
  onReset
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            Roteiro Criado pela Magia do Akinator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-line text-sm bg-muted/50 p-6 rounded-lg mb-6">
            {state.generatedScript}
          </div>
          
          {!state.isApproved && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button 
                onClick={onDisneyMagic}
                variant="outline"
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                ✨ Transformar com Magia Disney 1928
              </Button>
              
              <Button 
                onClick={onApproveScript}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                ✅ Aprovar Roteiro
              </Button>
            </div>
          )}
          
          {state.isApproved && (
            <div className="space-y-4">
              <div className="text-center">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Roteiro Aprovado!
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {state.contentType !== 'video' ? (
                  <Button 
                    onClick={onGenerateImage}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    🖼️ Criar imagem com IA
                  </Button>
                ) : (
                  <Button 
                    onClick={onGenerateAudio}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    🎧 Gerar áudio com voz IA
                  </Button>
                )}
                
                <Button 
                  onClick={onReset}
                  variant="outline"
                  className="flex-1"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Novo Roteiro
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AkinatorResult;
