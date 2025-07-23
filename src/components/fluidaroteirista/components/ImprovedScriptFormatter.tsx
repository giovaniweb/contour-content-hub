import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Check,
  Clock, 
  PlayCircle, 
  Camera, 
  Mic,
  Maximize2,
  Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImprovedScriptFormatterProps {
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
  visualNote?: string;
  audioNote?: string;
  type: 'gancho' | 'desenvolvimento' | 'solucao' | 'cta' | 'transicao';
}

const ImprovedScriptFormatter: React.FC<ImprovedScriptFormatterProps> = ({ script }) => {
  const [expandedView, setExpandedView] = useState(false);
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);

  const parseScriptToBlocks = (roteiro: string): ScriptBlock[] => {
    const blocks: ScriptBlock[] = [];
    
    // Primeiro, tenta detectar blocos temporais [Gancho – 0s a 3s]
    const timeRegex = /\[([^\]]+?)\s*[-–]\s*(\d+s?\s*a?\s*\d+s?)\]/g;
    const parts = roteiro.split(timeRegex);
    
    if (parts.length > 1) {
      // Tem estrutura temporal
      for (let i = 0; i < parts.length; i += 3) {
        const content = parts[i]?.trim();
        const title = parts[i + 1]?.trim();
        const timestamp = parts[i + 2]?.trim();
        
        if (title && timestamp && content) {
          const type = getBlockType(title);
          blocks.push({
            title,
            timestamp,
            content,
            type,
            visualNote: generateVisualNote(type, content),
            audioNote: generateAudioNote(type, content)
          });
        }
      }
    } else {
      // Sem estrutura temporal - divide por parágrafo ou seções
      const lines = roteiro.split('\n').filter(line => line.trim());
      let currentBlock = '';
      let blockTitle = 'Desenvolvimento';
      let timeCounter = 0;
      
      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        // Detecta início de novo bloco
        if (trimmedLine.includes('🗣️') || 
            trimmedLine.includes('Narrador:') || 
            trimmedLine.includes('Locução:') ||
            trimmedLine.includes('**[') ||
            trimmedLine.includes('[')) {
          
          // Salva bloco anterior se existir
          if (currentBlock.trim()) {
            const type = getBlockType(blockTitle);
            blocks.push({
              title: blockTitle,
              timestamp: `${timeCounter}s - ${timeCounter + 15}s`,
              content: currentBlock.trim(),
              type,
              visualNote: generateVisualNote(type, currentBlock),
              audioNote: generateAudioNote(type, currentBlock)
            });
            timeCounter += 15;
          }
          
          // Inicia novo bloco
          blockTitle = extractBlockTitle(trimmedLine);
          currentBlock = trimmedLine;
        } else {
          currentBlock += '\n' + trimmedLine;
        }
      });
      
      // Adiciona último bloco
      if (currentBlock.trim()) {
        const type = getBlockType(blockTitle);
        blocks.push({
          title: blockTitle,
          timestamp: `${timeCounter}s - ${timeCounter + 15}s`,
          content: currentBlock.trim(),
          type,
          visualNote: generateVisualNote(type, currentBlock),
          audioNote: generateAudioNote(type, currentBlock)
        });
      }
    }
    
    return blocks.length > 0 ? blocks : [{
      title: 'Roteiro Completo',
      timestamp: '0s - 60s',
      content: roteiro,
      type: 'desenvolvimento',
      visualNote: 'Enquadramento geral, foco no conteúdo principal',
      audioNote: 'Narração clara e envolvente, música de fundo suave'
    }];
  };

  const getBlockType = (title: string): ScriptBlock['type'] => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('gancho') || titleLower.includes('abertura') || titleLower.includes('início')) return 'gancho';
    if (titleLower.includes('cta') || titleLower.includes('chamada') || titleLower.includes('ação')) return 'cta';
    if (titleLower.includes('solução') || titleLower.includes('fechamento') || titleLower.includes('resultado')) return 'solucao';
    if (titleLower.includes('desenvolvimento') || titleLower.includes('meio') || titleLower.includes('problema')) return 'desenvolvimento';
    return 'transicao';
  };

  const extractBlockTitle = (line: string): string => {
    // Remove marcadores como 🗣️, **, [], etc.
    let title = line.replace(/🗣️|🎥|\*\*|\[|\]|Narrador:|Locução:/g, '').trim();
    
    // Se a linha contém "gancho", "desenvolvimento", etc.
    if (title.toLowerCase().includes('gancho')) return 'Gancho';
    if (title.toLowerCase().includes('desenvolvimento')) return 'Desenvolvimento';
    if (title.toLowerCase().includes('fechamento')) return 'Fechamento';
    if (title.toLowerCase().includes('cta')) return 'CTA';
    
    // Pega as primeiras palavras como título
    const words = title.split(' ').slice(0, 3).join(' ');
    return words || 'Conteúdo';
  };

  const generateVisualNote = (type: ScriptBlock['type'], content: string): string => {
    const suggestions = {
      gancho: "Close-up expressivo, movimento dinâmico, cores vibrantes",
      desenvolvimento: "Planos médios, demonstração clara, boa iluminação",
      solucao: "Resultado em destaque, antes/depois, zoom no benefício",
      cta: "Enquadramento direto, informações em tela, call-to-action visível",
      transicao: "Corte dinâmico, efeito de transição suave"
    };
    return suggestions[type];
  };

  const generateAudioNote = (type: ScriptBlock['type'], content: string): string => {
    const suggestions = {
      gancho: "Tom empolgante, música de impacto, ritmo acelerado",
      desenvolvimento: "Narração confiante, música ambiente, ritmo equilibrado",
      solucao: "Tom de satisfação, música inspiradora, destaque na voz",
      cta: "Tom urgente mas amigável, música energética, chamada clara",
      transicao: "Efeito sonoro de transição, fade musical"
    };
    return suggestions[type];
  };

  const getBlockColor = (type: ScriptBlock['type']) => {
    const colors = {
      gancho: "border-l-purple-500 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/20",
      desenvolvimento: "border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20",
      solucao: "border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-950/20",
      cta: "border-l-orange-500 bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-950/20",
      transicao: "border-l-gray-500 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-950/20"
    };
    return colors[type];
  };

  const getBlockIcon = (type: ScriptBlock['type']) => {
    const icons = {
      gancho: "🎯",
      desenvolvimento: "📖", 
      solucao: "✨",
      cta: "📢",
      transicao: "🔄"
    };
    return icons[type];
  };

  const copyToClipboard = async (text: string, blockIndex?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (blockIndex !== undefined) {
        setCopiedBlock(blockIndex);
        setTimeout(() => setCopiedBlock(null), 2000);
      } else {
        setCopiedFull(true);
        setTimeout(() => setCopiedFull(false), 2000);
      }
      toast.success("Copiado para a área de transferência!");
    } catch (err) {
      toast.error("Erro ao copiar texto");
    }
  };

  const blocks = parseScriptToBlocks(script.roteiro);

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Roteiro Estruturado
          </h3>
          <p className="text-sm text-muted-foreground">
            {blocks.length} bloco{blocks.length > 1 ? 's' : ''} • {script.formato}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(script.roteiro)}
            className="flex items-center gap-2"
          >
            {copiedFull ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copiar Tudo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedView(!expandedView)}
            className="flex items-center gap-2"
          >
            {expandedView ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {expandedView ? 'Compactar' : 'Expandir'}
          </Button>
        </div>
      </div>

      {/* Versão compacta do roteiro */}
      {!expandedView && (
        <Card className="border border-border/50">
          <CardContent className="p-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-line text-muted-foreground leading-relaxed text-sm">
                {script.roteiro}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blocos estruturados */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <Card 
            key={index}
            className={cn(
              "border-l-4 transition-all duration-200 hover:shadow-sm",
              getBlockColor(block.type)
            )}
          >
            <CardContent className="p-5">
              {/* Header do bloco */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getBlockIcon(block.type)}</span>
                  <div>
                    <h4 className="font-semibold text-foreground text-base">{block.title}</h4>
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
                  onClick={() => copyToClipboard(block.content, index)}
                  className="h-8 w-8 p-0"
                >
                  {copiedBlock === index ? 
                    <Check className="h-4 w-4 text-green-600" /> : 
                    <Copy className="h-4 w-4" />
                  }
                </Button>
              </div>

              {/* Conteúdo do bloco */}
              <div className="space-y-4">
                <div className="bg-background/60 rounded-lg p-4 border border-border/30">
                  <div className="whitespace-pre-line text-foreground text-sm leading-relaxed">
                    {block.content}
                  </div>
                </div>

                {/* Notas de produção */}
                {expandedView && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border/30">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Camera className="h-4 w-4" />
                        Direção Visual
                      </div>
                      <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-3 leading-relaxed">
                        {block.visualNote}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Mic className="h-4 w-4" />
                        Direção de Áudio
                      </div>
                      <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-3 leading-relaxed">
                        {block.audioNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo da estrutura */}
      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <PlayCircle className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-foreground">Estrutura do Roteiro</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {['gancho', 'desenvolvimento', 'solucao', 'cta'].map(type => {
              const count = blocks.filter(b => b.type === type).length;
              const labels = {
                gancho: 'Ganchos',
                desenvolvimento: 'Desenvolvimento', 
                solucao: 'Soluções',
                cta: 'Chamadas'
              };
              return (
                <div key={type}>
                  <div className="text-lg font-bold text-foreground">{count}</div>
                  <div className="text-xs text-muted-foreground">{labels[type as keyof typeof labels]}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprovedScriptFormatter;