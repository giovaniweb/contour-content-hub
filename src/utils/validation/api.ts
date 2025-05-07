
import { supabase } from "@/integrations/supabase/client";
import { ValidationResult } from "./types";
import { ScriptResponse } from "../api";

/**
 * Valida um roteiro usando IA 
 */
export async function validateScript(script: Pick<ScriptResponse, 'id' | 'content' | 'title' | 'type'>): Promise<ValidationResult> {
  try {
    // Add metadata about Disney enchantment approach for improved validation
    const disneyEnchantmentPrompt = `
      Além da validação padrão, use o método de encantamento Disney para avaliar o roteiro:
      - Gancho (Hook): O início captura atenção rapidamente?
      - Conflito: Apresenta claramente um problema ou desafio?
      - Virada: Oferece uma solução ou transformação convincente?
      - CTA (Call to Action): Finaliza com um chamado à ação claro e persuasivo?
      
      O modelo Disney é comprovadamente eficaz para engajamento em vídeos curtos.
    `;

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('validate-script', {
      body: {
        content: script.content,
        type: script.type || 'videoScript',
        title: script.title,
        scriptId: script.id,
        additionalContext: disneyEnchantmentPrompt // Add Disney method context
      }
    });

    if (error) {
      throw new Error(`Error validating script: ${error.message}`);
    }

    return data as ValidationResult;
  } catch (error) {
    console.error("Script validation error:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error validating script");
  }
}

/**
 * Obtém uma validação existente do banco de dados
 */
export async function getValidation(scriptId: string): Promise<ValidationResult | null> {
  try {
    // Usando roteiro_validacoes em vez de script_validations
    const { data, error } = await supabase
      .from('roteiro_validacoes')
      .select('*')
      .eq('roteiro_id', scriptId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Código de "não encontrado" do PostgREST
        return null;
      }
      throw error;
    }
    
    return data as unknown as ValidationResult;
  } catch (error) {
    console.error('Error fetching validation:', error);
    return null;
  }
}

/**
 * Salva uma validação no banco de dados
 */
export async function saveValidation(
  scriptId: string, 
  validation: ValidationResult
): Promise<void> {
  try {
    // Calcular pontuação total
    const totalScore = validation.total || validation.nota_geral || 0;
    
    // Preparar dados para inserção na tabela roteiro_validacoes existente
    const validationData = {
      roteiro_id: scriptId,
      pontuacao_total: totalScore,
      pontuacao_gancho: validation.gancho || 0,
      pontuacao_clareza: validation.clareza || 0,
      pontuacao_cta: validation.cta || 0,
      pontuacao_emocao: validation.emocao || 0,
      sugestoes: validation.sugestoes || Array.isArray(validation.sugestoes_gerais) ? validation.sugestoes_gerais.join('\n') : ''
    };
    
    // Inserir na tabela roteiro_validacoes
    const { error } = await supabase
      .from('roteiro_validacoes')
      .upsert(validationData);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error saving validation:', error);
    throw new Error('Failed to save validation to database');
  }
}
