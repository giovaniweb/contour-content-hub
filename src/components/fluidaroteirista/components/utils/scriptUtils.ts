
/**
 * Utilitários para parsing e limpeza de roteiros do FluidaRoteirista.
 */
const TITLES = [
  "Gancho",
  "Erro",
  "Virada",
  "CTA",
  "Dispositivo",
  "Chamada para Ação",
  "Introdução",
];

const SCRIPT_BLOCK_TITLES = [
  "Ganho",
  "Desenvolvimento",
  "Solução",
  "CTA",
];

const LIGHT_COPY_STEPS = [
  {
    key: "gancho",
    titulo: "Gancho Impactante",
    emoji: "🎯",
    descricao: "Chame a atenção logo de cara para prender quem lê.",
  },
  {
    key: "storytelling",
    titulo: "Storytelling Real",
    emoji: "📖",
    descricao: "Conte uma história curta, com emoção ou humor.",
  },
  {
    key: "prova",
    titulo: "Prova Concreta",
    emoji: "🧾",
    descricao: "Traga resultados, prints ou depoimentos que geram confiança.",
  },
  {
    key: "comando",
    titulo: "Comando Claro",
    emoji: "👉",
    descricao: "Dê uma ordem prática para a pessoa fazer algo agora.",
  },
  {
    key: "gatilho",
    titulo: "Gatilho de Expectativa",
    emoji: "⏳",
    descricao: "Crie curiosidade antes da revelação.",
  },
  {
    key: "analogia",
    titulo: "Analogia Inusitada",
    emoji: "💡",
    descricao: "Compare com algo inesperado para fixar a mensagem.",
  },
  {
    key: "bordao",
    titulo: "Bordão/Frase de Efeito",
    emoji: "🔁",
    descricao: "Finalize com frase memorável para fixar a ideia.",
  },
];

/** Limpa quebras e espaços indesejados do texto original */
export function cleanText(text: string) {
  if (!text) return "";
  let cleaned = text.trim().replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  cleaned = cleaned.replace(/^[ \t]+|[ \t]+$/gm, "");
  return cleaned;
}

/** Separa roteiro em blocos principais por títulos conhecidos */
export function splitByTitles(text: string) {
  const regex = new RegExp(`^(${TITLES.join("|")})[:：-]?\\s*`, "im");
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  const sections: { titulo: string | null; conteudo: string }[] = [];
  let currentTitle: string | null = null;
  let buffer = [];

  for (let line of lines) {
    const match = line.match(/^([A-Za-zÀ-ÿ\s]+)[:：-]\s*/);
    const rawTitle = match && TITLES.includes(match[1].trim());
    if (rawTitle) {
      if (buffer.length > 0) {
        sections.push({
          titulo: currentTitle,
          conteudo: buffer.join("\n").trim(),
        });
        buffer = [];
      }
      currentTitle = match![1].trim();
      line = line.replace(/^([A-Za-zÀ-ÿ\s]+)[:：-]\s*/, "");
    }
    buffer.push(line);
  }
  if (buffer.length) {
    sections.push({
      titulo: currentTitle,
      conteudo: buffer.join("\n").trim(),
    });
  }
  if (sections.length === 1 && !sections[0].titulo) {
    return [{ titulo: null, conteudo: text }];
  }
  return sections;
}

/** Separa roteiro em blocos padrão (Ganho|Desenvolvimento|Solução|CTA) */
export function splitScriptBlocks(text: string) {
  const regex = /^([A-Za-zÀ-ÿçÇ\s]+)\s*:\s*/;
  const lines = text.split(/\r?\n/);

  const blocks: { titulo: string; conteudo: string }[] = [];
  let currentTitle: string | null = null;
  let buffer: string[] = [];

  for (let line of lines) {
    const match = line.match(regex);
    const title = match && SCRIPT_BLOCK_TITLES.includes(match[1].trim())
      ? match[1].trim()
      : null;

    if (title) {
      if (currentTitle && buffer.length > 0) {
        blocks.push({ titulo: currentTitle, conteudo: buffer.join("\n").trim() });
        buffer = [];
      }
      currentTitle = title;
      line = line.replace(regex, "");
    }
    if (currentTitle) buffer.push(line);
  }
  if (currentTitle && buffer.length > 0) {
    blocks.push({ titulo: currentTitle, conteudo: buffer.join("\n").trim() });
  }
  return blocks.length > 0 ? blocks : [{ titulo: "", conteudo: text }];
}

/** Detecta se é Light Copy (mentor ladeira ou formato light) */
export function isLightCopy(roteiro: string, script: any) {
  const mentor = ("" + (script.mentor || "")).toLowerCase();
  const formato = ("" + (script.formato || "")).toLowerCase();
  return formato.includes("light") || mentor.includes("ladeira");
}

/** Parser para o framework Light Copy */
export function splitLightCopyBlocks(text: string) {
  const sections: { titulo: string; conteudo: string; descricao: string; emoji: string }[] = [];
  let remaining = text;
  const possibleTitles = [
    "Gancho",
    "Storytelling",
    "Prova",
    "Comando",
    "Gatilho",
    "Analogia",
    "Bordão",
  ];

  for (const step of LIGHT_COPY_STEPS) {
    const regex = new RegExp(`${step.titulo}|${step.titulo.split(" ")[0]}`, "i");
    const match = remaining.match(regex);
    if (match) {
      const [before, ...rest] = remaining.split(match[0]);
      if (before.trim() && sections.length === 0) {
        sections.push({
          titulo: "Introdução",
          conteudo: before.trim(),
          emoji: "📝",
          descricao: "Introdução ao texto",
        });
      }
      const nextParts = rest.join(match[0]);
      let nextMatchIdx = nextParts.length;
      for (const next of possibleTitles) {
        const nextIdx = nextParts.search(new RegExp(next, "i"));
        if (nextIdx > -1 && nextIdx < nextMatchIdx) nextMatchIdx = nextIdx;
      }
      const conteudo = nextParts.substring(0, nextMatchIdx).trim();
      sections.push({
        titulo: step.titulo,
        conteudo,
        emoji: step.emoji,
        descricao: step.descricao,
      });
      remaining = nextParts.slice(nextMatchIdx);
    }
  }
  if (remaining && remaining.trim().length > 5) {
    sections.push({
      titulo: "Finalização",
      conteudo: remaining.trim(),
      emoji: "🏁",
      descricao: "Fechamento do roteiro",
    });
  }
  return sections.length > 0
    ? sections
    : [
        {
          titulo: "Roteiro",
          conteudo: text,
          emoji: "🎬",
          descricao: "",
        },
      ];
}

export {
  TITLES,
  SCRIPT_BLOCK_TITLES,
  LIGHT_COPY_STEPS
};
