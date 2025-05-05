
import { ValidationResult } from '@/utils/validation/types';

export interface ToneRangeConfig {
  range: [number, number];
  tone: string;
  action: string;
}

export const TONE_RANGES: ToneRangeConfig[] = [
  {
    range: [0.0, 5.9],
    tone: 'Urgente / emocional / provocativo',
    action: 'Reescrever completamente com tom mais intenso/emotivo'
  },
  {
    range: [6.0, 7.4],
    tone: 'Envolvente / empático',
    action: 'Ajustar foco e clareza, tornar mais envolvente'
  },
  {
    range: [7.5, 8.9],
    tone: 'Direto / assertivo',
    action: 'Otimizar CTA, ritmo e detalhes'
  },
  {
    range: [9.0, 10],
    tone: 'Elegante / fluido / profissional',
    action: 'Manter texto, apenas polir fluidez se necessário'
  }
];

export interface BlockImprovementRule {
  blockType: string;
  improvementFocus: string;
}

export const BLOCK_IMPROVEMENT_RULES: BlockImprovementRule[] = [
  {
    blockType: 'gancho',
    improvementFocus: 'Começar com dado impactante, dor ou pergunta surpresa'
  },
  {
    blockType: 'conflito',
    improvementFocus: 'Aumentar identificação emocional ou tensão presente'
  },
  {
    blockType: 'virada',
    improvementFocus: 'Clarificar a transformação com termos técnicos simples'
  },
  {
    blockType: 'final',
    improvementFocus: 'Incluir tempo, urgência, escassez ou benefício final'
  },
  {
    blockType: 'cta',
    improvementFocus: 'Incluir tempo, urgência, escassez ou benefício final'
  }
];

export function getToneRangeByScore(score: number): ToneRangeConfig {
  return TONE_RANGES.find(
    range => score >= range.range[0] && score <= range.range[1]
  ) || TONE_RANGES[1]; // Default to middle range
}

export function getBlockImprovement(blockType: string): string {
  const normalizedBlockType = blockType.toLowerCase();
  
  // Find exact match first
  const rule = BLOCK_IMPROVEMENT_RULES.find(
    rule => rule.blockType.toLowerCase() === normalizedBlockType
  );
  
  if (rule) return rule.improvementFocus;
  
  // If no exact match, try partial match
  const partialRule = BLOCK_IMPROVEMENT_RULES.find(
    rule => normalizedBlockType.includes(rule.blockType)
  );
  
  return partialRule?.improvementFocus || 'Otimizar clareza e impacto';
}

export function getProgressBar(score: number, maxScore: number = 10): string {
  const percent = (score / maxScore) * 100;
  const filledBlocks = Math.round((percent / 100) * 30);
  const emptyBlocks = 30 - filledBlocks;
  
  return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
}
