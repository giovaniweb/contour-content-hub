import { generateScript } from '@/services/supabaseService';
import { toast } from 'sonner';
import { FluidaScriptResult, ScriptGenerationData } from '../types';
import { buildSystemPrompt, buildDisneyPrompt } from '../utils/promptBuilders';
import { validateScriptData, createFallbackScript } from '../utils/scriptValidation';

export const generateFluidaScript = async (
  data: ScriptGenerationData,
  equipmentDetails: any[]
): Promise<FluidaScriptResult> => {
  console.log('🤖 [scriptGenerator] ===== INICIANDO GERAÇÃO COM PROMPTS =====');
  console.log('📋 [scriptGenerator] Dados recebidos:', data);
  console.log('🔧 [scriptGenerator] Equipamentos detalhados:', equipmentDetails);
  
  // Validação crítica: garantir que apenas equipamentos selecionados sejam usados
  if (data.equipamentos && data.equipamentos.length > 0 && equipmentDetails.length === 0) {
    console.error('❌ [scriptGenerator] ERRO CRÍTICO: Equipamentos selecionados mas detalhes vazios');
    // Não falhar, mas avisar
    console.warn('⚠️ [scriptGenerator] Continuando sem equipamentos específicos');
  }

  // Construir prompt do sistema com ênfase nos equipamentos
  const systemPrompt = buildSystemPrompt(equipmentDetails, data.modo || 'rocket', data.mentor || 'Criativo');
  
  // Construir prompt do usuário com ênfase nos equipamentos
  const equipmentEmphasis = equipmentDetails.length > 0 
    ? `EQUIPAMENTOS OBRIGATÓRIOS A MENCIONAR:
${equipmentDetails.map(eq => `- ${eq.nome}: ${eq.tecnologia} (Benefícios: ${eq.beneficios})`).join('\n')}

IMPORTANTE: O roteiro DEVE mencionar especificamente estes equipamentos e suas tecnologias.`
    : 'Nenhum equipamento específico foi selecionado.';

  const userPrompt = `
TEMA PRINCIPAL: ${data.tema}
OBJETIVO: ${data.objetivo || 'Atrair novos clientes'}
FORMATO: ${data.formato || 'carrossel'}

${equipmentEmphasis}

INSTRUÇÕES ESPECÍFICAS:
- Crie um roteiro de MÁXIMO 60 segundos
- Use a estrutura: Gancho → Conflito → Virada → CTA
- Se equipamentos foram especificados, MENCIONE-OS no roteiro
- Mantenha tom ${data.mentor || 'criativo'} e emoção envolvente
- Formato para ${data.formato || 'carrossel'}

Crie o roteiro agora integrando os equipamentos especificados.
  `;

  console.log('📤 [scriptGenerator] Prompts construídos:');
  console.log('🔧 [scriptGenerator] System prompt length:', systemPrompt.length);
  console.log('💬 [scriptGenerator] User prompt:', userPrompt);

  const response = await generateScript({
    type: 'custom',
    systemPrompt,
    userPrompt,
    topic: data.tema,
    additionalInfo: JSON.stringify({ 
      equipmentDetails, 
      modo: data.modo,
      equipamentos_solicitados: data.equipamentos 
    }),
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
    
    // Criar roteiro de fallback que mencione os equipamentos
    const equipmentMention = equipmentDetails.length > 0 
      ? `Com nosso ${equipmentDetails[0].nome}, você pode alcançar resultados incríveis de forma segura e eficaz.`
      : 'Nossos tratamentos avançados podem te ajudar a alcançar os resultados que você deseja.';
    
    scriptResult.roteiro = `🎯 ${data.tema}

Você já pensou em como transformar sua autoestima? 

${equipmentMention}

✨ Resultados comprovados, tecnologia de ponta, cuidado personalizado.

📲 Agende sua consulta e descubra como podemos transformar seu cuidado pessoal.`;
  }

  // VALIDAÇÃO PÓS-GERAÇÃO: Verificar se equipamentos foram mencionados
  if (equipmentDetails.length > 0) {
    const equipmentsMentioned = equipmentDetails.filter(eq => 
      scriptResult.roteiro.toLowerCase().includes(eq.nome.toLowerCase())
    );
    
    console.log('🔍 [scriptGenerator] Verificação de equipamentos no roteiro:');
    console.log('📝 [scriptGenerator] Equipamentos esperados:', equipmentDetails.map(eq => eq.nome));
    console.log('✅ [scriptGenerator] Equipamentos mencionados:', equipmentsMentioned.map(eq => eq.nome));
    
    if (equipmentsMentioned.length === 0) {
      console.error('❌ [scriptGenerator] PROBLEMA CRÍTICO: Nenhum equipamento foi mencionado no roteiro!');
    } else if (equipmentsMentioned.length < equipmentDetails.length) {
      console.warn('⚠️ [scriptGenerator] Alguns equipamentos não foram mencionados');
    } else {
      console.log('✅ [scriptGenerator] Todos os equipamentos foram mencionados!');
    }
  }

  console.log('✅ [scriptGenerator] ===== ROTEIRO FINAL CRIADO =====');
  console.log('🎬 [scriptGenerator] Resultado:', scriptResult);
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
