
import { toast } from 'sonner';
import { ScriptGenerationData } from '../types';

export const validateScriptData = (data: ScriptGenerationData): boolean => {
  if (!data.tema || !data.tema.trim()) {
    toast.error('❌ Erro de validação', {
      description: 'Por favor, informe um tema para o roteiro'
    });
    return false;
  }
  return true;
};

export const createFallbackScript = (content: string, data: ScriptGenerationData, equipmentDetails: any[]) => {
  return {
    roteiro: content,
    formato: 'carrossel',
    emocao_central: 'confiança',
    intencao: 'atrair',
    objetivo: data.objetivo || 'Atrair novos clientes',
    mentor: data.mentor || 'Criativo',
    equipamentos_utilizados: equipmentDetails
  };
};
