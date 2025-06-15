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
  
  if (data.equipamentos && data.equipamentos.length > 0 && equipmentDetails.length === 0) {
    console.error('❌ [scriptGenerator] ERRO CRÍTICO: Equipamentos selecionados mas detalhes vazios');
    console.warn('⚠️ [scriptGenerator] Continuando sem equipamentos específicos');
  }

  // Lógica de seleção de mentor & metodologia baseada em formato
  let mentor = data.mentor;
  let metodo = '';
  let systemPrompt = '';
  let userPrompt = '';
  const formato = (data.formato || '').toLowerCase();

  // Mapeamento do formato para métodos e mentores específicos
  switch (formato) {
    case 'reels':
      mentor = data.metodologia === 'Light Copy' ? 'Leandro Ladeira' : 'Hyeser Souza';
      metodo = data.metodologia === 'Light Copy' ? 'Light Copy' : 'COCA';
      break;
    case 'stories_10x':
      mentor = 'Leandro Ladeira';
      metodo = 'VTS10x';
      break;
    case 'tiktok':
      mentor = 'Hyeser Souza';
      metodo = 'COCA';
      break;
    case 'criativo_ads':
      mentor = 'Leandro Ladeira';
      metodo = 'Light Copy';
      break;
    case 'youtube':
      mentor = 'Hyeser Souza';
      metodo = 'COCA';
      break;
    default:
      // Padrão força Hyeser e COCA
      mentor = 'Hyeser Souza';
      metodo = 'COCA';
      break;
  }

  systemPrompt = buildSystemPrompt(
    equipmentDetails,
    metodo.toLowerCase(),
    mentor,
    { ...data, metodologia: metodo, formato }
  );
  
  data.mentor = mentor;

  userPrompt = `
TEMA PRINCIPAL: ${data.tema}
OBJETIVO: ${data.objetivo || 'Atrair novos clientes'}
FORMATO: ${data.formato || 'carrossel'}

${equipmentDetails.length > 0 
  ? `🚨 EQUIPAMENTOS OBRIGATÓRIOS (MENCIONE TODOS):\n${
      equipmentDetails.map((eq, index) => `${index + 1}. ${eq.nome}: ${eq.tecnologia}
   - Benefícios: ${eq.beneficios}
   - Diferenciais: ${eq.diferenciais}`).join('\n')}
🔥 REGRA CRÍTICA: O roteiro DEVE mencionar ESPECIFICAMENTE cada um destes equipamentos pelo nome.` 
  : 'Nenhum equipamento específico foi selecionado. Use termos genéricos.'}

INSTRUÇÕES ESPECÍFICAS:
- Crie um roteiro de MÁXIMO 60 segundos (se for reels/ou como limite do formato)
- Use a estrutura do método ${metodo || 'com base no mentor escolhido'}
- OBRIGATÓRIO: Se equipamentos foram especificados acima, MENCIONE-OS TODOS no roteiro
- Mantenha tom do mentor ${mentor} e emoção envolvente
- Formato para ${data.formato || 'carrossel'}

🎯 MISSÃO: Integrar TODOS os equipamentos listados de forma natural no roteiro.
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
        equipamentos_utilizados: equipmentDetails,
        canal: data.canal || 'instagram'
      };
    } else {
      console.warn('⚠️ [scriptGenerator] JSON não tem estrutura esperada, usando conteúdo direto');
      scriptResult = createFallbackScript(response.content, data, equipmentDetails);
    }
    
    console.log('✅ [scriptGenerator] JSON parseado com sucesso');
  } catch (parseError) {
    console.warn('⚠️ [scriptGenerator] Erro ao parsear JSON, usando fallback:', parseError);
    scriptResult = createFallbackScript(response.content, data, equipmentDetails);
  }

  // CORREÇÃO: Validação mais rigorosa e correção automática
  if (!scriptResult.roteiro || scriptResult.roteiro.trim() === '') {
    console.error('❌ [scriptGenerator] ERRO CRÍTICO: Roteiro final está vazio');
    scriptResult = createEmergencyScript(data, equipmentDetails);
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
      console.error('❌ [scriptGenerator] PROBLEMA CRÍTICO: Nenhum equipamento foi mencionado!');
      // CORREÇÃO: Forçar inclusão dos equipamentos
      scriptResult = forceEquipmentInclusion(scriptResult, equipmentDetails);
    } else if (equipmentsMentioned.length < equipmentDetails.length) {
      console.warn('⚠️ [scriptGenerator] Alguns equipamentos não foram mencionados');
      // CORREÇÃO: Forçar inclusão dos equipamentos faltantes
      scriptResult = forceEquipmentInclusion(scriptResult, equipmentDetails, equipmentsMentioned);
    } else {
      console.log('✅ [scriptGenerator] Todos os equipamentos foram mencionados!');
    }
  }

  console.log('✅ [scriptGenerator] ===== ROTEIRO FINAL CRIADO =====');
  console.log('🎬 [scriptGenerator] Resultado:', scriptResult);
  return scriptResult;
};

// NOVA FUNÇÃO: Criar script de emergência
const createEmergencyScript = (data: ScriptGenerationData, equipmentDetails: any[]): FluidaScriptResult => {
  const equipmentMention = equipmentDetails.length > 0 
    ? `Com nosso ${equipmentDetails[0].nome}, que utiliza ${equipmentDetails[0].tecnologia}, você pode alcançar resultados incríveis.`
    : 'Nossos tratamentos avançados podem te ajudar a alcançar os resultados que você deseja.';
  
  const emergencyScript = `🎯 ${data.tema || 'Transforme sua vida'}

Você já pensou em como transformar sua autoestima? 

${equipmentMention}

✨ Resultados comprovados, tecnologia de ponta, cuidado personalizado.

📲 Agende sua consulta e descubra como podemos transformar seu cuidado pessoal.`;

  return {
    roteiro: emergencyScript,
    formato: data.formato || 'carrossel',
    emocao_central: 'confiança',
    intencao: 'atrair',
    objetivo: data.objetivo || 'Atrair novos clientes',
    mentor: data.mentor || 'Criativo',
    equipamentos_utilizados: equipmentDetails,
    canal: data.canal || 'instagram'
  };
};

// NOVA FUNÇÃO: Forçar inclusão de equipamentos
const forceEquipmentInclusion = (
  scriptResult: FluidaScriptResult, 
  equipmentDetails: any[], 
  alreadyMentioned: any[] = []
): FluidaScriptResult => {
  console.log('🔧 [scriptGenerator] Forçando inclusão de equipamentos...');
  
  const missingEquipments = equipmentDetails.filter(eq => 
    !alreadyMentioned.some(mentioned => mentioned.nome === eq.nome)
  );
  
  let updatedScript = scriptResult.roteiro;
  
  // Adicionar equipamentos faltantes de forma natural
  if (missingEquipments.length > 0) {
    const equipmentText = missingEquipments.length === 1 
      ? `Com nosso ${missingEquipments[0].nome}, que utiliza ${missingEquipments[0].tecnologia}, você obtém ${missingEquipments[0].beneficios}.`
      : `Com nossos equipamentos ${missingEquipments.map(eq => eq.nome).join(' e ')}, utilizando tecnologias avançadas, você alcança resultados superiores.`;
    
    // Inserir na seção "Virada" do roteiro (após o conflito)
    const lines = updatedScript.split('\n');
    const middleIndex = Math.floor(lines.length / 2);
    lines.splice(middleIndex, 0, '', equipmentText);
    updatedScript = lines.join('\n');
    
    console.log('✅ [scriptGenerator] Equipamentos forçados incluídos:', missingEquipments.map(eq => eq.nome));
  }
  
  return {
    ...scriptResult,
    roteiro: updatedScript
  };
};

export const applyDisneyTransformation = async (script: FluidaScriptResult): Promise<FluidaScriptResult> => {
  console.log('✨ [scriptGenerator] Aplicando Disney Magic...');
  
  const disneyPrompt = buildDisneyPrompt(script.roteiro, script.formato);
  
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
    mentor: 'Walt Disney 1928',
    canal: script.canal
  };
};
