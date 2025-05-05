
import { CustomGptRequest } from './types.ts';

export function buildPrompt(requestData: CustomGptRequest): string {
  let userPrompt = '';
  
  // Add equipment data section
  userPrompt += `[DADOS DO EQUIPAMENTO - USE APENAS ESTAS INFORMAÇÕES]:\n`;
  if (requestData.equipamentoData) {
    userPrompt += `Nome: ${requestData.equipamentoData.nome}\n`;
    userPrompt += `Tecnologia: ${requestData.equipamentoData.tecnologia}\n`;
    userPrompt += `Indicações: ${requestData.equipamentoData.indicacoes}\n`;
    userPrompt += `Benefícios: ${requestData.equipamentoData.beneficios}\n`;
    userPrompt += `Diferenciais: ${requestData.equipamentoData.diferenciais}\n`;
    userPrompt += `Linguagem recomendada: ${requestData.equipamentoData.linguagem}\n\n`;
  } else {
    userPrompt += `Nome: ${requestData.equipamento}\n`;
    userPrompt += `AVISO: Dados completos do equipamento não fornecidos.\n\n`;
  }
  
  // Add safety instructions
  userPrompt += `[INSTRUÇÕES DE SEGURANÇA]:\n`;
  userPrompt += `- Use APENAS as informações acima. NÃO adicione, invente ou extrapole dados.\n`;
  userPrompt += `- NÃO misture tecnologia com indicações ou benefícios.\n`;
  userPrompt += `- Mantenha-se fiel aos dados do equipamento, sem "alucinações" ou confabulações.\n\n`;
  
  // Add content type
  userPrompt += `Tipo de conteúdo solicitado: ${requestData.tipo}\n`;
  
  // Add basic parameters based on content type
  if (requestData.tipo === 'roteiro') {
    userPrompt += `Quantidade de roteiros: ${requestData.quantidade}\n`;
    userPrompt += `Tom desejado: ${requestData.tom || 'Use o tom indicado no cadastro do equipamento'}\n`;
    addStrategicObjective(userPrompt, requestData.estrategiaConteudo || requestData.marketingObjective);
  } else if (requestData.tipo === 'bigIdea') {
    addStrategicObjective(userPrompt, requestData.estrategiaConteudo || requestData.marketingObjective);
  } else if (requestData.tipo === 'stories') {
    userPrompt += `Tom desejado: ${requestData.tom || 'Use o tom indicado no cadastro do equipamento'}\n`;
    userPrompt += `Gere ${requestData.quantidade || 10} ideias para stories\n`;
  }
  
  // Add advanced parameters if available
  if (requestData.topic) {
    userPrompt += `Tema/Assunto principal: ${requestData.topic}\n`;
  }
  
  if (requestData.bodyArea) {
    userPrompt += `Área do corpo a focar: ${requestData.bodyArea}\n`;
  }
  
  if (requestData.purposes && requestData.purposes.length > 0) {
    userPrompt += `Finalidades do tratamento: ${requestData.purposes.join(', ')}\n`;
  }
  
  if (requestData.additionalInfo) {
    userPrompt += `Informações adicionais: ${requestData.additionalInfo}\n`;
  }
  
  if (requestData.marketingObjective && !requestData.estrategiaConteudo) {
    addStrategicObjective(userPrompt, requestData.marketingObjective);
  }
  
  // Define output format
  userPrompt += `\nPor favor, crie ${requestData.tipo === 'roteiro' ? requestData.quantidade : requestData.tipo === 'stories' ? (requestData.quantidade || 10) : 1} ${requestData.tipo}(s) para o equipamento ${requestData.equipamento} seguindo rigorosamente o formato especificado.`;
  
  // Add safety reminder
  userPrompt += `\n\n[IMPORTANTE]: Verifique se todo o conteúdo que você gerou está baseado EXCLUSIVAMENTE nos dados do equipamento fornecidos. Não mencione benefícios, tecnologias ou indicações não listados explicitamente.`;

  return userPrompt;
}

// Helper function to add strategic objective context
function addStrategicObjective(prompt: string, objective?: string): string {
  if (!objective) return prompt;
  
  prompt += `Estratégia de conteúdo: ${objective}\n`;
  
  // Add specific context based on objective
  if (objective.includes('Atrair Atenção')) {
    prompt += `Contexto do objetivo: Criar curiosidade, interromper o scroll, gerar clique\n`;
  } else if (objective.includes('Criar Conexão')) {
    prompt += `Contexto do objetivo: Gerar empatia, identificação, mostrar "por que você"\n`;
  } else if (objective.includes('Fazer Comprar')) {
    prompt += `Contexto do objetivo: Destacar valor, diferencial, benefício, quebrar objeções\n`;
  } else if (objective.includes('Reativar Interesse')) {
    prompt += `Contexto do objetivo: Resgatar contatos frios, leads antigos, pacientes inativos\n`;
  } else if (objective.includes('Fechar Agora')) {
    prompt += `Contexto do objetivo: Ação imediata, urgência, chamada para conversão direta\n`;
  }
  
  return prompt;
}
