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

  // Detecta tipo de conteúdo baseado no texto
  const detectContentType = (text: string): ContentType => {
    const lower = text.toLowerCase();
    
    // Gancho/Hook - primeira impressão que chama atenção
    if (
      lower.includes('você sabia') || 
      lower.includes('imagine') ||
      lower.includes('e se eu te dissesse') ||
      /^(você|vocês|tu)\s/.test(lower) ||
      text.includes('?') && text.indexOf('?') < 100
    ) {
      return { 
        type: 'Gancho', 
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
      lower.includes('desafio')
    ) {
      return { 
        type: 'Problema', 
        icon: AlertTriangle, 
        color: 'text-red-600', 
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
      lower.includes('alcança')
    ) {
      return { 
        type: 'Solução', 
        icon: Lightbulb, 
        color: 'text-green-600', 
        bgColor: 'bg-green-50', 
        borderColor: 'border-green-200' 
      };
    }

    // Prova Social - estatísticas, depoimentos
    if (
      /\d+%/.test(text) || 
      /\d+\s*(pessoas|clientes|usuários)/.test(lower) ||
      lower.includes('pesquisa') ||
      lower.includes('estudo') ||
      lower.includes('especialista') ||
      lower.includes('comprovado') ||
      lower.includes('testado')
    ) {
      return { 
        type: 'Prova Social', 
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
      /^(vem|vamos|vai|faça|teste)/.test(lower)
    ) {
      return { 
        type: 'CTA', 
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
      lower.includes('rápido')
    ) {
      return { 
        type: 'Urgência', 
        icon: Flame, 
        color: 'text-red-500', 
        bgColor: 'bg-red-50', 
        borderColor: 'border-red-200' 
      };
    }

    // Pergunta retórica
    if (text.includes('?')) {
      return { 
        type: 'Pergunta', 
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
      lower.includes('mais')
    ) {
      return { 
        type: 'Resultado', 
        icon: TrendingUp, 
        color: 'text-emerald-600', 
        bgColor: 'bg-emerald-50', 
        borderColor: 'border-emerald-200' 
      };
    }

    // Conteúdo padrão
    return { 
      type: 'Conteúdo', 
      icon: Sparkles, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50', 
      borderColor: 'border-gray-200' 
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

    // Detecta pontos de quebra semântica específicos
    const addSemanticBreaks = (content: string): string => {
      return content
        // Quebra OBRIGATÓRIA após perguntas retóricas
        .replace(/([.!?])\s*(?=[A-ZÀ-Ý])/g, "$1\n")
        .replace(/(\?)\s+/g, "$1\n\n")
        
        // Quebra antes de estatísticas e dados numéricos
        .replace(/\s+(\d+%)/g, "\n\n$1")
        .replace(/\s+(segundo|de acordo|pesquisa|estudo)/gi, "\n\n$1")
        
        // Quebra antes de CTAs claros
        .replace(/\s+(clique|acesse|baixe|inscreva|siga|compartilhe|comenta|vem|vamos|faça|teste)/gi, "\n\n$1")
        
        // Quebra antes de palavras de urgência
        .replace(/\s+(hoje|agora|últimas|apenas|limitado|restam|rápido)/gi, "\n\n$1")
        
        // Quebra antes de introdução de soluções/produtos
        .replace(/\s+(apresent|conheç|descubr|experiment|test)/gi, "\n\n$1")
        
        // Quebra antes de benefícios claros
        .replace(/\s+(benefício|vantagem|resultado|melhora|transforma|consegue|alcança)/gi, "\n\n$1");
    };

    // Aplica quebras semânticas primeiro
    let processedText = addSemanticBreaks(text);

    // Remove formatação excessiva
    processedText = processedText
      .replace(/\[[^\]]+\]/g, " ")
      .replace(/\([^)]{3,}\)/g, " ")
      .replace(/[\t ]+/g, " ")
      .trim();

    // Se tem quebras, divide por elas
    if (processedText.includes("\n")) {
      const parts = processedText
        .split(/\n+/)
        .map(p => p.trim())
        .filter(Boolean)
        .filter(p => p.length > 10); // Remove fragmentos muito pequenos
      
      if (parts.length > 1) return parts;
    }

    // FALLBACK AGRESSIVO: força quebra por contexto para textos de vendas
    const forceSemanticBreak = (content: string): string[] => {
      // Padrões específicos para texto de celulite
      const breakPatterns = [
        /([?!.])\s*(?=E se eu te dissesse)/i,
        /([?!.])\s*(?=Segundo)/i, 
        /([?!.])\s*(?=Apresento)/i,
        /([?!.])\s*(?=Com o)/i,
        /([?!.])\s*(?=Clique)/i,
        /([?!.])\s*(?=Hoje)/i,
        /([?!.])\s*(?=\d+%)/,
        /(conhece[^.!?]*[.!?])\s*/i,
        /(isso mesmo[^.!?]*[.!?])\s*/i,
        /(pesquisa[^.!?]*[.!?])\s*/i
      ];

      let result = content;
      breakPatterns.forEach(pattern => {
        result = result.replace(pattern, "$1\n\n");
      });

      return result.split(/\n+/).map(p => p.trim()).filter(Boolean);
    };

    const semanticParts = forceSemanticBreak(processedText);
    if (semanticParts.length > 1) return semanticParts;

    // Última tentativa: quebra por sentenças e agrupa máximo 2 por bloco
    const sentences = processedText.match(/[^.!?]+[.!?]?/g)?.filter(Boolean) || [processedText];
    
    if (sentences.length > 3) {
      const chunks: string[] = [];
      for (let i = 0; i < sentences.length; i += 2) {
        const chunk = sentences.slice(i, i + 2).join(" ").trim();
        chunks.push(chunk);
      }
      return chunks;
    }

    return [processedText];
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
              <Card className={`border-2 ${contentType.borderColor} ${contentType.bgColor} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Time badge */}
                    <Badge variant="secondary" className="text-xs whitespace-nowrap">
                      ~{blockTime}s
                    </Badge>
                    
                    {/* Content type badge with icon */}
                    <Badge 
                      variant="outline" 
                      className={`text-xs whitespace-nowrap ${contentType.color} border-current flex items-center gap-1.5`}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                      {contentType.type}
                    </Badge>
                    
                    <div className="flex-1">
                      <div className="text-sm leading-relaxed text-foreground/85 font-medium">
                        {highlightImpactPhrases(paragraph)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ImprovedReelsFormatter;