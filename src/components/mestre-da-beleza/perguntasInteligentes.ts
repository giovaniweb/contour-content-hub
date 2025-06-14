
// Perguntas inteligentes e indiretas, estilo Akinator real!
export type PerguntaInteligente = {
  id: string;
  texto: string;
  opcoes: string[];
  contexto: string;
  tipo: "perfil" | "nostalgia" | "emocional" | "comportamental" | "tecnica";
  ramifica?: (respostas: Record<string, string>) => string | undefined;
};

export const perguntasInteligentes: PerguntaInteligente[] = [
  {
    id: "reflexo_espelho",
    texto: "Quando você se olha no espelho de manhã, o que sente?",
    opcoes: [
      "Gostaria de melhorar algo, mas não sei o quê",
      "Me sinto bem na maior parte do tempo",
      "Tem algo específico que me incomoda",
      "Só corro pro trabalho, sem pensar nisso"
    ],
    contexto: "psicologia_corporal",
    tipo: "emocional"
  },
  {
    id: "comportamento_vestimenta",
    texto: "Você já escolheu roupas para esconder ou valorizar alguma parte do corpo?",
    opcoes: ["Sim, sempre!", "Às vezes", "Quase nunca", "Nunca pensei nisso"],
    contexto: "autoimagem_vestimenta",
    tipo: "comportamental"
  },
  {
    id: "ciclo_novidades",
    texto: "Sobre novidades de tratamentos de estética, você...",
    opcoes: [
      "Adora novidades, sempre testa o que sai",
      "Prefere tratamentos consagrados",
      "Só faz se tiver muita recomendação",
      "Prefere evitar mudanças"
    ],
    contexto: "perfil_novidade",
    tipo: "perfil"
  },
  {
    id: "impacto_social",
    texto: "Já deixou de sair, postar foto ou ir a um evento por não gostar de algo físico?",
    opcoes: [
      "Sim, várias vezes", "Só quando estou em fase ruim", "Pouco ou nunca", "Nunca, não me incomoda"
    ],
    contexto: "impacto_social_autoestima",
    tipo: "emocional"
  },
  {
    id: "sonho_beleza",
    texto: "Se pudesse realizar um desejo estético agora, seria mais próximo de...",
    opcoes: [
      "Ficar com a aparência mais jovem",
      "Redefinir alguma parte do corpo",
      "Ter pele mais uniforme ou sem manchas",
      "Outro (conto depois!)"
    ],
    contexto: "desejo_estetico",
    tipo: "perfil"
  },
  // Exemplos de perguntas de eliminação
  {
    id: "manchas_historico",
    texto: "Alguém já comentou sobre manchas, melasma ou variações de tom na sua pele?",
    opcoes: ["Sim, já", "Não", "Nunca reparei", "Prefiro não responder"],
    contexto: "melasma_manchas",
    tipo: "tecnica"
  },
  {
    id: "forca_muscular",
    texto: "Você sente que gostaria de mais força ou definição muscular?",
    opcoes: [
      "Sim, especialmente em áreas específicas",
      "Não tenho esse interesse",
      "Acho minha força suficiente"
    ],
    contexto: "musculatura",
    tipo: "tecnica"
  },
  {
    id: "tratou_rapidez",
    texto: "Quando busca um tratamento, você quer resultados rápidos ou graduais?",
    opcoes: [
      "Rápidos, mesmo que temporários",
      "Prefiro devagar porém consistente",
      "Depende do caso"
    ],
    contexto: "perfil_ritmo",
    tipo: "perfil"
  },
  // Ramificação: se o usuário responde "Sim" sobre vestimenta, aprofunda
  {
    id: "zona_problematicas",
    texto: "Tem alguma área que costuma esconder (rosto, braços, abdomen, etc)?",
    opcoes: ["Rosto", "Abdomen", "Braços/Costas", "Pernas", "Não costumo esconder"],
    contexto: "zona_problematica",
    tipo: "comportamental",
    ramifica: (respostas) =>
      respostas.autoimagem_vestimenta && respostas.autoimagem_vestimenta.includes("Sempre")
        ? "zona_problematicas" : undefined
  }
  // ... Adicione ainda mais para outras especialidades!
];
