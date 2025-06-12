
import { toast } from 'sonner';
import { ScriptGenerationData, FluidaScriptResult } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
  missingFields: string[];
  quality: 'low' | 'medium' | 'high';
}

export interface QualityCheck {
  hasEquipmentMention: boolean;
  hasMentorTone: boolean;
  hasSpecificCTA: boolean;
  hasEmotionalHook: boolean;
  isEngaging: boolean;
  isPersonalized: boolean;
}

/**
 * Validação PRÉ-GERAÇÃO - Bloqueia se não atender critérios mínimos
 */
export const validatePreGeneration = (data: ScriptGenerationData): ValidationResult => {
  console.log('🔍 [antiGenericValidation] Iniciando validação pré-geração:', data);
  
  const errors: string[] = [];
  const suggestions: string[] = [];
  const missingFields: string[] = [];

  // 1. VALIDAÇÃO DE TEMA - Deve ser específico
  if (!data.tema || data.tema.trim().length < 10) {
    errors.push('Tema muito vago ou curto');
    missingFields.push('tema');
    suggestions.push('Descreva um tema específico com pelo menos 10 caracteres');
  }

  // Detectar temas genéricos proibidos
  const genericTerms = ['melasma', 'tratamento', 'procedimento', 'beleza', 'estética'];
  const isGenericTheme = genericTerms.some(term => 
    data.tema?.toLowerCase().includes(term) && data.tema.length < 20
  );

  if (isGenericTheme) {
    errors.push('Tema muito genérico - precisa ser mais específico');
    suggestions.push('Exemplo: "Como tratar melasma com Laser Q-Switch para mulheres de 30-45 anos"');
  }

  // 2. VALIDAÇÃO DE EQUIPAMENTO - Obrigatório para qualidade
  if (!data.equipamentos || data.equipamentos.length === 0) {
    missingFields.push('equipamentos');
    suggestions.push('Selecione pelo menos um equipamento específico da sua clínica');
  }

  // 3. VALIDAÇÃO DE OBJETIVO - Deve ser claro
  if (!data.objetivo || data.objetivo === 'atrair') {
    missingFields.push('objetivo');
    suggestions.push('Defina um objetivo específico: educar, vender, conectar, gerar leads');
  }

  // 4. VALIDAÇÃO DE MENTOR - Deve estar inferido
  if (!data.mentor || data.mentor === 'Criativo') {
    missingFields.push('mentor');
    suggestions.push('O sistema deve inferir um mentor específico baseado nas suas escolhas');
  }

  // 5. VALIDAÇÃO DE CONTEXTO - Verificar se há informações suficientes
  const hasMinimumContext = (
    data.tema && data.tema.length > 15 &&
    data.equipamentos && data.equipamentos.length > 0 &&
    data.objetivo && data.objetivo !== 'atrair' &&
    data.mentor && data.mentor !== 'Criativo'
  );

  if (!hasMinimumContext) {
    errors.push('Contexto insuficiente para gerar roteiro personalizado');
    suggestions.push('Complete todas as informações obrigatórias antes de gerar');
  }

  // Determinar qualidade baseada nos critérios
  let quality: 'low' | 'medium' | 'high' = 'low';
  if (errors.length === 0 && missingFields.length === 0) {
    quality = 'high';
  } else if (errors.length <= 1 && missingFields.length <= 2) {
    quality = 'medium';
  }

  const result: ValidationResult = {
    isValid: errors.length === 0 && missingFields.length === 0,
    errors,
    suggestions,
    missingFields,
    quality
  };

  console.log('📊 [antiGenericValidation] Resultado da validação pré-geração:', result);
  return result;
};

/**
 * Validação PÓS-GERAÇÃO - Verifica qualidade do roteiro gerado
 */
export const validatePostGeneration = (
  script: FluidaScriptResult, 
  originalData: ScriptGenerationData
): QualityCheck => {
  console.log('🎯 [antiGenericValidation] Iniciando validação pós-geração');
  console.log('📝 [antiGenericValidation] Script:', script.roteiro);
  console.log('🔧 [antiGenericValidation] Equipamentos esperados:', originalData.equipamentos);

  const roteiro = script.roteiro.toLowerCase();
  
  // 1. Verificar menção de equipamentos específicos
  const hasEquipmentMention = originalData.equipamentos?.some(equipment => {
    const mentioned = roteiro.includes(equipment.toLowerCase());
    console.log(`🔍 [antiGenericValidation] Equipamento "${equipment}" mencionado:`, mentioned);
    return mentioned;
  }) || false;

  // 2. Verificar tom do mentor
  const mentorIndicators = getMentorIndicators(originalData.mentor || 'Criativo');
  const hasMentorTone = mentorIndicators.some(indicator => 
    roteiro.includes(indicator.toLowerCase())
  );

  // 3. Verificar CTA específico
  const specificCTATerms = ['agende', 'consulta', 'whatsapp', 'link', 'bio', 'dm', 'direct'];
  const hasSpecificCTA = specificCTATerms.some(term => roteiro.includes(term));

  // 4. Verificar gancho emocional
  const emotionalHooks = ['você', 'sua', 'imagine', 'sente', 'sonha', 'quer', 'precisa'];
  const hasEmotionalHook = emotionalHooks.some(hook => roteiro.includes(hook));

  // 5. Verificar engajamento
  const engagingTerms = ['segredo', 'descobri', 'revelação', 'transformação', 'resultado'];
  const isEngaging = engagingTerms.some(term => roteiro.includes(term));

  // 6. Verificar personalização (não genérico)
  const genericTerms = ['tratamento geral', 'procedimento comum', 'resultado padrão'];
  const isPersonalized = !genericTerms.some(term => roteiro.includes(term));

  const qualityCheck: QualityCheck = {
    hasEquipmentMention,
    hasMentorTone,
    hasSpecificCTA,
    hasEmotionalHook,
    isEngaging,
    isPersonalized
  };

  console.log('✅ [antiGenericValidation] Quality check resultado:', qualityCheck);
  return qualityCheck;
};

/**
 * Obter indicadores de tom baseados no mentor
 */
const getMentorIndicators = (mentor: string): string[] => {
  const indicators: Record<string, string[]> = {
    'Criativo': ['inovador', 'único', 'especial', 'diferente', 'criativo'],
    'Científico': ['estudos', 'comprovado', 'evidência', 'pesquisa', 'científico'],
    'Emocional': ['sente', 'emoção', 'coração', 'sonho', 'transformação'],
    'Direto': ['agora', 'hoje', 'rápido', 'resultado', 'eficaz'],
    'Disney': ['sonho', 'magia', 'encanto', 'jornada', 'transformação'],
    'Storytelling': ['história', 'era uma vez', 'aconteceu', 'descobriu', 'virou']
  };

  return indicators[mentor] || indicators['Criativo'];
};

/**
 * Gerar perguntas inteligentes baseadas no que está faltando
 */
export const generateSmartQuestions = (validation: ValidationResult): string[] => {
  const questions: string[] = [];

  if (validation.missingFields.includes('tema')) {
    questions.push('Sobre que problema específico do seu cliente você quer falar?');
    questions.push('Que resultado ou transformação você quer destacar?');
  }

  if (validation.missingFields.includes('equipamentos')) {
    questions.push('Qual equipamento da sua clínica você quer destacar?');
    questions.push('Que tecnologia você tem disponível para este tratamento?');
  }

  if (validation.missingFields.includes('objetivo')) {
    questions.push('Você quer educar, vender ou gerar conexão com este post?');
    questions.push('Qual ação você quer que o cliente tome depois de ver seu conteúdo?');
  }

  if (validation.missingFields.includes('mentor')) {
    questions.push('Que estilo de comunicação representa melhor sua clínica?');
    questions.push('Você prefere ser mais técnico, emocional ou direto?');
  }

  return questions;
};

/**
 * Verificar se o roteiro atende aos padrões mínimos de qualidade
 */
export const meetsQualityStandards = (qualityCheck: QualityCheck): boolean => {
  // Critérios mínimos: pelo menos 4 dos 6 checks devem passar
  const passedChecks = Object.values(qualityCheck).filter(Boolean).length;
  const minimumRequired = 4;
  
  console.log(`🎯 [antiGenericValidation] Checks passaram: ${passedChecks}/${Object.values(qualityCheck).length}`);
  return passedChecks >= minimumRequired;
};

/**
 * Gerar sugestões de melhoria baseadas no quality check
 */
export const generateImprovementSuggestions = (
  qualityCheck: QualityCheck, 
  originalData: ScriptGenerationData
): string[] => {
  const suggestions: string[] = [];

  if (!qualityCheck.hasEquipmentMention) {
    suggestions.push(`Mencione especificamente o equipamento: ${originalData.equipamentos?.join(', ')}`);
  }

  if (!qualityCheck.hasMentorTone) {
    suggestions.push(`Ajuste o tom para refletir o mentor ${originalData.mentor}`);
  }

  if (!qualityCheck.hasSpecificCTA) {
    suggestions.push('Adicione um CTA mais específico e direto');
  }

  if (!qualityCheck.hasEmotionalHook) {
    suggestions.push('Crie um gancho mais emocional e pessoal');
  }

  if (!qualityCheck.isEngaging) {
    suggestions.push('Torne o conteúdo mais envolvente e impactante');
  }

  if (!qualityCheck.isPersonalized) {
    suggestions.push('Remova termos genéricos e personalize mais o conteúdo');
  }

  return suggestions;
};
