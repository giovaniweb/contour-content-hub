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

  // Limpeza forte para leitura: remove metadados, cabeçalhos técnicos e tempos
  const cleanForReading = (input: string): string => {
    let out = sanitizeText(input || "");
    // Remove tempos e marcações: [0-4s], (0–4s), 0-4s:, 13–20s:
    out = out.replace(/\[(?:\d+\s*[–\-]\s*\d+\s*)s?\]\s*:?/gim, "");
    out = out.replace(/\((?:\d+\s*[–\-]\s*\d+\s*)s?\)\s*:?/gim, "");
    out = out.replace(/^\s*\d+\s*[–\-]\s*\d+\s*s?\s*:\s*/gim, "");
    // Remove metadados entre colchetes (rótulos variados)
    out = out.replace(/\[[^\]]+\]\s*:?/g, "");
    // Remove rótulos comuns de seção em qualquer posição de linha
    out = out.replace(/(?:^|\n)\s*(gancho|hook|headline|abertura|chamada|teaser|problema|dor|agita[cç][aã]o|obst[áa]culo|erro|mito|solu[cç][aã]o|como|passo|dica|m[eé]todo|prova|exemplo|framework|cta|call\s*to\s*action|a[cç][aã]o|convite|dire[cç][aã]o|oferta|assine|comente|compartilhe|salve|segue|inscreva|clique|acesse|garanta|link)\s*:\s*/gim, "\n");
    // Remove emojis como cabeçalho de linha
    out = out.replace(/^(?:\s*[🎯⚠️💡🚀]+)\s*/gm, "");
    // Remove separadores e pipes
    out = out.replace(/^[-=_]{3,}\s*$/gm, "");
    out = out.replace(/\|/g, "");
    // Remove linhas que são CAIXA ALTA (provável cabeçalho técnico)
    out = out
      .split(/\n/)
      .filter((line) => {
        const t = line.trim();
        if (!t) return true;
        const letters = t.replace(/[^A-Za-zÀ-ÿ]/g, "");
        const isUpper = letters.length > 0 && letters === letters.toUpperCase();
        return !(isUpper && t.length > 12);
      })
      .join("\n");
    // Colapsa quebras e espaços
    out = out.replace(/\n{3,}/g, "\n\n");
    out = out.replace(/[ \t]+/g, " ");
    out = out.replace(/\s*\n\s*/g, "\n");
    return out.trim();
  };

  // Limpeza específica para OFF direto (ainda mais agressiva)
  const cleanForOFF = (input: string): string => {
    let out = sanitizeText(input || '');
    // tempos e marcações
    out = out.replace(/\[(?:\d+\s*[–\-]\s*\d+\s*)s?\]\s*:?/gim, "");
    out = out.replace(/\((?:\d+\s*[–\-]\s*\d+\s*)s?\)\s*:?/gim, "");
    out = out.replace(/^\s*\d+\s*[–\-]\s*\d+\s*s?\s*:\s*/gim, "");
    // rótulos e metadados
    out = out.replace(/\[[^\]]+\]\s*:?/g, '');
    out = out.replace(/(?:^|\n)\s*(gancho|problema|solu[cç][aã]o|cta|headline|agita[cç][aã]o|prova\s+social|evid[êe]ncia\s+cient[íi]fica|refer[êe]ncia|hook|teaser|call\s*to\s*action)\s*:\s*/gim, ' ');
    // marcadores de cena
    out = out.replace(/^\s*(cena|scene)\s*\d+\s*:\s*/gim, '');
    // separadores e emojis de rótulo
    out = out.replace(/^[-=_]{3,}\s*$/gm, '');
    out = out.replace(/^(?:\s*[🎯⚠️💡🚀]+)\s*/gm, '');
    // normalização de espaços
    out = out.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
    // pontuação final
    if (out && !/[.!?]$/.test(out)) out += '.';
    return out;
  };

  // Segmentação por marcadores explícitos (emojis, rótulos com/sem colchetes)
  const segmentByExplicitMarkers = (text: string): { gpsc: Record<SectionKey, string>; found: boolean } => {
    const gpsc: Record<SectionKey, string> = { Gancho: '', Problema: '', Solução: '', CTA: '' };
    let current: SectionKey | null = null;
    let found = false;

    const getKeyFromLabel = (raw: string): SectionKey | undefined => {
      const l = raw.toLowerCase().replace(/[\[\]]/g, '').trim();
      if (/(gancho|hook|headline|abertura|chamada|teaser)/i.test(l)) return 'Gancho';
      if (/(problema|dor|agita[cç][aã]o|obst[áa]culo|erro|mito)/i.test(l)) return 'Problema';
      if (/(solu[cç][aã]o|como|passo|dica|m[eé]todo|prova|exemplo|framework|benef[ií]cio)/i.test(l)) return 'Solução';
      if (/(cta|call\s*to\s*action|a[cç][aã]o|convite|dire[cç][aã]o|oferta|assine|comente|compartilhe|salve|segue|inscreva|clique|acesse|garanta|link)/i.test(l)) return 'CTA';
      return undefined;
    };

    const lines = text.split(/\n/);
    for (let rawLine of lines) {
      let line = rawLine;
      // Emojis como marcadores de seção
      if (/^\s*🎯/.test(line)) { current = 'Gancho'; found = true; line = line.replace(/^\s*🎯\s*/,''); }
      else if (/^\s*⚠️/.test(line)) { current = 'Problema'; found = true; line = line.replace(/^\s*⚠️\s*/,''); }
      else if (/^\s*💡/.test(line)) { current = 'Solução'; found = true; line = line.replace(/^\s*💡\s*/,''); }
      else if (/^\s*🚀/.test(line)) { current = 'CTA'; found = true; line = line.replace(/^\s*🚀\s*/,''); }
      else {
        // [LABEL] ou LABEL:
        const m = line.match(/^\s*(?:\[([^\]]+)\]|([^:]+))\s*:\s*(.*)$/);
        if (m) {
          const label = (m[1] || m[2] || '').trim();
          const key = getKeyFromLabel(label);
          if (key) { current = key; found = true; line = m[3] || ''; }
        }
      }
      if (current && line.trim()) {
        gpsc[current] += (gpsc[current] ? '\n\n' : '') + line.trim();
      }
    }
    return { gpsc, found };
  };

  // Rebalanceamento leve: move frases de ação para CTA e remove duplicadas
  const rebalanceGPSC = (gpsc: Record<SectionKey, string>): Record<SectionKey, string> => {
    const CTA_VERBS = /(agende|marque|fale|whatsapp|toque|clique|acesse|venha|garanta|baixe|inscreva|siga|compartilhe|comente|salve|assine|compr(e|ar)|confira|teste)/i;
    const splitSentences = (txt: string) => txt.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);

    // Mover frases de ação do final da Solução para CTA, se CTA estiver curto
    const ctaWords = gpsc['CTA'].split(/\s+/).filter(Boolean).length;
    if (ctaWords < 8 && gpsc['Solução']) {
      const solSentences = splitSentences(gpsc['Solução']);
      const movable: string[] = [];
      for (let i = solSentences.length - 1; i >= 0 && movable.length < 2; i--) {
        if (CTA_VERBS.test(solSentences[i])) {
          movable.unshift(solSentences[i]);
          solSentences.splice(i, 1);
        }
      }
      if (movable.length) {
        gpsc['Solução'] = solSentences.join(' ').trim();
        gpsc['CTA'] = (gpsc['CTA'] ? gpsc['CTA'] + ' ' : '') + movable.join(' ');
      }
    }

    // Deduplicar frases idênticas entre seções
    const seen = new Set<string>();
    (['Gancho','Problema','Solução','CTA'] as SectionKey[]).forEach((k) => {
      const sentences = splitSentences(gpsc[k]);
      const unique: string[] = [];
      for (const s of sentences) {
        const key = s.toLowerCase();
        if (!seen.has(key)) { unique.push(s); seen.add(key); }
      }
      gpsc[k] = unique.join(' ').trim();
    });

    return gpsc;
  };

  // Função para construir estrutura GPSC robusta
  const buildGPSC = (roteiro: string): Record<SectionKey, string> => {
    const blocks = parseTemporalScript(roteiro);

    const gpsc: Record<SectionKey, string> = {
      Gancho: '',
      Problema: '',
      Solução: '',
      CTA: ''
    };

    // Mapa de sinônimos/variações para normalizar seções
    const normalizeSection = (label?: string): SectionKey | undefined => {
      if (!label) return undefined;
      const l = label
        .toLowerCase()
        .replace(/[\[\]]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (/(gancho|hook|headline|abertura|chamada|teaser)/i.test(l)) return 'Gancho';
      if (/(problema|dor|agita[cç][aã]o|obst[áa]culo|erro|mito)/i.test(l)) return 'Problema';
      if (/(solu[cç][aã]o|como|passo|dica|m[eé]todo|prova|exemplo|framework|benef[ií]cio)/i.test(l)) return 'Solução';
      if (/(cta|call\s*to\s*action|a[cç][aã]o|convite|dire[cç][aã]o|oferta|assine|comente|compartilhe|salve|segue|inscreva|clique|acesse|garanta|link)/i.test(l)) return 'CTA';
      return undefined;
    };

    // Extrai segmentos rotulados dentro de um texto (ex: "Gancho: ... Problema: ...")
    const extractLabeledSegments = (text: string): Array<{ key: SectionKey; content: string }> => {
      if (!text) return [];
      const markers = '(gancho|hook|headline|abertura|chamada|teaser|problema|dor|agita[cç][aã]o|obst[áa]culo|erro|mito|solu[cç][aã]o|como|passo|dica|m[eé]todo|prova|exemplo|framework|cta|call\\s*to\\s*action|a[cç][aã]o|convite|dire[cç][aã]o|oferta|assine|comente|compartilhe|salve|segue|inscreva|clique|acesse|garanta|link)';
      // Insere delimitadores antes de cada marcador reconhecido quando vier seguido de ':'
      const withDelims = text.replace(new RegExp(`(?:\\[\\s*${markers}\\s*\\]|${markers})\\s*:`, 'gi'), (m) => `|||${m}`);
      const parts = withDelims.split('|||').filter(Boolean);

      const segments: Array<{ key: SectionKey; content: string }> = [];
      for (const part of parts) {
        const match = part.match(new RegExp(`^(?:\\[\\s*${markers}\\s*\\]|${markers})\\s*:`, 'i'));
        if (match) {
          const labelRaw = match[0].replace(/[:\[\]]/g, '').trim();
          const key = normalizeSection(labelRaw);
          const content = part.replace(match[0], '').trim();
          if (key && content) segments.push({ key, content });
        }
      }
      return segments;
    };

    // Heurística de fallback para bucket quando não há rótulos
    const chooseBucket = (content: string): SectionKey => {
      const lower = content.toLowerCase();
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
      return 'Solução';
    };

    // Distribuição: primeiro tenta segmentação explícita do texto inteiro
    const cleanedFullAll = cleanForReading(roteiro);
    const explicit = segmentByExplicitMarkers(cleanedFullAll);
    if (explicit.found) {
      Object.assign(gpsc, explicit.gpsc);
    } else if (blocks.length > 0) {
      blocks.forEach((block) => {
        const cleaned = cleanForReading(block.content);
        // Primeiro: segmentos explicitamente rotulados dentro do conteúdo
        const labeled = extractLabeledSegments(cleaned);
        if (labeled.length > 0) {
          labeled.forEach(({ key, content }) => {
            gpsc[key] += (gpsc[key] ? '\n\n' : '') + content;
          });
          return;
        }
        // Segundo: usar o label do bloco, se existir
        const fromLabel = normalizeSection(block.label);
        if (fromLabel) {
          gpsc[fromLabel] += (gpsc[fromLabel] ? '\n\n' : '') + cleaned;
          return;
        }
        // Terceiro: heurística
        const bucket = chooseBucket(cleaned);
        gpsc[bucket] += (gpsc[bucket] ? '\n\n' : '') + cleaned;
      });
    } else {
      // Fallback: divide o roteiro limpo em 4 partes por parágrafos
      const paragraphs = cleanedFullAll.split(/\n\s*\n/).filter((p) => p.trim());
      const quarters = Math.max(1, Math.ceil(paragraphs.length / 4));
      gpsc['Gancho'] = paragraphs.slice(0, quarters).join('\n\n');
      gpsc['Problema'] = paragraphs.slice(quarters, quarters * 2).join('\n\n');
      gpsc['Solução'] = paragraphs.slice(quarters * 2, quarters * 3).join('\n\n');
      gpsc['CTA'] = paragraphs.slice(quarters * 3).join('\n\n');
    }

    // Seções vazias/curtas: fallback por tamanho, respeitando limites de palavra
    const needsRebuild = (k: SectionKey) => !gpsc[k] || gpsc[k].trim().length < 20;
    if (needsRebuild('Gancho') || needsRebuild('Problema') || needsRebuild('Solução') || needsRebuild('CTA')) {
      const cleanedFull = cleanForReading(roteiro).replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();

      // Split seguro em 4 partes procurando espaços próximos aos quartos
      const safeSplitIntoFour = (text: string): Record<SectionKey, string> => {
        const len = text.length;
        if (len < 40) {
          return { Gancho: text, Problema: '', Solução: '', CTA: '' };
        }
        const target = Math.floor(len / 4);
        const findBreak = (idx: number) => {
          const window = 80;
          for (let i = idx; i < Math.min(len, idx + window); i++) if (/\s/.test(text[i])) return i;
          for (let i = idx; i > Math.max(0, idx - window); i--) if (/\s/.test(text[i])) return i;
          return idx;
        };
        const i1 = findBreak(target);
        const i2 = findBreak(target * 2);
        const i3 = findBreak(target * 3);
        return {
          Gancho: text.slice(0, i1).trim(),
          Problema: text.slice(i1, i2).trim(),
          Solução: text.slice(i2, i3).trim(),
          CTA: text.slice(i3).trim(),
        };
      };

      const rebuilt = safeSplitIntoFour(cleanedFull);
      (['Gancho', 'Problema', 'Solução', 'CTA'] as SectionKey[]).forEach((k) => {
        if (needsRebuild(k)) gpsc[k] = rebuilt[k];
      });
    }

    return rebalanceGPSC(gpsc);
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