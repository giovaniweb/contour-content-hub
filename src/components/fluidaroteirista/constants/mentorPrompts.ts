/**
 * Prompts exclusivos dos principais mentores do marketing brasileiro,
 * focados em frameworks, execução e criatividade. 
 * Cada prompt contém instruções, estrutura e exemplos.
 */

export interface MentorPrompt {
  title: string;
  mentor: string;
  description: string;
  structure: string[];
  examples: string[];
  context?: string;
  tip?: string;
}

// Pedro Sobral
export const SOBRAL_PLANNING: MentorPrompt = {
  title: "Framework de Planejamento Estratégico (by Pedro Sobral)",
  mentor: "Pedro Sobral",
  description: `Crie uma estrutura prática para planejar campanhas ou semanas de conteúdo seguindo frameworks de Sobral. Foco em cronogramas, checklist e mapeamento de temas.`,
  structure: [
    "1. Defina o objetivo central (ex: aumentar leads/lançamentos)",
    "2. Mapeie 5 grandes temas/assuntos que sustentam esse objetivo",
    "3. Transforme cada tema em subtemas (mínimo 3 por tema)",
    "4. Distribua temas/subtemas ao longo dos dias/semana/mês",
    "5. Crie checklist prático das tarefas diárias ou semanais",
    "6. Estruture o fluxo: tópico > conteúdo-base > CTA/Objetivo de cada ação"
  ],
  examples: [
    "Objetivo: Capturar 500 leads em 30 dias",
    "Tema 1: Mitos sobre Emagrecimento (Subtemas: Dietas, Exercícios, Fatores emocionais)",
    "Distribuição: Segunda - Dietas, Quarta - Exercícios, Sexta - Fatores emocionais",
    "Checklist: Gravar 1 vídeo, 3 Stories e 1 Email por tema/semana"
  ],
  context: "Ideal para criar campanhas completas e consistentes. Use frameworks e listas, nada de planejar no improviso.",
  tip: "Checklist pode ser exibido como quadro/print no conteúdo."
};

export const SOBRAL_FUNIL: MentorPrompt = {
  title: "Funil de Conteúdo Estruturado (by Pedro Sobral)",
  mentor: "Pedro Sobral",
  description: `Monte sequências lógicas de conteúdo para levar uma pessoa do desconhecimento até a compra, usando o método de funis do Sobral.`,
  structure: [
    "1. Mapeie níveis: topo, meio, fundo de funil",
    "2. Crie para cada nível: tema, conteúdo, CTA",
    "3. Deixe claro o objetivo (ex: Do engajamento ao fechamento)",
    "4. Escreva a ordem/sugestão de lançamento dos conteúdos"
  ],
  examples: [
    "Topo: Mito do Emagrecimento fácil (Conversa leve, CTA: salvar e compartilhar)",
    "Meio: Técnicas que realmente funcionam (Prova, CTA: Responder enquete)",
    "Fundo: Oferta do programa X (Oferta direta, CTA: Chamar no WhatsApp)"
  ],
  context: "Use listas. Dê exemplos em formato de pauta cronológica.",
  tip: "Inclua número de conteúdos sugeridos por etapa."
};

// Hyeser Souza
export const HYESER_VIRAL: MentorPrompt = {
  title: "Conteúdo Viral na Prática (by Hyeser Souza)",
  mentor: "Hyeser Souza",
  description: `Crie ideias e roteiros de conteúdo prático, simples de gravar com celular, altamente compartilhável, usando tendências e formatos virais.`,
  structure: [
    "1. Escolha um problema comum do seu público",
    "2. Transforme em dica rápida, desafio, ou meme (ex: trend recente ou áudio popular)",
    "3. Roteirize em frases curtas, linguagem prática, aproveite SLANGS",
    "4. Sempre inclua CTA viral: marcar amigo, usar um emoji, repostar nos stories"
  ],
  examples: [
    "Desafio: Mostre como você faz X em 30 segundos (Exemplo: 'Mostre seu problema sem mostrar seu problema')",
    "Trend: Use áudio viral 'É sobre isso' e grave sua rotina de X",
    "Emoji CTA: 'Marca alguém que PRECISA ver isso 🔥'"
  ],
  context: "Indicado para reels rápidos, trends e conteúdo do dia a dia.",
  tip: "Não repetir formato de vídeo-palestra. Sempre prático."
};

export const HYESER_DESBLOQUEIO: MentorPrompt = {
  title: "Desbloqueio de Criatividade (by Hyeser Souza)",
  mentor: "Hyeser Souza",
  description: `Ajude quem tem vergonha de começar, criando roteiro ultra fácil: conteúdo com cara de “bastidores”, erro, improviso ou só texto na tela.`,
  structure: [
    "1. Comece admitindo a dificuldade (ex: 'Eu morro de vergonha de gravar, mas...')",
    "2. Mostre como superou ou está superando",
    "3. Use só texto na tela ou grave em lugar caseiro",
    "4. CTA encorajador: desafie o seguidor a tentar também"
  ],
  examples: [
    "Texto/Tela: 'Me desafiei a postar todo dia, mesmo sem maquiagem.'",
    "Vídeo simples: 'Faço o primeiro story tremendo, mas vai assim mesmo.'",
    "Encoraje: 'Se topa o desafio, posta me marcando!'"
  ],
  context: "Ideal para desbloqueio, mostrar vulnerabilidade e humanizar o perfil.",
  tip: "Use apenas frases curtas, máximo 3 linhas por trecho."
};

// NOVO PROMPT COCA DO HYESER
export const HYESER_COCA: MentorPrompt = {
  title: "Roteiro Estratégico COCA (by Hyeser Souza)",
  mentor: "Hyeser Souza",
  description: `Você é um gerador de roteiros estratégicos para Instagram, especializado no método "COCA" (Conexão, Objeção, Crescimento, Autoridade).

Siga estas etapas para criar o roteiro perfeito:

1. Definição do público-alvo  
   - Qual o público específico desse perfil?  
   - Faixa etária, estilo de comunicação (formal/informal), interesses principais?
2. Linha editorial  
   - Quais são os temas principais abordados pelo perfil?  
   - Existe algum limite de conteúdo (o que não deve ser falado)?
3. Objetivo do conteúdo (escolha um)  
   - Conexão (gerar engajamento e relacionamento)
   - Objeção (quebrar dúvidas e gerar vendas)
   - Crescimento (atrair novos seguidores)
   - Autoridade (mostrar conhecimento e credibilidade)
4. Formato do conteúdo  
   - Carrossel (educativo, passo a passo, detalhado)
   - Vídeo/Reels (dinâmico, curto, envolvente)
   - Stories (interativo, pessoal, espontâneo)
   - Post estático (simples, direto, informativo)
5. Tom de voz desejado  
   - Educativo, sério, divertido, provocativo, pessoal ou profissional?

Com base nessas informações, crie o roteiro seguindo esta estrutura:

- Gancho inicial (atrair atenção)
- Desenvolvimento (pontos principais claros, alinhados ao objetivo)
- Chamada para ação (interação, engajamento ou conversão)

Entrega:
- Roteiro objetivo, criativo e pronto para gravar (até 40s)
- Linguagem acessível, persuasiva e envolvente.`,
  structure: [
    "Gancho inicial (atração máxima nos primeiros 3 segundos)",
    "Desenvolvimento dos pontos (clareza e alinhamento ao objetivo COCA)",
    "Chamada para ação clara (CTA para engajamento, interação ou conversão)"
  ],
  examples: [
    "Exemplo Gancho: 'Você sente que ninguém engaja nos seus posts? Dá só 3 segundos e veja o segredo!'",
    "Desenvolvimento: 'Separe seu público por faixa etária e comunique direto no interesse dele.'",
    "CTA: 'Curtiu? Salva esse post e compartilha com alguém que precisa crescer o Instagram!'"
  ],
  context: "Ideal para carrossel, vídeo curto ou stories. Estrutura obrigatória COCA.",
  tip: "Seja objetivo, criativo e entregue valor em até 40s. Use linguagem acessível e persuasiva."
};

// Paulo Cuenca
export const CUENCA_NARRATIVA_VISUAL: MentorPrompt = {
  title: "Narrativa Visual Premium (by Paulo Cuenca)",
  mentor: "Paulo Cuenca",
  description: `Roteirize um vídeo ou sequência com foco máximo em estética, direção de arte, transições, luz, som — storytelling visual poderoso para posicionamento premium.`,
  structure: [
    "1. Introdução visual forte (imagem impactante, close ou movimento de câmera)",
    "2. Contexto narrado (texto curto aliado à cena)",
    "3. Transição criativa entre cenas (pode ser efeito, corte seco, troca de roupa, objetos em movimento)",
    "4. Climax: mostrar transformação (antes/depois ou emoção poderosa)",
    "5. Fechamento: assinatura visual (logo, frase ou efeito exclusivo)"
  ],
  examples: [
    "Ex: Câmera sobe da mesa para o rosto — frase no overlay: 'Tudo começa com um detalhe.'",
    "Transição: troca de roupa usando um giro rápido.",
    "Final: close na logo com som marcante."
  ],
  context: "Formato ideal: reels, vídeos de marca, campanhas premium.",
  tip: "Sempre descreva as imagens/cenas; não descreva só o texto falado."
};

export const CUENCA_IDENTIDADE: MentorPrompt = {
  title: "Identidade Visual Consistente (by Paulo Cuenca)",
  mentor: "Paulo Cuenca",
  description: `Crie uma proposta de identidade visual para campanha, focando em paleta de cores, tipografia, elementos recorrentes, direção de arte e consistência das postagens.`,
  structure: [
    "1. Escolha 3 cores principais e 2 secundárias para usar em todos os posts",
    "2. Defina 1-2 tipografias para títulos e corpo de texto",
    "3. Elenque elementos gráficos marcantes (formas, ícones, textura)",
    "4. Sugira padrão de edição de vídeo/imagem (ex: filtro, saturação, iluminação)",
    "5. Explique como unir esses padrões em uma campanha consistente"
  ],
  examples: [
    "Ex: Paleta azul-marinho, dourado e branco. Uso de círculos e fonte serifada para títulos.",
    "Filtro sempre quente. Logo aparece no canto superior direito.",
    "Formato de fechamento: frase de efeito sempre em negrito no final."
  ],
  context: "Ideal para lançamento, rebranding, campanhas que querem gravar na memória visual.",
  tip: "Descreva a sensação visual e emocional do feed/campanha, não só specs técnicos."
};

// Ladeira Prompts já criados (Light Copy e Stories 10x)
export const LADEIRA_LIGHT_COPY: MentorPrompt = {
  title: "Light Copy (by Leandro Ladeira)",
  mentor: "Leandro Ladeira",
  description: "Criar uma copy persuasiva usando os princípios do Light Copy.",
  structure: [
    "Começo impactante (gancho, emoção, curiosidade ou conflito)",
    "Storytelling real (história curta, emocional ou engraçada)",
    "Prova concreta (resultado, print, depoimento crível)",
    "Comando claro (ação prática, CTA direto)",
    "Gatilho de expectativa (curiosidade antes da revelação)",
    "Analogias inusitadas (comparação inesperada para fixar mensagem)",
    "Bordão/frase de efeito (para repetição e fixação da ideia)"
  ],
  examples: [
    "Abertura: 'Você vai achar que eu tô mentindo, mas...'",
    "História: 'Meu pai me obrigou a trabalhar com 14 anos...'",
    "Prova: 'Nessa semana, duas alunas faturaram R$ 7.000 cada.'",
    "Comando: 'Abre o bloco de notas e anota isso aqui.'",
    "Analogia: 'Vender no perpétuo é igual ligar pra desentupidora de madrugada.'",
    "Bordão: 'Começo forte muda tudo.'"
  ],
  context: "Estilo emocional, direto, com humor e verdade.",
  tip: "Evite linguagem técnica/fria e promessas sem mostrar."
};

export const LADEIRA_STORIES_10X: MentorPrompt = {
  title: "Stories 10x (by Leandro Ladeira)",
  mentor: "Leandro Ladeira",
  description: "Criar roteiro de sequência de Stories altamente engajante, seguindo a metodologia 'Stories 10x' (Ep. 26 - Ladeira) para transformar seguidores em comunidade ativa.",
  structure: [
    "Story 1: Gancho forte + enquete/pergunta",
    "Story 2: Contexto + história pessoal/de cliente",
    "Story 3: Dilema ou ponto de virada (gatilho emocional ou surpresa)",
    "Story 4: Conclusão + CTA (compartilhar/comentar/emoji)",
    "Story extra: bônus/curiosidade ou promessa de próximo conteúdo"
  ],
  examples: [
    "Story 1: 'Você também trava quando liga a câmera? [Enquete: Sim / MUITO]'",
    "Story 2: 'Eu travava tanto que apaguei um vídeo só porque gaguejei no início 😅'",
    "Story 3: 'Mas aí eu descobri um truque simples... FINGIR que tô explicando pra um amigo.'",
    "Story 4: 'Se isso te ajudou, manda esse Story praquele amigo(a) que vive falando \"não nasci pra câmera\".'",
    "Final: 'Quer a parte 2? Me manda um 🔥 que eu libero!'"
  ],
  context: "Use no mínimo 3 dispositivos de engajamento: curiosidade, reciprocidade, efeito trailer, CTA indireto.",
  tip: "Falas curtas e adaptadas pra tela de celular."
};

// Exportar como objeto para fácil acesso por nome
export const MENTOR_PROMPTS: Record<string, MentorPrompt> = {
  SOBRAL_PLANNING,
  SOBRAL_FUNIL,
  HYESER_VIRAL,
  HYESER_DESBLOQUEIO,
  CUENCA_NARRATIVA_VISUAL,
  CUENCA_IDENTIDADE,
  LADEIRA_LIGHT_COPY,
  LADEIRA_STORIES_10X,
  HYESER_COCA
};
