
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Image, Volume2, Video, Sparkles, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScriptGenerationData, GeneratedContent } from './types';

interface SmartResultDisplayProps {
  generationData: ScriptGenerationData;
  generatedContent: GeneratedContent;
  onGenerateImage?: () => void;
  onGenerateVoice?: () => void;
  onNewScript: () => void;
}

export const SmartResultDisplay: React.FC<SmartResultDisplayProps> = ({
  generationData,
  generatedContent,
  onGenerateImage,
  onGenerateVoice,
  onNewScript
}) => {
  const { toast } = useToast();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast({
      title: "Copiado!",
      description: `${section} copiado para a área de transferência.`,
    });
    
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const formatContent = (content: string, type: string) => {
    switch (type) {
      case 'video':
        const sections = content.split('\n\n');
        return (
          <div className="space-y-4">
            {sections.map((section, index) => {
              const [label, ...contentParts] = section.split('\n');
              const sectionContent = contentParts.join('\n');
              
              return (
                <div key={index} className="border rounded-lg p-4 bg-gray-800/30">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-purple-400">{label}</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(sectionContent, label)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed">{sectionContent}</p>
                </div>
              );
            })}
          </div>
        );

      case 'bigIdea':
        const ideas = content.split('\n').filter(line => line.trim().startsWith('•') || line.trim().match(/^\d+\./));
        return (
          <div className="space-y-3">
            {ideas.map((idea, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-800/30">
                <div className="flex justify-between items-start">
                  <p className="text-sm leading-relaxed flex-1">{idea.replace(/^[•\d\.]\s*/, '')}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(idea.replace(/^[•\d\.]\s*/, ''), `Ideia ${index + 1}`)}
                    className="h-6 w-6 p-0 ml-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'carousel':
      case 'image':
        return (
          <div className="border rounded-lg p-4 bg-gray-800/30">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-purple-400">Texto da Arte</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(content, 'Texto completo')}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap">{content}</pre>
          </div>
        );

      default:
        return (
          <div className="border rounded-lg p-4 bg-gray-800/30">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-purple-400">Conteúdo</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(content, 'Conteúdo completo')}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap">{content}</pre>
          </div>
        );
    }
  };

  const getActionButtons = () => {
    const buttons = [];

    if (generatedContent.type === 'image' || generatedContent.type === 'carousel') {
      buttons.push(
        <Button
          key="generate-image"
          variant="outline"
          onClick={onGenerateImage}
          className="flex-1"
        >
          <Image className="mr-2 h-4 w-4" />
          Gerar Arte com IA
        </Button>
      );
    }

    if (generatedContent.type === 'video') {
      buttons.push(
        <Button
          key="generate-voice"
          variant="outline"
          onClick={onGenerateVoice}
          className="flex-1"
        >
          <Volume2 className="mr-2 h-4 w-4" />
          Gerar Narração
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Roteiro Gerado com Sucesso!</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Sparkles className="h-4 w-4" />
              <span>Inspirado em {generatedContent.mentor}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            {generationData.contentType}
          </Badge>
        </div>
      </Card>

      {/* Generation Details */}
      <Card className="p-6 bg-gray-900/50 border-gray-800">
        <h3 className="font-semibold mb-4">Detalhes da Geração</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Objetivo:</span>
            <p className="font-medium">{generationData.objective}</p>
          </div>
          <div>
            <span className="text-gray-400">Canal:</span>
            <p className="font-medium">{generationData.channel}</p>
          </div>
          <div>
            <span className="text-gray-400">Estilo:</span>
            <p className="font-medium">{generationData.style}</p>
          </div>
          <div>
            <span className="text-gray-400">Tema:</span>
            <p className="font-medium">{generationData.theme}</p>
          </div>
        </div>
      </Card>

      {/* Generated Content */}
      <Card className="p-6 bg-gray-900/50 border-gray-800">
        <h3 className="font-semibold mb-4">Conteúdo Gerado</h3>
        {formatContent(generatedContent.content, generatedContent.type)}
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {getActionButtons()}
        <Button onClick={onNewScript} className="bg-purple-600 hover:bg-purple-700">
          <Sparkles className="mr-2 h-4 w-4" />
          Novo Roteiro
        </Button>
      </div>
    </div>
  );
};

export default SmartResultDisplay;
