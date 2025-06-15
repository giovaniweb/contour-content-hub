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
import ParagraphBoxFormatter from './ParagraphBoxFormatter';
import { parseTemporalScript } from "../utils/parseTemporalScript";
import TemporalScriptBlock from "./TemporalScriptBlock";

// Utilize apenas os utilitários importados, sem duplicidade local
import {
  isLightCopy,
  cleanText,
  splitLightCopyBlocks,
  splitScriptBlocks,
} from "./utils/scriptUtils";

// As listas de dados são apenas exportadas por questão de exibição/descritiva
// Se precisar delas no componente, mantenha apenas assim:
const TITLES = [
  "Gancho", 
  "Erro", 
  "Virada", 
  "CTA", 
  "Dispositivo", 
  "Chamada para Ação",
  "Introdução"
];
const SCRIPT_BLOCK_TITLES = [
  "Ganho",
  "Desenvolvimento",
  "Solução",
  "CTA"
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
  }
];

// Adicionando explicitamente a interface que faltava
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

// Remova todas as implementações locais das funções utilitárias (mantendo somente imports!)
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
    const formato = (script.formato || "").toLowerCase();

    // MELHORIA: Visualização especial para Reels (roteiro temporal)
    if (formato === "reels") {
      const blocks = parseTemporalScript(script.roteiro);
      return (
        <div className="space-y-1">
          {blocks.map((block, i) => (
            <TemporalScriptBlock
              key={i}
              time={block.time}
              label={block.label}
              content={block.content}
              index={i}
            />
          ))}
        </div>
      );
    }
    if (formato === "carrossel") {
      return <CarouselFormatter roteiro={script.roteiro} />;
    }
    if (formato === "stories_10x") {
      const slides = parseStories10xSlides(script.roteiro);
      return <Stories10xFormatter slides={slides} />;
    }
    if (formato === "post_estatico") {
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
    return <ParagraphBoxFormatter blocks={blocks} />;
  };

  const showTimeMetric = !['post_estatico', 'carrossel', 'stories_10x'].includes((script.formato || "").toLowerCase());

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
