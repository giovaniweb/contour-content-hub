import { sanitizeText } from '@/utils/textSanitizer';
import { parseTemporalScript } from '../utils/parseTemporalScript';

export type SectionKey = 'Gancho' | 'Problema' | 'Solução' | 'CTA';

// Strong cleanup for reading/display (removes technical headers, timings, labels)
export const cleanForReading = (input: string): string => {
  let out = sanitizeText(input || "");
  // Remove time markers like [0-4s], (0–4s), 0-4s:
  out = out.replace(/\[(?:\d+\s*[–\-]\s*\d+\s*)s?\]\s*:?/gim, "");
  out = out.replace(/\((?:\d+\s*[–\-]\s*\d+\s*)s?\)\s*:?/gim, "");
  out = out.replace(/^\s*\d+\s*[–\-]\s*\d+\s*s?\s*:\s*/gim, "");
  // Remove metadata in brackets (various labels)
  out = out.replace(/\[[^\]]+\]\s*:?/g, "");
  // Remove common section labels anywhere in the line
  out = out.replace(/(?:^|\n)\s*(gancho|hook|headline|abertura|chamada|teaser|problema|dor|agita[cç][aã]o|obst[áa]culo|erro|mito|solu[cç][aã]o|como|passo|dica|m[eé]todo|prova|exemplo|framework|cta|call\s*to\s*action|a[cç][aã]o|convite|dire[cç][aã]o|oferta|assine|comente|compartilhe|salve|segue|inscreva|clique|acesse|garanta|link)\s*:\s*/gim, "\n");
  // Remove emojis as line headers
  out = out.replace(/^(?:\s*[🎯⚠️💡🚀]+)\s*/gm, "");
  // Remove separators and pipes
  out = out.replace(/^[-=_]{3,}\s*$/gm, "");
  out = out.replace(/\|/g, "");
  // Remove UPPERCASE lines likely to be technical headers
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
  // Collapse whitespace
  out = out.replace(/\n{3,}/g, "\n\n");
  out = out.replace(/[ \t]+/g, " ");
  out = out.replace(/\s*\n\s*/g, "\n");
  return out.trim();
};

// Extra cleanup for OFF narration (even more aggressive)
export const cleanForOFF = (input: string): string => {
  let out = sanitizeText(input || '');
  
  // Remove referências técnicas e científicas para o paciente final
  out = out.replace(/\b(?:segundo\s+(?:estudos?|pesquisas?)|de\s+acordo\s+com|conforme\s+(?:estudos?|literatura)|baseado\s+em\s+(?:estudos?|pesquisas?)|evidência\s+científica|comprovado\s+cientificamente|literatura\s+médica|journal|pubmed|referência\s+\d+|et\s+al\.?|estudo\s+clínico|pesquisa\s+(?:científica|médica)|dados\s+científicos)\b[^.]*\.?/gi, '');
  
  out = out.replace(/\[(?:\d+\s*[–\-]\s*\d+\s*)s?\]\s*:?/gim, "");
  out = out.replace(/\((?:\d+\s*[–\-]\s*\d+\s*)s?\)\s*:?/gim, "");
  out = out.replace(/^\s*\d+\s*[–\-]\s*\d+\s*s?\s*:\s*/gim, "");
  out = out.replace(/\[[^\]]+\]\s*:?/g, '');
  out = out.replace(/(?:^|\n)\s*(gancho|problema|solu[cç][aã]o|cta|headline|agita[cç][aã]o|prova\s+social|evid[êe]ncia\s+cient[íi]fica|refer[êe]ncia|hook|teaser|call\s*to\s*action)\s*:\s*/gim, ' ');
  out = out.replace(/^\s*(cena|scene)\s*\d+\s*:\s*/gim, '');
  out = out.replace(/^[-=_]{3,}\s*$/gm, '');
  out = out.replace(/^(?:\s*[🎯⚠️💡🚀]+)\s*/gm, '');
  out = out.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
  
  // Validação final - se ficou muito curto ou vazio, return original sanitizado
  if (!out || out.length < 10) {
    out = sanitizeText(input || '').replace(/\s+/g, ' ').trim();
  }
  
  if (out && !/[.!?]$/.test(out)) out += '.';
  return out;
};

// Segment text by explicit markers (emojis, labels with/without brackets)
export const segmentByExplicitMarkers = (text: string): { gpsc: Record<SectionKey, string>; found: boolean } => {
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
    if (/^\s*🎯/.test(line)) { current = 'Gancho'; found = true; line = line.replace(/^\s*🎯\s*/,''); }
    else if (/^\s*⚠️/.test(line)) { current = 'Problema'; found = true; line = line.replace(/^\s*⚠️\s*/,''); }
    else if (/^\s*💡/.test(line)) { current = 'Solução'; found = true; line = line.replace(/^\s*💡\s*/,''); }
    else if (/^\s*🚀/.test(line)) { current = 'CTA'; found = true; line = line.replace(/^\s*🚀\s*/,''); }
    else {
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

// Rebalance: move action sentences to CTA when needed and deduplicate across sections
export const rebalanceGPSC = (gpsc: Record<SectionKey, string>): Record<SectionKey, string> => {
  const CTA_VERBS = /(agende|marque|fale|whatsapp|toque|clique|acesse|venha|garanta|baixe|inscreva|siga|compartilhe|comente|salve|assine|compr(e|ar)|confira|teste)/i;
  const splitSentences = (txt: string) => txt.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);

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

// Word limits per GPSC section for balanced Reels (18-22 seconds)
const SECTION_WORD_LIMITS: Record<SectionKey, number> = {
  'Gancho': 18,    // 6 seconds - provocação concisa
  'Problema': 25,  // 8 seconds - contexto emocional 
  'Solução': 35,   // 12 seconds - benefício específico
  'CTA': 18        // 6 seconds - ação clara
  // Total: ~96 words (32 seconds)
};

// Limit section to specific word count with balanced approach (MENOS AGRESSIVO)
const limitSectionWords = (text: string, maxWords: number): string => {
  if (!text) return text;
  
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  
  // Allow +8 words flexibility for completeness (mais flexível)
  const flexibleLimit = maxWords + 8;
  if (words.length <= flexibleLimit) return text;
  
  // Try to cut at sentence boundary first
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  let result = '';
  let wordCount = 0;
  
  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/).length;
    if (wordCount + sentenceWords <= flexibleLimit) {
      result += sentence;
      wordCount += sentenceWords;
    } else if (wordCount === 0) {
      // If first sentence is too long, prioritize keeping complete thought
      const truncated = sentence.trim().split(/\s+/).slice(0, Math.max(maxWords, 15)).join(' ');
      result = truncated + (truncated.match(/[.!?]$/) ? '' : '.');
      break;
    } else {
      break;
    }
  }
  
  // Ensure we have at least something meaningful (minimum 12 words for completeness)
  if (result.trim().split(/\s+/).length < 12 && words.length >= 12) {
    result = words.slice(0, Math.max(12, maxWords)).join(' ');
    if (!result.match(/[.!?]$/)) result += '.';
  }
  
  return result.trim();
};

// Build GPSC structure robustly from roteiro
export const buildReelsGPSC = (roteiro: string): Record<SectionKey, string> => {
  const blocks = parseTemporalScript(roteiro);

  const gpsc: Record<SectionKey, string> = {
    Gancho: '',
    Problema: '',
    Solução: '',
    CTA: ''
  };

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

  const extractLabeledSegments = (text: string): Array<{ key: SectionKey; content: string }> => {
    if (!text) return [];
    const markers = '(gancho|hook|headline|abertura|chamada|teaser|problema|dor|agita[cç][aã]o|obst[áa]culo|erro|mito|solu[cç][aã]o|como|passo|dica|m[eé]todo|prova|exemplo|framework|cta|call\\s*to\\s*action|a[cç][aã]o|convite|dire[cç][aã]o|oferta|assine|comente|compartilhe|salve|segue|inscreva|clique|acesse|garanta|link)';
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

  const cleanedFullAll = cleanForReading(roteiro);
  const explicit = segmentByExplicitMarkers(cleanedFullAll);
  if (explicit.found) {
    Object.assign(gpsc, explicit.gpsc);
  } else if (blocks.length > 0) {
    blocks.forEach((block) => {
      const cleaned = cleanForReading(block.content);
      const labeled = extractLabeledSegments(cleaned);
      if (labeled.length > 0) {
        labeled.forEach(({ key, content }) => {
          gpsc[key] += (gpsc[key] ? '\n\n' : '') + content;
        });
        return;
      }
      const fromLabel = normalizeSection(block.label);
      if (fromLabel) {
        gpsc[fromLabel] += (gpsc[fromLabel] ? '\n\n' : '') + cleaned;
        return;
      }
      const lower = cleaned.toLowerCase();
      let bucket: SectionKey = 'Solução';
      
      // GANCHO: Frases provocativas, questionamentos, hooks emocionais
      if (
        lower.includes('você sabia') ||
        lower.includes('imagine') ||
        lower.includes('e se eu te dissesse') ||
        lower.includes('pare tudo') ||
        lower.includes('atenção') ||
        lower.includes('a real é que') ||
        lower.includes('ninguém te conta') ||
        /^(você|vocês|tu)\s/.test(lower) ||
        (cleaned.includes('?') && cleaned.indexOf('?') < 150) ||
        lower.includes('olha só') ||
        lower.includes('escuta isso')
      ) {
        bucket = 'Gancho';
      }
      // PROBLEMA: Identificação de dores, frustrações, limitações
      else if (
        lower.includes('problema') ||
        lower.includes('dificuldade') ||
        lower.includes('frustração') ||
        lower.includes('não consegue') ||
        lower.includes('sofre') ||
        lower.includes('luta') ||
        lower.includes('desafio') ||
        lower.includes('celulite') ||
        lower.includes('incomoda') ||
        lower.includes('continua') ||
        lower.includes('mas a pele') ||
        lower.includes('mesmo fazendo') ||
        lower.includes('tentou de tudo')
      ) {
        bucket = 'Problema';
      }
      // CTA: Chamadas para ação clara e direta
      else if (
        lower.includes('pergunta pro seu médico') ||
        lower.includes('procure um profissional') ||
        lower.includes('fale com') ||
        lower.includes('sem enrolação') ||
        lower.includes('hoje mesmo') ||
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
        bucket = 'CTA';
      }
      gpsc[bucket] += (gpsc[bucket] ? '\n\n' : '') + cleaned;
    });
  } else {
    const paragraphs = cleanedFullAll.split(/\n\s*\n/).filter((p) => p.trim());
    const quarters = Math.max(1, Math.ceil(paragraphs.length / 4));
    gpsc['Gancho'] = paragraphs.slice(0, quarters).join('\n\n');
    gpsc['Problema'] = paragraphs.slice(quarters, quarters * 2).join('\n\n');
    gpsc['Solução'] = paragraphs.slice(quarters * 2, quarters * 3).join('\n\n');
    gpsc['CTA'] = paragraphs.slice(quarters * 3).join('\n\n');
  }

  const needsRebuild = (k: SectionKey) => !gpsc[k] || gpsc[k].trim().length < 20;
  if (needsRebuild('Gancho') || needsRebuild('Problema') || needsRebuild('Solução') || needsRebuild('CTA')) {
    const cleanedFull = cleanForReading(roteiro).replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();

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

  // Apply word limits to each section
  const limitedGpsc = rebalanceGPSC(gpsc);
  (['Gancho', 'Problema', 'Solução', 'CTA'] as SectionKey[]).forEach((key) => {
    limitedGpsc[key] = limitSectionWords(limitedGpsc[key], SECTION_WORD_LIMITS[key]);
  });
  
  return limitedGpsc;
};

// Build OFF from GPSC with final OFF cleanup
export const buildReelsOFF = (roteiro: string): string => {
  const gpsc = buildReelsGPSC(roteiro);
  const order: SectionKey[] = ['Gancho','Problema','Solução','CTA'];
  const parts = order.map(k => cleanForOFF(gpsc[k])).filter(Boolean);
  let out = parts.join(' ');
  out = out.replace(/\s{2,}/g, ' ').trim();
  return out;
};
