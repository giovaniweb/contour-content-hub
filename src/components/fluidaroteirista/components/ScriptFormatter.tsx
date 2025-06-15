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

import LightCopyFormatter from './LightCopyFormatter';
import StandardScriptBlocksFormatter from './StandardScriptBlocksFormatter';

import {
  isLightCopy,
  cleanText,
  splitLightCopyBlocks,
  splitScriptBlocks,
} from "./utils/scriptUtils";

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

  const equipmentUsedInScript = hasEquipments
    ? script.equipamentos_utilizados.some((eq) => {
        const equipmentName =
          typeof eq === "string" ? eq : eq?.nome || "";
        return script.roteiro.toLowerCase().includes(equipmentName.toLowerCase());
      })
    : false;

  // --- Renderização do conteúdo principal do roteiro ---
  const renderScriptContent = () => {
    if (script.formato.toLowerCase() === "carrossel") {
      return <CarouselFormatter roteiro={script.roteiro} />;
    }
    if (script.formato.toLowerCase() === "stories_10x") {
      const slides = parseStories10xSlides(script.roteiro);
      return <Stories10xFormatter slides={slides} />;
    }
    if (script.formato.toLowerCase() === "post_estatico") {
      return <PostEstaticoFormatter roteiro={script.roteiro} />;
    }
    if (isLightCopy(script.roteiro, script)) {
      const blocks = splitLightCopyBlocks(script.roteiro);
      return (
        <LightCopyFormatter
          blocks={blocks}
          estimatedTime={estimatedTime}
          wordCount={wordCount}
          fullText={script.roteiro}
        />
      );
    }
    const blocks = splitScriptBlocks(script.roteiro);
    return (
      <StandardScriptBlocksFormatter
        blocks={blocks}
        estimatedTime={estimatedTime}
        wordCount={wordCount}
        fullText={script.roteiro}
      />
    );
  };

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

      {/* Equipamentos Detalhados */}
      {hasEquipments && equipmentUsedInScript && (
        <EquipmentDetails
          equipments={script.equipamentos_utilizados || []}
          roteiro={script.roteiro}
        />
      )}

      {/* Aviso de Tempo */}
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
