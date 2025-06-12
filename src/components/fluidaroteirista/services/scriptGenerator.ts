
import { generateScript } from '@/services/supabaseService';
import { toast } from 'sonner';
import { FluidaScriptResult, ScriptGenerationData } from '../types';
import { buildSystemPrompt, buildDisneyPrompt } from '../utils/promptBuilders';
import { validateScriptData, createFallbackScript } from '../utils/scriptValidation';

export const generateFluidaScript = async (
  data: ScriptGenerationData,
  equipmentDetails: any[]
): Promise<FluidaScriptResult> => {
  console.log('🤖 [scriptGenerator] Iniciando geração de roteiro...');
  console.log('📋 [scriptGenerator] Dados recebidos:', data);
  console.log('🔧 [scriptGenerator] Equipamentos:', equipmentDetails);
  
  // Validação crítica: garantir que apenas equipamentos selecionados sejam usados
  if (data.equipamentos && data.equipamentos.length > 0 && equipmentDetails.length === 0) {
    console.error('❌ [scriptGenerator] ERRO CRÍTICO: Equipamentos selecionados mas detalhes vazios');
    throw new Error('Equipamentos selecionados não foram carregados corretamente');
  }

  const systemPrompt = buildSystemPrompt(equipmentDetails, data.modo || 'rocket', data.mentor || 'Criativo');
  
  const userPrompt = `
    Tema: ${data.tema}
    Objetivo: ${data.objetivo || 'Atrair novos clientes'}
    Equipamentos EXCLUSIVOS a usar: ${data.equipamentos?.join(', ') || 'Nenhum equipamento específico'}
    
    IMPORTANTE: Use APENAS os equipamentos listados acima. NUNCA mencione outros equipamentos.
    
    Crie um roteiro CONCISO de MÁXIMO 60 segundos integrando os equipamentos e suas características específicas.
  `;

  console.log('📤 [scriptGenerator] Enviando para API OpenAI...');

  const response = await generateScript({
    type: 'custom',
    systemPrompt,
    userPrompt,
    topic: data.tema,
    additionalInfo: JSON.stringify({ equipmentDetails, modo: data.modo }),
    tone: 'professional',
    marketingObjective: data.objetivo as any
  });

  console.log('📥 [scriptGenerator] Resposta recebida da API');
  console.log('📄 [scriptGenerator] Conteúdo da resposta:', response.content);

  // Validação crítica: verificar se o conteúdo não está vazio
  if (!response.content || response.content.trim() === '') {
    console.error('❌ [scriptGenerator] ERRO CRÍTICO: Resposta vazia da API');
    throw new Error('A API retornou uma resposta vazia');
  }

  let scriptResult: FluidaScriptResult;
  try {
    // Tentar parsear como JSON primeiro
    const parsedContent = JSON.parse(response.content);
    
    // Verificar se tem a estrutura esperada
    if (parsedContent.roteiro || parsedContent.content) {
      scriptResult = {
        roteiro: parsedContent.roteiro || parsedContent.content,
        formato: parsedContent.formato || data.formato || 'carrossel',
        emocao_central: parsedContent.emocao_central || 'confiança',
        intencao: parsedContent.intencao || 'atrair',
        objetivo: parsedContent.objetivo || data.objetivo || 'Atrair novos clientes',
        mentor: parsedContent.mentor || data.mentor || 'Criativo',
        equipamentos_utilizados: equipmentDetails
      };
    } else {
      console.warn('⚠️ [scriptGenerator] JSON não tem estrutura esperada, usando conteúdo direto');
      scriptResult = createFallbackScript(response.content, data, equipmentDetails);
    }
    
    console.log('✅ [scriptGenerator] JSON parseado com sucesso');
  } catch (parseError) {
    console.warn('⚠️ [scriptGenerator] Erro ao parsear JSON, usando fallback:', parseError);
    // Se não for JSON válido, usar o conteúdo direto
    scriptResult = createFallbackScript(response.content, data, equipmentDetails);
  }

  // Validação final: garantir que o roteiro não está vazio
  if (!scriptResult.roteiro || scriptResult.roteiro.trim() === '') {
    console.error('❌ [scriptGenerator] ERRO CRÍTICO: Roteiro final está vazio');
    scriptResult.roteiro = `Roteiro sobre ${data.tema}

Você já pensou em como melhorar ${data.tema}? 

${data.equipamentos && data.equipamentos.length > 0 
  ? `Com nosso ${data.equipamentos[0]}, você pode alcançar resultados incríveis de forma segura e eficaz.` 
  : 'Nossos tratamentos avançados podem te ajudar a alcançar os resultados que você deseja.'}

Agende sua consulta e descubra como podemos transformar seu cuidado pessoal.`;
  }

  console.log('✅ [scriptGenerator] Roteiro final criado:', scriptResult);
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
