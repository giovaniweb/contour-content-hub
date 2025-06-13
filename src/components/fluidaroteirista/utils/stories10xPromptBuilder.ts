
import { buildStories10xStructure, STORIES_10X_DEVICES } from './stories10xDevices';

export const buildStories10xPrompt = (
  tema: string,
  equipmentDetails: any[],
  objetivo: string,
  estilo: string
): { systemPrompt: string; userPrompt: string } => {
  
  const equipmentContext = equipmentDetails.length > 0 
    ? `\n🔧 EQUIPAMENTOS/TRATAMENTOS OBRIGATÓRIOS:
${equipmentDetails.map((eq, index) => `${index + 1}. ${eq.nome}: ${eq.tecnologia}
   - Benefícios: ${eq.beneficios}
   - Como mencionar: De forma natural na Story 3 (virada/solução)`).join('\n')}

🚨 IMPORTANTE: Mencione os equipamentos de forma NATURAL na Story 3, como parte da solução.`
    : '';

  const systemPrompt = `Você é especialista na metodologia STORIES 10X do Leandro Ladeira.

📚 CONHECIMENTO BASE:
- Criado com Kátia Damasceno para aumentar engajamento
- Transformar Stories em comunidade ativa  
- Sequência > Story solto: criar contexto e narrativa envolvente
- Usar storytelling emocional com final que convida a compartilhar
- Tom conversado, evitar excesso de "aulinha"
- Pelo menos 3 dispositivos de engajamento por sequência

🎯 DISPOSITIVOS DISPONÍVEIS:
${STORIES_10X_DEVICES.map(device => `- ${device.nome} (${device.tipo}): ${device.exemplo}`).join('\n')}

${buildStories10xStructure(tema)}

${equipmentContext}

🎬 FORMATO DE SAÍDA:
Retorne EXATAMENTE assim:

Story 1: [Texto do gancho com dispositivo de engajamento]
Story 2: [Texto do contexto/história pessoal]  
Story 3: [Texto da virada/solução${equipmentDetails.length > 0 ? ' mencionando os equipamentos' : ''}]
Story 4: [Texto do CTA social específico]
Story 5: [Texto do bônus/antecipação]

🚨 NÃO use JSON, NÃO limite palavras rigidamente, FOQUE na metodologia de criar comunidade!`;

  const userPrompt = `Tema: ${tema}
Objetivo: ${objetivo}
Estilo: ${estilo}
${equipmentDetails.length > 0 ? `Equipamentos: ${equipmentDetails.map(eq => eq.nome).join(', ')}` : ''}

Crie uma sequência Stories 10x seguindo EXATAMENTE a metodologia do Leandro Ladeira. 
Use tom conversado, dispositivos de engajamento específicos e foque em criar comunidade ativa.

EXEMPLO DE REFERÊNCIA:
Story 1: "Você também trava quando liga a câmera? 😳 // [Enquete: Sim / MUITO]"
Story 2: "Eu travava tanto que uma vez apaguei um vídeo só porque gaguejei no início 😅"  
Story 3: "Mas aí eu descobri um truque simples que mudou tudo: FINGIR que tô explicando pra um amigo, não pra 'internet'"
Story 4: "Se isso te ajudou, manda esse Story praquele seu amigo(a) que vive falando 'eu não nasci pra câmera' 🎥❤️"
Story 5: "Quer a parte 2? Me manda um 🔥 que eu libero!"`;

  return { systemPrompt, userPrompt };
};
