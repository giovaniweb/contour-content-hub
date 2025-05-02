
// Este arquivo mantém a API antiga para compatibilidade
// Mas internamente usa os novos módulos refatorados

import { ValidationResult, ValidationBlock } from './validation/types';
import { validateScript as validateScriptApi, getValidation as getValidationApi, saveValidation as saveValidationApi } from './validation/api';
import { getQualityIndicator as getQualityIndicatorApi } from './validation/indicators';
import { mapValidationToAnnotations as mapValidationToAnnotationsApi } from './validation/annotations';
import { ScriptResponse } from './api';

// Re-exportar tipos e interfaces para manter compatibilidade
export type { ValidationBlock, ValidationResult };

// Re-exportar funções usando a nova implementação
export const validateScript = validateScriptApi;
export const getValidation = getValidationApi;
export const getQualityIndicator = getQualityIndicatorApi;
export const mapValidationToAnnotations = mapValidationToAnnotationsApi;

// A função saveValidation não estava exportada no original, 
// mas agora é mais fácil de usar se for necessário
export const saveValidation = saveValidationApi;
