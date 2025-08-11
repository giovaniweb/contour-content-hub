import React from 'react';
import { motion } from 'framer-motion';
import { parseTemporalScript, TemporalScriptBlockData } from '../utils/parseTemporalScript';
import { Badge } from "@/components/ui/badge";
import CopyButton from "@/components/ui/CopyButton";
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

  const sectionConfigs = [
    { key: 'Gancho' as SectionKey, icon: '🎯', borderColor: 'border-l-aurora-electric-purple' },
    { key: 'Problema' as SectionKey, icon: '⚠️', borderColor: 'border-l-aurora-soft-pink' },
    { key: 'Solução' as SectionKey, icon: '💡', borderColor: 'border-l-aurora-emerald' },
    { key: 'CTA' as SectionKey, icon: '🚀', borderColor: 'border-l-aurora-neon-blue' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3">
          <Video className="h-6 w-6 text-aurora-electric-purple" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue bg-clip-text text-transparent aurora-heading">
            📱 Reels — Estrutura GPSC
          </h2>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Badge 
            variant={totalTime <= 45 ? "default" : "destructive"}
            className="text-sm px-4 py-2"
          >
            Tempo Total: {totalTime}s
          </Badge>
          {totalTime <= 45 && (
            <Badge variant="outline" className="text-aurora-emerald border-aurora-emerald">
              ✅ Ideal para Reels
            </Badge>
          )}
          {totalTime > 45 && (
            <Badge variant="outline" className="text-aurora-soft-pink border-aurora-soft-pink">
              ⚠️ Acima de 45s
            </Badge>
          )}
          <CopyButton 
            text={roteiro}
            className="aurora-button-enhanced"
          />
        </div>
      </motion.div>

      {/* GPSC Sections - Text Layout */}
      <div className="space-y-8">
        {sectionConfigs.map(({ key, icon, borderColor }, index) => {
          const content = gpscData[key];
          const sectionTime = calculateTime(content);
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-4"
            >
              {/* Section Title */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <h3 className="text-xl font-bold text-aurora-electric-purple aurora-heading">
                  {key}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {sectionTime}s
                </Badge>
              </div>
              
              {/* Section Content */}
              <div className={`pl-6 border-l-4 ${borderColor} bg-slate-900/30 rounded-r-lg p-4`}>
                <div className="text-slate-100 leading-relaxed aurora-body whitespace-pre-line">
                  {sanitizeText(content)}
                </div>
              </div>
              
              {/* Separator */}
              {index < sectionConfigs.length - 1 && (
                <hr className="my-8 border-border border-dashed" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <motion.div 
        className="text-center space-y-2 pt-6 border-t border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p className="text-xs text-slate-400">
          {totalTime <= 45 
            ? "✅ Perfeito! Seu reel está no tempo ideal (≤ 45s)" 
            : "⚠️ Consider reduzir o conteúdo para ficar dentro dos 45s ideais"}
        </p>
      </motion.div>
    </div>
  );
};

export default ImprovedReelsFormatter;