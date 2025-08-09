import React from 'react';
import { motion } from 'framer-motion';
import { parseTemporalScript, TemporalScriptBlockData } from '../utils/parseTemporalScript';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Video, Sparkles, Target, Zap, Flame, Lightbulb, BarChart3, HelpCircle, Users, AlertTriangle, TrendingUp, Eye } from 'lucide-react';

interface ImprovedReelsFormatterProps {
  roteiro: string;
  estimatedTime?: number;
}

interface ContentType {
  type: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
}

const ImprovedReelsFormatter: React.FC<ImprovedReelsFormatterProps> = ({ 
  roteiro, 
  estimatedTime 
}) => {
  // Primeiro, tenta parseamento temporal
  const temporalBlocks = parseTemporalScript(roteiro);
  
  // Se não encontrou blocos temporais válidos, força quebra em parágrafos
  const useTemporalFormat = temporalBlocks.length > 1 || 
    (temporalBlocks.length === 1 && temporalBlocks[0].time !== "");

  // Detecta tipo de conteúdo baseado no texto com emojis
  const detectContentType = (text: string): ContentType => {
    const lower = text.toLowerCase();
    
    // Gancho/Hook - primeira impressão que chama atenção
    if (
      lower.includes('você sabia') || 
      lower.includes('imagine') ||
      lower.includes('e se eu te dissesse') ||
      lower.includes('pare tudo') ||
      lower.includes('atenção') ||
      /^(você|vocês|tu)\s/.test(lower) ||
      (text.includes('?') && text.indexOf('?') < 150)
    ) {
      return { 
        type: '🎯 Gancho', 
        icon: Eye, 
        color: 'text-orange-600', 
        bgColor: 'bg-orange-50', 
        borderColor: 'border-orange-200' 
      };
    }

    // Problema/Dor - identifica dificuldades
    if (
      lower.includes('problema') || 
      lower.includes('dificuldade') ||
      lower.includes('frustração') ||
      lower.includes('não consegue') ||
      lower.includes('sofre') ||
      lower.includes('luta') ||
      lower.includes('desafio') ||
      lower.includes('celulite') ||
      lower.includes('incomoda')
    ) {
      return { 
        type: '😤 Problema', 
        icon: AlertTriangle, 
        color: 'text-red-600', 
        bgColor: 'bg-red-50', 
        borderColor: 'border-red-200' 
      };
    }

    // Agitação - intensifica o problema
    if (
      lower.includes('agitação') ||
      lower.includes('chega de') ||
      lower.includes('cansada de') ||
      lower.includes('funciona?') ||
      lower.includes('por que não') ||
      lower.includes('frustrada')
    ) {
      return { 
        type: '😠 Agitação', 
        icon: Flame, 
        color: 'text-red-500', 
        bgColor: 'bg-red-50', 
        borderColor: 'border-red-200' 
      };
    }

    // Solução/Benefício - apresenta vantagens
    if (
      lower.includes('solução') || 
      lower.includes('benefício') ||
      lower.includes('vantagem') ||
      lower.includes('resultado') ||
      lower.includes('melhora') ||
      lower.includes('transforma') ||
      lower.includes('consegue') ||
      lower.includes('alcança') ||
      lower.includes('tecnologia') ||
      lower.includes('segredo')
    ) {
      return { 
        type: '💡 Solução', 
        icon: Lightbulb, 
        color: 'text-green-600', 
        bgColor: 'bg-green-50', 
        borderColor: 'border-green-200' 
      };
    }

    // Prova Social - estatísticas, depoimentos
    if (
      /\d+%/.test(text) || 
      /\d+\s*(pessoas|clientes|usuários|mulheres)/.test(lower) ||
      lower.includes('pesquisa') ||
      lower.includes('estudo') ||
      lower.includes('especialista') ||
      lower.includes('comprovado') ||
      lower.includes('testado') ||
      lower.includes('ciência') ||
      lower.includes('eficaz')
    ) {
      return { 
        type: '📊 Prova Social', 
        icon: BarChart3, 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-50', 
        borderColor: 'border-blue-200' 
      };
    }

    // CTA - call to action
    if (
      lower.includes('clique') || 
      lower.includes('acesse') ||
      lower.includes('baixe') ||
      lower.includes('inscreva') ||
      lower.includes('siga') ||
      lower.includes('compartilhe') ||
      lower.includes('comenta') ||
      lower.includes('link') ||
      lower.includes('garanta') ||
      /^(vem|vamos|vai|faça|teste)/.test(lower)
    ) {
      return { 
        type: '🚀 CTA', 
        icon: Target, 
        color: 'text-purple-600', 
        bgColor: 'bg-purple-50', 
        borderColor: 'border-purple-200' 
      };
    }

    // Urgência/Escassez
    if (
      lower.includes('hoje') || 
      lower.includes('agora') ||
      lower.includes('últimas') ||
      lower.includes('apenas') ||
      lower.includes('limitado') ||
      lower.includes('restam') ||
      lower.includes('rápido') ||
      lower.includes('não perca') ||
      lower.includes('transformação')
    ) {
      return { 
        type: '⚡ Urgência', 
        icon: Zap, 
        color: 'text-amber-600', 
        bgColor: 'bg-amber-50', 
        borderColor: 'border-amber-200' 
      };
    }

    // Pergunta retórica
    if (text.includes('?')) {
      return { 
        type: '❓ Pergunta', 
        icon: HelpCircle, 
        color: 'text-indigo-600', 
        bgColor: 'bg-indigo-50', 
        borderColor: 'border-indigo-200' 
      };
    }

    // Resultado/Impacto
    if (
      lower.includes('resultado') ||
      lower.includes('aumento') ||
      lower.includes('diminuição') ||
      lower.includes('melhoria') ||
      /\d+x/.test(lower) ||
      lower.includes('mais') ||
      lower.includes('redução')
    ) {
      return { 
        type: '📈 Resultado', 
        icon: TrendingUp, 
        color: 'text-emerald-600', 
        bgColor: 'bg-emerald-50', 
        borderColor: 'border-emerald-200' 
      };
    }

    // Conteúdo padrão
    return { 
      type: '📝 Conteúdo', 
      icon: Sparkles, 
      color: 'text-slate-600', 
      bgColor: 'bg-slate-50', 
      borderColor: 'border-slate-200' 
    };
  };

  // Detecta e destaca frases de impacto
  const highlightImpactPhrases = (text: string): React.ReactNode => {
    // Padrões de frases de impacto
    const impactPatterns = [
      /\d+%[^.!?]*/g, // Percentuais
      /\d+x\s+[^.!?]*/g, // Multiplicadores
      /[^.!?]*[Rr]esultado[^.!?]*/g, // Resultados
      /[^.!?]*[Tt]ransform[^.!?]*/g, // Transformações
      /[^.!?]*[Aa]ument[^.!?]*/g, // Aumentos
    ];

    let result: React.ReactNode = text;
    let hasHighlight = false;

    impactPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        hasHighlight = true;
        matches.forEach(match => {
          result = (result as string).replace(
            match,
            `<mark class="bg-yellow-100 text-yellow-800 px-1 rounded font-medium">${match}</mark>`
          );
        });
      }
    });

    if (hasHighlight && typeof result === 'string') {
      return <span dangerouslySetInnerHTML={{ __html: result }} />;
    }

    return result;
  };

  const formatLongText = (text: string): string[] => {
    if (!text) return [];

    // ALGORITMO INTELIGENTE DE QUEBRA DE TEXTO
    const smartBreakText = (content: string): string[] => {
      // Remove quebras de linha e espaços extras
      let cleanText = content.replace(/\s+/g, ' ').trim();
      
      // Padrões de quebra semântica
      const breakPatterns = [
        // Perguntas retóricas
        /([^.!?]*\?)\s+/g,
        // Estatísticas e números
        /(\d+%[^.!?]*[.!?])\s+/g,
        // CTAs e verbos de ação
        /((?:clique|acesse|baixe|inscreva|siga|compartilhe|comenta|vem|vamos|vai|faça|teste)[^.!?]*[.!?])\s+/gi,
        // Introdução de problemas
        /((?:problema|dificuldade|frustração)[^.!?]*[.!?])\s+/gi,
        // Apresentação de soluções
        /((?:solução|benefício|resultado|segredo)[^.!?]*[.!?])\s+/gi,
        // Urgência temporal
        /((?:hoje|agora|últimas|apenas|limitado|rápido)[^.!?]*[.!?])\s+/gi,
        // Pontos de exclamação (emoção)
        /([^.!?]*!)\s+/g
      ];

      let parts: string[] = [];
      let lastIndex = 0;

      // Aplica quebras baseadas nos padrões
      breakPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(cleanText)) !== null) {
          const endIndex = match.index + match[1].length;
          if (endIndex > lastIndex + 30) { // Mínimo 30 chars por segmento
            const segment = cleanText.substring(lastIndex, endIndex).trim();
            if (segment.length > 15) {
              parts.push(segment);
              lastIndex = endIndex;
            }
          }
        }
      });

      // Adiciona o texto restante se houver
      if (lastIndex < cleanText.length - 20) {
        const remaining = cleanText.substring(lastIndex).trim();
        if (remaining.length > 15) {
          parts.push(remaining);
        }
      }

      // Se não conseguiu quebrar adequadamente, força por sentenças
      if (parts.length <= 1) {
        const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 20);
        if (sentences.length > 1) {
          return sentences.slice(0, 6).map(s => s.trim() + (s.match(/[.!?]$/) ? '' : '.'));
        }
      }

      // Fallback final - quebra por tamanho com palavras completas
      if (parts.length <= 1 && cleanText.length > 300) {
        const words = cleanText.split(' ');
        const chunks: string[] = [];
        let currentChunk = '';
        
        for (const word of words) {
          if (currentChunk.length + word.length > 120 && currentChunk.length > 30) {
            chunks.push(currentChunk.trim());
            currentChunk = word + ' ';
          } else {
            currentChunk += word + ' ';
          }
        }
        
        if (currentChunk.trim().length > 20) {
          chunks.push(currentChunk.trim());
        }
        
        return chunks.slice(0, 6);
      }

      return parts.length > 0 ? parts.slice(0, 6) : [cleanText];
    };

    return smartBreakText(text);
  };
  const estimateBlockTime = (text: string): number => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 2.5)); // ~150 wpm
  };

  if (useTemporalFormat) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Roteiro para Reels
            </h2>
            <Sparkles className="h-5 w-5 text-secondary" />
          </div>
          {estimatedTime && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {estimatedTime}s • Ideal: 30-45s
            </Badge>
          )}
        </header>

        <div className="space-y-3">
          {temporalBlocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border border-border/60 bg-gradient-to-br from-primary/5 via-background/80 to-secondary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {block.time && (
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {block.time}
                      </Badge>
                    )}
                    <div className="flex-1 space-y-1">
                      {block.label && (
                        <div className="font-medium text-sm text-primary">
                          {block.label}
                        </div>
                      )}
                      <div className="text-sm leading-relaxed text-foreground/80">
                        {block.content}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Formato de parágrafos melhorados
  const paragraphs = formatLongText(roteiro);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <header className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Video className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            OFF para Reels
          </h2>
          <Sparkles className="h-5 w-5 text-secondary" />
        </div>
        {estimatedTime && (
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {estimatedTime}s • Ideal: 30-45s
          </Badge>
        )}
      </header>

      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => {
          const blockTime = estimateBlockTime(paragraph);
          const contentType = detectContentType(paragraph);
          const IconComponent = contentType.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className={`border-2 ${contentType.borderColor} ${contentType.bgColor} shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    {/* Header com badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs font-semibold">
                        ⏱️ {blockTime}s
                      </Badge>
                      
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium ${contentType.color} border-current flex items-center gap-1.5`}
                      >
                        <IconComponent className="h-3.5 w-3.5" />
                        {contentType.type}
                      </Badge>
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="text-sm leading-relaxed text-foreground/90 font-medium">
                      {highlightImpactPhrases(paragraph)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        
        {/* Footer com tempo total */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: paragraphs.length * 0.15 + 0.2 }}
          className="mt-6"
        >
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    Tempo Total: {paragraphs.reduce((total, p) => total + estimateBlockTime(p), 0)}s
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {paragraphs.reduce((total, p) => total + estimateBlockTime(p), 0) <= 45 
                      ? '✅ Dentro do limite ideal (até 45s)' 
                      : '⚠️ Acima do limite recomendado'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ImprovedReelsFormatter;