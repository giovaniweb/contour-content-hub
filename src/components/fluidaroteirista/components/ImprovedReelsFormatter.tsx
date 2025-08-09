import React from 'react';
import { motion } from 'framer-motion';
import { parseTemporalScript, TemporalScriptBlockData } from '../utils/parseTemporalScript';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Video, Sparkles, Target, Zap, Flame, Lightbulb, BarChart3, HelpCircle, Users, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { sanitizeText } from '@/utils/textSanitizer';

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
  // Agora usa sempre parseTemporalScript que já inclui segmentação inteligente
  const getStructuredBlocks = (): TemporalScriptBlockData[] => {
    // Force sempre usar parseTemporalScript, que agora inclui segmentação inteligente
    return parseTemporalScript(roteiro);
  };

  // Agora sempre usa blocos estruturados
  const structuredBlocks = getStructuredBlocks();
  
  // Sempre usa formato estruturado se conseguiu criar blocos
  const useStructuredFormat = structuredBlocks.length > 1 || 
    (structuredBlocks.length === 1 && structuredBlocks[0].time !== "");

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

  const estimateBlockTime = (text: string): number => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 2.5)); // ~150 wpm
  };

  if (useStructuredFormat) {
    const totalTime = structuredBlocks.reduce((sum, block) => {
      const timeMatch = block.time.match(/(\d+)-?(\d+)?/);
      return sum + (timeMatch ? parseInt(timeMatch[2] || timeMatch[1]) : 3);
    }, 0);

    // Agrupa em GPSC
    const gpscOrder = ['🎯 Gancho','😤 Problema','💡 Solução','🚀 CTA'];
    const gpscMap: Record<string, string[]> = {
      '🎯 Gancho': [],
      '😤 Problema': [],
      '💡 Solução': [],
      '🚀 CTA': [],
    };
    structuredBlocks.forEach((block) => {
      const ct = detectContentType(block.content).type;
      const key = gpscOrder.find(k => k.includes(ct.split(' ')[1])) || '💡 Solução';
      gpscMap[key].push(block.content);
    });

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Video className="h-6 w-6 text-aurora-electric-purple" />
            <h2 className="text-xl font-semibold tracking-tight text-aurora-electric-purple">
              📱 Reels — Estrutura GPSC
            </h2>
            <Sparkles className="h-5 w-5 text-aurora-neon-blue" />
          </div>
          <Badge variant="outline" className={`text-xs ${totalTime <= 45 ? 'bg-aurora-emerald/10 text-aurora-emerald border-aurora-emerald/30' : 'bg-aurora-pink/10 text-aurora-pink border-aurora-pink/30'}`}>
            <Clock className="h-3 w-3 mr-1" />
            {totalTime}s • {totalTime <= 45 ? '✅ Ideal' : '⚠️ Muito longo'}
          </Badge>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gpscOrder.map((key, index) => {
            const title = key.replace(/^.+\s/, ''); // remove emoji
            const content = gpscMap[key].join('\n');
            const colorClass =
              title === 'Gancho' ? 'border-aurora-electric-purple/30 bg-aurora-electric-purple/5' :
              title === 'Problema' ? 'border-aurora-soft-pink/30 bg-aurora-soft-pink/5' :
              title === 'Solução' ? 'border-aurora-emerald/30 bg-aurora-emerald/5' :
              'border-aurora-neon-blue/30 bg-aurora-neon-blue/5';
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className={`aurora-glass border-2 ${colorClass}`}>
                  <CardContent className="p-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs font-semibold">⏱️ {Math.max(2, Math.round((gpscMap[key].join(' ').split(/\s+/).length)/3))}s</Badge>
                        <Badge variant="outline" className="text-xs">{title}</Badge>
                      </div>
                      <div className="text-sm leading-relaxed text-slate-200 font-medium whitespace-pre-line">
                        {sanitizeText(content)}
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
            transition={{ delay: structuredBlocks.length * 0.15 + 0.2 }}
            className="mt-6"
          >
              <Card className={`aurora-glass border-2 ${totalTime <= 45 ? 'border-aurora-emerald/30' : 'border-aurora-pink/30'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-center gap-3">
                    <Clock className={`h-5 w-5 ${totalTime <= 45 ? 'text-aurora-emerald' : 'text-aurora-pink'}`} />
                    <div className="text-center">
                      <div className={`text-lg font-bold ${totalTime <= 45 ? 'text-aurora-emerald' : 'text-aurora-pink'}`}>
                        ⏱️ Tempo Total: {totalTime}s
                      </div>
                      <div className="text-xs text-slate-300">
                        {totalTime <= 45 
                          ? '✅ Perfeito! Dentro do limite ideal para Reels' 
                          : '⚠️ Considere reduzir para máximo 45 segundos'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Fallback caso não conseguir estruturar (muito raro agora)
  const fallbackParagraphs = [roteiro];

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
        {fallbackParagraphs.map((paragraph, index) => {
          const contentType = detectContentType(paragraph);
          const IconComponent = contentType.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className={`border-2 ${contentType.borderColor} ${contentType.bgColor} shadow-sm hover:shadow-md transition-all duration-200`}>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    {/* Header com badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs font-semibold">
                        ⏱️ 30-45s
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
      </div>
    </motion.div>
  );
};

export default ImprovedReelsFormatter;