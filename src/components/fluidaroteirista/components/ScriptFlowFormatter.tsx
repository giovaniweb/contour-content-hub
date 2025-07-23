import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Eye, EyeOff, Clock, PlayCircle, Camera, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScriptFlowFormatterProps {
  script: {
    roteiro: string;
    formato: string;
    emocao_central: string;
    intencao: string;
    objetivo: string;
    mentor: string;
  };
}

interface ScriptBlock {
  timestamp: string;
  title: string;
  content: string;
  type: 'gancho' | 'desenvolvimento' | 'solucao' | 'cta' | 'transicao';
  visualSuggestion?: string;
  audioSuggestion?: string;
}

const ScriptFlowFormatter: React.FC<ScriptFlowFormatterProps> = ({ script }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set());

  const parseScriptBlocks = (roteiro: string): ScriptBlock[] => {
    const blocks: ScriptBlock[] = [];
    
    // Regex para capturar blocos temporais como [Gancho – 0s a 3s]
    const timeRegex = /\[([^\]]+?)\s*[-–]\s*(\d+s?\s*a?\s*\d+s?)\]/g;
    const parts = roteiro.split(timeRegex);
    
    let currentTime = "";
    let currentTitle = "";
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]?.trim();
      if (!part) continue;
      
      if (i % 3 === 1) { // Título do bloco
        currentTitle = part;
      } else if (i % 3 === 2) { // Timestamp
        currentTime = part;
      } else if (i % 3 === 0 && currentTitle && currentTime) { // Conteúdo
        const type = getBlockType(currentTitle);
        blocks.push({
          timestamp: currentTime,
          title: currentTitle,
          content: part,
          type,
          visualSuggestion: generateVisualSuggestion(type, part),
          audioSuggestion: generateAudioSuggestion(type, part)
        });
        currentTitle = "";
        currentTime = "";
      }
    }
    
    // Se não encontrou blocos temporais, tenta outro formato
    if (blocks.length === 0) {
      const lines = roteiro.split('\n').filter(line => line.trim());
      let currentBlock = '';
      let blockTitle = 'Conteúdo';
      
      lines.forEach((line, index) => {
        if (line.includes('🗣️') || line.includes('Narrador:') || line.includes('Locução:')) {
          if (currentBlock) {
            blocks.push({
              timestamp: `${index * 10}s`,
              title: blockTitle,
              content: currentBlock,
              type: 'desenvolvimento',
              visualSuggestion: generateVisualSuggestion('desenvolvimento', currentBlock),
              audioSuggestion: generateAudioSuggestion('desenvolvimento', currentBlock)
            });
          }
          currentBlock = line;
          blockTitle = getBlockTitleFromContent(line);
        } else {
          currentBlock += '\n' + line;
        }
      });
      
      if (currentBlock) {
        blocks.push({
          timestamp: `${blocks.length * 10}s`,
          title: blockTitle,
          content: currentBlock,
          type: 'desenvolvimento',
          visualSuggestion: generateVisualSuggestion('desenvolvimento', currentBlock),
          audioSuggestion: generateAudioSuggestion('desenvolvimento', currentBlock)
        });
      }
    }
    
    return blocks;
  };

  const getBlockType = (title: string): ScriptBlock['type'] => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('gancho') || titleLower.includes('abertura')) return 'gancho';
    if (titleLower.includes('cta') || titleLower.includes('chamada')) return 'cta';
    if (titleLower.includes('solução') || titleLower.includes('fechamento')) return 'solucao';
    if (titleLower.includes('desenvolvimento') || titleLower.includes('meio')) return 'desenvolvimento';
    return 'transicao';
  };

  const getBlockTitleFromContent = (content: string): string => {
    if (content.toLowerCase().includes('gancho')) return 'Gancho';
    if (content.toLowerCase().includes('cta')) return 'CTA';
    if (content.toLowerCase().includes('fechamento')) return 'Fechamento';
    return 'Desenvolvimento';
  };

  const generateVisualSuggestion = (type: ScriptBlock['type'], content: string): string => {
    const suggestions = {
      gancho: "Close-up no rosto, expressão de surpresa, movimento rápido da câmera",
      desenvolvimento: "Planos médios, transições suaves, foco no produto/procedimento",
      solucao: "Antes e depois, zoom no resultado, iluminação destacada",
      cta: "Enquadramento direto, botão/contato em destaque, movimento de call-to-action",
      transicao: "Corte rápido, efeito de transição, mudança de cenário"
    };
    return suggestions[type] || suggestions.desenvolvimento;
  };

  const generateAudioSuggestion = (type: ScriptBlock['type'], content: string): string => {
    const suggestions = {
      gancho: "Tom energético, música de suspense, efeito de impacto",
      desenvolvimento: "Narração confiante, música de fundo suave, ritmo constante",
      solucao: "Tom de conquista, música inspiradora, crescendo musical",
      cta: "Tom urgente mas amigável, música energética, destaque na fala",
      transicao: "Efeito sonoro de transição, fade musical"
    };
    return suggestions[type] || suggestions.desenvolvimento;
  };

  const getBlockColor = (type: ScriptBlock['type']) => {
    const colors = {
      gancho: "border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20",
      desenvolvimento: "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
      solucao: "border-l-green-500 bg-green-50/50 dark:bg-green-950/20",
      cta: "border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20",
      transicao: "border-l-gray-500 bg-gray-50/50 dark:bg-gray-950/20"
    };
    return colors[type] || colors.desenvolvimento;
  };

  const getBlockIcon = (type: ScriptBlock['type']) => {
    const icons = {
      gancho: "🎯",
      desenvolvimento: "📖",
      solucao: "✨",
      cta: "📢",
      transicao: "🔄"
    };
    return icons[type] || icons.desenvolvimento;
  };

  const toggleBlockExpansion = (index: number) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedBlocks(newExpanded);
  };

  const blocks = parseScriptBlocks(script.roteiro);

  return (
    <div className="space-y-4">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Roteiro Estruturado
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex items-center gap-2"
        >
          {showSuggestions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showSuggestions ? 'Ocultar' : 'Mostrar'} Sugestões
        </Button>
      </div>

      {/* Roteiro corrido - versão compacta */}
      <Card className="border border-border/50">
        <CardContent className="p-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {script.roteiro}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blocos estruturados */}
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <Card 
            key={index}
            className={cn(
              "border-l-4 transition-all duration-200 hover:shadow-md",
              getBlockColor(block.type)
            )}
          >
            <CardContent className="p-4">
              {/* Header do bloco */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getBlockIcon(block.type)}</span>
                  <div>
                    <h4 className="font-semibold text-foreground">{block.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {block.timestamp}
                      </Badge>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {block.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBlockExpansion(index)}
                  className="h-8 w-8 p-0"
                >
                  {expandedBlocks.has(index) ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </Button>
              </div>

              {/* Conteúdo do bloco */}
              <div className="space-y-3">
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="whitespace-pre-line text-sm text-foreground">
                    {block.content}
                  </div>
                </div>

                {/* Sugestões expandidas */}
                {showSuggestions && expandedBlocks.has(index) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-border/50">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Camera className="h-4 w-4" />
                        Sugestão Visual
                      </div>
                      <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                        {block.visualSuggestion}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Mic className="h-4 w-4" />
                        Sugestão de Áudio
                      </div>
                      <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                        {block.audioSuggestion}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ScriptFlowFormatter;