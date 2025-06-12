
import { generateScript } from '@/services/supabaseService';
import { toast } from 'sonner';
import { FluidaScriptResult, ScriptGenerationData } from '../types';
import { buildSystemPrompt, buildDisneyPrompt } from '../utils/promptBuilders';
import { validateScriptData, createFallbackScript } from '../utils/scriptValidation';

export const generateFluidaScript = async (
  data: ScriptGenerationData,
  equipmentDetails: any[]
): Promise<FluidaScriptResult> => {
  console.log('🤖 [scriptGenerator] Chamando API OpenAI...');
  
  const systemPrompt = buildSystemPrompt(equipmentDetails, data.modo || 'rocket', data.mentor || 'Criativo');
  
  const userPrompt = `
    Tema: ${data.tema}
    Objetivo: ${data.objetivo || 'Atrair novos clientes'}
    Equipamentos: ${data.equipamentos?.join(', ') || ''}
    
    Crie um roteiro CONCISO de MÁXIMO 60 segundos integrando os equipamentos e suas características específicas.
  `;

  const response = await generateScript({
    type: 'custom',
    systemPrompt,
    userPrompt,
    topic: data.tema,
    additionalInfo: JSON.stringify({ equipmentDetails, modo: data.modo }),
    tone: 'professional',
    marketingObjective: data.objetivo as any
  });

  console.log('📝 [scriptGenerator] Resposta recebida da API');

  let scriptResult: FluidaScriptResult;
  try {
    scriptResult = JSON.parse(response.content);
    console.log('✅ [scriptGenerator] JSON parseado com sucesso');
  } catch (parseError) {
    console.warn('⚠️ [scriptGenerator] Erro ao parsear JSON, usando fallback:', parseError);
    scriptResult = createFallbackScript(response.content, data, equipmentDetails);
  }

  return scriptResult;
};

export const applyDisneyTransformation = async (script: FluidaScriptResult): Promise<FluidaScriptResult> => {
  console.log('✨ [scriptGenerator] Aplicando Disney Magic...');
  
  const disneyPrompt = buildDisneyPrompt(script.roteiro);
  
  const response = await generateScript({
    type: 'custom',
    systemPrompt: disneyPrompt,
    userPrompt: `Transforme este roteiro com a magia Disney de 1928: ${script.roteiro}`,
    topic: 'Disney Magic Transformation',
    additionalInfo: 'Disney Magic Applied',
    tone: 'magical',
    marketingObjective: 'Criar Conexão' as any
  });

  let disneyResult;
  try {
    disneyResult = JSON.parse(response.content);
  } catch {
    disneyResult = {
      roteiro: response.content,
      disney_applied: true
    };
  }

  return {
    ...script,
    roteiro: disneyResult.roteiro,
    disney_applied: true,
    emocao_central: 'encantamento',
    mentor: 'Walt Disney 1928'
  };
};
