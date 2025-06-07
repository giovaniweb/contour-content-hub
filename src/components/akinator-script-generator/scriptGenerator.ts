
import { AkinatorState, MentorProfile } from './types';
import { MENTORS, ENIGMAS } from './constants';

export const selectMentor = (answers: AkinatorState): string => {
  const { style, objective, contentType } = answers;
  
  if (style === 'humoristico' || contentType === 'bigIdea') return 'viral';
  if (style === 'direto' || objective === 'vender') return 'vendedor';
  if (style === 'emocional' || style === 'provocativo') return 'emocional';
  if (style === 'criativo' || contentType === 'video') return 'criativo';
  if (style === 'didático' || objective === 'ensinar') return 'educador';
  if (objective === 'posicionar') return 'visionario';
  
  return 'estrategista';
};

export const generateSpecificScript = (answers: AkinatorState, mentorKey: string) => {
  const mentor = MENTORS[mentorKey];
  
  // Estruturas específicas baseadas no mentor e contexto
  let gancho = "";
  let conflito = "";
  let virada = "";
  let cta = "";

  if (mentorKey === 'viral') {
    gancho = "Gente, 73% das pessoas fazem isso errado todo santo dia...";
    conflito = "E aí que mora o drama: você gasta uma fortuna achando que tá certo, mas na verdade tá sabotando tudo.";
    virada = "Descobri um truque de 30 segundos que economiza 80% do tempo e dobra o resultado.";
    cta = "Comenta AÍ embaixo se você quer que eu mostre o passo a passo!";
  } else if (mentorKey === 'vendedor') {
    gancho = "Vou te mostrar como faturar R$ 5.000 a mais este mês sem sair de casa.";
    conflito = "O problema é que 90% das pessoas tentam vender sem entender a dor real do cliente.";
    virada = "Quando você aplica a fórmula dos 3 gatilhos mentais, as vendas disparam automaticamente.";
    cta = "Clica no link da bio e garante sua vaga no treinamento gratuito que acontece hoje às 20h.";
  } else if (mentorKey === 'emocional') {
    gancho = "Essa foto mudou minha vida. E eu quero te contar por quê.";
    conflito = "Durante anos eu carreguei uma culpa que me consumia por dentro, achando que nunca seria suficiente.";
    virada = "Foi quando entendi que nossa maior fraqueza pode se tornar nossa maior força.";
    cta = "Se você também carrega algo assim, me manda uma DM. Você não está sozinho.";
  } else if (mentorKey === 'criativo') {
    gancho = "Transformei um objeto do lixo numa obra de arte que vale R$ 2.000.";
    conflito = "Vivemos numa sociedade que descarta o que poderia ser recriado com um olhar diferente.";
    virada = "Arte não está no material caro, está na visão de quem cria.";
    cta = "Marca alguém que precisa ver que criatividade não tem limite!";
  } else if (mentorKey === 'educador') {
    gancho = "Em 60 segundos você vai aprender algo que deveria ter aprendido na escola.";
    conflito = "O sistema educacional ensina fórmulas, mas esquece de ensinar como aplicar na vida real.";
    virada = "Quando você domina esse conceito, problemas complexos viram exercícios simples.";
    cta = "Salva esse post e compartilha com alguém que precisa aprender isso também!";
  } else if (mentorKey === 'visionario') {
    gancho = "Em 2030, quem não souber isso vai ficar para trás.";
    conflito = "Enquanto todos se preocupam com tendências passageiras, o futuro já está sendo construído.";
    virada = "Visão não é prever o futuro, é criar ele.";
    cta = "Me segue para não perder as próximas previsões que vão virar realidade.";
  } else { // estrategista
    gancho = "Analisei 10.000 casos e descobri o padrão que 99% ignora.";
    conflito = "Dados mostram que intuição sem estratégia leva ao fracasso em 87% dos casos.";
    virada = "Quando você segue o método baseado em evidências, o sucesso deixa de ser sorte.";
    cta = "Quer acesso à planilha com o framework completo? Link na bio.";
  }

  return { gancho, conflito, virada, cta, mentor };
};

export const generateDisneyScript = (): string => {
  return `🎬 Gancho (Era uma vez...):\nHavia uma pessoa que acreditava que tinha encontrado a solução perfeita...\n\n🎯 Conflito (Até que um dia...):\nMas descobriu que estava cometendo o mesmo erro que 90% das pessoas cometem...\n\n🔁 Virada (Então ela descobriu...):\nQuando aplicou o método dos especialistas, tudo mudou em questão de dias...\n\n📣 CTA (E eles viveram felizes...):\nAgora é sua vez de descobrir esse segredo. Me chama no direct!`;
};

export const getRandomEnigma = (): string => {
  return ENIGMAS[Math.floor(Math.random() * ENIGMAS.length)];
};
