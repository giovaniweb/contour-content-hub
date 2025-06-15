import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CarouselFormatter from './CarouselFormatter';
import Stories10xFormatter from './Stories10xFormatter';
import PostEstaticoFormatter from './PostEstaticoFormatter';
import ScriptMetrics from './ScriptMetrics';
import EquipmentStatus from './EquipmentStatus';
import DisneyMagicIndicator from './DisneyMagicIndicator';
import EquipmentDetails from './EquipmentDetails';
import TimeWarning from './TimeWarning';
import CopyButton from '@/components/ui/CopyButton';
import { parseStories10xSlides } from '../utils/stories10xParser';
import { MessageSquare, Clock, AudioWaveform } from "lucide-react";

interface ScriptFormatterProps {
  script: {
    roteiro: string;
    formato: string;
    emocao_central: string;
    intencao: string;
    objetivo: string;
    mentor: string;
    equipamentos_utilizados?: any[];
    disney_applied?: boolean;
  };
}

const TITLES = [
  "Gancho", 
  "Erro", 
  "Virada", 
  "CTA", 
  "Dispositivo", 
  "Chamada para Ação",
  "Introdução"
];

// Lista nova de títulos para identificar blocos (ajustado para seu padrão!)
const SCRIPT_BLOCK_TITLES = [
  "Ganho",
  "Desenvolvimento",
  "Solução",
  "CTA"
];

// Novos títulos e descrições do framework Light Copy de Ladeira
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
  }
];

// Função para separar o texto em blocos usando os títulos conhecidos
function splitByTitles(text: string) {
  // Regex: encontra títulos no início de linha (inclusive com pontuação).
  const regex = new RegExp(`^(${TITLES.join('|')})[:：-]?\\s*`, 'im');

  // 1. Encontra todos títulos para divisão
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  const sections: { titulo: string | null, conteudo: string }[] = [];
  let currentTitle: string | null = null;
  let buffer = [];

  for (let line of lines) {
    const match = line.match(/^([A-Za-zÀ-ÿ\s]+)[:：-]\\s*/);
    const rawTitle = match && TITLES.includes(match[1].trim());
    if (rawTitle) {
      // Salva o bloco anterior
      if (buffer.length > 0) {
        sections.push({
          titulo: currentTitle,
          conteudo: buffer.join('\n').trim()
        });
        buffer = [];
      }
      currentTitle = match![1].trim();
      line = line.replace(/^([A-Za-zÀ-ÿ\s]+)[:：-]\\s*/, '');
    }
    buffer.push(line);
  }

  // Último bloco
  if (buffer.length) {
    sections.push({
      titulo: currentTitle,
      conteudo: buffer.join('\n').trim()
    });
  }

  // Se nada foi identificado, retorna tudo junto sem título
  if (sections.length === 1 && !sections[0].titulo) {
    return [
      { titulo: null, conteudo: text }
    ];
  }
  return sections;
}

// Função para separar blocos conforme títulos customizados
function splitScriptBlocks(text: string) {
  // Regex pega títulos no início de linha seguidos de ":" com ou sem espaços extras
  const regex = /^([A-Za-zÀ-ÿçÇ\s]+)\s*:\s*/;
  const lines = text.split(/\r?\n/);

  const blocks: { titulo: string, conteudo: string }[] = [];
  let currentTitle: string | null = null;
  let buffer: string[] = [];

  for (let line of lines) {
    const match = line.match(regex);
    const title = match && SCRIPT_BLOCK_TITLES.includes(match[1].trim()) ? match[1].trim() : null;

    if (title) {
      // Salva o bloco anterior
      if (currentTitle && buffer.length > 0) {
        blocks.push({ titulo: currentTitle, conteudo: buffer.join('\n').trim() });
        buffer = [];
      }
      currentTitle = title;
      // Remove o título + ":" da linha antes de adicionar ao buffer
      line = line.replace(regex, "");
    }
    // Só adiciona ao buffer se estamos dentro de um bloco reconhecido
    if (currentTitle) {
      buffer.push(line);
    }
  }

  // Adiciona último bloco
  if (currentTitle && buffer.length > 0) {
    blocks.push({ titulo: currentTitle, conteudo: buffer.join('\n').trim() });
  }

  return blocks.length > 0
    ? blocks
    : [{ titulo: "", conteudo: text }];
}

// Função para detectar Light Copy
function isLightCopy(roteiro: string, script: any) {
  const mentor = ("" + (script.mentor || "")).toLowerCase();
  const formato = ("" + (script.formato || "")).toLowerCase();
  return formato.includes("light") || mentor.includes("ladeira");
}

// Novo parser para Light Copy
function splitLightCopyBlocks(text: string) {
  // Usar regex para identificar blocos pelos possíveis títulos
  const sections: { titulo: string, conteudo: string, descricao: string, emoji: string }[] = [];
  let remaining = text;
  const possibleTitles = [
    "Gancho", "Storytelling", "Prova", "Comando", "Gatilho", "Analogia", "Bordão"
  ];

  for (const step of LIGHT_COPY_STEPS) {
    const regex = new RegExp(`${step.titulo}|${step.titulo.split(" ")[0]}`, "i");
    const match = remaining.match(regex);
    if (match) {
      // Separar bloco atual
      const [before, ...rest] = remaining.split(match[0]);
      if (before.trim() && sections.length === 0) {
        // Pega intro se o texto antes do primeiro bloco for relevante
        sections.push({
          titulo: "Introdução",
          conteudo: before.trim(),
          emoji: "📝",
          descricao: "Introdução ao texto"
        });
      }
      const nextParts = rest.join(match[0]);
      // Conteúdo do bloco vai até próxima palavra-chave ou fim do texto
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
        descricao: step.descricao
      });
      remaining = nextParts.slice(nextMatchIdx);
    }
  }
  // Se sobrou texto, adiciona como encerramento
  if (remaining && remaining.trim().length > 5) {
    sections.push({
      titulo: "Finalização",
      conteudo: remaining.trim(),
      emoji: "🏁",
      descricao: "Fechamento do roteiro"
    });
  }

  // Se o parser não conseguiu, retorna bloco único
  return sections.length > 0 ? sections : [{ titulo: "Roteiro", conteudo: text, emoji: "🎬", descricao: "" }];
}

const ScriptFormatter: React.FC<ScriptFormatterProps> = ({ script }) => {
  const estimateReadingTime = (text: string): number => {
    const words = text.split(/\s+/).length;
    return Math.round((words / 150) * 60); // 150 palavras/minuto
  };

  const estimatedTime = estimateReadingTime(script.roteiro);
  const isWithinTimeLimit = estimatedTime <= 60;
  const wordCount = script.roteiro.split(/\s+/).length;
  const hasEquipments = script.equipamentos_utilizados && script.equipamentos_utilizados.length > 0;

  // Verificar se equipamentos foram realmente utilizados no roteiro
  const equipmentUsedInScript = hasEquipments ? 
    script.equipamentos_utilizados.some(eq => {
      const equipmentName = typeof eq === 'string' ? eq : (eq?.nome || '');
      return script.roteiro.toLowerCase().includes(equipmentName.toLowerCase());
    }) : false;

  // Pequena função de sanitização do texto para evitar quebras e espaços repetidos
  function cleanText(text: string) {
    if (!text) return "";
    // Remove espaços em branco antes/depois das linhas, elimina linhas em branco duplicadas
    let cleaned = text.trim().replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
    // Remove espaços extras no começo/fim do bloco
    cleaned = cleaned.replace(/^[ \t]+|[ \t]+$/gm, '');
    return cleaned;
  }

  // --- RENDER PADRÃO DOS BLOCOS ---
  const renderScriptContent = () => {
    if (script.formato.toLowerCase() === 'carrossel') {
      return <CarouselFormatter roteiro={script.roteiro} />;
    }

    if (script.formato.toLowerCase() === 'stories_10x') {
      const slides = parseStories10xSlides(script.roteiro);
      return <Stories10xFormatter slides={slides} />;
    }

    if (script.formato.toLowerCase() === 'post_estatico') {
      return <PostEstaticoFormatter roteiro={script.roteiro} />;
    }

    // Se for Light Copy, realçar o framework de Ladeira
    if (isLightCopy(script.roteiro, script)) {
      const blocks = splitLightCopyBlocks(script.roteiro);

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <Card className="aurora-glass border border-cyan-500/30 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-aurora-electric-purple/10 via-aurora-neon-blue/10 to-aurora-soft-pink/5 opacity-40 pointer-events-none" />
            <CardHeader className="flex flex-col items-center z-10 relative pb-2">
              <div className="flex items-center gap-3 justify-center mb-2">
                <MessageSquare className="h-8 w-8 text-yellow-300 aurora-glow" />
                <CardTitle className="text-yellow-200 text-center text-2xl drop-shadow aurora-heading">
                  Light Copy (Ladeira)
                </CardTitle>
              </div>
              <div className="flex gap-4 items-center justify-center mt-2">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-blue-200 font-semibold">~{estimatedTime}s</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
                  <AudioWaveform className="h-4 w-4 text-pink-400" />
                  <span className="text-xs text-pink-200 font-semibold">Áudio</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
                  <span className="font-mono text-xs text-purple-200">{wordCount} palavras</span>
                </div>
                <CopyButton
                  text={script.roteiro}
                  successMessage="Roteiro copiado!"
                  className="ml-2"
                  position="relative"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 px-5 pb-7 relative z-10">
              <div className="relative w-full flex flex-col items-center text-center gap-6">
                <div className="w-full flex flex-col items-center gap-2">
                  <h3 className="text-yellow-300 text-lg font-bold tracking-wide aurora-heading mb-1">
                    ✨ Light Copy Framework por Ladeira
                  </h3>
                  <p className="text-xs text-yellow-100 mb-2">
                    Estrutura baseada no método original de Leandro Ladeira
                  </p>
                </div>
                <div className="w-full border-t border-aurora-electric-purple/20 my-2" />
                {/* Renderização por bloco Light Copy */}
                <div className="relative bg-slate-900/80 px-1 py-4 rounded-2xl shadow-inner aurora-glass border-aurora-neon-blue/10 w-full max-w-2xl mx-auto flex flex-col gap-6">
                  {blocks.map((block, i) => (
                    <div
                      key={i}
                      className="mb-5 last:mb-0 overflow-hidden p-0 sm:p-4 rounded-xl bg-gradient-to-tr from-yellow-300/10 via-white/0 to-aurora-neon-blue/5 border border-yellow-300/20 shadow"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-lg aurora-heading text-yellow-300 drop-shadow">{block.emoji}</span>
                        <span className="text-lg font-semibold aurora-heading text-yellow-200">{block.titulo}</span>
                        <div className="flex-1 border-t border-yellow-100/10 ml-2" />
                      </div>
                      {block.descricao &&
                        <div className="text-xs text-yellow-100/80 mb-2 italic">{block.descricao}</div>}
                      <div
                        className="
                          text-left
                          text-slate-100
                          text-base md:text-lg
                          leading-relaxed
                          aurora-body
                          font-medium
                          whitespace-pre-line
                          rounded-md
                          px-2 py-2
                        "
                      >
                        {cleanText(block.conteudo)
                          .split(/\n{2,}/)
                          .map((paragraph, idx) => (
                            <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full flex justify-center pt-4 gap-2">
                <button
                  className="flex items-center gap-1 px-5 py-2 rounded-lg bg-yellow-500/90 hover:bg-yellow-400/90 text-white font-semibold shadow transition-all text-base disabled:opacity-60"
                  disabled
                  title="Funcionalidade futura"
                >
                  <AudioWaveform className="h-5 w-5 animate-pulse text-white" />
                  Ouvir Áudio
                  <span className="ml-1 text-xs text-white/70">(em breve)</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    // Render padrão separado em blocos com destaque visual
    const blocks = splitScriptBlocks(script.roteiro);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="aurora-glass border border-cyan-500/30 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-aurora-electric-purple/10 via-aurora-neon-blue/10 to-aurora-soft-pink/5 opacity-40 pointer-events-none" />
          <CardHeader className="flex flex-col items-center z-10 relative pb-2">
            <div className="flex items-center gap-3 justify-center mb-2">
              <MessageSquare className="h-8 w-8 text-aurora-electric-purple aurora-glow" />
              <CardTitle className="text-cyan-300 text-center text-2xl drop-shadow aurora-heading">
                Fala do Roteiro
              </CardTitle>
            </div>
            <div className="flex gap-4 items-center justify-center mt-2">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-blue-200 font-semibold">~{estimatedTime}s</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
                <AudioWaveform className="h-4 w-4 text-pink-400" />
                <span className="text-xs text-pink-200 font-semibold">Áudio</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
                <span className="font-mono text-xs text-purple-200">{wordCount} palavras</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 px-5 pb-7 relative z-10">
            <div className="relative w-full flex flex-col items-center text-center gap-6">
              <div className="w-full flex flex-col items-center gap-2">
                <h3 className="text-aurora-electric-purple text-lg font-bold tracking-wide aurora-heading mb-1">
                  🎬 Fala do Roteiro
                </h3>
                <div className="flex gap-2 justify-center items-center">
                  <span className="flex items-center gap-2 rounded-md px-2 py-1 bg-aurora-neon-blue/10 text-blue-200 text-xs font-semibold">
                    <Clock className="h-4 w-4 text-blue-400" />
                    {estimatedTime}s
                  </span>
                  <span className="flex items-center gap-2 rounded-md px-2 py-1 bg-aurora-soft-pink/10 text-pink-200 text-xs font-semibold">
                    <AudioWaveform className="h-4 w-4 text-pink-400" />
                    Áudio
                  </span>
                  <span className="flex items-center gap-2 rounded-md px-2 py-1 bg-aurora-electric-purple/10 text-purple-200 text-xs font-mono">
                    {wordCount} palavras
                  </span>
                  <CopyButton
                    text={script.roteiro}
                    successMessage="Roteiro copiado!"
                    className="ml-2"
                    position="relative"
                  />
                </div>
              </div>
              <div className="w-full border-t border-aurora-electric-purple/20 my-2" />
              {/* Bloco central com cada seção separada */}
              <div className="relative bg-slate-900/80 px-0 py-6 rounded-2xl shadow-inner aurora-glass border-aurora-neon-blue/10 min-h-[180px] w-full max-w-2xl mx-auto flex flex-col gap-8">
                {blocks.map((block, i) => (
                  <div
                    key={i}
                    className="mb-6 last:mb-0 p-0 sm:p-5 rounded-xl"
                  >
                    {block.titulo && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-bold text-lg aurora-heading text-aurora-electric-purple">
                          {block.titulo === "Ganho" && "🎯"}
                          {block.titulo === "Desenvolvimento" && "💡"}
                          {block.titulo === "Solução" && "🔬"}
                          {block.titulo === "CTA" && "🚀"}
                          {" "}{block.titulo}
                        </span>
                        <div className="flex-1 border-t border-aurora-neon-blue/20 ml-2" />
                      </div>
                    )}
                    {/* MELHORIA DO BLOCO DE TEXTO */}
                    <div
                      className="
                        text-left
                        text-slate-100
                        text-base md:text-lg
                        leading-relaxed
                        aurora-body
                        font-medium
                        whitespace-pre-line
                        rounded-lg
                        bg-slate-800/30
                        border border-aurora-neon-blue/10
                        shadow
                        px-5 py-4
                        transition
                        duration-200
                        hover:bg-aurora-neon-blue/10
                        "
                      style={{
                        marginBottom: 0,
                      }}
                    >
                      {cleanText(block.conteudo)
                        .split(/\n{2,}/)
                        .map((paragraph, idx) => (
                          <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex justify-center pt-4 gap-2">
              <button
                className="flex items-center gap-1 px-5 py-2 rounded-lg bg-aurora-electric-purple/90 hover:bg-aurora-emerald/80 text-white font-semibold shadow transition-all text-base disabled:opacity-60"
                disabled
                title="Funcionalidade futura"
              >
                <AudioWaveform className="h-5 w-5 animate-pulse text-white" />
                Ouvir Áudio
                <span className="ml-1 text-xs text-white/70">(em breve)</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Stories 10x também não precisa de contagem de tempo (formato estático)
  const showTimeMetric = !['post_estatico', 'carrossel', 'stories_10x'].includes(script.formato.toLowerCase());

  return (
    <div className="space-y-6 w-full">
      {/* Conteúdo Principal do Roteiro */}
      {renderScriptContent()}

      {/* Métricas Básicas */}
      <ScriptMetrics
        estimatedTime={estimatedTime}
        isWithinTimeLimit={isWithinTimeLimit}
        wordCount={wordCount}
        emocao_central={script.emocao_central}
        formato={script.formato}
        showTime={showTimeMetric}
      />

      {/* Disney Magic Badge */}
      <DisneyMagicIndicator disneyApplied={script.disney_applied || false} />

      {/* Equipamentos Detalhados - Mostrar apenas se houver equipamentos utilizados */}
      {hasEquipments && equipmentUsedInScript && (
        <EquipmentDetails
          equipments={script.equipamentos_utilizados || []}
          roteiro={script.roteiro}
        />
      )}

      {/* Aviso de Tempo - Apenas para formatos com tempo */}
      {showTimeMetric && (
        <TimeWarning
          isWithinTimeLimit={isWithinTimeLimit}
          estimatedTime={estimatedTime}
        />
      )}
    </div>
  );
};

export default ScriptFormatter;
