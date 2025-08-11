import React, { useMemo, useState } from 'react';
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
  const [mode, setMode] = useState<'off' | 'gpsc'>('off');

  // Limpeza simples para leitura: remove metadados entre colchetes e divisores
  const cleanForReading = (input: string): string => {
    let out = sanitizeText(input || "");
    out = out.replace(/^\s*\[[^\]]+\]\s*:?\s*/gm, ""); // [CTA], [GANCHO], etc
    out = out.replace(/^[-=_]{3,}\s*$/gm, ""); // --- ou ===
    out = out.replace(/\n{3,}/g, "\n\n");
    return out.trim();
  };

  // Limpeza específica para OFF direto
  const cleanForOFF = (input: string): string => {
    let out = sanitizeText(input || '');
    // remove [metadados]
    out = out.replace(/\[[^\]]+\]\s*:?/g, '');
    // remove rótulos comuns de seção no início de linha
    out = out.replace(/^\s*(gancho|problema|solu[cç][aã]o|cta|headline|agita[cç][aã]o|prova\s+social|evid[êe]ncia\s+cient[íi]fica|refer[êe]ncia)\s*:\s*/gim, '');
    // remove marcadores de cena
    out = out.replace(/^\s*(cena|scene)\s*\d+\s*:\s*/gim, '');
    // remove separadores
    out = out.replace(/^[-=_]{3,}\s*$/gm, '');
    // normaliza quebras: transforma múltiplas quebras em espaço
    out = out.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
    // pontuação final
    if (out && !/[.!?]$/.test(out)) out += '.';
    return out;
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
  
  // OFF direto
  const buildOFF = (gpsc: Record<SectionKey, string>): string => {
    const order: SectionKey[] = ['Gancho','Problema','Solução','CTA'];
    const parts = order.map(k => cleanForOFF(gpsc[k])).filter(Boolean);
    let out = parts.join(' ');
    out = out.replace(/\s{2,}/g, ' ').trim();
    return out;
  };

  const offOutput = useMemo(() => buildOFF(gpscData), [gpscData]);

  // Tempos estimados
  const totalTime = Object.values(gpscData).reduce((sum, content) => sum + calculateTime(content), 0);
  const offTime = calculateTime(offOutput);

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
            {mode === 'off' ? '📱 Reels — OFF' : '📱 Reels — GPSC'}
          </h2>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 border border-border rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode('off')}
              className={`px-3 py-1 text-sm rounded-md ${mode === 'off' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              aria-pressed={mode === 'off'}
            >
              OFF direto
            </button>
            <button
              type="button"
              onClick={() => setMode('gpsc')}
              className={`px-3 py-1 text-sm rounded-md ${mode === 'gpsc' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              aria-pressed={mode === 'gpsc'}
            >
              GPSC
            </button>
          </div>
          <Badge 
            variant={(mode === 'off' ? offTime : totalTime) <= 45 ? 'default' : 'destructive'}
            className="text-sm px-3 py-1"
          >
            Tempo Total: {mode === 'off' ? offTime : totalTime}s
          </Badge>
          <CopyButton 
            text={mode === 'off' ? offOutput : finalOutput}
            className="aurora-button-enhanced"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {mode === 'off' ? (
          <div className="text-foreground leading-relaxed aurora-body whitespace-pre-wrap">
            {offOutput}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

    </div>
  );
};

export default ImprovedReelsFormatter;