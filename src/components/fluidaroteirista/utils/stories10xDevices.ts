
// Dispositivos de engajamento específicos da metodologia Stories 10x do Leandro Ladeira

export interface EngagementDevice {
  nome: string;
  tipo: 'gancho' | 'contexto' | 'virada' | 'cta' | 'bonus';
  exemplo: string;
  aplicacao: string;
}

export const STORIES_10X_DEVICES: EngagementDevice[] = [
  // GANCHOS (Story 1)
  {
    nome: 'Gatilho da Curiosidade',
    tipo: 'gancho',
    exemplo: 'Você já passou por isso aqui?',
    aplicacao: 'Criar pergunta que gera identificação imediata'
  },
  {
    nome: 'Enquete de Identificação',
    tipo: 'gancho', 
    exemplo: '[Enquete: Sim / MUITO]',
    aplicacao: 'Usar enquete para medir identificação com o problema'
  },
  {
    nome: 'Pergunta Direta',
    tipo: 'gancho',
    exemplo: 'Você também trava quando liga a câmera? 😳',
    aplicacao: 'Fazer pergunta que a pessoa responde mentalmente "sim"'
  },
  
  // CONTEXTO (Story 2)
  {
    nome: 'História Pessoal',
    tipo: 'contexto',
    exemplo: 'Eu travava tanto que uma vez apaguei um vídeo só porque gaguejei no início 😅',
    aplicacao: 'Contar experiência pessoal que gera conexão'
  },
  {
    nome: 'Caso de Cliente',
    tipo: 'contexto',
    exemplo: 'Uma cliente me disse: "Eu não nasci pra câmera"',
    aplicacao: 'Usar história de terceiros para validar sentimento'
  },
  {
    nome: 'Revelação Vulnerável',
    tipo: 'contexto',
    exemplo: 'Vou te contar algo que nunca falei aqui...',
    aplicacao: 'Criar intimidade através de vulnerabilidade'
  },
  
  // VIRADA (Story 3)
  {
    nome: 'Descoberta Transformadora',
    tipo: 'virada',
    exemplo: 'Mas aí eu descobri um truque simples que mudou tudo',
    aplicacao: 'Apresentar solução como descoberta pessoal'
  },
  {
    nome: 'Mudança de Perspectiva',
    tipo: 'virada',
    exemplo: 'FINGIR que tô explicando pra um amigo, não pra "internet"',
    aplicacao: 'Oferecer nova forma de ver o problema'
  },
  {
    nome: 'Segredo Revelado',
    tipo: 'virada',
    exemplo: 'O que ninguém te conta é que...',
    aplicacao: 'Criar sensação de informação privilegiada'
  },
  
  // CTA (Story 4)
  {
    nome: 'Gatilho da Reciprocidade',
    tipo: 'cta',
    exemplo: 'Se isso te ajudou, manda para alguém',
    aplicacao: 'Pedir ação baseada no valor entregue'
  },
  {
    nome: 'CTA de Identificação',
    tipo: 'cta',
    exemplo: 'Manda esse Story praquele seu amigo(a) que vive falando "eu não nasci pra câmera"',
    aplicacao: 'Pedir compartilhamento com pessoa específica'
  },
  {
    nome: 'Emoji de Engajamento',
    tipo: 'cta',
    exemplo: 'Me manda 🔥 se quiser o resto dessa sequência',
    aplicacao: 'Usar emoji para facilitar resposta'
  },
  
  // BÔNUS (Story 5)
  {
    nome: 'Efeito Trailer',
    tipo: 'bonus',
    exemplo: 'Quer a parte 2? Me manda um 🔥 que eu libero!',
    aplicacao: 'Gerar antecipação para próximo conteúdo'
  },
  {
    nome: 'Promessa de Continuação',
    tipo: 'bonus',
    exemplo: 'Amanhã vou te contar o que aconteceu depois...',
    aplicacao: 'Criar expectativa para próximo post'
  },
  {
    nome: 'Curiosidade Aberta',
    tipo: 'bonus',
    exemplo: 'Mas tem um detalhe que muda tudo... (continua)',
    aplicacao: 'Deixar informação incompleta propositalmente'
  }
];

export const getRandomDevicesByType = (tipo: EngagementDevice['tipo'], count: number = 1): EngagementDevice[] => {
  const devicesByType = STORIES_10X_DEVICES.filter(device => device.tipo === tipo);
  const shuffled = devicesByType.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const buildStories10xStructure = (tema: string): string => {
  const ganchoDevice = getRandomDevicesByType('gancho', 1)[0];
  const contextoDevice = getRandomDevicesByType('contexto', 1)[0];
  const viradaDevice = getRandomDevicesByType('virada', 1)[0];
  const ctaDevice = getRandomDevicesByType('cta', 1)[0];
  const bonusDevice = getRandomDevicesByType('bonus', 1)[0];

  return `
🎯 METODOLOGIA STORIES 10X - LEANDRO LADEIRA

Tema: ${tema}

📋 ESTRUTURA OBRIGATÓRIA (5 Stories):

Story 1 (GANCHO): 
- Use ${ganchoDevice.nome}: "${ganchoDevice.exemplo}"
- Aplicação: ${ganchoDevice.aplicacao}
- Crie identificação imediata com o problema/tema

Story 2 (CONTEXTO):
- Use ${contextoDevice.nome}: "${contextoDevice.exemplo}"  
- Aplicação: ${contextoDevice.aplicacao}
- Tom conversado, sem "aulinha"

Story 3 (VIRADA):
- Use ${viradaDevice.nome}: "${viradaDevice.exemplo}"
- Aplicação: ${viradaDevice.aplicacao}
- Momento de revelação/solução

Story 4 (CTA):
- Use ${ctaDevice.nome}: "${ctaDevice.exemplo}"
- Aplicação: ${ctaDevice.aplicacao}
- Pedir ação social específica

Story 5 (BÔNUS):
- Use ${bonusDevice.nome}: "${bonusDevice.exemplo}"
- Aplicação: ${bonusDevice.aplicacao}
- Gerar antecipação/continuidade

🚨 REGRAS IMPORTANTES:
- Tom: leve, conversado, sem linguagem de professor
- Pode usar humor leve e emojis
- SEMPRE termine com CTA que gere ação social
- Numere claramente: "Story 1:", "Story 2:", etc.
- Foque em criar COMUNIDADE, não só conteúdo
- Use pelo menos 3 dispositivos de engajamento diferentes
- Evite excesso de "aulinha" - seja conversacional
`;
};
