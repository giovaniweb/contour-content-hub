import React from 'react';
import { motion } from 'framer-motion';
import { parseTemporalScript, TemporalScriptBlockData } from '../utils/parseTemporalScript';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Video, Sparkles, Target, AlertTriangle, Lightbulb, Eye } from 'lucide-react';
import { sanitizeText } from '@/utils/textSanitizer';

interface ImprovedReelsFormatterProps {
  roteiro: string;
  estimatedTime?: number;
}

type SectionKey = 'Gancho' | 'Problema' | 'Solução' | 'CTA';

const ImprovedReelsFormatter: React.FC<ImprovedReelsFormatterProps> = ({ 
  roteiro, 
  estimatedTime 
}) => {
  // Função para construir estrutura GPSC similar ao LongVideoFormatter
  const buildGPSC = (roteiro: string): Record<SectionKey, string> => {
    const blocks = parseTemporalScript(roteiro);
    
    const gpsc: Record<SectionKey, string> = {
      'Gancho': '',
      'Problema': '',
      'Solução': '',
      'CTA': ''
    };

    // Função helper para escolher o bucket certo baseado no conteúdo
    const chooseBucket = (content: string): SectionKey => {
      const lower = content.toLowerCase();
      
      // Gancho - perguntas, hooks, atenção
      if (
        lower.includes('você sabia') || 
        lower.includes('imagine') ||
        lower.includes('e se eu te dissesse') ||
        lower.includes('pare tudo') ||
        lower.includes('atenção') ||
        /^(você|vocês|tu)\s/.test(lower) ||
        (content.includes('?') && content.indexOf('?') < 150)
      ) {
        return 'Gancho';
      }

      // Problema/Dor
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
        return 'Problema';
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
        return 'CTA';
      }

      // Solução é o padrão
      return 'Solução';
    };

    // Distribui os blocos nos buckets GPSC
    if (blocks.length > 0) {
      blocks.forEach((block) => {
        const bucket = chooseBucket(block.content);
        if (gpsc[bucket]) {
          gpsc[bucket] += '\n\n' + block.content;
        } else {
          gpsc[bucket] = block.content;
        }
      });
    } else {
      // Fallback: divide o roteiro em 4 partes
      const paragraphs = roteiro.split(/\n\s*\n/).filter(p => p.trim());
      const quarters = Math.ceil(paragraphs.length / 4);
      
      gpsc['Gancho'] = paragraphs.slice(0, quarters).join('\n\n');
      gpsc['Problema'] = paragraphs.slice(quarters, quarters * 2).join('\n\n');
      gpsc['Solução'] = paragraphs.slice(quarters * 2, quarters * 3).join('\n\n');
      gpsc['CTA'] = paragraphs.slice(quarters * 3).join('\n\n');
    }

    return gpsc;
  };

  // Calcula tempo estimado baseado no número de palavras
  const calculateTime = (text: string): number => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.round(words / 3)); // ~180 wpm para reels
  };

  const gpscData = buildGPSC(roteiro);
  
  // Calcula tempo total
  const totalTime = Object.values(gpscData).reduce((sum, content) => {
    return sum + calculateTime(content);
  }, 0);

  // Componente para cada seção GPSC
  const SectionCard: React.FC<{ title: SectionKey; content: string; color: string }> = ({ 
    title, 
    content, 
    color 
  }) => {
    const time = calculateTime(content);
    const IconComponent = 
      title === 'Gancho' ? Eye :
      title === 'Problema' ? AlertTriangle :
      title === 'Solução' ? Lightbulb :
      Target;

    return (
      <Card className={`aurora-glass border-2 ${color}`}>
        <CardContent className="p-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconComponent className="h-4 w-4" />
              <Badge variant="outline" className="text-xs font-semibold">{title}</Badge>
              <Badge variant="secondary" className="text-xs">⏱️ {time}s</Badge>
            </div>
            <div className="text-sm leading-relaxed text-slate-200 font-medium whitespace-pre-line">
              {sanitizeText(content)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <header className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Video className="h-6 w-6 text-aurora-electric-purple" />
          <h2 className="text-xl font-semibold tracking-tight text-aurora-electric-purple">
            📱 Reels — Estrutura GPSC
          </h2>
          <Sparkles className="h-5 w-5 text-aurora-neon-blue" />
        </div>
        <Badge 
          variant="outline" 
          className={`text-xs ${
            totalTime <= 45 
              ? 'bg-aurora-emerald/10 text-aurora-emerald border-aurora-emerald/30' 
              : 'bg-aurora-pink/10 text-aurora-pink border-aurora-pink/30'
          }`}
        >
          <Clock className="h-3 w-3 mr-1" />
          {totalTime}s • {totalTime <= 45 ? '✅ Ideal' : '⚠️ Muito longo'}
        </Badge>
      </header>

      {/* Grid GPSC 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0 }}
        >
          <SectionCard 
            title="Gancho" 
            content={gpscData.Gancho} 
            color="border-aurora-electric-purple/30 bg-aurora-electric-purple/5"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <SectionCard 
            title="Problema" 
            content={gpscData.Problema} 
            color="border-aurora-soft-pink/30 bg-aurora-soft-pink/5"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionCard 
            title="Solução" 
            content={gpscData.Solução} 
            color="border-aurora-emerald/30 bg-aurora-emerald/5"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
        >
          <SectionCard 
            title="CTA" 
            content={gpscData.CTA} 
            color="border-aurora-neon-blue/30 bg-aurora-neon-blue/5"
          />
        </motion.div>
      </div>

      {/* Footer com tempo total */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
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
    </motion.div>
  );
};

export default ImprovedReelsFormatter;