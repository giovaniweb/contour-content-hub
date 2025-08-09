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
import ReelsTipsCard from "./ReelsTipsCard";
import ReelsActionFooter from "./ReelsActionFooter";
import AuroraActionFooter from "./AuroraActionFooter";
import ScriptFlowFormatter from "./ScriptFlowFormatter";
import MediaSuggestions from "./MediaSuggestions";
import ImprovedReelsFormatter from "./ImprovedReelsFormatter";
import ArticleFormatter from './ArticleFormatter';
import LongVideoFormatter from './LongVideoFormatter';

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
  onApproveScript?: () => void;
  onImproveScript?: () => void;
  onNewScript?: () => void;
  onGenerateImage?: () => void;
  onGenerateAudio?: () => void;
  isGeneratingAudio?: boolean;
  isGeneratingImage?: boolean;
}

// Remova todas as implementações locais das funções utilitárias (mantendo somente imports!)
const ScriptFormatter: React.FC<ScriptFormatterProps> = ({
  script,
  onApproveScript,
  onImproveScript,
  onNewScript,
  onGenerateImage,
  onGenerateAudio,
  isGeneratingAudio = false,
  isGeneratingImage = false
}) => {
  const estimateReadingTime = (text: string): number => {
    const words = text.split(/\s+/).length;
    return Math.round((words / 150) * 60); // 150 palavras/minuto
  };

  const estimatedTime = estimateReadingTime(script.roteiro);
  const isWithinTimeLimit = estimatedTime >= 30 && estimatedTime <= 45;
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

    // Article
    if (formato.includes('artigo') || formato.includes('article')) {
      const ArticleFormatter = require('./ArticleFormatter').default;
      return (
        <div className="space-y-4">
          <ArticleFormatter roteiro={script.roteiro} />
        </div>
      );
    }

    // Vídeo Longo
    if (formato.includes('video_longo') || formato.includes('vídeo longo') || (formato.includes('video') && !formato.includes('reels'))) {
      const LongVideoFormatter = require('./LongVideoFormatter').default;
      return (
        <div className="space-y-4">
          <LongVideoFormatter roteiro={script.roteiro} />
        </div>
      );
    }

    // REELS: layout minimalista com OFF limpo (sem cards/caixas)
    if (formato.includes('reels')) {
      return (
        <div className="space-y-4">
          <ImprovedReelsFormatter 
            roteiro={script.roteiro} 
            estimatedTime={estimatedTime}
          />
          <MediaSuggestions 
            format={formato} 
            estimatedTime={estimatedTime}
          />
        </div>
      );
    }

    if (formato === "carrossel") {
      return (
        <div className="space-y-4">
          <CarouselFormatter roteiro={script.roteiro} />
          <MediaSuggestions 
            format={formato} 
            estimatedTime={estimatedTime}
          />
        </div>
      );
    }
    if (formato === "stories_10x") {
      const slides = parseStories10xSlides(script.roteiro);
      return (
        <div className="space-y-4">
          <Stories10xFormatter slides={slides} />
          <MediaSuggestions 
            format={formato} 
            estimatedTime={estimatedTime}
          />
        </div>
      );
    }
    if (formato === "post_estatico") {
      return (
        <div className="space-y-4">
          <PostEstaticoFormatter roteiro={script.roteiro} />
          <MediaSuggestions 
            format={formato} 
            estimatedTime={estimatedTime}
          />
        </div>
      );
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
      <div className="space-y-4">
        <ParagraphBoxFormatter blocks={blocks} />
        <MediaSuggestions 
          format={formato || 'artigo'} 
          estimatedTime={estimatedTime}
        />
      </div>
    );
  };

  const showTimeMetric = !['post_estatico', 'carrossel', 'stories_10x'].includes((script.formato || "").toLowerCase());

  const isReels = (script.formato || "").toLowerCase() === "reels";

  // HANDLERS: Coloque aqui a lógica real dos handlers, conecte via props do FluidaScriptResults se desejar.
  const handleApproveScript = () => {
    // Placeholder: colocar lógica de aprovação real aqui
    console.log("[ReelsActionFooter] Aprovar roteiro");
  };
  const handleImproveScript = () => {
    // Placeholder: colocar lógica de melhoria real aqui
    console.log("[ReelsActionFooter] Melhorar roteiro");
  };
  const handleNewScript = () => {
    // Placeholder: colocar lógica de novo roteiro real aqui
    console.log("[ReelsActionFooter] Novo roteiro");
  };
  const handleGenerateAudio = () => {
    // Placeholder: colocar lógica de geração de áudio real aqui
    console.log("[ReelsActionFooter] Gerar áudio");
  };

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
      
      {/* Dicas Aurora para REELS */}
      {isReels && (
        <ReelsTipsCard />
      )}

      {/* Rodapé de ações Aurora — agora mostrado SEMPRE */}
      <AuroraActionFooter
        onApproveScript={onApproveScript}
        onImproveScript={onImproveScript}
        onNewScript={onNewScript}
        onGenerateImage={onGenerateImage}
        onGenerateAudio={(script.formato || "").toLowerCase().includes('reels') || (script.formato || "").toLowerCase().includes('stories') || (script.formato || "").toLowerCase().includes('video') ? onGenerateAudio : undefined)
        isGeneratingAudio={isGeneratingAudio}
        isGeneratingImage={isGeneratingImage}
      />
    </div>
  );
};

export default ScriptFormatter;
