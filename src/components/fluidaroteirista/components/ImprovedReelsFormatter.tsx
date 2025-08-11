import React from 'react';
import { parseTemporalScript } from '../utils/parseTemporalScript';
import { Badge } from "@/components/ui/badge";
import CopyButton from "@/components/ui/CopyButton";
import { Video } from 'lucide-react';
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
  // Limpeza simples para leitura: remove metadados entre colchetes e divisores
  const cleanForReading = (input: string): string => {
    let out = sanitizeText(input || "");
    out = out.replace(/^\s*\[[^\]]+\]\s*:?\s*/gm, ""); // [CTA], [GANCHO], etc
    out = out.replace(/^[-=_]{3,}\s*$/gm, ""); // --- ou ===
    out = out.replace(/\n{3,}/g, "\n\n");
    return out.trim();
  };

  // Função para construir estrutura GPSC robusta
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
        const cleaned = cleanForReading(block.content);
        gpsc[bucket] += (gpsc[bucket] ? "\n\n" : "") + cleaned;
      });
    } else {
      // Fallback: divide o roteiro limpo em 4 partes
      const cleanedFull = cleanForReading(roteiro);
      const paragraphs = cleanedFull.split(/\n\s*\n/).filter(p => p.trim());
      const quarters = Math.max(1, Math.ceil(paragraphs.length / 4));
      gpsc['Gancho'] = paragraphs.slice(0, quarters).join('\n\n');
      gpsc['Problema'] = paragraphs.slice(quarters, quarters * 2).join('\n\n');
      gpsc['Solução'] = paragraphs.slice(quarters * 2, quarters * 3).join('\n\n');
      gpsc['CTA'] = paragraphs.slice(quarters * 3).join('\n\n');
    }

    // Reforço: se alguma seção ficar vazia ou muito curta, reconstruir igualmente
    const needsRebuild = (k: SectionKey) => !gpsc[k] || gpsc[k].trim().length < 20;
    if (needsRebuild('Gancho') || needsRebuild('Problema') || needsRebuild('Solução') || needsRebuild('CTA')) {
      const cleanedFull = cleanForReading(roteiro);
      const parts = cleanedFull.split(/\n\s*\n/).filter(p => p.trim());
      if (parts.length >= 4) {
        const quarters = Math.ceil(parts.length / 4);
        gpsc['Gancho'] = parts.slice(0, quarters).join('\n\n');
        gpsc['Problema'] = parts.slice(quarters, quarters * 2).join('\n\n');
        gpsc['Solução'] = parts.slice(quarters * 2, quarters * 3).join('\n\n');
        gpsc['CTA'] = parts.slice(quarters * 3).join('\n\n');
      } else {
        const len = cleanedFull.length;
        const q = Math.max(1, Math.floor(len / 4));
        gpsc['Gancho'] = cleanedFull.slice(0, q).trim();
        gpsc['Problema'] = cleanedFull.slice(q, 2 * q).trim();
        gpsc['Solução'] = cleanedFull.slice(2 * q, 3 * q).trim();
        gpsc['CTA'] = cleanedFull.slice(3 * q).trim();
      }
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
  { key: 'Gancho' as SectionKey, icon: '🎯' },
  { key: 'Problema' as SectionKey, icon: '⚠️' },
  { key: 'Solução' as SectionKey, icon: '💡' },
  { key: 'CTA' as SectionKey, icon: '🚀' }
];

const finalOutput = sectionConfigs
  .map(({ key, icon }) => `${icon} ${key}\n${gpscData[key]}`.trim())
  .join('\n\n------------------------------\n\n');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Video className="h-6 w-6 text-aurora-electric-purple" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue bg-clip-text text-transparent aurora-heading">
            📱 Reels — GPSC
          </h2>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Badge 
            variant={totalTime <= 45 ? "default" : "destructive"}
            className="text-sm px-3 py-1"
          >
            Tempo Total: {totalTime}s
          </Badge>
          <CopyButton 
            text={finalOutput}
            className="aurora-button-enhanced"
          />
        </div>
      </div>

      {/* GPSC Sections - Texto corrido */}
      <div className="space-y-6">
        {sectionConfigs.map(({ key, icon }, index) => {
          const content = gpscData[key];
          return (
            <div key={key} className="space-y-2">
              <h3 className="text-base font-semibold text-aurora-electric-purple aurora-heading">
                {icon} {key}
              </h3>
              <div className="text-foreground leading-relaxed aurora-body whitespace-pre-line">
                {content}
              </div>
              {index < sectionConfigs.length - 1 && (
                <hr className="my-6 border-border" />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ImprovedReelsFormatter;