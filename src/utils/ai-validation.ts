
import { supabase } from '@/integrations/supabase/client';
import { ScriptResponse } from './api';
import { useToast } from '@/hooks/use-toast';

export interface ValidationBlock {
  tipo: 'gancho' | 'conflito' | 'virada' | 'cta';
  nota: number;
  texto: string;
  sugestao?: string;
  substituir?: boolean;
}

export interface ValidationResult {
  blocos: ValidationBlock[];
  nota_geral: number;
  sugestoes_gerais: string[];
  gancho: number;
  clareza: number;
  cta: number;
  emocao: number;
  total: number;
  sugestoes: string;
}

export const validateScript = async (script: ScriptResponse): Promise<ValidationResult> => {
  try {
    console.log("Iniciando validação para roteiro:", script.id);
    
    // Verificar se já existe uma validação recente (menos de 1 hora)
    const existingValidation = await getValidation(script.id);
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    if (existingValidation && new Date(existingValidation.timestamp) > oneHourAgo) {
      console.log("Usando validação existente recente");
      return existingValidation;
    }
    
    // Chamar edge function para validar roteiro com IA
    console.log("Enviando solicitação para validação avançada com GPT-4o");
    const { data, error } = await supabase.functions.invoke('validate-script', {
      body: {
        content: script.content,
        type: script.type,
        title: script.title,
        scriptId: script.id
      }
    });
    
    if (error) {
      console.error("Erro ao invocar função validate-script:", error);
      throw error;
    }
    
    console.log("Validação concluída com sucesso:", data);
    
    // Salvar validação no banco de dados
    await saveValidation(script.id, data);
    
    return data;
  } catch (error) {
    console.error('Erro ao validar roteiro:', error);
    throw error;
  }
};

export const getValidation = async (scriptId: string): Promise<ValidationResult & {timestamp?: string} | null> => {
  try {
    console.log("Buscando validação para roteiro:", scriptId);
    
    // Verificar se o ID é um UUID válido
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(scriptId);
    
    // Se não for um UUID, usar uma tabela temporária ou armazenamento alternativo
    if (!isUuid) {
      // Usar localStorage para armazenar validações temporárias (para roteiros sem um UUID)
      if (typeof window !== 'undefined') {
        const validationKey = `validation_${scriptId}`;
        const storedValidation = localStorage.getItem(validationKey);
        
        if (storedValidation) {
          const validation = JSON.parse(storedValidation);
          console.log("Validação encontrada em armazenamento temporário:", validation);
          return validation;
        }
      }
      return null;
    }
    
    // Para UUIDs válidos, buscar no banco de dados
    const { data, error } = await supabase
      .from('roteiro_validacoes')
      .select('*')
      .eq('roteiro_id', scriptId)
      .order('data_validacao', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.log("Nenhuma validação encontrada para o roteiro:", scriptId);
      return null;
    }
    
    console.log("Validação encontrada:", data);
    
    // Verificar se o objeto data possui alguma propriedade "blocos"
    // Se não possuir, precisamos criar blocos vazios
    const hasBlocos = data && Object.prototype.hasOwnProperty.call(data, 'blocos');
    
    // Mapear o formato do banco de dados para o formato esperado
    const result: ValidationResult = {
      blocos: hasBlocos ? data.blocos : [], // Usar a propriedade apenas se existir
      nota_geral: data.pontuacao_total,
      sugestoes_gerais: data.sugestoes.split('\n'),
      // Campos antigos para manter compatibilidade
      gancho: data.pontuacao_gancho,
      clareza: data.pontuacao_clareza,
      cta: data.pontuacao_cta,
      emocao: data.pontuacao_emocao,
      total: data.pontuacao_total,
      sugestoes: data.sugestoes
    };
    
    return {
      ...result,
      timestamp: data.data_validacao
    };
  } catch (error) {
    console.error('Erro ao buscar validação:', error);
    return null;
  }
};

const saveValidation = async (scriptId: string, validation: ValidationResult): Promise<void> => {
  try {
    console.log("Salvando validação para roteiro:", scriptId);
    
    // Verificar se o ID é um UUID válido
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(scriptId);
    
    // Se não for um UUID, usar uma tabela temporária ou armazenamento alternativo
    if (!isUuid) {
      // Usar localStorage para armazenar validações temporárias (para roteiros sem um UUID)
      if (typeof window !== 'undefined') {
        const validationKey = `validation_${scriptId}`;
        const validationData = {...validation, timestamp: new Date().toISOString()};
        localStorage.setItem(validationKey, JSON.stringify(validationData));
        console.log("Validação salva em armazenamento temporário");
      }
      return;
    }
    
    // Consolidar sugestões gerais em uma string se necessário
    const sugestoesStr = Array.isArray(validation.sugestoes_gerais) 
      ? validation.sugestoes_gerais.join('\n')
      : validation.sugestoes;
    
    // Para UUIDs válidos, salvar no banco de dados
    const { error } = await supabase
      .from('roteiro_validacoes')
      .insert({
        roteiro_id: scriptId,
        pontuacao_gancho: validation.gancho,
        pontuacao_clareza: validation.clareza,
        pontuacao_cta: validation.cta,
        pontuacao_emocao: validation.emocao,
        pontuacao_total: validation.total || validation.nota_geral,
        sugestoes: sugestoesStr,
        blocos: validation.blocos
      });
    
    if (error) {
      console.error("Erro ao salvar validação:", error);
      throw error;
    }
    
    console.log("Validação salva com sucesso");
  } catch (error) {
    console.error('Erro ao salvar validação:', error);
    throw error;
  }
};

// Função utilitária para obter indicador visual de qualidade
export const getQualityIndicator = (score: number | null): {
  color: string;
  label: string;
  icon: string;
} => {
  if (score === null) return { color: "gray", label: "Não avaliado", icon: "❓" };
  
  if (score >= 8) return { color: "green", label: "Excelente", icon: "🌟" };
  if (score >= 6) return { color: "yellow", label: "Bom", icon: "👍" };
  if (score >= 4) return { color: "orange", label: "Regular", icon: "⚠️" };
  return { color: "red", label: "Precisa melhorar", icon: "⚠️" };
};

// Função para mapear a validação para o formato de annotations
export const mapValidationToAnnotations = (validation: ValidationResult | null): Array<{
  type: 'positive' | 'negative' | 'suggestion' | 'gancho' | 'conflito' | 'virada' | 'cta';
  text: string;
  suggestion?: string;
  score?: number;
  blockType?: 'gancho' | 'conflito' | 'virada' | 'cta';
}> => {
  if (!validation) return [];

  const annotations = [];

  // Mapear os blocos para anotações
  if (validation.blocos && validation.blocos.length > 0) {
    for (const bloco of validation.blocos) {
      const type = bloco.nota >= 7 ? 'positive' : 'negative';
      
      annotations.push({
        type: bloco.tipo,
        text: bloco.texto,
        suggestion: bloco.sugestao,
        score: bloco.nota,
        blockType: bloco.tipo,
        replace: bloco.substituir
      });
    }
  } else {
    // Fallback para o formato antigo se não houver blocos
    // Criar anotações simuladas baseadas nos scores gerais
    if (validation.gancho < 7) {
      annotations.push({
        type: 'gancho',
        text: "Primeiro parágrafo do roteiro",
        suggestion: "O gancho inicial precisa ser mais impactante e cativante",
        score: validation.gancho,
        blockType: 'gancho'
      });
    }
    
    if (validation.cta < 7) {
      annotations.push({
        type: 'cta',
        text: "Último parágrafo do roteiro",
        suggestion: "O CTA precisa ser mais direto e persuasivo",
        score: validation.cta,
        blockType: 'cta'
      });
    }
  }

  return annotations;
};
